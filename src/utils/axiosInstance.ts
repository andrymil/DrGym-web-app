import axios, { AxiosError } from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '',
  withCredentials: true,
});

export function handleAxiosError(
  error: unknown,
  fallback = 'Something went wrong'
): string {
  if (
    typeof error === 'object' &&
    error !== null &&
    'isAxiosError' in error &&
    (error as AxiosError).isAxiosError
  ) {
    return (
      (error as AxiosError<{ error?: string }>).response?.data?.error ||
      fallback
    );
  }

  return fallback;
}

export default api;
