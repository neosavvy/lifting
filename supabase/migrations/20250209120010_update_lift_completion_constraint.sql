-- Drop the existing constraint first
ALTER TABLE public.lift_completions
DROP CONSTRAINT IF EXISTS unique_lift_completion;

-- Create new constraint that includes cycle_number
ALTER TABLE public.lift_completions
ADD CONSTRAINT unique_lift_completion 
UNIQUE (user_id, cycle_number, cycle_week, lift_type);

-- Note: This ensures uniqueness across all cycles, preventing duplicate entries
-- for the same lift in the same week of any given cycle
