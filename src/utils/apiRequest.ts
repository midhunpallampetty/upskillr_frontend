// src/api/base.ts
import { AxiosInstance } from 'axios';

type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';

export const apiRequest = async <T>(
  axiosInstance: AxiosInstance,
  method: HttpMethod,
  url: string,
  data?: any,
  config?: any
): Promise<T> => {
  const response = await axiosInstance.request<T>({
    method,
    url,
    ...(method === 'get' || method === 'delete' ? {} : { data }),
    ...config,
  });

  return response.data;
};
