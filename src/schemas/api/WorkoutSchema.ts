import * as yup from 'yup';
import { ActivitySchema } from './ActivitySchema';

export const WorkoutApiSchema = yup.object().shape({
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
  activities: yup
    .array()
    .of(ActivitySchema)
    .min(1, 'At least one activity is required')
    .required('Activities list is required'),
});

export type WorkoutRequest = yup.InferType<typeof WorkoutApiSchema>;
