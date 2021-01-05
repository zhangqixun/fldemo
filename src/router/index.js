import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/login'
import Home from '@/views/home'
import Layout from '@/views/layout'
import Test from '@/views/test'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/demo',
    name: 'demo',
    component: Test
  },
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: '',
        name: 'home',
        component: Home
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
