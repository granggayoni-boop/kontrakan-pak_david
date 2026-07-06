export default async function handler(req, res) {
  const supabaseUrl = 'https://lchthwuodeptpzqklkcf.supabase.co'
  const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxjdGh3dHVvZGVwdHBxemtsa2NmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMxODUxMTAsImV4cCI6MjA5ODc2MTExMH0.w6MutIfAYQ_HSLJ-kg_HwckXGfP9Wb5XSaSQEFZ2Cwk'
  
  // INI YANG PENTING: Ambil semua path setelah /api/supabase
  const path = req.url.replace('/api/supabase', '')
  const targetUrl = `${supabaseUrl}${path}`

  const headers = {
    'apikey': anonKey,
    'Authorization': `Bearer ${anonKey}`,
    'Content-Type': req.headers['content-type'] || 'application/json'
  }

  const fetchOptions = {
    method: req.method,
    headers: headers
  }

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    fetchOptions.body = JSON.stringify(req.body)
  }

  const response = await fetch(targetUrl, fetchOptions)
  const data = await response.text()
  
  res.status(response.status).send(data)
}