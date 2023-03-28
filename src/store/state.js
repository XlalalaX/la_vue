import { reactive } from 'vue'

const state = reactive({
    // 将需要存储的全局数据添加到这里
    user: JSON.parse(localStorage.getItem("la_user")),
    token:localStorage.getItem("la_token"),
    Record:new Map(),
    ShowGroupId:"",
    ShowFriendId:"",
    inputMsg:"",
    isGroup:false,
    MsgList:[],
})

export default state
