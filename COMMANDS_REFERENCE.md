# 📝 Commands Reference

## Local Development

### Install Dependencies
```bash
cd apps/frontend
npm install
```

### Run Development Server
```bash
cd apps/frontend
npm run dev
```
Visit: http://localhost:3000

### Build for Production
```bash
cd apps/frontend
npm run build
```

### Start Production Server (Local)
```bash
cd apps/frontend
npm run build
npm start
```

### Type Check
```bash
cd apps/frontend
npm run type-check
```

### Lint Code
```bash
cd apps/frontend
npm run lint
```

## Git Commands

### Check Status
```bash
git status
```

### Add All Changes
```bash
git add .
```

### Commit Changes
```bash
git commit -m "Backend migrated to Next.js API routes"
```

### Push to GitHub
```bash
git push origin main
```

### Create New Branch
```bash
git checkout -b feature/new-feature
```

### Switch Branch
```bash
git checkout main
```

## Vercel Deployment

### Install Vercel CLI
```bash
npm install -g vercel
```

### Login to Vercel
```bash
vercel login
```

### Deploy (First Time)
```bash
cd apps/frontend
vercel
```

Follow prompts:
- Set up and deploy? **Yes**
- Which scope? **Your account**
- Link to existing project? **No**
- Project name? **vedaai** (or your choice)
- Directory? **./apps/frontend**
- Override settings? **No**

### Deploy (Subsequent)
```bash
cd apps/frontend
vercel --prod
```

### View Deployment Logs
```bash
vercel logs
```

### List Deployments
```bash
vercel ls
```

### Remove Deployment
```bash
vercel rm <deployment-url>
```

## Environment Variables

### View Local Environment Variables
```bash
cat apps/frontend/.env.local
```

### Add Environment Variable to Vercel (CLI)
```bash
vercel env add SUPABASE_SERVICE_KEY
# Paste your key when prompted
# Select: Production, Preview, Development
```

### List Vercel Environment Variables
```bash
vercel env ls
```

### Remove Vercel Environment Variable
```bash
vercel env rm SUPABASE_SERVICE_KEY
```

## Supabase Commands

### Test Supabase Connection (Node.js)
```bash
node -e "
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  'https://azpgpqwkwrqmtyfjecse.supabase.co',
  'YOUR_ANON_KEY'
);
supabase.from('assignments').select('*').limit(1).then(console.log);
"
```

## API Testing

### Health Check
```bash
# Local
curl http://localhost:3000/api/health

# Production
curl https://your-app.vercel.app/api/health
```

### Create Assignment (with auth)
```bash
# Get your JWT token from browser (DevTools → Application → Local Storage)
TOKEN="your_jwt_token_here"

curl -X POST http://localhost:3000/api/assignments \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Assignment",
    "topic": "Mathematics",
    "description": "Test description",
    "dueDate": "2026-06-01",
    "questionTypes": ["mcq", "short"],
    "numberOfQuestions": 10,
    "totalMarks": 50,
    "additionalInstructions": "Focus on algebra"
  }'
```

### List Assignments
```bash
curl -X GET http://localhost:3000/api/assignments \
  -H "Authorization: Bearer $TOKEN"
```

### Get Assignment
```bash
curl -X GET http://localhost:3000/api/assignments/ASSIGNMENT_ID \
  -H "Authorization: Bearer $TOKEN"
```

### Generate Questions
```bash
curl -X POST http://localhost:3000/api/assignments/ASSIGNMENT_ID/generate \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "difficulty": "mixed"
  }'
```

### Get Question Paper
```bash
curl -X GET http://localhost:3000/api/question-papers/PAPER_ID \
  -H "Authorization: Bearer $TOKEN"
```

### Delete Assignment
```bash
curl -X DELETE http://localhost:3000/api/assignments/ASSIGNMENT_ID \
  -H "Authorization: Bearer $TOKEN"
```

## Database Commands (Supabase SQL Editor)

### Create Tables
```sql
-- Run in Supabase SQL Editor

-- assignments table
CREATE TABLE IF NOT EXISTS assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  topic TEXT NOT NULL,
  description TEXT,
  due_date TIMESTAMP,
  question_types JSONB DEFAULT '[]'::jsonb,
  number_of_questions INTEGER DEFAULT 10,
  total_marks INTEGER DEFAULT 50,
  additional_instructions TEXT,
  status TEXT DEFAULT 'draft',
  questions_generated BOOLEAN DEFAULT false,
  question_paper_id TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- question_papers table
CREATE TABLE IF NOT EXISTS question_papers (
  id TEXT PRIMARY KEY,
  assignment_id UUID REFERENCES assignments(id) ON DELETE CASCADE,
  sections JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_papers ENABLE ROW LEVEL SECURITY;

-- RLS Policies for assignments
CREATE POLICY "Users can view own assignments"
  ON assignments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own assignments"
  ON assignments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own assignments"
  ON assignments FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own assignments"
  ON assignments FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for question_papers
CREATE POLICY "Users can view own question papers"
  ON question_papers FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM assignments
      WHERE assignments.id = question_papers.assignment_id
      AND assignments.user_id = auth.uid()
    )
  );

CREATE POLICY "Service role can manage question papers"
  ON question_papers FOR ALL
  USING (true)
  WITH CHECK (true);
```

### View All Assignments
```sql
SELECT * FROM assignments ORDER BY created_at DESC;
```

### View All Question Papers
```sql
SELECT * FROM question_papers ORDER BY created_at DESC;
```

### Count Assignments by User
```sql
SELECT user_id, COUNT(*) as assignment_count
FROM assignments
GROUP BY user_id;
```

### Delete All Test Data
```sql
-- Be careful! This deletes all data
DELETE FROM question_papers;
DELETE FROM assignments;
```

## Troubleshooting Commands

### Check Node Version
```bash
node --version
# Should be >= 18.0.0
```

### Check npm Version
```bash
npm --version
```

### Clear npm Cache
```bash
npm cache clean --force
```

### Reinstall Dependencies
```bash
cd apps/frontend
rm -rf node_modules package-lock.json
npm install
```

### Check Port Usage (Windows)
```bash
netstat -ano | findstr :3000
```

### Kill Process on Port (Windows)
```bash
# Find PID from above command, then:
taskkill /PID <PID> /F
```

### View Vercel Logs (Real-time)
```bash
vercel logs --follow
```

### Check Build Output
```bash
cd apps/frontend
npm run build 2>&1 | tee build.log
```

## Useful Shortcuts

### Open Project in VS Code
```bash
code .
```

### Open Vercel Dashboard
```bash
vercel open
```

### Open Supabase Dashboard
```bash
# Visit: https://supabase.com/dashboard/project/azpgpqwkwrqmtyfjecse
```

### Open Google AI Studio
```bash
# Visit: https://makersuite.google.com/app/apikey
```

## Package Management

### Update All Dependencies
```bash
cd apps/frontend
npm update
```

### Check for Outdated Packages
```bash
npm outdated
```

### Install Specific Package
```bash
npm install <package-name>
```

### Install Dev Dependency
```bash
npm install --save-dev <package-name>
```

### Uninstall Package
```bash
npm uninstall <package-name>
```

### View Installed Packages
```bash
npm list --depth=0
```

## Quick Reference

### Get JWT Token (Browser Console)
```javascript
// Open DevTools → Console
localStorage.getItem('supabase.auth.token')
```

### Test API Route (Browser Console)
```javascript
fetch('/api/health')
  .then(r => r.json())
  .then(console.log)
```

### Check User Session (Browser Console)
```javascript
// In your app
import { createClient } from '@supabase/supabase-js'
const supabase = createClient(...)
supabase.auth.getSession().then(console.log)
```

## Environment Setup

### Required Environment Variables
```bash
# apps/frontend/.env.local

NEXT_PUBLIC_SUPABASE_URL=https://azpgpqwkwrqmtyfjecse.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
GEMINI_API_KEY=AIzaSy...
```

### Vercel Environment Variables (via Dashboard)
1. Go to project settings
2. Click "Environment Variables"
3. Add each variable
4. Select environments: Production, Preview, Development
5. Save

## Common Issues & Solutions

### Issue: Port 3000 already in use
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use different port
PORT=3001 npm run dev
```

### Issue: Module not found
```bash
cd apps/frontend
rm -rf node_modules package-lock.json
npm install
```

### Issue: TypeScript errors
```bash
npm run type-check
# Fix errors shown
```

### Issue: Build fails on Vercel
1. Check Vercel build logs
2. Verify environment variables are set
3. Test build locally: `npm run build`
4. Check for TypeScript errors

### Issue: API returns 401 Unauthorized
- Check JWT token is valid
- Check token is included in Authorization header
- Check user is logged in

### Issue: API returns 500 Internal Server Error
- Check Vercel function logs
- Verify SUPABASE_SERVICE_KEY is correct
- Check database connection

### Issue: Questions don't generate
- Verify GEMINI_API_KEY is valid
- Check Vercel function timeout (default 10s)
- View function logs for AI errors
- Check API quota limits

## Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Dependencies installed locally
- [ ] Build succeeds locally (`npm run build`)
- [ ] Environment variables documented
- [ ] Supabase service key obtained
- [ ] Gemini API key obtained
- [ ] Vercel project created
- [ ] Environment variables added to Vercel
- [ ] Deployment successful
- [ ] Supabase redirect URLs updated
- [ ] Signup flow tested
- [ ] Login flow tested
- [ ] Assignment creation tested
- [ ] Question generation tested
- [ ] All pages accessible

## Quick Deploy Script

```bash
#!/bin/bash
# Save as deploy.sh and run: bash deploy.sh

echo "🚀 Deploying VedaAI..."

# Navigate to frontend
cd apps/frontend

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build
echo "🔨 Building..."
npm run build

# Deploy to Vercel
echo "☁️ Deploying to Vercel..."
vercel --prod

echo "✅ Deployment complete!"
echo "🌐 Visit your app at the URL shown above"
```

---

**Pro Tip**: Bookmark this file for quick reference! 📌
