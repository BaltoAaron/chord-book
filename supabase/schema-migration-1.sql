-- Schema Update 1: Add 'key' field to songs table
-- Run this in your Supabase SQL Editor to update existing schema

-- Add key column to songs table (nullable TEXT field for musical key)
ALTER TABLE songs ADD COLUMN IF NOT EXISTS key TEXT;
