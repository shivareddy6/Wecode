// app/api/submissions/route.ts
import { getLeetCodeCookies } from '@/lib/supabase/server';
import {
  submitSolution,
  checkSubmissionStatus,
  delay,
} from '@/lib/leetcode/client';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { problemSlug, lang, code, cookies } = await request.json();

    if (!problemSlug || !lang || !code || !cookies) {
      return NextResponse.json({ error: 'Missing required fields: problemSlug, lang, code, cookies' }, { status: 400 });
    }

    // 1. Submit the solution
    const submissionId = await submitSolution(problemSlug, lang, code, cookies);

    // 2. Poll for the result
    let result;
    const maxRetries = 10; // Poll for a maximum of 20 seconds
    for (let i = 0; i < maxRetries; i++) {
      await delay(2000); // Wait for 2 seconds
      result = await checkSubmissionStatus(submissionId, cookies);
      if (result.state === 'SUCCESS' || result.state === 'FAILURE') {
        break; // Exit loop if submission is complete
      }
    }

    return NextResponse.json(result);

  } catch (error: any) {
    console.error('Submission API error:', error);
    return NextResponse.json(
      { error: error.message || 'An unexpected error occurred during submission' },
      { status: 500 }
    );
  }
}
