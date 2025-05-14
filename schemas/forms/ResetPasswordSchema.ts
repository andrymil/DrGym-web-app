import * as yup from 'yup';
import YupPassword from 'yup-password';

YupPassword(yup);

const ResetPasswordSchema = () => {
  return yup.object().shape({
    password: yup
      .string()
      .max(30, 'too long')
      .min(10, 'too short')
      .minLowercase(2, 'minimum 2 lowercases')
      .minUppercase(1, 'minimum 1 uppercase')
      .minNumbers(1, 'minimum 1 number')
      .minSymbols(1, 'minimum 1 symbol')
      .required("it's required"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('password'), null], "doesn't match")
      .required("it's required"),
  });
};

const ResetPasswordDefaultValues = () => {
  return {
    password: '',
    confirmPassword: '',
  };
};

export { ResetPasswordSchema, ResetPasswordDefaultValues };
