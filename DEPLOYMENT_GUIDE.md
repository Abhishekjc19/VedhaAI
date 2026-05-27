# VedaAI - Single Vercel Deployment Guide

This guide explains how to deploy both frontend and backend as a **SINGLE Vercel project** using Next.js API routes.

## Architecture Overview

The backend functionality has been migrated into Next.js API routes within the frontend app. This allows deploying everything as one unified Vercel project.

### API Routes Structure

```
apps/frontend/src/app/api/
├── health/
│   └── route.ts                    # Health check endpoint
├── assignments/
│   ├── route.ts                    # POST /api/assignments, GET /api/assignments
│   └── [id]/
│       ├── route.ts                # GET /api/assignments/:id, DELETE /api/assignments/:id
│       └── generate/
│           └── route.ts            # POST /api/assignments/:id/generate
└── question-papers/
    └── [paperId]/
        └── route.ts                # GET /api/question-papers/:paperId
```

## Prerequisites

1. **Supabase Account** - Get your credentials from [Supabase Dashboard](https://supabase.com/dashboard)
2. **Gemini API Key** - Get from [Google AI Studio](https://makersuite.google.com/app/apikey)
3. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)

## Step 1: Get Supabase Service Role Key

1. Go to your Supabase project dashboard
2. Navigate to **Settings** → **API**
3. Copy the **service_role** key (NOT the anon key)
4. This key has admin privileges - keep it secret!

## Step 2: Configure Environment Variables

Update `apps/frontend/.env.local` with your actual keys:

```env
NEXT_PUBLIC_SUPABASE_URL=https://azpgpqwkwrqmtyfjecse.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF6cGdwcXdrd3JxbXR5ZmplY3NlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3ODY5MzIsImV4cCI6MjA5NTM2MjkzMn0.2UbwwB69vo6H2D-Fod9XS7SL1ZJeApwEf-OQ6eAzuUA
SUPABASE_SERVICE_KEY=<YOUR_SERVICE_ROLE_KEY_HERE>
GEMINI_API_KEY=<YOUR_GEMINI_API_KEY_HERE>
```

## Step 3: Install Dependencies

```bash
cd apps/frontend
npm install
```

## Step 4: Test Locally

```bash
cd apps/frontend
npm run dev
```

Visit http://localhost:3000 and test:
- ✅ Login/Signup
- ✅ Create Assignment
- ✅ Generate Questions
- ✅ View Question Paper

## Step 5: Deploy to Vercel

### Option A: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to frontend directory
cd apps/frontend

# Deploy
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? vedaai (or your choice)
# - Directory? ./
# - Override settings? No
```

### Option B: Deploy via Vercel Dashboard

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Configure project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `apps/frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

4. Add Environment Variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://azpgpqwkwrqmtyfjecse.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

5. Click **Deploy**

## Step 6: Configure Supabase Redirect URLs

After deployment, update Supabase with your Vercel URL:

1. Go to Supabase Dashboard → **Authentication** → **URL Configuration**
2. Add to **Redirect URLs**:
   ```
   https://your-app.vercel.app/auth/callback
   ```
3. Update **Site URL**:
   ```
   https://your-app.vercel.app
   ```

## Step 7: Verify Deployment

Test your deployed app:

1. Visit your Vercel URL
2. Sign up with a new account
3. Verify email
4. Create an assignment
5. Generate questions
6. View the generated question paper

## API Endpoints

All endpoints are now under `/api`:

- `GET /api/health` - Health check
- `POST /api/assignments` - Create assignment
- `GET /api/assignments` - List assignments
- `GET /api/assignments/:id` - Get assignment details
- `DELETE /api/assignments/:id` - Delete assignment
- `POST /api/assignments/:id/generate` - Generate questions
- `GET /api/question-papers/:paperId` - Get question paper

## Database Schema

Ensure these tables exist in Supabase:

### assignments
```sql
CREATE TABLE assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  title TEXT NOT NULL,
  topic TEXT NOT NULL,
  description TEXT,
  due_date TIMESTAMP,
  question_types JSONB,
  number_of_questions INTEGER,
  total_marks INTEGER,
  additional_instructions TEXT,
  status TEXT DEFAULT 'draft',
  questions_generated BOOLEAN DEFAULT false,
  question_paper_id TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### question_papers
```sql
CREATE TABLE question_papers (
  id TEXT PRIMARY KEY,
  assignment_id UUID REFERENCES assignments(id),
  sections JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Troubleshooting

### Build Errors

If you get TypeScript errors during build:
```bash
cd apps/frontend
npm run type-check
```

### API Errors

Check Vercel Function Logs:
1. Go to your Vercel project dashboard
2. Click **Functions** tab
3. View logs for each API route

### Authentication Issues

- Verify `SUPABASE_SERVICE_KEY` is the **service_role** key, not anon key
- Check redirect URLs in Supabase match your Vercel domain
- Ensure email confirmation is enabled in Supabase

### Question Generation Fails

- Verify `GEMINI_API_KEY` is valid
- Check Vercel function timeout (default 10s, max 60s on Pro)
- View function logs for AI generation errors

## Environment Variables Summary

| Variable | Where to Get | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Dashboard → Settings → API | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Dashboard → Settings → API | ✅ |
| `SUPABASE_SERVICE_KEY` | Supabase Dashboard → Settings → API (service_role) | ✅ |
| `GEMINI_API_KEY` | Google AI Studio | ✅ |

## What Changed from Separate Backend?

### Before (2 Vercel Projects)
- Frontend: `vedha-ai-frontend.vercel.app`
- Backend: `vedha-ai-backend.vercel.app`
- Required CORS configuration
- Two separate deployments

### After (1 Vercel Project)
- Single app: `vedha-ai.vercel.app`
- Backend logic in Next.js API routes
- No CORS issues (same origin)
- One unified deployment

## Benefits of Single Deployment

✅ **Simpler deployment** - One project instead of two  
✅ **No CORS issues** - Frontend and API on same domain  
✅ **Better performance** - No cross-origin requests  
✅ **Easier maintenance** - Single codebase to manage  
✅ **Cost effective** - One Vercel project instead of two  

## Next Steps

1. ✅ Deploy to Vercel
2. ✅ Configure environment variables
3. ✅ Update Supabase redirect URLs
4. ✅ Test all functionality
5. 🎉 Share your deployed app!

## Support

If you encounter issues:
1. Check Vercel function logs
2. Verify all environment variables are set
3. Test API endpoints directly using curl or Postman
4. Check Supabase logs for database errors

---

**Deployment Status**: Ready to deploy! 🚀
