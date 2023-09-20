import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import indexVue from './pages/index.vue'
import V2BothwayProxy from './components/v2-bothway-proxy.vue'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: indexVue
  },
  {
    path: '/v2-port-bidirectional-forward',
    component: V2BothwayProxy
  }
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes
})
