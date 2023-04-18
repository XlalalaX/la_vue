<template>
  <div style="max-width: 800px">
  <el-card >
    <div style="display: flex; flex-wrap: wrap;">
      <el-text><span>群ID：{{ info.group_id }}</span></el-text>
    </div>
    <div style="display: flex; flex-wrap: wrap;">
      <el-text><span>群名：{{ info.group_name }}</span></el-text>
    </div>
    <div style="display: flex; flex-wrap: wrap;">
      <el-text><span>群主：{{ info.owner_uid }}</span></el-text>
    </div>
    <el-card style="display:block">
      <span>管理员：</span>
      <el-menu style="max-height: 300px" >
        <div v-for="adminer in info.admin" :key="adminer">
          <el-menu-item style="display: block" @click="showUserInfo(adminer)">
          <el-text><span>{{ groupMemberInfoMap.get(adminer)==null?null:groupMemberInfoMap.get(adminer).nick_name }}</span></el-text>
          </el-menu-item>
        </div>
      </el-menu>
    </el-card>
    <el-card style="display: block">
      <span>群员：</span>
      <el-menu style="max-height: 400px">
        <div v-for="uid in info.uid_list" :key="uid">
          <el-menu-item style="display: block" @click="showUserInfo(uid)">
          <el-text><span>{{groupMemberInfoMap.get(uid)==null?null:groupMemberInfoMap.get(uid).nick_name}}</span></el-text>
          </el-menu-item>
        </div>
      </el-menu>
    </el-card>
    <el-button type="primary" @click="joinGroup" v-if="isGroupMember">申请加入</el-button>
  </el-card>
  </div>
  <el-dialog v-model="showUser" :key="showUid" style="width: auto;max-width: 600px">
    <user_info :uid="showUid"/>
  </el-dialog>
</template>

<script>
import axios from "axios";
import {rootAddr} from "../../router/index.js";
import {ElMessage} from "element-plus";
import {onMounted, ref} from "vue";
import {state} from "../../store/state.js";
import User_info from "./user_info.vue";

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
  components: {User_info},
  props: {
    group_id: {
      type: String,
      required: true
    }
  },
  methods:{
    joinGroup(){
      axios.post(`http://${rootAddr}/add_req/send_group?`,{"group_id":this.groupId}).then(res=>{
        if(res.data.code==-1){
          ElMessage.error(`申请加入群组失败${res.data.msg}`)
          return
        }
        ElMessage.success(`发送申请成功`)
      }).catch(
          err=>{ElMessage.error(`申请加入群组失败${err}`)}
      )
    },
    showUserInfo(uid){

      this.showUid = uid
      this.showUser = true
      console.log("showUserInfo",this.showUid)
    }
  },
  setup(props) {
    const groupId = ref(props.group_id);
    const info = ref(state.groupMap.get(groupId.value)!=null?state.groupMap.get(groupId.value):{
      group_id: groupId.value,
      group_name: "未知",
      owner_uid: "未知",
      admin: [],
      uid_list: []
    });
    const groupMemberInfoMap = ref(new Map());
    const isGroupMember = ref(false);
    const showUser = ref(false);
    const showUid = ref("");

    console.log("group_id",groupId.value)
    onMounted(async () => {
      if (info.value == null||info.value.uid_list.length==0) {
        await axios.get(`http://${rootAddr}/group/info?group_id=${groupId.value}`).then(res=>{
          if(res.data.code==-1){
            ElMessage.error(`获取群组详情失败${res.data.msg}`)
            return
          }
          info.value = res.data.data
        }).catch(
            err=>{ElMessage.error(`获取群组详情失败${err}`)}
        )// 获取用户信息
      }

      for(let i=0;i<info.value.uid_list.length;i++){
        if(info.value.uid_list[i]==state.uid){
          isGroupMember.value = true
        }
        if(state.friendMap.get(info.value.uid_list[i])==null){
          await axios.get(`http://${rootAddr}/user/user_show_info?uid=${info.value.uid_list[i]}`).then(res=>{
            if(res.data.code==-1){
              ElMessage.error(`获取用户信息失败${res.data.msg}`)
              return
            }
            groupMemberInfoMap.value.set(info.value.uid_list[i],res.data.data)
          }).catch(
              err=>{ElMessage.error(`获取用户信息失败${err}`)}
          )// 获取用户信息
        }else {
          groupMemberInfoMap.value.set(info.value.uid_list[i],state.friendMap.get(info.value.uid_list[i]))
        }
      }
      console.log("groupMemberInfoMap",groupMemberInfoMap.value)
    })
    return {
      groupId,
      info,
      groupMemberInfoMap,
      isGroupMember,
      showUser,
      showUid
    };
  }
}
</script>

<style scoped>

</style>