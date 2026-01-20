# ChordBook - Your Friendly Fake-Book

A digital fake-book application for managing songs and setlists. Built with Next.js, Supabase, and Tailwind CSS.

## Features

- Create and manage songs with chord charts
- Organize songs into setlists
- Play mode for performing from setlists
- User authentication via Supabase

## Tech Stack

- **Framework:** Next.js 14
- **Database & Auth:** Supabase
- **Styling:** Tailwind CSS
- **Language:** TypeScript

## Prerequisites

- Node.js 18 or higher
- npm or yarn
- A Supabase account and project

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd cctest
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy the example environment file and fill in your Supabase credentials:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your Supabase project details:

```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

You can find these values in your Supabase project settings under "API".

### 4. Set up the database

Run the schema SQL in your Supabase SQL editor:

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy the contents of `supabase/schema.sql` and execute it

### 5. Run the development server

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |

## Docker

To run with Docker:

```bash
docker build -t chordbook .
docker run -p 8080:8080 chordbook
```

## Project Structure

```
├── app/                  # Next.js App Router pages
│   ├── home/            # Home page components
│   ├── login/           # Authentication page
│   ├── setlist/         # Setlist pages
│   └── song/            # Song pages
├── lib/                  # Shared utilities
│   └── supabase/        # Supabase client configuration
├── supabase/            # Database schema
└── public/              # Static assets
```

---

Created with Claude Code
