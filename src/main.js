/*
入口文件main.js
*/

// 导入Vue构造函数
import Vue from 'vue'
// 导入组件app
import App from './App.vue'
// 导入路由配置规则
import router from './router'

// 导入所需要的ElementUI插件
import './plugins/element.js'
// 导入全局样式
import './assets/css/global.css'

// 导入axios
import axios from 'axios'
// 导入基准地址
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 在Vue的构造函数上创建$http方法，然后所有的vue实例都可用axios方法
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
