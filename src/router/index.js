import {createRouter, createWebHashHistory, createWebHistory} from "vue-router";
import im_test from "../components/im_test.vue";
import im_home from "../components/im_home.vue";
import login from "../components/login.vue";
import chat_friend_list from "../components/chat/chat_friend_list.vue";
import chat_main from "../components/chat/chat_main.vue";

const routes = [
    {path: '/', name: 'login', component: login},
    {
        path: "/im_home",
        name: "im_home",
        component: im_home,
    },
    {
        path: "/im_chat",
        name: "im_chat",
        component: im_test,
        props: (route) => ({param: route.query.param}),
    },
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