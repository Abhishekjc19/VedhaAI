# 🎓 VedaAI - AI Assessment Creator

> **Status**: ✅ READY TO DEPLOY - Backend fully migrated to Next.js API routes

An AI-powered platform that helps teachers create custom assessment question papers using Google Gemini AI.

## 🚀 Quick Start

### For Deployment (5 minutes)
1. Read [`QUICK_START.md`](./QUICK_START.md) - Deploy in 5 minutes
2. Or read [`READY_TO_DEPLOY.md`](./READY_TO_DEPLOY.md) - Detailed guide

### For Development
```bash
cd apps/frontend
npm install
npm run dev
```

## 📚 Documentation

### Essential Reading
- **[QUICK_START.md](./QUICK_START.md)** - 5-minute deployment guide
- **[READY_TO_DEPLOY.md](./READY_TO_DEPLOY.md)** - Complete deployment instructions
- **[DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)** - Step-by-step checklist

### Technical Documentation
- **[COMPLETE_SUMMARY.md](./COMPLETE_SUMMARY.md)** - Full project overview
- **[BACKEND_MIGRATION_COMPLETE.md](./BACKEND_MIGRATION_COMPLETE.md)** - Migration details
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System architecture diagrams
- **[COMMANDS_REFERENCE.md](./COMMANDS_REFERENCE.md)** - All commands you need

## ✨ Features

### ✅ Completed
- **User Authentication** - Signup, login, email verification
- **Assignment Creation** - Custom requirements and question types
- **AI Question Generation** - Powered by Google Gemini
- **Question Paper Display** - Structured, professional format
- **User Management** - Profile, logout, session handling
- **Responsive Design** - Works on desktop and mobile
- **Single Deployment** - Frontend + Backend in one Vercel project

### 🎯 Core Functionality
- Create assignments with custom parameters
- Generate questions using AI
- View structured question papers
- Manage assignments (create, view, delete)
- User-specific data isolation
- Real-time status tracking

## 🏗️ Architecture

```
Frontend (Next.js) → API Routes → Supabase + Gemini AI
```

**Single Vercel Project** - No separate backend server needed!

### Tech Stack
- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, TypeScript
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **AI**: Google Gemini API
- **Hosting**: Vercel
- **State Management**: Zustand

## 🔑 Environment Variables

### Required for Deployment

```env
NEXT_PUBLIC_SUPABASE_URL=https://azpgpqwkwrqmtyfjecse.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_KEY=<GET_FROM_SUPABASE_DASHBOARD>
GEMINI_API_KEY=<GET_FROM_GOOGLE_AI_STUDIO>
```

### Where to Get Keys

1. **Supabase Service Key**
   - Go to [Supabase Dashboard](https://supabase.com/dashboard)
   - Settings → API → Copy **service_role** key

2. **Gemini API Key**
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create API Key → Copy

## 📁 Project Structure

```
VedhaAI/
├── apps/
│   └── frontend/                    # Main application
│       ├── src/
│       │   ├── app/
│       │   │   ├── api/            # Backend API routes ⭐
│       │   │   ├── login/
│       │   │   ├── signup/
│       │   │   ├── assignments/
│       │   │   └── create/
│       │   ├── components/
│       │   ├── contexts/
│       │   └── services/
│       ├── .env.local
│       └── package.json
│
├── QUICK_START.md                  # ⭐ Start here!
├── READY_TO_DEPLOY.md
├── DEPLOYMENT_CHECKLIST.md
├── COMPLETE_SUMMARY.md
├── ARCHITECTURE.md
└── COMMANDS_REFERENCE.md
```

## 🎯 API Endpoints

All endpoints are under `/api`:

- `GET /api/health` - Health check
- `POST /api/assignments` - Create assignment
- `GET /api/assignments` - List assignments
- `GET /api/assignments/:id` - Get assignment
- `DELETE /api/assignments/:id` - Delete assignment
- `POST /api/assignments/:id/generate` - Generate questions
- `GET /api/question-papers/:paperId` - Get question paper

## 🚀 Deployment

### Option 1: Vercel Dashboard (Recommended)

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Configure:
   - Root Directory: `apps/frontend`
   - Framework: Next.js
4. Add environment variables (see above)
5. Deploy!

### Option 2: Vercel CLI

```bash
cd apps/frontend
vercel
```

### Post-Deployment

Update Supabase redirect URLs:
1. Go to Supabase → Authentication → URL Configuration
2. Add: `https://your-app.vercel.app/auth/callback`

## 🧪 Testing

### Local Testing
```bash
cd apps/frontend
npm run dev
```

Visit http://localhost:3000

### Production Testing
1. Sign up with new account
2. Verify email
3. Login
4. Create assignment
5. Generate questions
6. View question paper

## 📊 Database Schema

### Tables
- `auth.users` - User accounts (Supabase Auth)
- `assignments` - Assignment metadata
- `question_papers` - Generated questions

### Relationships
```
users (1) → (N) assignments (1) → (1) question_papers
```

## 🔒 Security

- ✅ HTTPS (automatic with Vercel)
- ✅ JWT authentication
- ✅ Row Level Security (RLS)
- ✅ Environment variables for secrets
- ✅ User data isolation
- ✅ Email verification

## 🎨 UI/UX

- Modern, clean design
- Black buttons with purple accents
- Responsive layout
- Professional empty states
- Loading states
- Error handling
- Success notifications

## 📈 Performance

- Code splitting (Next.js automatic)
- Image optimization
- Serverless functions
- Global CDN (Vercel)
- Database connection pooling

## 🐛 Troubleshooting

### Build Fails
- Check environment variables are set
- Run `npm run type-check`
- Check Vercel build logs

### API Errors
- Verify `SUPABASE_SERVICE_KEY` is correct
- Verify `GEMINI_API_KEY` is valid
- Check Vercel function logs

### Authentication Issues
- Check Supabase redirect URLs
- Verify email confirmation is enabled
- Check browser console

See [`COMMANDS_REFERENCE.md`](./COMMANDS_REFERENCE.md) for more troubleshooting.

## 📝 Assignment Requirements

### ✅ All Requirements Met

**Core Features**
- ✅ Assignment creation form with validation
- ✅ AI question generation (Google Gemini)
- ✅ Structured output (sections, questions, difficulty)
- ✅ Backend system (Next.js API routes)
- ✅ Database (Supabase PostgreSQL)
- ✅ Professional output page

**Tech Stack**
- ✅ Next.js + TypeScript
- ✅ Zustand state management
- ✅ Node.js backend (API routes)
- ✅ PostgreSQL database
- ✅ AI integration

**Bonus Features**
- ✅ User authentication
- ✅ Email verification
- ✅ Responsive design
- ✅ Status tracking
- ✅ Error handling

## 🎓 What Changed?

### Before
- ❌ Two separate Vercel projects
- ❌ Express backend
- ❌ MongoDB
- ❌ CORS configuration

### After
- ✅ Single Vercel project
- ✅ Next.js API routes
- ✅ Supabase (PostgreSQL)
- ✅ No CORS issues

## 🔮 Future Enhancements

- PDF export
- File upload processing
- Redis caching
- Background job queue
- WebSocket real-time updates
- Question bank library
- Analytics dashboard

## 📞 Support

### Documentation
- Read the docs in this repository
- Check [`DEPLOYMENT_CHECKLIST.md`](./DEPLOYMENT_CHECKLIST.md)
- See [`COMMANDS_REFERENCE.md`](./COMMANDS_REFERENCE.md)

### Logs
- Vercel: Check function logs in dashboard
- Supabase: Check logs in dashboard
- Browser: Check console for errors

## 🎉 Success Criteria

Deployment is successful when:
- ✅ All tests pass
- ✅ Users can sign up and login
- ✅ Users can create assignments
- ✅ AI generates questions
- ✅ Question papers display correctly
- ✅ All navigation works
- ✅ Mobile responsive

## 📄 License

This project is for educational purposes.

## 👥 Contributors

- Full Stack Engineer Assignment

---

## 🚀 Ready to Deploy?

1. **Read**: [`QUICK_START.md`](./QUICK_START.md)
2. **Get**: API keys (Supabase + Gemini)
3. **Deploy**: To Vercel
4. **Test**: All functionality
5. **Share**: Your deployment URL!

**Everything is ready. Let's deploy! 🎉**

---

## Quick Links

- [Vercel Dashboard](https://vercel.com/dashboard)
- [Supabase Dashboard](https://supabase.com/dashboard/project/azpgpqwkwrqmtyfjecse)
- [Google AI Studio](https://makersuite.google.com/app/apikey)
- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)

---

**Last Updated**: May 27, 2026  
**Status**: ✅ Production Ready  
**Version**: 1.0.0
