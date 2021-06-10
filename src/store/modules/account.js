export default {
  namespaced: true,
  state: {
    user: null,
    routesConfig: null,
  },
  getters: {
    user(state) {
      if (!state.user) {
        try {
          const user = localStorage.getItem(process.env.VUE_APP_USER_KEY);
          state.user = JSON.parse(user);
        } catch (e) {
          console.error(e);
        }
      }
      return state.user;
    },
    routesConfig(state) {
      if (!state.routesConfig) {
        try {
          const routesConfig = localStorage.getItem(process.env.VUE_APP_ROUTES_KEY);
          state.routesConfig = JSON.parse(routesConfig);
          state.routesConfig = state.routesConfig ? state.routesConfig : [];
        } catch (e) {
          console.error(e.message);
        }
      }
      return state.routesConfig;
    },
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
      localStorage.setItem(process.env.VUE_APP_USER_KEY, JSON.stringify(user));
    },
    setRoutesConfig(state, routesConfig) {
      if (!routesConfig) {
        state.routesConfig = null;
        localStorage.removeItem(process.env.VUE_APP_ROUTES_KEY);
        return;
      }
      state.routesConfig = routesConfig;
      localStorage.setItem(process.env.VUE_APP_ROUTES_KEY, JSON.stringify(routesConfig));
    },
  },
};
