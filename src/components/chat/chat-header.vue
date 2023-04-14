<template>
  <div style="margin: auto">
    <el-menu mode="horizontal" :default-active="selectPage">
      <el-menu-item  index="friend" @click="changePage('friend')">
        {{ "好友" }}
      </el-menu-item>
      <el-menu-item index="group" @click="changePage('group')">
        {{ "群组" }}
      </el-menu-item>
      <el-menu-item @click="showFind=true">
        {{"搜索"}}
      </el-menu-item>
    </el-menu>
  </div>
  <el-dialog v-model="showFind">
    <find/>
  </el-dialog>
</template>

<script>
import {state} from "../../store/state.js";
import Find from "../views/find.vue";

export default {
  name: "chat-header",
  components: {Find},
  data(){
    return {
      selectPage:"friend",
      showFind:false,
    }
  },
  methods: {
    changePage(s) {
      switch (s) {
        case "friend":
          state.isGroup = false;
          break;
        case "group":
          state.isGroup = true;
          break;
      }
    }
  }
}
</script>

<style scoped>

</style>