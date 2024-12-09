<!--
 * @Description: 
 * @Author: Kevin
 * @Date: 2023-10-31 17:14:18
 * @LastEditors: Kevin
 * @LastEditTime: 2024-10-11 08:45:00
-->
<template>
  <div class="canvas_content">
    <div id="operation_center">
      <div v-show="showMenu" class="menu" :style="menuPosition">
        <t-menu
          theme="dark"
          :value="activeMenu"
          defaultValue="dashboard"
          height="550px"
          width="160px"
        >
          <t-menu-item value="top" @click="top">置顶 </t-menu-item>
          <t-menu-item value="bottom" @click="bottom">置底 </t-menu-item>
          <t-menu-item value="up" @click="up">上一图层 </t-menu-item>
          <t-menu-item value="down" @click="down" :divider="true">
            下一图层
          </t-menu-item>
          <t-menu-item
            value="combine"
            v-show="highlight.length > 1"
            @click="combine"
            >组合</t-menu-item
          >
          <t-menu-item
            v-show="highlight.length > 1"
            value="combineStatus"
            @click="combineStatus"
          >
            组合为状态
          </t-menu-item>
          <t-menu-item
            v-show="
              highlight.length < 2 &&
              selections.pen &&
              selections.pen.name === 'combine'
            "
            value="unCombine"
            @click="uncombine"
          >
            解除组合
          </t-menu-item>
          <t-menu-item value="deleteNode" @click="deleteNode">删除</t-menu-item>
        </t-menu>
      </div>
    </div>
    <div class="bottom-slider">
      <t-dropdown placement="top" :minColumnWidth="180" trigger="hover">
        <SvgIcon name="keyboard" size="24"></SvgIcon>
        <t-dropdown-menu>
          <t-dropdown-item>
            <div
              style="
                height: 100px;
                width: 100%;
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 10px;
                line-height: 14px;
              "
            >
              <span> 撤销 Ctrl + Z </span>
              <span> 恢复 Ctrl + Y</span>
              <span> 剪切 Ctrl + X</span>
              <span> 复制 Ctrl + C </span>
              <span>粘贴 Ctrl + V </span>
              <span>全选 Ctrl + A </span>
              <span>删除 DELETE </span>
            </div>
          </t-dropdown-item>
        </t-dropdown-menu>
      </t-dropdown>
      <t-dropdown @click="clickHandler" placement="top" trigger="hover">
        <span>{{ scale }}%</span>
        <t-dropdown-menu>
          <t-dropdown-item :value="2"> 200% </t-dropdown-item>
          <t-dropdown-item :value="1.5">150% </t-dropdown-item>
          <t-dropdown-item :value="1"> 100% </t-dropdown-item>
          <t-dropdown-item :value="0.5"> 50% </t-dropdown-item>
          <t-dropdown-item :value="'auto'">自适应 </t-dropdown-item>
        </t-dropdown-menu>
      </t-dropdown>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from "vue";
import {
  Meta2d,
  Pen,
  register,
  registerAnchors,
  registerCanvasDraw,
} from "@kyvi/cobweb";
import { flowPens, flowAnchors } from "@kyvi/flow-drag";
import {
  activityDiagram,
  activityDiagramByCtx,
} from "@kyvi/activity-drag";
import { classPens } from "@kyvi/class-drag";
import { sequencePens, sequencePensbyCtx } from "@kyvi/sequence-drag";
import { register as registerEcharts } from "@kyvi/chart-drag";
import { formPens } from "@kyvi/form-drag";
import { chartsPens } from "@kyvi/cobweb-charts";
import { ftaPens, ftaPensbyCtx, ftaAnchors } from "@kyvi/fta-drag";
import SvgIcon from "@/components/SvgIcon";
import { useSelection } from "@/services/selections";
import { useRoute } from "vue-router";

const uRoute = useRoute()
const STORE_KEY=''+uRoute.query.projectId
const { selections, select } = useSelection();
const drawing: any = {
  rule: true,
  // width: 1920,
  // height: 1080,
};
const clickHandler = (data: any) => {
  if (data.value === "auto") {
    cobweb.fitView();
    return;
  }
  cobweb.centerView();
  cobweb.scale(data.value);
};
// 缩放值
const scale = ref(0);
// 缩放监听
const scaleSubscriber = (val: number) => {
  scale.value = Math.round(val * 100);
};
// 处理推送数据
onMounted(() => {
  // 创建实例
  window.cobweb = new Meta2d("operation_center", drawing);
  const timer = setInterval(() => {
    if (cobweb) {
      clearInterval(timer);
      // 获取初始缩放比例
      scaleSubscriber(cobweb.store.data.scale);
      cobweb.setOptions();
      // 监听缩放
      cobweb.on("scale", (val) => scaleSubscriber(val));
    }
  }, 200);
  
  // 按需注册图形库
  // 以下为自带基础图形库
  register(flowPens());
  registerAnchors(flowAnchors());
  register(activityDiagram());
  registerCanvasDraw(activityDiagramByCtx());
  register(classPens());
  register(sequencePens());
  registerCanvasDraw(sequencePensbyCtx());
  registerEcharts();
  registerCanvasDraw(formPens());
  registerCanvasDraw(chartsPens());
  register(ftaPens());
  registerCanvasDraw(ftaPensbyCtx());
  registerAnchors(ftaAnchors());

  // 注册其他自定义图形库
  // 读取本地存储
  let data: any = localStorage.getItem(STORE_KEY);
  if (data) {
    data = JSON.parse(data);
    data.locked = 0;
    cobweb.open(data);
  } else {
    cobweb.open({ name: STORE_KEY, pens: [] } as any);
  }
  // cobweb.socketFn =dealMqttData;
  cobweb.on("active", active);
  cobweb.on("inactive", inactive);
  // 右键菜单
  cobweb.on("contextmenu", showContextMenu);
  // 点击画布
  cobweb.on("click",hideContextMenu);
});

const highlight: any = ref([]);
const active = (pens?: Pen[]) => {
  console.log(pens[0]);
  if (pens?.length) {
    highlight.value = pens || [];
    select(pens);
  }
};

const menuPosition = ref({});
const activeMenu = ref("");
const showMenu = ref(false);
const showContextMenu = (val: any) => {
  showMenu.value = true;
  menuPosition.value = {
    top: val.e.clientY - val.clientRect.top + "px",
    left: val.e.clientX - val.clientRect.left + 20 + "px",
  };
};

const hideContextMenu = () => {
  showMenu.value = false;
  activeMenu.value = "";
};

const inactive = () => {
  select();
};

const deleteNode = () => {
  cobweb.delete();
  hideContextMenu();
};
const top = () => {
  cobweb.top();
  cobweb.render();
  hideContextMenu();
};
const bottom = () => {
  cobweb.bottom();
  cobweb.render();
  hideContextMenu();
};
const up = () => {
  cobweb.up();
  cobweb.render();
  hideContextMenu();
};
const down = () => {
  cobweb.down();
  cobweb.render();
  hideContextMenu();
};
// 组合为状态
const combineStatus = () => {
  cobweb.combine(highlight.value, 0);
  hideContextMenu();
};
// 组合
const combine = () => {
  cobweb.combine(highlight.value);
  hideContextMenu();
};
// 组合解除
const uncombine = () => {
  cobweb.uncombine(selections.pen);
  hideContextMenu();
};
onUnmounted(() => {
  cobweb.destroy();
});
</script>
<style lang="postcss" scoped>
.canvas_content {
  height: calc(100vh - 40px);
  background-color: #0000;
  #operation_center {
    height: calc(100% - 32px);
    z-index: 1;
    .menu {
      position: absolute;
      z-index: 100;
      :deep(.t-default-menu .t-menu__item.t-is-active:not(.t-is-opened)) {
        background-color: transparent;
        color: #ffffff8c;
      }
    }
  }
  .bottom-slider {
    height: 32px;
    border-top: 1px solid var(--color-border);
    display: flex;
    align-items: center;
    justify-content: flex-end;
    svg {
      cursor: pointer;
    }
    span {
      display: inline-block;
      margin: 0 20px;
      align-items: center;
      color: var(--color);
      text-decoration: none;
      white-space: nowrap;
      width: 60px;
      height: 24px;
      line-height: 16px;
      text-align: center;
      padding: 4px 0;
      text-align: center;
      cursor: pointer;
      background: #303640;
      box-shadow: inset 0 0 0 1px #ffebeb1a, 0 0 0 1px #181818;
    }
  }
}
</style>
