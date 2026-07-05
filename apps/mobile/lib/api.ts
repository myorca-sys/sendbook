const BASE = 'https://sendbook.pages.dev'

export async function api(path: string, options?: RequestInit) {
  const res = await fetch(BASE + path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error(body.error || 'Request failed')
  }
  return res.json()
}

export async function apiWithToken(path: string, token: string, options?: RequestInit) {
  return api(path, {
    ...options,
    headers: {
      ...options?.headers,
      Cookie: `sendbook_session=${token}`,
    },
  })
}

export async function uploadImage(token: string, file: any) {
  const form = new FormData()
  form.append('file', file)
  const res = await fetch(BASE + '/api/upload', {
    method: 'POST',
    headers: { Cookie: `sendbook_session=${token}` },
    body: form,
  })
  if (!res.ok) throw new Error('Upload failed')
  return res.json()
}
