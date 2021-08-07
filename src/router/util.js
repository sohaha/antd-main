import deepMerge from 'deepmerge';
import router from '@/router';
import store from '@/store';
import { warn } from '@/lib/debug';
import Empty from '@/layouts/Empty';
import BaseLayout from '@/layouts/BaseLayout';

const baseRouterMaps = {
  baseLayout: {
    component: BaseLayout,
  },
  empty: {
    component: Empty,
  },
};

export let micros = {};
export function clearMicros() {
  micros = {};
}

/**
 * 根据 路由配置 和 路由组件 解析路由
 */
export function parseRoutes(routesConfig, routerMaps, isChildren = false) {
  const newRouterMaps = {
    ...routerMaps,
    ...baseRouterMaps,
  };
  const routes = [];
  routesConfig.forEach(item => {
    const parseRes = parseConf(item, newRouterMaps);
    let router = parseRes[0];
    const routeCfg = parseRes[1];
    if (!router) {
      if (typeof item !== 'string' && !!routeCfg?.component) {
        console.warn(
          `can't find register for router ${routeCfg.component}, please register it in advance.`
        );
        return;
      }
      router = { path: item, name: item };
    }
    const meta = {
      micro: router.micro,
      icon: router.icon,
      page: router.page,
      link: router.link,
      blank: router?.blank || true,
      params: router.params,
      query: router.query,
      ...router.meta,
    };
    const cfgMeta = {
      micro: routeCfg.micro,
      icon: routeCfg.icon,
      page: routeCfg.page,
      link: routeCfg.link,
      params: routeCfg.params,
      query: routeCfg.query,
      ...routeCfg.meta,
    };
    Object.keys(cfgMeta).forEach(key => {
      if (
        cfgMeta[key] === undefined ||
        cfgMeta[key] === null ||
        cfgMeta[key] === ''
      ) {
        delete cfgMeta[key];
      }
    });
    Object.assign(meta, cfgMeta);
    const route = {
      path: routeCfg.path || router.path || routeCfg.router,
      name: routeCfg.name || router.name,
      component: router.component,
      redirect: routeCfg.redirect || router.redirect || null,
      meta: { ...meta },
    };
    if (routeCfg.micro?.activeRule) {
      if (!routeCfg.micro?.entry) {
        warn('micro application config errors');
        return;
      }
      route.component = Empty;
      const rule = `${routeCfg.micro?.activeRule}*`;
      route.meta.cache = false;
      route.meta.blank = true;
      if (!micros[rule]) {
        micros[rule] = {
          component: route.component,
          path: rule,
          name: `${route?.meta?.micro?.name || route.name || rule} `,
          meta: {
            cache: false,
            ...routeCfg.meta,
            micro: routeCfg.micro,
            invisible: true,
          },
        };
      }
    }
    if (routeCfg.invisible || router.invisible) {
      route.meta.invisible = true;
    }
    if (routeCfg.children && routeCfg.children.length > 0) {
      route.children = parseRoutes(routeCfg.children, newRouterMaps, true);
    }
    routes.push(route);
  });

  return routes;
}

function parseConf(item, routerMaps) {
  let routeCfg;
  let router;
  if (typeof item === 'string') {
    router = routerMaps[item];
    routeCfg = { path: (router && router.path) || item, router: item };
  } else if (typeof item === 'object') {
    router = routerMaps[item?.component || 'baseLayout'];
    routeCfg = item;
  }
  return [router, routeCfg];
}

export function deepMergeRoutes(target, source) {
  const mapRoutes = routes => {
    const routesMap = {};
    routes.forEach(item => {
      routesMap[item.path] = {
        ...item,
        children: item.children ? mapRoutes(item.children) : undefined,
      };
    });
    return routesMap;
  };

  const tarMap = mapRoutes(target);
  const srcMap = mapRoutes(source);
  const merge = deepMerge(tarMap, srcMap);
  const parseRoutesMap = routesMap => {
    return Object.values(routesMap).map(item => {
      if (item.children) {
        item.children = parseRoutesMap(item.children);
      } else {
        delete item.children;
      }
      return item;
    });
  };
  return parseRoutesMap(merge);
}

export function HTMLTitle(title) {
  let viewTitle = title;
  const route = router.currentRoute;
  if (route) {
    const systemName = store.state?.setting?.systemName || '';
    const separator = systemName && viewTitle ? ' - ' : '';
    viewTitle = (systemName ? systemName : '') + separator + viewTitle;
  }
  return viewTitle;
}

export function findPageListIndex(pageList, fullPath) {
  let index = pageList.findIndex(item => item.fullPath === fullPath);
  if (index === -1 && fullPath.substr(fullPath.length - 1) === '/') {
    index = pageList.findIndex(
      item => item.fullPath === fullPath.substr(0, fullPath.length - 1)
    );
  }

  return index;
}
