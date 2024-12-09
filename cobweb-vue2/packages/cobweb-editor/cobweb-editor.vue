<!--
 * @Description:
 * @Author: Kevin
 * @Date: 2024-10-30 09:30:19
 * @LastEditors: Kevin
 * @LastEditTime: 2024-10-30 09:32:01
-->
<template>
  <div class="ws-button">这是通过npm安装的按钮</div>
</template>
<script>
export default {
  name: 'WsButton',
  components: {},
  data() {
    return {};
  },
  methods: {
    btnClick() {
      this.$emit('wsClick');
    }
  }
};
</script>

<style lang="scss" scoped>
@import url('./cobweb-editor.scss');
</style>
