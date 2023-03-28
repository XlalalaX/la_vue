<!-- FriendList.vue -->
<template>
  <div class="friend-list">
    <el-tag v-for="id in friendList" :key="id" @click="toChat(id)">{{ id }}</el-tag>
  </div>
</template>

<script>
import axios from 'axios'
import {getCurrentInstance, ref, watchEffect} from "vue";
import {ElMessage} from 'element-plus'
import {rootAddr, router} from "../../router/index.js";
import state from "../../store/state.js";

// 全局添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  config.headers['token'] = localStorage.getItem("la_token");
  console.log(`token:${localStorage.getItem("la_token")}`)
  config.url=`${config.url}`
  return config;
}, function (error) {
  // 对请求错误做些什么
  return error;
});

export default {
  name: "chat_friend_list",
  data() {
    return {
    }
  },
  setup() {
    const friendList = ref([]) // 定义 friendList 为响应式数据
    const getFriendList = async ()=>{
      try {
        const res = await axios.get(`http://${rootAddr}/friend/list`)// 获取好友列表
        console.log(`rsp:`,res)
        if(res.data.code!=0){
          ElMessage.error(`获取好友列表失败${res.data.msg}`)
          return
        }
       friendList.value = res.data.data.friend_list
        console.log(`this.friendList`,this.friendList)
        ElMessage.success(`获取好友列表成功`)
      } catch (err) {
        ElMessage(`获取好友列表错误${err}`)
      }
    }
    watchEffect(() => {
     getFriendList()
    });
    return{
      friendList
    }
  },
  methods: {
    toChat(id) {
      state.ShowFriendId=id
    }
  },
}
</script>

<style scoped>

</style>