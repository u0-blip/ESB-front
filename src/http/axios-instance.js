import axios from 'axios';
import { LOCALSTORAGE_KEYS } from '../utils/constants';
import { LoaderService } from '../service/LoaderService';

// to request headers
// pass access_token
// pass access_id
const instance = axios.create({
  // baseURL: 'http://172.26.148.244:4030/api'
  baseURL: '/api'
});

const requestsCache = [];

instance.interceptors.request.use(
  config => {
    requestsCache.push('request');
    // Do something before request is sent

    LoaderService.showLoader();

    const access_token = localStorage.getItem(LOCALSTORAGE_KEYS.ESB_TOKEN_ACCESS);
    const access_id = localStorage.getItem(LOCALSTORAGE_KEYS.ESB_TOKEN_ID);

    if (access_token != null) {
      config.headers['x-access-token'] = `Bearer ${access_token}`;
    }

    if (access_id != null) {
      config.headers['x-id-token'] = `Bearer ${access_id}`;
    }

    return config;
  },
  error => {
    // Do something with request error
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  config => {
    // Do something once response is back but before pages get it

    requestsCache.pop();
    if (requestsCache.length === 0) {
      setTimeout(() => {
        LoaderService.hideLoader();
      }, 800);
    }

    return config;
  },
  error => {
    // Do something with request error
    return Promise.reject(error);
  }
);

export default instance;
