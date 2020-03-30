import Vue from 'vue'
import { Button, Input, Form, FormItem, Message } from 'element-ui'
// 导入消息提示框
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
// 在Vue的构造函数上加入一个$massage方法
Vue.prototype.$message = Message
