<!--
 * @Description: 
 * @Author: Kevin
 * @Date: 2024-05-11 15:56:07
 * @LastEditors: Kevin
 * @LastEditTime: 2024-08-30 16:31:35
-->
<template>
  <svg
    aria-hidden="true"
    class="svg-icon"
    :style="{ height: size, width: size,fill:color }"
  >
    <use :xlink:href="symbolId"></use>
  </svg>
</template>

<script setup lang="ts">
import { computed } from "vue";
const props = defineProps({
  //图标大小
  size: {
    type: [Number, String],
    default: "16px",
  },
  //图标前缀，默认icon
  prefix: {
    type: String,
    default: "icon",
  },
  color: {
    type: String,
    default: "#fff",
  },
  //图标名称
  name: {
    type: String,
    default: "",
  },
});
const symbolId = computed(() => `#${props.prefix}-${props.name}`);
</script>
<style scoped>
svg {
  fill: var(--color);
}
</style>
