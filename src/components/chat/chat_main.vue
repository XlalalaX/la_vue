<template>
  <div class="common-layout">
    <el-container>
      <el-header>
      </el-header>
      <el-container>
        <el-aside >
          <div>
            <div v-if="state.isGroup">
              <chat_group_list/>
            </div>
            <div v-if="!state.isGroup">
              <chat_friend_list/>
            </div>
          </div>

        </el-aside>
        <el-container>
          <el-main>
<!--            <im_home/>-->
            <chat_content/>
          </el-main>
          <el-footer style="display: flex">
              <el-input v-model="state.inputMsg" placeholder="请输入消息"></el-input>
              <el-button type="primary" @click="sendMessage">发送</el-button>
          </el-footer>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>


<script>
import Chat_friend_list from "./chat_friend_list.vue";
import Im_home from "../im_home.vue";
import state from "../../store/state.js";
import {useRoute} from "vue-router";
import {nextTick, ref, watchEffect} from "vue";
import axios from "axios";
import Chat_group_list from "./chat_group_list.vue";
import {ElMessage} from "element-plus";
import Chat_content from "./chat_content.vue";
export default {
  name: "chat_main",
  components: {Chat_content, Chat_group_list, Im_home, Chat_friend_list},
  data(){
    return{
      state,
    }
  },
  setup() {
    const route=useRoute();

    const websocket = ref(null);
    let seq = 0;

    watchEffect(() => {
      console.log("user",localStorage.getItem("la_user"))
      console.log("state.user",state.user)
      let server_addr_list =[]
      axios.get('http://127.0.0.1:3001/services/ws/list').then(res=>{
        console.log("data:",res.data)
        server_addr_list=res.data.data.ws_addr_list
        console.log("server_addr_list:",server_addr_list)
        let url = `ws://${server_addr_list[0]}/ws?send_id=${state.user.uid}&token=${state.token}`;
        console.log("链接url:",url)
        websocket.value = new WebSocket(url);
        websocket.value.onmessage = (event) => {
          const msg = JSON.parse(event.data);
          msg.seq = seq++;
          if(msg.code!=-1){
            state.MsgList.push(msg);
            if(!state.Record.has(msg.sendID)){
              state.Record.set(msg.sendID,[])
            }
            state.Record.get(msg.sendID).push(msg)
          }else {
            ElMessage.error("消息发送失败")
          }
        };
      }).catch(err=>{
        alert(`链接出错：${err}`)
      })
    });

    const sendMessage = () => {
      const msg = {
        sendID: state.user.uid,
        recvID: state.isGroup?"":state.ShowFriendId,
        groupID: state.isGroup?state.ShowGroupId:"",
        senderPlatformID: 1,
        senderNickname: state.user.nike_name,
        senderFaceURL: state.user.face_url,
        sessionType: state.isGroup?1:0,
        msgFrom: 1,
        contentType: 1,
        content: state.inputMsg,
        seq: seq++,
        sendTime: Date.now(),
        status: 1,
      };
      websocket.value.send(JSON.stringify(msg));
      state.inputMsg = "";
      // 滚动到底部
      nextTick(() => {
        const scrollbar = document.getElementsByClassName('el-scrollbar__wrap')[0];
        scrollbar.scrollTop = scrollbar.scrollHeight;
      });
    };

    return {
      sendMessage,
    };
  },
}
</script>

<style scoped>

</style>