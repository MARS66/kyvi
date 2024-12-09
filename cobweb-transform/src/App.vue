<!--
 * @Description: 
 * @Author: Kevin
 * @Date: 2024-10-18 11:07:21
 * @LastEditors: Kevin
 * @LastEditTime: 2024-10-30 09:23:53
-->
<template>
  <div id="app">
    <ws-button />
    <br />
    <br />
    <br />
    <ws-card />
    <!-- <HelloWorld :cobweb="cobweb" @event="handlerEvent" /> -->
    <!-- <cobweb-editor  :cobweb="cobweb" @event="handlerEvent"/> -->
    <!-- <c-preview  :cobweb="cobweb" @event="handlerEvent"/> -->
  </div>
</template>

<script>
// import HelloWorld from './package/Editor'
// import HelloWorld from "./package/Preview";
import xt from "@/utils/xxtea";

export default {
  name: "App",
  components: {
    // HelloWorld,
  },
  computed: {
    cobweb() {
      const json = localStorage.getItem("cobweb");
      return xt.xxtea_encrypt(json);
    },
  },
  mounted() {},
  methods: {
    handlerEvent(e) {
      alert("组件触发" + e.type + "事件，绑定点位：" + e.id);
    },
  },
};
</script>

<style>
html,
body {
  margin: 0;
  padding: 0;
  background-color: #222;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100vh;
}
</style>
