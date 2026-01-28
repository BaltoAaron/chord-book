# PROGRESS.md

This file tracks changes made to the ChordBook project.

## Change Log

### 2026-01-27 12:08:43 - Add Help Popup to Chords Field - Made by ClaudeCode
- Added a "?" help icon next to the Chords label in SongForm. Clicking it opens a modal popup displaying the Example Popup.png image.

### 2026-01-27 11:42:18 - Update Setlist Page Header Layout - Made by ClaudeCode
- Reorganized setlist edit page header: "Edit Setlist" h1 on left, "Back" link on right top, "Display Setlist" button and settings gear below on right.

### 2026-01-25 16:23:47 - Set Favicon for App - Made by ClaudeCode
- Added favicon configuration to app/layout.tsx metadata using the existing CB logo at /images/favicon.png.

### 2026-01-25 16:06:16 - Add transUp Button to Play Page - Made by ClaudeCode
- Replaced XXX placeholder with a button that calls `transUp('ABC')` on each song in the play page.

### 2026-01-25 15:54:37 - Add transUp Script Function - Made by ClaudeCode
- Added empty `transUp()` function in a script tag to the play page for future transpose functionality.

### 2026-01-25 11:42:17 - Align Song Index with Padded Artist Names - Made by ClaudeCode
- Replaced "XXX" placeholder in Song Index with `.padEnd(40, ' ')` so the "-" character aligns at position 40 for all songs.

### 2026-01-25 10:14:32 - Conditional Song Ordering in Play Mode - Made by ClaudeCode
- Updated play page to conditionally sort songs based on alphabetical_order setting. When enabled, songs sort by artist then title; when disabled, songs display in position order.

### 2026-01-25 10:00:00 - Conditional Alphabet Header in Play Mode
- Updated setlist play page to conditionally show Alphabet Header when alphabetical_order is enabled, or "Ordered Setlist" text when disabled.

### 2026-01-24 17:35:00 - Fix Setlist Settings Cache Invalidation
- Added router.refresh() to SettingsForm alphabetical order toggle so SetlistEditor updates when navigating back after settings changes.

### 2026-01-24 17:30:00 - Fix Home Page Cache Invalidation
- Added router.refresh() calls to SetlistEditor mutation handlers (add, remove, move up/down) so the Home page updates when navigating back after setlist changes.

### 2026-01-24 17:00:00 - Apply Alphabetical Order Setting to Setlist Editor
- Updated SetlistEditor.tsx to respect the alphabetical_order setting. When enabled, songs display sorted by artist then title, and move up/down buttons are hidden.

### 2026-01-24 16:30:00 - Add Setlist Settings Page
- Added settings page with "Alphabetical Order" toggle accessible via gear icon on setlist edit page. Created schema-migration-2.sql for the new JSONB settings column.

### 2026-01-24 15:45:00 - Add Schema Migration for Key Field
- Created schema-update-1.sql migration file to add 'key' column to existing songs table in Supabase.

### 2026-01-24 15:30:00 - Add Key Field to Songs
- Added 'key' text field to songs table in Supabase schema, TypeScript types, and SongForm component. The Key field appears between Title and Chords on the song edit page.

### 2026-01-24 - Initial Setup
- Created PROGRESS.md file to track project changes
- Updated CLAUDE.md with instructions to maintain this change log
