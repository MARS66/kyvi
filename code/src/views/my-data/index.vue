<!--
 * @Description: 
 * @Author: Kevin
 * @Date: 2024-09-06 16:12:51
 * @LastEditors: Kevin
 * @LastEditTime: 2024-09-14 10:15:20
-->
<template>
  <n-empty description="我的数据-建设中" >
    
  </n-empty>
</template>

<script lang='ts'>
import { defineComponent, onMounted } from 'vue'

export default defineComponent({
  name: 'MyData',
  components: {
  },
  setup() {

    onMounted(() => {
      console.log('建设中。。。')
    })
  },
})
</script>
