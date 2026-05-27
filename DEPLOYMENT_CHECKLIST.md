# ✅ Deployment Checklist

## Pre-Deployment

### Code Preparation
- [x] Backend migrated to Next.js API routes
- [x] All dependencies installed
- [x] Environment variables documented
- [x] TypeScript errors fixed
- [x] Build tested locally
- [ ] Code pushed to GitHub

### API Keys & Credentials
- [x] Supabase URL (already configured)
- [x] Supabase Anon Key (already configured)
- [ ] **Supabase Service Key** (YOU NEED TO GET THIS)
- [ ] **Gemini API Key** (YOU NEED TO GET THIS)

### Database Setup
- [x] Supabase project created
- [x] Database tables created (assignments, question_papers)
- [x] Row Level Security (RLS) enabled
- [x] RLS policies configured
- [x] Auth configured

## Getting API Keys

### 1. Supabase Service Key
- [ ] Go to https://supabase.com/dashboard
- [ ] Select your project
- [ ] Navigate to **Settings** → **API**
- [ ] Copy the **service_role** key (NOT anon key!)
- [ ] Save it securely (you'll need it for Vercel)

### 2. Gemini API Key
- [ ] Go to https://makersuite.google.com/app/apikey
- [ ] Sign in with Google account
- [ ] Click "Create API Key"
- [ ] Copy the key
- [ ] Save it securely (you'll need it for Vercel)

## Vercel Deployment

### Setup
- [ ] Create Vercel account (if not already)
- [ ] Connect GitHub account to Vercel
- [ ] Import repository

### Configuration
- [ ] Set Framework Preset: **Next.js**
- [ ] Set Root Directory: **apps/frontend**
- [ ] Set Build Command: **npm run build**
- [ ] Set Output Directory: **.next**

### Environment Variables
Add these in Vercel project settings:

- [ ] `NEXT_PUBLIC_SUPABASE_URL`
  ```
  https://azpgpqwkwrqmtyfjecse.supabase.co
  ```

- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  ```
  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF6cGdwcXdrd3JxbXR5ZmplY3NlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3ODY5MzIsImV4cCI6MjA5NTM2MjkzMn0.2UbwwB69vo6H2D-Fod9XS7SL1ZJeApwEf-OQ6eAzuUA
  ```

- [ ] `SUPABASE_SERVICE_KEY`
  ```
  <PASTE YOUR SERVICE ROLE KEY HERE>
  ```

- [ ] `GEMINI_API_KEY`
  ```
  <PASTE YOUR GEMINI API KEY HERE>
  ```

### Deploy
- [ ] Click "Deploy" button
- [ ] Wait for build to complete (2-5 minutes)
- [ ] Note your deployment URL

## Post-Deployment

### Supabase Configuration
- [ ] Go to Supabase Dashboard
- [ ] Navigate to **Authentication** → **URL Configuration**
- [ ] Add to **Redirect URLs**:
  ```
  https://your-app-name.vercel.app/auth/callback
  ```
- [ ] Update **Site URL**:
  ```
  https://your-app-name.vercel.app
  ```
- [ ] Save changes

### Testing

#### 1. Basic Functionality
- [ ] Visit your deployment URL
- [ ] Homepage loads correctly
- [ ] No console errors

#### 2. Authentication Flow
- [ ] Click "Sign Up"
- [ ] Enter email, password, full name
- [ ] Submit form
- [ ] Check email for verification link
- [ ] Click verification link
- [ ] Redirected to login page
- [ ] See success message
- [ ] Login with credentials
- [ ] Redirected to dashboard
- [ ] User name displays correctly in sidebar

#### 3. Assignment Creation
- [ ] Click "Create Assignment" or navigate to /create
- [ ] Fill out form:
  - [ ] Title
  - [ ] Topic
  - [ ] Description (optional)
  - [ ] Due date
  - [ ] Question types (select at least one)
  - [ ] Number of questions per type
  - [ ] Total questions updates automatically
  - [ ] Total marks updates automatically
  - [ ] Additional instructions (optional)
- [ ] Click "Create Assignment"
- [ ] See success message
- [ ] Redirected to assignments list
- [ ] New assignment appears in list

#### 4. Question Generation
- [ ] Click "Generate" on an assignment
- [ ] See loading state
- [ ] Wait for generation (may take 10-30 seconds)
- [ ] Question paper displays
- [ ] Sections are visible
- [ ] Questions have:
  - [ ] Question text
  - [ ] Marks
  - [ ] Difficulty tag
  - [ ] Proper formatting

#### 5. Assignment Management
- [ ] View assignments list
- [ ] Click on assignment card
- [ ] View assignment details
- [ ] Delete an assignment
- [ ] Confirm deletion works

#### 6. Navigation
- [ ] Click "Home" - works
- [ ] Click "My Groups" - works
- [ ] Click "Assignments" - works
- [ ] Click "AI Teacher's Toolkit" - works
- [ ] Click "My Library" - works
- [ ] Click "Settings" - works
- [ ] Logout button works

#### 7. Mobile Responsiveness
- [ ] Open on mobile device or use DevTools mobile view
- [ ] Sidebar collapses on mobile
- [ ] Forms are usable
- [ ] Cards stack properly
- [ ] Text is readable

## Troubleshooting

### Build Fails
- [ ] Check Vercel build logs
- [ ] Verify all environment variables are set
- [ ] Test build locally: `npm run build`
- [ ] Check for TypeScript errors: `npm run type-check`

### API Errors (500)
- [ ] Check Vercel function logs
- [ ] Verify `SUPABASE_SERVICE_KEY` is correct (service_role, not anon)
- [ ] Verify `GEMINI_API_KEY` is valid
- [ ] Check database tables exist

### Authentication Fails
- [ ] Verify redirect URLs in Supabase match deployment URL
- [ ] Check email confirmation is enabled in Supabase
- [ ] Check browser console for errors
- [ ] Verify anon key is correct

### Questions Don't Generate
- [ ] Verify `GEMINI_API_KEY` is valid
- [ ] Check Vercel function timeout (default 10s, may need Pro for longer)
- [ ] View Vercel function logs for AI errors
- [ ] Check Gemini API quota/limits

### Database Errors
- [ ] Verify tables exist in Supabase
- [ ] Check RLS policies are configured
- [ ] Verify service key has proper permissions
- [ ] Check Supabase logs

## Performance Checks

- [ ] Page load time < 3 seconds
- [ ] API responses < 1 second (except AI generation)
- [ ] No console errors
- [ ] No console warnings (or acceptable ones)
- [ ] Images load properly
- [ ] Fonts load properly

## Security Checks

- [ ] HTTPS enabled (automatic with Vercel)
- [ ] Environment variables not exposed in frontend
- [ ] Service key only used in API routes
- [ ] RLS policies working (users can't see others' data)
- [ ] Authentication required for protected routes
- [ ] No sensitive data in console logs

## Documentation

- [ ] README.md updated
- [ ] Deployment URL documented
- [ ] Environment variables documented
- [ ] API endpoints documented
- [ ] Known issues documented (if any)

## Optional Enhancements

- [ ] Custom domain configured
- [ ] Analytics added (Vercel Analytics)
- [ ] Error tracking (Sentry)
- [ ] Performance monitoring
- [ ] SEO optimization
- [ ] Social media preview images

## Final Steps

- [ ] Share deployment URL with stakeholders
- [ ] Document any issues encountered
- [ ] Create backup of environment variables
- [ ] Set up monitoring/alerts
- [ ] Plan for future enhancements

## Success Criteria

✅ **Deployment is successful when:**
- All tests pass
- No critical errors
- Users can sign up and login
- Users can create assignments
- AI generates questions successfully
- Question papers display correctly
- All navigation works
- Mobile responsive

## Deployment URL

Once deployed, add your URL here:

```
Production URL: https://_____________________.vercel.app
```

## Notes

Add any deployment notes, issues, or observations here:

```
Date: _______________
Deployed by: _______________
Notes:
- 
- 
- 
```

---

## Quick Reference

### Vercel Dashboard
https://vercel.com/dashboard

### Supabase Dashboard
https://supabase.com/dashboard/project/azpgpqwkwrqmtyfjecse

### Google AI Studio
https://makersuite.google.com/app/apikey

### GitHub Repository
https://github.com/YOUR_USERNAME/VedhaAI

---

**Status**: Ready to deploy! 🚀

**Next Step**: Get your API keys and deploy to Vercel!
