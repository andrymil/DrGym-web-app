import type { Workout } from '@/types/api/workout';

export type Post = {
  id: number;
  username: string;
  avatar: string;
  date: Date;
  title: string;
  content: string;
  userReaction: boolean;
  reactionCount: number;
  workout: Workout;
};

export type PostInfo = Omit<Post, 'workout'>;
