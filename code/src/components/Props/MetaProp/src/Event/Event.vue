<!--
 * @Description: 
 * @Author: Kevin
 * @Date: 2024-09-06 09:43:44
 * @LastEditors: Kevin
 * @LastEditTime: 2024-10-14 10:04:58
-->
<template>
  <div class="event-props">
    <t-collapse defaultExpandAll expand-icon-placement="left">
      <t-collapse-panel header="事件交互">  
         <template #headerRightContent>
          <t-space>
            <t-button theme="primary" size="small" @click="addEvent">
              <template #icon> <add-icon /></template>
            </t-button>
            <t-button theme="primary"  size="small" @click="saveEvent">
              <template #icon><save-icon /></template>
            </t-button>
          </t-space>
          </template>
          <t-collapse defaultExpandAll expand-icon-placement="left">
            <t-collapse-panel :value="index" v-for="(item,index) in events" :key="index"  :header="'事件'+index+1"> 
            <template #headerRightContent>
              <t-space>
                <t-button theme="danger" size="small" @click="removeEvent(index)">
                  <template #icon> <delete-icon /></template>
                </t-button>
              </t-space>
              </template>
              <t-form ref="form" :rules="FORM_RULES" :data="item" labelWidth="80" :colon="true">
                <t-form-item label="事件类型" name="name">
                  <t-select  v-model="item.name">
                    <t-option  v-for="event in EventTypes" :key="event.value" :label="event.label" :value="event.value" />
                  </t-select>
                </t-form-item>
                <t-form-item label="事件行为" name="action">
                  <t-select  v-model="item.action">
                    <t-option  label="修改属性" :value="EventAction.SetProps" />
                    <!-- <t-option  label="查看趋势" :value="EventAction.Emit" /> -->
                  </t-select>
                </t-form-item>
                <t-form-item v-if="item.action===1" label="目标标识" name="params">
                  <t-input v-model="item.params" placeholder="请输入内容"></t-input>
                </t-form-item>
                <div class="attrs" v-if="item.action===1&&item.name && item.params">
                  <div class="att">
                    <span>目标属性</span>
                    <span>修改值</span>
                  </div>
                  <div v-for="(att,i) in item.attrs" class="att">
                    <t-input v-model="att.key" size="small"></t-input>
                    <t-input v-model="att.value" size="small"></t-input>
                    <delete-icon @click="deleteAttr(item.attrs,i)"></delete-icon>
                  </div>
                  <t-button @click="addAttr(item.attrs)">添加字段</t-button>
                </div>
              </t-form>
            </t-collapse-panel>
          </t-collapse>
      </t-collapse-panel>
    </t-collapse>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted,toRaw } from "vue";
import { FormProps } from 'tdesign-vue-next';
import { AddIcon,DeleteIcon,SaveIcon } from 'tdesign-icons-vue-next';
import { EventAction,EventTypes, eventAttr,Attr } from "./type";
import { useSelection } from "@/services/selections";
const { selections } = useSelection();
// 属性值修改
function addAttr(target:Attr[]) {
  target.push({key:'',value:''})
}
function deleteAttr(target:Attr[],index: number) {
  target.splice(index,1)
}
const FORM_RULES: FormProps['rules'] = {
  params: [
    {
      required: true,
      message: '目标元素tag不能为空',
    },
  ],
  name: [
    {
      required: true,
      message: '事件类型不能为空',
    },
  ],
  action: [
    {
      required: true,
      message: '事件行为不能为空',
    },
  ],
};
// 事件相关逻辑
const events:Array<eventAttr> = reactive([])

function removeEvent(index: number) {
  events.splice(index,1)
}

function addEvent() {
  const event:eventAttr = {
      name: 'click',
      fn:null,
      action: EventAction.SetProps,
      attrs:[{key:'',value:''}],
      params:'',
    }
  events.push(event)
}
function transForm(str: any) {
  if (str==='true')  return true
  if (str === 'false') return false
  return str
}

function saveEvent() {
  const event = toRaw(events).map(item => {
    //  查看趋势
    if (item.action===EventAction.Emit) {
      item.value='onTrend'
      item.params=selections.pen.id
    }
    // 修改属性
    if (item.action === EventAction.SetProps) {
      const value={}
      item.attrs.forEach(a => {
        if (a.key && a.value) value[a.key] = transForm(a.value);
      })
      item.value=value
    }
    return item
  })
  cobweb.setValue({
    id:selections.pen.id,
    events: event.concat( selections?.pen?.events?.filter((item:any) => item?.ranges )??[])
  });
}
onMounted(() => {
  const event = selections?.pen?.events?.filter((item:any) => !item?.ranges ) ?? []
  events.push(...event) 
})
</script>

<style lang="postcss" scoped>
.event-props {
  border-left: 1px solid var(--color-border);
  z-index: 2;
  overflow-y: auto;
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