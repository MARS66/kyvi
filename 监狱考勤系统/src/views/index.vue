<!--
 * @Description: 
 * @Author: Kevin
 * @Date: 2024-04-09 11:14:48
 * @LastEditors: Kevin
 * @LastEditTime: 2024-10-31 20:31:09
-->
<template>
  <div class="dashboard-editor-container">
    <panel-group ref="panel" @showChart="isShow = true" />

    <el-row style="background: #fff; padding: 16px 16px 0">
      <div class="annotation">
        <div class="types">
          <span v-for="item in workTypes" :key="item.mark">
            {{ item.name + "：" + item.mark }}
          </span>
        </div>
        <el-button type="success" @click="isShow = true">图表</el-button>
      </div>
      <el-calendar v-model="date">
        <template slot="dateCell" slot-scope="{ date, data }">
          <div class="time">
            {{ data.day.split("-")[2] }}
          </div>
          <div class="att">上午：{{ attendance0[data.day] }}</div>
          <div class="att">下午：{{ attendance1[data.day] }}</div>
          <div class="att">晚上：{{ attendance2[data.day] }}</div>
        </template>
      </el-calendar>
    </el-row>
    <el-dialog title="考勤分析" :visible.sync="isShow" width="60%">
      <PieChart :isShow.sync="isShow"></PieChart>
    </el-dialog>
  </div>
</template>

<script>
import PanelGroup from "./dashboard/PanelGroup";
import PieChart from "./dashboard/PieChart.vue";
import { mapGetters } from "vuex";
import dayjs from "dayjs";
import { listReport } from "@/api/attendance/report";
import { nameToMark, workTypes } from "@/utils/work-type";
import { summary, leaveSummary } from "@/utils/summary";
export default {
  name: "Index",
  components: {
    PanelGroup,
    PieChart,
  },
  data() {
    return {
      workTypes,
      date: "",
      isShow: false,
      reportList: [],
      attendance0: {},
      attendance1: {},
      attendance2: {},
    };
  },
  computed: {
    ...mapGetters(["user"]),
  },
  mounted() {
    this.getList(dayjs().format("YYYY-MM"));
  },
  watch: {
    date() {
      getList(dayjs(val).format("YYYY-MM"));
    },
  },
  methods: {
    getList(month) {
      listReport({
        month,
        pageNum: 1,
        pageSize: 10,
        userId: this.user.userId,
      }).then((response) => {
        this.reportList = response.rows;
        const sum = {};
        sum.attDays = summary(response.rows, "出勤");
        sum.leaveDays = leaveSummary(response.rows);
        sum.overtimeDays = sum.attDays > 22 ? sum.attDays - 22 : 0;
        this.$refs.panel.setValue(sum, this.user.userId);
        response.rows.forEach((item, index) => {
          const date = {};
          item.attendance.forEach((el) => {
            date[el.attDate] = nameToMark(el.attType);
          });
          this[`attendance${index}`] = date;
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 15px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
  }
  ::v-deep.el-calendar-day {
    // position: relative;
    .time {
      font-size: 12px;
      color: #606266;
      text-align: end;
      // position: absolute;
      // top: 0;
      // left: 0;
    }
    .att {
      font-size: 14px;
      line-height: 20px;
      color: #333333b8;
    }
  }
  ::v-deep .el-calendar-table__row {
    td:nth-child(6) .time,
    td:nth-child(7) .time {
      color: #f11;
    }
  }
}
::v-deep .el-calendar-table {
  th:nth-child(6),
  th:nth-child(7) {
    color: #f11;
  }
}

@media (max-width: 1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
