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

      <!-- 主体布局区域 1.0搜索框 -->
      <el-row :gutter="20">
        <el-col :span="10">
          <div class="grid-content bg-purple">
            <!-- 搜索框 -->
            <el-input placeholder="请输入用户名" v-model="Querrylist.query">
              <el-button
                slot="append"
                icon="el-icon-search"
                @click="getlist"
              ></el-button>
            </el-input>
          </div>
        </el-col>
        <el-col :span="14">
          <!-- 按钮 -->
          <div>
            <el-button type="success" @click="addusers">添加用户</el-button>
          </div>
        </el-col>
      </el-row>

      <!-- 主体布局区域 2.0列表 -->
      <el-table :data="Obtainlist.userslist" border stripe>
        <!--设置加上边框，隔行变色-->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <!-- 作用域插槽1  状态 -->
          <template slot-scope="scope">
            <!-- {{scope.row}} -->
            <el-switch
              active-color="#13ce66"
              v-model="scope.row.mg_state"
              @click="changed(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <!-- 作用域插槽2 -->
          <template slot-scope='scope'>
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click='EditChange(scope.row.id)'
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click='DeleteUsers(scope.row.id)'
            ></el-button>
            <!-- button提示信息 -->
            <el-tooltip effect="dark" content="设置权限" placement="top">
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click='PowerChange(scope.row)'
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 主体布局区域 2.0分页操作 -->
      <!-- 属性依次为：改变页码显示条数时间；当前页变动时触发事件；当前页；每页显示条数数组；当前页显示条数；总条数 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="Obtainlist.pagenum"
        :page-sizes="[1, 2, 5, 8, 10]"
        :total="Obtainlist.totalpage"
        layout="total, sizes, prev, pager, next, jumper"
      ></el-pagination>
    </el-card>

    <!-- 添加用户对话框 -->
    <el-dialog title="添加用户" :visible.sync="dialogVisible" width="50%" @close='remove'>
      <!-- 这是添加用户对话框主体区 -->
      <el-form :model="addFormData" :rules="FormRules" label-width="100px" ref='addFormRef'>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addFormData.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addFormData.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addFormData.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addFormData.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 对话框脚 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addFormTest">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户对话框 -->
    <el-dialog title="修改用户消息" :visible.sync="EditVisible" width="50%" ref='editRef'>
      <!-- 这是修改用户对话框主体区 -->
      <el-form :model="editFormData" :rules="FormRules" label-width="100px" ref='editFormRef'>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editFormData.username"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editFormData.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editFormData.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 对话框脚 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="EditVisible = false">取 消</el-button>
        <el-button type="primary" @click="EditFormGo">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 删除用户警告 -->
   <!--  <el-dialog title="警告" :visible.sync="DeleteUser" width="50%"> -->
      <!-- 删除用户对话框 -->
     <!--  <div>
        <h1>确定删除用户？</h1>
      </div> -->
      <!-- 对话框脚 -->
      <!-- <span slot="footer" class="dialog-footer">
        <el-button @click="DeleteUser = false">取 消</el-button>
        <el-button type="primary" @click="deleteForm">删除</el-button>
      </span>
    </el-dialog> -->
    <!-- 权限设置对话框 -->
   <!--  <el-dialog title="权限设置" :visible.sync="PowerVisible" width="50%" ref='PowerRef'>
      <el-form :model="PowerFormData" label-width="100px" ref='editFormRef'>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editFormData.username"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="PowerVisible = false">取 消</el-button>
        <el-button type="primary" @click="PowerFormGo">确 定</el-button>
      </span>
    </el-dialog> -->
  </div>
</template>

<script>
export default {
  data() {
    // 自定义手机号验证规则
    var checkMobile = (rule, value, callback) => {
      const regmobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regmobile.test(value)) {
        callback()
      } else {
        callback(new Error('请输入正确的手机号'))
      }
    }

    // 自定义邮箱验证规则
    var checkEmail = (rule, value, callback) => {
      const regeamil = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
      if (regeamil.test(value)) {
        callback()
      } else {
        callback(new Error('请输入正确的邮箱'))
      }
    }

    return {

      // 创建存储发送参数的对象
      Querrylist: {
        // 查询参数
        query: "",
        // 当前页码
        pagenum: "1",
        // 每页显示条数
        pagesize: "3"
      },

      // 创建接收参数的对象
      Obtainlist: {
        // 总条数
        totalpage: 0,
        // 当前页码
        pagenum: 1,
        // 用户数据集合
        userslist: []
      },

      // 添加用户初始化
      dialogVisible: false,

      // 修改用户初始化
      EditVisible: false,

      // 删除用户初始化
      DeleteUser: false,

      // 修改权限初始化
      PowerVisible: false,

      // 修改用户信息对象存储
      editFormData: {},

      // 表单验证数据存储
      addFormData: {
        username: '',
        password: '',
        email: '',
        mobil: ''
      },

      // 表单验证规则
      FormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      }
    }
  },

  // 钩子函数：未渲染界面时刷新数据
  created() {
    this.getlist()
  },

  methods: {
    // ?使用es6的箭头函数时，获取不到数据?this指向会改变
    getlist: async function() {
      // 使用await简化获取的promise对象
      const { data: res } = await this.$http.get("users", {
        params: this.Querrylist
      })
      // 错误返回
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.Obtainlist.totalpage = res.data.total
      this.Obtainlist.pagenum = res.data.pagenum
      this.Obtainlist.userslist = res.data.users
    },

    // 页面条数变动事件，返回值为newSize
    handleSizeChange(newSize) {
      // console.log(newSize)
      this.Querrylist.pagesize = newSize
      // 改变参数后，再次请求
      this.getlist()
    },

    // 当前页码变动事件，返回值为newPage
    handleCurrentChange(newPage) {
      // console.log(newPage)
      this.Querrylist.pagenum = newPage
      this.getlist()
    },

    // 改变状态
    // changed(value) {
    //   console.log(1)
    // },

    // 添加用户操作1.0——打开对话框
    addusers() {
      this.dialogVisible = true
    },

    // 添加用户操作2.0——添加数据，刷新界面
    addFormTest () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        // 发送请求添加用户
        const { data: res } = await this.$http.post('users', this.addFormData)
        // 验证请求是否成功
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        // 退出对话框
        this.dialogVisible = false
        this.getlist()
      })
    },

    // 修改用户操作1.0——打开对话框，填充数据
    EditChange: async function(id) {
      this.EditVisible = true
      // 根据用户id发送查询请求
      const { data: res } = await this.$http.get("users/" + id)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      // 赋值给用户信息存储对象
      this.editFormData = res.data
      console.log(this.editFormData)
    },

    // 修改用户操作2.0——修改数据，刷新界面，关闭对话框
    EditFormGo () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        // 发送请求修改用户
        const { data: res } = await this.$http.put('users/' + this.editFormData.id, { email: this.editFormData.email, mobile: this.editFormData.mobile })
        // 当请求失败
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        // 当请求成功
        this.getlist()
        this.$message.success(res.meta.msg)
        this.EditVisible = false
      })
    },

    // 退出对话框（重置功能）
    remove() {
      this.$refs.addFormRef.resetFields()
    },

    // 删除操作
    DeleteUsers(id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$http.delete('users/' + id)
        if (res.meta.status !== 200) return this.$message.success(res.meta.msg)
        this.$message.error(res.meta.msg)
        this.getlist()
      })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  }
}
</script>

<style lang="less" scoped>
.el-table {
  margin-top: 15px
}
</style>
