# Project Spec: WeCode (Cookie Proxy Edition)

## 1. Architecture Overview
WeCode is a collaborative coding platform.
**The Core Mechanism:**
1.  **Simple Extension:** A "dumb" Chrome extension that purely extracts the user's `LEETCODE_SESSION` and `csrftoken` cookies and sends them to our website.
2.  **Next.js Proxy:** The Next.js backend uses these cookies to impersonate the user. It sends GraphQL requests to LeetCode to fetch problems, submit code, and check results.
3.  **Supabase:** Handles Room state (who is in the room, scores, chat).

## 2. Tech Stack
* **Frontend:** Next.js 16, Tailwind CSS, Monaco Editor (for the code editor).
* **Backend Logic:** Next.js API Routes (Serverless functions).
* **Database/Realtime:** Supabase.
* **LeetCode Connection:** GraphQL Proxy (using `fetch` with spoofed headers).
* **Browser Extension:** Minimal "Cookie Extractor".

---

## 3. Data Structure (Supabase Schema)

**Table: `users`**
* `id` (UUID)
* `email`, `display_name`, `avatar_url`
* `leetcode_cookies` (Text/JSONB - **Encrypted** ideally, or just stored plain for this demo. Stores: `{ session: "...", csrftoken: "..." }`)

**Table: `rooms`**
* `id`, `code`, `status`, `created_by`
* `current_problem_slug` (Text - e.g., "two-sum")

**Table: `room_participants`**
* `room_id`, `user_id`, `score`, `status` (e.g., 'solving', 'submitted')

---

## 4. Development Phases (To-Do List)

### Phase 1: Setup & Basic Auth
**Goal:** Project initialized and basic Google Login works.
- [ ] Initialize Next.js app with Tailwind & Shadcn/UI.
- [ ] Set up Supabase project & connect env variables.
- [ ] Enable Google Auth in Supabase.
- [ ] Create `users` table in Supabase.
- [ ] **Checkpoint:** I can log in and see a blank Dashboard.

### Phase 2: The Cookie Extractor (Extension)
**Goal:** One-click button to import LeetCode session into WeCode.
- [ ] Create a folder `extension`.
- [ ] Create `manifest.json` (Host Permissions: `*://leetcode.com/*`, `*://wecode.com/*`).
- [ ] Create `popup.js`:
    -   Query `chrome.cookies.get` for `LEETCODE_SESSION` and `csrftoken`.
    -   Display them in the popup (for debugging).
    -   Button "Sync with WeCode" -> Sends POST request to `http://localhost:3000/api/auth/sync-cookies`.
- [ ] Create Next.js API Route `/api/auth/sync-cookies`:
    -   Receives cookies.
    -   Updates the logged-in user's row in Supabase `users` table.
- [ ] **Checkpoint:** I click the extension button, and my database row updates with my LeetCode cookies.

### Phase 3: The LeetCode Proxy (The Hard Part)
**Goal:** Next.js can talk to LeetCode on my behalf.
- [ ] Create a utility function `leetcodeClient(cookies)`.
- [ ] Implement `fetchProblem(slug)`:
    -   Endpoint: `https://leetcode.com/graphql`
    -   Headers: `Cookie: LEETCODE_SESSION=...; csrftoken=...`, `Referer: https://leetcode.com`, `X-CSRFToken: ...`
    -   Query: Standard LeetCode GraphQL query for problem description/examples.
- [ ] Implement `submitSolution(slug, code, lang)`:
    -   **Step 1:** Send `submit` mutation to LeetCode.
    -   **Step 2:** Receive `submission_id`.
    -   **Step 3:** Polling loop. Wait 2s, check submission status until "ACCEPTED" or "ERROR".
- [ ] Create UI: A simple page with a code editor (Monaco) and a "Submit" button.
- [ ] **Checkpoint:** I can write code on localhost, hit Submit, and see the result (Accepted/Wrong Answer) returned from LeetCode.

### Phase 4: Room & Real-time Logic
**Goal:** Multiplayer experience.
- [ ] Create `rooms` table and `createRoom` Server Action.
- [ ] Build Room UI:
    -   Left side: Problem Description (fetched via Proxy).
    -   Middle: Code Editor.
    -   Right side: Chat & Scoreboard (Supabase Realtime).
- [ ] Wiring it up:
    -   When I hit "Submit" in the room -> Calls Proxy -> If Accepted -> Update `room_participants` score -> Realtime updates everyone's scoreboard.
- [ ] **Checkpoint:** Two browsers open. User A submits code. User B sees User A's score go up instantly.

### Phase 5: Polish
- [ ] Add "Run Code" (Test case check) feature (similar to Submit but simpler).
- [ ] Clean up UI (Dark mode, loading states).
- [ ] Deploy to Vercel.
sW7R9XXjr%TLLKe