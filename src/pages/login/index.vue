<template>
  <!-- 登录组件 -->
  <div class="login">
    <!-- 滑块验证模块 -->
    <div
      class="slideShadow"
      v-show="showSlide"
    >
      <transition>
        <div class="slideSty animated bounce">
          <slide-verify
            @success="onSuccess"
            @fail="onFail"
            :sliderText="text"
            :w="350"
            :h="175"
            ref="slideDiv"
          ></slide-verify>
          <div class="iconBtn">
            <i
              class="el-icon-circle-close"
              @click="showSlide = false"
            ></i><i
              class="el-icon-refresh"
              @click="refresh"
            ></i>
          </div>
        </div>
      </transition>
    </div>
    <!-- 登录盒子区域 -->
    <div class="loginBox">
      <!-- 登录标题 -->
      <h2 class="loginH2"><strong>武汉冠特管理系统</strong></h2>
      <div class="loginContainer">
        <!-- 提示区域 -->
        <div class="titleDiv">
          <h3>请登录！</h3>
          <p>请输入您的账号和密码</p>
          <i class="el-icon-key"></i>
        </div>
        <!-- 登录表单 -->
        <el-form
          ref="loginForm"
          :rules="rules"
          :model="ruleForm"
        >
          <el-form-item prop="username">
            <el-input
              placeholder="请输入账号"
              prefix-icon="el-icon-user"
              v-model="ruleForm.username"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              placeholder="请输入密码"
              prefix-icon="el-icon-lock"
              v-model="ruleForm.password"
              show-password
            ></el-input>
          </el-form-item>
          <!-- 登录按钮 -->
          <div class="btns">
            <el-button
              type="info"
              class="resetBtn"
              @click="loginReset('loginForm')"
            >重置</el-button>
            <el-button
              type="primary"
              class="loginBtn"
              @click="loginYz('loginForm')"
            >登录</el-button>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import SlideVerify from "@/components/SlideVerify";
export default {
  data() {
    return {
      notifyObj: null,
      text: "向右滑动",
      showSlide: false,
      ruleForm: {
        username: "admin",
        password: "123456"
      },
      rules: {
        user: [
          {
            required: true,
            message: "请输入用户名",
            trigger: "blur"
          },
          {
            min: 3,
            max: 15,
            message: "长度在3到5个字符",
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur"
          }
        ]
      }
    };
  },
  mounted() {
    this.shopTip();
  },
  methods: {
    onSuccess() {
      this.showSlide = false;
      this._login();
    },
    onFail() {
      this.$message.error("验证失败");
    },
    refresh() {
      this.$refs.slideDiv.reset();
    },
    loginYz(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          this.showSlide = true;
        } else {
          return;
        }
      });
    },
    loginReset(form) {
      this.$refs[form].resetFields();
    },
    // _login() {
    // 	this.$store
    // 		.dispatch('user/_login', this.ruleForm)
    // 		.then((res) => {
    // 			if (!res.data.success) {
    // 				this.refresh()
    // 			} else {
    // 				this.$router.push(this.$route.query.redirect)
    // 				if (this.notifyObj) {
    // 					this.notifyObj.close()
    // 				}
    // 				this.notifyObj = null
    // 			}
    // 		})
    // 		.catch((error) => {
    // 			this.refresh()
    // 			this.$message.error(error)
    // 		})
    // },
    async _login() {
      // axios 请求部分
      // 1.0 获取返回的参数（await必须在async中使用）
      const { data: res } = await this.$http.post("login", this.ruleForm);
      // console.log(res)
      // 判断返回的参数，并作出相应的反应
      if (res.meta.status !== 200) {
        this.refresh()
        return this.$message.error(res.meta.msg)
      } else {
        this.$message.success(res.meta.msg);
        // 将服务器传入的token值存入浏览器的sessionStorage
        window.sessionStorage.setItem("token", res.data.token);
        // 修改路由路径
        this.$router.push("/Home");
        console.log(this.notifyObj)
        if (this.notifyObj) {
          this.notifyObj.close()
        }
        this.notifyObj = null
      }
    },
    // 提示框（通过createelement创建，notifyObj为一个对象）
    shopTip() {
      this.notifyObj = this.$notify({
        title: "提示",
        message:
          "目前登录角色分为两种，管理员和普通用户，管理员账号：admin,密码：123456;普通用户账号可登录管理员账号设置。本项目为练习项目，完全开源，欢迎使用star",
        duration: 0,
        iconClass: "el-icon-s-opportunity"
      });
    }
  },
  components: {
    SlideVerify
  }
};
</script>
<style scoped lang="less">
.login {
  height: 100%;
  width: 100%;
  // 背景图片
  background: url("../../assets/img/pageBg/loginBg3.jpg") no-repeat center center;
  background-size: 100% 100%;
  overflow: hidden;
}

.loginBox {
  height: 455px;
  width: 550px;
  margin: 0 auto;
  position: relative;
  top: 50%;
  margin-top: -287px;
}

.loginH2 {
  font-size: 38px;
  color: #fff;
  text-align: center;
}

.loginContainer {
  margin-top: 30px;
  background: #eee;
  border-radius: 4px;

  .titleDiv {
    padding: 0 28px;
    background: #fff;
    position: relative;
    height: 120px;
    border-radius: 4px 4px 0 0;

    h3 {
      font-size: 22px;
      color: #555;
      font-weight: initial;
      padding-top: 23px;
    }

    p {
      font-size: 16px;
      color: #888;
      padding-top: 12px;
    }

    i {
      font-size: 65px;
      color: #ddd;
      position: absolute;
      right: 27px;
      top: 29px;
    }
  }

  .el-form {
    padding: 25px 25px 30px 25px;
    background: #eee;
    border-radius: 0 0 4px 4px;
  }
}

.btns {
  display: flex;
  justify-content: space-around;
}

.loginBtn {
  width: 20%;
  background: #19b9e7;
}

.resetBtn {
  width: 20%;
  background: #909399;
}

.slideShadow {
  position: fixed;
  z-index: 999;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
}

.slideSty {
  position: absolute;
  width: 380px;
  height: 311px;
  background: #e8e8e8;
  border: 1px solid #dcdcdc;
  left: 50%;
  top: 50%;
  margin-left: -188px;
  margin-top: -176px;
  z-index: 99;
  border-radius: 5px;
}

.iconBtn {
  padding: 9px 0 0 19px;
  color: #5f5f5f;
  border-top: 1px solid #d8d8d8;
  margin-top: 17px;

  i {
    font-size: 22px;
    cursor: pointer;
  }

  i:last-child {
    margin-left: 7px;
  }
}
</style>
<style>
.slideSty .slide-verify {
  margin: 13px auto 0 auto;
  width: 350px !important;
}

.slideSty .slide-verify-slider {
  width: 100% !important;
}

.slideSty .slide-verify-refresh-icon {
  display: none;
}
</style>
