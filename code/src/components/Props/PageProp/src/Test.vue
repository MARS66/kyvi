<!--
 * @Description: 
 * @Author: Kevin
 * @Date: 2024-10-17 10:06:06
 * @LastEditors: Kevin
 * @LastEditTime: 2024-10-17 13:53:01
-->
<template>
  <div class="test">
    <Form :form-list=map></Form>
  </div>
</template>
<script  lang="ts" setup>
import Form from '@/components/Form'
import {computed, onMounted, reactive} from "vue";

const globalConfigProps = {
    color: "",
    activeColor: "",
    hoverColor: "",
    hoverBackground: "",
    anchorColor: "",
    anchorRadius: "",
    anchorBackground: "",
    dockColor: "",
    dragColor: "",
    animateColor: "",
    textColor: "",
    fontFamily: "",
    fontSize: "",
    lineHeight: "",
    textAlign: "",
    textBaseline: "",
    rotateCursor: "",
    hoverCursor: "",
    disableInput: false,
    disableRotate: false,
    disableAnchor: false,
    disableEmptyLine: false,
    disableRepeatLine: false,
    disableScale: false,
    disableDockLine: false,
    disableTranslate: false,
    minScale: 0.1,
    maxScale: 10,
    autoAnchor: true,
    interval: 10,
    animateInterval: 10,
    textRotate: true,
    textFlip: false
}

let m = reactive(globalConfigProps)

function loadOptionsFromMeta2d(options, target) {
  for (let i in target) {
    if (target[i]) continue
    target[i] = (options[i] || target[i])
  }
}

onMounted(() => {
  init()
})

function init() {
  const options = cobweb.getOptions()
  loadOptionsFromMeta2d(options, m)
  for (let p in m) {
    cobweb.setOptions({
      [p]: m[p]
    })
  }
  cobweb.render()
}
function setOptionFunc(prop) {
  return (value) => {
    cobweb.setOptions({
      [prop]: value
    })
    cobweb.render()
  }
}
const map = computed(() => {
  return [
    {
      title: "画笔", //显示名
      children: [
        {
          title: "默认颜色",
          type: "color",
          prop: "color",
          bindProp: m,// 绑定的属性
          event: "change",
          func: setOptionFunc('color')
        },
        {
          title: "选中颜色",
          type: "color",
          prop: "activeColor",
          bindProp: m,// 绑定的属性
          event: "change",
          func: setOptionFunc('activeColor')
        },
        {
          title: "hover颜色",
          type: "color",
          prop: "hoverColor",
          bindProp: m,// 绑定的属性
          event: "change",
          func: setOptionFunc("hoverColor")
        },
        {
          title: "hover背景",
          type: "color",
          prop: "hoverBackground",
          bindProp: m,// 绑定的属性
          event: "change",
          func: setOptionFunc('hoverBackground')
        }
      ]
    }, {
      title: "锚点", //显示名
      children: [
        {
          title: "锚点颜色",
          type: "color",
          prop: "anchorColor",
          event: "change",
          bindProp: m, // 绑定的属性
          func: setOptionFunc('anchorColor')
        },
        {
          title: "锚点半径",
          type: "number",
          prop: "anchorRadius",
          bindProp: m, // 绑定的属性
          event: "change",
          func: setOptionFunc('anchorRadius')
        },
        {
          title: "背景颜色",
          type: "color",
          prop: "anchorBackground",
          bindProp: m, // 绑定的属性
          event: "change",
          func: setOptionFunc('anchorBackground')
        }
      ]
    },
    {
      title: "辅助线", //显示名
      children: [
        {
          title: "锚点颜色",
          type: "color",
          prop: "dockColor",
          event: "change",
          bindProp: m, // 绑定的属性
          func: setOptionFunc('dockColor')
        },
        {
          title: "框选颜色",
          type: "color",
          prop: "dragColor",
          bindProp: m, // 绑定的属性
          event: "change",
          func: setOptionFunc('dragColor')
        },
        {
          title: "连线动画颜色",
          type: "color",
          prop: "animateColor",
          bindProp: m, // 绑定的属性
          event: "change",
          func: setOptionFunc('animateColor')
        }
      ]
    },
    {
      title: "文字", //显示名
      children: [
        {
          title: "颜色",
          type: "color",
          prop: "textColor",
          event: "change",
          bindProp: m, // 绑定的属性
          func: setOptionFunc('textColor')
        },
        {
          title: "字体",
          type: "input",
          prop: "fontFamily",
          bindProp: m, // 绑定的属性
          event: "change",
          func: setOptionFunc('fontFamily')
        },
        {
          title: "大小",
          type: "number",
          prop: "fontSize",
          bindProp: m, // 绑定的属性
          event: "change",
          func: setOptionFunc('fontSize')
        },
        {
          title: "行高",
          type: "number",
          prop: "lineHeight",
          bindProp: m, // 绑定的属性
          event: "change",
          func: setOptionFunc('lineHeight')
        },
        {
          title: "水平对齐",
          type: "input",
          prop: "textAlign",
          bindProp: m, // 绑定的属性
          event: "change",
          func: setOptionFunc('textAlign')
        },
        {
          title: "垂直对齐",
          type: "input",
          prop: "textBaseline",
          bindProp: m, // 绑定的属性
          event: "change",
          func: setOptionFunc('textBaseline')
        }
      ]
    },
    {
      title: "禁止", //显示名
      children: [
        {
          title: "双击输入",
          type: "switch",
          prop: "disableInput",
          event: "change",
          bindProp: m, // 绑定的属性
          func: setOptionFunc('disableInput')
        },
        {
          title: "旋转",
          type: "switch",
          prop: "disableRotate",
          bindProp: m, // 绑定的属性
          event: "change",
          func: setOptionFunc('disableRotate')
        }, {
          title: "锚点显示",
          type: "switch",
          prop: "disableAnchor",
          bindProp: m, // 绑定的属性
          event: "change",
          func: setOptionFunc('disableAnchor')
        },
        // {
        //   title: "禁止存在两端关联缺少的连线",
        //   type: "switch",
        //   prop: "disableEmptyLine",
        //   bindProp: m, // 绑定的属性
        //   event: "change",
        //   func: setOptionFunc('disableEmptyLine')
        // },
        // {
        //   title: "禁止存在关联重复的连线",
        //   type: "switch",
        //   prop: "disableRepeatLine",
        //   bindProp: m, // 绑定的属性
        //   event: "change",
        //   func: setOptionFunc('disableRepeatLine')
        // },
        {
          title: "缩放",
          type: "switch",
          prop: "disableScale",
          bindProp: m, // 绑定的属性
          event: "change",
          func: setOptionFunc('disableScale')
        },
        {
          title: "辅助线",
          type: "switch",
          prop: "disableDockLine",
          bindProp: m, // 绑定的属性
          event: "change",
          func: setOptionFunc('disableDockLine')
        },
        {
          title: "移动",
          type: "switch",
          prop: "disableTranslate",
          bindProp: m, // 绑定的属性
          event: "change",
          func: setOptionFunc('disableTranslate')
        }
      ]
    },
    {
      title: "画布", //显示名
      children: [
        {
          title: "画布最小缩放比例",
          type: "number",
          prop: "minScale",
          event: "change",
          bindProp: m, // 绑定的属性
          func: setOptionFunc('minScale')
        },
        {
          title: "画布最大缩放比例",
          type: "number",
          prop: "maxScale",
          bindProp: m, // 绑定的属性
          event: "change",
          func: setOptionFunc('maxScale')
        }
      ]
    },
    {
      title: "其他设置", //显示名
      children: [
        {
          title: "自动选中节点锚点",
          type: "switch",
          prop: "autoAnchor",
          event: "change",
          bindProp: m, // 绑定的属性
          func: setOptionFunc('autoAnchor')
        },
        {
          title: "绘画帧时长",
          type: "number",
          prop: "interval",
          option:{
            min:1
          },
          bindProp: m, // 绑定的属性
          event: "change",
          func: setOptionFunc('interval')
        },
        {
          title: "动画帧时长",
          type: "number",
          prop: "animateInterval",
          option:{
            min:1
          },
          bindProp: m, // 绑定的属性
          event: "change",
          func: setOptionFunc('animateInterval')
        }, {
          title: "文字是否选择",
          type: "switch",
          prop: "textRotate",
          bindProp: m, // 绑定的属性
          event: "change",
          func: setOptionFunc('textRotate')
        },
        {
          title: "文字是否镜像",
          type: "switch",
          prop: "textFlip",
          bindProp: m, // 绑定的属性
          event: "change",
          func: setOptionFunc('textFlip')
        }
      ]
    },
  ]
})
</script>
<style scoped lang="postcss">

.test{
  height:100%;
}
</style>