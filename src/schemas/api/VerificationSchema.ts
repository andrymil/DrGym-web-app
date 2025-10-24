import * as yup from 'yup';
import { EmailSchema } from '../forms/EmailSchema';

export const VerificationApiSchema = yup.object({
  email: EmailSchema.required('E-mail is required'),
  token: yup
    .string()
    .trim()
    .length(64, 'Invalid or malformed token')
    .required('Verification token is required'),
});

export type VerificationRequest = yup.InferType<typeof VerificationApiSchema>;
