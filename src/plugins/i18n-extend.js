const VueI18nPlugin = {
  install(Vue) {
    Vue.mixin({
      methods: {
        $ta(syntaxKey, mode) {
          const keys = syntaxKey.split('|');
          const _this = this;
          const locale = this.$i18n.locale;
          let message = '';
          const splitter = locale === 'US' ? ' ' : '';
          keys.forEach(key => {
            message += _this.$t(key) + splitter;
          });
          if (keys.length > 0 && locale === 'US') {
            message = message.charAt(0).toUpperCase() + message.toLowerCase().substring(1);
          }
          return message;
        },
      },
    });
  },
};
export default VueI18nPlugin;
