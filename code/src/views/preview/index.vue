<!--
 * @Description: 
 * @Author: Kevin
 * @Date: 2024-09-06 09:43:43
 * @LastEditors: Kevin
 * @LastEditTime: 2024-10-14 09:58:39
-->
<template>
  <div class="app-page warning">
    <div id="preview"></div>
    <t-dialog
      placement="center" 
      attach="#preview"
      width="300px"
      :closeBtn="false"
      :visible="isWarning"
    >
      <template #header>
        <div class="header">
          <svg-icon name="warning" size="32" />
          <span>系统警告</span>
        </div>
      </template>
      <template #body>
        <div class="body">
          <div><span class="label">点位名称：</span> <span class="content">{{ warnObject.point }}</span></div>
          <div><span class="label">报警等级：</span> <span class="content">{{warnObject.label  }}</span></div>
          <div><span class="label">报警值：</span> <span class="content">{{warnObject.val  }}</span></div>
          <div><span class="label">标准值：</span> <span class="content">{{warnObject.start  }}-{{warnObject.end  }}</span></div>
        </div>
      </template>
      <template #footer>
        <div class="footer">
          <span class="button"  @click="closeWarn">确认关闭</span>
        </div>
      </template>
    </t-dialog>
   <Trend v-model="visibleTrendDialog" :dataId="dataId"/>
   <threshold v-model="visibleThreshold" :penId="penId"/>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted,ref } from "vue";
import { Meta2d ,Pen} from "@kyvi/cobweb";
import SvgIcon from "@/components/SvgIcon";
import useSpeakTTS from "@/Hooks/useSpeakTTS"
import { useRoute } from "vue-router";
import { MessagePlugin } from "tdesign-vue-next";
import Trend from './src/Trend.vue'
import threshold from './src/Threshold.vue'
import { LevelTypes } from "@/components/Props/MetaProp/src/Warn/type";

const uRoute = useRoute()
const STORE_KEY = '' + uRoute.query.projectId
const visibleTrendDialog = ref(false);
const visibleThreshold = ref(false);
const dataId = ref('');
const penId = ref('');
const { Say } = useSpeakTTS()
const isWarning = ref(false);
const warnObject = ref({});
let isFree = true;
const TIME = 1000 * 60 * 5;
function closeWarn() {
  isWarning.value=false;
  Say()
  isFree = true;
}
// 报价标记
const WarnMark:any={}
window.warning = (id: string, warn: any) => {
  if (isFree && (!WarnMark[id] || (Math.round(new Date()) - WarnMark[id] > TIME))) {
    WarnMark[id] = Math.round(new Date())
    isFree = false;
    doWarn(id, warn)
  }
}
const doWarn = (id: string, warn: any) => { 
  warnObject.value=warn
  const pen = cobweb.findOne(id)
  warnObject.value.val = pen?.text;
  const level =LevelTypes.find(item=>item.value===warn.level)?.label
  warnObject.value.label = level;
  warnObject.value.point = pen?.form?.length ? pen.form[0].dataIds?.name : ''
  Say(warnObject.value.point + level)
  isWarning.value = true;
 }
// 显示趋势
const showTrend = (e: any) => {
  dataId.value = getDataId(e.pen);
  if (!dataId.value) {MessagePlugin.warning('请先配置数据源'); return}
  visibleTrendDialog.value = true;
}

// 获取趋势数据源id
function getDataId(pen: Pen): string {
  let dataId= pen.form?.find(item=>item.key==='text')?.dataIds?.dataId
  if (dataId) return dataId;
  (pen.children || []).forEach((id:string) => {
    const data:string = cobweb.find(id)?.form?.find(item=>item.key==='text')?.dataIds?.dataId
    if (data) {
      dataId=data
      return false;
    }
  })
  return dataId
}
// 报警阈值
function setThreshold(e: any) {
  if (!e.pen) return;
  if (e.pen?.form?.length&&e.pen?.form[0]?.key === 'text') {
    setTimeout(() => {
      visibleThreshold.value = true;
    },10) 
    penId.value = e?.pen?.id??'';
  }
}
function lookTrend(e: any) {
  if (!e.pen) return;
  if (e.pen?.form?.length&&e.pen?.form[0]?.key === 'text') {
    dataId.value =getDataId(e.pen)
    visibleTrendDialog.value = true;
  }
}
onMounted(() => {
  window.cobweb =  new Meta2d("preview", {
    rule: false,
  });
  // 读取本地存储
  const json: any = localStorage.getItem(STORE_KEY);
  if (json) {
    const data:any = JSON.parse(json);
    data.locked = 1;
    cobweb.open(data);
    cobweb.fitView();
  }
  cobweb.on("click", lookTrend); 
  cobweb.on("contextmenu", setThreshold) 
});
onUnmounted(() => {
  cobweb.destroy();
});
</script>
<style lang="postcss" scoped>
.app-page {
  height: 100vh;
  #preview {
    height: 100%;
  }  
  :deep(.t-dialog){
    background-color: #ff000085;
    animation: warning .3s ease infinite alternate;
    padding: 24px;
    border: unset;
    .t-dialog__close{
      color: #fff;
    }
    .button{
      width: 100%;
      display: block;
      border-radius: 4px;
      background-color: #fff;
      color: #ff0000b8;
      border-color: #fff;
      font-weight: 600;
      font-size: 14px;
      letter-spacing: 2px;
      cursor: pointer;
    }
    .header{
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      line-height: 30px;
      span{
        padding: 0 15px;
        font-size: 24px;
        color: #f0d104;
      }
    }
    .body{
      color: #fff;
      font-size: 16px;
      line-height: 30px;
      .label{
        display: inline-block;
        width: 90px;
        font-weight: 600;
        text-align: right;
        color: #f0d104;
      }
    }
  }
  :deep(.t-dialog__mask){
    background: rgba(255, 0, 0, 0);
    animation: warn .3s ease infinite alternate;
  }
  @keyframes warn{
    to{
      background: rgba(255, 0, 0, 0.1);
    }
  }
  @keyframes warning{
    to{
      box-shadow:  0 0 100px 0 rgba(255, 0, 0, .3);
    }
  }
}

</style>
