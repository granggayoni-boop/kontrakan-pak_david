export default async function handler(req, res) {
  const supabaseUrl = 'https://lchthwuodeptpzqklkcf.supabase.co'
  const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxjdGh3dHVvZGVwdHBxemtsa2NmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMxODUxMTAsImV4cCI6MjA5ODc2MTExMH0.w6MutIfAYQ_HSLJ-kg_HwckXGfP9Wb5XSaSQEFZ2Cwk'
  
  const path = req.url.replace('/api/supabase', '')
  const targetUrl = `${supabaseUrl}${path}`

  // WAJIB: Ambil body manual buat POST/PATCH
  const body = req.method !== 'GET' && req.method !== 'HEAD' 
    ? await new Promise((resolve) => {
        let data = ''
        req.on('data', chunk => data += chunk)
        req.on('end', () => resolve(data))
      })
    : null

  const response = await fetch(targetUrl, {
    method: req.method,
    headers: {
      'apikey': anonKey,
      'Authorization': `Bearer ${anonKey}`,
      'Content-Type': 'application/json',
      'Prefer': req.headers['prefer'] || ''
    },
    body: body
  })

  const data = await response.text()
  res.status(response.status).setHeader('Content-Type', 'application/json').send(data)
}