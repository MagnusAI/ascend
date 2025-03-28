-- Add category column to goals table
alter table public.goals
add column if not exists category text not null default 'other'; 