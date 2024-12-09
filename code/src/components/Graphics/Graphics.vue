<template>
  <div class="graphics">
    <t-collapse :defaultExpandAll="false"
    :onChange="changeState" 
    >
      <t-collapse-panel
        :header="item.name"
        v-for="item in iconList"
        :key="item.name" 
      >
        <template v-for="elem in item.list">
          <div
            class="graphic"
            :draggable="true"
            :title="elem.name"
            @dragstart="dragStart($event, elem)"
            @click.prevent="dragStart($event, elem)"
          >
            <template v-if="item.name === '基本形状'">
              <svg class="l-icon" aria-hidden="true">
                <use :xlink:href="'#' + elem.icon"></use>
              </svg>
            </template>
            <template v-else>
              <img style="height: 25px; width: 25px" :src="elem.image" />
            </template>
          </div>
        </template>
      </t-collapse-panel>
    </t-collapse>
  </div>
</template>

<script lang="ts" setup>
import axios from "axios";
import {  onMounted,reactive } from "vue";
import {  defaultIcons } from "@/data/default"; 
import { getOtherIcons,svgToPens,pngToPens} from "@/data/icon";

async function changeState(arr:any) {
  const tab: any = iconList[arr[arr.length - 1]];
  if(tab&&tab.folder){
    if(!tab.loaded){
      const { data: files } = await axios.get(tab.path)
      tab.loaded = true
      if(tab.svg){
        const fs = await Promise.all(files.map((f: any) => svgToPens(f, tab.name)))
        tab.list = fs
      }else{
        const fs = await Promise.all(files.map((f:any)=>pngToPens(f,tab.name)))
        tab.list = fs
      }
    }
  }
}
let iconList =reactive([...defaultIcons])
onMounted(async () => {
  const icons = await getOtherIcons()
  iconList.push(...icons.flat(2))
})
// 拖动 拖拽
const dragStart = (e: any, elem: any) => {
  if (!elem) {
    return;
  }
  e.stopPropagation();
  // 拖拽事件
  if (e instanceof DragEvent) {
    // 设置拖拽数据
    e.dataTransfer?.setData("Meta2d", JSON.stringify(elem.data));
  } else {
    // 支持单击添加图元。平板模式
    cobweb.canvas.addCaches = [elem.data];
  }
};
</script>
<style lang="postcss" scoped>
.graphics {
  overflow-y: auto;
  border-right: 1px solid var(--color-border);
  background-color: #191c21;
  z-index: 2;
  :deep(.t-collapse) {
    border-top: none;

    .t-collapse-panel__content {
      background-color: var(--color-background-active);
      padding: 20px 4px;
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 5px 12px;
    }

    .graphic {
      position: relative;
      border-radius: 2px;
      border: 1px solid transparent;
      text-align: center;
      padding: 10px 0;
      line-height: 25px;
      &:hover {
        cursor: pointer;
        border-color: var(--color-primary);
      }
      p {
        margin-top: 6px;
        padding: 0 8px;
        text-align: center;
        font-size: 12px;
        height: 12px;
        line-height: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        word-break: break-all;
        -webkit-box-orient: vertical;
      }

      svg {
        color: var(--color);
        height: 25px;
        width: 25px;
        margin: auto;
      }
    }
  }
}
</style>
