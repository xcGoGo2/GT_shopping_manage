import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../components/login.vue'
// 导入Home组件
import Home from '../components/Home.vue'
// 导入users组件
import users from '../components/Users/users.vue'
// 导入roles组件
import roles from '../components/Rigths/roles.vue'
// 导入rights组件
import rights from '../components/Rigths/rights.vue'
import orders from '../components/menu/orders.vue'
import params from '../components/menu/params.vue'
import goods from '../components/menu/goods.vue'
import reports from '../components/menu/reports.vue'
import categories from '../components/menu/categories.vue'
import hello from '../components/hello.vue'
Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/Home', redirect: '/hello' },
  { path: '/login', component: login },
  { path: '/Home', component: Home, children: [
    { path: '/users', component: users },
    { path: '/roles', component: roles },
    { path: '/rights', component: rights },
    { path: '/categories', component: categories },
    { path: '/reports', component: reports },
    { path: '/params', component: params },
    { path: '/orders', component: orders },
    { path: '/goods', component: goods },
    { path: '/hello', component: hello }
  ]
  }
]

const router = new VueRouter({
  routes
})

// 路由导航守卫（防止直接通过路径访问）
// to 将要访问的路径
// from 代表从哪个路径跳转而来
// next 是一个函数，表示放行
// next（）放行 next('/login) 强制跳转
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
