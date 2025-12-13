'use client';

import { useState } from 'react';
import Editor from '@monaco-editor/react';
import { ProblemQueryResponse, LeetCodeCookies } from '@/lib/leetcode/client';
import { Button } from './ui/button';

interface SolveClientProps {
  problem: NonNullable<ProblemQueryResponse['data']['question']>;
  cookies: LeetCodeCookies;
}

export default function SolveClient({ problem, cookies }: SolveClientProps) {
  const [code, setCode] = useState(
    problem.codeSnippets.find(s => s.langSlug === 'python3')?.code || ''
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<any>(null);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmissionResult(null);

    try {
      const response = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemSlug: problem.titleSlug,
          lang: 'python3',
          code: code,
          cookies: cookies,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit');
      }

      setSubmissionResult(result);
    } catch (error: any) {
      setSubmissionResult({ error: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-8 p-8">
      <div>
        <h1 className="text-2xl font-bold mb-4">{problem.title}</h1>
        <div 
          className="prose dark:prose-invert" 
          dangerouslySetInnerHTML={{ __html: problem.content }}
        />
      </div>
      <div>
        <Editor
          height="60vh"
          language="python3"
          theme="vs-dark"
          value={code}
          onChange={(value) => setCode(value || '')}
          options={{ minimap: { enabled: false } }}
        />
        <div className="mt-4 flex justify-end items-center gap-4">
          {submissionResult && (
            <div className={`text-sm ${submissionResult.run_success ? 'text-green-500' : 'text-red-500'}`}>
              {submissionResult.status_msg}
              {submissionResult.run_success && ` (${submissionResult.total_correct}/${submissionResult.total_testcases})`}
              {submissionResult.error && `Error: ${submissionResult.error}`}
            </div>
          )}
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </Button>
        </div>
      </div>
    </div>
  );
}
