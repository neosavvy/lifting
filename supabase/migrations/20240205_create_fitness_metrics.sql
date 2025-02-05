-- Create fitness metrics table
CREATE TABLE IF NOT EXISTS fitness_metrics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    body_weight DECIMAL NOT NULL,
    years_lifting INTEGER NOT NULL,
    squat_weight DECIMAL NOT NULL,
    deadlift_weight DECIMAL NOT NULL,
    bench_weight DECIMAL NOT NULL,
    overhead_press_weight DECIMAL NOT NULL,
    is_elite_fitness BOOLEAN NOT NULL,
    cycle_number INTEGER NOT NULL,
    
    -- Add indexes for common queries
    CONSTRAINT years_lifting_positive CHECK (years_lifting >= 0),
    CONSTRAINT cycle_number_positive CHECK (cycle_number >= 0)
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS fitness_metrics_user_id_idx ON fitness_metrics(user_id);
CREATE INDEX IF NOT EXISTS fitness_metrics_created_at_idx ON fitness_metrics(created_at);

-- Set up Row Level Security (RLS)
ALTER TABLE fitness_metrics ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to only see and modify their own data
CREATE POLICY "Users can only access their own fitness metrics"
    ON fitness_metrics
    FOR ALL
    USING (auth.uid() = user_id); 