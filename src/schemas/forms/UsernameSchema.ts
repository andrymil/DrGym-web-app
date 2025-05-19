import * as yup from 'yup';

const UsernameSchema = () => {
  return yup.object().shape({
    username: yup
      .string()
      .max(20, 'Username - maximum 20 characters')
      .min(2, 'Username - minimum 2 characters')
      .required('Username is required'),
  });
};

const UsernameDefaultValues = (): { username: string } => {
  return {
    username: '',
  };
};

export { UsernameSchema, UsernameDefaultValues };
