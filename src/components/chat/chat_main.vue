<template>
  <div class="chat_main" style="height: 100vh;width: 100vw; display: flex; flex-direction: column;">
    <el-container style="display: flex">
      <el-header style="width: 100%; height: 60px; display: table">
        <chat-header/>
      </el-header>
      <el-container style="width: 100%; height: calc(100vh - 160px); ">
        <el-aside style="width:auto; resize: horizontal; overflow: hidden; cursor: ew-resize;">
          <div>
            <div v-if="state.isGroup">
              <chat_group_list/>
            </div>
            <div v-if="!state.isGroup">
              <chat_friend_list/>
            </div>
          </div>
          <div v-if="state.addReqList.size!=0" style="height: 60px">
            <el-button @click="showAddReq=true">添加请求</el-button>
          </div>
        </el-aside>
        <el-container style="width: 80%;">
          <el-main style="overflow-y: hidden">
            <chat_content @startAudioChat="startRecording"/>
          </el-main>
        </el-container>
      </el-container>
      <el-footer style="height: 60px;" v-if="state.isGroup?state.groupList.length>0:state.friendList.length>0">
        <div>
          <!-- 录音的按钮 -->
          <el-button type="primary" size="small" @click="startRecording" v-if="!isRecording">
            发起语音通话
          </el-button>
          <el-button type="danger" size="small" @click="stopRecording" v-if="isRecording">
            结束语音通话
          </el-button>
        </div>
        <el-input @paste="handlePaste" v-model="state.inputMsg" placeholder="请输入消息"
                  style="width: 80%;"></el-input>
        <el-button type="primary" @click="sendMessage" style="width: 20%;">发送</el-button>
      </el-footer>
      <div> <!-- 新增加的 div 标签 -->
        <el-dialog v-model="showAddReq">
          <add_req/>
        </el-dialog>
      </div>
    </el-container>
  </div>

</template>


<script>
import Chat_friend_list from "./chat_friend_list.vue";
import {state, getChatId} from "../../store/state.js";
import {useRoute} from "vue-router";
import {nextTick, onMounted, ref, watchEffect} from "vue";
import axios from "axios";
import Chat_group_list from "./chat_group_list.vue";
import Chat_content from "./chat_content.vue";
import {pb_msg} from '/src/proto/pb_msg/pb_msg.pb.js';
import ChatHeader from "./chat-header.vue";
import {rootAddr} from "../../router/index.js";
import Add_req from "../views/add_req.vue";
import {ElMessage, ElMessageBox} from "element-plus";
import Recorder from 'js-audio-recorder'


// 全局添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前添加token
  config.headers['token'] = state.token;
  return config;
}, function (error) {
  // 对请求错误做些什么
  return error;
});

export default {
  name: "chat_main",
  components: {Add_req, ChatHeader, Chat_content, Chat_group_list, Chat_friend_list},
  data() {
    return {
      state,
      showAddReq: false,
    }
  },
  setup() {
    const websocket = ref(null);

    onMounted(() => {
      // console.log("user", localStorage.getItem("la_user"))
      // console.log("state.user", state.user)
      let server_addr_list = []
      //获取链接池服务器地址
      axios.get(`http://${rootAddr}/services/ws/list`).then(res => {
        // console.log("data:", res.data)
        server_addr_list = res.data.data.ws_addr_list
        // console.log("server_addr_list:", server_addr_list)
        let url = `ws://${server_addr_list[0]}/ws?send_id=${state.user.uid}&token=${state.token}`;
        // console.log("链接url:", url)
        websocket.value = new WebSocket(url);
        //设定接收到的数据类型
        websocket.value.binaryType = 'arraybuffer';
        //在接收到服务器的消息时触发
        websocket.value.onmessage = async (event) => {
          const msg = pb_msg.Msg.decode(new Uint8Array(event.data));
          //忽视发送失败的消息
          if (msg.status != 1) {
            return
          }
          // console.log("返回消息解析得：", msg)
          msg.senderFaceURL = state.saveUsersFaceUrl.get(msg.sendID)
          if (msg.senderFaceURL == undefined) {
            let res = await axios.get(`http://${rootAddr}/user_not/user_face_url?uid=${msg.sendID}`)
            if (res.data.code == 0) {
              msg.senderFaceURL = res.data.data
              state.saveUsersFaceUrl.set(msg.sendID, msg.senderFaceURL)
            }
          }
          let chatId=msg.groupID
          //单聊
          if (msg.sessionType == 0) {
            chatId = getChatId(msg.sendID, msg.recvID)
          }
          if (!state.Record.has(chatId)) {
            state.Record.set(chatId, [])
          }
          let index=state.Record.get(chatId).length

          // console.log("开始获取文件url")
          switch (msg.contentType) {
            case 2:
            case 3:
            case 4:
            case 5:
              console.log("从消息拉取文件url")
              msg.content = URL.createObjectURL(new Blob([msg.file]))
              break;
            case 9:
              //只有在设置为录音状态时才接收语音消息
              if (isRecording) {
                // //如果是自己发送的消息则忽视
                if (msg.sendID == state.user.uid) {
                  return
                }
                // console.log("接收到语音消息,", msg)
                audioDataList.value.push(URL.createObjectURL(new Blob([msg.file])));
              }
              return;

            case 12:
            case 13:
            case 14:
            case 15:
              console.log("从oss拉取文件url:", msg.content)
              let res = await axios.get(msg.content)
              if (res.data.code == 0) {
                msg.content = res.data.data
              }
              break;
            default:
              break;
          }
          console.log("结束获取文件url")
          console.log("msg:", msg)
          console.log("state.Record.get(chatId):", state.Record.get(chatId))
          state.Record.get(chatId).splice(index, 0, msg)
        };
      }).catch(err => {
        alert(`链接出错：${err}`)
      })
      //获取别人添加自己的添加请求
      axios.get(`http://${rootAddr}/add_req/self`).then(
          res => {
            console.log("获取别人添加自己的添加请求:", res.data)
            if (res.data.code == 0) {
              res.data.data.forEach(item => {
                state.addReqList.set(item.object_id, item)
                console.log(`获取别人添加自己的添加请求item：`, item)
              })
              console.log(`获取别人添加自己的添加请求2：`, state.addReqList)
            }
          }
      ).catch(err => {
        alert(`获取别人添加自己的添加请求出错：${err}`)
      })
    });

    const sendMessage = () => {
      let msg = pb_msg.Msg.create({
        sendID: state.user.uid,
        recvID: "",
        groupID: "",
        senderPlatformID: 1,
        senderNickname: state.user.nick_name,
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


    const isRecording = ref(false); // 是否正在录制
    const audioDataList = ref([]); // 录制后生成的音频数据
    let mediaRecorder = new Recorder({
      type: 'mp3',
      sampleRate: 16000,
      bitRate: 16,
      numChannels: 1,
      compiling: true,
    });
    let timerId; // 定时器 ID
    let audio_recv_id = state.user.uid; // 接收者 ID
    const startRecording = () => {
      isRecording.value = true;

      if (state.isGroup) {
        audio_recv_id = state.ShowGroupId
      } else {
        audio_recv_id = state.ShowFriendId
      }

      let msg = pb_msg.Msg.create({
        sendID: state.user.uid,
        recvID: "",
        groupID: "",
        senderPlatformID: 1,
        senderNickname: state.user.nick_name,
        senderFaceURL: state.user.face_url,
        sessionType: 0,
        msgFrom: 1,
        contentType: 10,//发起语音聊天类型
        content: "开始语音聊天",
        seq: 0,
        sendTime: Date.now(),
        status: 0,
      });
      if (state.isGroup) {
        msg.groupID = audio_recv_id
        msg.sessionType = 1
      } else {
        msg.recvID = audio_recv_id
        msg.sessionType = 0
      }
      websocket.value.send(pb_msg.Msg.encode(msg).finish());

      mediaRecorder = new Recorder({
        type: 'mp3',
        sampleRate: 16000,
        bitRate: 16,
        numChannels: 1,
        compiling: true,
      });

      // console.log("开始录音")
      mediaRecorder.start();

      // 每秒传输一次数据到接收端
      timerId = setInterval(() => {
        sendChunksToReceiver();
        playAudio()
      }, 1000);


    };
    const sendChunksToReceiver = () => {
      console.log("开始传输录音")
      let blob = mediaRecorder.getWAVBlob()
      // let blob = mediaRecorder.value.getNextData()
      mediaRecorder.start()
      // console.log("blob:", blob)
      // TODO: 将每秒的录音数据块通过网络传输或保存到数据库中
      let msg = pb_msg.Msg.create({
        sendID: state.user.uid,
        recvID: "",
        groupID: "",
        senderPlatformID: 1,
        senderNickname: "",
        senderFaceURL: "",
        sessionType: 0,
        msgFrom: 1,
        contentType: 9,//语音聊天类型
        content: URL.createObjectURL(blob),
        seq: 0,
        sendTime: Date.now(),
        status: 0,
      });
      if (state.isGroup) {
        msg.groupID = audio_recv_id
        msg.sessionType = 1
      } else {
        msg.recvID = audio_recv_id
        msg.sessionType = 0
      }

      const fileReader = new FileReader();
      fileReader.onload = () => {
        const arrayBuffer = fileReader.result;
        msg.file = new Uint8Array(arrayBuffer);
      };

      fileReader.onloadend = () => {
        console.log("开始发送语音消息:", msg)
        let ms =pb_msg.Msg.encode(msg).finish()
        websocket.value.send(ms);
        console.log("实际发送解析:", pb_msg.Msg.decode(ms))
        // console.log("发送消息成功:", msg)
      };
      fileReader.readAsArrayBuffer(blob);
    };
    const stopRecording = () => {
      isRecording.value = false;
      clearInterval(timerId);
      mediaRecorder.stop();
      sendChunksToReceiver(); // 最后一次传输数据
      let msg = pb_msg.Msg.create({
        sendID: state.user.uid,
        recvID: "",
        groupID: "",
        senderPlatformID: 1,
        senderNickname: state.user.nick_name,
        senderFaceURL: state.user.face_url,
        sessionType: 0,
        msgFrom: 1,
        contentType: 10,//发起语音聊天类型
        content: "退出语音聊天",
        seq: 0,
        sendTime: Date.now(),
        status: 0,
      });
      if (state.isGroup) {
        msg.groupID = audio_recv_id
        msg.sessionType = 1
      } else {
        msg.recvID = audio_recv_id
        msg.sessionType = 0
      }
      websocket.value.send(pb_msg.Msg.encode(msg).finish());
    };


    const playAudio = () => {
      // console.log("开始播放录音,", audioDataList)
      if (audioDataList.value.length <= 0) {
        return
      }
      const audio = new Audio(audioDataList.value.pop());
      audio.play();
    };

    return {
      sendMessage,
      websocket,
      mediaRecorder,
      startRecording,
      stopRecording,
      playAudio,
      isRecording,
      audioDataList
    };
  },
  methods: {
    handlePaste(event) {
      const clipboardData = event.clipboardData;
      const items = clipboardData.items;
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.kind === 'file') {
          const file = item.getAsFile();
          let msg = pb_msg.Msg.create({
            sendID: state.user.uid,
            recvID: "",
            groupID: "",
            senderPlatformID: 1,
            senderNickname: state.user.nick_name,
            senderFaceURL: state.user.face_url,
            sessionType: 0,
            msgFrom: 1,
            contentType: 5,
            content: "",
            fileName: file.name,
            fileSize: file.size,
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
          let tiShi = "文件"
          // 判断文件类型
          if (file.type.startsWith('image/')) {
            msg.contentType = 2
            if (file.size > 1024 * 1024 * 15) {
              msg.contentType = 12
            }
            tiShi = "图片"
            console.log('这是一张图片');
          } else if (file.type.startsWith('audio/')) {
            msg.contentType = 3
            if (file.size > 1024 * 1024 * 15) {
              msg.contentType = 13
            }
            tiShi = "音频"
            console.log('这是一段音频');
          } else if (file.type.startsWith('video/')) {
            msg.contentType = 4
            if (file.size > 1024 * 1024 * 15) {
              msg.contentType = 14
            }
            tiShi = "视频"
            console.log('这是一个视频');
          } else {
            msg.contentType = 5
            if (file.size > 1024 * 1024 * 15) {
              msg.contentType = 15
            }
            tiShi = "文件"
            // console.log('这是其他文件');
          }

          // console.log("准备发送", msg)
          ElMessageBox.confirm(
              '是否发送' + tiShi + '？',
              '提示',
              {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }
          ).then(
              async () => {
                //发送文件
                //如果文件大小超过15M，改为使用阿里云的oss保存
                if (file.size <= 1024 * 1024 * 15) {
                  // 创建FileReader对象
                  let reader = new FileReader();
                  // 定义读取文件时触发的回调函数
                  reader.onload = function (event) {
                    // 获取读取的文件内容（以Blob的形式）
                    msg.file = new Uint8Array(event.target.result);
                    // 调用protobuf中的bytes类型进行传输
                  };
                  reader.onloadend = () => {
                    this.websocket.send(pb_msg.Msg.encode(msg).finish());
                  }
                  // 读取文件内容（以Blob的形式）
                  reader.readAsArrayBuffer(file)
                  return
                }
                const formData = new FormData();

                formData.append('file', file);
                formData.append('file_size', file.size);

                let response = await axios.post('http://127.0.0.1:3001/chat_log/file', formData, {
                  headers: {
                    'Content-Type': 'multipart/form-data'
                  }
                })
                if (response.data.code == -1) {
                  ElMessage.error("发送文件失败：", response.data.msg)
                  return
                }
                //直接存放文件url
                msg.content = `http://${rootAddr}/chat_log/file?uid=${msg.sendID}&file_name=${encodeURIComponent(response.data.data)}`
                // console.log("开始发送文件:", msg)
                // console.log("发送文件二进制", pb_msg.Msg.encode(msg).finish())
                this.websocket.send(pb_msg.Msg.encode(msg).finish());
                // console.log("发送文件成功:", msg)
                let newMsg = pb_msg.Msg.decode(pb_msg.Msg.encode(msg).finish())
                // console.log("解析压缩后的文件:", newMsg)
                // console.log("发送文件成功")

                // 滚动到底部
                await nextTick(() => {
                  const scrollbar = document.getElementsByClassName('el-scrollbar__wrap')[0];
                  scrollbar.scrollTop = scrollbar.scrollHeight;
                });
              }
          ).catch(
              err => {
                ElMessage({
                  type: 'info',
                  message: '取消发送' + err,
                })
                return
              }
          )

        }
      }
    },
  },
}
</script>

<style scoped>
.xian_select_name:hover {
  color: aqua;
}
</style>