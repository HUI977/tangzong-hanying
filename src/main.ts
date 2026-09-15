// 应用入口与路由注册
// 源出开源项目 xianmap (https://github.com/qiaoshouqing/xianmap, Copyright (c) 2026 qiaoshouqing, MIT)；本项目由其二次开发，详见 NOTICE.md
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import MapPage from './pages/MapPage.vue'
import KaoPage from './pages/KaoPage.vue'
import Map108NewPage from './pages/Map108NewPage.vue'
import Kao108NewPage from './pages/Kao108NewPage.vue'
import './index.css'

// 部署在任意子目录（如 https://archmap.cn/TZHY/）时，从当前路径推断路由基准
const routeBase = location.pathname.replace(/index\.html$/, '')
const router = createRouter({
  history: createWebHistory(routeBase),
  routes: [
    { path: '/', component: MapPage },
    { path: '/kao', component: KaoPage },
    { path: '/108NEW', component: Map108NewPage },
    { path: '/108NEW/kao', component: Kao108NewPage },
  ],
})

createApp(App).use(router).mount('#root')
