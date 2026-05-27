# 🚀 Vercel Monorepo Deployment Guide

## Current Setup (Recommended)

You already have the correct setup with **TWO separate Vercel projects**:
1. **Frontend**: `vedha-ai-frontend` → https://vedha-ai-frontend.vercel.app
2. **Backend**: `vedha-ai-backend` → https://vedha-ai-backend.vercel.app

This is the **recommended approach** for monorepos in Vercel.

---

## ✅ Complete Configuration Checklist

### Backend Project (`vedha-ai-backend`)

#### Settings → General:
- **Root Directory**: `apps/backend`
- **Framework Preset**: Other
- **Build Command**: (leave empty - uses package.json script)
- **Output Directory**: (leave empty)
- **Install Command**: (leave empty)

#### Settings → Environment Variables:
```
SUPABASE_URL=https://azpgpqwkwrqmtyfjecse.supabase.co
SUPABASE_SERVICE_KEY=<your_service_role_key_from_supabase>
FRONTEND_URL=https://vedha-ai-frontend.vercel.app
NODE_ENV=production
```

**Important**: Add these to **Production**, **Preview**, and **Development** environments.

---

### Frontend Project (`vedha-ai-frontend`)

#### Settings → General:
- **Root Directory**: `apps/frontend`
- **Framework Preset**: Next.js
- **Build Command**: (leave empty - uses package.json script)
- **Output Directory**: (leave empty)
- **Install Command**: (leave empty)

#### Settings → Environment Variables:
```
NEXT_PUBLIC_SUPABASE_URL=https://azpgpqwkwrqmtyfjecse.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF6cGdwcXdrd3JxbXR5ZmplY3NlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3ODY5MzIsImV4cCI6MjA5NTM2MjkzMn0.2UbwwB69vo6H2D-Fod9XS7SL1ZJeApwEf-OQ6eAzuUA
NEXT_PUBLIC_API_URL=https://vedha-ai-backend.vercel.app/api
```

**Important**: Add these to **Production**, **Preview**, and **Development** environments.

---

## 🔄 Deployment Workflow

### When You Push to GitHub:

1. **Both projects auto-deploy** from the same repository
2. **Frontend** deploys from `apps/frontend`
3. **Backend** deploys from `apps/backend`
4. They communicate via the API URL

### Manual Redeploy:

1. Go to project in Vercel
2. **Deployments** tab
3. Click **three dots (•••)** on latest deployment
4. Click **Redeploy**

---

## 🎯 Quick Setup Steps (Do This Now)

### Step 1: Configure Backend Environment Variables

1. Go to: https://vercel.com/dashboard
2. Select: **vedha-ai-backend**
3. Go to: **Settings** → **Environment Variables**
4. Add all 4 variables listed above
5. Click **Save** for each

### Step 2: Get Supabase Service Key

1. Go to: https://supabase.com/dashboard
2. Select your project: `azpgpqwkwrqmtyfjecse`
3. Go to: **Settings** → **API**
4. Scroll to: **Secret keys** section
5. Find: **service_role** key
6. Click: **eye icon** to reveal
7. Copy: The entire JWT token
8. Paste: Into `SUPABASE_SERVICE_KEY` in Vercel

### Step 3: Redeploy Backend

1. Go to: **vedha-ai-backend** project
2. Click: **Deployments** tab
3. Click: **three dots (•••)** on latest deployment
4. Click: **Redeploy**
5. Wait: 2-3 minutes for deployment

### Step 4: Configure Frontend Environment Variables

1. Go to: **vedha-ai-frontend** project
2. Go to: **Settings** → **Environment Variables**
3. Add: `NEXT_PUBLIC_API_URL` = `https://vedha-ai-backend.vercel.app/api`
4. Click: **Save**

### Step 5: Redeploy Frontend

1. Go to: **Deployments** tab
2. Click: **three dots (•••)** on latest deployment
3. Click: **Redeploy**
4. Wait: 2-3 minutes for deployment

### Step 6: Test

1. Go to: https://vedha-ai-frontend.vercel.app/create
2. Fill in the form
3. Click: **Next →**
4. Should work! ✅

---

## 🐛 Troubleshooting

### Backend Shows "500 Internal Server Error"
- **Cause**: Missing environment variables
- **Fix**: Add all 4 environment variables and redeploy

### Frontend Shows "Failed to create assignment"
- **Cause**: `NEXT_PUBLIC_API_URL` not set or backend is down
- **Fix**: Add `NEXT_PUBLIC_API_URL` and redeploy frontend

### Backend Builds But Crashes
- **Cause**: Invalid `SUPABASE_SERVICE_KEY`
- **Fix**: Make sure you copied the **service_role** key (not anon key)

---

## 📊 Architecture

```
GitHub Repository (VedhaAI)
├── apps/
│   ├── frontend/  → Vercel Project 1 (vedha-ai-frontend)
│   └── backend/   → Vercel Project 2 (vedha-ai-backend)
│
Deployment Flow:
1. Push to GitHub
2. Vercel detects changes
3. Frontend deploys from apps/frontend
4. Backend deploys from apps/backend
5. Frontend calls Backend via API URL
```

---

## ✅ Benefits of This Setup

1. **Automatic Deployments**: Push to GitHub → Both deploy
2. **Independent Scaling**: Scale frontend and backend separately
3. **Environment Isolation**: Different env vars for each
4. **Easy Rollback**: Rollback frontend or backend independently
5. **Preview Deployments**: Each PR gets preview URLs for both

---

## 🎉 Final Checklist

- [ ] Backend has 4 environment variables
- [ ] Frontend has 3 environment variables
- [ ] Backend redeployed after adding env vars
- [ ] Frontend redeployed after adding env vars
- [ ] Backend health check works: https://vedha-ai-backend.vercel.app/health
- [ ] Frontend loads: https://vedha-ai-frontend.vercel.app
- [ ] Create assignment form works

---

**This is the CORRECT and RECOMMENDED way to deploy a monorepo to Vercel!** ✅

You cannot deploy both in a single Vercel project, but having two projects from the same repo is the standard approach.
