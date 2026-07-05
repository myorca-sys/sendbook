import postgres from "postgres"

const STORE_PAGE = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sendbook</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    :root { --bg:#fafafa;--surface:#fff;--text:#18181b;--text-dim:#71717a;--border:#e4e4e7;--primary:#6366f1;--green:#22c55e; }
    * { margin:0; padding:0; box-sizing:border-box; }
    body { font-family:'Inter',sans-serif; background:var(--bg); color:var(--text); min-height:100vh; }
    .header { background:var(--surface); border-bottom:1px solid var(--border); padding:1.5rem 1rem; text-align:center; }
    .header h1 { font-size:1.5rem; font-weight:700; margin-bottom:.25rem; }
    .header p { color:var(--text-dim); font-size:.875rem; max-width:400px; margin:0 auto; line-height:1.5; }
    .header-info { display:flex; justify-content:center; gap:1rem; margin-top:.75rem; font-size:.8rem; flex-wrap:wrap; }
    .header-info a { color:var(--primary); text-decoration:none; }
    .products { max-width:640px; margin:0 auto; padding:1rem; display:flex; flex-direction:column; gap:.75rem; }
    .product { background:var(--surface); border:1px solid var(--border); border-radius:12px; padding:1rem; display:flex; gap:1rem; align-items:center; }
    .product-image { width:80px; height:80px; border-radius:8px; background:#f4f4f5; flex-shrink:0; overflow:hidden; display:flex; align-items:center; justify-content:center; font-size:1.5rem; }
    .product-image img { width:100%; height:100%; object-fit:cover; }
    .product-info { flex:1; min-width:0; }
    .product-info h3 { font-size:1rem; font-weight:600; margin-bottom:.2rem; }
    .product-info .desc { font-size:.8rem; color:var(--text-dim); display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden; }
    .product-info .meta { display:flex; align-items:center; gap:.5rem; margin-top:.3rem; }
    .product-info .price { font-weight:700; font-size:1rem; }
    .product-info .category { font-size:.7rem; color:var(--primary); background:#eef2ff; padding:.15rem .5rem; border-radius:99px; }
    .whatsapp-btn { display:inline-flex; align-items:center; gap:.4rem; background:var(--green); color:#fff; font-size:.8rem; font-weight:600; padding:.5rem 1rem; border-radius:30px; text-decoration:none; white-space:nowrap; }
    .whatsapp-btn:hover { opacity:.9; }
    .loading { text-align:center; padding:3rem; color:var(--text-dim); }
    .error { text-align:center; padding:3rem; color:#ef4444; }
    footer { text-align:center; padding:1.5rem; font-size:.75rem; color:var(--text-dim); }
    @media (max-width:480px) { .product-image { width:64px; height:64px; } }
  </style>
</head>
<body>
  <div id="header" class="header"><div class="loading">Memuat...</div></div>
  <div id="products" class="products"></div>
  <footer>Powered by Sendbook</footer>
  <script>
    async function main() {
      const slug = location.pathname.split('/').pop();
      const url = location.origin;
      const h = document.getElementById('header'), c = document.getElementById('products');
      try {
        const [sr, pr] = await Promise.all([fetch(url+'/api/stores/'+slug), fetch(url+'/api/stores/'+slug+'/products')]);
        if (!sr.ok) { h.innerHTML='<div class="error">Toko tidak ditemukan</div>'; return; }
        const store = await sr.json(), products = pr.ok ? await pr.json() : [];
        document.title = store.name+' — Sendbook';
        h.innerHTML = '<h1>'+store.name+'</h1>'+(store.description?'<p>'+store.description+'</p>':'')+
          '<div class="header-info">'+(store.whatsapp?'<a href="https://wa.me/'+store.whatsapp+'" target="_blank">&#128222; '+store.whatsapp+'</a>':'')+
          (store.address?'<span>&#128205; '+store.address+'</span>':'')+'</div>';
        if (!products.length) { c.innerHTML='<p style="text-align:center;color:var(--text-dim);padding:2rem;">Belum ada produk.</p>'; return; }
        c.innerHTML = products.map(p => {
          const price = 'Rp'+p.price.toLocaleString('id-ID');
          return '<div class="product"><div class="product-image">'+(p.images?.[0]?'<img src="'+p.images[0]+'" alt="'+p.name+'" loading="lazy" />':'📦')+'</div>'+
            '<div class="product-info"><h3>'+p.name+'</h3>'+(p.description?'<p class="desc">'+p.description+'</p>':'')+
            '<div class="meta"><span class="price">'+price+'</span>'+(p.category?'<span class="category">'+p.category+'</span>':'')+'</div></div>'+
            '<a class="whatsapp-btn" href="https://wa.me/'+store.whatsapp+'?text='+encodeURIComponent('Halo, saya mau pesan: '+p.name+' ('+price+')')+'" target="_blank" rel="noopener">&#128172; Chat</a></div>';
        }).join('');
      } catch(e) { h.innerHTML='<div class="error">Gagal memuat data. Coba refresh.</div>'; }
    }
    main();
  </script>
</body>
</html>`;

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const slug = url.pathname.split('/').pop();

  try {
    const sql = postgres(env.DATABASE_URL, { prepare: false, max: 1, idle_timeout: 10 });
    const [store] = await sql`SELECT * FROM stores WHERE slug = ${slug}`;
    if (!store) {
      return new Response(STORE_PAGE, {
        headers: { 'content-type': 'text/html;charset=utf-8' },
        status: 404,
      });
    }
    const products = await sql`SELECT * FROM products WHERE store_id = ${store.id} ORDER BY sort_order`;
    await sql.end();

    let injected = STORE_PAGE.replace(
      '<title>Sendbook</title>',
      `<title>${esc(store.name)} — Sendbook</title>` +
      (store.description ? `\n  <meta name="description" content="${esc(store.description)}">` : '') +
      `\n  <meta property="og:title" content="${esc(store.name)} — Sendbook">` +
      (store.description ? `\n  <meta property="og:description" content="${esc(store.description)}">` : '')
    );

    injected = injected.replace(
      '<div id="header" class="header"><div class="loading">Memuat...</div></div>',
      '<div id="header" class="header">' +
        '<h1>' + esc(store.name) + '</h1>' +
        (store.description ? '<p>' + esc(store.description) + '</p>' : '') +
        '<div class="header-info">' +
        (store.whatsapp ? '<a href="https://wa.me/' + store.whatsapp + '" target="_blank">&#128222; ' + esc(store.whatsapp) + '</a>' : '') +
        (store.address ? '<span>&#128205; ' + esc(store.address) + '</span>' : '') +
        '</div>' +
      '</div>'
    );

    return new Response(injected, {
      headers: { 'content-type': 'text/html;charset=utf-8' },
    });
  } catch (e) {
    return new Response(STORE_PAGE, {
      headers: { 'content-type': 'text/html;charset=utf-8' },
    });
  }
}

function esc(s) {
  if (!s) return '';
  return String(s).replace(/[&<>"']/g, function(m) {
    if (m === '&') return '&amp;';
    if (m === '<') return '&lt;';
    if (m === '>') return '&gt;';
    if (m === '"') return '&quot;';
    if (m === "'") return '&#39;';
    return m;
  });
}
