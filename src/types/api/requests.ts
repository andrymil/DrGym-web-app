import { InferType } from 'yup';
import { RegisterApiSchema } from '@/schemas/api/RegisterSchema';

export type RegisterRequest = InferType<typeof RegisterApiSchema>;
