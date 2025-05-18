import { RegisterSchema as RegisterFormSchema } from '@/schemas/forms/RegisterSchema';
import { InferType } from 'yup';

export const RegisterApiSchema = RegisterFormSchema().omit(['confirmPassword']);

export type RegisterApiRequest = InferType<typeof RegisterApiSchema>;
