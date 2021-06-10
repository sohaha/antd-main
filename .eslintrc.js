module.exports = {
  extends: [
      'zls',
      'zls/vue',
  ],
  rules: {
      // 自定义规则
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
  },
};