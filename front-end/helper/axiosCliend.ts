import axios from 'axios';
import _CONF from 'config/config';
import { getCookie } from 'cookies-next';

const axiosClient = axios.create({
  baseURL: _CONF.DOMAIN,
  withCredentials: true,
});
// Đính kèm token cho mọi tương tác api (API chưa được gửi)
// interceptors.request: Xử lý request trước khi gửi lên server
axiosClient.interceptors.request.use(
  async (config: any) => {
    const token = getCookie('access_token');
    if (token) {
      config.headers = {
        'x-access-token': token,
      };
    }
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

export default axiosClient;
