import * as yup from 'yup';
import { EmailSchema } from '../forms/EmailSchema';

export const VerificationApiSchema = yup.object({
  email: EmailSchema.required('E-mail is required'),
  token: yup
    .string()
    .trim()
    .min(1, 'Verification token is required')
    .required('Verification token is required'),
});

export type VerificationRequest = yup.InferType<typeof VerificationApiSchema>;
