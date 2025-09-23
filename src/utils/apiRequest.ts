// src/api/base.ts
import { AxiosInstance, AxiosRequestConfig } from 'axios';

type HttpMethod =
  | 'get'
  | 'post'
  | 'put'
  | 'patch'
  | 'delete'
  | 'options'
  | 'head'
  | 'trace';

export const apiRequest = async <T>(
  axiosInstance: AxiosInstance,
  method: HttpMethod,
  url: string,
  data?: any,
  dataOrParams?: any,
  config?: AxiosRequestConfig
): Promise<T> => {
  const response = await axiosInstance.request<T>({
    method,
    url,
    ...(method === 'get' || method === 'delete' || method === 'head' || method === 'options' || method === 'trace'
      ? {params: dataOrParams }
      : { data:dataOrParams }),
    ...config,
  });

  return response.data;
};
