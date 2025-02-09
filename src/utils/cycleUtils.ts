import { supabase } from '../lib/supabase'

export async function getCurrentCycle(userId: string): Promise<number> {
  const { data, error } = await supabase
    .from('fitness_metrics')
    .select('cycle_number')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)

  if (error) {
    console.error('Error getting current cycle:', error)
    return 1 // Default to cycle 1 if there's an error
  }

  return data?.[0]?.cycle_number || 1
}
