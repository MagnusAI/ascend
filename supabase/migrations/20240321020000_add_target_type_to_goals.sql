-- Add target_type column to goals table
alter table public.goals
add column target_type text not null default 'above' check (target_type in ('above', 'below')); 