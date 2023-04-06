<template>
  <div class="chat-page" style="height: calc(100% - 1%);">
    <el-scrollbar wrap-class="chat-window" ref="scrollbar" style="height: 100%; overflow-y: scroll;">
      <ul style="height: 100%; overflow-y: auto;">
        <div v-for="msg in msgList" :key="msg.seq">
          <el-row type="flex" :justify="msg.sendID != state.user.uid? 'start':'end'">
            <div class="avatar-with-text" v-if="msg.sendID != state.user.uid">
            <el-avatar
                :size="40"
                :src="msg.senderFaceURL"
                :fit="cover">{{ msg.senderNickname }}</el-avatar>
              <span >{{msg.senderNickname}}</span>
            </div>
            <el-card v-if="msg.contentType === 1" style="color: dodgerblue; height: 50%;margin-block:15px auto; max-width: 80%;overflow: auto;word-break: break-word" v-html="msg.content"></el-card>
            <div v-else :class="msg.sendID == state.user.uid ? 'mr-10px': 'ml-10px'">
              <el-image
                  v-if="msg.contentType === 1"
                  class="w-200px ha max-h-200px"
                  :src="msg.content"
                  :preview-src-list="[msg.content]"
                  :initial-index="4"
                  fit="cover"
              />
              <video
                  v-if="msg.contentType === 2"
                  width="300"
                  height="180"
                  controls
              >
                <source :src="msg.content" type="video/mp4" />
                您的浏览器不支持 HTML5 video 标签。
              </video>
            </div>
            <div class="avatar-with-text" v-if="msg.sendID == state.user.uid">
              <el-avatar
                  :size="42"
                  :src="msg.senderFaceURL"
                  :fit="cover">{{ msg.senderNickname }}</el-avatar>
              <span >{{msg.senderNickname}}</span>
            </div>
<!--            <el-icon v-if="msg.status === 1" :class="msg.sendId == state.userInfo?.id ? 'mr-10px': 'ml-10px'" class="is-loading pt-5px" size="40px">-->
<!--              <i i="ep-loading" style="color: dodgerblue"></i>-->
<!--            </el-icon>-->
          </el-row>
<!--          <el-card class="card">-->
<!--            <div class="info">{{ msg.senderNickname+":" }}</div>-->
<!--            <div class="content" v-html="msg.content"></div>-->
<!--          </el-card>-->
        </div>
      </ul>
    </el-scrollbar>
  </div>
</template>

<script>
import { ElScrollbar, ElCard } from "element-plus";
import { watchEffect, ref, inject, nextTick, computed, watch, reactive } from 'vue';
import {getChatId, state} from "../../store/state.js";

export default {
  components: { ElScrollbar, ElCard },
  name: "chat_content",
  data(){
    return{
      state
    }
  },
  setup() {
    const msgList = ref([])

    // 监听 ShowGroupId、ShowFriendId 和 isGroup 这三个变量和它们对应的属性值是否发生改变
    watch([() => state.ShowGroupId, () => state.ShowFriendId, () => state.isGroup, () => state.Record.get(state.ShowGroupId)?.length, () => state.Record.get(getChatId(state.ShowFriendId,state.user.uid))?.length], ([groupId, friendId, isGroup, groupMsgLength, friendMsgLength]) => {
      if (isGroup) {
        if (groupMsgLength !== undefined && state.Record.has(groupId)) {
          msgList.value = state.Record.get(groupId)
          console.log("消息队列：",msgList)
          return;
        }
        msgList.value=[]
      } else {
        let chatId=getChatId(state.ShowFriendId,state.user.uid)
        if (friendMsgLength !== undefined && state.Record.has(chatId)) {
          msgList.value = state.Record.get(chatId)
          console.log("消息队列：",msgList)
          return;
        }
        msgList.value=[]
      }
    }, { immediate: true })

    return {
      msgList
    }
  }
}

</script>

<style scoped>
.avatar-with-text {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.avatar-with-text span {
  margin-top: 10px;
}
</style>