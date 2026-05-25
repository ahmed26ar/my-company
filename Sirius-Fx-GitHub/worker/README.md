# Sirius Fx — Cloudflare Worker API

## النشر (مرة واحدة)

1. ثبّت [Node.js](https://nodejs.org)
2. في هذا المجلد:
   ```bash
   npm install -g wrangler
   wrangler login
   wrangler deploy
   ```
3. بعد النشر، `POST https://siriusfx.6611zzrru.workers.dev/chat` يعمل.

## اختبار

```bash
curl -X POST https://siriusfx.6611zzrru.workers.dev/chat ^
  -H "Content-Type: application/json" ^
  -d "{\"message\":\"ما رأيك في EUR/USD؟\",\"lang\":\"ar\"}"
```

يجب أن يرجع JSON مثل: `{"reply":"..."}`

## ملاحظة

إذا كان عندك Worker موجود بنفس الاسم، انسخ محتوى `index.js` إلى مشروعك على Cloudflare Dashboard → Edit code → Deploy.
