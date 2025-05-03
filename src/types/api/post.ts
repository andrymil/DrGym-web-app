import type { Workout } from '@/types/api/workout';

export type Post = {
  id: number;
  author: string;
  date: Date;
  title: string;
  content: String;
  userReaction: boolean;
  reactionCount: number;
  workout: Workout;
};
