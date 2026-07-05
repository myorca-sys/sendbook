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

async function getSession(env: any, token: string): Promise<{ userId: string } | null> {
  const resp = await fetch(env.UPSTASH_REDIS_REST_URL + '/get/session:' + token, {
    headers: { Authorization: 'Bearer ' + env.UPSTASH_REDIS_REST_TOKEN },
  })
  const data: any = await resp.json()
  if (!data.result) return null
  const session = JSON.parse(data.result)
  if (session.expiresAt < Date.now()) return null
  return { userId: session.userId }
}

async function getUser(env: any, userId: string): Promise<any> {
  const sql = postgres(env.DATABASE_URL, { prepare: false, max: 1, idle_timeout: 10 })
  try {
    const [user] = await sql`SELECT id, email, name, store_id FROM merchant_users WHERE id = ${userId}`
    return user || null
  } finally {
    await sql.end()
  }
}

const LAYOUT_CSS = `*{margin:0;padding:0;box-sizing:border-box}
body{font-family:Inter,sans-serif;background:#f4f4f5;color:#18181b;min-height:100vh}
.topbar{background:#fff;border-bottom:1px solid #e4e4e7;padding:.75rem 1.5rem;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:10}
.topbar h1{font-size:1.1rem;font-weight:700}
.topbar .user-info{display:flex;align-items:center;gap:.75rem;font-size:.85rem}
.topbar .user-info .email{color:#71717a}
.topbar a{color:#6366f1;text-decoration:none;font-size:.85rem}
.topbar a:hover{text-decoration:underline}
.nav{display:flex;gap:0;background:#fff;border-bottom:1px solid #e4e4e7;padding:0 1.5rem}
.nav a{padding:.75rem 1rem;text-decoration:none;color:#71717a;font-size:.875rem;font-weight:500;border-bottom:2px solid transparent}
.nav a.active{color:#6366f1;border-bottom-color:#6366f1}
.nav a:hover{color:#18181b}
.main{max-width:800px;margin:0 auto;padding:1.5rem}
.card{background:#fff;border:1px solid #e4e4e7;border-radius:12px;padding:1.5rem;margin-bottom:1rem}
.card h2{font-size:1.1rem;font-weight:600;margin-bottom:1rem}
.form-group{margin-bottom:1rem}
.form-group label{display:block;font-size:.85rem;font-weight:500;margin-bottom:.3rem;color:#52525b}
.form-group input,.form-group textarea,.form-group select{width:100%;padding:.6rem .75rem;border:1px solid #d4d4d8;border-radius:8px;font-size:.9rem;font-family:inherit}
.form-group textarea{resize:vertical;min-height:80px}
.btn{display:inline-flex;align-items:center;gap:.4rem;padding:.6rem 1.2rem;border-radius:8px;font-size:.875rem;font-weight:600;border:none;cursor:pointer;text-decoration:none}
.btn-primary{background:#6366f1;color:#fff}
.btn-primary:hover{background:#5558e6}
.btn-danger{background:#ef4444;color:#fff}
.btn-danger:hover{background:#dc2626}
.btn-outline{background:transparent;border:1px solid #d4d4d8;color:#52525b}
.btn-outline:hover{background:#f4f4f5}
.btn-sm{padding:.4rem .8rem;font-size:.8rem}
.alert{padding:.75rem 1rem;border-radius:8px;font-size:.875rem;margin-bottom:1rem}
.alert-error{background:#fef2f2;color:#dc2626;border:1px solid #fecaca}
.alert-success{background:#f0fdf4;color:#16a34a;border:1px solid #bbf7d0}
table{width:100%;border-collapse:collapse;font-size:.875rem}
th,td{text-align:left;padding:.6rem .75rem;border-bottom:1px solid #e4e4e7}
th{font-weight:600;color:#52525b;font-size:.8rem;text-transform:uppercase}
tr:hover td{background:#fafafa}
.empty-state{text-align:center;padding:2rem;color:#71717a;font-size:.875rem}
.login-page{display:flex;align-items:center;justify-content:center;min-height:100vh;background:#f4f4f5}
.login-box{background:#fff;border:1px solid #e4e4e7;border-radius:16px;padding:2.5rem;width:100%;max-width:380px}
.login-box h1{font-size:1.3rem;font-weight:700;margin-bottom:.3rem;text-align:center}
.login-box .sub{color:#71717a;font-size:.875rem;text-align:center;margin-bottom:1.5rem}
`

function loginPage(error?: string): string {
  return `<!DOCTYPE html>
<html lang="id">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Login — Sendbook Dashboard</title><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet"><style>${LAYOUT_CSS}</style></head>
<body class="login-page">
  <div class="login-box">
    <h1>Sendbook</h1>
    <p class="sub">Masuk ke dashboard merchant</p>
    ${error ? '<div class="alert alert-error">' + esc(error) + '</div>' : ''}
    <form id="loginForm">
      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" id="email" name="email" required autocomplete="email" placeholder="admin@sendbook.id">
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input type="password" id="password" name="password" required autocomplete="current-password" placeholder="password">
      </div>
      <button type="submit" class="btn btn-primary" style="width:100%;justify-content:center">Masuk</button>
    </form>
  </div>
  <script>
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const res = await fetch('/api/dashboard/login', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({email,password}), credentials:'include' });
      if (res.ok) { window.location.href = '/dashboard'; }
      else { const d = await res.json(); alert(d.error || 'Login gagal'); }
    });
  </script>
</body>
</html>`
}

function layout(page: string, userName: string, content: string): string {
  const nav = [
    { href: '/dashboard', label: 'Ringkasan', id: 'overview' },
    { href: '/dashboard/products', label: 'Produk', id: 'products' },
    { href: '/dashboard/settings', label: 'Pengaturan', id: 'settings' },
  ]
  const navHtml = nav.map(n => `<a href="${n.href}" class="${n.id === page ? 'active' : ''}">${n.label}</a>`).join('')
  return `<!DOCTYPE html>
<html lang="id">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Dashboard — Sendbook</title><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet"><style>${LAYOUT_CSS}</style></head>
<body>
  <div class="topbar">
    <h1>Sendbook Dashboard</h1>
    <div class="user-info">
      <span class="email">${esc(userName)}</span>
      <a href="#" id="logoutBtn">Keluar</a>
    </div>
  </div>
  <div class="nav">${navHtml}</div>
  <div class="main">${content}</div>
  <script>
    document.getElementById('logoutBtn')?.addEventListener('click', async (e) => {
      e.preventDefault();
      await fetch('/api/dashboard/logout', { method:'POST', credentials:'include' });
      window.location.href = '/dashboard/login';
    });
  </script>
</body>
</html>`
}

function overviewPage(user: any, store: any, stats: any[]): string {
  const visits = stats.filter(s => s.type === 'visit').reduce((a: number, b: any) => a + Number(b.count), 0)
  const clicks = stats.filter(s => s.type === 'whatsapp_click').reduce((a: number, b: any) => a + Number(b.count), 0)
  return layout('overview', user.name, `
    <div class="card">
      <h2>${esc(store.name)}</h2>
      <p style="color:#71717a;font-size:.875rem;margin-bottom:.5rem">${esc(store.description || '')}</p>
      <p style="font-size:.8rem;color:#52525b">${store.is_published ? '🟢 Published' : '⚪ Draft'} · <a href="/store/${esc(store.slug)}" target="_blank" style="color:#6366f1">/${esc(store.slug)}</a></p>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
      <div class="card" style="text-align:center"><div style="font-size:2rem;font-weight:700">${visits}</div><div style="font-size:.8rem;color:#71717a">Kunjungan (30 hari)</div></div>
      <div class="card" style="text-align:center"><div style="font-size:2rem;font-weight:700">${clicks}</div><div style="font-size:.8rem;color:#71717a">Klik WA (30 hari)</div></div>
    </div>
  `)
}

function productsPage(user: any, store: any, products: any[]): string {
  const rows = products.map(p => `<tr>
    <td>${p.images?.[0] ? '<img src="' + esc(p.images[0]) + '" style="width:36px;height:36px;border-radius:6px;object-fit:cover;vertical-align:middle;margin-right:.5rem">' : '📦 '}${esc(p.name)}</td>
    <td>Rp${Number(p.price).toLocaleString('id-ID')}</td>
    <td>${esc(p.category || '-')}</td>
    <td>${p.is_available ? '🟢' : '🔴'}</td>
    <td><button class="btn btn-sm btn-outline" onclick="editProduct('${p.id}')">Edit</button> <button class="btn btn-sm btn-danger" onclick="deleteProduct('${p.id}')">Hapus</button></td>
  </tr>`).join('')

  return layout('products', user.name, `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem">
      <h2 style="font-size:1.1rem;font-weight:600">Produk</h2>
      <button class="btn btn-primary btn-sm" onclick="showAddForm()">+ Tambah Produk</button>
    </div>
    <div id="productForm" style="display:none" class="card">
      <h2 id="formTitle">Tambah Produk</h2>
      <form id="productFormInner">
        <input type="hidden" id="productId" value="">
        <div class="form-group"><label>Nama Produk</label><input type="text" id="prodName" required></div>
        <div class="form-group"><label>Harga (Rp)</label><input type="number" id="prodPrice" required min="0"></div>
        <div class="form-group"><label>Deskripsi</label><textarea id="prodDesc"></textarea></div>
        <div class="form-group"><label>Kategori</label><input type="text" id="prodCategory"></div>
        <div style="display:flex;gap:.5rem">
          <button type="submit" class="btn btn-primary">Simpan</button>
          <button type="button" class="btn btn-outline" onclick="hideForm()">Batal</button>
        </div>
      </form>
    </div>
    <div class="card" style="padding:0">
      <table>
        <thead><tr><th>Nama</th><th>Harga</th><th>Kategori</th><th>Status</th><th></th></tr></thead>
        <tbody>${rows || '<tr><td colspan="5" class="empty-state">Belum ada produk. Tambahkan produk pertama Anda!</td></tr>'}</tbody>
      </table>
    </div>
    <script>
      const slug = '${esc(store.slug)}';
      const storeId = '${esc(store.id)}';
      let editingId = null;

      function showAddForm() { editingId = null; document.getElementById('productId').value = ''; document.getElementById('prodName').value = ''; document.getElementById('prodPrice').value = ''; document.getElementById('prodDesc').value = ''; document.getElementById('prodCategory').value = ''; document.getElementById('formTitle').textContent = 'Tambah Produk'; document.getElementById('productForm').style.display = 'block'; }
      function hideForm() { document.getElementById('productForm').style.display = 'none'; }

      async function editProduct(id) {
        const res = await fetch('/api/stores/' + slug + '/products');
        const products = await res.json();
        const p = products.find(x => x.id === id);
        if (!p) return;
        editingId = id;
        document.getElementById('productId').value = id;
        document.getElementById('prodName').value = p.name;
        document.getElementById('prodPrice').value = p.price;
        document.getElementById('prodDesc').value = p.description || '';
        document.getElementById('prodCategory').value = p.category || '';
        document.getElementById('formTitle').textContent = 'Edit Produk';
        document.getElementById('productForm').style.display = 'block';
      }

      async function deleteProduct(id) {
        if (!confirm('Hapus produk ini?')) return;
        await fetch('/api/products/' + id, { method:'DELETE' });
        location.reload();
      }

      document.getElementById('productFormInner').addEventListener('submit', async (e) => {
        e.preventDefault();
        const body = { name: document.getElementById('prodName').value, price: parseInt(document.getElementById('prodPrice').value), description: document.getElementById('prodDesc').value, category: document.getElementById('prodCategory').value };
        const id = document.getElementById('productId').value;
        if (editingId) {
          await fetch('/api/products/' + editingId, { method:'PATCH', headers:{'Content-Type':'application/json'}, body:JSON.stringify(body) });
        } else {
          await fetch('/api/stores/' + slug + '/products', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(body) });
        }
        location.reload();
      });
    </script>
  `)
}

function settingsPage(user: any, store: any): string {
  return layout('settings', user.name, `
    <div class="card">
      <h2>Pengaturan Toko</h2>
      <form id="settingsForm">
        <div class="form-group"><label>Nama Toko</label><input type="text" id="setName" value="${esc(store.name)}" required></div>
        <div class="form-group"><label>Slug (URL toko)</label><input type="text" id="setSlug" value="${esc(store.slug)}" disabled style="background:#f4f4f5"><p style="font-size:.75rem;color:#71717a;margin-top:.25rem">Tidak bisa diubah</p></div>
        <div class="form-group"><label>Deskripsi</label><textarea id="setDesc">${esc(store.description || '')}</textarea></div>
        <div class="form-group"><label>No. WhatsApp</label><input type="text" id="setWa" value="${esc(store.whatsapp || '')}" placeholder="6281234567890"></div>
        <div class="form-group"><label>Alamat</label><textarea id="setAddr">${esc(store.address || '')}</textarea></div>
        <div class="form-group"><label>Link Google Maps</label><input type="url" id="setMaps" value="${esc(store.maps_url || '')}" placeholder="https://maps.google.com/..."></div>
        <div class="form-group"><label><input type="checkbox" id="setPublished" ${store.is_published ? 'checked' : ''}> Toko dipublikasikan</label></div>
        <button type="submit" class="btn btn-primary">Simpan</button>
      </form>
    </div>
    <script>
      const slug = '${esc(store.slug)}';
      document.getElementById('settingsForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const body = { name: document.getElementById('setName').value, description: document.getElementById('setDesc').value, whatsapp: document.getElementById('setWa').value, address: document.getElementById('setAddr').value, maps_url: document.getElementById('setMaps').value, is_published: document.getElementById('setPublished').checked };
        await fetch('/api/stores/' + slug, { method:'PATCH', headers:{'Content-Type':'application/json'}, body:JSON.stringify(body) });
        alert('Pengaturan disimpan!');
      });
    </script>
  `)
}

export async function onRequest(context: any) {
  const { request, env } = context
  const url = new URL(request.url)
  const path = url.pathname.replace(/^\/dashboard\/?/, '') || 'overview'

  // Auth check
  const cookie = request.headers.get('cookie') || ''
  const match = cookie.match(/sendbook_session=([^;]+)/)
  let user = null
  if (match) {
    const session = await getSession(env, match[1])
    if (session) user = await getUser(env, session.userId)
  }

  // Login page
  if (path === 'login') {
    if (user) return Response.redirect('https://sendbook.pages.dev/dashboard', 302)
    return new Response(loginPage(), { headers: { 'content-type': 'text/html;charset=utf-8' } })
  }

  // Not authenticated
  if (!user) {
    return Response.redirect('https://sendbook.pages.dev/dashboard/login', 302)
  }

  // Get store for the user
  const sql = postgres(env.DATABASE_URL, { prepare: false, max: 1, idle_timeout: 10 })
  try {
    const [store] = user.store_id
      ? await sql`SELECT * FROM stores WHERE id = ${user.store_id}`
      : await sql`SELECT * FROM stores WHERE owner_id = ${user.id}`
    if (!store) {
      return new Response(layout('overview', user.name, '<div class="card"><h2>Belum ada toko</h2><p>Hubungi admin untuk membuatkan toko untuk Anda.</p></div>'), {
        headers: { 'content-type': 'text/html;charset=utf-8' },
      })
    }

    if (path === 'overview' || path === '') {
      const stats = await sql`
        SELECT type, COUNT(*)::int as count
        FROM analytics_events WHERE store_id = ${store.id}
          AND created_at > now() - interval '30 days'
        GROUP BY type
      `
      return new Response(overviewPage(user, store, stats), { headers: { 'content-type': 'text/html;charset=utf-8' } })
    }

    if (path === 'products') {
      const products = await sql`
        SELECT * FROM products WHERE store_id = ${store.id} ORDER BY sort_order, created_at
      `
      return new Response(productsPage(user, store, products), { headers: { 'content-type': 'text/html;charset=utf-8' } })
    }

    if (path === 'settings') {
      return new Response(settingsPage(user, store), { headers: { 'content-type': 'text/html;charset=utf-8' } })
    }

    // 404
    return new Response(layout('overview', user.name, '<div class="card"><h2>Halaman tidak ditemukan</h2></div>'), {
      headers: { 'content-type': 'text/html;charset=utf-8' },
      status: 404,
    })
  } finally {
    await sql.end()
  }
}
