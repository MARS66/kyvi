/*
 * @Description:
 * @Author: Kevin
 * @Date: 2024-10-30 08:56:45
 * @LastEditors: Kevin
 * @LastEditTime: 2024-10-30 16:47:22
 */
import Vue from 'vue';
import App from './App.vue';
import router from './router';
import '@examples/style/index.scss';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI);
Vue.config.productionTip = false;

new Vue({
  router,
  render: (h) => h(App)
}).$mount('#app');
