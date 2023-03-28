<template>
  <div class="chat-page">
    <el-scrollbar wrap-class="chat-window" ref="scrollbar">
      <ul>
        <li v-for="message in messages" :key="message.seq">
          <el-card class="card" :class="{ 'from-me': message.sendID === userInfo.send_id }">
            <div class="info">{{ message.senderNickname }}</div>
            <div class="content">{{ message.content }}</div>
          </el-card>
        </li>
      </ul>
    </el-scrollbar>
    <div class="input-box">
      <el-input v-model="message" placeholder="请输入消息"></el-input>
      <el-button type="primary" @click="sendMessage">发送</el-button>
    </div>
  </div>
</template>

<script>
import { ElScrollbar, ElCard, ElInput, ElButton } from 'element-plus';
import { watchEffect, ref, inject, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios'

export default {
  components: {
    ElScrollbar,
    ElCard,
    ElInput,
    ElButton,
  },
  setup() {
    const route=useRoute();
    console.log(route.query)
    const userInfo = route.query;
    const websocket = ref(null);
    const messages = ref([]);
    const message = ref("");
    let seq = 0;

    watchEffect(() => {

      let server_addr_list =[]
      axios.get('http://127.0.0.1:3001/services/ws/list').then(res=>{
        console.log("data:",res.data)
        server_addr_list=res.data.data.ws_addr_list
        console.log("server_addr_list:",server_addr_list)
        let url = `ws://${server_addr_list[0]}/ws?send_id=${userInfo.send_id}&token=${userInfo.token}`;
        console.log("链接url:",url)
        websocket.value = new WebSocket(url);
        websocket.value.onmessage = (event) => {
          const msg = JSON.parse(event.data);
          msg.seq = seq++;
          if(msg.code!=-1){
            messages.value.push(msg);
          }else {
            alert("消息发送失败")
          }

          // 滚动到底部
          nextTick(() => {
            const scrollbar = document.getElementsByClassName('el-scrollbar__wrap')[0];
            scrollbar.scrollTop = scrollbar.scrollHeight;
          });

        };
      }).catch(err=>{
        alert(`链接出错：${err}`)
      })
    });

    const sendMessage = () => {
      const msg = {
        sendID: userInfo.send_id,
        recvID: userInfo.recv_id,
        groupID: userInfo.group_id,
        senderPlatformID: 1,
        senderNickname: "my-nickname",
        senderFaceURL: userInfo.token,
        sessionType: 1,
        msgFrom: 1,
        contentType: 1,
        content: message.value,
        seq: seq++,
        sendTime: Date.now(),
        status: 1,
      };
      websocket.value.send(JSON.stringify(msg));
      message.value = "";
    };

    return {
      messages,
      message,
      sendMessage,
      userInfo,
    };
  },
};
</script>

<style scoped>
.chat-page {
  padding: 20px;
}

.chat-window {
  height: 500px;
  overflow-y: auto;
}

.card {
  margin-bottom: 10px;
  max-width: 60%;
  word-wrap: break-word;
  display: inline-block;
  text-align: left;
  padding: 8px 15px;
}

.from-me {
  background-color: #e6f7ff;
  border-radius: 10px 10px 0 10px;
  float: right;
}

.info {
  font-size: 12px;
  color: #999;
  margin-bottom: 5px;
}

.content {
  font-size: 14px;
  word-break: break-all;
}
.input-box {
  margin-top: 10px;
  display: flex;
  align-items: center;
}
</style>
