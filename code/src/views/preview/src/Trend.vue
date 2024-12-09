<template>
  <n-modal
    v-model:show="visibleTrendDialog"
    preset="dialog"
    :show-icon="false"
    title="趋势查看"
    style="width: 60vw;"
    contentClass="trend-modal"
    :maskClosable="false"
    :onMaskClick="closeDialog"
    @close="closeDialog"
  >
    <div id="monthDate" class="eChart"/>
  </n-modal>
</template>
<script lang="ts" setup>
import { defineProps ,ref,watch,defineEmits,nextTick} from 'vue'
import { UPDATE_MODEL_EVENT } from '@/utils/constants'
import * as ECharts from 'echarts';
import axios from 'axios'
const visibleTrendDialog = ref(false);
const props = defineProps({
  dataId: {
    type: String,
    required: true,
  },
  modelValue: {
    type: Boolean,
    required: true,
  }
})
const requestTrend = () => {
  const { trendApiConfig }=cobweb.store.data
  if (!trendApiConfig) return;
  axios({
    method:trendApiConfig.apiMethod,
    url:trendApiConfig.api,
  });
}
const emits = defineEmits([UPDATE_MODEL_EVENT])
watch(() => props.modelValue, val => {
  if (val) {
    visibleTrendDialog.value = true
    initEChart(43, [])
    requestTrend()
  } else {
    visibleTrendDialog.value = false
  }
})
const option = {
  color: ['rgb(255, 70, 131)', '#74f0ff'],
  tooltip: {
    trigger: 'axis',
    formatter: ([{ seriesName, value }]) => {
      return `时间：${value[0]}<br/>瞬时值：${value[1]}`
    },
    position: (pt) => [pt[0], '10%']
  },
  grid: {
    top:'10px',
    left:'40px',
    right:'40px',
    bottom:'30px',
  },
  xAxis: {
    type: 'time',
    boundaryGap: false,
    axisLine: {
      show: true,
      style: {
        stroke: 'rgba(255, 255, 255, 0.5)'
      }
    },
    axisLabel: {
      color: 'rgba(255, 255, 255, 0.5)',
      showMaxLabel: true
    },
    splitLine: {
      show: false
    }
  },
  yAxis: {
    type: 'value',
    boundaryGap: [0, '100%'],
    axisLabel: {
      color: 'rgba(255, 255, 255, 0.5)'
    },
    splitLine: {
      lineStyle: {
        // type:[5, 10],
        color: 'rgba(255, 255, 255, 0.5)',
        width: 0.2
      }
    }
  },
  dataZoom: [
    {
      type: 'inside',
      orient: 'vertical',
      start: 0,
      end: 100
    },
    {
      type: 'inside',
      orient: 'horizontal',
      start: 0,
      end: 100
    }
  ],
  series: [],
  itemCodes: []
};
const initEChart = (avg: any, data: any) => {
  nextTick(() => {
   const  chartBox = ECharts.init(document.getElementById('monthDate'));
    const series = [
      {
        name: '趋势',
        type: 'line',
        symbol: 'none',
        sampling: 'lttb',
        // areaStyle: {
        //   color: new ECharts.graphic.LinearGradient(0, 0, 0, 1, [
        //     {
        //       offset: 0,
        //       color: 'rgb(255, 70, 131)'
        //     },
        //     {
        //       offset: 1,
        //       color: 'rgb(255, 70, 131,0.2)'
        //     }
        //   ])
        // },
        // data
        data: createData()
      },
      {
        name: 'line',
        type: 'line',
        stack: 'all',
        symbolSize: 6,
        markLine: {
          data: [
            {
              'name': '近24h均值',
              'yAxis': avg?.toFixed(2),
              'label': {
                'formatter': '{c}',
                'position': 'end'
              }
            }
          ],
          label: {
            distance: [5, 8],
            color:'#74f0ff'
          }
        }
      }
    ]
    option.series = series
    chartBox.setOption(option, true)
    // 根据页面大小自动响应图表大小
    window.addEventListener('resize', () => {
      chartBox.resize()
    })
  })
};
 function createData() {
      let base = +new Date(1988, 9, 3)
      const oneDay = 24 * 3600 * 1000
      const data = [[base, Math.random() * 300]]
      for (let i = 1; i < 20000; i++) {
        const now = new Date((base += oneDay))
        data.push([+now, Math.round((Math.random() - 0.5) * 20 + data[i - 1][1])])
      }
      return data
    }
const closeDialog = () => {
  visibleTrendDialog.value = false
  emits(UPDATE_MODEL_EVENT, false)
}
</script>
<style lang="postcss" scoped>
  .eChart{
    height: 50vh;
  }
</style>