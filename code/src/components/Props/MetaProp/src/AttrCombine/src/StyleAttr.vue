<!--
 * @Description: 
 * @Author: Kevin
 * @Date: 2024-08-15 15:41:37
 * @LastEditors: Kevin
 * @LastEditTime: 2024-09-10 11:06:39
-->

<template>
  <t-form label-align="left">
    <t-form-item label="圆角" name="borderRadius">
      <t-input-number
        v-model="brush.borderRadius"
        @change="changeBrush('borderRadius')"
        theme="column"
      />
    </t-form-item>
    <t-form-item label="边宽" name="lineWidth">
      <t-input-number
        v-model="brush.lineWidth"
        @change="changeBrush('lineWidth')"
        theme="column"
      />
    </t-form-item>
    <t-form-item label="线条颜色" name="color">
      <t-color-picker
        enableAlpha
        v-model="brush.color"
        format="CSS"
        :color-modes="['monochrome']"
        :show-primary-color-preview="false"
        @change="changeBrush('color')"
      />
    </t-form-item>
    <t-form-item label="浮动颜色" name="hoverColor">
      <t-color-picker
        enableAlpha
        v-model="brush.hoverColor"
        format="CSS"
        :color-modes="['monochrome']"
        :show-primary-color-preview="false"
        @change="changeBrush('hoverColor')"
      />
    </t-form-item>
    <t-form-item label="选中颜色" name="activeColor">
      <t-color-picker
        enableAlpha
        v-model="brush.activeColor"
        format="CSS"
        :color-modes="['monochrome']"
        :show-primary-color-preview="false"
        @change="changeBrush('activeColor')"
      />
    </t-form-item>
    <t-form-item label="背景颜色" name="background">
      <t-color-picker
        enableAlpha
        v-model="brush.background"
        format="CSS"
        :color-modes="['monochrome']"
        :show-primary-color-preview="false"
        @change="changeBrush('background')"
      />
    </t-form-item>
    <t-form-item label="浮动背景" name="hoverBackground">
      <t-color-picker
        enableAlpha
        v-model="brush.hoverBackground"
        format="CSS"
        :color-modes="['monochrome']"
        :show-primary-color-preview="false"
        @change="changeBrush('hoverBackground')"
      />
    </t-form-item>
    <t-form-item label="选中背景" name="activeBackground">
      <t-color-picker
        enableAlpha
        v-model="brush.activeBackground"
        format="CSS"
        :color-modes="['monochrome']"
        :show-primary-color-preview="false"
        @change="changeBrush('activeBackground')"
      />
    </t-form-item>
    <t-form-item label="不透明度" name="globalAlpha">
      <t-slider
        v-model="brush.globalAlpha"
        :min="0"
        :max="1"
        :step="0.01"
        @change="changeBrush('globalAlpha')"
      />
      <span class="ml-16" style="width: 50px; line-height: 30px">
        {{ brush.globalAlpha }}
      </span>
    </t-form-item>
  </t-form>
</template>


<script setup lang="ts">
import useBrush from '@/Hooks/useBrush'
const { brush, changeBrush } = useBrush()
</script>