<template>
  <div class="chat-page">
    <el-scrollbar wrap-class="chat-window" ref="scrollbar">
      <ul>
        <li v-for="msg in msgList" :key="msg.sendTime">
          <el-card class="card" :class="{ 'from-me': msg.sendID }">
            <div class="info">{{ msg.senderNickname }}</div>
            <div class="content">{{ msg.content }}</div>
          </el-card>
        </li>
      </ul>
    </el-scrollbar>
  </div>
</template>

<script>
import {ElScrollbar,ElCard} from "element-plus";
import {watchEffect, ref, inject, nextTick, computed, watch, reactive} from 'vue';
import state from "../../store/state.js";

export default {
  components:{ElScrollbar,ElCard},
  name: "chat_content",
  setup(){
    const msgList=ref([])
    watch(()=>{
      if(state.Record.get(state.ShowFriendId)==null){
        return null
      }
      return state.Record.get(state.ShowFriendId).length
    },()=>{
      msgList.value=state.Record.get(state.ShowFriendId)
      // console.log("消息：",state.Record.get(state.ShowFriendId))
    })
    return{
      msgList
    }
  }
}

</script>

<style scoped>

</style>