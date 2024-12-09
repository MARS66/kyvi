<!--
 * @Description: 
 * @Author: Kevin
 * @Date: 2024-09-06 09:43:43
 * @LastEditors: Kevin
 * @LastEditTime: 2024-09-20 14:55:18
-->
<template>
   <n-config-provider :theme-overrides="themeOverrides" abstract>
    <n-message-provider closable keep-alive-on-hover>
      <n-dialog-provider>
        <router-view />
      </n-dialog-provider>
    </n-message-provider>
  </n-config-provider>
</template>
<script lang="ts" setup>
  import { themeOverrides } from '@/styles/themes/naive-ui-theme-overrides'
</script>
