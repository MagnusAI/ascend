-- Add name column to goals table
alter table public.goals
add column if not exists name text not null; 