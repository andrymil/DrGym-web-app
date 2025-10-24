import * as yup from 'yup';
import { EmailSchema } from '@/schemas/forms/EmailSchema';
import { PasswordSchema } from '@/schemas/forms/PasswordSchema';

export const ResetPasswordApiSchema = yup.object().shape({
  email: EmailSchema.required('E-mail address is required'),
  password: PasswordSchema,
  token: yup
    .string()
    .trim()
    .length(64, 'Invalid or malformed token')
    .required('Reset token is required'),
});

export type ResetPasswordRequest = yup.InferType<typeof ResetPasswordApiSchema>;
