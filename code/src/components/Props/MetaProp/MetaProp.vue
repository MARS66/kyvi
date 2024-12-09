<!--
 * @Description: 
 * @Author: Kevin
 * @Date: 2023-10-31 17:14:18
 * @LastEditors: Kevin
 * @LastEditTime: 2024-09-20 13:58:41
-->
<template>
  <t-tabs :default-value="1">
    <t-tab-panel :value="1" label="属性">
      <AttrCombine></AttrCombine>
    </t-tab-panel>
    <t-tab-panel :value="2" label="动画" v-if="brush.type === PenType.Line">
      <AnimateAttr></AnimateAttr>
    </t-tab-panel>
    <t-tab-panel :value="3" label="事件">
      <Event></Event>
    </t-tab-panel>
    <t-tab-panel :value="6" label="数据" v-if="showTextAttr()">
      <Warn></Warn>
    </t-tab-panel>
    <t-tab-panel :value="4" label="图层">
      <Layer></Layer>
    </t-tab-panel>
  </t-tabs>
</template>

<script lang="ts" setup>
import BasicTypes from '@/static/Basic';
import { PenType } from "@kyvi/cobweb";
import useBrush from '@/Hooks/useBrush'
import AttrCombine from "./src/AttrCombine";
import AnimateAttr from "./src/AnimateAttr";
import Layer from "./src/Layer";
import Event from "./src/Event";
import Warn from "./src/Warn";
const { brush } = useBrush()
function showTextAttr() {
  return  BasicTypes.list.some((item)=>item.data.name === brush.value.name)
}
</script>
