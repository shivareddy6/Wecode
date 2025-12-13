// lib/leetcode/client.ts

/**
 * ==================================================================
 * TYPES
 * ==================================================================
 */

// Basic cookie structure
export interface LeetCodeCookies {
  LEETCODE_SESSION: string;
  csrftoken: string;
}

// Structure for the GraphQL request to LeetCode
export interface GraphQLRequest {
  query: string;
  variables: Record<string, any>;
  operationName: string;
}

// Type for the response of a problem query
export interface ProblemQueryResponse {
  data: {
    question: {
      questionId: string;
      title: string;
      titleSlug: string;
      content: string;
      difficulty: 'Easy' | 'Medium' | 'Hard';
      exampleTestcases: string;
      codeSnippets: {
        lang: string;
        langSlug: string;
        code: string;
      }[];
    };
  };
}

// Type for the response of a submission (REST API)
export interface SubmissionResponse {
  submission_id: number;
}

// Type for the response of a submission status check
export interface SubmissionStatusResponse {
  state: 'PENDING' | 'STARTED' | 'SUCCESS' | 'FAILURE';
  status_msg: string;
  run_success?: boolean;
  total_correct?: number;
  total_testcases?: number;
  runtime_error?: string;
  full_runtime_error?: string;
  code_answer?: string[];
  status_runtime?: string;
  // Other fields can be added as needed
}

/**
 * ==================================================================
 * CONSTANTS
 * ==================================================================
 */

const LEETCODE_GRAPHQL_URL = 'https://leetcode.com/graphql';

/**
 * ==================================================================
 * UTILITY FUNCTIONS
 * ==================================================================
 */

const GET_PROBLEM_QUERY = `
  query questionData($titleSlug: String!) {
    question(titleSlug: $titleSlug) {
      questionId
      title
      titleSlug
      content
      difficulty
      exampleTestcases
      codeSnippets {
        lang
        langSlug
        code
      }
    }
  }
`;

/**
 * Fetches a problem's details from LeetCode.
 * @param slug The title slug of the problem (e.g., "two-sum").
 * @param cookies The user's LeetCode session cookies.
 * @returns The problem data.
 */
export async function fetchProblem(
  slug: string,
  cookies: LeetCodeCookies
): Promise<ProblemQueryResponse> {
  const requestBody: GraphQLRequest = {
    query: GET_PROBLEM_QUERY,
    variables: { titleSlug: slug },
    operationName: 'questionData',
  };

  const response = await fetch(LEETCODE_GRAPHQL_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Referer': `https://leetcode.com/problems/${slug}/`,
      'Cookie': `LEETCODE_SESSION=${cookies.LEETCODE_SESSION}; csrftoken=${cookies.csrftoken}`,
      'x-csrftoken': cookies.csrftoken,
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch problem: ${response.statusText}`);
  }

  const data = await response.json();

  if (data.errors) {
    throw new Error(`GraphQL error: ${data.errors[0].message}`);
  }

  return data;
}

/**
 * Submits a solution to LeetCode.
 * @param slug The title slug of the problem.
 * @param lang The language slug (e.g., "typescript").
 * @param code The code to submit.
 * @param cookies The user's LeetCode session cookies.
 * @returns The submission ID.
 */
export async function submitSolution(
  slug: string,
  lang: string,
  code: string,
  cookies: LeetCodeCookies
): Promise<number> {
  // First, we need to get the question_id from the problem data
  const problemData = await fetchProblem(slug, cookies);
  const questionId = problemData.data.question.questionId;

  const requestBody = {
    lang: lang,
    question_id: questionId,
    typed_code: code,
  };

  const response = await fetch(`https://leetcode.com/problems/${slug}/submit/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Referer': `https://leetcode.com/problems/${slug}/`,
      'Cookie': `LEETCODE_SESSION=${cookies.LEETCODE_SESSION}; csrftoken=${cookies.csrftoken}`,
      'x-csrftoken': cookies.csrftoken,
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('LeetCode submission error:', errorText);
    throw new Error(`Failed to submit solution: ${response.statusText} - ${errorText}`);
  }

  const data: SubmissionResponse = await response.json();
  return data.submission_id;
}

/**
 * Checks the status of a submission.
 * @param submissionId The ID of the submission to check.
 * @param cookies The user's LeetCode session cookies.
 * @returns The submission status.
 */
export async function checkSubmissionStatus(
  submissionId: number,
  cookies: LeetCodeCookies
): Promise<SubmissionStatusResponse> {
  const response = await fetch(`https://leetcode.com/submissions/detail/${submissionId}/check/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Referer': `https://leetcode.com/submissions/detail/${submissionId}/`,
      'Cookie': `LEETCODE_SESSION=${cookies.LEETCODE_SESSION}; csrftoken=${cookies.csrftoken}`,
      'x-csrftoken': cookies.csrftoken,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to check submission status: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
}

/**
 * Utility to delay execution.
 * @param ms Milliseconds to wait.
 */
export const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
