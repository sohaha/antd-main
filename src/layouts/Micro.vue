<template>
  <div>
    <a-spin
      v-for="(v, key) in apps"
      v-show="v.show"
      :key="key"
      size="large"
      :spinning="v.loading"
      :delay="200"
    >
      <div
        :id="key"
        class="new-page"
        :style="`min-height: ${minHeight}px;padding:0;`"
      />
    </a-spin>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { loadMicroApp } from '@/bootstrap';

export default {
  name: 'Micro',
  data() {
    return {
      apps: {},
    };
  },
  computed: {
    minHeight() {
      return this.correctPageMinHeight;
    },
    ...mapGetters('setting', ['correctPageMinHeight']),
  },
  watch: {
    $route() {
      this.nextMicro();
      this.updateActive();
    },
  },
  mounted() {
    this.nextMicro();
    this.updateActive();
  },
  destroyed() {
    const apps = this.apps;
    Object.keys(apps).forEach(key => {
      apps[key].single.unmount();
    });
  },
  methods: {
    updateActive() {
      const status = this.$store.state.setting['appsState'];
      let visible = false;
      for (const key in this.apps) {
        if (Object.hasOwnProperty.call(this.apps, key)) {
          this.apps[key].show = this.isActiveMicro(this.apps[key]);
          if (!status[key]) {
            status[key] = { show: this.apps[key].show };
          } else {
            status[key].show = this.apps[key].show;
          }
          if (!visible && status[key].show) {
            visible = true;
          }
        }
      }
      this.$store.commit('setting/setAppsState', status);
      this.$store.commit('setting/setMicroAppVisible', visible);
    },
    isActiveMicro({ micro }) {
      let activeRule = micro.activeRule || '';
      if (activeRule.endsWith('/')) {
        activeRule = activeRule.substr(0, activeRule.length - 1);
      }
      return this.$route.path.indexOf(activeRule) === 0;
    },
    nextMicro() {
      const micro = this.$route?.meta?.micro;
      if (!micro?.entry) {
        return;
      }

      const name = micro?.name || micro.entry;
      if (this.apps[name]) {
        const el = document.querySelector(`#${name}`);
        if (!(!el || !el.childElementCount)) {
          return;
        }
      }

      this.$set(this.apps, name, {
        micro,
        single: null,
        show: true,
        loading: true,
      });

      const isActiveMicro = this.isActiveMicro;
      this.$nextTick(() => {
        const single = loadMicroApp(name, micro, {
          isActive() {
            return isActiveMicro({ micro }, name);
          },
        });
        single.loadPromise
          .then(_ => {
            this.apps[name].single = single;
            this.apps[name].loading = false;
          })
          .catch(err => {
            single?.unmount();
            this.$delete(this.apps, name);
            this.$message.error(`${name} 加载失败：${err.message}`, 3);
            this.$router.back();
          });
      });
    },
  },
};
</script>

<style></style>
