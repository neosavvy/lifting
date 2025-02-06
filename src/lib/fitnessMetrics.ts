import { supabase } from './supabase'

export interface FitnessMetric {
  id: string
  user_id: string
  created_at: string
  body_weight: number
  years_lifting: number
  squat_weight: number
  deadlift_weight: number
  bench_weight: number
  overhead_press_weight: number
  is_elite_fitness: boolean
  cycle_number: number
}

export async function getLatestFitnessMetric(): Promise<FitnessMetric | null> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('fitness_metrics')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)

  // If there's an error or no data, return null
  if (error || !data || data.length === 0) {
    if (error && error.code !== 'PGRST116') { // Only log if it's not a "no rows returned" error
      console.error('Error fetching latest fitness metric:', error)
    }
    return null
  }

  return data[0]
}

export async function saveFitnessMetric(metric: Omit<FitnessMetric, 'id' | 'user_id' | 'created_at'>): Promise<FitnessMetric | null> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    console.error('No authenticated user found')
    return null
  }

  const { data, error } = await supabase
    .from('fitness_metrics')
    .insert([{
      ...metric,
      user_id: user.id
    }])
    .select()
    .single()

  if (error) {
    console.error('Error saving fitness metric:', error)
    return null
  }

  return data
}

export function metricsAreEqual(a: FitnessMetric | null, b: Partial<FitnessMetric> | null): boolean {
  if (!a || !b) return false
  
  return (
    Number(a.body_weight) === Number(b.body_weight) &&
    Number(a.years_lifting) === Number(b.years_lifting) &&
    Number(a.squat_weight) === Number(b.squat_weight) &&
    Number(a.deadlift_weight) === Number(b.deadlift_weight) &&
    Number(a.bench_weight) === Number(b.bench_weight) &&
    Number(a.overhead_press_weight) === Number(b.overhead_press_weight) &&
    Boolean(a.is_elite_fitness) === Boolean(b.is_elite_fitness) &&
    Number(a.cycle_number) === Number(b.cycle_number)
  )
} 