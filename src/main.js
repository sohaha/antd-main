import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from '@/store';
import Plugins from '@/plugins';
import { initI18n } from '@/utils/i18n';
import { notice, removeNotice } from '@/microMethod';
import bootstrap from './bootstrap';
import '@/theme/index.less';
import '@/components/lazy';
import 'moment/locale/zh-cn';

Vue.config.productionTip = false;

Vue.use(Plugins);

bootstrap({ router, store, message: Vue.prototype.$message });

new Vue({
  data() {
    return {
      noticeState: [],
    };
  },
  computed: {
    show() {
      return !store.state.setting.microAppVisible;
    },
  },
  watch: {
    '$route.fullPath'() {
      this.$nextTick(() => {
        if (this.show) {
          const from = { from: location.href };
          this.noticeState = notice(from);
          removeNotice(from);
        }
      });
    },
  },
  router,
  store,
  i18n: initI18n('CN'),
  render: h => h(App),
}).$mount('#app');
