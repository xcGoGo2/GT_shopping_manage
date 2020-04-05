<template>
  <div>
      <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/hello' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card class="box-card">
      <el-table :data='RightsList' border stripe>
        <el-table-column type='index' ></el-table-column>
        <el-table-column label='权限名称' prop='authName'></el-table-column>
        <el-table-column label='路径' prop='path'></el-table-column>
        <el-table-column label='权限等级' prop='level'>
          <slot slot-scope="scope">
            <el-tag type='success' v-if='scope.row.level == 0'>一级</el-tag>
            <el-tag type='warning' v-else-if='scope.row.level == 1'>二级</el-tag>
            <el-tag type='info' v-else>三级</el-tag>
          </slot>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
  	return {
  		// 存储列表数据
  		RightsList: []
  	}
  },
  // 钩子函数
  created() {
  	this.getRightsList()
  },
  methods: {
  	// 获取列表请求
  	async getRightsList() {
  		const { data: res } = await this.$http.get('rights/list')
  		if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
  		this.RightsList = res.data
  		console.log(this.RightsList)
  	}
  }
}
</script>

<style lang='less' scoped>
</style>
