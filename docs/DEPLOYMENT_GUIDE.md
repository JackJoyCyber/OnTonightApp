# OnTonight — Deployment Guide

## Local Development
```bash
npm install
npm run dev
# then visit http://localhost:3000
```

## Deploying to Production (Vercel)
1. Go to Vercel → New Project
2. Select **OnTonightApp** (GitHub repo)
3. Auto-detects **Next.js**
4. Click **Deploy**
5. Enable **Analytics** (recommended)
   - Vercel → Project → Analytics → Enable

## Deep Links for QA
- `/#/splash`
- `/#/feed`
- `/#/profile/ari`

## Content Management
- Edit `public/data.json` to update venues & staff
- Replace images in `public/data/` to personalize (keep the same filenames to avoid code changes)

## Common Fixes
- Import error on CSS: `_app.js` should use:
```js
import '../styles/globals.css';
```

- Build issues with Next.js:
```json
"next": "^15.0.0",
"engines": {
  "node": ">=18"
}
```

- Clear Vercel cache if build fails:
  Deployments → Redeploy → Clear cache & redeploy
