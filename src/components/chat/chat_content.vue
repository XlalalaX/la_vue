<template>
  <el-tooltip v-if="state.isGroup&&state.groupList.length!==0" content="详情" placement="top" type="primary">
    <span class="xian_select_name" style="color: cornflowerblue" @click="showGroupInfo(state.ShowGroupId)">{{
        state.groupMap.get(state.ShowGroupId) == null ? "unknown_group_name" : state.groupMap.get(state.ShowGroupId).group_name
      }}</span>
  </el-tooltip>
  <el-tooltip v-if="!state.isGroup&&state.friendList.length!==0" content="用户详情" placement="top" type="primary">
    <span class="xian_select_name" style="color: cornflowerblue" @click="showUserInfo(state.ShowFriendId)">{{
        state.friendMap.get(state.ShowFriendId) == null ? "unknown_user_name" : state.friendMap.get(state.ShowFriendId).nick_name
      }}</span>
  </el-tooltip>
  <div class="chat-page" style="height: calc(100% - 5%);">
    <el-scrollbar wrap-class="chat-window" ref="scrollbar" style="height: 100%;">
      <ul style="height: 100%; overflow-y: auto;">
        <div v-for="msg in msgList" :key="msg.sendTime">

            <el-row type="flex" v-if="msg.status==1" :justify="msg.sendID !== state.user.uid? 'start':'end'">
              <div class="avatar-with-text" v-if="msg.sendID != state.user.uid">
                <el-avatar
                    :size="40"
                    :src="msg.senderFaceURL"
                    :fit="cover"
                    @click="showUserInfo(msg.sendID)"
                >{{ msg.senderNickname }}
                </el-avatar>
                <span style="margin-inline-start:10px;">{{ msg.senderNickname }}</span>
              </div>
              <!--              //文本类型-->
              <el-card v-if="msg.contentType === 1"
                       style="color: dodgerblue; height: 50%;margin-block:10px auto; max-width: 80%;overflow: auto;word-break: break-word; margin-inline-end:10px;"
                       v-html="msg.content"></el-card>
              <!--              //图片类型-->
              <el-image
                  v-if="msg.contentType === 2||msg.contentType === 12"
                  style="max-width: 400px"
                  :src="msg.content"
                  :preview-src-list="[msg.content]"
                  :initial-index="4"
                  @load="msg.content"
                  fit="cover"
              />
              <!--              //音频类型-->
              <el-card v-if="msg.contentType === 3||msg.contentType===13">
                <audio
                    width="300"
                    height="60"
                    preload="metadata"
                    controls>
                  <source :src="msg.content" type="audio/mpeg"/>
                  您的浏览器不支持 HTML5 audio 标签。
                </audio>
              </el-card>
              <!--              //视频类型-->
              <el-card v-if="msg.contentType === 4||msg.contentType === 14">
                <video
                    width="300"
                    height="180"
                    preload="metadata"
                    controls>
                  <source :src="msg.content" type="video/mp4"/>
                  您的浏览器不支持 HTML5 video 标签。
                </video>
              </el-card>
              <!--              //文件类型-->
              <el-card v-if="msg.contentType === 5||msg.contentType === 15">
                <!--              <div class="file">-->
                <!--                <files :href="msg.content" download>{{ msg.content }}</files>-->
                <!--              </div>-->
                <downloadFile :fileUrl="msg.content" :file-name="msg.fileName" :file-size="msg.fileSize"
                              :is-large-file="msg.contentType===15"/>
              </el-card>
              <!--            发起语音聊天类型-->
              <el-button v-if="msg.contentType === 10"
                         style="color: dodgerblue; height: 50%;margin-block:10px auto; max-width: 80%;overflow: auto;word-break: break-word; margin-inline-end:10px;"
                         v-html="msg.content" @click="startAudioChat"></el-button>
              <div class="avatar-with-text" v-if="msg.sendID === state.user.uid">
                <el-avatar
                    :size="42"
                    :src="state.user.face_url"
                    :fit="cover"
                    @click="showUserInfo(msg.sendID)"
                >{{ msg.senderNickname }}
                </el-avatar>
                <span>{{ msg.senderNickname }}</span>
              </div>
            </el-row>
        </div>
      </ul>
    </el-scrollbar>
  </div>
  <el-dialog v-model="showSelf" style="width: auto;max-width: 600px">
    <self_info/>
  </el-dialog>
  <el-dialog v-model="showUser" style="width: auto;max-width: 600px">
    <user_info :uid="showUid"/>
  </el-dialog>
  <el-dialog v-model="showGroup" style="width: auto;max-width: 800px">
    <group_info :group_id="showGroupUid"/>
  </el-dialog>
</template>

<script>
import {ElScrollbar, ElCard} from "element-plus";
import {watchEffect, ref, inject, nextTick, computed, watch, reactive} from 'vue';
import {getChatId, state} from "../../store/state.js";
import Self_info from "../info/self_info.vue";
import User_info from "../info/user_info.vue";
import axios from "axios";
import {rootAddr} from "../../router/index.js";
import {Files} from "@element-plus/icons-vue";
import DownloadFile from "../views/downloadFile.vue";
import Group_info from "../info/group_info.vue";

export default {
  components: {
    Group_info,
    DownloadFile,
    Files,
    User_info,
    Self_info,
    ElScrollbar,
    ElCard
  },
  name: "chat_content",
  data() {
    return {
      state,
      showSelf: false,
      showUser: false,
      showGroup: false,
      showUid: state.user.uid,
      showGroupUid: state.ShowGroupId
    }
  },
  emits: ['startAudioChat'],
  methods: {
    showUserInfo(id) {
      this.showUid = id
      console.log("this.showUid:", id)
      if (id == state.user.uid) {
        console.log("self:", id)
        this.showSelf = true
      } else {
        console.log("user:", id)
        this.showUser = true
      }
    },
    showGroupInfo(id) {
      this.showGroupUid = id
      console.log("this.showGroupUid:", id)
      this.showGroup = true
    },

  },
  setup(props, context) {
    const msgList = ref([])
    console.log("state", state)
    // 监听 ShowGroupId、ShowFriendId 和 isGroup 这三个变量和它们对应的属性值是否发生改变
    watch([() => state.ShowGroupId, () => state.ShowFriendId, () => state.isGroup, () => state.Record.get(state.ShowGroupId)?.length, () => state.Record.get(getChatId(state.ShowFriendId, state.user.uid))?.length], ([groupId, friendId, isGroup, groupMsgLength, friendMsgLength]) => {
      if (isGroup) {
        if (groupMsgLength !== undefined && state.Record.has(groupId)) {
          msgList.value = state.Record.get(groupId)
          console.log("消息队列：", msgList)
          return;
        }
        msgList.value = []
      } else {
        let chatId = getChatId(state.ShowFriendId, state.user.uid)
        if (friendMsgLength !== undefined && state.Record.has(chatId)) {
          msgList.value = state.Record.get(chatId)
          console.log("消息队列：", msgList)
          return;
        }
        msgList.value = []
      }
    }, {immediate: true})

    function startAudioChat() {
      console.log("startAudioChat")
      context.emit('startAudioChat')
    }

    return {
      msgList,
      startAudioChat
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

.xian_select_name:hover {
  color: aqua;
}

</style>