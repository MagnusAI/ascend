-- Add unit column to goals table
alter table public.goals
add column if not exists unit text; 