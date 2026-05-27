import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function GET(
  request: NextRequest,
  { params }: { params: { paperId: string } }
) {
  try {
    const { paperId } = params;

    const { data, error } = await supabase
      .from('question_papers')
      .select('*')
      .eq('id', paperId)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: 'Question paper not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error fetching question paper:', error);
    return NextResponse.json(
      { error: 'Failed to fetch question paper', details: error.message },
      { status: 500 }
    );
  }
}
