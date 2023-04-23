<template>
  <div style="max-width: 800px">
    <el-card>
      <div style="display: flex; flex-wrap: wrap;">
        <el-text><span>群ID：{{ info.group_id }}</span></el-text>
      </div>
      <div style="display: flex; flex-wrap: wrap;">
        <el-text><span>群名：{{ info.group_name }}</span></el-text>
      </div>
      <div style="display: flex; flex-wrap: wrap;">
        <el-text><span>群主：{{ info.owner_uid }}</span></el-text>
      </div>
      <el-card style="display:block">
        <span>管理员：</span>
        <el-menu style="max-height: 300px">
          <div v-for="adminer in info.admin" :key="adminer">
            <el-menu-item style="display: flex" @click="showUserInfo(adminer)">
              <el-text>{{
                  groupMemberInfoMap.get(adminer) == null ? null : groupMemberInfoMap.get(adminer).nick_name
                }}
              </el-text>
              <!--            //群主才有权限-->
              <div style="max-width: 150px;margin-inline-start: auto;margin-top: -30px;" v-if="GetIsGroupAdmin(state.user.uid)">
                <el-button style="margin-right: 10px" type="warning" size="small" @click.stop="handleRemoveAdmin(adminer)" v-if="!GetIsGroupOwner(adminer)">
                  移除权限
                </el-button>
              </div>
            </el-menu-item>
          </div>
        </el-menu>
      </el-card>
      <el-card style="display: block">
        <span>群员：</span>
        <el-menu style="max-height: 400px">
          <div v-for="uid in info.uid_list" :key="uid">
            <el-menu-item style="display: flex" @click="showUserInfo(uid)">
              <el-text>{{ groupMemberInfoMap.get(uid) == null ? null : groupMemberInfoMap.get(uid).nick_name }}</el-text>
              <div style="max-width: 150px;margin-inline-start: auto;margin-top: -30px;" v-if="GetIsGroupAdmin(state.user.uid)">
                <el-button style="margin-right: 10px" type="success" size="small" @click.stop="handleAddAdmin(uid)" v-if="!GetIsGroupAdmin(uid)">
                  设管理员
                </el-button>
<!--                得先移除管理员权限-->
                <el-button style="margin-right: 10px" type= "danger" size="small" @click.stop="handleRemoveMember(uid)" v-if="!GetIsGroupAdmin(uid)">
                  移除群员
                </el-button>
              </div>
            </el-menu-item>
          </div>
        </el-menu>
      </el-card>
      <el-button type="primary" @click="joinGroup" v-if="!GetIsGroupMember(state.user.uid)">申请加入</el-button>
      <el-button type="danger" @click="quitGroup" v-if="GetIsGroupMember(state.user.uid)">退出群组</el-button>
    </el-card>
  </div>
  <el-dialog v-model="showUser" :key="showUid" style="width: auto;max-width: 600px">
    <user_info :uid="showUid"/>
  </el-dialog>
</template>

<script>
import axios from "axios";
import {rootAddr} from "../../router/index.js";
import {ElMessage} from "element-plus";
import {onMounted, ref} from "vue";
import {state} from "../../store/state.js";
import User_info from "./user_info.vue";

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
  name: "group_info",
  components: {User_info},
  props: {
    group_id: {
      type: String,
      required: true
    }
  },
  data(){
    return{
      state
    }
  },
  methods: {
    joinGroup() {
      axios.post(`http://${rootAddr}/add_req/send_group?`, {"group_id": this.groupId}).then(res => {
        if (res.data.code == -1) {
          ElMessage.error(`申请加入群组失败${res.data.msg}`)
          return
        }
        ElMessage.success(`发送申请成功`)
      }).catch(
          err => {
            ElMessage.error(`申请加入群组失败${err}`)
          }
      )
    },
    quitGroup() {
      axios.delete(`http://${rootAddr}/group/self/remove`, {data:{"group_id": this.groupId}}).then(res => {
        if (res.data.code !=0) {
          ElMessage.error(`退出群组失败,${res.data.msg}`)
          return
        }
        state.groupList.splice(state.groupList.indexOf(this.groupId), 1)
        state.groupMap.delete(this.groupId)
        ElMessage.success(`退出群组成功`)

      }).catch(
          err => {
            ElMessage.error(`退出群组失败${err}`)
          }
      )
    },
    showUserInfo(uid) {

      this.showUid = uid
      this.showUser = true
      console.log("showUserInfo", this.showUid)
    },
    handleRemoveAdmin(uid) {
      axios.delete(`http://${rootAddr}/group/admin/del`, {data:{"group_id": this.groupId, "member_uid": uid}}).then(res => {
        if (res.data.code !=0) {
          ElMessage.error(`移除管理员失败,${res.data.msg}`)
          return
        }

        // for (let i = 0; i < this.info.admin.length; i++) {
        //   if (this.info.admin[i] == uid) {
        //     this.info.admin.splice(i, 1);
        //     break;
        //   }
        // }
        //直接刷新，保险点
        this.getGroupInfo()
        ElMessage.success(`移除管理员成功`)

      }).catch(
          err => {
            ElMessage.error(`移除管理员失败${err}`)
          }
      )
    },
    handleAddAdmin(uid) {
      axios.post(`http://${rootAddr}/group/admin/add`, {"group_id": this.groupId, "member_uid": uid}).then(res => {
        if (res.data.code  !=0) {
          ElMessage.error(`添加管理员失败,${res.data.msg}`)
          return
        }
        // this.info.admin.push(uid)
        //直接刷新，保险点
        this.getGroupInfo()
        ElMessage.success(`添加管理员成功`)
      }).catch(
          err => {
            ElMessage.error(`添加管理员失败${err}`)
          }
      )
    },
    handleRemoveMember(uid) {
      axios.delete(`http://${rootAddr}/group/member/del`, {data:{"group_id": this.groupId, "member_uid": uid}}).then(res => {
        if (res.data.code != 0) {
          ElMessage.error(`移除群员失败,${res.data.msg}`)
          return
        }
        // for (let i = 0; i < this.info.uid_list.length; i++) {
        //   if (this.info.uid_list[i] == uid) {
        //     this.info.uid_list.splice(i, 1);
        //     break;
        //   }
        // }
        //直接刷新，保险点
        this.getGroupInfo()
        ElMessage.success(`移除群员成功`)
      }).catch(
          err => {
            ElMessage.error(`移除群员失败${err}`)
          }
      )
    },
    GetIsGroupAdmin(uid) {
      return this.info.admin.includes(uid)
    },
    GetIsGroupOwner(uid) {
      return this.info.owner_uid == uid
    },
    GetIsGroupMember(uid) {
      return this.info.uid_list.includes(uid)
    },
  },
  setup(props) {
    const groupId = ref(props.group_id);
    const info = ref(state.groupMap.get(groupId.value) != null ? state.groupMap.get(groupId.value) : {
      group_id: groupId.value,
      group_name: "未知",
      owner_uid: "未知",
      admin: [],
      uid_list: []
    });
    const groupMemberInfoMap = ref(new Map());
    // const isGroupMember = ref(false);
    const showUser = ref(false);
    const showUid = ref("");
    // const isGroupAdmin = ref(false);
    // const isGroupOwner = ref(false);

    console.log("group_id", groupId.value)
    onMounted(async () => {
      await getGroupInfo()
    })

    const getGroupInfo = async function () {

      await axios.get(`http://${rootAddr}/group/info?group_id=${groupId.value}`).then(res => {
        if (res.data.code == -1) {
          ElMessage.error(`获取群组详情失败${res.data.msg}`)
          return
        }
        info.value = res.data.data
      }).catch(
          err => {
            ElMessage.error(`获取群组详情失败${err}`)
          }
      )// 获取用户信息
      // for (let i = 0; i < info.value.admin.length; i++) {
      //   if (info.value.admin[i] == state.user.uid) {
      //     isGroupAdmin.value = true
      //   }
      // }
      // if (info.value.owner_uid == state.user.uid) {
      //   isGroupOwner.value = true
      // }
      // for (let i = 0; i < info.value.uid_list.length; i++) {
      //   if (info.value.uid_list[i] == state.user.uid) {
      //     isGroupMember.value = true
      //   }
      // }
      for (let i = 0; i < info.value.uid_list.length; i++) {
        if (state.friendMap.get(info.value.uid_list[i]) == null) {
          await axios.get(`http://${rootAddr}/user/user_show_info?uid=${info.value.uid_list[i]}`).then(res => {
            if (res.data.code == -1) {
              ElMessage.error(`获取用户信息失败${res.data.msg}`)
              return
            }
            groupMemberInfoMap.value.set(info.value.uid_list[i], res.data.data)
          }).catch(
              err => {
                ElMessage.error(`获取用户信息失败${err}`)
              }
          )// 获取用户信息
        } else {
          groupMemberInfoMap.value.set(info.value.uid_list[i], state.friendMap.get(info.value.uid_list[i]))
        }
      }
      console.log("groupMemberInfoMap", groupMemberInfoMap.value)

    }
    return {
      groupId,
      info,
      groupMemberInfoMap,
      // isGroupMember,
      // isGroupAdmin,
      // isGroupOwner,
      showUser,
      showUid,
      getGroupInfo,
    };
  }
}
</script>

<style scoped>

</style>