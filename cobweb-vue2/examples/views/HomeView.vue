<!--
 * @Description:
 * @Author: Kevin
 * @Date: 2024-10-30 08:56:45
 * @LastEditors: Kevin
 * @LastEditTime: 2024-10-30 16:08:30
-->
<template>
  <div class="home">
    <cobweb-view :cobweb="cobweb" />
  </div>
</template>

<script>
import CobwebView from '@packages/cobweb-view/cobweb-view.vue';
import xt from '../../packages/utils/xxtea';
export default {
  name: 'HomeView',
  components: {
    CobwebView
  },
  computed: {
    cobweb() {
      const json = localStorage.getItem('cobweb');
      return xt.xxtea_encrypt(json);
    }
  },
  mounted() {},
  methods: {
    handlerEvent(e) {
      alert('组件触发' + e.type + '事件，绑定点位：' + e.id);
    }
  }
};
</script>
<style lang="scss" scoped>
.home {
  width: 100%;
}
</style>
