export type ExerciseType = 'strength' | 'cardio' | 'crossfit';

export type Exercise = {
  id: number;
  name: string;
  type: ExerciseType;
  videoId?: string;
};

export type Exercises = {
  strength: Exercise[];
  cardio: Exercise[];
  crossfit: Exercise[];
};
