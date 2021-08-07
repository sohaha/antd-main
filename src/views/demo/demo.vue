<template>
  <div class="new-page" :style="`min-height: ${minHeight}px`">
    <h1>演示页面</h1>
    <h3>这是一个演示页面！<a-input v-model="name" type="text" /></h3>
    <h4>{{ meta }}</h4>
    <p @click="goHome">点击跳转到首页{{ $root.noticeState }}</p>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      name: '',
    };
  },
  computed: {
    meta() {
      return this.$route.meta;
    },
    minHeight() {
      return this.correctPageMinHeight;
    },
    ...mapGetters('setting', ['correctPageMinHeight']),
  },
  mounted() {
    console.log('demo', this.$root.noticeState);
  },
  methods: {
    goHome() {
      this.$microGoto({ data: '/' });
    },
  },
};
</script>

<style scoped lang="less"></style>
