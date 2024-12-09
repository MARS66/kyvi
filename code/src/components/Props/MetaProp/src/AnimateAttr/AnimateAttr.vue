<!--
 * @Description: 
 * @Author: Kevin
 * @Date: 2024-08-15 15:41:37
 * @LastEditors: Kevin
 * @LastEditTime: 2024-09-20 14:01:37
-->

<template>
  <div class="props-panel">
    <t-space direction="vertical">
      <t-collapse :default-value="[0, 1, 2]" expand-icon-placement="right">
        <t-collapse-panel header="线条动画">
          <t-form label-align="left">
            <t-form-item label="动画类型" name="lineAnimateType">
              <t-select
                v-model="brush.lineAnimateType"
                @change="changeBrush('lineAnimateType')"
              >
                <t-option :key="0" :value="0" label="水流"></t-option>
                <t-option :key="1" :value="1" label="水珠"></t-option>
                <t-option :key="2" :value="2" label="圆点"></t-option>
              </t-select>
            </t-form-item>
            <t-form-item
              v-if="brush.lineAnimateType === 1"
              label="水珠形状"
              name="animateLineDash"
            >
              <t-select
                v-model="brush.animateLineDash"
                @change="changeBrush('animateLineDash')"
              >
                <t-option :key="0" value="5, 5" label="形状1"></t-option>
                <t-option :key="1" value="10, 10" label="形状2"></t-option>
                <t-option
                  :key="2"
                  value="10, 10, 2, 10"
                  label="形状3"
                ></t-option>
              </t-select>
            </t-form-item>
            <t-form-item label="线条宽度" name="animateLineWidth">
              <t-input-number
                :min="0"
                :max="100"
                :step="1"
                theme="column"
                v-model="brush.animateLineWidth"
                @change="changeBrush('animateLineWidth')"
              />
            </t-form-item>
            <t-form-item label="动画颜色" name="animateColor">
              <t-color-picker
                enableAlpha
                v-model="brush.animateColor"
                format="CSS"
                :color-modes="['monochrome']"
                :show-primary-color-preview="false"
                @change="changeBrush('animateColor')"
              />
            </t-form-item>

            <t-form-item label="动画速度" name="animateSpan">
              <t-slider
                v-model="brush.animateSpan"
                :min="0"
                :max="5"
                :step="1"
                @change="changeBrush('animateSpan')"
              />
              <span class="ml-16" style="width: 50px; line-height: 30px">
                {{ brush.animateSpan }}
              </span>
            </t-form-item>

            <t-form-item label="逆向流动" name="animateReverse">
              <t-switch
                v-model="brush.animateReverse"
                @change="changeBrush('animateReverse')"
                size="large"
              >
                <template #label="slotProps">{{
                  slotProps.value ? "是" : "否"
                }}</template>
              </t-switch>
            </t-form-item>
            <t-form-item label="自动播放" name="autoPlay">
              <t-switch
                v-model="brush.autoPlay"
                @change="changeBrush('autoPlay')"
                size="large"
              >
                <template #label="slotProps">
                  {{ slotProps.value ? "是" : "否" }}
                </template>
              </t-switch>
            </t-form-item>
            <t-divider></t-divider>
            <t-row justify="space-between">
              <t-button theme="success" @click="startAnimate">
                开始动画
              </t-button>
              <t-button @click="pauseAnimate"> 暂停动画 </t-button>
              <t-button theme="danger" @click="stopAnimate">
                停止动画
              </t-button>
            </t-row>
          </t-form>
        </t-collapse-panel>
      </t-collapse>
    </t-space>
  </div>
</template>

<script setup lang="ts">
import useBrush from '@/Hooks/useBrush'
const { brush, changeBrush } = useBrush()
// 开始动画
const startAnimate = () => {
  cobweb.startAnimate([brush.value]);
};
// 暂停动画
const pauseAnimate = () => {
  cobweb.pauseAnimate([brush.value]);
};
// 结束动画
const stopAnimate = () => {
  cobweb.stopAnimate(brush.value.id);
};
</script>
<style scoped lang="postcss">
@import url("../common.postcss");
</style>
