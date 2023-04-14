<template>
  <el-card>
    <div style="display: flex; flex-wrap: wrap;">
      <el-text><span>群ID：{{ info.group_id }}</span></el-text>
    </div>
    <div style="display: flex; flex-wrap: wrap;">
      <el-text><span>群名：{{ info.group_name }}</span></el-text>
    </div>
    <div style="display: flex; flex-wrap: wrap;">
      <el-text><span>群主：{{ info.owner_uid }}</span></el-text>
    </div>
    <div style="display: flex; flex-wrap: wrap;">
      <span>管理员：</span>
      <el-scrollbar height="300px" >
        <div v-for="adminer in info.admin" :key="adminer">
          <el-text><span>{{ adminer }}</span></el-text>
        </div>
      </el-scrollbar>
    </div>
    <div style="display: flex; flex-wrap: wrap;">
      <span>群员：</span>
      <el-scrollbar height="400px" >
        <div v-for="uid in info.uid_list" :key="uid">
          <el-text><span>{{ uid }}</span></el-text>
        </div>
      </el-scrollbar>
    </div>
  </el-card>
</template>

<script>
//todo: 造群组显示的组件
import axios from "axios";
import {rootAddr} from "../../router/index.js";
import {ElMessage} from "element-plus";
import {onMounted, ref} from "vue";
import {state} from "../../store/state.js";

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
  name: "group_info",
  props: {
    group_id: {
      type: String,
      required: true
    }
  },
  methods:{

  },
  setup(props) {
    const groupId = ref(props.group_id);
    const info = ref(state.groupMap.get(groupId.value));

    onMounted(() => {
      if (info.value == null) {
        axios.get(`http://${rootAddr}/group/info?group_id=${groupId.value}`).then(res=>{
          if(res.data.code==-1){
            ElMessage.error(`获取群组详情失败${res.data.msg}`)
            return
          }
          info.value = res.data.data
        }).catch(
            err=>{ElMessage.error(`获取群组详情失败${err}`)}
        )// 获取用户信息
      }
    })
    return { groupId, info };
  }
}
</script>

<style scoped>

</style>