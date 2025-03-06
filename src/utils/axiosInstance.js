import axios from 'axios';
import { signOut } from 'next-auth/react';
import { removeUserData } from '@/utils/localStorage';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      removeUserData();
      signOut();
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
