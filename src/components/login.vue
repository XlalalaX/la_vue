<template>
  <div class="login-page">
    <el-card shadow="hover" class="card-wrapper">
      <div v-show="isLogin">
        <h2>登陆</h2>
        <el-form ref="loginForm" :model="loginForm" :rules="loginRules" :scroll-to-error="true">
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="loginForm.email"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input type="password" v-model="loginForm.password"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :loading="loading" @click="handleLogin">登陆</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div v-show="!isLogin">
        <h2>注册</h2>
        <!-- Add register form here -->
        <el-form ref="registerForm"
                 :model="registerForm" :rules="registerRules" :scroll-to-error="true" label-position='left'
                 label-width='300'>
          <el-form-item label="昵称" prop="name" class="form-item-align">
            <el-input v-model="registerForm.name"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email" class="form-item-align">
            <el-input v-model="registerForm.email"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password" class="form-item-align">
            <el-input type="password" v-model="registerForm.password"></el-input>
          </el-form-item>
          <el-form-item label="重复密码" prop="repeatPassword" class="form-item-align">
            <el-input type="password" v-model="registerForm.repeatPassword"></el-input>
          </el-form-item>
          <!-- 验证码 -->
          <el-form-item label="验证码" prop="verifyCode" class="form-item-align">
            <el-row style="">
              <el-col justify="center">
                <el-input type="verify_code" v-model="registerForm.verify_code"></el-input>
              </el-col>
              <el-col justify="end">
                <el-button type="verify_code" @click="handleSendCode" :disabled="sendCodeButtonDisabled"
                           style="right: 100%">{{ sendCodeButtonText }}
                </el-button>
              </el-col>
            </el-row>
          </el-form-item>
          <!-- Other registration form elements here -->
          <el-form-item>
            <el-button type="primary" :loading="loading" @click="handleRegister">注册</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <div class="toggle-form-section">
      <span>{{ isLogin ? '没账号？' : '已有账号' }}</span>
      <el-button type="primary" @click="toggleForm">{{ isLogin ? '注册' : '登陆' }}</el-button>
    </div>
  </div>
</template>


<script>
import axios from 'axios';
import {ElMessage} from 'element-plus'
import {rootAddr, router} from "../router/index.js";
import {state} from "../store/state.js";

export default {
  name: 'login',
  data() {
    return {
      isLogin: true,
      loading: false,
      loginForm: {
        email: '',
        password: ''
      },
      loginRules: {
        email: [
          {required: true, message: '请输入邮箱', trigger: 'blur'},
          {type: 'email', message: '邮箱格式错误', trigger: ['blur', 'change']}
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'}
        ]
      },
      registerForm: {
        name: '',
        email: '',
        password: '',
        repeatPassword: '',
        verify_code: ''
      },
      registerRules: {
        name: [
          {required: true, message: '请输入昵称', trigger: 'blur'}
        ],
        email: [
          {required: true, message: '请输入邮箱', trigger: 'blur'},
          {type: 'email', message: '邮箱格式错误', trigger: ['blur', 'change']}
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          {min: 6, max: 20, message: '请输入6-20位的密码', trigger: 'blur'}
        ],
        repeatPassword: [
          {required: true, message: '请再输入一次密码', trigger: 'blur'},
          {
            validator: async (rule, value) => {
              return value === this.registerForm.password
            }, message: '密码不一致', trigger: 'blur'
          }
        ],
        verify_code: [
          {required: true, message: '请输入验证码', trigger: 'blur'}
        ]
      },
      sendCodeButtonDisabled: false,
      sendCodeButtonText: '发送验证码',
      sendCodeRemainingTime: 0
    }
  },
  methods: {
    handleLogin() {
      this.$refs.loginForm.validate(async valid => {
        if (valid) {
          //加载中
          this.loading = true
          try {
            const response = await axios.post('http://127.0.0.1:3001/user_not/login', {
              email: this.loginForm.email,
              password: this.loginForm.password
            });
            console.log(response)
            if (response.data.code != 0) {
              ElMessage.error(`登陆失败, ${response.data.msg}`);
            } else {
              //赋值给本地存储
              state.user=response.data.data.user
              state.token=response.data.data.token
              await axios.get(`http://${rootAddr}/user_not/user_face_url?uid=${state.user.uid}`)
                .then((response) => {
                  state.user.face_url = response.data.data
                })
              localStorage.setItem("la_token", state.token)
              localStorage.setItem("la_user", JSON.stringify(state.user))
              ElMessage.success(`Welcome, ${response.data.data.user.nick_name}!`);
              await router.push("/chat_main")
            }
          } catch (error) {
            // Handle error message
            ElMessage.error(`登陆出错，,${error}`);
          }
        } else {
          // Validate failed
          ElMessage.warning('Please complete the form.');
        }
        //加载完成
        this.loading = false
      });
    },
    handleSendCode() {
      this.$refs.registerForm.validateField('email', async valid => {
        if (valid) {
          try {
            // 请求验证码
            const response = await axios.post('http://127.0.0.1:3001/verify_code', {
              email: this.registerForm.email
            });
            if (response.data.code != 0) {
              ElMessage.error('发送验证码错误,${response.data.msg}');
              return
            }
            // 设置按钮为不可用并启动定时任务
            this.sendCodeButtonDisabled = true;
            this.sendCodeRemainingTime = 300 * 1000; // 5 minutes
            this.sendCodeButtonText = `${this.sendCodeRemainingTime / 1000}s`;
            const timer = setInterval(() => {
              if (this.sendCodeRemainingTime > 0) {
                this.sendCodeRemainingTime -= 1000;
                this.sendCodeButtonText = `${this.sendCodeRemainingTime / 1000}s`;
              } else {
                clearInterval(timer);
                this.sendCodeButtonDisabled = false;
                this.sendCodeButtonText = '发送验证码';
              }
            }, 1000);
          } catch (error) {
            // Handle error message
            ElMessage.error('Failed to send verification code.');
          }
        }
      });
    },

    handleRegister() {
      this.$refs.registerForm.validate(async valid => {
        if (valid) {
          // Show loading animation
          ElMessage.info('Registering...');
          try {
            // Submit register API request here
            const response = await axios.post('http://127.0.0.1:3001/user_not/register', {
              name: this.registerForm.name,
              email: this.registerForm.email,
              password: this.registerForm.password,
              verify_code: this.registerForm.verify_code
            });
            if (response.data.code != 0) {
              ElMessage.error(`注册失败,${response.data.msg}`);
            } else {
              ElMessage.success("注册成功");
            }
          } catch (err) {
            // Handle error message
            ElMessage.error(`注册出错,${err}`);
          }
        }
      })
    },
    toggleForm() {
      this.isLogin = !this.isLogin;
    }
  }
}
</script>


<style>
.card-wrapper {
  width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f8faff;
}

/*.form-item-align {*/
/*  display:contents;*/
/*  align-items: center;*/
/*}*/

el-input {
  width: 100%;
}


</style>