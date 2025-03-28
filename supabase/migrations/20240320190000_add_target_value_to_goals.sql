-- Add target_value column to goals table
alter table public.goals
add column if not exists target_value numeric; 