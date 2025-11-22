# WeCode 🚀

> A collaborative coding platform where users compete in real-time on LeetCode problems

**WeCode** is a multiplayer coding platform that allows users to solve LeetCode problems together in real-time. Using a Chrome extension to extract LeetCode session cookies, our Next.js backend acts as a proxy to submit solutions on your behalf, while Supabase handles room state, chat, and leaderboards.

## 🎯 Features

- **Real-time Collaboration**: Compete with friends in live coding rooms
- **LeetCode Integration**: Solve real LeetCode problems without leaving WeCode
- **Live Leaderboard**: See scores update in real-time as users submit solutions
- **Secure Authentication**: Google OAuth powered by Supabase
- **Cookie Proxy**: Simple Chrome extension extracts your LeetCode session
- **Monaco Editor**: Professional code editing experience

## 🏗️ Tech Stack

- **Frontend**: Next.js 16, React 19, Tailwind CSS, Shadcn/UI
- **Backend**: Next.js API Routes (Serverless)
- **Database/Realtime**: Supabase (PostgreSQL + Realtime)
- **Authentication**: Supabase Auth (Google OAuth)
- **Code Editor**: Monaco Editor
- **LeetCode Connection**: GraphQL Proxy with cookie-based authentication
- **Extension**: Chrome Extension (Cookie Extractor)

## 📁 Project Structure

```
wecode/
├── app/
│   ├── auth/
│   │   └── callback/          # OAuth callback handler
│   ├── dashboard/             # Main dashboard (protected)
│   ├── login/                 # Login page
│   └── page.tsx               # Root redirect
├── components/
│   ├── ui/                    # Shadcn/UI components
│   ├── SignOutButton.tsx
│   └── icons.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts          # Browser Supabase client
│   │   ├── server.ts          # Server Supabase client
│   │   └── middleware.ts      # Auth middleware
│   └── utils.ts
├── middleware.ts              # Next.js middleware
└── project-spec.md            # Detailed project specification
```

## 🔐 Database Schema

See `project-spec.md` for the complete schema. Key tables:

- `users`: Public user profiles (display_name, avatar_url)
- `user_secrets`: Private LeetCode cookies (session, csrf_token)
- `rooms`: Coding rooms
- `room_participants`: User participation and scores

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

---

**Note**: This project is for educational purposes. Please ensure you comply with LeetCode's Terms of Service when using their API.
