/*
 * @Description: 
 * @Author: Kevin
 * @Date: 2024-10-18 11:07:21
 * @LastEditors: Kevin
 * @LastEditTime: 2024-10-29 15:15:04
 */
import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import './style.css'
import 'element-ui/lib/theme-chalk/index.css';
import "../node_modules/cobweb-preview/cobweb-preview.css";
import cobwebUI from 'cobweb-vue2'

Vue.config.productionTip = false;
Vue.use(ElementUI)
Vue.use(cobwebUI)
new Vue({
  render: h => h(App),
}).$mount('#app')
