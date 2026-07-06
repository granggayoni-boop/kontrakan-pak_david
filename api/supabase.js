export const config = {
  api: { bodyParser: false },
};

export default async function handler(req, res) {
  const supabaseUrl = 'https://lchthwuodeptpzqklkcf.supabase.co';
  const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxjdGh3dHVvZGVwdHBxemtsa2NmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMxODUxMTAsImV4cCI6MjA5ODc2MTExMH0.w6MutIfAYQ_HSLJ-kg_HwckXGfP9Wb5XSaSQEFZ2Cwk';

  // FIX #1: Jangan buang query string ?grant_type=password
  const url = new URL(req.url, `https://${req.headers.host}`);
  const path = url.pathname.replace('/api/supabase', '');
  const query = url.search;
  const targetUrl = `${supabaseUrl}${path}${query}`;

  // FIX #2: Baca body yang bener buat POST
  const buffers = [];
  for await (const chunk of req) buffers.push(chunk);
  const body = Buffer.concat(buffers);

  const response = await fetch(targetUrl, {
    method: req.method,
    headers: {
      'apikey': anonKey,
      'Authorization': `Bearer ${anonKey}`,
      'Content-Type': 'application/json',
    },
    body: req.method !== 'GET' && req.method !== 'HEAD' ? body : undefined,
  });

  const data = await response.text();
  
  // FIX #3: Kasih header CORS biar gak diem
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'authorization, x-client-info, apikey, content-type');
  res.status(response.status).send(data);
}