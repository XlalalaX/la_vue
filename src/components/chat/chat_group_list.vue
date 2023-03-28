<!-- groupList.vue -->
<template>
  <div class="group-list">
    <el-tag v-for="id in groupList" :key="id" @click="toChat(id)">{{ id }}</el-tag>
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
  config.headers['token'] = state.token;
  return config;
}, function (error) {
  // 对请求错误做些什么
  return error;
});

export default {
  name: "chat_group_list",
  data() {
    return {
    }
  },
  setup() {
    const groupList = ref([]) // 定义 groupList 为响应式数据
    const getgroupList = async ()=>{
      try {
        const res = await axios.get(`http://${rootAddr}/group/list`)// 获取群组列表
        console.log(`rsp:`,res)
        if(res.data.code!=0){
          ElMessage.error(`获取群组列表失败${res.data.msg}`)
          return
        }
        groupList.value = res.data.data.group_list
        console.log(`this.groupList`,this.groupList)
        ElMessage.success(`获取群组列表成功`)
      } catch (err) {
        ElMessage(`获取群组列表错误${err}`)
      }
    }
    watchEffect(() => {
     getgroupList()
    });
    return{
      groupList
    }
  },
  methods: {
    toChat(id) {
      state.ShowgroupId=id
    }
  },
}
</script>

<style scoped>

</style>