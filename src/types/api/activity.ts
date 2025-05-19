import type { Exercise } from '@/types/api/exercise';

export type Activity = {
  id?: number;
  reps: number | null;
  weight: number | null;
  duration: string | null;
  exercise: Exercise;
};
