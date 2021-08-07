<template>
  <admin-layout>
    <contextmenu
      :item-list="menuItemList"
      :visible.sync="menuVisible"
      @select="onMenuSelect"
    />
    <tabs-head
      v-if="multiPage"
      :active="activePage"
      :page-list="pageList"
      @change="changePage"
      @close="remove"
      @refresh="refresh"
      @contextmenu="onContextmenu"
    />
    <div
      :class="['tabs-view-content', layout, pageWidth]"
      :style="`margin-top: ${multiPage ? -24 : 0}px`"
    >
      <micro />
      <page-layout>
        <z-keep-alive
          v-if="multiPage && cachePage"
          v-model="clearCaches"
          :exclude-keys="excludeKeys"
        >
          <router-view v-if="!refreshing" ref="tabContent" :key="$route.path" />
        </z-keep-alive>
        <router-view v-else-if="!refreshing" ref="tabContent" />
      </page-layout>
    </div>
  </admin-layout>
</template>

<script>
import Vue from 'vue';
import AdminLayout from '@/layouts/AdminLayout';
import Contextmenu from '@/components/Menu/Contextmenu';
import { mapState, mapMutations } from 'vuex';
import ZKeepAlive from '@/components/Tools/ZKeepAlive';
import PageLayout from '@/layouts/PageLayout';
import TabsHead from '@/layouts/TabsHead';
import Micro from '@/layouts/Micro';
import layoutMixin from '@/utils/layoutMixin';

export default {
  name: 'BaseView',
  components: {
    Micro,
    PageLayout,
    TabsHead,
    Contextmenu,
    AdminLayout,
    ZKeepAlive,
  },
  mixins: [layoutMixin],
  data() {
    return {
      clearCaches: [],
      activePage: '',
      menuVisible: false,
      refreshing: false,
      excludeKeys: [],
    };
  },
  computed: {
    menuItemList() {
      return [
        { key: '1', icon: 'vertical-right', text: '关闭左侧' },
        { key: '2', icon: 'vertical-left', text: '关闭右侧' },
        { key: '3', icon: 'close', text: '关闭其它' },
        // { key: '4', icon: 'sync', text: '刷新页面' }, // 本来第一版有这功能，但是子应用需要多标签 keep 那么刷新会变得很麻烦，先屏蔽入口
      ];
    },
    tabsOffset() {
      return this.multiPage ? 24 : 0;
    },
    ...mapState('setting', [
      'multiPage',
      'cachePage',
      'animate',
      'layout',
      'pageWidth',
      'pageList',
    ]),
  },
  methods: {
    changePage(key) {
      this.activePage = key;
      const page = this.pageList.find(item => item.fullPath === key);
      if (!page) {
        console.warn(`标签页不存在: ${key}`);
        return;
      }
      this.$router.push(page.fullPath);
    },
    remove(key, next) {
      if (this.pageList.length === 1) {
        return this.$message.warning('这是最后一页，不能再关闭了');
      }

      let index = this.pageList.findIndex(item => item.fullPath === key);
      const pageList = [...this.pageList];
      this.clearCaches = pageList.splice(index, 1).map(page => page.cachedKey);
      this.setPageList(pageList);
      this.$nextTick(() => {
        if (next) {
          this.$router.push(next);
        } else if (key === this.activePage) {
          index =
            index >= this.pageList.length ? this.pageList.length - 1 : index;
          this.activePage = this.pageList[index].fullPath;
          this.$router.push(this.activePage);
        }
      });
    },
    refresh(key, data) {
      const page = data || this.pageList.find(item => item.fullPath === key);
      page.loading = true;
      this.clearCache(page);
      if (key === this.activePage) {
        this.reloadContent(() => {
          page.loading = false;
        });
      } else {
        // 加这个延迟让用户感知刷新这一过程
        setTimeout(() => {
          page.loading = false;
        }, 500);
      }
    },
    onContextmenu(pageKey, e) {
      if (pageKey) {
        e.preventDefault();
        e.meta = pageKey;
        this.menuVisible = true;
      }
    },
    onMenuSelect(key, target, pageKey) {
      switch (key) {
        case '1':
          this.closeLeft(pageKey);
          break;
        case '2':
          this.closeRight(pageKey);
          break;
        case '3':
          this.closeOthers(pageKey);
          break;
        case '4':
          this.refresh(pageKey);
          break;
        default:
          break;
      }
    },
    closeOthers(pageKey) {
      const clearPages = this.pageList.filter(
        item => item.fullPath !== pageKey && !item.unclose
      );
      this.clearCaches = clearPages.map(item => item.cachedKey);
      this.setPageList(
        this.pageList.filter(item => !clearPages.includes(item))
      );
      if (this.activePage !== pageKey) {
        this.activePage = pageKey;
        this.$router.push(this.activePage);
      }
    },
    closeLeft(pageKey) {
      const index = this.pageList.findIndex(item => item.fullPath === pageKey);
      const clearPages = this.pageList.filter(
        (item, i) => i < index && !item.unclose
      );
      this.clearCaches = clearPages.map(item => item.cachedKey);
      this.setPageList(
        this.pageList.filter(item => !clearPages.includes(item))
      );
      if (!this.pageList.find(item => item.fullPath === this.activePage)) {
        this.activePage = pageKey;
        this.$router.push(this.activePage);
      }
    },
    closeRight(pageKey) {
      const index = this.pageList.findIndex(item => item.fullPath === pageKey);
      const clearPages = this.pageList.filter(
        (item, i) => i > index && !item.unclose
      );
      this.clearCaches = clearPages.map(item => item.cachedKey);
      this.setPageList(
        this.pageList.filter(item => !clearPages.includes(item))
      );
      if (!this.pageList.find(item => item.fullPath === this.activePage)) {
        this.activePage = pageKey;
        this.$router.push(this.activePage);
      }
    },
    clearCache(page) {
      page._init_ = false;
      this.clearCaches = [page.cachedKey];
    },
    reloadContent(onLoaded) {
      this.refreshing = true;
      setTimeout(() => {
        this.refreshing = false;
        this.$nextTick(() => {
          this.setCachedKey(this.$route);
          if (typeof onLoaded === 'function') {
            onLoaded.apply(this, []);
          }
        });
      }, 220);
    },
    pageName(page) {
      return this.$t(page.keyPath);
    },
    createPage(route) {
      return Vue.observable({
        keyPath: route.matched[route.matched.length - 1].path,
        fullPath: route.fullPath,
        loading: false,
        path: route.path,
        title:
          route.meta && route.meta.page ? route.meta.page.title : route.name,
        unclose:
          route.meta && route.meta.page && route.meta.page.closable === false,
      });
    },
    ...mapMutations('setting', [
      'correctPageMinHeight',
      'setPageIndex',
      'setPageList',
      'pushPageList',
      'updatePageList',
    ]),
  },
};
</script>

<style lang="less" scoped>
.tabs-view {
  margin: -16px auto 8px;

  &.head.fixed {
    max-width: 1400px;
  }
}

.tabs-view-content {
  position: relative;

  &.head.fixed {
    width: 1400px;
    margin: 0 auto;
  }
}
</style>
