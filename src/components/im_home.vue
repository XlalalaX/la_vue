<template>
  <el-form>
    <el-form-item label="send_id">
      <el-input v-model="userInfo.send_id" label="send_id" placeholder="send_id"></el-input>
    </el-form-item>
    <el-form-item label="token">
      <el-input v-model="userInfo.token" label="token" placeholder="token"></el-input>
    </el-form-item>
    <el-form-item label="recv_id">
      <el-input v-model="userInfo.recv_id" label="recv_id" placeholder="recv_id"></el-input>
    </el-form-item>
    <el-form-item label="group_id">
      <el-input v-model="userInfo.group_id" label="group_id" placeholder="group_id"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button @click="toChat">Go to Chat</el-button>
    </el-form-item>
    <el-form-item label="conten">
      <el-card v-if="conten.length!=0">
        <div v-html="conten"></div>
      </el-card>
      <el-input v-model="conten" label="conten" placeholder="conten"></el-input>
    </el-form-item>
  </el-form>
</template>

<script>
import {ElButton, ElForm, ElFormItem, ElInput} from "element-plus";
import {provide, reactive, watch} from "vue";
import {useRoute, useRouter} from 'vue-router';
import state from "../store/state.js";


export default {
  components: {
    ElForm,
    ElFormItem,
    ElInput,
    ElButton,
  },
  data(){
    return{
      conten:""
    }
  },
  setup() {
    // 使用 reactive() 创建响应式对象
    const userInfo = reactive({
      send_id: '',
      token: '',
      recv_id: '',
      group_id:'',
    })
    const route=useRouter()
    const toChat = () => {
      console.log(userInfo)
      route.push({name:'im_chat',query:userInfo})
    }
    watch(
        ()=>state.ShowFriendId,
        (id)=>{
          userInfo.recv_id=id
        }
    )
    // 返回响应式数据
    return {
      userInfo,
      toChat
    }
  },
}
</script>

<style scoped>
.connect-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.form {
  width: 400px;
  padding: 20px;
  border-radius: 5px;
  background-color: #f0f2f5;
}
</style>