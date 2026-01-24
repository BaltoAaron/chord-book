-- Chord Book Database Schema
-- Run this in your Supabase SQL Editor

-- Songs table
CREATE TABLE songs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  artist TEXT NOT NULL,
  title TEXT NOT NULL,
  key TEXT,
  chords TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Setlists table
CREATE TABLE setlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Junction table for setlist songs (with ordering)
CREATE TABLE setlist_songs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setlist_id UUID REFERENCES setlists(id) ON DELETE CASCADE NOT NULL,
  song_id UUID REFERENCES songs(id) ON DELETE CASCADE NOT NULL,
  position INTEGER NOT NULL,
  UNIQUE(setlist_id, song_id)
);

-- Create indexes for better query performance
CREATE INDEX idx_songs_user_id ON songs(user_id);
CREATE INDEX idx_setlists_user_id ON setlists(user_id);
CREATE INDEX idx_setlist_songs_setlist_id ON setlist_songs(setlist_id);
CREATE INDEX idx_setlist_songs_song_id ON setlist_songs(song_id);

-- Enable Row Level Security
ALTER TABLE songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE setlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE setlist_songs ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only access their own data

-- Songs policies
CREATE POLICY "Users can view own songs" ON songs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own songs" ON songs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own songs" ON songs
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own songs" ON songs
  FOR DELETE USING (auth.uid() = user_id);

-- Setlists policies
CREATE POLICY "Users can view own setlists" ON setlists
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own setlists" ON setlists
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own setlists" ON setlists
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own setlists" ON setlists
  FOR DELETE USING (auth.uid() = user_id);

-- Setlist songs policies (users can manage songs in their own setlists)
CREATE POLICY "Users can view own setlist songs" ON setlist_songs
  FOR SELECT USING (
    setlist_id IN (SELECT id FROM setlists WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can add songs to own setlists" ON setlist_songs
  FOR INSERT WITH CHECK (
    setlist_id IN (SELECT id FROM setlists WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can update own setlist songs" ON setlist_songs
  FOR UPDATE USING (
    setlist_id IN (SELECT id FROM setlists WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can remove songs from own setlists" ON setlist_songs
  FOR DELETE USING (
    setlist_id IN (SELECT id FROM setlists WHERE user_id = auth.uid())
  );
