// lib/api.ts
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// Create Axios instance
const axiosInstance: AxiosInstance = axios.create({
  baseURL: 'https://taskflow-icvu.onrender.com/',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token (client only)
if (typeof window !== 'undefined') {
  axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
}

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('Unauthorized: Redirect to login or show modal');
    }
    return Promise.reject(error);
  }
);

type ApiRequestConfig = AxiosRequestConfig;

const api = {
  get: async <TResponse>(
    url: string,
    config?: ApiRequestConfig
  ): Promise<TResponse> => {
    const res: AxiosResponse<TResponse> = await axiosInstance.get(url, config);
    return res.data;
  },

  post: async <TResponse, TBody = unknown>(
    url: string,
    data?: TBody,
    config?: ApiRequestConfig
  ): Promise<TResponse> => {
    const res: AxiosResponse<TResponse> = await axiosInstance.post(
      url,
      data,
      config
    );
    return res.data;
  },

  put: async <TResponse, TBody = unknown>(
    url: string,
    data?: TBody,
    config?: ApiRequestConfig
  ): Promise<TResponse> => {
    const res: AxiosResponse<TResponse> = await axiosInstance.put(
      url,
      data,
      config
    );
    return res.data;
  },

  delete: async <TResponse>(
    url: string,
    config?: ApiRequestConfig
  ): Promise<TResponse> => {
    const res: AxiosResponse<TResponse> = await axiosInstance.delete(
      url,
      config
    );
    return res.data;
  },

  patch: async <TResponse, TBody = unknown>(
    url: string,
    data?: TBody,
    config?: ApiRequestConfig
  ): Promise<TResponse> => {
    const res: AxiosResponse<TResponse> = await axiosInstance.patch(
      url,
      data,
      config
    );
    return res.data;
  },
};

export default api;
