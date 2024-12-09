<!--
 * @Description: 
 * @Author: Kevin
 * @Date: 2024-08-16 14:20:47
 * @LastEditors: Kevin
 * @LastEditTime: 2024-10-17 09:18:21
-->
<template>
  <div class="props-panel">
    <t-space direction="vertical">
      <t-collapse :default-value="[0, 1, 2]" expand-icon-placement="right">
        <t-collapse-panel header="基础属性">
          <BaseAttr></BaseAttr>
        </t-collapse-panel>
        <t-collapse-panel header="样式属性" v-if="brush.name!=='image'">
          <StyleAttr></StyleAttr>
        </t-collapse-panel>
        <t-collapse-panel header="线条属性" v-if="brush.name==='line'">
          <LineAttr></LineAttr>
        </t-collapse-panel>
        <t-collapse-panel header="文字属性" v-if="showTextAttr()">
          <TextAttr></TextAttr>
        </t-collapse-panel>
      </t-collapse>
    </t-space>
  </div>
</template>

<script lang="ts" setup>
import useBrush from '@/Hooks/useBrush'
import BasicTypes from '@/static/Basic';
import BaseAttr from './src/BaseAttr.vue';
import StyleAttr from './src/StyleAttr.vue';
import LineAttr from './src/LineAttr.vue';
import TextAttr from './src/TextAttr.vue';
const { brush } = useBrush()
function showStyleAttr() {
  return BasicTypes.list.some((item) => brush.value.name !=='text' && item.data.name === brush.value.name)
}
function showTextAttr() {
  return brush.value.name==='text' || BasicTypes.list.some((item)=>item.data.name === brush.value.name)
}
</script>
<style lang="postcss" scoped>
  @import url("../common.postcss");
</style>
