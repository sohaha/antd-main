// noinspection JSUnresolvedFunction
import Router from 'vue-router';
import router from '@/router';
import store from '@/store';
import { parseRoutes } from '@/router/util';

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
  console.log('%c Pages ', 'background:#aaa;color:#D33682', Object.keys(viewblock));
}

export function loadRoutes(routes) {
  let routesConfig = routes;
  if (routesConfig) {
    store.commit('account/setRoutesConfig', routesConfig);
  } else {
    routesConfig = store.getters['account/routesConfig'];
  }

  // todo dev
  // routesConfig = [
  //   {
  //     path: '/',
  //     children: [
  //       { path: '/', name: '首页', meta: { icon: 'home' }, component: 'home/Main' },
  //       { path: '/demo', name: '示例页面', meta: { tip: '这是一个示例页面', icon: 'build' }, component: 'demo/Demo' },
  //       {
  //         name: '单独页面',
  //         path: '/demo/demo2',
  //         meta: { public: false, tip: '这是一个无页头页面', blank: true, icon: 'build' },
  //         component: 'demo/Demo',
  //       },
  //       {
  //         name: '远程应用',
  //         path: '/app/test1/lists',
  //         meta: { tip: '这是一个微应用页面', icon: 'api', blank: false },
  //         micro: { name: '微应用', entry: 'http://1.demo.hw.73zls.com/', activeRule: '/app/test1/' },
  //         component: '',
  //       },
  //       {
  //         name: '本地应用',
  //         path: '/app/9001',
  //         meta: { tip: '这是一个本地微应用页面', blank: true, icon: 'api' },
  //         micro: { name: '普通微应用', entry: 'http://127.0.0.1:9001/', activeRule: '/app/9001/' },
  //         // component: 'layout/Micro',
  //       },
  //       { path: 'docs', name: 'antv文档', meta: { icon: 'link', link: 'https://www.antdv.com/components/icon-cn/' } },
  //     ],
  //   },
  // ];
  if (routesConfig && routesConfig.length > 0) {
    const finalRoutes = parseRoutes(wrapRoutes(routesConfig), viewblock);
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
      component: 'user/Login',
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
        component: 'home/Main',
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
