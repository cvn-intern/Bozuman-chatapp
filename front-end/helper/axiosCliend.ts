import axios from 'axios';
import _CONF from 'config/config';
const cookie = require('cookie-cutter');

// export const getCookie = async () => {
//   try {
//     const token = await cookie.get('access_token')
//     axios.defaults.headers.common['x-access-token'] = token;
//   } catch (error) {
//     console.log(error);
//   }
// }


// export const axiosInstance = axios.create({
//   // baseURL: 'https://api.GitHub.com/',
//   // timeout: 1000,
//   headers: {
//     'x-access-token': cookie.get('access_token')
//   }
// });

const axiosClient = axios.create({
  baseURL: _CONF.DOMAIN,
  withCredentials : true
});
// Đính kèm token cho mọi tương tác api (API chưa được gửi)
// interceptors.request: Xử lý request trước khi gửi lên server 
// axiosClient.interceptors.request.use(
//   // Xử lý trước khi request được gửi lên server
//   (config) => {
//     // Thêm Authorization và header
//     const userInfo = localStorage.getItem("userInfo");
//     if(userInfo) {
//       const {accessToken} = JSON.parse(userInfo)
//       config.headers.Authorization = `Bearer ${accessToken}`
      
//     }
//     // console.log(config)
//     return config
//   },
//   // Xử lý khi request bị lỗi
//   (error) => {
//     return Promise.reject(error);
//   }
// )

export default axiosClient