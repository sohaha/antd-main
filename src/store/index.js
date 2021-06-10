import Vue from 'vue';
import Vuex from 'vuex';
import { setAuthorization, getAuthorization, removeAuthorization } from '@/utils/request';

// noinspection JSUnresolvedFunction
const files = require.context('./modules', false, /\.js$/);
export const modules = {};

files
  .keys()
  .sort()
  .forEach(key => {
    const name = key.replace(/(\.\/|\.js)/g, '');
    modules[name] = files(key).default;
  });

Vue.use(Vuex);

const store = new Vuex.Store({
  state: { token: getAuthorization(), data: {} },
  mutations: {
    setData(state, data) {
      state.data = data;
    },
    setToken(state, token) {
      state.token = token;
      if (token) {
        setAuthorization(token);
      } else {
        removeAuthorization();
      }
    },
  },
  modules: modules,
});

export default store;
