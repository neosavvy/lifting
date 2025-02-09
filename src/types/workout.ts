export type LiftStatus = 'nailed' | 'failed' | null;

export type WorkoutStatus = {
  [week: number]: {
    [lift: string]: LiftStatus;
  };
};
