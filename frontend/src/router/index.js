import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/category/:id',
    name: 'Category',
    component: () => import('../views/Category.vue')
  },
  {
    path: '/tool/:id',
    name: 'Tool',
    component: () => import('../views/Tool.vue')
  },
  {
    path: '/favorites',
    name: 'Favorites',
    component: () => import('../views/Favorites.vue')
  },
  {
    path: '/history',
    name: 'History',
    component: () => import('../views/History.vue')
  },
  {
    path: '/feedback',
    name: 'Feedback',
    component: () => import('../views/Feedback.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
