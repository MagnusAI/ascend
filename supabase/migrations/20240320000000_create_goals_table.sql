-- Create goals table
create table if not exists public.goals (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users(id) on delete cascade not null,
    title text not null,
    description text,
    status text not null default 'in_progress',
    due_date timestamp with time zone,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- Set up Row Level Security (RLS)
alter table public.goals enable row level security;

-- Create policies
create policy "Users can view their own goals"
    on public.goals for select
    using (auth.uid() = user_id);

create policy "Users can insert their own goals"
    on public.goals for insert
    with check (auth.uid() = user_id);

create policy "Users can update their own goals"
    on public.goals for update
    using (auth.uid() = user_id);

create policy "Users can delete their own goals"
    on public.goals for delete
    using (auth.uid() = user_id);

-- Create updated_at trigger
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

create trigger handle_goals_updated_at
    before update on public.goals
    for each row
    execute function public.handle_updated_at(); 