import { initGlobalState, loadMicroApp as loadMicro } from 'qiankun';
import { loadRoutes } from '@/router/register';
import { loadInterceptors } from '@/lib/axios';
import { axios, handle } from '@/utils/request';
import store from '@/store';
import methods, { notice } from './microMethod';
import Vue from 'vue';

export const actions = initGlobalState({
  method: '',
  from: '',
  to: '',
  options: {},
  appsState: {},
});

actions.onGlobalStateChange((state, prev) => {
  const { method, options } = state;
  if (!methods[method]) {
    console.warn('不存在调用方法', method, options);
    return;
  }
  return methods[method](options);
});

export function setGlobalState(state) {
  actions.setGlobalState(state);
}

export function loadMicroApp(name, micro, props) {
  return loadMicro(
    {
      name,
      entry: micro.entry,
      container: '#' + name,
      props: {
        ...props,
        appName: name,
        notice,
        routerBase: micro.activeRule,
        globalStore: store,
      },
    },
    {
      sandbox: { strictStyleIsolation: true, experimentalStyleIsolation: true },
      ...(micro.config || {}),
    }
  );
}

export default function bootstrap({ router, store, message }) {
  Vue.prototype.$microNotice = (to, data) => {
    const state = {
      method: 'notice',
      options: {
        from: router.currentRoute.fullPath,
        to,
        data,
      },
    };
    setGlobalState(state);
  };
  loadInterceptors(axios, handle,{ router, store, message });
  loadRoutes();
}
