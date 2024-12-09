<!--
 * @Description: 
 * @Author: Kevin
 * @Date: 2024-09-06 09:43:44
 * @LastEditors: Kevin
 * @LastEditTime: 2024-10-11 14:02:53
-->
<template>
  <div class="event-props">
    <div  class="flex middle" style="padding: 15px; width: 100%;">
      <span style="width: 80px;">绑定数据：</span>
      <t-tree-select
        v-model="selectValue"
        :data="options"
        clearable
        filterable
        placeholder="请选择"
        :filter="filterFunction"
        @change="handleSelectChange"
        treeNodeFilterProp="title"
      />
    </div>
    <t-collapse defaultExpandAll expand-icon-placement="left">
      <t-collapse-panel header="报警配置">  
         <template #headerRightContent>
          <t-space>
            <!-- <t-button theme="primary" size="small" @click="addEvent">
              <template #icon> <add-icon /></template>
            </t-button> -->
            <t-button theme="primary"  size="small" @click="saveEvent">
              <template #icon><save-icon /></template>
            </t-button>
          </t-space>
          </template>
          <t-collapse defaultExpandAll expand-icon-placement="left">
            <t-collapse-panel :value="index" v-for="(item,index) in events.ranges" :key="index"  :header="'报警'+(index+1)"> 
            <template #headerRightContent>
              <t-space>
                <t-button theme="danger" size="small" @click="removeEvent(index)">
                  <template #icon> <delete-icon /></template>
                </t-button>
              </t-space>
              </template>
              <t-form ref="form" :data="item" labelWidth="60" :colon="true">
                <t-form-item label="报警等级" name="level">
                  <t-select  v-model="item.level">
                    <t-option  v-for="event in LevelTypes" :key="event.value" :label="event.label" :value="event.value" />
                  </t-select>
                </t-form-item>
                <t-form-item label="报警阈值" name="value">
                  <t-input-group separate>
                    <t-input :style="{ width: '84px' }" v-model="item.start" placeholder="开始值" />
                    <span :style="{ lineHeight: '32px' }">&nbsp;-&nbsp;</span>
                    <t-input :style="{ width: '84px' }" v-model="item.end"  placeholder="结束值"/>
                  </t-input-group>
                </t-form-item>
              </t-form>
            </t-collapse-panel>
          </t-collapse>
      </t-collapse-panel>
    </t-collapse>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted,toRaw,ref } from "vue";
import { AddIcon,DeleteIcon,SaveIcon } from 'tdesign-icons-vue-next';
import { EventAction,LevelTypes, EventAttr,Range } from "./type";
import { useSelection } from "@/services/selections";
import { TreeSelectProps } from 'tdesign-vue-next';
const { selections } = useSelection();
// 信号绑定相关
const selectValue=ref('')
const options = dataSource.map((item: any) => ({ label: item.itemName, value: item.itemCode }))
const filterFunction: TreeSelectProps['filter'] = (searchText, node) => {
  return node.data.label.includes(searchText);
};
const handleSelectChange = (val: string) => {
  
  const form = {
      dataIds: {
          dataId: val,
          name: options.find((item:any) =>item.value===val)?.label
      },
      key: "text",
  }
  cobweb.setValue({ id: selections.pen.id, form: [form] }); 
  cobweb.render()
}
// 事件相关逻辑
let events: EventAttr = reactive({
  name: 'valueUpdate',
  action: EventAction.JS,
  ranges: [
    {level: 'g1',start: '',end: ''},
    {level: 'g2',start: '',end: ''},
    {level: 'g3',start: '',end: ''},
    {level: 'd1',start: '',end: ''},
    {level: 'd2',start: '',end: ''},
    {level: 'd3',start: '',end: ''},
  ],
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
})

function removeEvent(index: number) {
  events.ranges.splice(index,1)
}

function addEvent() {
  const range:Range =   { level: '',start: '',end: '',}
  events.ranges.push(range)
}  

function saveEvent() {
  const event = toRaw(events)
  const currentValue = selections?.pen?.events ?? [];
  const index = currentValue?.findIndex(e => e?.ranges) ?? -1;
  index === -1 ? currentValue.push(event) : currentValue.splice(index, 1, event)
  cobweb.setValue({ id: selections.pen.id ,events:currentValue});
}

onMounted(() => {
  const form = selections?.pen?.form
  selectValue.value = form?.length ? form[0].dataIds?.dataId : ''
  const event=selections?.pen?.events?.find(e => e?.ranges)
  if(event)  events.ranges = event.ranges
})
</script>

<style lang="postcss" scoped>
.event-props {
  border-left: 1px solid var(--color-border);
  z-index: 2;
  overflow-y: auto;
  .select-input-ul-single{
    height: 400px;
    overflow-y: auto;
    padding: 10px;
  }
  :deep(.t-collapse-panel__wrapper) {
      .t-collapse-panel__body {
        background: unset;
        /* padding: 15px; */
          .t-collapse-panel__content {
            padding: 0px;
            .t-collapse-panel__header{
              /* padding: 0px; */
              padding-left: 30px;
            }
            .t-collapse-panel__body {
              padding:15px 10px;
              padding-left: 30px;
            }
          }
      }
    }

    .attrs{
      .att{
        display: flex;
        align-items: center;
        padding: 5px 0;
        gap: 15px;
        span{
          width: 100px;
          /* text-align: center; */
        }
      }
      :deep(.t-input__wrap) {
        width: 100px;
      }
      svg{
        font-size: 18px;
        color: #de6670;
        cursor: pointer;
      }
      .t-button{
        width: 100%;
        margin-top: 10px;
      }
    }
}
</style>