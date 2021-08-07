// noinspection JSUnresolvedFunction
import Router from 'vue-router';
import router from '@/router';
import store from '@/store';
import { parseRoutes, clearMicros, micros } from '@/router/util';

const views = require.context('../views', true, /\.vue$/i);
const viewblock = {};

views.keys().forEach(key => {
  const len = key.length;
  const name = key.substr(2, len - 6);
  viewblock[name] = {
    path: name,
    component(resolve) {
      require.ensure([], function(require) {
        require([`../views/${key.slice(2)}`], resolve);
      });
    },
  };
});

if (process.env.NODE_ENV !== 'production') {
  console.log(
    '%c Pages ',
    'background:#aaa;color:#D33682',
    Object.keys(viewblock)
  );
}

export function loadRoutes(routes) {
  let routesConfig = routes;
  if (routesConfig) {
    store.commit('account/setRoutesConfig', routesConfig);
  } else {
    routesConfig = store.getters['account/routesConfig'];
  }

  if (routesConfig && routesConfig.length > 0) {
    clearMicros();
    const finalRoutes = parseRoutes(wrapRoutes(routesConfig), viewblock);
    const mainRoutes = finalRoutes.find(route => route.path === '/');
    for (const k in micros) {
      if (micros.hasOwnProperty(k)) {
        mainRoutes.children.push(micros[k]);
      }
    }
    router.options = { ...router.options, routes: finalRoutes };
    router.matcher = new Router({ ...router.options, routes: [] }).matcher;
    for (const key in finalRoutes) {
      if (Object.hasOwnProperty.call(finalRoutes, key)) {
        router.addRoute(finalRoutes[key]);
      }
    }
  }
  const rootRoute = router.options.routes.find(item => item.path === '/');
  const menuRoutes = rootRoute && rootRoute.children;
  if (menuRoutes) {
    store.commit('setting/setMenuData', menuRoutes);
  }
}

// 追加上 登录页面 与 404 页面
export function wrapRoutes(routeCfg) {
  const config = [
    {
      component: 'user/login',
      path: '/login',
      meta: {
        public: true, // 公开页面，如果为 false 则需要 store.state.token !== ''
      },
    },
    ...routeCfg,
  ];
  config.push({
    path: '/',
    name: 'home',
    redirect: '/login',
    children: [
      {
        path: '/',
        component: 'home/main',
      },
    ],
  });
  config.push({
    component: 'exception/404',
    path: '*',
    name: '404',
  });
  return config;
}

export default viewblock;
