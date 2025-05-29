import * as yup from 'yup';

export const ExerciseSchema = yup.object().shape({
  id: yup.number().required('Exercise ID is required'),
  name: yup.string().required('Exercise name is required'),
  type: yup
    .string()
    .oneOf(['strength', 'cardio', 'crossfit'], 'Invalid exercise type')
    .required('Exercise type is required'),
  videoId: yup.string().nullable(),
});
