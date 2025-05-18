import * as yup from 'yup';

const UsernameSchema = () => {
  return yup.object().shape({
    username: yup
      .string()
      .max(20, 'maximum 20 characters')
      .min(2, 'minimum 2 characters')
      .required("it's required"),
  });
};

const UsernameDefaultValues = (): { username: string } => {
  return {
    username: '',
  };
};

export { UsernameSchema, UsernameDefaultValues };
