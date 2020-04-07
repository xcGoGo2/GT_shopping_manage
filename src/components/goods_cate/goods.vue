<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/hello' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区 -->
    <el-card>
      <el-row :gutter="15">
        <el-col :span="8">
          <el-input placeholder="请输入关键词" v-model="queryInfo.query">
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="searchList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddpage">
            添加商品
          </el-button>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <el-table :data="goodsList.goods">
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column label="商品价格" prop="goods_price"></el-table-column>
        <el-table-column label="商品重量" prop="goods_weight"></el-table-column>
        <el-table-column label="创建时间" prop="add_time">
          <!-- 配置过滤器 -->
          <template slot-scope="scope">
            {{ scope.row.add_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200px">
          <slot slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit"></el-button>
            <el-button type="danger" icon="el-icon-delete"></el-button>
          </slot>
        </el-table-column>
      </el-table>
      <!-- 分页栏 -->
      <!-- 属性依次为：改变页码显示条数时间；当前页变动时触发事件；当前页；每页显示条数数组；当前页显示条数；总条数 -->
      <!-- <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="Obtainlist.pagenum"
        :page-sizes="[1, 2, 5, 8, 10]"
        :total="Obtainlist.totalpage"
        layout="total, sizes, prev, pager, next, jumper"
      ></el-pagination> -->
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 查询参数
      queryInfo: {
        query: "",
        pagenum: "1",
        pagesize: "10"
      },
      goodsList: {},
      adddialogVisible: false
    };
  },
  created() {
    this.getGoodsList();
  },
  methods: {
    async getGoodsList() {
      const { data: res } = await this.$http.get("goods", {
        params: this.queryInfo
      });
      if (res.meta.status !== 200) return this.$message.error("请求数据失败");
      this.goodsList = res.data;
      console.log(res.data);
    },
    // 搜索功能事项
    searchList() {
      this.getGoodsList();
    },
    goAddpage() {
      this.$router.push("/goods/add");
    }
  }
};
</script>

<style lang="less" scoped></style>
