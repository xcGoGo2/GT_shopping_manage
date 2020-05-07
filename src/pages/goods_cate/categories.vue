<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/hello' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card>
      <!-- button -->
      <el-row>
        <el-col>
          <el-button type="success" @click="showAddCateDialog"
            >添加分类</el-button
          >
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <table-tree
        :data="catelist"
        :columns="columns"
        :show-index="true"
        index-text="#"
        :selection-type="false"
        :expand-type="false"
        class="table-tree"
      >
        <!-- 是否删除 -->
        <template slot="isok" slot-scope="scope">
          <i
            class="el-icon-circle-close"
            v-if="scope.row.cat_deleted == true"
            style="color: green"
          ></i>
          <i class="el-icon-circle-check" v-else style="color: red"></i>
        </template>
        <!-- 排序 -->
        <template slot="sort" slot-scope="scope">
          <el-tag type="success" v-if="scope.row.cat_level == 0">一级</el-tag>
          <el-tag type="danger" v-else-if="scope.row.cat_level == 1"
            >二级</el-tag
          >
          <el-tag type="error" v-else>三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="operation" slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="EditCateDialog(scope.row.cat_id, scope.row.cat_name)"
            >编辑</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deleteCateDialog(scope.row.cat_id)"
            >删除</el-button
          >
        </template>
      </table-tree>

      <!-- 分页操作区域 -->
      <!-- 属性依次为：改变页码显示条数事件；当前页变动时触发事件；当前页；每页显示条数数组；当前页显示条数；总条数 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="querInfo.pagenum"
        :page-sizes="[1, 2, 5, 8, 10]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
      ></el-pagination>
    </el-card>

    <!-- 关于添加分类的弹出对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
    >
      <!-- 分类名 -->
      <el-form
        ref="addCateFormRef"
        :model="addCateForm"
        label-width="100px"
        :rules="addCateFormRules"
      >
        <el-form-item label="分类名" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="分类层级">
          <!-- options用来指定数据源 -->
          <!-- props用来指定配置对象 -->
          <!-- v-model将选择的值保存在数组中 -->
          <el-cascader
            v-model="selectedKeys"
            :options="parentCateList"
            :props="cascaderProps"
            @change="parentCateChanged"
            expand-trigger="hover"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="AddVisible = false">取 消</el-button>
        <el-button type="primary">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑提交分类 -->
    <el-dialog
      title="编辑分类"
      :visible.sync="EditCateDialogVisible"
      width="50%"
    >
      <el-form
        ref="editCateFormRef"
        :model="editCateForm"
        label-width="100px"
        :rules="addCateFormRules"
      >
        <el-form-item label="分类名" prop="cat_name">
          <el-input v-model="editCateForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="EditCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="EditCateDialogGo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 商品分类数据
      catelist: [],
      // 商品分类总数
      total: 0,
      // 商品分类请求数据
      querInfo: {
        type: 3,
        pagesize: 5,
        pagenum: 1
      },
      // 控制添加分类对话框的显示与隐藏
      addCateDialogVisible: false,
      // 添加表单绑定的数据对象
      addCateForm: {
        cat_name: "",
        // 分类父id
        cat_pid: "",
        // 分类层级默认1级
        cat_level: 0
      },
      // 添加分类表单的验证规则对象
      addCateFormRules: {
        cat_name: [{ required: true, message: "请输入分类名", trigger: "blur" }]
      },
      // 父级分类的列表
      parentCateList: [],
      // 指定级联选择器的配置对象
      cascaderProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children"
      },
      selectedKeys: [],
      // 编辑分类初始化
      EditCateDialogVisible: false,
      editCateForm: {
        cat_name: "",
        id: 0
      },

      // 为table指定每列的数据
      columns: [
        // 第一列数据
        { label: "分类名称", prop: "cat_name" },
        // type表示将当前列定义为模板列  template表示模板名称
        { label: "是否删除", type: "template", template: "isok" },
        // type表示将当前列定义为模板列  template表示模板名称
        { label: "排序", type: "template", template: "sort" },
        // type表示将当前列定义为模板列  template表示模板名称
        {
          label: "操作",
          type: "template",
          template: "operation",
          width: "250px"
        }
      ]
    };
  },
  created() {
    this.getcatelist();
  },
  methods: {
    async getcatelist() {
      const { data: res } = await this.$http.get("categories", {
        params: this.querInfo
      });
      if (res.meta.status !== 200) return this.$message.error("请求失败");
      this.catelist = res.data.result;
      this.total = res.data.total;
    },
    // 分页设计功能实现
    handleSizeChange(newsize) {
      this.querInfo.pagesize = newsize;
      this.getcatelist();
    },
    handleCurrentChange(newnum) {
      this.querInfo.pagenum = newnum;
      this.getcatelist();
    },
    showAddCateDialog() {
      // 现货区父级分类数据列表
      this.getParentCateList();
      // 再展示出对话框
      this.addCateDialogVisible = true;
    },
    async getParentCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: { type: 2 }
      });

      if (res.meta.status !== 200) {
        return this.$message.error("获取父级列表失败");
      }
      //   console.log(res.data)
      this.parentCateList = res.data;
    },
    parentCateChanged() {
      //   console.log(this.selectedKeys)
    },
    EditCateDialog(id, name) {
      this.editCateForm.cat_name = name;
      this.editCateForm.id = id;
      //   console.log(id)
      this.EditCateDialogVisible = true;
    },
    async EditCateDialogGo() {
      const { data: res } = await this.$http.put(
        "categories/" + this.editCateForm.id,
        { cat_name: this.editCateForm.cat_name }
      );
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.$message.success(res.meta.msg);
      this.getcatelist();
      this.EditCateDialogVisible = false;
    },
    deleteCateDialog(id) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const { data: res } = await this.$http.delete("categories/" + id);
          //   console.log(res);
          if (res.meta.status !== 200) return this.$message.error("删除失败");
          this.$message.success(res.meta.msg);
          this.getcatelist();
        })
        .catch(() => {
          this.$message.info("取消删除");
        });
    }
  }
};
</script>

<style lang="less" scoped>
.table-tree {
  margin-top: 15px;
}
</style>
