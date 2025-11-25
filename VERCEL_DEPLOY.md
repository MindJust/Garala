# Vercel Deployment - Quick Start

## 🚀 First Time Setup

### 1. Git Push
```bash
cd z:/Garala
git add .
git commit -m "feat: Sprint 1 - Listing management complete"
git push origin main
```

### 2. Vercel Deploy
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Import `MindJust/Garala`
4. Add Environment Variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key
   ```
5. Click Deploy

### 3. Execute SQL
In Supabase Dashboard → SQL Editor:
```sql
-- Copy content from reports_table.sql
-- Execute
```

## 🔄 Daily Workflow

```bash
# Local dev
npm run dev
# Make changes...

# When ready
git add .
git commit -m "feat: description"
git push

# Vercel auto-deploys in 2-3 min
```

## 📱 Test URL
After deploy: `https://garala.vercel.app`

---

See `deployment_guide.md` for full details.
