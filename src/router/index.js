import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

const router = createRouter({
  history:createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/:query?',
      name: 'home',
      component: Home,
      props: (route) => ({ query: route.params.query || '' })
    },
  ],
  scrollBehavior(to) {
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth',
      };
    }
    return { x: 0, y: 0 };
  }
})

export default router
