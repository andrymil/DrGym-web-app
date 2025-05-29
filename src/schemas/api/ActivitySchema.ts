import * as yup from 'yup';
import { ExerciseSchema } from './ExerciseSchema';

export const ActivitySchema = yup.object().shape({
  exercise: ExerciseSchema.required('Exercise is required'),
  reps: yup
    .number()
    .min(0, 'Reps cannot be negative')
    .defined('Reps must be defined'),
  weight: yup
    .number()
    .min(0, 'Weight cannot be negative')
    .defined('Weight must be defined'),
  duration: yup.string().nullable().required('Duration is required'),
});
