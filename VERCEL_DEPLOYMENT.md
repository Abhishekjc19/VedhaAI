# Vercel Deployment Guide

## Step 1: Add Environment Variables to Vercel

1. Go to your Vercel dashboard: https://vercel.com/dashboard
2. Select your VedaAI project
3. Go to "Settings" → "Environment Variables"
4. Add the following variables:

### Required Environment Variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://azpgpqwkwrqmtyfjecse.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF6cGdwcXdrd3JxbXR5ZmplY3NlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3ODY5MzIsImV4cCI6MjA5NTM2MjkzMn0.2UbwwB69vo6H2D-Fod9XS7SL1ZJeApwEf-OQ6eAzuUA
```

**Important**: Make sure to select "Production", "Preview", and "Development" for each variable.

## Step 2: Configure Build Settings

In your Vercel project settings:

1. **Framework Preset**: Next.js
2. **Root Directory**: `apps/frontend`
3. **Build Command**: `npm run build`
4. **Output Directory**: `.next`
5. **Install Command**: `npm install`

## Step 3: Redeploy

After adding the environment variables:

1. Go to "Deployments" tab
2. Click on the three dots (...) on the latest deployment
3. Click "Redeploy"
4. Check "Use existing Build Cache" (optional)
5. Click "Redeploy"

## Step 4: Verify Deployment

1. Once deployed, visit your Vercel URL
2. You should be redirected to the login page
3. Try creating a new account
4. Verify that you receive the confirmation email
5. Log in and test the application

## Troubleshooting

### Build Fails with "Module not found"
- Make sure `@supabase/supabase-js` is in `package.json` dependencies
- Try clearing the build cache and redeploying

### "Invalid API key" error
- Double-check the environment variables in Vercel
- Make sure there are no extra spaces or line breaks
- Verify the variables are set for the correct environment (Production/Preview)

### Authentication not working
- Check that the Supabase URL and key are correct
- Verify the SQL migration was run in Supabase
- Check browser console for any errors

### Redirect loop on login
- Clear browser cookies and cache
- Check that the AuthProvider is wrapping the app correctly
- Verify the ProtectedRoute component is working

## Post-Deployment Checklist

- [ ] Environment variables added to Vercel
- [ ] SQL migration run in Supabase
- [ ] Build successful
- [ ] Login page accessible
- [ ] Signup flow works
- [ ] Email confirmation received
- [ ] Can create assignments
- [ ] Logout works correctly
- [ ] Protected routes redirect properly

## Custom Domain (Optional)

To add a custom domain:

1. Go to "Settings" → "Domains"
2. Add your domain
3. Configure DNS records as instructed
4. Wait for DNS propagation (can take up to 48 hours)

## Monitoring

- Check "Analytics" tab for usage statistics
- Monitor "Logs" tab for any runtime errors
- Set up "Integrations" for error tracking (e.g., Sentry)
