import * as yup from 'yup';

const ForogtPasswordSchema = () => {
  return yup.object().shape({
    email: yup
      .string()
      .email("it's not an email")
      .max(50, 'maximum 50 characters')
      .min(5, 'minimum 5 characters')
      .required("it's required"),
  });
};

const ForogtPasswordDefaultValues = () => {
  return {
    email: '',
  };
};

export { ForogtPasswordSchema, ForogtPasswordDefaultValues };
