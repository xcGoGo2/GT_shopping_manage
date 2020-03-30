import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../components/login.vue'
// 导入Home组件
import Home from '../components/Home.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: login },
  { path: '/Home', component: Home }
]

const router = new VueRouter({
  routes
})

export default router
