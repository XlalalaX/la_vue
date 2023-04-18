<!-- groupList.vue -->
<template>
  <div class="group-list">
    <el-menu :default-active="state.ShowGroupId">
      <el-menu-item v-for="id in state.groupList" :key="id" :index="id" @click="toChat(id)">
        <span class="xian_select_name">{{
            state.groupMap.get(id) == null ? null : state.groupMap.get(id).group_name
          }}</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
import axios from 'axios'
import {getCurrentInstance, onMounted, ref, watchEffect} from "vue";
import {ElMessage} from 'element-plus'
import {rootAddr, router} from "../../router/index.js";
import {getChatId, state} from "../../store/state.js";
import {pb_msg} from "../../proto/pb_msg/pb_msg.pb.js";

// 全局添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  config.headers['token'] = state.token;
  return config;
}, function (error) {
  // 对请求错误做些什么
  return error;
});

export default {
  name: "chat_group_list",
  data() {
    return {
      state
    }
  },
  computed: {},
  setup() {
    // const groupList = ref([]) // 定义 groupList 为响应式数据
    // const groupMap = ref(new Map)
    const getgroupList = async () => {
      try {
        const res = await axios.get(`http://${rootAddr}/group/self/list`)// 获取群组列表
        console.log(`rsp:`, res)
        if (res.data.code != 0) {
          ElMessage.error(`获取群组列表失败${res.data.msg}`)
          return
        }
        state.groupList = res.data.data.group_list
        if (state.groupList.length > 0) {
          for (let i = 0; i < state.groupList.length; i++) {
            if (state.groupList[i] != "") {
              state.ShowGroupId = state.groupList[i]
              break
            }
          }
        }else {
          ElMessage.warning(`您还没有群组`)
          return
        }
        console.log(`this.groupList:`, state.groupList)
        ElMessage.success(`获取群组列表成功`)
      } catch (err) {
        ElMessage(`获取群组列表错误${err}`)
      }

      try {
        for (let i = 0; i < state.groupList.length; i++) {
          const res = await axios.get(`http://${rootAddr}/group/info?group_id=${state.groupList[i]}`)// 获取好友列表
          if (res.data.code != 0) {
            ElMessage.error(`获取群组详情失败${res.data.msg}`)
            return
          }
          if (res.data.data.admin != null) {
            for (let j = 0; j < res.data.data.admin.length; j++) {
              if (res.data.data.admin[j] == state.user_id) {
                res.data.data.is_admin = true
                break
              }
            }
          }
          state.groupMap.set(state.groupList[i], res.data.data)
        }
      } catch (err) {
        ElMessage(`获取群组详情错误`, err)
      }

      // //获取所有自己有管理权限的群的申请消息
      // try {
      //   state.groupMap.forEach((value, key) => {
      //     axios.get(`http://${rootAddr}/add_req/group?group_id=${key}`).then(
      //         res => {
      //           if (res.data.code != 0) {
      //             ElMessage.error(`获取群组申请列表失败${res.data.msg}`)
      //             return
      //           }
      //           state.addReqList.set(res.data.data.object_id, res.data.data)
      //         }
      //     ).catch(err => {
      //       ElMessage(`获取群组${value.group_name}申请列表错误`, err)
      //     })
      //   })
      // } catch (err) {
      //   ElMessage(`获取群组申请列表错误`, err)
      // }
    }
    //获取历史消息记录
    const getChatLog = () => {
      console.log("获取群历史消息1", state.groupList)
      for (let i = 0; i < state.groupList.length; i++) {
        console.log("获取群历史消息2", state.groupList)
        //只更新已保存的消息小于10条的
        if (state.Record.get(state.groupList[i])?.length ?? 0 > 10) {
          continue
        }
        console.log("获取群历史消息3", state.groupList)
        axios.get(`http://${rootAddr}/chat_log/temp?chat_id=${state.groupList[i]}&chat_type=1`)
        console.log("获取群历史消息4", state.groupList)
        //     .then(res=>{
        //   const msgList=[]
        //   if(res.data.data.chat_msg?.length??0>0){
        //     for(let i=0;i<res.data.data.chat_msg.length;i++){
        //       //解析历史聊天记录
        //       const newMsg=pb_msg.Msg.decode(new Uint8Array(res.data.data.chat_msg[i].msg))
        //       newMsg.seq=msgList.length
        //       msgList.push(newMsg)
        //     }
        //     for(let j=0;j<state.Record.get(res.data.data.chat_id).length;j++){
        //       //排除所有发送时间小于现在时间的消息，合并消息列表
        //       if(msgList[msgList.length-1].sendTime<=state.Record.get(res.data.data.chat_id)[j].sendTime){
        //         if(msgList[msgList.length-1].sendTime<state.Record.get(res.data.data.chat_id)[j].sendTime){
        //           state.Record.get(res.data.data.chat_id)[j].seq=msgList.length
        //           msgList.push(state.Record.get(res.data.data.chat_id)[j])
        //         }else {
        //           //发送时间相同情况时全面比较
        //           if(msgList[msgList.length-1].content==state.Record.get(res.data.data.chat_id)[j].content
        //               &&msgList[msgList.length-1].file==state.Record.get(res.data.data.chat_id)[j].file){
        //             continue
        //           }else {
        //             state.Record.get(res.data.data.chat_id)[j].seq=msgList.length
        //             msgList.push(state.Record.get(res.data.data.chat_id)[j])
        //           }
        //         }
        //       }
        //     }
        //     //替换原本的
        //     state.Record.set(res.data.data.chat_id,msgList)
        //   }
        // }).catch(err=>{
        //   ElMessage(`获取好友历史聊天记录失败：${err}`)
        // })
      }
    }
    const getGroupAddReq = () => {
      //获取所有自己有管理权限的群的申请消息
      try {
        state.groupMap.forEach((value, key) => {
          axios.get(`http://${rootAddr}/add_req/group?group_id=${key}`).then(
              res => {
                console.log(`获取群组申请列表返回：`,res.data)
                if (res.data.code != 0) {
                  ElMessage.error(`获取群组申请列表失败${res.data.msg}`)
                  return
                }
                res.data.data.forEach(item => {
                  state.addReqList.set(res.data.data.object_id, item)
                })
              }
          ).catch(err => {
            ElMessage(`获取群组${value.group_name}申请列表错误`, err)
          })
        })
      } catch (err) {
        ElMessage(`获取群组申请列表错误`, err)
      }
    }
    onMounted(async () => {
      await getgroupList()
      await getChatLog()
      getGroupAddReq()
      //每小时更新一次所有群的申请请求
      setTimeout(() => {
        getGroupAddReq()
      }, 1000 * 60 * 60);
    });

    return {}
  },
  methods: {
    toChat(id) {
      state.ShowGroupId = id
    }
  },
}
</script>

<style scoped>
.xian_select_name:hover {
  color: aqua;
}
</style>