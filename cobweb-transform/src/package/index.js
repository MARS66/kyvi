/*
 * @Description: 
 * @Author: Kevin
 * @Date: 2024-10-18 15:08:45
 * @LastEditors: Kevin
 * @LastEditTime: 2024-10-29 11:23:24
 */
//package/index.js
import CobwebPreview from "./Preview/Index.vue"; 
import CobwebEditor from "./Editor/Editor.vue"; 
const com = [CobwebPreview,CobwebEditor]; 

const install = function (Vue) { 
  com.forEach((com) => {
    Vue.component(com.name, com);
  });
};

export default install; 