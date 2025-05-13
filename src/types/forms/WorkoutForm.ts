import type { Exercise } from '@/types/api/exercise';

export type WorkoutFormValues = {
  startDate: Date | null;
  endDate: Date | null;
  description: string;
  isRegular: boolean;
  interval: number;
  exerciseType: string;
  exercise: Exercise;
  reps: number;
  weight: number;
  duration: Date;
};
