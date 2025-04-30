import * as yup from 'yup';

const AccountSchema = () => {
  return yup.object().shape({
    username: yup
      .string()
      .max(20, 'maximum 20 characters')
      .min(2, 'minimum 2 characters')
      .required("it's required"),
    firstName: yup
      .string()
      .max(20, 'maximum 20 characters')
      .min(2, 'minimum 2 characters')
      .required("it's required"),
    surname: yup
      .string()
      .max(30, 'maximum 30 characters')
      .min(2, 'minimum 2 characters')
      .required("it's required"),
    weight: yup
      .number()
      .typeError('must be a number')
      .min(0, 'cannot be negative'),
    height: yup
      .number()
      .typeError('must be a number')
      .min(0, 'cannot be negative'),
  });
};

const AccountDefaultValues = (userData) => {
  return {
    username: userData.username || '',
    firstName: userData.firstName || '',
    surname: userData.surname || '',
    weight: userData.weight || '',
    height: userData.height || '',
    exercise: userData.favoriteExercise,
  };
};

export { AccountSchema, AccountDefaultValues };
