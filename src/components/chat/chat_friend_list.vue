<!-- FriendList.vue -->
<template>
  <div class="friend-list">
      <el-menu :default-active="state.ShowFriendId">
      <el-menu-item v-for="friendId in state.friendList" :key="friendId" :index="friendId" @click="toChat(friendId)">
        <div class="avatar-with-text">
          <el-avatar
              :size="40"
              :src="state.friendMap.get(friendId)==null?null:state.friendMap.get(friendId).face_url"
              :fit="cover">{{ state.friendMap.get(friendId)==null?null:state.friendMap.get(friendId).nick_name}}</el-avatar>
          <span class="xian_select_name" style="margin-inline-start:10px;max-width:30%">{{state.friendMap.get(friendId)==null?null:state.friendMap.get(friendId).nick_name}}</span>
        </div>
      </el-menu-item>
      </el-menu>
  </div>
</template>

<script>
import axios from 'axios'
import {getCurrentInstance, onMounted, ref, watch, watchEffect} from "vue";
import {ElMessage} from 'element-plus'
import {rootAddr, router} from "../../router/index.js";
import {getChatId, state} from "../../store/state.js";
import {pb_msg} from "../../proto/pb_msg/pb_msg.pb.js";
import * as $protobuf from "protobufjs";

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
  name: "chat_friend_list",
  data() {
    return {
      state
    }
  },
  setup() {
    // const friendList = ref([]) // 定义 friendList 为响应式数据
    // const friendMap=ref(new Map)
    const getFriendList = async ()=>{
      //获取好友列表
      try {
        const res = await axios.get(`http://${rootAddr}/friend/list`)// 获取好友列表
        console.log(`rsp:`,res)
        if(res.data.code!=0){
          ElMessage.error(`获取好友列表失败${res.data.msg}`)
          return
        }
        if (res.data.data.friend_list== null) {
          ElMessage.warning(`您还没有好友`)
          return
        }
        state.friendList = res.data.data.friend_list
        console.log(`this.friendList:`,state.friendList)
        if(state.friendList.length>0){
          for(let i=0;i<state.friendList.length;i++){
            if(state.friendList[i]!=""){
              state.ShowFriendId=state.friendList[i]
              break
            }
          }
        }
        ElMessage.success(`获取好友列表成功`)
      } catch (err) {
        ElMessage(`获取好友列表错误${err}`)
      }
      //获取好友信息
      try {
       for(let i=0; i<state.friendList.length; i++){
         const res = await axios.get(`http://${rootAddr}/user/user_show_info?uid=${state.friendList[i]}`)// 获取好友信息
         if(res.data.code!=0){
           ElMessage.error(`获取好友详情失败${res.data.msg}`)
           return
         }
         let respond=await axios.get(`http://${rootAddr}/user_not/user_face_url?uid=${res.data.data.uid}`)
         res.data.data.face_url=respond.data.data
         state.friendMap.set(state.friendList[i],res.data.data)
         state.saveUsersFaceUrl.set(state.friendList[i],respond.data.data)
       }
      }catch (err){
        ElMessage(`获取好友详情错误${err}`)
      }
    }
    //获取历史消息记录
    const getChatLog=async ()=>{
       for(let i=0;i<state.friendList?.length??0;i++){
        //只更新已保存的消息小于10条的
        if(state.Record.get(getChatId(state.friendList[i],state.user.uid))?.length??0>10){
          continue
        }
        await axios.get(`http://${rootAddr}/chat_log/temp?chat_id=${getChatId(state.friendList[i],state.user.uid)}&chat_type=0`)
        //     .then(res=>{
        //   const msgList=[]
        //   if(res.data.data.chat_msg?.length??0>0){
        //     for(let i=0;i<res.data.data.chat_msg.length;i++){
        //       console.log("消息：",res.data.data.chat_msg[i].msg)
        //       //解析历史聊天记录
        //       let arr=new TextEncoder().encode(res.data.data.chat_msg[i].msg)
        //       console.log(arr)
        //       const newMsg= pb_msg.Msg.decode(arr)
        //       console.log("解析后消息：",newMsg)
        //       newMsg.seq=msgList.length
        //       msgList.push(newMsg)
        //     }
        //     for(let j=0;j<state.Record.get(res.data.data.chat_id)?.length??0;j++){
        //       //排除所有发送时间小于现在时间的消息，合并消息列表
        //       if(msgList[msgList.length-1].sendTime<=state.Record.get(res.data.data.chat_id)[j].sendTime){
        //         if(msgList[msgList.length-1].sendTime<state.Record.get(res.data.data.chat_id)[j].sendTime){
        //           state.Record.get(res.data.data.chat_id)[j].seq=msgList.length
        //           msgList.push(state.Record.get(res.data.data.chat_id)[j])
        //         }else {
        //           //发送时间相同情况时全面比较
        //           if(msgList[msgList.length-1].content==state.Record.get(res.data.data.chat_id)[j].content
        //           &&msgList[msgList.length-1].file==state.Record.get(res.data.data.chat_id)[j].file){
        //             continue
        //           }else {
        //             state.Record.get(res.data.data.chat_id)[j].seq=msgList.length
        //             msgList.push(state.Record.get(res.data.data.chat_id)[j])
        //           }
        //         }
        //       }
        //     }
        //     //替换原本的
        //     state.Record.set(res.data.data.chat_id,msgList)
        //   }
        // }).catch(err=>{
        //   ElMessage(`获取好友历史聊天记录失败：${err}`)
        // })
      }
      console.log("state",state)
    }
    onMounted(async () => {
     await getFriendList()
     await getChatLog()
    });
    return{
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
.xian_select_name:hover {
  color: aqua;
}
</style>