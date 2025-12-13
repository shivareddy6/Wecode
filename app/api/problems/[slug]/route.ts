// app/api/problems/[slug]/route.ts
import { getLeetCodeCookies } from '@/lib/supabase/server';
import { fetchProblem } from '@/lib/leetcode/client';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params: paramsPromise }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await paramsPromise;

  if (!slug) {
    return NextResponse.json({ error: 'Problem slug is required' }, { status: 400 });
  }

  try {
    const cookies = await getLeetCodeCookies();

    if (!cookies) {
      return NextResponse.json(
        { error: 'LeetCode session not configured. Please sync your cookies via the extension.' },
        { status: 403 }
      );
    }

    // Fetch the problem data from LeetCode using the proxy client
    const problemData = await fetchProblem(slug, cookies);

    return NextResponse.json(problemData.data.question);

  } catch (error: any) {
    console.error(`Failed to fetch problem "${slug}":`, error);
    return NextResponse.json(
      { error: error.message || 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
