import axios, { AxiosError } from 'axios';

const instance = axios.create({});

instance.interceptors.request.use(
  async (config) => {
    return config;
  },
  (error) => {
    Promise.reject(error);
  },
);

instance.interceptors.response.use(
  (res) => {
    return res;
  },
  async (error: AxiosError) => {
    try {
      return Promise.reject(error);
    } catch (e) {
      Promise.reject(e);
    }
  },
);
export default instance;
