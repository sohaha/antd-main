<template>
  <a-spin
    class="new-page"
    :style="`min-height: ${minHeight}px`"
    :spinning="spinning"
  >
    <h1>首页</h1>
    <h3 v-if="$root.noticeState.length === 0">这是一个普通页面</h3>
    <h3 v-else>{{ $root.noticeState }}</h3>
    <a-space>
      <a-button @click="updateMenu(1)">
        点击获取菜单1
      </a-button>
      <a-button @click="updateMenu(0)">
        点击获取菜单2
      </a-button>

      <a-input v-model="testData" />
    </a-space>
  </a-spin>
</template>

<script>
import { mapGetters } from 'vuex';
import { getRoutesConfig } from '@/api/user';
import { loadRoutes } from '@/router/register';

export default {
  data() {
    return {
      testData: '首页',
      spinning: false,
    };
  },
  computed: {
    minHeight() {
      return this.correctPageMinHeight;
    },
    ...mapGetters('setting', ['correctPageMinHeight']),
  },
  created() {},
  mounted() {},
  methods: {
    async updateMenu(full) {
      // 更新菜单
      this.spinning = true;
      await getRoutesConfig({ full }).then(result => {
        const routesConfig = result.data.data;
        loadRoutes(routesConfig);
      });
      this.spinning = false;
    },
  },
};
</script>

<style scoped lang="less"></style>
