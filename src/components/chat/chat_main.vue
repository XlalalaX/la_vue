<template>
  <div class="common-layout">
    <el-container>
      <el-header>
      </el-header>
      <el-container>
        <el-aside >
          <chat_friend_list>
          </chat_friend_list>
        </el-aside>
        <el-container>
          <el-main>
            <im_home></im_home>
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
export default {
  name: "chat_main",
  components: {Im_home, Chat_friend_list},
  data(){
    return{
      state
    }
  },
  methods:{
    sendMessage(){
      state.inputMsg="la"
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
          }else {
            alert("消息发送失败")
          }
        };
      }).catch(err=>{
        alert(`链接出错：${err}`)
      })
    });

    const sendMessage = () => {

      let msg = {
        sendID: state.user.uid,
        recvID: "",
        groupID: "",
        senderPlatformID: 1,
        senderNickname: state.user.nike_name,
        senderFaceURL: state.user.face_url,
        sessionType: 1,
        msgFrom: 1,
        contentType: 1,
        content: state.inputMsg,
        seq: 0,
        sendTime: Date.now(),
        status: 0,
      };
      if(state.isGroup){
        msg.groupID=state.ShowGroupId
      }else {
        msg.sendID=state.ShowFriendId
      }
      websocket.value.send(JSON.stringify(msg));
      state.inputMsg = "";
    };

    return {
      sendMessage,
    };
  },
}
</script>

<style scoped>

</style>