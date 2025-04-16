import axios, { AxiosError } from 'axios';


const instance = axios.create({
  // baseURL을 작성해주세요.
  baseURL: 'https://petstore.swagger.io/v2',
});

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
