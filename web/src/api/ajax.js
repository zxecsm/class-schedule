import axios from 'axios';
import NProgress from '../config/nprogress';
import router from '../router'
import { _delData, _err } from '../utils/common';
// 创建axios实例
let req = axios.create({
  baseURL: '/api',
  // baseURL: '/',
  timeout: 10000
});
req.defaults.withCredentials = true;
// 请求拦截
req.interceptors.request.use(
  (config) => {
    NProgress.start();
    // 携带token
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
// 响应拦截
req.interceptors.response.use(
  (res) => {
    NProgress.done();
    //相应成功做的事情
    if (res.data.code == 1) {
      _err(res.data.codeText);
    } else if (res.data.code == 2) {
      _delData('id');
      router.replace('/login'); //未登录跳转到登录页
    }
    return res.data;
  },
  () => {
    _err('服务器炸了~');
    NProgress.done();
  }
);
export default req;
