<template>
  <a-layout-sider
    v-model="collapsed"
    :theme="sideTheme"
    :class="['side-menu', 'beauty-scroll', isMobile ? null : 'shadow']"
    :width="sideMenuWidth"
    :collapsible="collapsible"
    :trigger="null"
  >
    <div :class="['logo', theme]">
      <router-link to="/">
        <img src="@/assets/img/logo.png" alt="logo" >
        <h1>{{ systemName }}</h1>
      </router-link>
    </div>
    <i-menu :theme="theme" :collapsed="collapsed" :options="menuData" class="menu" @select="onSelect" />
  </a-layout-sider>
</template>

<script>
import IMenu from './menu';
import { mapState } from 'vuex';
import { sideMenuWidth } from '@/utils/theme';
export default {
  name: 'SideMenu',
  components: { IMenu },
  props: {
    collapsible: {
      type: Boolean,
      required: false,
      default: false,
    },
    collapsed: {
      type: Boolean,
      required: false,
      default: false,
    },
    menuData: {
      type: Array,
      required: true,
    },
    theme: {
      type: String,
      required: false,
      default: 'dark',
    },
  },
  data() {
    return {
      sideMenuWidth: sideMenuWidth,
    };
  },
  computed: {
    sideTheme() {
      return this.theme === 'light' ? this.theme : 'dark';
    },
    ...mapState('setting', ['isMobile', 'systemName']),
  },
  methods: {
    onSelect(obj) {
      this.$emit('menuSelect', obj);
    },
  },
};
</script>

<style lang="less" scoped>
.shadow {
  box-shadow: 2px 0 6px rgba(0, 21, 41, 0.35);
}
.side-menu {
  min-height: 100vh;
  overflow-y: auto;
  user-select: none;
  z-index: 10;
  .logo {
    height: 64px;
    position: relative;
    line-height: 64px;
    padding-left: 24px;
    -webkit-transition: all 0.3s;
    transition: all 0.3s;
    overflow: hidden;
    background-color: @layout-trigger-background;
    &.light {
      background-color: #fff;
      h1 {
        color: @primary-color;
      }
    }
    h1 {
      color: @menu-dark-highlight-color;
      font-size: 20px;
      margin: 0 0 0 12px;
      display: inline-block;
      vertical-align: middle;
    }
    img {
      width: 32px;
      vertical-align: middle;
    }
  }
}
.menu {
  padding: 16px 0;
}
</style>
