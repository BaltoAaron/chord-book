# PROGRESS.md

This file tracks changes made to the ChordBook project.

## Change Log

### 2026-01-24 16:30:00 - Add Setlist Settings Page
- Added settings page with "Alphabetical Order" toggle accessible via gear icon on setlist edit page. Created schema-migration-2.sql for the new JSONB settings column.

### 2026-01-24 15:45:00 - Add Schema Migration for Key Field
- Created schema-update-1.sql migration file to add 'key' column to existing songs table in Supabase.

### 2026-01-24 15:30:00 - Add Key Field to Songs
- Added 'key' text field to songs table in Supabase schema, TypeScript types, and SongForm component. The Key field appears between Title and Chords on the song edit page.

### 2026-01-24 - Initial Setup
- Created PROGRESS.md file to track project changes
- Updated CLAUDE.md with instructions to maintain this change log
