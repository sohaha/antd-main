import Vue from 'vue';
import VueI18n from 'vue-i18n';

/**
 * 创建 i18n 配置
 * @param locale 本地化语言
 * @param fallback 回退语言
 * @returns {VueI18n}
 */
function initI18n (locale, fallback) {
  Vue.use(VueI18n);
  const i18nOptions = {
    locale,
    fallbackLocale: fallback,
    silentFallbackWarn: true,
  };
  return new VueI18n(i18nOptions);
}

/**
 * 格式化 router.options.routes，生成 fullPath
 * @param routes
 * @param parentPath
 */
function formatFullPath (routes, parentPath = '') {
  routes.forEach(route => {
    const isFullPath = route.path.substring(0, 1) === '/';
    route.fullPath = isFullPath ? route.path : (parentPath === '/' ? parentPath + route.path : parentPath + '/' + route.path);
    if (route.children) {
      formatFullPath(route.children, route.fullPath);
    }
  });
}

export {
  initI18n,
  formatFullPath
};
