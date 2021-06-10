import axios from 'axios';

// 跨域代理前缀
const API_PROXY_PREFIX = '/api';
export const BASE_URL = process.env.NODE_ENV === 'production' ? process.env.VUE_APP_API_BASE_URL : API_PROXY_PREFIX;

// token 请求头
const xsrfHeaderName = 'Authorization';

axios.defaults.baseURL = BASE_URL;
axios.defaults.timeout = 5000;
axios.defaults.withCredentials = true;
axios.defaults.xsrfHeaderName = xsrfHeaderName;
axios.defaults.xsrfCookieName = xsrfHeaderName;

const requests = {
  get(url, params, config) {
    return axios.get(url, { params, ...config });
  },
  post(url, params, config) {
    return axios.post(url, { params, ...config });
  },
  put(url, params, config) {
    return axios.put(url, { params, ...config });
  },
  delete(url, params, config) {
    return axios.delete(url, { params, ...config });
  },
};

export default requests;

export function request(url, { method, params, config }) {
  if (!requests[method]) {
    return axios.get(url, { params, ...config });
  }
  return requests[method](url, { params, ...config });
}

export function setAuthorization(token) {
  sessionStorage.setItem(xsrfHeaderName, token);
}

export function getAuthorization() {
  return sessionStorage.getItem(xsrfHeaderName) || '';
}

export function removeAuthorization() {
  sessionStorage.removeItem(xsrfHeaderName);
}

export function checkAuthorization() {
  return !!sessionStorage.getItem(xsrfHeaderName);
}

// 401拦截
const resp401 = {
  /**
   * 响应数据之前做点什么
   */
  onFulfilled(response, options) {
    const { message } = options;
    if (response.code === 401) {
      message.error('无此权限');
    }
    return response;
  },
  /**
   * 响应出错时执行
   */
  onRejected(error, options) {
    const { message } = options;
    const { response } = error;
    if (response.status === 401) {
      message.error('无此权限');
    }
    return Promise.reject(error);
  },
};

const resp403 = {
  onFulfilled(response, options) {
    const { message } = options;
    if (response.code === 403) {
      message.error('请求被拒绝');
    }
    return response;
  },
  onRejected(error, options) {
    const { message } = options;
    const { response } = error;
    if (response.status === 403) {
      message.error('请求被拒绝');
    }
    return Promise.reject(error);
  },
};

const reqCommon = {
  /**
   * 发送请求之前做些什么
   */
  onFulfilled(config, options) {
    const { store } = options;
    // message.warning('提示信息');
    config.headers.common['Authorization'] = store.state.token;
    return config;
  },
  /**
   * 请求出错时做点什么
   */
  onRejected(error, options) {
    const { message } = options;
    message.error(error.message);
    return Promise.reject(error);
  },
};

const handle = {
  request: [reqCommon], // 请求拦截
  response: [resp401, resp403], // 响应拦截
};

export { axios, handle };
