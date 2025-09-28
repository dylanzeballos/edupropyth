import axios from 'axios';
import { API_URL } from '@/lib/api-config';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

export const postData = async (endpoint: string, data: object) => {
  try {
    const response = await apiClient.post(endpoint, data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data || error.message);
  }
};

export const getData = async (endpoint: string) => {
  try {
    const response = await apiClient.get(endpoint);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data || error.message);
  }
};

export const putData = async (endpoint: string, data: object) => {
  try {
    const response = await apiClient.put(endpoint, data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data || error.message);
  }
};

export const deleteData = async (endpoint: string) => {
  try {
    const response = await apiClient.delete(endpoint);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data || error.message);
  }
};