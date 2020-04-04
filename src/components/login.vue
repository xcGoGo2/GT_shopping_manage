<template>
  <!-- 登录界面 -->
  <div class="login_container">
    <!-- 登录框 -->
    <div class="login_box">
      <!-- 登录log -->
      <div class="log_box">
        <img src="../assets/log.png" alt />
      </div>
      <!-- 登录表单区域 -->
      <el-form ref="loginFormRef" label-width="0px" class="login_form" :model='form' :rules='FormRules'>  <!-- 登录表单验证:rules='FormRules'  -->
        <!-- 用户名 -->
        <el-form-item prop='username'>
          <el-input placeholder="请输入账号" v-model='form.username'>
            <!-- icon图标 -->
             <i slot="prefix" class="el-input__icon el-icon-user-solid"></i>
          </el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop='password'>
          <el-input placeholder="请输入账号" v-model='form.password' type='password'>
            <!-- icon图标 -->
             <i slot="prefix" class="el-input__icon el-icon-lock"></i>
          </el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="btns">
          <el-button type="primary" @click='login'>登录</el-button>
          <el-button type="info" @click='reset'>重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 从表单中双向绑定的数据，都作为对象的属性存储在form对象中
      form: {
        username: 'admin',
        password: '123456'
      },
      // 表单验证对象
      FormRules: {
        // 用户名验证规则
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        // 密码验证规则
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
        ]

      }
    }
  },
  methods: {
    reset () {
      // this指向当前组件的实例对象
      // console.log(this.$refs)
      // 直接获取loginFormRef对象时，dom元素还未加载，报错
      // this.$refs.loginFormRef.resetFields()
      // nextTick()，是将回调函数延迟在下一次dom更新数据后调用，即：当数据更新了，在dom中渲染后，自动执行该函数
      this.$refs.loginFormRef.resetFields()
    },
    login () {
      this.$nextTick(() => {
        this.$refs.loginFormRef.validate(async valid => {
          // console.log(valid)
          if (!valid) return
          // axios 请求部分
          // 1.0 获取返回的参数（await必须在async中使用）
          const { data: res } = await this.$http.post('login', this.form)
          // console.log(res)
          // 判断返回的参数，并作出相应的反应
          if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
          this.$message.success(res.meta.msg)
          // 将服务器传入的token值存入浏览器的sessionStorage
          window.sessionStorage.setItem('token', res.data.token)
          // 修改路由路径
          this.$router.push('/Home')
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login_box {
  height: 300px;
  width: 450px;
  background-color: #fff;
  border-radius: 5px;
  position: absolute;
}

.log_box {
  height: 130px;
  width: 130px;
  border: 1px solid #eee;
  border-radius: 50%;
  padding: 10px;
  box-shadow: 0 0 10px #ddd;
  //移动log
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  img {
    height: 100%;
    widows: 100%;
    border: 1px solid #eee;
    border-radius: 50%;
    background-color: #eee;
  }
}

.login_form {
  // margin-bottom: 0px;
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  // 让盒子居于登录框中
  box-sizing: border-box;
}

.btns {
  display: flex;
  justify-content: flex-end;
  padding-bottom: 10px;
}
</style>
