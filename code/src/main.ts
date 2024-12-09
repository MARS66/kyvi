/*
 * @Description:
 * @Author: Kevin
 * @Date: 2023-10-31 17:14:18
 * @LastEditors: Kevin
 * @LastEditTime: 2024-09-20 15:51:23
 */
import { createApp } from "vue";
import App from "./App.vue";
import "./style.css";
import "@/styles/index.css";
// 本地SVG图标
import "virtual:svg-icons-register";
import router from "./router.ts";
import TDesign from "tdesign-vue-next";
import NaiveUI from "naive-ui";
import { createPinia } from 'pinia'

const app = createApp(App);
document.documentElement.setAttribute("theme-mode", "dark");
// 加载基础服务
app.use(router);
app.use(TDesign);
app.use(NaiveUI);
  app.use(createPinia());

// end
app.mount("#app");
