export type LiftCompletion = {
  id: string
  user_id: string
  cycle_number: number
  cycle_week: number
  lift_type: 'squat' | 'bench' | 'overhead' | 'deadlift'
  status: 'nailed' | 'failed'
  set1_weight: number
  set2_weight: number
  set3_weight: number
  amrap_reps?: number
  created_at: string
  updated_at: string
}
