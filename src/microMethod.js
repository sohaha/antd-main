import router from '@/router';
import { findPageListIndex } from '@/router/util';
import { parseFullPath, log } from '@/utils/util';
import store from '@/store';

// noticeState => options: {from: '', to: '', ...}
const noticeState = {};

export const notice = ({ from }) => {
  log('GetNotice', from);
  return noticeState[from] || [];
};

export const sendNotice = state => {
  const { from, to, data } = state;
  log('SendNotice', to, ':', data);
  if (to === from) {
    log('不能自己给自己传递数据');
    return;
  }
  const notice = noticeState[to] || [];
  notice.push({ from, data });
  noticeState[to] = notice;
};

export const removeNotice = ({ from }) => {
  if (noticeState[from]) {
    delete noticeState[from];
  }
};

const setHtmlTitle = ({ data: title, isMicro, from }) => {
  let viewTitle = title;
  const fullPath = parseFullPath(from);
  const route = router.currentRoute;
  if (route) {
    const systemName = store.state?.setting?.systemName || '';
    const separator = systemName && viewTitle ? ' - ' : '';
    viewTitle = (systemName ? systemName : '') + separator + viewTitle;
  }
  if (isMicro) {
    // 设置 Tab 标题
    const setting = store.state['setting'];
    const index = findPageListIndex(setting.pageList, fullPath);
    const page = setting.pageList[index];
    if (page) {
      page.title = title;
      store.commit('setting/updatePageList', { page, index });
    } else {
      // 考虑是否需要回退
    }
  }
  document.title = viewTitle;
};

const goto = state => {
  const { data } = state;
  router.push(data).then(to => {
    console.log('路由跳转完毕', to);
  });
};

// 客户端需要实现的方法
const methods = {
  goto,
  setHtmlTitle,
  notice,
  sendNotice,
  removeNotice,
};

export default methods;
