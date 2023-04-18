<template>
  <div style="max-width: 600px;">
  <el-image style="width: 100px; height: 100px;"
            :src="info.face_url"
            :zoom-rate="1.2"
            :preview-src-list="[info.face_url]"
            :initial-index="0"
            fit="cover"
  />
  <el-card>
    <div style="display: flex; flex-wrap: wrap;">
    <el-text><span>uid：{{ info.uid }}</span></el-text>
    </div>
    <div style="display: flex; flex-wrap: wrap;">
    <el-text><span>昵称：{{ info.nick_name }}</span></el-text>
    </div>
    <div style="display: flex; flex-wrap: wrap;">
    <el-text><span>生日：{{ new Date(info.birth * 1000).getDate() }}</span></el-text>
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
  <el-button @click="delFriend()" v-if="isFriend">删除好友</el-button>
  <el-button @click="addFriend()" v-if="!isFriend">申请好友</el-button>
  </div>
</template>

<script>
import { state } from "../../store/state.js";
import {watchEffect, ref, onMounted, onBeforeMount, onBeforeUnmount} from "vue";
import axios from "axios";
import { rootAddr } from "../../router/index.js";
import { ElMessage } from "element-plus";

export default {
  name: "user_info",
  props: {
    uid: {
      type: String,
      required: true
    }
  },
  methods:{
    delFriend(){
      axios.delete(`http://${rootAddr}/friend/del?friend_id=${this.uid}`).then(res=>{
        if(res.data.code!=0){
          ElMessage.error(`删除好友失败${res.data.msg}`)
          return
        }
        ElMessage.success(`删除好友成功`)
        console.log("删除好友成功",res)
        this.isFriend = false
      }).catch(
          err=>{ElMessage.error(`删除好友失败${err}`)}
      )
    },
    addFriend(){
      axios.post(`http://${rootAddr}/add_req/send?uid=${this.uid}`).then(res=>{
        if(res.data.code==-1){
          ElMessage.error(`发送申请好友请求失败${res.data.msg}`)
          return
        }
        ElMessage.success(`发送申请好友请求成功`)
        console.log("发送申请好友请求成功",res)
        // this.isFriend = true
      }).catch(
          err=>{ElMessage.error(`添加好友失败${err}`)}
      )
    },
  },

  setup(props) {
    const uid = ref(props.uid);
    console.log("user_uid:",uid.value);
    const info = ref(state.friendMap.get(uid.value)!=null?state.friendMap.get(uid.value):{
      uid:"",
      face_url:"",
      nick_name:"",
      birth:0,
      gender:0,
      email:"",
      phone_number:"",
    });
    const isFriend = ref(info.value == null ? false : true);

    onMounted ( async ()=>{
      {
        console.log("user_info:",info.value);
        if (info.value == null||info.value.uid.length==0) {
          isFriend.value = false;
          await axios.get(`http://${rootAddr}/user/user_show_info?uid=${uid.value}`).then(async res=>{
            if(res.data.code!=0){
              ElMessage.error(`获取用户详情失败${res.data.msg}`)
              return
            }
            info.value = res.data.data
            await axios.get(`http://${rootAddr}/user_not/user_face_url?uid=${uid.value}`)
                .then((response) => {
                  info.value.face_url = response.data.data
                }).catch(
                    err=>{ElMessage.error(`获取用户头像失败${err}`)}
                )
            //如果是好友，更新好友信息
            if (isFriend){
              state.friendMap.set(uid.value, info.value)
            }
          }).catch(
              err=>{ElMessage.error(`获取用户详情失败${err}`)}
          )// 获取用户信息
        } else {
          isFriend.value = true;
        }
        console.log("user_info2:",info.value);
      }
    })

    return { uid, info, isFriend };
  }
}
</script>

<style scoped>

</style>