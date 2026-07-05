import postgres from "postgres"

function esc(s: unknown): string {
  if (!s) return ''
  return String(s).replace(/[&<>"']/g, (m) => {
    if (m === '&') return '&amp;'
    if (m === '<') return '&lt;'
    if (m === '>') return '&gt;'
    if (m === '"') return '&quot;'
    if (m === "'") return '&#39;'
    return m
  })
}

function fmtPrice(n: number): string {
  return 'Rp' + n.toLocaleString('id-ID')
}

function renderProduct(p: any, wa: string): string {
  const price = fmtPrice(p.price)
  const img = p.images?.[0]
  return `<div class="product">
  <div class="product-image">${img ? '<img src="' + esc(img) + '" alt="' + esc(p.name) + '" loading="lazy" />' : '📦'}</div>
  <div class="product-info">
    <h3>` + esc(p.name) + `</h3>
    ${p.description ? '<p class="desc">' + esc(p.description) + '</p>' : ''}
    <div class="meta">
      <span class="price">` + price + `</span>
      ${p.category ? '<span class="category">' + esc(p.category) + '</span>' : ''}
    </div>
  </div>
  <a class="whatsapp-btn" href="https://wa.me/` + esc(wa) + `?text=` + encodeURIComponent('Halo, saya mau pesan: ' + p.name + ' (' + price + ')') + `" target="_blank" rel="noopener" data-product="` + esc(p.id) + `">&#128172; Chat</a>
</div>`
}

function buildPage(store: any, products: any[]): string {
  const productCards = products.map(p => renderProduct(p, store.whatsapp)).join('\n')
  const firstImage = products.find(p => p.images?.[0])?.images?.[0]

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Store',
    name: store.name,
    description: store.description || undefined,
    url: `https://sendbook.pages.dev/store/${esc(store.slug)}`,
    telephone: store.whatsapp ? '+' + store.whatsapp : undefined,
    address: store.address ? { '@type': 'PostalAddress', streetAddress: store.address } : undefined,
    makesOffer: products.map(p => ({
      '@type': 'Offer',
      name: p.name,
      description: p.description || undefined,
      price: p.price,
      priceCurrency: 'IDR',
      image: p.images?.[0] || undefined,
    })),
  }

  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(store.name)} — Sendbook</title>
  <meta name="description" content="${esc(store.description || 'Toko ' + store.name + ' di Sendbook')}">
  <meta property="og:title" content="${esc(store.name)} — Sendbook">
  <meta property="og:description" content="${esc(store.description || 'Toko ' + store.name + ' di Sendbook')}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://sendbook.pages.dev/store/${esc(store.slug)}">
  ${firstImage ? '<meta property="og:image" content="' + esc(firstImage) + '">' : ''}
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(store.name)} — Sendbook">
  <meta name="twitter:description" content="${esc(store.description || 'Toko ' + store.name + ' di Sendbook')}">
  ${firstImage ? '<meta name="twitter:image" content="' + esc(firstImage) + '">' : ''}
  <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
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
    .empty { text-align:center; padding:2rem; color:var(--text-dim); }
    footer { text-align:center; padding:1.5rem; font-size:.75rem; color:var(--text-dim); }
    @media (max-width:480px) { .product-image { width:64px; height:64px; } }
  </style>
</head>
<body>
  <div class="header">
    <h1>${esc(store.name)}</h1>
    ${store.description ? '<p>' + esc(store.description) + '</p>' : ''}
    <div class="header-info">
      ${store.whatsapp ? '<a href="https://wa.me/' + esc(store.whatsapp) + '" target="_blank">&#128222; ' + esc(store.whatsapp) + '</a>' : ''}
      ${store.address ? '<span>&#128205; ' + esc(store.address) + '</span>' : ''}
    </div>
  </div>
  <div class="products">
    ${products.length ? productCards : '<div class="empty">Belum ada produk.</div>'}
  </div>
  <footer>Powered by Sendbook</footer>
  <script>
    document.querySelectorAll('.whatsapp-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        const pid = this.dataset.product;
        if (pid) {
          navigator.sendBeacon('/api/analytics/event', JSON.stringify({
            type: 'wa_click', store_id: '${esc(store.id)}', product_id: pid
          }));
        }
      });
    });
  </script>
</body>
</html>`
}

export async function onRequest(context) {
  const { request, env } = context
  const url = new URL(request.url)
  const slug = url.pathname.split('/').pop()

  try {
    const sql = postgres(env.DATABASE_URL, { prepare: false, max: 1, idle_timeout: 10 })
    const [store] = await sql`SELECT * FROM stores WHERE slug = ${slug}`
    if (!store) {
      return new Response(buildPage(null, []), {
        headers: { 'content-type': 'text/html;charset=utf-8' },
        status: 404,
      })
    }
    const products = await sql`SELECT * FROM products WHERE store_id = ${store.id} ORDER BY sort_order`
    await sql.end()

    return new Response(buildPage(store, products), {
      headers: { 'content-type': 'text/html;charset=utf-8' },
    })
  } catch (e) {
    return new Response(buildPage(null, []), {
      headers: { 'content-type': 'text/html;charset=utf-8' },
    })
  }
}
