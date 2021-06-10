<template>
  <a-config-provider :get-popup-container="popContainer">
    <router-view />
  </a-config-provider>
</template>

<script>
import { enquireScreen } from './utils/util';
import { HTMLTitle, findPageListIndex } from '@/router/util';
import { mapState, mapMutations } from 'vuex';
import themeUtil from '@/utils/theme';

export default {
  name: 'App',
  data() {
    return {};
  },
  computed: {
    ...mapState('setting', ['layout', 'theme', 'multiPage', 'weekMode', 'systemName', 'pageList']),
  },
  watch: {
    weekMode(val) {
      this.setWeekModeTheme(val);
    },
    $route() {
      this.setHtmlTitle();
    },
    'theme.mode'(val) {
      const closeMessage = this.$message.loading(`您选择了主题模式 ${val}, 正在切换...`);
      themeUtil.changeThemeColor(this.theme.color, val).then(closeMessage);
    },
    'theme.color'(val) {
      const closeMessage = this.$message.loading(`您选择了主题色 ${val}, 正在切换...`);
      themeUtil.changeThemeColor(val, this.theme.mode).then(closeMessage);
    },
    layout() {
      window.dispatchEvent(new Event('resize'));
    },
  },
  created() {
    this.setHtmlTitle();
    enquireScreen(isMobile => this.setDevice(isMobile));
  },
  mounted() {
    this.setWeekModeTheme(this.weekMode);
  },
  methods: {
    ...mapMutations('setting', ['setDevice']),
    setWeekModeTheme(weekMode) {
      if (weekMode) {
        document.body.classList.add('week-mode');
      } else {
        document.body.classList.remove('week-mode');
      }
    },
    setHtmlTitle() {
      if (this.$route?.meta?.micro?.entry) {
        const index = findPageListIndex(this.pageList, this.$route.fullPath);
        if (index !== -1) {
          const page = this.pageList[index];
          const title = page.title;
          document.title = HTMLTitle(title);
          return;
        }
      }
      const title = this.$route.path === '/' ? '首页' : this.$route.matched[this.$route.matched.length - 1]?.name || '';
      document.title = HTMLTitle(title);
    },
    popContainer() {
      return document.getElementById('popContainer');
    },
  },
};
</script>

<style lang="less">
html,
body {
  margin: 0;
}

#popContainer {
  height: 100vh;
  overflow-y: scroll;
}

.new-page {
  height: 100%;
  background-color: @base-bg-color;
  text-align: center;
  padding: 200px 0 0 0;
  border-radius: 4px;

  h1 {
    font-size: 48px;
  }
}
</style>
