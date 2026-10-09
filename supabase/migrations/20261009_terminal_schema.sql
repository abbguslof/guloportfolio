-- ====================================================================
-- GULO.SE // TERMINAL TELEMETRY & MESSAGING SCHEMA
-- Migration: 20261009_terminal_schema.sql
-- Description: Creates tables for visitor messages and anonymous command telemetry
-- GDPR Compliance: Zero cookies, no IP logging, strictly isolated RLS policies.
-- ====================================================================

-- 1. TERMINAL MESSAGES TABLE (Stream 1: Direct visitor notes & dad-proof messages)
create table if not exists public.terminal_messages (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  message text not null check (char_length(trim(message)) > 0 and char_length(message) <= 2000),
  page text default '/',
  background text default 'standard',
  lang text default 'sv',
  session_id text
);

-- Enable Row Level Security (RLS)
alter table public.terminal_messages enable row level security;

-- Policy: Allow ANY visitor to submit a message (INSERT only)
create policy "Allow anonymous message insert"
  on public.terminal_messages for insert
  to anon
  with check (true);

-- Note: We intentionally do NOT create a SELECT policy for anon.
-- Only authenticated users (Gustav in Supabase Studio dashboard) can read messages.


-- 2. TERMINAL TELEMETRY TABLE (Stream 2: Anonymous command usage stats)
create table if not exists public.terminal_stats (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  session_id text not null,
  command text not null check (char_length(command) <= 64),
  raw_input text check (char_length(raw_input) <= 500),
  status text not null, -- 'success', 'not_found', 'message_sent'
  page text default '/',
  background text default 'standard',
  lang text default 'sv'
);

-- Enable Row Level Security (RLS)
alter table public.terminal_stats enable row level security;

-- Policy: Allow ANY visitor to log command telemetry (INSERT only)
create policy "Allow anonymous stats insert"
  on public.terminal_stats for insert
  to anon
  with check (true);

-- Performance indexes for analytical queries and dashboards
create index if not exists idx_terminal_stats_created_at on public.terminal_stats(created_at desc);
create index if not exists idx_terminal_stats_command on public.terminal_stats(command);
create index if not exists idx_terminal_stats_session on public.terminal_stats(session_id);
create index if not exists idx_terminal_stats_status on public.terminal_stats(status);
