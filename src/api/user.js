import request, { removeAuthorization } from '@/utils/request';
import store from '@/store';
/**
 * 登录服务
 */
export function login(name, password) {
  return request.post('/login', {
    name: name,
    password: password,
  });
}

export function getRoutesConfig(data = {}) {
  return request.get('/routes', data);
}

/**
 * 退出登录
 */
export function logout() {
  removeAuthorization();
  store.commit('account/setRoutesConfig', null);
}

export default {
  login,
  logout,
  getRoutesConfig,
};
