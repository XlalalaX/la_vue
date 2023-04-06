<template>
  <el-menu mode="horizontal">
    <el-menu-item @click="changePage('friend')">
      {{ "好友" }}
    </el-menu-item>
    <el-menu-item @click="changePage('group')">
      {{ "群组" }}
    </el-menu-item>
  </el-menu>
</template>

<script>
import {state} from "../../store/state.js";

export default {
  name: "chat-header",
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