<template>
  <a-layout-header :class="[headerTheme, 'admin-header']">
    <div :class="['admin-header-wide', layout, pageWidth]">
      <router-link v-if="isMobile || layout === 'head'" to="/" :class="['logo', isMobile ? null : 'pc', headerTheme]">
        <img width="32" src="@/assets/img/logo.png" >
        <h1 v-if="!isMobile">{{ systemName }}</h1>
      </router-link>
      <a-divider v-if="isMobile" type="vertical" />
      <a-icon
        v-if="!isMobile && layout !== 'head'"
        class="trigger"
        :type="collapsed ? 'menu-unfold' : 'menu-fold'"
        @click="toggleCollapse"
      />
      <div v-if="layout !== 'side' && !isMobile" class="admin-header-menu" :style="`width: ${menuWidth};`">
        <i-menu class="head-menu" :theme="headerTheme" mode="horizontal" :options="menuData" @select="onSelect" />
      </div>
      <div :class="['admin-header-right', headerTheme]">
        <header-notice class="header-item" />
        <header-avatar class="header-item" />
      </div>
    </div>
  </a-layout-header>
</template>

<script>
import HeaderNotice from './HeaderNotice';
import HeaderAvatar from './HeaderAvatar';
import IMenu from '@/components/Menu/menu';
import { mapState } from 'vuex';

export default {
  name: 'AdminHeader',
  components: { IMenu, HeaderAvatar, HeaderNotice },
  props: {
    collapsed: {
      type: Boolean,
      default: false,
    },
    menuData: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      searchActive: false,
    };
  },
  computed: {
    ...mapState('setting', ['theme', 'isMobile', 'layout', 'systemName', 'pageWidth']),
    headerTheme() {
      if (this.layout === 'side' && this.theme.mode === 'dark' && !this.isMobile) {
        return 'light';
      }
      return this.theme.mode;
    },
    menuWidth() {
      const { layout, searchActive } = this;
      const headWidth = layout === 'head' ? '100% - 188px' : '100%';
      const extraWidth = searchActive ? '600px' : '400px';
      return `calc(${headWidth} - ${extraWidth})`;
    },
  },
  methods: {
    toggleCollapse() {
      this.$emit('toggleCollapse');
    },
    onSelect(obj) {
      this.$emit('menuSelect', obj);
    },
  },
};
</script>

<style lang="less" scoped>
.admin-header{
  padding: 0;
  z-index: 2;
  box-shadow: @shadow-down;
  position: relative;
  user-select: none;
  background: @base-bg-color;
  .head-menu{
    height: 64px;
    line-height: 64px;
    vertical-align: middle;
    box-shadow: none;
  }
  &.dark{
    background: @header-bg-color-dark;
    color: white;
  }
  &.night{
    .head-menu{
      background: @base-bg-color;
    }
  }
  .admin-header-wide{
    padding-left: 24px;
    &.head.fixed{
      max-width: 1400px;
      margin: auto;
      padding-left: 0;
    }
    &.side{
      padding-right: 12px;
    }
    .logo {
      height: 64px;
      line-height: 58px;
      vertical-align: top;
      display: inline-block;
      padding: 0 12px 0 24px;
      cursor: pointer;
      font-size: 20px;
      color: inherit;
      &.pc{
        padding: 0 12px 0 0;
      }
      img {
        vertical-align: middle;
      }
      h1{
        color: inherit;
        display: inline-block;
        font-size: 16px;
      }
    }
    .trigger {
      font-size: 20px;
      line-height: 64px;
      padding: 0 24px;
      cursor: pointer;
      transition: color .3s;
      &:hover{
        color: @primary-color;
      }
    }
    .admin-header-menu{
      display: inline-block;
    }
    .admin-header-right{
      float: right;
      display: flex;
      color: inherit;
      .header-item{
        color: inherit;
        padding: 0 12px;
        cursor: pointer;
        align-self: center;
        a{
          color: inherit;
          i{
            font-size: 16px;
          }
        }
      }
      each(@theme-list, {
        &.@{value} .header-item{
          &:hover{
            @class: ~'hover-bg-color-@{value}';
            background-color: @@class;
          }
        }
      })
    }
  }
}
</style>
