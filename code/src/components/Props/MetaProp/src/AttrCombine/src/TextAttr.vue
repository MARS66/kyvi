<!--
 * @Description: 
 * @Author: Kevin
 * @Date: 2024-08-15 15:41:37
 * @LastEditors: Kevin
 * @LastEditTime: 2024-09-10 11:07:43
-->

<template>
  <t-form label-align="left">
    <t-form-item label="文本内容" name="text">
      <t-textarea v-model="brush.text" @change="changeBrush('text')" />
    </t-form-item>
    <t-form-item label="字体大小" name="fontSize">
      <t-input-number
        v-model="brush.fontSize"
        @change="changeBrush('fontSize')"
        theme="column"
      />
    </t-form-item>
    <t-form-item label="文字颜色" name="textColor">
      <t-color-picker
        enableAlpha
        v-model="brush.textColor"
        format="CSS"
        :color-modes="['monochrome']"
        :show-primary-color-preview="false"
        @change="changeBrush('textColor')"
      />
    </t-form-item>
    <t-form-item label="选中颜色" name="activeTextColor">
      <t-color-picker
        enableAlpha
        v-model="brush.activeTextColor"
        format="CSS"
        :color-modes="['monochrome']"
        :show-primary-color-preview="false"
        @change="changeBrush('activeTextColor')"
      />
    </t-form-item>
    <t-form-item label="浮动颜色" name="hoverTextColor">
      <t-color-picker
        enableAlpha
        v-model="brush.hoverTextColor"
        format="CSS"
        :color-modes="['monochrome']"
        :show-primary-color-preview="false"
        @change="changeBrush('hoverTextColor')"
      />
    </t-form-item>
    <t-form-item label="文本背景" name="textBackground">
      <t-color-picker
        enableAlpha
        v-model="brush.textBackground"
        format="CSS"
        :color-modes="['monochrome']"
        :show-primary-color-preview="false"
        @change="changeBrush('textBackground')"
      />
    </t-form-item>

    <t-form-item label="倾斜" name="fontStyle">
      <t-radio-group
        v-model="brush.fontStyle"
        @change="changeBrush('fontStyle')"
      >
        <t-radio value="normal">正常</t-radio>
        <t-radio value="italic">倾斜</t-radio>
      </t-radio-group>
    </t-form-item>
    <t-form-item label="加粗" name="fontWeight">
      <t-radio-group
        v-model="brush.fontWeight"
        @change="changeBrush('fontWeight')"
      >
        <t-radio value="normal">正常</t-radio>
        <t-radio value="bold">加粗</t-radio>
      </t-radio-group>
    </t-form-item>
    <t-form-item label="文本高度" name="textHeight">
      <t-input-number
        v-model="brush.textHeight"
        @change="changeBrush('textHeight')"
        theme="column"
      />
    </t-form-item>
    <t-form-item label="文本宽度" name="textWidth">
      <t-input-number
        v-model="brush.textWidth"
        @change="changeBrush('textWidth')"
        theme="column"
      />
    </t-form-item>
    <t-form-item label="水平对齐" name="textAlign">
      <t-select
        v-model="brush.textAlign"
        @change="changeBrush('textAlign')"
      >
        <t-option key="left" label="左对齐" value="left" />
        <t-option key="center" label="居中" value="center" />
        <t-option key="right" label="右对齐" value="right" />
      </t-select>
    </t-form-item>
    <t-form-item label="垂直对齐" name="textBaseline">
      <t-select
        v-model="brush.textBaseline"
        @change="changeBrush('textBaseline')"
      >
        <t-option key="top" label="顶部对齐" value="top" />
        <t-option key="middle" label="居中对齐" value="middle" />
        <t-option key="bottom" label="底部对齐" value="bottom" />
      </t-select>
    </t-form-item>
    <t-form-item label="水平偏移" name="textLeft">
      <t-input-number
        v-model="brush.textLeft"
        @change="changeBrush('textLeft')"
        theme="column"
      />
    </t-form-item>
    <t-form-item label="垂直偏移" name="textTop">
      <t-input-number
        v-model="brush.textTop"
        @change="changeBrush('textTop')"
        theme="column"
      />
    </t-form-item>
    <t-form-item label="换行方式" name="whiteSpace">
      <t-select
        v-model="brush.whiteSpace"
        @change="changeBrush('whiteSpace')"
      >
        <t-option key="normal" label="默认" value="normal" />
        <t-option key="wrap" label="换行" value="wrap" />
        <t-option key="nowrap" label="永不换行" value="nowrap" />
        <t-option key="pre" label="回车换行" value="pre" />
      </t-select>
    </t-form-item>

    <t-form-item label="超出省略" name="ellipsis">
      <t-switch
        v-model="brush.ellipsis"
        @change="changeBrush('ellipsis')"
      />
    </t-form-item>
  </t-form>
</template>


<script setup lang="ts">
import useBrush from '@/Hooks/useBrush'
const { brush, changeBrush } = useBrush()
</script>