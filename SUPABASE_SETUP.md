# Supabase Setup Guide for VedaAI

## Step 1: Run the SQL Migration

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project: `azpgpqwkwrqmtyfjecse`
3. Click on "SQL Editor" in the left sidebar
4. Click "New Query"
5. Copy and paste the contents of `supabase_auth_setup.sql`
6. Click "Run" to execute the migration

This will create:
- `users` table with proper authentication integration
- `assignments` table for storing question papers
- `questions` table for storing individual questions
- Row Level Security (RLS) policies for data protection
- Automatic triggers for user creation and timestamp updates

## Step 2: Configure Email Authentication

1. Go to "Authentication" → "Providers" in your Supabase dashboard
2. Make sure "Email" provider is enabled
3. Configure email templates (optional):
   - Go to "Authentication" → "Email Templates"
   - Customize the confirmation email template

## Step 3: Environment Variables

The `.env.local` file has been created with your credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://azpgpqwkwrqmtyfjecse.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Step 4: Test the Authentication

1. Start the development server:
   ```bash
   cd apps/frontend
   npm install
   npm run dev
   ```

2. Navigate to http://localhost:3000
3. You should be redirected to the login page
4. Click "Sign up" to create a new account
5. Check your email for the confirmation link
6. After confirming, log in with your credentials

## Database Schema

### users table
- `id` (UUID) - Primary key, references auth.users
- `email` (TEXT) - User email
- `school_name` (TEXT) - Optional school name
- `avatar_url` (TEXT) - Optional profile picture
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### assignments table
- `id` (UUID) - Primary key
- `user_id` (UUID) - Foreign key to users
- `title` (TEXT) - Assignment title
- `topic` (TEXT) - Subject/topic
- `description` (TEXT) - Optional description
- `due_date` (TIMESTAMP) - Due date
- `status` (TEXT) - draft, processing, completed, failed
- `question_types` (TEXT[]) - Array of question types
- `number_of_questions` (INTEGER)
- `total_marks` (INTEGER)
- `additional_instructions` (TEXT)
- `questions_generated` (BOOLEAN)
- `question_paper_id` (UUID)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### questions table
- `id` (UUID) - Primary key
- `assignment_id` (UUID) - Foreign key to assignments
- `question_type` (TEXT) - Type of question
- `content` (TEXT) - Question text
- `difficulty` (TEXT) - Easy, Medium, Hard
- `marks` (INTEGER) - Points for this question
- `answer` (TEXT) - Optional answer
- `explanation` (TEXT) - Optional explanation
- `section` (TEXT) - Section name
- `order_index` (INTEGER) - Order in the paper
- `created_at` (TIMESTAMP)

## Security Features

- **Row Level Security (RLS)**: Enabled on all tables
- **User Isolation**: Users can only access their own data
- **Automatic User Creation**: New auth users automatically get a profile
- **Cascade Deletes**: Deleting a user removes all their data

## Troubleshooting

### Issue: "Invalid API key"
- Check that your `.env.local` file has the correct credentials
- Restart the development server after changing environment variables

### Issue: "User not found in database"
- Make sure the SQL migration ran successfully
- Check that the trigger `on_auth_user_created` exists
- Try creating a new user account

### Issue: "Permission denied"
- Verify RLS policies are created correctly
- Check that you're logged in with the correct user
- Review the policies in Supabase Dashboard → Authentication → Policies

## Next Steps

1. Run the SQL migration in Supabase
2. Install dependencies: `npm install` in the frontend folder
3. Start the dev server: `npm run dev`
4. Create a test account and verify everything works
5. Deploy to Vercel with the environment variables configured
