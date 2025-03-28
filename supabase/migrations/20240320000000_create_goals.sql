-- Create enum types
CREATE TYPE goal_category AS ENUM (
    'strength',
    'cardio',
    'nutrition',
    'mental',
    'habit',
    'other'
);

CREATE TYPE goal_frequency AS ENUM (
    'daily',
    'weekly',
    'monthly',
    'one-time'
);

CREATE TYPE goal_logic_type AS ENUM (
    'SUM',
    'MAX',
    'COUNT',
    'AVERAGE'
);

-- Create goals table
CREATE TABLE goals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    category goal_category NOT NULL,
    unit TEXT NOT NULL,
    target_value DECIMAL NOT NULL,
    frequency goal_frequency NOT NULL,
    logic_type goal_logic_type NOT NULL,
    deadline TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create progress_logs table
CREATE TABLE progress_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    goal_id UUID REFERENCES goals(id) ON DELETE CASCADE,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    value DECIMAL NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX goals_user_id_idx ON goals(user_id);
CREATE INDEX progress_logs_goal_id_idx ON progress_logs(goal_id);
CREATE INDEX progress_logs_timestamp_idx ON progress_logs(timestamp);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for goals table
CREATE TRIGGER update_goals_updated_at
    BEFORE UPDATE ON goals
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Set up Row Level Security (RLS)
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress_logs ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own goals"
    ON goals FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own goals"
    ON goals FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own goals"
    ON goals FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own goals"
    ON goals FOR DELETE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own progress logs"
    ON progress_logs FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM goals
            WHERE goals.id = progress_logs.goal_id
            AND goals.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert their own progress logs"
    ON progress_logs FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM goals
            WHERE goals.id = progress_logs.goal_id
            AND goals.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update their own progress logs"
    ON progress_logs FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM goals
            WHERE goals.id = progress_logs.goal_id
            AND goals.user_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM goals
            WHERE goals.id = progress_logs.goal_id
            AND goals.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete their own progress logs"
    ON progress_logs FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM goals
            WHERE goals.id = progress_logs.goal_id
            AND goals.user_id = auth.uid()
        )
    ); 