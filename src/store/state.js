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
})

export function getChatId(s1, s2) {
    if (s1 < s2) {
        return s1 + "_" + s2
    }
    return s2 + "_" + s1
}

export function str_to_array(str) {
    const short_str_to_array=function (ss){
        var arr = new Uint8Array(ss.length*2);
        for (var i = 0, l = ss.length; i < l; i++) {
            var charCode = ss.charCodeAt(i);
            if (charCode > 255) {
                // 如果字符编码大于 255，需要使用多个字节表示
                var bytes = encodeURI(ss[i]).split('%').slice(1);
                for (var j = 0; j < bytes.length; j++) {
                    arr[i + j] = parseInt(bytes[j], 16);
                }
                i += bytes.length - 1;
            } else {
                arr[i] = charCode;
            }
        }
        return arr;
    }
    var arr = new Uint8Array(str.length);
    var chunkSize = 1024;
    for (var i = 0, len = str.length; i < len; i += chunkSize) {
        var chunk = str.substr(i, chunkSize);
        var subArr = short_str_to_array(chunk);
        arr.set(subArr, i);
    }
    return arr
}

