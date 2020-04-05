<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/hello' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card class="box-card">
      <!-- 添加角色按钮 -->
      <el-row>
        <el-col>
          <el-button type="success" @click="AddVisible = true">添加角色</el-button>
        </el-col>
      </el-row>

      <!-- 角色列表区 -->
      <el-table :data="RolesList" border stripe>
        <el-table-column type="expand">
          <slot slot-scope="scope">
            <el-row v-for="item0 in scope.row.children" :key="item0.id">
              <el-col :span="6" class="col1">
                <el-tag type="danger">{{item0.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="18" class="col2">
                <el-row v-for="(item1) in item0.children" :key="item1.id">
                  <el-col :span="7">
                    <el-tag type="success">{{item1.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="17">
                    <el-tag
                      v-for="item2 in item1.children"
                      :key="item2.id"
                      type="warning"
                    >{{item2.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </slot>
        </el-table-column>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <slot slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="EditForm(scope.row.id)"
            >编辑</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="DeleteEditForm(scope.row.id)"
            >删除</el-button>
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="SelectPower(scope.row)"
            >分配权限</el-button>
          </slot>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 对话框——添加用户 -->
    <el-dialog title="添加用户" :visible.sync="AddVisible" width="50%"  @close="resetForm('AddFormRef')">
      <el-form :model="AddFrom" ref="AddFormRef" label-width="100px" :rules="FormRules">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="AddFrom.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="AddFrom.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="AddVisible = false">取 消</el-button>
        <el-button type="primary" @click="AddRoles">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 对话框，编辑用户信息 -->
    <el-dialog title="编辑" :visible.sync="EditVisible" width="50%">
      <el-form :model="EditFormData" ref="EditFormRef" label-width="100px" :rules="FormRules">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="EditFormData.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="EditFormData.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="EditVisible = false">取 消</el-button>
        <el-button type="primary" @click="EditRoles">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配权限对话框 -->
    <el-dialog title="分配权限" :visible.sync="PowerVisible" width="50%" @close='closedPower' >
      <el-tree
        ref="PowerRef"
        :data="RightsData"
        :props="RightsDataMenu"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defKey"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="PowerVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 角色数据列表
      RolesList: [],
      AddVisible: false,
      // 添加用户数据
      AddFrom: {
        roleName: "",
        roleDesc: ""
      },
      FormRules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
          { min: 2, max: 15, message: "长度在 2 到 15 个字符", trigger: "blur" }
        ]
      },
      EditVisible: false,
      EditFormData: {
        roleName: "",
        roleDesc: ""
      },
      // 分配权限初始化
      PowerVisible: false,
      // 树结构数据集合
      RightsData: [],
      // 树结构数据属性
      RightsDataMenu: {
        children: "children",
        label: "authName"
      },
      // tree中默认选择的数组
      defKey: [],
      roleid: ''
    }
  },
  // 钩子函数（在刷新界面之前执行）
  created() {
    this.getRolesList();
  },
  methods: {
    // 获取用户数据列表
    async getRolesList() {
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status !== 200) return this.$message.error("res.meta.msg");
      this.RolesList = res.data;
    },
    // 添加用户操作
    AddRoles() {
      this.$refs.AddFormRef.validate(async valid => {
        if (!valid) return;
        // 发送请求添加管理员
        const { data: res } = await this.$http.post("roles", this.AddFrom);
        // console.log(res)
        // 验证请求是否成功
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg);
        this.$message.success(res.meta.msg);
        this.getRolesList();
        this.AddVisible = false;
      });
    },

    // 编辑用户操作
    async EditForm(id) {
      const { data: res } = await this.$http.get("roles/" + id);
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.EditFormData = res.data;
      // console.log(this.EditFormData);
      this.EditVisible = true;
    },
    // 提交用户编辑操作
    EditRoles() {
      this.$refs.EditFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.put(
          "roles/" + this.EditFormData.roleId,
          {
            roleName: this.EditFormData.roleName,
            roleDesc: this.EditFormData.roleDesc
          }
        );
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
        this.$message.success("编辑成功");
        this.getRolesList();
        this.EditVisible = false;
      });
    },
    // 删除角色操作
    DeleteEditForm(id) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const { data: res } = await this.$http.delete("roles/" + id);
          console.log(res);
          if (res.meta.status !== 200) return this.$message.error("删除失败");
          this.$message.success(res.meta.msg);
          this.getRolesList();
        })
        .catch(() => {
          this.$message.info("取消删除");
        });
    },
    async SelectPower(role) {
      this.roleid = role.id
      const { data: res } = await this.$http.get("rights/tree");
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.RightsData = res.data;
      // 获取三级节点的数组
      this.getLeafIds(role, this.defKey);
      // console.log(this.defKey)
      this.PowerVisible = true;
    },
    // 关闭对话框，清除数据功能
    resetForm(AddFormRef) {
      this.$refs[AddFormRef].resetFields()
      this.AddFrom.roleDesc = ''
    },
    // 通过递归的形式，获取角色的所有三级子节点，并保存在defKey数组中
    getLeafIds(node, arr) {
      // 若当前不含子节点
      if (!node.children) {
        return arr.push(node.id);
      }

      node.children.forEach(item => {
        this.getLeafIds(item, arr)
      })
    },
    closedPower() {
      this.defKey = []
    },
    async allotRights() {
      const keys = [
        ...this.$refs.PowerRef.getCheckedKeys(),
        ...this.$refs.PowerRef.getHalfCheckedKeys()
      ]
      const idStr = keys.join(',')
      const { data: res } = await this.$http.post('roles/' + this.roleid + '/rights', { rids: idStr })
      if (res.meta.status !== 200) return this.$message.error('请求失败')
      this.getRolesList()
      this.PowerVisible = false
    }
  }
}
</script>

<style lang='less' scoped>
.el-tag {
  margin: 10px;
}
.el-table {
  margin-top: 15px;
}
</style>
