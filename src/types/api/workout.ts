import type { Activity } from '@/types/api/activity';

export type Workout = {
  id: number;
  username: string;
  startDate: Date;
  endDate: Date;
  description?: string;
  posted: number;
  schedule: number;
  activities: Activity[];
};

export type FuturePastWorkouts = {
  futureWorkouts: Workout[];
  pastWorkouts: Workout[];
};
