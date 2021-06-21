/* 导航菜单参考
{
    "data": [
        {
            "path": "/",
            "children": [
                {
                    "path": "/",
                    "name": "首页",
                    "meta": {
                        "icon": "home"
                    },
                    "component": "home/Main"
                },
                {
                    "path": "/demo",
                    "name": "示例页面",
                    "meta": {
                        "tip": "这是一个示例页面",
                        "icon": "build"
                    },
                    "component": "demo/Demo"
                },
                {
                    "name": "单独页面",
                    "path": "/demo/demo2",
                    "meta": {
                        "tip": "这是一个无页头页面",
                        "blank": true,
                        "icon": "build"
                    },
                    "component": "demo/Demo"
                },
                {
                    "name": "远程应用",
                    "path": "/app/test1/lists",
                    "meta": {
                        "tip": "这是一个微应用页面",
                        "icon": "api",
                        "blank": false
                    },
                    "micro": {
                        "name": "微应用", // 名称 需要唯一 如: 会员管理系统
                        "entry": "http://1.demo.hw.73zls.com/", // 微应用地址，如: http://1.demo.hw.73zls.com/
                        "activeRule": "/app/test1/" // 微应用路由，如: /micro/xxx/
                    },
                },
                {
                    "name": "本地应用",
                    "path": "/app/9001",
                    "meta": {
                        "tip": "这是一个本地微应用页面",
                        "blank": true,
                        "icon": "api"
                    },
                    "micro": {
                        "name": "普通微应用",
                        "entry": "http://127.0.0.1:9001/",
                        "activeRule": "/app/9001/"
                    },
                },
                {
                    "path": "docs",
                    "name": "antv",
                    "meta": {
                        "icon": "link",
                        "link": "https://www.antdv.com/components/icon-cn/"
                    }
                }
            ]
        }
    ]
}
*/
import Vue from 'vue';
import Router from 'vue-router';
import { parseRoutes } from './util';
import { log } from '@/lib/debug';
import store from '@/store';
import components, { wrapRoutes } from './register';

Vue.use(Router);

function initRouter() {
    const routes = wrapRoutes([]);
    return new Router({
        mode: 'history',
        routes: parseRoutes(routes, components),
    });
}

const router = initRouter();

export default router;

router.beforeEach((to, from, next) => {
    log('Goto: ', from.path, '->', to.path);
    if (!to?.meta?.public && !store.state.token) {
        next('/login');
        return;
    }
    next();
});
