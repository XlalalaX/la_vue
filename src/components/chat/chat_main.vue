<template>
  <div class="chat_main" style="height: 100vh;width: 100vh; display: flex; flex-direction: column;">
    <el-container style="flex-grow: 1;">
      <el-header style="width: 100%; height: 4%;">
        <chat-header/>
      </el-header>
      <el-container style="width: 100%; height: 90%;">
        <el-aside style="width:auto; resize: horizontal; overflow: auto; cursor: ew-resize;">
          <div>
            <div v-if="state.isGroup">
              <chat_group_list/>
            </div>
            <div v-if="!state.isGroup">
              <chat_friend_list/>
            </div>
          </div>
        </el-aside>
        <el-container style="width: 80%;">
          <el-main style="">
            <chat_content/>
          </el-main>
          <el-footer style="height: 10%;">
            <el-input v-model="state.inputMsg" placeholder="请输入消息" style="width: 80%;"></el-input>
            <el-button type="primary" @click="sendMessage" style="width: 20%;">发送</el-button>
          </el-footer>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>


<script>
import Chat_friend_list from "./chat_friend_list.vue";
import {state, getChatId} from "../../store/state.js";
import {useRoute} from "vue-router";
import {nextTick, ref, watchEffect} from "vue";
import axios from "axios";
import Chat_group_list from "./chat_group_list.vue";
import Chat_content from "./chat_content.vue";
import {pb_msg} from '/src/proto/pb_msg/pb_msg.pb.js';
import ChatHeader from "./chat-header.vue";

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
  name: "chat_main",
  components: {ChatHeader, Chat_content, Chat_group_list, Chat_friend_list},
  data() {
    return {
      state,
    }
  },
  setup() {

    // const MyMessage = pb_msg.lookupType('root.pb_msg');

    const route = useRoute();

    const websocket = ref(null);
    let seq = 0;

    const blobToUint8Array = function blobToUint8Array(blob) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.addEventListener('loadend', () => {
          resolve(new Uint8Array(reader.result));
        });
        reader.addEventListener('error', () => {
          reject(reader.error);
        });
        reader.readAsArrayBuffer(blob);
      });
    }


    watchEffect(() => {
      console.log("user", localStorage.getItem("la_user"))
      console.log("state.user", state.user)
      let server_addr_list = []
      //获取链接池服务器地址
      axios.get('http://127.0.0.1:3001/services/ws/list').then(res => {
        console.log("data:", res.data)
        server_addr_list = res.data.data.ws_addr_list
        console.log("server_addr_list:", server_addr_list)
        let url = `ws://${server_addr_list[0]}/ws?send_id=${state.user.uid}&token=${state.token}`;
        console.log("链接url:", url)
        websocket.value = new WebSocket(url);
        websocket.value.binaryType = 'arraybuffer';
        websocket.value.onmessage = (event) => {
          const msg = pb_msg.Msg.decode(new Uint8Array(event.data));
          console.log("返回消息解析得：", msg)
          console.log("state:", state)
          //单聊
          if (msg.sessionType == 0) {
            let chatId = getChatId(msg.sendID, msg.recvID)
            if (!state.Record.has(chatId)) {
              state.Record.set(chatId, [])
            }
            //赋值seq后面遍历要
            msg.seq =state.Record.get(chatId)?.length ?? 0
            state.Record.get(chatId).push(msg)
          } else {
            //群聊
            if (!state.Record.has(msg.groupID)) {
              state.Record.set(msg.groupID, [])
            }
            //赋值req后面遍历要
            msg.seq =state.Record.get(msg.sendID)?.length ?? 0
            state.Record.get(msg.groupID).push(msg)
          }
        };
      }).catch(err => {
        alert(`链接出错：${err}`)
      })
    });

    const sendMessage = () => {
      let msg = pb_msg.Msg.create({
        sendID: state.user.uid,
        recvID: "",
        groupID: "",
        senderPlatformID: 1,
        senderNickname: state.user.nike_name,
        senderFaceURL: state.user.face_url,
        sessionType: 0,
        msgFrom: 1,
        contentType: 1,
        content: state.inputMsg,
        seq: 0,
        sendTime: Date.now(),
        status: 0,
      });
      if (state.isGroup) {
        msg.groupID = state.ShowGroupId
        msg.sessionType = 1
      } else {
        msg.recvID = state.ShowFriendId
        msg.sessionType = 0
      }
      websocket.value.send(pb_msg.Msg.encode(msg).finish());
      console.log("发送消息成功:", msg)
      state.inputMsg = "";
      // 滚动到底部
      nextTick(() => {
        const scrollbar = document.getElementsByClassName('el-scrollbar__wrap')[0];
        scrollbar.scrollTop = scrollbar.scrollHeight;
      });
    };
    //todo:边栏改变宽度

    return {
      blobToUint8Array,
      sendMessage,
    };
  },

}
</script>

<style scoped>

</style>