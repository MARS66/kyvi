/*
 * @Description:
 * @Author: Kevin
 * @Date: 2024-10-30 09:29:47
 * @LastEditors: Kevin
 * @LastEditTime: 2024-10-30 15:54:10
 */
import view from './cobweb-view.vue';

view.install = function(Vue) {
  Vue.component(view.name, view);
};

export default view;
