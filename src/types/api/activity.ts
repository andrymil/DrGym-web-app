import type { Exercise } from '@/types/api/exercise';

export type Activity = {
  id?: number;
  reps?: number;
  weight?: number;
  duration?: string;
  exercise: Exercise;
};
