<!--
 * @Description: 
 * @Author: Kevin
 * @Date: 2023-10-31 17:14:18
 * @LastEditors: Kevin
 * @LastEditTime: 2024-08-28 16:05:28
-->
<template>
  <div class="app-props">
    <PageProp v-if="selections.mode === SelectionMode.File" />
    <MetaProp v-else-if="selections.mode === SelectionMode.Pen" />
  </div>
</template>

<script lang="ts" setup>
import PageProp from "./PageProp";
import MetaProp from "./MetaProp";

import { useSelection, SelectionMode } from "@/services/selections";
const { selections } = useSelection();
</script>
<style lang="postcss" scoped>
.app-props {
  border-left: 1px solid var(--color-border);
  z-index: 2;
  overflow-y: auto;

  :deep(.t-tabs) {
    height: 100%;
    .t-tabs__content {
      height: calc(100% - 48px);
      .t-tab-panel {
        height: 100%;
        overflow-y: auto;
      }
    }
  }
}
</style>
