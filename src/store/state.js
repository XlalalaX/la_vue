import {reactive} from 'vue'

export const state = reactive({
    // 将需要存储的全局数据添加到这里
    user: JSON.parse(localStorage.getItem("la_user")),
    token: localStorage.getItem("la_token"),
    Record: new Map(),
    ShowGroupId: "",
    ShowFriendId: "",
    inputMsg: "",
    isGroup: false,
    friendList:[],
    friendMap:new Map(),
    groupList:[],
    groupMap:new Map(),
    addReqList:new Map(),
    saveUsersFaceUrl:new Map(),
})

export function getChatId(s1, s2) {
    if (s1 < s2) {
        return s1 + "_" + s2
    }
    return s2 + "_" + s1
}

