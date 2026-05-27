# ⚡ Quick Start - Deploy in 5 Minutes

## Step 1: Get Your Keys (2 minutes)

### Supabase Service Key
1. Go to https://supabase.com/dashboard
2. Click your project → **Settings** → **API**
3. Copy **service_role** key

### Gemini API Key
1. Go to https://makersuite.google.com/app/apikey
2. Click "Create API Key"
3. Copy the key

## Step 2: Deploy to Vercel (2 minutes)

1. Go to https://vercel.com/new
2. Import your GitHub repo
3. Set **Root Directory**: `apps/frontend`
4. Add these environment variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://azpgpqwkwrqmtyfjecse.supabase.co

NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF6cGdwcXdrd3JxbXR5ZmplY3NlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3ODY5MzIsImV4cCI6MjA5NTM2MjkzMn0.2UbwwB69vo6H2D-Fod9XS7SL1ZJeApwEf-OQ6eAzuUA

SUPABASE_SERVICE_KEY=<YOUR_SERVICE_KEY>

GEMINI_API_KEY=<YOUR_GEMINI_KEY>
```

5. Click **Deploy**

## Step 3: Update Supabase (1 minute)

1. Go to Supabase → **Authentication** → **URL Configuration**
2. Add redirect URL: `https://your-app.vercel.app/auth/callback`
3. Update site URL: `https://your-app.vercel.app`

## Done! 🎉

Your app is live! Test it:
- Sign up
- Create assignment
- Generate questions

---

**Need more details?** See `READY_TO_DEPLOY.md`
