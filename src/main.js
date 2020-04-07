/*
入口文件main.js
*/

// 导入Vue构造函数
import Vue from "vue";
// 导入组件app
import App from "./App.vue";
// 导入路由配置规则
import router from "./router";

// 导入所需要的ElementUI插件
import "./plugins/element.js";
// 导入全局样式
import "./assets/css/global.css";

// 导入table-tree插件
import TableTree from "vue-table-with-tree-grid";

// 导入axios
import axios from "axios";
// 导入基准地址
axios.defaults.baseURL = "http://127.0.0.1:8888/api/private/v1/";

// axios请求拦截器（在向服务器发送请求之前调用，判断是否有权限）
axios.interceptors.request.use(config => {
  // 为请求头对象，添加config请求头对象Authorization的值（值为sessionStorsge中的token的值，登录时token无值，请求其他数据时有值）
  config.headers.Authorization = window.sessionStorage.getItem("token");
  // console.log(config)
  // 最后（格式）return config
  return config;
});

// 将table-tree注册为全局可用的组件
Vue.component("table-tree", TableTree);
// 在Vue的构造函数上创建$http方法，然后所有的vue实例都可用axios方法
Vue.prototype.$http = axios;

// 全局过滤器
Vue.filter("dateFormat", function(originVal) {
  const dt = new Date(originVal);

  const y = dt.getFullYear();
  const m = (dt.getMonth() + "").padStart(2, "0");
  const d = (dt.getDate() + "").padStart(2, "0");
  const hh = (dt.getHours() + "").padStart(2, "0");
  const mm = (dt.getMinutes() + "").padStart(2, "0");
  const ss = (dt.getSeconds() + "").padStart(2, "0");

  return `${y}-${m}-${d}  ${hh} ${mm} ${ss}`;
});

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
