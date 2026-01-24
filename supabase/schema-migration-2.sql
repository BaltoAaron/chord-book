-- Schema Update 2: Add 'settings' field to setlists table
-- Run this in your Supabase SQL Editor to update existing schema

ALTER TABLE setlists ADD COLUMN IF NOT EXISTS settings JSONB DEFAULT '{"alphabetical_order": false}'::jsonb;
