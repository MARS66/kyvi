<!--
 * @Description: 
 * @Author: Kevin
 * @Date: 2023-10-31 17:14:18
 * @LastEditors: Kevin
 * @LastEditTime: 2024-09-26 15:48:22
-->
<template>
  <div class="app-page">
    <Header />
    <div class="designer">
      <Graphics />
      <Editor />
      <Props />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from "vue";
import Header from "@/components/Header";
import Graphics from "@/components/Graphics";
import Editor from "@/components/Editor";
import Props from "@/components/Props";
import { MessagePlugin } from "tdesign-vue-next";
import { useRoute } from "vue-router";

const uRoute = useRoute()
const STORE_KEY=''+uRoute.query.projectId
let timer: any;
function save() {
  if (timer) {
    clearTimeout(timer);
  }
  timer = setTimeout(() => {
    const data: any = cobweb.data();
    localStorage.setItem(STORE_KEY, JSON.stringify(data));
    timer = undefined;
  }, 1000);
}
onMounted(() => {
  cobweb.on("scale", save);
  cobweb.on("add", save);
  cobweb.on("opened", save);
  cobweb.on("undo", save);
  cobweb.on("redo", save);
  cobweb.on("add", save);
  cobweb.on("delete", save);
  cobweb.on("rotatePens", save);
  cobweb.on("translatePens", save);
  //js监听键盘ctrl+s快捷键保存
  document.addEventListener('keydown', function(e){
      if (e.keyCode == 83 && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)){
          e.preventDefault();
        const data: any = cobweb.data();
        localStorage.setItem(STORE_KEY, JSON.stringify(data));
        const arr = JSON.parse(localStorage.getItem('PROJECTS') ?? '[]').map((element:any) => {
          if (`${element.id}` === STORE_KEY) {
            element.thumbnail= cobweb.canvas.toPng()
          }
          return element
        });
        localStorage.setItem('PROJECTS', JSON.stringify(arr));
        MessagePlugin.success("已保存");
      }
  });
});
</script>

<style lang="postcss" scoped>
.app-page {
  height: 100vh;
  overflow: hidden;
  background-color: #191c21;
  .designer {
    display: grid;
    grid-template-columns: 300px 1fr 301px;
    height: calc(100vh - 80px);
  }
}
</style>
