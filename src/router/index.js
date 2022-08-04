import Vue from 'vue'
import VueRouter from 'vue-router'
import sellerPage from '@/views/sellerPage'

Vue.use(VueRouter)

const routes = [
  {
    path: '/sellerpage',
    component: sellerPage
  }
]

const router = new VueRouter({
  routes,
  mode: 'history'
})

export default router
