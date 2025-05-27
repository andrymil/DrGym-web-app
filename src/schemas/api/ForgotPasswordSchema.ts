import { InferType } from 'yup';
import { ForgotPasswordSchema as FormSchema } from '@/schemas/forms/ForgotPasswordSchema';

export const ForgotPasswordApiSchema = FormSchema();

export type ForgotPasswordRequest = InferType<typeof ForgotPasswordApiSchema>;
