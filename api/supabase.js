export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  const supabaseUrl = 'https://lchthwuodeptpzqklkcf.supabase.co'
  const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxjdGh3dHVvZGVwdHBxemtsa2NmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMxODUxMTAsImV4cCI6MjA5ODc2MTExMH0.w6MutIfAYQ_HSLJ-kg_HwckXGfP9Wb5XSaSQEFZ2Cwk'
  
  // INI YANG KURANG: Ambil query string ?grant_type=password
  const pathAndQuery = req.url.replace('/api/supabase', '')
  const targetUrl = `${supabaseUrl}${pathAndQuery}`

  // Ambil body manual
  const buffers = []
  for await (const chunk of req) {
    buffers.push(chunk)
  }
  const body = Buffer.concat(buffers).toString()

  const response = await fetch(targetUrl, {
    method: req.method,
    headers: {
      'apikey': anonKey,
      'Authorization': `Bearer ${anonKey}`,
      'Content-Type': 'application/json',
    },
    body: body || undefined
  })

  const data = await response.text()
  
  // WAJIB: Balikin header CORS biar gak diem
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,PUT,DELETE,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'apikey, Authorization, Content-Type')
  
  res.status(response.status).send(data)
}