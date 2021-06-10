import config from '@/config';
import { ADMIN } from '@/config/default';
import { formatFullPath } from '@/utils/i18n';
import { getLocalSetting } from '@/utils/theme';

const localSetting = getLocalSetting(true);
const customTitlesStr = sessionStorage.getItem(process.env.VUE_APP_TBAS_TITLES_KEY);
const customTitles = (customTitlesStr && JSON.parse(customTitlesStr)) || [];

export default {
  namespaced: true,
  state: {
    isMobile: false,
    palettes: ADMIN.palettes,
    pageMinHeight: 0,
    pageIndex: 0,
    pageList: [],
    menuData: [],
    appsState: {},
    microAppVisible: false,
    activatedFirst: undefined,
    customTitles,
    ...config,
    ...localSetting,
  },
  getters: {
    correctPageMinHeight(state) {
      return state.pageMinHeight + (state.fixedTabs ? 64 : 0);
    },
    menuData(state, _) {
      return state.menuData;
    },
    firstMenu(_, getters) {
      const { menuData } = getters;
      if (menuData.length > 0 && !menuData[0].fullPath) {
        formatFullPath(menuData);
      }
      return menuData.map(item => {
        const menuItem = { ...item };
        delete menuItem.children;
        return menuItem;
      });
    },
    subMenu(state) {
      const { menuData, activatedFirst } = state;
      if (menuData.length > 0 && !menuData[0].fullPath) {
        formatFullPath(menuData);
      }
      const current = menuData.find(menu => menu.fullPath === activatedFirst);
      return (current && current.children) || [];
    },
    isFixedHeader(state) {
      return !state.fixedTabs && state.fixedTabs;
    },
  },
  mutations: {
    setDevice(state, isMobile) {
      state.isMobile = isMobile;
    },
    setTheme(state, theme) {
      state.theme = theme;
    },
    setLayout(state, layout) {
      state.layout = layout;
    },
    setMicroAppVisible(state, visible) {
      state.microAppVisible = visible;
    },
    setPageIndex(state, pageIndex) {
      state.pageIndex = pageIndex;
    },
    pushPageList(state, page) {
      state.pageList.push(page);
    },
    updatePageList(state, { page, index }) {
      state.pageList.splice(index, 1, page);
    },
    setPageList(state, pageList) {
      state.pageList = pageList;
    },
    setWeekMode(state, weekMode) {
      state.weekMode = weekMode;
    },
    setFixedHeader(state, fixedHeader) {
      state.fixedHeader = fixedHeader;
    },
    setFixedSideBar(state, fixedSideBar) {
      state.fixedSideBar = fixedSideBar;
    },
    setHideSetting(state, hideSetting) {
      state.hideSetting = hideSetting;
    },
    setAppsState(state, appsState) {
      state.appsState = appsState;
    },
    correctPageMinHeight(state, minHeight) {
      state.pageMinHeight += minHeight;
    },
    setMenuData(state, menuData) {
      state.menuData = menuData;
    },
    setAsyncRoutes(state, asyncRoutes) {
      state.asyncRoutes = asyncRoutes;
    },
    setPageWidth(state, pageWidth) {
      state.pageWidth = pageWidth;
    },
    setActivatedFirst(state, activatedFirst) {
      state.activatedFirst = activatedFirst;
    },
    setFixedTabs(state, fixedTabs) {
      state.fixedTabs = fixedTabs;
    },
  },
};
