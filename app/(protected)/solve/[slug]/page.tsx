// app/(protected)/solve/[slug]/page.tsx
import { getLeetCodeCookies } from '@/lib/supabase/server';
import { fetchProblem, LeetCodeCookies } from '@/lib/leetcode/client';
import { notFound } from 'next/navigation';
import SolveClient from '@/components/SolveClient';

// This is the main server component for the solve page.
// It fetches the initial problem data and then passes it to a client component.

async function getProblemData(slug: string, cookies: LeetCodeCookies) {
  try {
    const problemData = await fetchProblem(slug, cookies);
    return problemData.data.question;
  } catch (error) {
    console.error(`Failed to fetch problem data for ${slug}:`, error);
    return null;
  }
}

export default async function SolvePage({ params: paramsPromise }: { params: Promise<{ slug: string }> }) {
  const { slug } = await paramsPromise;
  const cookies = await getLeetCodeCookies();
  
  if (!cookies) {
    throw new Error('LeetCode session not configured.');
  }

  const problem = await getProblemData(slug, cookies);

  if (!problem) {
    return notFound();
  }

  return <SolveClient problem={problem} cookies={cookies} />;
}
