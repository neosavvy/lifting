-- Create lift completions table
CREATE TABLE IF NOT EXISTS lift_completions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- Core fields
    cycle_week SMALLINT NOT NULL,
    lift_type TEXT NOT NULL,
    status TEXT NOT NULL,
    
    -- Set weights
    set1_weight DECIMAL NOT NULL,
    set2_weight DECIMAL NOT NULL,
    set3_weight DECIMAL NOT NULL,
    
    -- Optional AMRAP reps for week 3
    amrap_reps INTEGER,
    
    -- Constraints
    CONSTRAINT cycle_week_valid CHECK (cycle_week BETWEEN 1 AND 4),
    CONSTRAINT lift_type_valid CHECK (lift_type IN ('squat', 'bench', 'overhead', 'deadlift')),
    CONSTRAINT status_valid CHECK (status IN ('nailed', 'failed')),
    CONSTRAINT unique_lift_completion UNIQUE(user_id, cycle_week, lift_type)
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS lift_completions_user_id_idx ON lift_completions(user_id);
CREATE INDEX IF NOT EXISTS lift_completions_created_at_idx ON lift_completions(created_at);

-- Set up Row Level Security (RLS)
ALTER TABLE lift_completions ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to only see and modify their own data
CREATE POLICY "Users can only access their own lift completions"
    ON lift_completions
    FOR ALL
    USING (auth.uid() = user_id);

-- Create trigger for updating the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_lift_completions_updated_at
    BEFORE UPDATE ON lift_completions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
