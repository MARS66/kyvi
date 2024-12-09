<!--
 * @Description: 
 * @Author: Kevin
 * @Date: 2024-08-15 15:41:37
 * @LastEditors: Kevin
 * @LastEditTime: 2024-09-10 16:33:39
-->
<template>
  <t-form label-align="left">
    <t-form-item label="线条类型" name="dash">
      <t-select v-model="brush.dash" @change="changeBrush('dash')">
        <t-option :key="0" :value="0" label="实线"></t-option>
        <t-option :key="1" :value="1" label="虚线"></t-option>
      </t-select>
    </t-form-item>
    
    <!-- <t-form-item label="线条风格" name="dash">
      <t-select v-model="brush.fromArrow" @change="changeBrush('fromArrow')">
        <template #valueDisplay>
          <svg-icon prefix="l" :name="lineTypes.find(i=>i.value===brush.fromArrow)?.icon" />
        </template>
        <t-option v-for="item in lineTypes" :key="item.value" :value="item.value" class="overlay-options">
          <div>
            <svg-icon prefix="l" size="20" :name="item.icon" />
          </div>
        </t-option>
      </t-select>
    </t-form-item> -->
   
    <!-- <t-form-item label="起点类型" name="dash">
      <t-select v-model="brush.fromArrow" @change="changeBrush('fromArrow')">
        <template #valueDisplay>
          <svg-icon prefix="l" :name="fromArrows.find(i=>i.value===brush.fromArrow)?.icon" />
        </template>
        <t-option v-for="item in fromArrows" :key="item.value" :value="item.value" class="overlay-options">
          <div>
            <svg-icon prefix="l" size="20" :name="item.icon" />
          </div>
        </t-option>
      </t-select>
    </t-form-item>
    <t-form-item label="终点类型" name="dash">
      <t-select v-model="brush.toArrow" @change="changeBrush('toArrow')">
        <template #valueDisplay>
          <svg-icon prefix="l" :name="toArrows.find(i=>i.value===brush.fromArrow)?.icon" />
        </template>
        <t-option v-for="item in toArrows" :key="item.value" :value="item.value" class="overlay-options">
          <div>
            <svg-icon prefix="l" size="20" :name="item.icon" />
          </div>
        </t-option>
      </t-select>
    </t-form-item> -->
    <t-form-item label="线条宽度" name="lineWidth">
      <t-input-number
        :min="0"
        :max="100"
        :step="1"
        theme="column"
        v-model="brush.lineWidth"
        @change="changeBrush('lineWidth')"
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
    <t-form-item label="边框宽度" name="borderWidth">
      <t-input-number
        :min="0"
        :max="100"
        :step="1"
        theme="column"
        v-model="brush.borderWidth"
        @change="changeBrush('borderWidth')"
      />
    </t-form-item>

    <t-form-item label="边框颜色" name="borderColor">
      <t-color-picker
        enableAlpha
        v-model="brush.borderColor"
        format="CSS"
        :color-modes="['monochrome']"
        :show-primary-color-preview="false"
        @change="changeBrush('borderColor')"
      />
    </t-form-item>
    <t-form-item label="平滑度" name="gradientSmooth">
      <t-input-number
        v-model="brush.gradientSmooth"
        theme="column"
        @change="changeBrush('gradientSmooth')"
      />
    </t-form-item>
    <t-form-item label="圆角" name="borderRadius">
      <t-input-number
        :min="0"
        :max="1"
        :step="0.01"
        theme="column"
        v-model="brush.borderRadius"
        @change="changeBrush('borderRadius')"
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
import SvgIcon from "@/components/SvgIcon";
import useBrush from '@/Hooks/useBrush'
const { brush, changeBrush } = useBrush()

// const lineTypes = [
//   { name: "曲线", icon: "curve2", value: "curve" },
//   { name: "线段", icon: "polyline", value: "polyline" },
//   { name: "直线", icon: "line", value: "line" },
//   { name: "脑图曲线", icon: "mind", value: "mind" },
// ];

// const fromArrows = [
//   { icon: "line", value: "" },
//   { icon: "from-triangle", value: "triangle" },
//   { icon: "from-diamond", value: "diamond" },
//   { icon: "from-circle", value: "circle" },
//   { icon: "from-lineDown", value: "lineDown" },
//   { icon: "from-lineUp", value: "lineUp" },
//   { icon: "from-triangleSolid", value: "triangleSolid" },
//   { icon: "from-diamondSolid", value: "diamondSolid" },
//   { icon: "from-circleSolid", value: "circleSolid" },
//   { icon: "from-line", value: "line" },
// ];
// const toArrows = [
//   { icon: "line", value: "" },
//   { icon: "to-triangle", value: "triangle" },
//   { icon: "to-diamond", value: "diamond" },
//   { icon: "to-circle", value: "circle" },
//   { icon: "to-lineDown", value: "lineDown" },
//   { icon: "to-lineUp", value: "lineUp" },
//   { icon: "to-triangleSolid", value: "triangleSolid" },
//   { icon: "to-diamondSolid", value: "diamondSolid" },
//   { icon: "to-circleSolid", value: "circleSolid" },
//   { icon: "to-line", value: "line" },
// ];
// const changeArrow = (key: string) => {
  // 画布默认值
  // cobweb.store.data[key] = brush[key];
  // 活动层的箭头都变化
  // if (cobweb.store.active) {
  //   cobweb.store.active.forEach((pen: Pen) => {
  //     if (pen.type === PenType.Line) {
  //       pen.fromArrow = value;
  //       cobweb.setValue(
  //         {
  //           id: pen.id,
  //           fromArrow: pen.fromArrow,
  //         },
  //         {
  //           render: false,
  //         }
  //       );
  //     }
  //   });
  //   cobweb.render();
  // }
// };
</script>