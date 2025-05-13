import type { Exercise } from '@/types/api/exercise';

export type UserData = {
  username: string;
  name: string;
  surname: string;
  weight: number;
  height: number;
  exercise: Exercise;
  avatar?: string;
};
