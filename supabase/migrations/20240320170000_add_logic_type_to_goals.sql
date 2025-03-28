-- Add logic_type column to goals table
alter table public.goals
add column if not exists logic_type text not null default 'and'; 