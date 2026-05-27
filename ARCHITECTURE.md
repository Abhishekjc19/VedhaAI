# 🏗️ VedaAI Architecture

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                            │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │  Login Page  │  │  Dashboard   │  │ Create Form  │        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │              React Components + Zustand                  │  │
│  └─────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTPS
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    VERCEL (Single Project)                      │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │                   Next.js Frontend                       │  │
│  │  • Server-Side Rendering (SSR)                          │  │
│  │  • Static Site Generation (SSG)                         │  │
│  │  • Client-Side Routing                                  │  │
│  │  • React Components                                     │  │
│  └─────────────────────────────────────────────────────────┘  │
│                              │                                  │
│                              │ Internal                         │
│                              ↓                                  │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │              Next.js API Routes (Backend)                │  │
│  │                                                          │  │
│  │  /api/health                                            │  │
│  │  /api/assignments                                       │  │
│  │  /api/assignments/[id]                                  │  │
│  │  /api/assignments/[id]/generate                         │  │
│  │  /api/question-papers/[paperId]                         │  │
│  │                                                          │  │
│  │  • Authentication (JWT)                                 │  │
│  │  • Business Logic                                       │  │
│  │  • Data Validation                                      │  │
│  │  • Error Handling                                       │  │
│  └─────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                    │                        │
                    │                        │
        ┌───────────┘                        └───────────┐
        │                                                │
        ↓                                                ↓
┌──────────────────┐                          ┌──────────────────┐
│    SUPABASE      │                          │  GOOGLE GEMINI   │
│                  │                          │                  │
│  ┌────────────┐  │                          │  ┌────────────┐  │
│  │ PostgreSQL │  │                          │  │   AI API   │  │
│  │            │  │                          │  │            │  │
│  │ • users    │  │                          │  │ • Generate │  │
│  │ • assign.  │  │                          │  │   Questions│  │
│  │ • papers   │  │                          │  │ • Parse    │  │
│  └────────────┘  │                          │  │   Response │  │
│                  │                          │  └────────────┘  │
│  ┌────────────┐  │                          └──────────────────┘
│  │    Auth    │  │
│  │            │  │
│  │ • Login    │  │
│  │ • Signup   │  │
│  │ • JWT      │  │
│  └────────────┘  │
└──────────────────┘
```

## Data Flow

### 1. User Authentication Flow

```
User enters credentials
        ↓
Frontend (Login Page)
        ↓
Supabase Auth API
        ↓
Verify credentials
        ↓
Generate JWT token
        ↓
Store in AuthContext
        ↓
Redirect to Dashboard
```

### 2. Create Assignment Flow

```
User fills form
        ↓
Frontend validates input
        ↓
POST /api/assignments
        ↓
API Route validates data
        ↓
Extract user ID from JWT
        ↓
Insert into Supabase
        ↓
Return assignment object
        ↓
Update UI with new assignment
```

### 3. Generate Questions Flow

```
User clicks "Generate"
        ↓
POST /api/assignments/:id/generate
        ↓
API Route fetches assignment
        ↓
Update status to "processing"
        ↓
Build AI prompt
        ↓
Call Google Gemini API
        ↓
Receive AI response
        ↓
Parse JSON from response
        ↓
Save to question_papers table
        ↓
Update assignment status to "completed"
        ↓
Return question paper ID
        ↓
Frontend redirects to view page
```

## Component Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        App Layout                           │
│  ┌───────────────────────────────────────────────────────┐ │
│  │                    MainLayout                         │ │
│  │  ┌──────────┐  ┌──────────────────────────────────┐  │ │
│  │  │          │  │                                  │  │ │
│  │  │ Sidebar  │  │        Page Content              │  │ │
│  │  │          │  │                                  │  │ │
│  │  │ • Home   │  │  ┌────────────────────────────┐  │  │ │
│  │  │ • Groups │  │  │                            │  │  │ │
│  │  │ • Assign │  │  │   AssignmentCard           │  │  │ │
│  │  │ • Toolkit│  │  │   AssignmentCard           │  │  │ │
│  │  │ • Library│  │  │   AssignmentCard           │  │  │ │
│  │  │          │  │  │                            │  │  │ │
│  │  │ [User]   │  │  └────────────────────────────┘  │  │ │
│  │  └──────────┘  │                                  │  │ │
│  │                └──────────────────────────────────┘  │ │
│  └───────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## State Management

```
┌─────────────────────────────────────────────────────────────┐
│                      Zustand Store                          │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Assignment Store                       │   │
│  │                                                     │   │
│  │  State:                                            │   │
│  │  • assignments: Assignment[]                       │   │
│  │  • loading: boolean                                │   │
│  │  • error: string | null                            │   │
│  │                                                     │   │
│  │  Actions:                                          │   │
│  │  • fetchAssignments()                              │   │
│  │  • createAssignment(data)                          │   │
│  │  • deleteAssignment(id)                            │   │
│  │  • generateQuestions(id)                           │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Auth Context                           │   │
│  │                                                     │   │
│  │  State:                                            │   │
│  │  • user: User | null                               │   │
│  │  • session: Session | null                         │   │
│  │  • loading: boolean                                │   │
│  │                                                     │   │
│  │  Actions:                                          │   │
│  │  • signUp(email, password, fullName)               │   │
│  │  • signIn(email, password)                         │   │
│  │  • signOut()                                       │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## API Route Structure

```
/api
├── health/
│   └── route.ts
│       └── GET → { status: "ok", timestamp }
│
├── assignments/
│   ├── route.ts
│   │   ├── POST → Create assignment
│   │   └── GET → List assignments (paginated)
│   │
│   └── [id]/
│       ├── route.ts
│       │   ├── GET → Get assignment details
│       │   └── DELETE → Delete assignment
│       │
│       └── generate/
│           └── route.ts
│               └── POST → Generate questions with AI
│
└── question-papers/
    └── [paperId]/
        └── route.ts
            └── GET → Get question paper
```

## Database Schema

```
┌─────────────────────────────────────────────────────────────┐
│                         SUPABASE                            │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                  auth.users                         │   │
│  │  • id (UUID, PK)                                    │   │
│  │  • email (TEXT)                                     │   │
│  │  • encrypted_password (TEXT)                        │   │
│  │  • email_confirmed_at (TIMESTAMP)                   │   │
│  │  • raw_user_meta_data (JSONB)                       │   │
│  │    └─ full_name (TEXT)                              │   │
│  └─────────────────────────────────────────────────────┘   │
│                          │                                  │
│                          │ 1:N                              │
│                          ↓                                  │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                  assignments                        │   │
│  │  • id (UUID, PK)                                    │   │
│  │  • user_id (UUID, FK)                               │   │
│  │  • title (TEXT)                                     │   │
│  │  • topic (TEXT)                                     │   │
│  │  • description (TEXT)                               │   │
│  │  • due_date (TIMESTAMP)                             │   │
│  │  • question_types (JSONB)                           │   │
│  │  • number_of_questions (INTEGER)                    │   │
│  │  • total_marks (INTEGER)                            │   │
│  │  • additional_instructions (TEXT)                   │   │
│  │  • status (TEXT)                                    │   │
│  │  • questions_generated (BOOLEAN)                    │   │
│  │  • question_paper_id (TEXT, FK)                     │   │
│  │  • created_at (TIMESTAMP)                           │   │
│  │  • updated_at (TIMESTAMP)                           │   │
│  └─────────────────────────────────────────────────────┘   │
│                          │                                  │
│                          │ 1:1                              │
│                          ↓                                  │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              question_papers                        │   │
│  │  • id (TEXT, PK)                                    │   │
│  │  • assignment_id (UUID, FK)                         │   │
│  │  • sections (JSONB)                                 │   │
│  │    └─ [                                             │   │
│  │         {                                           │   │
│  │           title: "Section A",                       │   │
│  │           instruction: "Attempt all",               │   │
│  │           questions: [                              │   │
│  │             {                                       │   │
│  │               questionText: "...",                  │   │
│  │               marks: 5,                             │   │
│  │               difficulty: "easy",                   │   │
│  │               type: "mcq"                           │   │
│  │             }                                       │   │
│  │           ]                                         │   │
│  │         }                                           │   │
│  │       ]                                             │   │
│  │  • created_at (TIMESTAMP)                           │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Security Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Security Layers                        │
│                                                             │
│  Layer 1: HTTPS                                            │
│  ├─ All traffic encrypted                                  │
│  └─ Vercel automatic SSL                                   │
│                                                             │
│  Layer 2: Authentication                                   │
│  ├─ JWT tokens via Supabase                                │
│  ├─ Email verification required                            │
│  └─ Secure password hashing                                │
│                                                             │
│  Layer 3: Authorization                                    │
│  ├─ Row Level Security (RLS) in Supabase                   │
│  ├─ User can only access own data                          │
│  └─ API routes verify JWT token                            │
│                                                             │
│  Layer 4: Data Protection                                  │
│  ├─ Environment variables for secrets                      │
│  ├─ Service key only in API routes (server-side)           │
│  ├─ Anon key in frontend (client-side)                     │
│  └─ No sensitive data in frontend code                     │
│                                                             │
│  Layer 5: Input Validation                                 │
│  ├─ Frontend validation (React Hook Form + Zod)            │
│  ├─ Backend validation (API routes)                        │
│  └─ Database constraints                                   │
└─────────────────────────────────────────────────────────────┘
```

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         GITHUB                              │
│                    (Source Control)                         │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ Git Push
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                         VERCEL                              │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Build Process                          │   │
│  │  1. Clone repository                                │   │
│  │  2. Install dependencies (npm install)              │   │
│  │  3. Build Next.js app (npm run build)               │   │
│  │  4. Optimize assets                                 │   │
│  │  5. Deploy to edge network                          │   │
│  └─────────────────────────────────────────────────────┘   │
│                              │                              │
│                              ↓                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │           Production Deployment                     │   │
│  │                                                     │   │
│  │  • Static pages → CDN                               │   │
│  │  • API routes → Serverless functions               │   │
│  │  • Assets → Edge cache                              │   │
│  │  • Environment variables → Encrypted storage       │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Global CDN                             │   │
│  │  • Multiple edge locations                          │   │
│  │  • Automatic SSL                                    │   │
│  │  • DDoS protection                                  │   │
│  │  • Automatic scaling                                │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Technology Stack

```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend Stack                         │
│                                                             │
│  • Next.js 14 (React Framework)                            │
│  • React 18 (UI Library)                                   │
│  • TypeScript (Type Safety)                                │
│  • Tailwind CSS (Styling)                                  │
│  • Zustand (State Management)                              │
│  • React Hook Form (Form Handling)                         │
│  • Zod (Validation)                                        │
│  • Axios (HTTP Client)                                     │
│  • Lucide React (Icons)                                    │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                      Backend Stack                          │
│                                                             │
│  • Next.js API Routes (Backend Framework)                  │
│  • TypeScript (Type Safety)                                │
│  • Supabase Client (Database)                              │
│  • Google Generative AI (AI Integration)                   │
│  • UUID (ID Generation)                                    │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    External Services                        │
│                                                             │
│  • Supabase (Database + Auth)                              │
│  • Google Gemini (AI API)                                  │
│  • Vercel (Hosting + Deployment)                           │
└─────────────────────────────────────────────────────────────┘
```

## Performance Optimizations

```
┌─────────────────────────────────────────────────────────────┐
│                   Performance Features                      │
│                                                             │
│  Frontend:                                                 │
│  • Code splitting (automatic via Next.js)                  │
│  • Image optimization (Next.js Image component)            │
│  • Static page generation (SSG)                            │
│  • Client-side caching (React Query potential)             │
│  • Lazy loading components                                 │
│                                                             │
│  Backend:                                                  │
│  • Serverless functions (auto-scaling)                     │
│  • Database connection pooling (Supabase)                  │
│  • API response caching (can be added)                     │
│  • Efficient database queries                              │
│                                                             │
│  Infrastructure:                                           │
│  • Global CDN (Vercel Edge Network)                        │
│  • Automatic SSL/TLS                                       │
│  • HTTP/2 support                                          │
│  • Gzip compression                                        │
└─────────────────────────────────────────────────────────────┘
```

---

This architecture provides:
- ✅ Scalability (serverless + CDN)
- ✅ Security (multiple layers)
- ✅ Performance (optimizations)
- ✅ Maintainability (clean structure)
- ✅ Cost-effectiveness (single deployment)
