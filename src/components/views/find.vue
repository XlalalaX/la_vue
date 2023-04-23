<template>
  <div >
    <el-tabs type="border-card" v-model="activeName">
      <el-tab-pane label="用户" name="user">
        <el-input v-model="inputStr" :placeholder="userPre" >
          <template #append>
            <el-button :icon="Search" @click="searchUser"/>
          </template>
          <template #prepend>
            <el-select v-model="userSearchType" style="width: 115px">
              <el-option label="昵称" value="nick_name"/>
              <el-option label="UID" value="uid" />
              <el-option label="邮箱" value="email" />
            </el-select>
          </template>
        </el-input>
        <el-menu>
          <div v-for="item in userSearchResult" :key="item.uid" >
            <el-menu-item @click="userShow(item.uid)" style="display: block">{{item.nick_name}}</el-menu-item>
          </div>
        </el-menu>
      </el-tab-pane>
      <el-tab-pane label="群组" name="group">
        <el-input v-model="inputStr">
          <template #append>
            <el-button :icon="Search" @click="searchGroup"/>
          </template>
          <template #prepend>
            <el-select v-model="groupSearchType" style="width: 115px">
              <el-option label="群名" value="group_name" />
              <el-option label="群ID" value="group_id" />
            </el-select>
          </template>
        </el-input>
        <el-menu>
          <div v-for="item in groupSearchResult" :key="item.group_id">
            <el-menu-item @click="groupShow(item.group_id)" style="display: block">{{item.group_name}}</el-menu-item>
          </div>
        </el-menu>
      </el-tab-pane>
    </el-tabs>
  </div>
  <el-dialog v-model="is_userShow" :key="userShowId" style="width: auto;max-width: 600px">
    <user_info :uid="userShowId"></user_info>
  </el-dialog>
  <el-dialog v-model="is_groupShow" :key="groupShowId"  style="width: auto;max-width: 800px">
    <group_info :group_id="groupShowId"></group_info>
  </el-dialog>
</template>

<script>
import { Search } from '@element-plus/icons-vue'
import axios from "axios";
import {ElMessage} from "element-plus";
import {rootAddr} from "../../router/index.js";
import {state} from "../../store/state.js";
import User_info from "../info/user_info.vue";
import Group_info from "../info/group_info.vue";

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
  name: "find",
  components: {Group_info, User_info},
  data(){
    return {
      activeName: 'user',
      userSearchType: '',
      userSearchResult: [],
      groupSearchType: '',
      groupSearchResult: [],
      inputStr:"",
      is_userShow:false,
      userShowId: "",
      is_groupShow:false,
      groupShowId: "",
      Search
    }
  },
  methods: {
    userShow(id){
      this.userShowId = id
      this.is_userShow = true
      console.log("userShow",id)
    },
    groupShow(id){
      this.groupShowId = id
      this.is_groupShow = true
    },
    searchUser(){
      axios.get(`http://${rootAddr}/user/find_user_list?query_type=${this.userSearchType}&query_str=${this.inputStr}`).then(res=>{
        if(res.data.code==-1){
          ElMessage.error(`搜索用户失败${res.data.msg}`)
          return
        }
        console.log("搜索用户返回",res.data.data)
        this.userSearchResult = res.data.data
      }).catch(
        err=>{
          ElMessage.error(`搜索用户失败${err}`)
        }
      )
    },
    searchGroup(){
      axios.get(`http://${rootAddr}/group/find_group_list?search_type=${this.groupSearchType}&search_str=${this.inputStr}`).then(res=>{
        if(res.data.code==-1){
          ElMessage.error(`搜索群组失败${res.data.msg}`)
          return
        }
        console.log("搜索群组返回",res.data.data)
        this.groupSearchResult = res.data.data.group_list
      }).catch(
        err=>{
          ElMessage.error(`搜索群组失败${err}`)
        }
      )
    },
  }
}
</script>

<style scoped>

</style>