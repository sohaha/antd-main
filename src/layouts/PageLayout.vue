<template>
  <div class="page-layout">
    <page-header
      v-show="showBreadcrumb"
      ref="pageHeader"
      :breadcrumb="breadcrumb"
      :title="pageTitle"
      :logo="logo"
      :avatar="avatar"
    >
      <template v-slot:action>
        <slot name="action" />
      </template>
      <template v-slot:content>
        <slot name="headerContent" />
        <div v-if="!$slots.headerContent && desc">
          <p>{{ desc }}</p>
          <div v-if="linkList" class="link">
            <template v-for="(link, index) in linkList">
              <a :key="index" :href="link.href">
                <a-icon :type="link.icon" />
                {{ link.title }}</a
              >
            </template>
          </div>
        </div>
      </template>
      <template v-slot:extra>
        <slot v-if="$slots.extra" name="extra" />
      </template>
    </page-header>
    <div ref="page" :class="['page-content', layout, pageWidth]" :style="pageStyle">
      <slot />
    </div>
  </div>
</template>

<script>
import PageHeader from '@/layouts/header/PageHeader';
import { mapState, mapMutations } from 'vuex';

export default {
  name: 'PageLayout',
  components: { PageHeader },
  props: {
    extraImage: {
      type: String,
      default: '',
    },
    linkList: {
      type: String,
      default: '',
    },
    avatar: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
    logo: {
      type: String,
      default: '',
    },
    desc: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      page: {},
      pageHeaderHeight: 0,
    };
  },
  computed: {
    ...mapState('setting', ['layout', 'multiPage', 'pageMinHeight', 'showFooter', 'pageWidth', 'customTitles']),
    paddingBottom() {
      return this.showFooter ? 0 : 24;
    },
    pageTitle() {
      const pageTitle = this.page && this.page.title;
      return this.customTitle || (pageTitle && this.$t(pageTitle)) || this.title || this.routeName;
    },
    pageStyle() {
      let style = `padding-bottom: ${this.paddingBottom}px;`;
      if (!this.showBreadcrumb) {
        style += `padding-top:0;`;
      }
      return style;
    },
    showBreadcrumb() {
      return !this.$route.meta.blank && !this.$route.meta?.micro;
    },
    routeName() {
      const route = this.$route;
      return route.matched[route.matched.length - 1].name;
    },
    breadcrumb() {
      const page = this.page;
      const breadcrumb = page && page.breadcrumb;
      if (breadcrumb) {
        const i18nBreadcrumb = [];
        breadcrumb.forEach(item => {
          i18nBreadcrumb.push(this.$t(item));
        });
        return i18nBreadcrumb;
      } else {
        return this.getRouteBreadcrumb();
      }
    },
    marginCorrect() {
      return this.multiPage ? 24 : 0;
    },
  },
  watch: {
    $route() {
      this.page = this.$route.meta.page;
    },
  },
  updated() {
    if (!this._inactive) {
      this.updatePageHeight();
    }
  },
  activated() {
    this.updatePageHeight();
  },
  deactivated() {
    this.updatePageHeight(0);
  },
  mounted() {
    this.updatePageHeight();
  },
  created() {
    this.page = this.$route.meta.page;
  },
  beforeDestroy() {
    this.updatePageHeight(0);
  },
  methods: {
    ...mapMutations('setting', ['correctPageMinHeight']),
    getRouteBreadcrumb() {
      const routes = this.$route.matched;
      const path = this.$route.path;
      const breadcrumb = [];
      routes
        .filter(item => path.includes(item.path))
        .forEach(route => {
          const path = route.path.length === 0 ? '首页' : route.name;
          breadcrumb.push(path);
        });
      const pageTitle = this.page && this.page.title;
      if (this.customTitle || pageTitle) {
        breadcrumb[breadcrumb.length - 1] = this.customTitle || pageTitle;
      }
      return breadcrumb;
    },
    /**
     * 用于计算页面内容最小高度
     * @param newHeight
     */
    updatePageHeight(newHeight = this.$refs.pageHeader.$el.offsetHeight + this.marginCorrect) {
      this.correctPageMinHeight(this.pageHeaderHeight - newHeight);
      this.pageHeaderHeight = newHeight;
    },
  },
};
</script>

<style lang="less">
.page-header {
  margin: 0 -24px 0;
}

.link {
  /*margin-top: 16px;*/
  line-height: 24px;

  a {
    font-size: 14px;
    margin-right: 32px;

    i {
      font-size: 22px;
      margin-right: 8px;
    }
  }
}

.page-content {
  box-sizing: border-box;
  position: relative;
  padding: 24px 0 0;

  &.head.fixed {
    margin: 0 auto;
    max-width: 1400px;
  }
}
</style>
