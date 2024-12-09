<!--
 * @Description: 
 * @Author: Kevin
 * @Date: 2024-10-29 09:07:24
 * @LastEditors: Kevin
 * @LastEditTime: 2024-10-29 11:21:27
-->
<template>
  <div class="canvas_content">
    <div id="operation_center">
      <div v-show="showMenu" class="menu" :style="menuPosition">
        <el-menu
          theme="dark"
          :value="activeMenu"
          defaultValue="dashboard"
          height="550px"
          width="160px"
        >
          <el-menu-item value="top" @click="top">置顶 </el-menu-item>
          <el-menu-item value="bottom" @click="bottom">置底 </el-menu-item>
          <el-menu-item value="up" @click="up">上一图层 </el-menu-item>
          <el-menu-item value="down" @click="down" :divider="true">
            下一图层
          </el-menu-item>
          <el-menu-item
            value="combine"
            v-show="highlight.length > 1"
            @click="combine"
            >组合</el-menu-item
          >
          <el-menu-item
            v-show="highlight.length > 1"
            value="combineStatus"
            @click="combineStatus"
          >
            组合为状态
          </el-menu-item>
          <el-menu-item
            v-show="
              highlight.length < 2 &&
              selections.pen &&
              selections.pen.name === 'combine'
            "
            value="unCombine"
            @click="uncombine"
          >
            解除组合
          </el-menu-item>
          <el-menu-item value="deleteNode" @click="deleteNode">删除</el-menu-item>
        </el-menu>
      </div>
    </div>
    <div class="bottom-slider">
      <el-dropdown placement="top" :minColumnWidth="180" trigger="hover">
        <i class="el-icon-question"></i>
        <el-dropdown-menu>
          <el-dropdown-item>
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
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-dropdown @click="clickHandler" placement="top" trigger="hover">
        <span>{{ scale }}%</span>
        <el-dropdown-menu>
          <el-dropdown-item :value="2"> 200% </el-dropdown-item>
          <el-dropdown-item :value="1.5">150% </el-dropdown-item>
          <el-dropdown-item :value="1"> 100% </el-dropdown-item>
          <el-dropdown-item :value="0.5"> 50% </el-dropdown-item>
          <el-dropdown-item :value="'auto'">自适应 </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script >
import {
  Meta2d,
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
import { useSelection } from "@/utils/selections";
import  xt  from "@/utils/xxtea";

const { selections, select } = useSelection();
export default {
  name: 'Editor-drag',
  props: {
    cobweb: String
  },
  data() {
    return {
      scale: 0,
      selections,
      highlight: [],
      menuPosition: {},
      activeMenu:'',
      showMenu:false,
    }
  },
  // 处理推送数据
  mounted() {
    // 创建实例
    window.cobweb =  new Meta2d("operation_center", {rule: false});
    const timer = setInterval(() => {
      if ( window.cobweb) {
        clearInterval(timer);
        // 获取初始缩放比例
        this.scaleSubscriber( window.cobweb.store.data.scale);
        window.cobweb.setOptions();
        // 监听缩放
        window.cobweb.on("scale", (val) => this.scaleSubscriber(val));
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
    let data=xt.xxtea_decrypt(this.cobweb)
    if (data) {
      data = JSON.parse(data);
      data.locked = 0;
      window.cobweb.open(data);
    } else {
      window.cobweb.open({ name: '新建可视化应用', pens: [] });
    }
    window.cobweb.on("active", this.active);
    window.cobweb.on("inactive", this.inactive);
    // 右键菜单
    window.cobweb.on("contextmenu", this.showContextMenu);
    // 点击画布
    window.cobweb.on("click",this.hideContextMenu);
  },
  methods: {
    // 
    clickHandler (data) {
      if (data.value === "auto") {
        window.cobweb.fitView();
        return;
      }
      window.cobweb.centerView();
      window.cobweb.scale(data.value);
    },
  
  // 缩放监听
  scaleSubscriber(val) {
    this.scale = Math.round(val * 100);
  },

  active(pens){
    console.log(pens[0]);
    if (pens?.length) {
      this.highlight = pens || [];
      select(pens);
    }
  },
  showContextMenu  (val){
    this.showMenu = true;
    this.menuPosition = {
      top: val.e.clientY - val.clientRect.top + "px",
      left: val.e.clientX - val.clientRect.left + 20 + "px",
    };
  },

  hideContextMenu () {
    this.showMenu = false;
    this.activeMenu = "";
  },
  inactive(){
    select();
  },
  deleteNode () {
    window.cobweb.delete();
    this.hideContextMenu();
  },
  top () {
    window.cobweb.top();
    window.cobweb.render();
    this.hideContextMenu();
  },
  bottom () {
    window.cobweb.bottom();
    window.cobweb.render();
    this.hideContextMenu();
  },
  up(){
    window.cobweb.up();
    window.cobweb.render();
    this.hideContextMenu();
  },
  down  () {
    window.cobweb.down();
    window.cobweb.render();
    this.hideContextMenu();
  },
  // 组合为状态
  combineStatus (){
    window.cobweb.combine(this.highlight, 0);
    this.hideContextMenu();
  },
  // 组合
  combine() {
    window.cobweb.combine(this.highlight);
    this.hideContextMenu();
  },
// 组合解除
  uncombine  ()  {
    window.cobweb.uncombine(selections.pen);
    this.hideContextMenu();
  },
  distoryed() {
    window.cobweb.destroy();
  }
},
} 
</script>
<style scoped lang="scss">
.canvas_content {
  height: 100%;
  #operation_center {
    height: calc(100% - 32px);
    display: flex;
    z-index: 1;
    position: relative;
    .menu{
      position: absolute;
      z-index: 6;
      text-align: left;
    }
  }
  .bottom-slider {
    height: 32px;
    border-top: 1px solid var(--color-border);
    display: flex;
    align-items: center;
    justify-content: flex-end;
    .el-icon-question {
      cursor: pointer;
      font-size: 24px;
      color: #fff;
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
      line-height: 24px;
      text-align: center;
      padding: 4px 0;
      text-align: center;
      cursor: pointer;
      background: #303640;
      color: #fff;
      box-shadow: inset 0 0 0 1px #ffebeb1a, 0 0 0 1px #181818;
    }
  }
}
</style>
