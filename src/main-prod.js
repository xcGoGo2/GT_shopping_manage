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

// 导入引用字体文件
import "./assets/fonts/common/fontcss";

// 导入table-tree插件
import TableTree from "vue-table-with-tree-grid";

// 导入富文本编辑器
import VueQuillEditor from "vue-quill-editor";
// require styles 导入富文本编辑器对应的样式

// 导入 NProgress 包对应的JS和CSS
import NProgress from "nprogress";

import axios from "axios";
// 配置请求的跟路径
axios.defaults.baseURL = "http://39.107.243.118:8888/api/private/v1/";
// 在 request 拦截器中，展示进度条 NProgress.start()
axios.interceptors.request.use(config => {
  // console.log(config)
  NProgress.start();
  config.headers.Authorization = window.sessionStorage.getItem("token");
  // 在最后必须 return config
  return config;
});
// 在 response 拦截器中，隐藏进度条 NProgress.done()
axios.interceptors.response.use(config => {
  NProgress.done();
  return config;
});

// 将table-tree注册为全局可用的组件
Vue.component("table-tree", TableTree);

// 在Vue的构造函数上创建$http方法，然后所有的vue实例都可用axios方法
Vue.prototype.$http = axios;

Vue.use(VueQuillEditor);
// 将富文本编辑器，注册为全局可用的组件
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
