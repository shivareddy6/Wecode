# Contributing to WeCode 🤝

Thank you for your interest in contributing to WeCode! This document provides guidelines and instructions for contributing to the project.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Project Structure](#project-structure)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Development Phases](#development-phases)

## 📜 Code of Conduct

- Be respectful and inclusive
- Welcome newcomers and help them get started
- Focus on constructive feedback
- Keep discussions on-topic and professional

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git
- A Supabase account
- Google OAuth credentials
- Basic knowledge of Next.js, React, and TypeScript

### Setup Development Environment

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/yourusername/wecode.git
   cd wecode
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

4. **Set up Supabase**
   - Create a Supabase project
   - Run the SQL schema from `project-spec.md`
   - Enable Google OAuth
   - Update `.env.local` with your credentials

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Load the Chrome Extension**
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" in the top right corner.
   - Click "Load unpacked".
   - Select the `extension` folder from the project root.

## 🔄 Development Workflow

1. **Create a new branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

2. **Make your changes**
   - Write clean, readable code
   - Follow the project's coding standards
   - Add comments for complex logic
   - Update documentation if needed

3. **Test your changes**
   ```bash
   npm run dev
   # Test manually in browser
   npm run build  # Ensure it builds successfully
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add feature description"
   ```

5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**
   - Go to the original repository
   - Click "New Pull Request"
   - Select your branch
   - Fill out the PR template

## 📁 Project Structure

```
wecode/
├── app/
│   ├── api/                 # API routes
│   ├── (auth)/              # Auth-related pages
│   └── (protected)/         # Protected routes
├── components/
│   ├── ui/                  # Shadcn/UI components
│   └── ...
├── extension/               # Chrome Extension source
├── lib/
│   ├── supabase/            # Supabase client configurations
│   └── utils.ts
├── public/
└── middleware.ts            # Next.js auth middleware
```

### Key Files

- `lib/supabase/client.ts` - Browser Supabase client
- `lib/supabase/server.ts` - Server-side Supabase client (async)
- `lib/supabase/middleware.ts` - Authentication middleware
- `middleware.ts` - Route protection and session refresh
- `project-spec.md` - Complete project specification

## 💻 Coding Standards

### TypeScript

- Use TypeScript for all new files
- Define proper types/interfaces
- Avoid `any` type when possible
- Use type inference where appropriate

### React/Next.js

- Use functional components with hooks
- Prefer Server Components when possible
- Use `'use client'` directive only when necessary
- Follow Next.js 16 App Router conventions

### Styling

- Use Tailwind CSS for styling
- Follow Shadcn/UI patterns for components
- Use CSS variables for theming
- Keep responsive design in mind (mobile-first)

### Code Organization

```typescript
// 1. Imports (external first, then internal)
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

// 2. Types/Interfaces
interface UserProfile {
  id: string
  email: string
}

// 3. Component/Function
export default function Component() {
  // Component logic
}
```

### Naming Conventions

- **Components**: PascalCase (`UserProfile.tsx`)
- **Functions**: camelCase (`createClient`, `handleSubmit`)
- **Constants**: UPPER_SNAKE_CASE (`API_URL`)
- **Files**: kebab-case for pages (`user-profile/page.tsx`)

## 📝 Commit Guidelines

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>
<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```bash
feat(auth): add Google OAuth login
fix(dashboard): resolve session refresh issue
docs(readme): update setup instructions
refactor(api): simplify LeetCode proxy logic
```

## 🔀 Pull Request Process

1. **Before submitting**
   - Ensure your code builds without errors
   - Test your changes thoroughly
   - Update documentation if needed
   - Rebase on latest `main` if needed

2. **PR Title**
   - Use conventional commit format
   - Be clear and descriptive
   - Example: `feat(rooms): add real-time multiplayer support`

3. **PR Description**
   ```markdown
   ## Description
   Brief description of changes
   
   ## Changes Made
   - Change 1
   - Change 2
   
   ## Testing
   How to test these changes
   
   ## Screenshots (if applicable)
   [Add screenshots here]
   
   ## Related Issues
   Closes #123
   ```

4. **Review Process**
   - Address review comments promptly
   - Make requested changes
   - Keep discussions professional

5. **After Approval**
   - Squash commits if requested
   - Ensure CI passes
   - Wait for maintainer to merge

## 🏗️ Development Phases

We're building WeCode in phases. Check which phase we're currently in:

### Phase 1: Setup & Basic Auth ✅
- Authentication flow
- User profiles
- Protected routes

### Phase 2: Cookie Extractor 🔄
- Chrome extension
- Cookie sync API
- **Good first issue area!**

### Phase 3: LeetCode Proxy 📝
- GraphQL integration
- Problem fetching
- Code submission

### Phase 4: Multiplayer Rooms 👥
- Real-time features
- Chat and leaderboard
- Room management

### Phase 5: Polish 🎨
- UI improvements
- Error handling
- Deployment

### Contributing to Active Phase

Check the current phase and focus your contributions there. For beginners:
- Phase 2 (Extension) is great for first-time contributors
- Phase 5 (Polish) always needs UI/UX improvements

## 🐛 Reporting Bugs

1. Check if the bug already exists in Issues
2. Create a new issue with:
   - Clear title
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Environment (OS, browser, Node version)

## 💡 Feature Requests

1. Check if the feature is already requested
2. Create a new issue with:
   - Clear description
   - Use case/motivation
   - Proposed solution (if any)
   - Alternatives considered

## ❓ Questions

- Open a Discussion for questions
- Check existing docs first
- Be specific about your question
- Provide context

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Documentation](https://react.dev/)

---

Thank you for contributing to WeCode! 🎉
