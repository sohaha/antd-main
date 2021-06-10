// 此配置为系统默认设置，需修改的设置项，在src/config/config.js中添加修改项即可。也可直接在此文件中修改。
module.exports = {
  theme: {
    color: '#1890ff', // 主题色
    mode: 'dark', // 主题模式 可选 dark、 light 和 night
    success: '#52c41a', // 成功色
    warning: '#faad14', // 警告色
    error: '#f5222f', // 错误色
  },
  layout: 'side', // 导航布局，可选 side 和 head，分别为侧边导航和顶部导航
  fixedHeader: true, // 固定头部状态栏，true:固定，false:不固定
  fixedSideBar: true, // 固定侧边栏，true:固定，false:不固定
  fixedTabs: false, // 固定页签头，true:固定，false:不固定
  pageWidth: 'fluid', // 内容区域宽度，fixed:固定宽度，fluid:流式宽度
  weekMode: false, // 色弱模式，true:开启，false:不开启
  multiPage: true, // 多标签，true:开启，false:不开启
  cachePage: true, // 是否缓存页面数据，仅多页签模式下生效，true 缓存, false 不缓存
  hideSetting: process.env.NODE_ENV === 'production', // 隐藏设置抽屉，true:隐藏，false:不隐藏
  systemName: process.env.VUE_APP_NAME, // 系统名称
  copyright: `2021 - ${new Date().getFullYear()}`, // copyright
  showPageTitle: true, // 是否显示页面标题 true:显示，false:不显示
  showFooter: false, // 是否显示 Footer
  footerLinks: [
    // 页面底部链接，{link: '链接地址', name: '名称/显示文字', icon: '图标，支持 ant design vue 图标库'}
  ],
};
