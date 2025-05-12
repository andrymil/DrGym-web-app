import * as yup from 'yup';

const schema = yup.object().shape({
  startDate: yup
    .date()
    .required('Start Date is required')
    .typeError('Invalid date'),
  endDate: yup
    .date()
    .required('End Date is required')
    .typeError('Invalid date'),
  description: yup.string().max(50, "it's too long (max 50 chars)"),
  interval: yup
    .number()
    .typeError('Interval must be a number')
    .min(1, 'Interval must be at least 1')
    .max(99, 'Interval must be less than 100')
    .when('isRegular', {
      is: true,
      then: (schema) => schema.required('Interval is required'),
      otherwise: (schema) => schema.notRequired(),
    }),
});

const strengthActivitySchema = yup.object().shape({
  exerciseType: yup.string().required('Exercise Type is required'),
  exercise: yup.string().required('Exercise is required'),
  reps: yup
    .number()
    .typeError('Reps must be a number')
    .min(1, 'Reps must be at least 1')
    .required('Reps are required'),
  weight: yup
    .number()
    .typeError('Weight must be a number')
    .min(0, 'Weight cannot be negative')
    .required('Weight is required'),
  duration: yup.mixed().nullable(),
});

const cardioActivitySchema = yup.object().shape({
  exerciseType: yup.string().required('Exercise Type is required'),
  exercise: yup.string().required('Exercise is required'),
  reps: yup.number().nullable(),
  weight: yup.number().nullable(),
  duration: yup
    .date()
    .required('Duration is required')
    .typeError('Duration is invalid'),
});

export { schema, strengthActivitySchema, cardioActivitySchema };
