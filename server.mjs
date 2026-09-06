import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

try { process.loadEnvFile(new URL('.env', import.meta.url)); } catch (e) { if (e.code !== 'ENOENT') throw e; }
const root = path.dirname(fileURLToPath(import.meta.url));
const port = Number(process.env.PORT || 3000);
const mode = process.env.SMS_MODE || 'preview';
if (!['preview', 'live'].includes(mode)) throw new Error('SMS_MODE must be preview or live');
const recipient = '+37253911527';
const files = new Set(['index.html','about.html','services.html','contacts.html','booking.html','site.css','brand.css','booking.css','app.js','booking.js','contact-fix.js','sms-client.js','img/logo.jpg','robots.txt']);
const types = {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.jpg':'image/jpeg','.txt':'text/plain'};
let recent = [];
const server = http.createServer(async (req, res) => {
  const reply = (status, data) => { res.writeHead(status, {'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'}); res.end(JSON.stringify(data)); };
  try {
    const pathname = new URL(req.url, 'http://localhost').pathname;
    if (pathname === '/api/booking' && req.method === 'POST') {
      if (![`http://localhost:${port}`, `http://127.0.0.1:${port}`].includes(req.headers.origin)) return reply(403, {error:'origin'});
      if (!(req.headers['content-type'] || '').startsWith('application/json')) return reply(415, {error:'content_type'});
      let raw = '';
      for await (const chunk of req) { raw += chunk; if (Buffer.byteLength(raw) > 4096) return reply(413, {error:'too_large'}); }
      let data;
      try { data = JSON.parse(raw); } catch { return reply(400, {error:'invalid'}); }
      if (!data || typeof data !== 'object') return reply(400, {error:'invalid'});
      const {name, phone, day} = data;
      const today = new Intl.DateTimeFormat('en-CA', {timeZone:'Europe/Tallinn',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
      if (typeof name !== 'string' || !name.trim() || name.length > 80 || /[\r\n]/.test(name) || typeof phone !== 'string' || !/^\+?[\d ()-]{7,25}$/.test(phone) || phone.replace(/\D/g,'').length < 7 || typeof day !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(day) || !Number.isFinite(Date.parse(day)) || new Date(day).toISOString().slice(0,10) !== day || day < today) return reply(400, {error:'invalid'});
      const body = `FTORDENT booking\nName: ${name.trim()}\nPhone: ${phone}\nDay: ${day}`;
      if (mode === 'preview') return reply(200, {mode:'preview',recipient,body});
      const sid = process.env.TWILIO_ACCOUNT_SID, token = process.env.TWILIO_AUTH_TOKEN, sender = process.env.TWILIO_FROM;
      if (!/^AC[a-f0-9]{32}$/i.test(sid || '') || !token || !sender) return reply(503, {error:'not_configured'});
      recent = recent.filter(t => Date.now() - t < 3600000);
      if (recent.length >= 5) return reply(429, {error:'rate_limit'});
      recent.push(Date.now());
      const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {method:'POST',headers:{Authorization:`Basic ${Buffer.from(`${sid}:${token}`).toString('base64')}`,'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({To:recipient,From:sender,Body:body}),signal:AbortSignal.timeout(15000)});
      const result = await response.json();
      if (!response.ok || !result.sid || ['failed','undelivered','canceled'].includes(result.status)) return reply(502, {error:'provider'});
      return reply(200, {mode:'live',status:'accepted'});
    }
    if (!['GET','HEAD'].includes(req.method)) return reply(405, {error:'method'});
    const file = pathname === '/' ? 'index.html' : pathname.slice(1);
    if (!files.has(file)) return reply(404, {error:'not_found'});
    const contents = await readFile(path.join(root, file));
    res.writeHead(200, {'Content-Type':types[path.extname(file)] || 'application/octet-stream','X-Content-Type-Options':'nosniff'});
    res.end(req.method === 'HEAD' ? undefined : contents);
  } catch { reply(502, {error:'request_failed'}); }
});
server.listen(port, '127.0.0.1', () => console.log(`FTORDENT: http://localhost:${port} | SMS mode: ${mode}`));
