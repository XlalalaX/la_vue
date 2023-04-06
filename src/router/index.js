import {createRouter, createWebHashHistory, createWebHistory} from "vue-router";
import login from "../components/login.vue";
import chat_friend_list from "../components/chat/chat_friend_list.vue";
import chat_main from "../components/chat/chat_main.vue";

const routes = [
    {path: '/', name: 'login', component: login},
    {
        path: "/chat_friend",
        name: "chat_friend",
        component: chat_friend_list,
    }, {
        path: "/chat_main",
        name: "chat_main",
        component: chat_main
    }
];

export const router = createRouter({
    history: createWebHashHistory('/'),
    routes,
})

export const rootAddr = "127.0.0.1:3001"

export default {
    router,
    rootAddr
};