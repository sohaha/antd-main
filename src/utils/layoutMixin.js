export default {
  watch: {
    '$router.options.routes'(val) {
      this.excludeKeys = [];
      this.loadCacheConfig(val);
    },
    $route(newRoute) {
      this.activePage = newRoute.fullPath;
      const page = this.pageList.find(item => item.fullPath === newRoute.fullPath);
      if (!this.multiPage) {
        this.setPageList([this.createPage(newRoute)]);
      } else if (!page) {
        this.pushPageList(this.createPage(newRoute));
      }
      if (this.multiPage) {
        this.$nextTick(() => {
          this.setCachedKey(newRoute);
        });
      }
    },
    multiPage(newVal) {
      if (!newVal) {
        this.setPageList([this.createPage(this.$route)]);
        this.removeListener();
      } else {
        this.addListener();
      }
    },
    tabsOffset(newVal, oldVal) {
      this.correctPageMinHeight(oldVal - newVal);
    },
  },
  created() {
    this.loadCacheConfig(this.$router?.options?.routes);
    this.loadCachedTabs();
    const route = this.$route;
    if (this.pageList.findIndex(item => item.path === route.path) === -1) {
      this.pushPageList(this.createPage(route));
    }
    this.activePage = route.path;
    if (this.multiPage) {
      this.$nextTick(() => {
        this.setCachedKey(route);
      });
      this.addListener();
    }
  },
  mounted() {
    this.correctPageMinHeight(-this.tabsOffset);
  },
  beforeDestroy() {
    this.removeListener();
    this.correctPageMinHeight(this.tabsOffset);
  },
  methods: {
    setCachedKey(route) {
      const pageIndex = this.pageList.findIndex(item => item.fullPath === route.fullPath);
      const page = this.pageList[pageIndex];
      page.unclose = route.meta && route.meta.page && route.meta.page.closable === false;
      const vnode = this.$refs?.tabContent?.$vnode;
      const componentOptions = vnode?.componentOptions;
      this.setPageIndex(pageIndex);
      if (!page._init_ && componentOptions) {
        // const componentName = componentOptions.Ctor.options.name || componentOptions.tag;
        page.cachedKey = `${componentOptions.Ctor.cid}|${route.fullPath}`;
        page._init_ = true;
      }
    },
    loadCachedTabs() {
      const cachedTabsStr = sessionStorage.getItem(process.env.VUE_APP_TBAS_KEY);
      if (cachedTabsStr) {
        try {
          const cachedTabs = JSON.parse(cachedTabsStr);
          if (cachedTabs.length > 0) {
            this.setPageList(cachedTabs);
          }
        } catch (e) {
          console.warn('failed to load cached tabs, got exception:', e);
        } finally {
          sessionStorage.removeItem(process.env.VUE_APP_TBAS_KEY);
        }
      }
    },
    loadCacheConfig(routes, pCache = true) {
      routes.forEach(item => {
        const cacheAble = item.meta?.cache === false ? false : pCache;
        if (!cacheAble) {
          this.excludeKeys.push(new RegExp(`${item.path}\\d+$`));
        }
        if (item.children) {
          this.loadCacheConfig(item.children, cacheAble);
        }
      });
    },
    addListener() {
      window.addEventListener('page:close', this.closePageListener);
      window.addEventListener('page:refresh', this.refreshPageListener);
      window.addEventListener('unload', this.unloadListener);
    },
    removeListener() {
      window.removeEventListener('page:close', this.closePageListener);
      window.removeEventListener('page:refresh', this.refreshPageListener);
      window.removeEventListener('unload', this.unloadListener);
    },
    closePageListener(event) {
      const { closeRoute, nextRoute } = event.detail;
      const closePath = typeof closeRoute === 'string' ? closeRoute : closeRoute.fullPath;
      const path = closePath && closePath.split('?')[0];
      this.remove(path, nextRoute);
    },
    refreshPageListener(event) {
      const { pageKey } = event.detail;
      const path = pageKey && pageKey.split('?')[0];
      this.refresh(path);
    },
    unloadListener() {
      const tabs = this.pageList.map(item => ({ ...item, _init_: false }));
      sessionStorage.setItem(process.env.VUE_APP_TBAS_KEY, JSON.stringify(tabs));
    },
  },
};
