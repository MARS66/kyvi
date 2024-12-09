<!--
 * @Description: 
 * @Author: Kevin
 * @Date: 2024-10-18 11:07:21
 * @LastEditors: Kevin
 * @LastEditTime: 2024-10-29 15:02:51
-->
<template>
  <div class="c-preview">
    <div  id="cobweb"></div>
  </div>
</template>

<script>
import { Meta2d } from "@kyvi/cobweb";
import alarm from "./alarm";
import  xt  from "@/utils/xxtea";
export default {
  name: 'CobwebPreview',
  props: {
    cobweb: String
  },
  mixins:[alarm],
  data() {
    return {
      dataId:'',
    }
  },
  mounted() {
    window.cobweb =  new Meta2d("cobweb", {rule: false});
    const json=xt.xxtea_decrypt(this.cobweb)
    if (!json) return;
    const data = JSON.parse(json);
    data.locked = 1;
    window.cobweb.open(data);
    window.cobweb.fitView();
    window.cobweb.on("click", this.lookTrend); 
    window.cobweb.on("contextmenu", this.setThreshold) 
  },
  destroy(){
    window.cobweb.destroy();
  },
  methods: {
    lookTrend(e) {
      if (!e.pen) return;
      if (e.pen?.form?.length&&e.pen?.form[0]?.key === 'text') {
        const dataId =this.getDataId(e.pen)
       this.$emit('event',{type:'click',id:dataId})
      }
    },
    getDataId(pen) {
      let dataId = pen.form?.find(item => item.key === 'text')?.dataIds?.dataId
      if (dataId) return dataId;
      (pen.children || []).forEach((id) => {
        const data = window.cobweb.find(id)?.form?.find(item => item.key === 'text')?.dataIds?.dataId
        if (data) {
          dataId = data
          return false;
        }
      })
    },
    setThreshold(e) {
      if (!e.pen) return;
      if (e.pen?.form?.length&&e.pen?.form[0]?.key === 'text') {
        const dataId = e?.pen?.id ?? '';
        this.$emit('event',{type:'contextmenu',id:dataId})
      }
    }
  },
}
</script>

<style scoped>
.c-preview{
  height: 100vh;
}
#cobweb {
  height: 100%;
  display: flex;
}
</style>
