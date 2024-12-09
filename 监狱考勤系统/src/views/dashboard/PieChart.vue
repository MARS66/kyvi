<template>
  <div style="width: 100%">
    <div>
      <el-select
        v-model="currentTime"
        @change="handlerChange"
        placeholder="请选择"
      >
        <el-option label="本日" value="本日" />
        <el-option label="本周" value="本周" />
        <el-option label="本月" value="本月" />
        <el-option label="本年" value="本年" />
      </el-select>
    </div>
    <div v-loading="loading" id="pie" style="height: 500px; width: 100%"></div>
  </div>
</template>

<script>
import * as echarts from "echarts";
require("echarts/theme/macarons"); // echarts theme
import resize from "./mixins/resize";
import dayjs from "dayjs";
import { summaryAttendance } from "@/api/attendance/report";

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: "chart",
    },
  },
  data() {
    return {
      chart: null,
      loading: true,
      currentTime: "本日",
      attTypes: ["出勤", "学习", "补休", "哺乳假", "体检", "体检", "活动"],
      overTimeTypes: ["加班"],
      breakTimeTypes: [
        "陪护假",
        "护理假",
        "育儿假",
        "事假",
        "病假",
        "丧假",
        "产假",
        "婚假",
        "年休假",
        "探亲假",
      ],
      otherTimeTypes: ["督察", "公差", "外医", "外医备勤", "监控"],
      errorTimeTypes: ["缺勤", "迟到"],
    };
  },
  mounted() {
    this.summary(dayjs().format("YYYY-MM-DD"));
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    handlerChange(key) {
      switch (key) {
        case "本日":
          this.summary(dayjs().format("YYYY-MM-DD"));
          break;
        case "本月":
          this.summary(dayjs().format("YYYY-MM"));
          break;
        case "本年":
          this.summary(dayjs().format("YYYY"));
          break;
        case "本周":
          this.getWeekDay();
          break;

        default:
          break;
      }
    },
    async summary(attDate) {
      this.loading = true;
      const { total: att } = await summaryAttendance({
        attDate,
        attType: this.attTypes,
      });
      const { total: overTime } = await summaryAttendance({
        attDate,
        attType: this.overTimeTypes,
      });
      const { total: breakTime } = await summaryAttendance({
        attDate,
        attType: this.breakTimeTypes,
      });
      const { total: otherTime } = await summaryAttendance({
        attDate,
        attType: this.otherTimeTypes,
      });
      const { total: errorTime } = await summaryAttendance({
        attDate,
        attType: this.errorTimeTypes,
      });
      this.initChart([
        { value: att, name: "出勤率", type: "att" },
        { value: overTime, name: "加班率", type: "overTime" },
        { value: breakTime, name: "请假率", type: "breakTime" },
        { value: otherTime, name: "其他率", type: "otherTime" },
        { value: errorTime, name: "异常率", type: "errorTime" },
      ]);
      this.loading = false;
    },
    // 获取周的数据
    async getWeekDay() {
      this.loading = true;
      const data = [
        { value: 0, name: "出勤率", type: "att" },
        { value: 0, name: "加班率", type: "overTime" },
        { value: 0, name: "请假率", type: "breakTime" },
        { value: 0, name: "其他率", type: "otherTime" },
        { value: 0, name: "异常率", type: "errorTime" },
      ];
      for (let index = 0; index < 7; index++) {
        const { total: att } = await summaryAttendance({
          attDate: dayjs().day(1).add(index, "day").format("YYYY-MM-DD"),
          attType: this.attTypes,
        });
        data[0].value += att;
        const { total: overTime } = await summaryAttendance({
          attDate: dayjs().day(1).add(index, "day").format("YYYY-MM-DD"),
          attType: this.overTimeTypes,
        });
        data[1].value += overTime;
        const { total: breakTime } = await summaryAttendance({
          attDate: dayjs().day(1).add(index, "day").format("YYYY-MM-DD"),
          attType: this.breakTimeTypes,
        });
        data[2].value += breakTime;
        const { total: otherTime } = await summaryAttendance({
          attDate: dayjs().day(1).add(index, "day").format("YYYY-MM-DD"),
          attType: this.otherTimeTypes,
        });
        data[3].value += otherTime;
        const { total: errorTime } = await summaryAttendance({
          attDate: dayjs().day(1).add(index, "day").format("YYYY-MM-DD"),
          attType: this.errorTimeTypes,
        });
        data[4].value += errorTime;
      }
      this.loading = false;
      console.log(data);
      this.initChart(data);
    },
    initChart(data) {
      this.chart = echarts.init(document.getElementById("pie"), "macarons");

      this.chart.setOption({
        tooltip: {
          trigger: "item",
          formatter: ({ name, data, percent }) => {
            return `
            类型：${this[data.type + "Types"]?.join("、")}
            <br/>
            ${name} : ${percent}%`;
          },
        },
        legend: {
          left: "center",
          bottom: "10",
          data: data.map((item) => item.name),
        },
        series: [
          {
            name: "考勤数据分析",
            type: "pie",
            roseType: "radius",
            radius: [0, 98],
            center: ["50%", "38%"],
            data,
            animationEasing: "cubicInOut",
            animationDuration: 2600,
          },
        ],
      });
    },
  },
};
</script>
