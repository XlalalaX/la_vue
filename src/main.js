import { createApp } from 'vue'
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import './style.css';
import App from './App.vue';
import {router} from "./router/index.js";
const app = createApp(App)

app.use(router).use(ElementPlus).mount('#app')

export default app;