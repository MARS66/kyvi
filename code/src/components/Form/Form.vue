<!--
 * @Description: 
 * @Author: Kevin
 * @Date: 2024-10-17 10:01:08
 * @LastEditors: Kevin
 * @LastEditTime: 2024-10-17 13:47:05
-->
<template>
  <t-collapse  placement="left" theme="card" class="vertical-collapse" >
    <t-collapse-panel   v-for="item in props.formList" :value="item.title" :header="item.title">
      <t-form @submit="(e)=>e.preventDefault()" label-align="right">
        <t-form-item v-for="i in item.children" :label="i.title">
          <!--输入框-->
          <t-input v-model="i.bindProp[i.prop]" :placeholder="i.option?.placeholder || '请输入'" v-if="i.type==='input'" @[i.event]="i.func" :type="i.option?.type||'text'"/>
          <!--文件框-->
          <t-button v-else-if="i.type==='file'"><label :for="i.for || i.title" >
            <input :id="i.for || i.title" style="display: none" type="file" :accept="i.option?.accept || '*/*'" @[i.event]="i.func" >
              选择文件
            </label>
          </t-button>
          <!-- 数字框-->
          <t-input-number :placeholder="i.option?.placeholder || '请输入'" :step="i.option?.step || 1" v-model="i.bindProp[i.prop]" :min="i.option?.min ?? -Infinity" :max="i.option?.max ?? Infinity" @[i.event]="i.func" v-else-if="i.type==='number'"/>
          <!--选择框-->
          <t-select v-model="i.bindProp[i.prop]" :placeholder="i.option.placeholder" v-else-if="i.type==='select'" @[i.event]="i.func">
            <t-option
                v-for="item in i.option.list"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                :disabled="item.disabled"
            >
             <div v-if="item.template" class="select_template" v-html="item.template"></div>
            </t-option>
          </t-select>
          <!--取色器-->
          <t-color-picker style="width: 100%;" v-model="i.bindProp[i.prop]" show-alpha v-else-if="i.type === 'color'" @[i.event]="i.func"/>
          <!-- 开关-->
          <t-switch v-model="i.bindProp[i.prop]" v-else-if="i.type==='switch'" @[i.event]="i.func"/>
          <!-- 按钮-->
          <t-button :type="i.option.type" v-else-if="i.type === 'button'" @[i.event]="i.func" :style="i.middle?'width:100%;margin: auto;':''">{{i.option.title}}</t-button>
        </t-form-item>
      </t-form>
    </t-collapse-panel >
  </t-collapse>
</template>
<script lang="ts" setup>
  const props = defineProps(['formList'])
</script>
<style lang="postcss" scoped>
.vertical-collapse{
  :deep(.t-collapse-panel__header){
    border-color: #34343480;
  }
  :deep(.t-collapse-panel__wrapper){
    .t-collapse-panel__body{
      background-color: #111417;
    }
   .t-collapse-panel__content{
      padding:20px 10px;
      padding-left: 30px;
      .t-form{
      }
    }
  }
}

</style>