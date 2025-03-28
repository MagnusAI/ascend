-- Create progress_logs table
create table if not exists public.progress_logs (
    id uuid primary key default gen_random_uuid(),
    goal_id uuid references public.goals(id) on delete cascade not null,
    user_id uuid references auth.users(id) on delete cascade not null,
    value numeric not null,
    notes text,
    timestamp timestamp with time zone default now(),
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- Set up Row Level Security (RLS)
alter table public.progress_logs enable row level security;

-- Create policies
create policy "Users can view their own progress logs"
    on public.progress_logs for select
    using (auth.uid() = user_id);

create policy "Users can insert their own progress logs"
    on public.progress_logs for insert
    with check (auth.uid() = user_id);

create policy "Users can update their own progress logs"
    on public.progress_logs for update
    using (auth.uid() = user_id);

create policy "Users can delete their own progress logs"
    on public.progress_logs for delete
    using (auth.uid() = user_id);

-- Create updated_at trigger
create trigger handle_progress_logs_updated_at
    before update on public.progress_logs
    for each row
    execute function public.handle_updated_at(); 