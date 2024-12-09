<!--
 * @Description: 
 * @Author: Kevin
 * @Date: 2024-08-15 15:41:37
 * @LastEditors: Kevin
 * @LastEditTime: 2024-09-26 15:29:11
-->

<template>
  <t-form label-align="left" v-if="block">
    <t-form-item label="X" name="x">
      <t-input-number
        v-model="block.x"
        @change="changeBlock('x')"
        theme="column"
        :decimal-places="2"
      />
    </t-form-item>
    <t-form-item label="Y" name="y">
      <t-input-number
        v-model="block.y"
        @change="changeBlock('y')"
        theme="column"
        :decimal-places="2"
      />
    </t-form-item>
    <t-form-item label="宽" name="width">
      <t-input-number
        v-model="block.width"
        theme="column"
        @change="changeBlock('width')"
        :decimal-places="2"
      />
    </t-form-item>
    <t-form-item label="高" name="height">
      <t-input-number
        v-model="block.height"
        theme="column"
        @change="changeBlock('height')"
        :decimal-places="2"
      />
    </t-form-item>
    <t-form-item label="锁定宽高比" name="ratio">
      <t-switch v-model="brush.ratio"  @change="changeBrush('ratio')" />
    </t-form-item>
    <t-form-item label="旋转" name="rotate">
      <t-input-number
        v-model="brush.rotate"
        theme="column"
        @change="changeBrush('rotate')"
      />
    </t-form-item>
    <t-form-item label="水平翻转" name="flipX">
      <t-switch v-model="brush.flipX" @change="changeBrush('flipX')" />
    </t-form-item>
    <t-form-item label="垂直翻转" name="flipY">
      <t-switch v-model="brush.flipY" @change="changeBrush('flipY')" />
    </t-form-item>
    <t-form-item label="设置标签" name="tags">
      <t-tag-input v-model="brush.tags"  @change="changeBrush('tags')" excess-tags-display-type="break-line" clearable />
    </t-form-item>
  </t-form>
</template>

<script lang="ts" setup>
  import useBrush from '@/Hooks/useBrush'
const { brush, block, changeBlock, changeBrush } = useBrush()
</script>
