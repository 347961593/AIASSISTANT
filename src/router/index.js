import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  // history: createWebHistory(import.meta.env.BASE_URL),
  history: createWebHashHistory("/baichenyang/"),
  routes: [
    {
      path: '/',
      name: 'login',
      component: () => import('@views/login.vue'),
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('@views/home.vue'),
    },
    {
      path: '/chat',
      name: 'chat',
      component: () => import('@views/chat.vue'),
    },
  ],
})

export default router
