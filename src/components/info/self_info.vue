<template>
  <div>
    <el-image style="width: 100px; height: 100px;"
              :src="info.face_url"
              :zoom-rate="1.2"
              :preview-src-list="[info.face_url]"
              :initial-index="0"
              fit="cover"
    />
    <div style="display: block; flex-wrap: wrap;">
      <el-button @click="uploadFaceFile">更换头像</el-button>
    </div>
    <div v-if="!change" style="width: 100%">
      <el-card>
        <div style="display: flex; flex-wrap: wrap;">
          <el-text><span>uid：{{ info.uid }}</span></el-text>
        </div>
        <div style="display: flex; flex-wrap: wrap;">
          <el-text><span>昵称：{{ info.nick_name }}</span></el-text>
        </div>
        <div style="display: flex; flex-wrap: wrap;">
          <el-text><span>生日：{{ new Date(info.birth * 1000).getFullYear() }}年{{ new Date(info.birth * 1000).getMonth() }}月{{ new Date(info.birth * 1000).getDate() }}日</span></el-text>
        </div>
        <div style="display: flex; flex-wrap: wrap;">
          <el-text><span>性别：{{ info.gender == 0 ? "男" : "女" }}</span></el-text>
        </div>
        <div style="display: flex; flex-wrap: wrap;">
          <el-text><span>邮箱：{{ info.email }}</span></el-text>
        </div>
        <div style="display: flex; flex-wrap: wrap;">
          <el-text><span>手机：{{ info.phone_number }}</span></el-text>
        </div>
      </el-card>
      <el-button @click="changeFunc()">修改</el-button>
    </div>
    <div v-if="change" style="width: 100%;">
      <el-card>
        <div style="display: flex; flex-wrap: wrap;">
          <el-text>uid：{{ info.uid }}</el-text>
        </div>
        <div style="display: flex; flex-wrap: wrap;">
          <el-text>昵称：
            <el-input v-model="info.nick_name" style="width: 70%"></el-input>
          </el-text>
        </div>
        <div style="display: flex; flex-wrap: wrap;">
          <el-text>生日：
            <el-date-picker v-model="defaultTime"/>
          </el-text>
        </div>
        <div style="display: flex; flex-wrap: wrap;">
          <el-text>性别：
            <el-radio-group v-model="info.gender">
              <el-radio :label=0>男</el-radio>
              <el-radio :label=1>女</el-radio>
            </el-radio-group>
          </el-text>
        </div>
        <!-- <div style="display: flex; flex-wrap: wrap;">
          <el-text><span>邮箱：</span><el-input v-model="info.email"></el-input></el-text>
        </div> -->
        <div style="display: flex; flex-wrap: wrap;">
          <el-text>手机：
            <el-input v-model="info.phone_number" style="width: 70%"></el-input>
          </el-text>
        </div>
      </el-card>
      <div style="display: flex">
        <el-button @click="updateSelfInfo()" style="margin-inside: auto">保存</el-button>
        <el-button @click="changeFunc()" style="margin-inside: auto">取消</el-button>
      </div>
    </div>

  </div>
</template>

<script>
import {ref, watchEffect} from "vue";
import {state} from "../../store/state.js";
import axios from "axios";
import {rootAddr} from "../../router/index.js";
import {ElMessage} from "element-plus";
// 全局添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  config.headers['token'] = state.token;
  return config;
}, function (error) {
  // 对请求错误做些什么
  return error;
});
export default {
  name: "self_info",
  data() {
    return {
      state,
      change: false,
      info: state.user,
      defaultTime: new Date(state.user.birth * 1000)
    }
  },
  methods: {
    changeFunc() {
      this.info = state.user
      this.change = !this.change
    },
    updateSelfInfo() {
      this.info.birth = this.defaultTime.getTime() / 1000
      axios.post(`http://${rootAddr}/user/change_data`, this.info).then(res => {
        console.log(res)
        this.info = res.data.data
        this.change = false
      }).catch(err => {
            ElMessage.error("修改失败:", err)
          }
      )
    },
    uploadFaceFile() {
      let file = document.createElement("input")
      file.type = "file"
      file.accept = "image/*"
      file.onchange = () => {
        let formData = new FormData()
        formData.append("face_img", file.files[0])
        axios.post(`http://${rootAddr}/user/user_face_url`, formData).then(res => {
          console.log(res)
          if (res.data.code != 0) {
            ElMessage.error("上传失败:", res.data.msg)
          }
          this.info.face_url = res.data.data
          state.user.face_url = this.info.face_url
        }).catch(err => {
              ElMessage.error("上传失败:", err)
            }
        )
      }
      file.click()
    }
  },
}
</script>

<style scoped>

</style>