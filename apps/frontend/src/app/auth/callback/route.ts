import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    // Exchange the code for a session
    // The Supabase client will handle this automatically
    return NextResponse.redirect(`${requestUrl.origin}/login?verified=true`);
  }

  // If no code, redirect to login with error
  return NextResponse.redirect(`${requestUrl.origin}/login?error=verification_failed`);
}
