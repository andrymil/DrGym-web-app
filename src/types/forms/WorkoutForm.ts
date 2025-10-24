import type { Exercise } from '@/types/api/exercise';

export type WorkoutFormValues = {
  startDate: Date | null;
  endDate: Date | null;
  description: string;
  interval: number | null;
  exerciseType: string | null;
  exercise: Exercise | null;
  reps: number | null;
  weight: number | null;
  duration: Date | null;
};
