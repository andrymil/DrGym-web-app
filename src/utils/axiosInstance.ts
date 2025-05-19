import axios, { AxiosError } from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '',
  withCredentials: true,
});

export function handleAxiosError(
  error: unknown,
  fallback = 'Something went wrong'
): { message: string; status?: number } {
  if (
    typeof error === 'object' &&
    error !== null &&
    'isAxiosError' in error &&
    (error as AxiosError).isAxiosError
  ) {
    const axiosError = error as AxiosError<{ error?: string }>;

    return {
      message: axiosError.response?.data?.error || fallback,
      status: axiosError.response?.status,
    };
  }

  return { message: fallback };
}

export default api;
