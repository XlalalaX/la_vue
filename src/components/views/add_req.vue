<template>
  <el-menu v-for="addReq  in state.addReqList.values()" :key="addReq.object_id" >
    <el-menu-item @click="showInfo(addReq)">
      <el-text style="max-width: 50%"  v-if="addReq.recv_id!=''">{{ addReq.send_nick_name }} 请求添加你为好友</el-text>
      <el-text style="max-width: 50%"  v-if="addReq.recv_id==''">{{ addReq.send_nick_name }} 请求加入 {{addReq.group_name}}</el-text>
      <div style="max-width: 150px;margin-inline-start: auto;margin-top: -30px;">
      <el-button style="margin-right: 10px" type="success" size="small" @click.stop="handleAddReq(addReq.object_id,true)">同意</el-button>
      <el-button  type="danger" size="small" @click.stop="handleAddReq(addReq.object_id,false)">拒绝</el-button>
      </div>
    </el-menu-item>

  </el-menu>
  <el-dialog v-model="is_showInfo" style="width: auto;max-width: 600px">
    <user_info :uid="showInfoUid"></user_info>
  </el-dialog>
</template>

<script>
import {state} from "../../store/state.js";
import axios from "axios";
import {ElMessage} from "element-plus";
import User_info from "../info/user_info.vue";
import {onMounted} from "vue";
import {rootAddr} from "../../router/index.js";

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
        if (res.data.code !=0) {
          ElMessage.error(`处理好友请求失败${res.data.msg}`)
          return
        }
        let addReq=state.addReqList.get(id)
        console.log("addReqList",state.addReqList)
        console.log("addReq",addReq)
        if (!addReq.recv_id||addReq.recv_id ==null|| addReq.recv_id == '') {
          // 如果是群请求
          if (agree) {
            // 同意
            ElMessage.success(`同意${addReq.send_nick_name}入群`)
          }else {
            // 拒绝
            ElMessage.warning(`拒绝${addReq.send_nick_name}入群`)
          }
        } else {
          // 如果是好友请求
          if (agree) {
            // 同意
            if(!state.friendMap.has(addReq.send_id)){
              state.friendList.push(addReq.send_id)
            }
            ElMessage.success(`同意${addReq.send_nick_name}为好友`)
          }else {
            // 拒绝
            ElMessage.warning(`拒绝${addReq.send_nick_name}为好友`)
          }
        }
        // 删除已经处理的请求
        state.addReqList.delete(id)
      }).catch(
          err => {
            ElMessage.error(`处理好友请求失败${err}`)
          }
      )
    },
    showInfo(uid) {
      console.log("显示用户id", uid)
      this.showInfoUid = uid
      this.is_showInfo = true
    },
  },
  setup() {
    onMounted(()=>{
      console.log("add_req:",state.addReqList)
      for (let [key, value] of state.addReqList) {
        console.log(key, value.send_nick_name);
      }
    })
    return {}
  }
}
</script>

<style scoped>

</style>