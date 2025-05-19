import type { Exercise } from '@/types/api/exercise';

export type UserData = {
  username: string;
  name: string;
  surname: string;
  weight: number | null;
  height: number | null;
  exercise: Exercise | null;
  avatar: string;
};
