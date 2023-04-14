<template>
  <el-menu-item-group v-for="(key,addReq) in state.addReqList" :key="key">
    <el-menu-item>
      <span style="max-width: 50%" @click="showInfo(addReq.send_id)" v-if="addReq.group_id==''">{{ addReq.send_nick_name }} 请求添加你为好友</span>
      <span style="max-width: 50%" @click="showInfo(addReq.send_id)" v-if="addReq.group_id!=''">{{ addReq.send_nick_name }} 请求加入 {{addReq.group_name}}</span>
      <el-button type="text" @click="handleAddReq(addReq.object_id,true)">同意</el-button>
      <el-button type="text" @click="handleAddReq(addReq.object_id,false)">拒绝</el-button>
    </el-menu-item>
  </el-menu-item-group>
  <el-dialog v-model="is_showInfo">
    <user_info :uid="showInfoUid"></user_info>
  </el-dialog>
</template>

<script>
import {state} from "../../store/state.js";
import axios from "axios";
import {ElMessage} from "element-plus";
import User_info from "../info/user_info.vue";

// 全局添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  config.headers['token'] =state.token;
  return config;
}, function (error) {
  // 对请求错误做些什么
  return error;
});

export default {
  name: "add_req",
  components: {User_info},
  data() {
    return {
      state,
      is_showInfo: false,
      showInfoUid: ""
    }
  },
  methods: {
    handleAddReq(id, agree) {
      axios.post(`http://${rootAddr}/add_req/handle?`, {
        add_req_id: id,
        is_agree: agree
      }).then(res => {
        if (res.data.code == -1) {
          ElMessage.error(`处理好友请求失败${res.data.msg}`)
          return
        }
        ElMessage.success(`处理好友请求成功`)
        console.log("处理好友请求成功", res)
        // 删除已经处理的请求
        state.addReqList.delete(id)
      }).catch(
          err => {
            ElMessage.error(`处理好友请求失败${err}`)
          }
      )
    },
    showInfo(uid) {
      this.showInfoUid = uid
      this.is_showInfo = true
    },
  }
}
</script>

<style scoped>

</style>