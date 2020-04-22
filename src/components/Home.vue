// 这是主页面Home组件

<template>
  <!-- 界面容器 -->
  <el-container class="home_container">
    <!-- 界面头部 -->
    <el-header>
      <span class="home_logo">
        <img src="../assets/welcome to.png" alt="">
        <img src="../assets/home_logo.jpg" class="logo" alt="">
        <span>冠特电商管理系统</span>
      </span>
      <el-button type="info" @click="logout">注销</el-button>
    </el-header>
    <!-- 界面主体 -->
    <el-container>
      <!-- 界面左侧边栏 -->
      <el-aside :width='iscollapse ? "64px" : "250px"'>
        <!-- 实现折叠与收缩功能 -->
        <div class="toggle-button" @click="change">|||</div>
        <!-- 依次设置背景颜色，是否只展示一个菜单，文字颜色，点击颜色 -->
        <el-menu :collapse='iscollapse' :router='true' unique-opened collapse-transition background-color='#304156' text-color='#fff' active-text-color='#1b54f2'>
          <!-- 设置router后，以index作为跳转的路由 -->
          <el-submenu :index = "item.id + ''" v-for = 'item in list' :key = "item.id">
            <template slot="title">
               <i :class="isconObj[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <el-menu-item :index="'/' + subItem.path" v-for = 'subItem in item.children' :key='subItem.id' >
             <i class="el-icon-tickets"></i>
             <span slot="title">{{ subItem.authName }}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 界面内容区 -->
      <el-main><router-view /></el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      list: [],
      isconObj: {
        125: "el-icon-user-solid",
        103: "el-icon-s-order",
        101: "el-icon-s-goods",
        102: "el-icon-postcard",
        145: "el-icon-document-copy"
      },
      iscollapse: false
    }
  },
  created () {
    // 每个组件的this指向当前vue组件实例，即同时main.js中创建的Vue实例
    // 在生命周期created时，实例调用getlist函数，获取数据
    this.getlist()
  },
  methods: {
    logout () {
      // 退出功能实现
      // 1. 清除sessionStorage中的token
      window.sessionStorage.clear()
      // 2. 程序式路由转到login
      this.$router.push('/login')
    },
    // 获取菜单的数据方法(使用await可以简化promise对象)
    async getlist () {
      const { data: res } = await this.$http.get('menus')
      // console.log(res)
      if (res.meta.status !== 200) return this.$message.info(res.meta.msg)
      // 赋值给list数组
      // console.log(res.data)
      this.list = res.data
    },
    change () {
      this.iscollapse = !this.iscollapse
    }
  }
}
</script>

<style lang='less' scoped>

.home_container {
  height: 100%;
}
// elementUI中，标签名默认为为类名
.el-header {
  background-color: #304156;
  display: flex;
  justify-content: space-between;
  align-items: center;
  // 样式嵌套
  .home_logo {
    color: #fff;
    font-size: 30px;
    display: flex;
    align-items: center;
    // margin-left: 202.5px;
    .logo {
      border-radius: 50%;
      margin-left: 20px;
    }
    span {
      margin-left: 20px
    }
  }
}

.el-aside {
  background-color: #304156;
}

.el-main {
  background-color: #FFFFFF;
}

.el-menu {
  border: 0ch;
}

.toggle-button {
  background-color: #304156;
  font-size: 20px;
  color: #fff;
  text-align: center;
  line-height: 20px;
  cursor: pointer;
}
</style>
