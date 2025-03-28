-- Add frequency column to goals table
alter table public.goals
add column if not exists frequency text; 