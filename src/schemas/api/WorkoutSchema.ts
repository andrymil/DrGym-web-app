import * as yup from 'yup';
import { ActivitySchema } from './ActivitySchema';

const WorkoutBaseSchema = yup.object().shape({
  startDate: yup
    .date()
    .required('Start Date is required')
    .typeError('Invalid date'),
  endDate: yup
    .date()
    .required('End Date is required')
    .typeError('Invalid date'),
  description: yup.string().max(50, 'Description is too long (max 50 chars)'),
  schedule: yup
    .number()
    .min(0, 'Schedule cannot be negative')
    .required('Schedule is required'),
});

export const CreateWorkoutSchema = WorkoutBaseSchema.shape({
  activities: yup
    .array()
    .of(ActivitySchema)
    .min(1, 'At least one activity is required')
    .required('Activities list is required'),
});

export const EditWorkoutSchema = WorkoutBaseSchema.shape({
  id: yup.number().required('Workout ID is required'),
  activitiesToAdd: yup.array().of(ActivitySchema).optional(),
  activitiesToDelete: yup.array().of(yup.number().integer()).optional(),
});

export type CreateWorkoutRequest = yup.InferType<typeof CreateWorkoutSchema>;

export type EditWorkoutRequest = yup.InferType<typeof EditWorkoutSchema>;
