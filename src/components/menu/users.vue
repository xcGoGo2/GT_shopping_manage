<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/hello' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 视图区，卡片 -->
    <el-card>
      <!-- 主体布局区域 -->
      <el-row :gutter="20">
        <el-col :span="10">
          <div class="grid-content bg-purple">
            <!-- 搜索框 -->
            <el-input placeholder="请输入内容">
              <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>
          </div>
        </el-col>
        <el-col :span="14">
          <!-- 按钮 -->
          <div>
            <el-button type="success">搜索</el-button>
          </div>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 创建存储发送参数的对象
      Querrylist: {
        query: '',
        pagenum: "1",
        pagesize: "2"
      },
      Obtainlist: {
        totalpage: "",
        pagenum: "",
        users: []
      }
    }
  },
  created() {
    this.getlist()
  },
  methods: {
    // ?使用es6的箭头函数时，获取不到数据?
    getlist: async function () {
      // 使用await简化获取的promise对象
      const { data: res } = await this.$http.get("users", { params: this.Querrylist })
      console.log(res)
      // 错误返回
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.totalpage = res.data.total;
      this.pagenum = res.data.pagenum;
      this.users = res.data.users;
    }
  }
}
</script>

<style lang="less" scoped></style>
