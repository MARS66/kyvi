<!--
 * @Description: 
 * @Author: Kevin
 * @Date: 2024-08-28 10:05:03
 * @LastEditors: Kevin
 * @LastEditTime: 2024-09-10 11:01:05
-->
<template>
  <div id="draggable-outer">
    <draggable
      :list="list"
      itemKey="index"
      ghost-class="ghost"
      chosen-class="chosenClass"
      animation="100"
      @end="onEnd"
    >
      <template #item="{ element }">
        <div  class="item" @click.native="handlerSelect(element)" :id="element.id">
          <img v-if="element.image" :src="element.image" alt="" srcset="" />
          <svg v-else class="l-icon" aria-hidden="true">
            <use :xlink:href="'#' + getIconName(element.name)"></use>
          </svg>
          <span :class="brush.id === element.id ? 'active name' : 'name'">
            {{ element.name }}</span
          >
          <div class="operation">
            <SvgIcon color="#f66" name="delete" @click="onDelete(element)" size="14"/>
            <SvgIcon color="#478afe"  :name="(brush.id === element.id ? brush.visible : element.visible)===false ? 'invisible':'visible'" @click="setVisible(element)" size="14"/>
          </div>
        </div>
      </template>
    </draggable>
  </div>
</template>
<script lang="ts" setup>
import { onMounted,reactive} from "vue";
import draggable from "vuedraggable";
import graphicBasic from "@/static/Basic";
import { useSelection } from "@/services/selections";
import SvgIcon from "@/components/SvgIcon";

import useBrush from '@/Hooks/useBrush'
  const { brush } = useBrush()
const { select } = useSelection();

let list = reactive(cobweb.store.data.pens);
// store.$subscribe(() => {
//   viewToTarget()
// })
onMounted(() => {
  viewToTarget()
})
// 滚动到选中图层
const viewToTarget = () => {
  const parent = document.getElementById('draggable-outer')
  const child = document.getElementById(brush.value.id)
  parent?.scrollTo({
    top: child?.offsetTop,
    behavior:'smooth'
  })
}
// 选中图层
const handlerSelect = (pen: any) => {
  select([pen]);
  cobweb.active([pen]);
};
const getIconName = (key: string) => {
  const addIcon = graphicBasic.list.concat([
    {
      icon: "icon-line",
      data: {
        name: "line",
      },
    },
    {
      icon: "icon-combine",
      data: {
        name: "combine",
      },
    },
  ]);
  return addIcon.find((item) => item.data.name === key)?.icon;
};
//拖拽结束的事件
const onEnd = (e: any) => {
  cobweb.setLayer(list[e.oldIndex], e.newIndex)
  cobweb.render();
};
function setVisible(pen: any) {
  cobweb.setVisible(pen, !pen.visible);
}
function onDelete(pen: any) {
  cobweb.delete([pen]);
}
</script>

<style scoped lang="postcss">
#draggable-outer {
  height: 100%;
  overflow-y: auto;
  padding: 15px;
  box-sizing: border-box;
  .item {
    display: flex;
    align-items: center;
    padding: 15px;
    /* border-bottom: 1px solid #478afe; */
    cursor: grab;
    &:hover {
      background-color: #31313182;
    }
    img {
      width: 20px;
    }
    svg {
      font-size: 20px;
      color: #478afe;
    }
    .name {
      padding: 0 10px;
      font-size: 14px;
    }
    .active {
      color: #478afe;
    }
    .operation{
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 6px;
      > svg{
        cursor: pointer;
      }
    }
  }
}
</style>
