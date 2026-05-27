import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

// Mark this route as dynamic
export const dynamic = 'force-dynamic';

// Helper function to get user from request
async function getUserFromRequest(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) return null;

  const token = authHeader.replace('Bearer ', '');
  
  // Create a client with the user's token
  const userSupabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: { user }, error } = await userSupabase.auth.getUser(token);
  
  if (error || !user) return null;
  return user;
}

export async function POST(request: NextRequest) {
  try {
    console.log('[API] Creating assignment...');
    
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_KEY!
    );

    console.log('[API] Supabase client created');

    const body = await request.json();
    console.log('[API] Request body:', JSON.stringify(body, null, 2));
    
    const {
      title,
      topic,
      description,
      dueDate,
      questionTypes,
      numberOfQuestions,
      totalMarks,
      additionalInstructions,
    } = body;

    // Get user from auth header
    const user = await getUserFromRequest(request);
    const userId = user?.id || 'anonymous';
    console.log('[API] User ID:', userId);

    const assignmentId = uuidv4();
    console.log('[API] Generated assignment ID:', assignmentId);

    const insertData = {
      id: assignmentId,
      user_id: userId,
      title,
      topic,
      description,
      due_date: dueDate,
      question_types: questionTypes,
      number_of_questions: numberOfQuestions,
      total_marks: totalMarks,
      additional_instructions: additionalInstructions,
      status: 'draft',
      questions_generated: false,
    };
    
    console.log('[API] Inserting data:', JSON.stringify(insertData, null, 2));

    const { data, error } = await supabase
      .from('assignments')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error('[API] Supabase error:', error);
      throw error;
    }

    console.log('[API] Assignment created successfully:', data);
    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    console.error('[API] Error creating assignment:', error);
    console.error('[API] Error details:', {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint,
    });
    return NextResponse.json(
      { 
        error: 'Failed to create assignment', 
        details: error.message,
        code: error.code,
        hint: error.hint 
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_KEY!
    );

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // Get user from auth header
    const user = await getUserFromRequest(request);
    const userId = user?.id || 'anonymous';

    const { data, error } = await supabase
      .from('assignments')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(skip, skip + limit - 1);

    if (error) throw error;

    return NextResponse.json({
      data: data || [],
      page,
      limit,
    });
  } catch (error: any) {
    console.error('Error listing assignments:', error);
    return NextResponse.json(
      { error: 'Failed to list assignments', details: error.message },
      { status: 500 }
    );
  }
}
