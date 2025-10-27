import axios from 'axios';
import { API_URL } from '@/lib/api-config';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const publicRoutes = [
      '/auth/login',
      '/auth/register',
      '/auth/google-login',
      '/auth/github-login',
      '/auth/microsoft-login',
    ];

    const isPublicRoute = publicRoutes.some((route) =>
      config.url?.includes(route),
    );

    if (!isPublicRoute) {
      const token = localStorage.getItem('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export const postData = async (endpoint: string, data: object) => {
  try {
    const response = await apiClient.post(endpoint, data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || error.message);
    }
    throw error;
  }
};

export const getData = async (endpoint: string) => {
  try {
    const response = await apiClient.get(endpoint);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || error.message);
    }
    throw error;
  }
};

export const putData = async (endpoint: string, data: object) => {
  try {
    const response = await apiClient.put(endpoint, data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || error.message);
    }
    throw error;
  }
};

export const deleteData = async (endpoint: string) => {
  try {
    const response = await apiClient.delete(endpoint);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || error.message);
    }
    throw error;
  }
};
