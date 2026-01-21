# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ChordBook is a digital fake-book application for managing songs and setlists. Built with Next.js 14 (App Router), Supabase for database/auth, and Tailwind CSS.

## Commands

```bash
npm run dev      # Start development server at localhost:3000
npm run build    # Build for production
npm run lint     # Run ESLint
npm start        # Start production server
```

Docker:
```bash
docker build -t chordbook .
docker run -p 8080:8080 chordbook
```

## Architecture

### Supabase Client Pattern

Three Supabase client factories in `lib/supabase/`:
- `client.ts` - Browser client using `createBrowserClient` for client components
- `server.ts` - Server client using `createServerClient` with cookies for server components
- `middleware.ts` - Middleware client for session management and route protection

**Usage:**
- Server Components: `import { createClient } from '@/lib/supabase/server'`
- Client Components: `import { createClient } from '@/lib/supabase/client'`

### Authentication & Route Protection

Middleware (`middleware.ts`) handles auth:
- Protected paths: `/home`, `/song/*`, `/setlist/*` - redirect to `/login` if unauthenticated
- `/login` redirects authenticated users to `/home`
- Root `/` redirects to `/home` or `/login` based on auth state

### Data Model

Three tables with Row Level Security (see `supabase/schema.sql`):
- `songs` - user_id, artist, title, chords
- `setlists` - user_id, name
- `setlist_songs` - junction table with position for ordering

TypeScript types in `lib/types.ts`: `Song`, `Setlist`, `SetlistSong`, `SetlistWithSongs`

### Page Structure

All pages use Next.js App Router conventions:
- Server Components fetch data directly via Supabase server client
- Client Components (marked with `'use client'`) handle interactivity
- Dynamic routes use `[id]` folder naming (e.g., `/setlist/[id]/page.tsx`)

Key pages:
- `/home` - Dashboard showing user's songs and setlists
- `/song/new`, `/song/[id]` - Create/edit songs using `SongForm` component
- `/setlist/[id]` - Edit setlist using `SetlistEditor` component
- `/setlist/[id]/play` - Performance mode for setlist

### Environment Variables

Required in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```
