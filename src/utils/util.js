import enquireJs from 'enquire.js';

export function parseFullPath(href) {
  return href.replace(new RegExp(location.origin, 'g'), '');
}

export function isDef(v) {
  return v !== undefined && v !== null;
}

export function remove(arr, item) {
  if (arr.length) {
    const index = arr.indexOf(item);
    if (index > -1) {
      return arr.splice(index, 1);
    }
  }
}

export function isRegExp(v) {
  return _toString.call(v) === '[object RegExp]';
}

export function enquireScreen(call) {
  const handler = {
    match() {
      call && call(true);
    },
    unmatch() {
      call && call(false);
    },
  };
  enquireJs.register('only screen and (max-width: 767.99px)', handler);
}

const _toString = Object.prototype.toString;
