<!--
 * @Description: 
 * @Author: Kevin
 * @Date: 2024-10-10 15:29:55
 * @LastEditors: Kevin
 * @LastEditTime: 2024-10-14 09:54:06
-->
<template>
  <n-modal
    v-model:show="visibleTrendDialog"
    preset="dialog"
    :show-icon="false"
    title="报警阈值配置"
    style="width: 400px;"
    contentClass="trend-modal"
    :maskClosable="false"
    :onMaskClick="closeDialog"
    @close="closeDialog"
    negative-text="不确认"
    positive-text="确认"
    @positive-click="handlePositiveClick"
    @negative-click="closeDialog"
  >
  <div class="threshold">
      <t-input-group separate v-for="item in data" :key="item.value">
        <span  :style="{ lineHeight: '32px',width:'80px' }">{{ item.label }}</span>
        <t-input :style="{ width: '116px' }" v-model="item.start" placeholder="开始值" />
        <span :style="{ lineHeight: '32px' }">&nbsp;-&nbsp;</span>
        <t-input :style="{ width: '116px' }" v-model="item.end"  placeholder="结束值"/>
      </t-input-group>
  </div>

  </n-modal>
</template>
<script lang="ts" setup>
import { defineProps ,ref,watch,defineEmits,reactive} from 'vue'
import { UPDATE_MODEL_EVENT } from '@/utils/constants'
const visibleTrendDialog = ref(false);
let data = reactive([
  {label:'高报1级',value:'g1',start:undefined,end:undefined},
  {label:'高报2级',value:'g2',start:undefined,end:undefined},
  {label:'高报3级',value:'g3',start:undefined,end:undefined},
  {label:'低报1级',value:'d1',start:undefined,end:undefined},
  {label:'低报2级',value:'d2',start:undefined,end:undefined},
  {label:'低报3级',value:'d3',start:undefined,end:undefined},
])
const props = defineProps({
  penId: {
    type: String,
    required: true,
  },
  modelValue: {
    type: Boolean,
    required: true,
  }
})
const emits = defineEmits([UPDATE_MODEL_EVENT])
watch(() => props.modelValue, val => {
  if (val) {
    visibleTrendDialog.value = true
    const obj = cobweb.findOne(props.penId)
    const event=obj?.events?.find((e:any) => e?.ranges)
    if(event)  data = event.ranges
  } else {
    visibleTrendDialog.value = false
  }
})
const closeDialog = () => {
  visibleTrendDialog.value = false
  emits(UPDATE_MODEL_EVENT, false)
}
const handlePositiveClick = () => {
  const warn={
      name: 'valueUpdate',
      action: 5,
      ranges:data,
      value:`const e = pen?.events.find(e => e?.ranges);
            let color=pen.color
            let textColor=pen.textColor
            e.ranges.forEach(item=>{
              const v=parseFloat(pen?.text)
              const s=parseFloat(item.start)
              const e=parseFloat(item.end)
              color =(s <= v && v <= e)? 'red':color;
              textColor =(s <= v && v <= e)? 'red':textColor;
              if (s <= v && v <= e ) window.warning(pen.id,item);
            });
            if(color !== pen.color){ 
              window.cobweb.setValue({id:pen.id,textColor,color});
            }
            `//代码块
  }
  const currentValue = cobweb.findOne(props.penId)?.events ?? [];
  const index = currentValue?.findIndex((e:any) => e?.ranges) ?? -1;
  index === -1 ? currentValue.push(warn) : currentValue.splice(index, 1, warn)
  cobweb.setValue({ id: props.penId, events: currentValue });
  cobweb.open(cobweb.data())
  closeDialog()
}
</script>
<style lang="postcss" scoped>
  .eChart{
    height: 50vh;
  }
  .threshold{
    display: flex;
    flex-direction: column;
    gap: 15px;
    padding: 15px;
    .t-input__wrap{
      flex: 1;
    }
  }
</style>