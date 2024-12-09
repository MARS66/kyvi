<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-form
          :model="queryParams"
          ref="queryForm"
          size="small"
          :inline="true"
          v-show="showSearch"
          label-width="68px"
        >
          <el-form-item label="月份" prop="date">
            <el-date-picker
              v-model="queryParams.date"
              type="month"
              value-format="yyyy-MM"
              placeholder="选择月"
              :clearable="false"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="部门" prop="deptId">
            <el-cascader
              v-model="queryParams.deptId"
              :options="deptOptions"
              :props="{ checkStrictly: true, value: 'id' }"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="姓名" prop="name">
            <el-input
              v-model="queryParams.name"
              placeholder="请输入警员姓名查询"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-search"
              size="mini"
              @click="handleQuery"
            >
              搜索
            </el-button>
            <el-button
              icon="el-icon-download"
              size="mini"
              @click="handleExport"
              v-hasPermi="['attendance:type:export']"
            >
              导出
            </el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <right-toolbar
        :search="false"
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>
    <div class="annotation">
      <span v-for="item in workTypes" :key="item.mark">
        {{ item.name + "：" + item.mark }}
      </span>
    </div>
    <div class="table-outer">
      <el-table
        v-loading="loading"
        :data="reportList"
        stripe
        :key="key"
        height="100%"
        :span-method="objectSpanMethod"
        :header-cell-class-name="isWorkday"
        :cell-class-name="isWorkday"
      >
        <el-table-column label="姓名" align="center" prop="name" fixed="left" />
        <el-table-column
          label="时间段"
          prop="timeType"
          align="center"
          fixed="left"
        />
        <el-table-column label="考勤情况" align="center">
          <el-table-column
            v-for="item in daysInMonth"
            :key="item"
            :label="'' + item"
            align="center"
          >
            <template slot-scope="scope">
              <el-tooltip
                effect="dark"
                :content="getTip(scope)"
                placement="top"
              >
                <span> {{ getValue(scope) }}</span>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="考勤情况综合汇总" align="center">
          <el-table-column
            width="100px"
            v-for="item in Summary"
            align="center"
            :key="item"
            :label="item"
          >
            <template slot-scope="scope">
              {{ getSummary(scope) }}
            </template>
          </el-table-column>
        </el-table-column>
      </el-table>
    </div>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { listReport, addReport, updateReport } from "@/api/attendance/report";
import { deptTreeSelect } from "@/api/system/user";
import { getPersonUserProfile } from "@/api/person/user";
import { utils, writeFile } from "xlsx";
import { isWorkday } from "chinese-workday";
import { nameToMark, workTypes } from "@/utils/work-type";
import { summary, breakSummary } from "@/utils/summary";
import dayjs from "dayjs";
export default {
  name: "Report",
  data() {
    return {
      // 部门树选项
      deptOptions: [],
      defaultProps: {
        children: "children",
        label: "label",
      },
      workTypes,
      key: 1,
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 考勤数据填报表格数据
      reportList: [],
      // 弹出层标题
      title: "",
      approveStatus: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        employeeUserPhoneNumber: null,
        name: "",
        date: "",
      },
      Summary: [
        "探亲假",
        "休假",
        "婚假",
        "产假",
        "丧假",
        "学习",
        "病假",
        "事假",
        "补休",
        "出勤",
      ],
      focusLabelValue: "",
      daysInMonth: 31,
      // 表单参数
      form: {},
    };
  },
  created() {
    this.queryParams.date = dayjs().format("YYYY-MM");
    this.getDeptTree();
  },
  watch: {
    "queryParams.date"(val) {
      this.daysInMonth = dayjs(val).daysInMonth();
    },
  },
  computed: {
    ...mapGetters(["user"]),
  },
  methods: {
    isWorkday({ row, column }) {
      const date = `${this.queryParams.date}-${
        column.label.length > 1 ? column.label : "0" + column.label
      }`;
      return isWorkday(date) ? "" : "weekend";
    },
    /** 查询部门下拉树结构 */
    getDeptTree() {
      deptTreeSelect().then((response) => {
        this.deptOptions = response.data;
        this.queryParams.deptId = this.user.deptId;
        this.getList();
      });
    },
    blurInput(row) {
      row.isFocus = false;
    },
    // 编辑考勤
    changeAttType({ row, column }) {
      const current = row.attendance.find((item) => {
        const time = dayjs(item.attDate).format("YYYY-MM-DD");
        return (
          time.split("-")[2] ===
          (column.label.length > 1 ? column.label : "0" + column.label)
        );
      });
      const attType = this.workTypes.find(
        (workType) => workType.mark === this.focusLabelValue
      )?.name;
      if (current?.id) {
        current.attType = attType;
        this.updateReport(current);
      } else {
        this.addReport({
          attDate: `${this.queryParams.date}-${
            column.label.length > 1 ? column.label : "0" + column.label
          }`,
          userId: row.userid,
          timeType: row.timeType,
          attType,
        });
      }
    },
    updateReport(data) {
      updateReport(data).then(() => {
        this.$message.success("已修改考勤记录");
        this.getList();
      });
    },
    addReport(data) {
      addReport(data).then(() => {
        this.$message.success("已修改考勤记录");
        this.getList();
      });
    },
    getTip({ row, column }) {
      const current = row.attendance.find((item) => {
        const time = dayjs(item.attDate).format("YYYY-MM-DD");
        return (
          time.split("-")[2] ===
          (column.label.length > 1 ? column.label : "0" + column.label)
        );
      });
      return current?.attType || "";
    },
    getValue({ row, column }) {
      const current = row.attendance.find((item) => {
        const time = dayjs(item.attDate).format("YYYY-MM-DD");
        return (
          time.split("-")[2] ===
          (column.label.length > 1 ? column.label : "0" + column.label)
        );
      });
      return nameToMark(current?.attType) || "";
    },
    getSummary({ row, column }) {
      const a = column.label.includes("假") ? breakSummary : summary;
      return a(
        this.reportList.filter((item) => item.userid === row.userid),
        column.label
      );
    },
    // 表格合并
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0 || columnIndex > 32) {
        if (rowIndex % 3 === 0) {
          return {
            rowspan: 3,
            colspan: 1,
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0,
          };
        }
      }
    },
    /** 查询考勤数据填报列表 */
    getList() {
      this.loading = true;
      const { deptId } = this.queryParams;
      listReport(
        Object.assign(this.queryParams, {
          month: this.queryParams.date,
          deptId: typeof deptId === "number" ? deptId : deptId?.slice(-1)[0],
        })
      ).then((response) => {
        this.reportList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        employeeUserPhoneNumber: null,
        attendanceReportId: null,
        daysInMonth: null,
        firstDayAttendance: null,
        secondDayAttendance: null,
        thirdDayAttendance: null,
        fourthDayAttendance: null,
        fifthDayAttendance: null,
        sixthDayAttendance: null,
        seventhDayAttendance: null,
        eighthDayAttendance: null,
        ninthDayAttendance: null,
        tenthDayAttendance: null,
        eleventhDayAttendance: null,
        twelfthDayAttendance: null,
        thirteenthDayAttendance: null,
        fourteenthDayAttendance: null,
        fifteenthDayAttendance: null,
        sixteenthDayAttendance: null,
        seventeenthDayAttendance: null,
        eighteenthDayAttendance: null,
        nineteenthDayAttendance: null,
        twentiethDayAttendance: null,
        twentyfirstDayAttendance: null,
        twentysecondDayAttendance: null,
        twentythirdDayAttendance: null,
        twentyfourthDayAttendance: null,
        twentyfifthDayAttendance: null,
        twentysixthDayAttendance: null,
        twentyseventhDayAttendance: null,
        twentyeighthDayAttendance: null,
        twentyninthDayAttendance: null,
        thirtiethDayAttendance: null,
        thirtyfirstDayAttendance: null,
        attendanceSummary: null,
        parentalLeaveSummary: null,
        vacationLeaveSummary: null,
        marriageLeaveSummary: null,
        maternityLeaveSummary: null,
        bereavementLeaveSummary: null,
        sickLeaveSummary: null,
        personalLeaveSummary: null,
        studyLeaveSummary: null,
        compensatoryLeaveSummary: null,
        officialBusinessLeaveSummary: null,
        lactationLeaveSummary: null,
        companionLeaveSummary: null,
        physicalExamLeaveSummary: null,
        medicalMissionLeaveSummary: null,
        inspectionLeaveSummary: null,
        monitoringLeaveSummary: null,
        overtimeLeaveSummary: null,
        regularLeaveSummary: null,
        activityLeaveSummary: null,
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },

    /** 导出按钮操作 */
    handleExport() {
      const tableHtml = document.getElementsByTagName("table")[0];
      const tableHtml2 = document.getElementsByTagName("table")[1];
      const sheet = utils.table_to_sheet(tableHtml);
      const sheet2 = utils.table_to_sheet(tableHtml2);
      const newSheet = {};
      Object.keys(sheet2).forEach((key) => {
        const arr = key.split(/(\d+)/);
        if (!key.includes("!")) {
          newSheet[arr[0] + (parseInt(arr[1]) + 2)] = sheet2[key];
        } else if (key === "!merges") {
          newSheet[key] = sheet2[key].map((item) => {
            item.s.r += 2;
            item.e.r += 2;
            return item;
          });
        } else if (["!ref", "!fullref"].includes(key)) {
          const a = sheet2[key].split(/(\d+)/);
          newSheet[key] = a[0] + a[1] + a[2] + (parseInt(a[3]) + 2);
        } else {
          newSheet[key] = sheet2[key];
        }
      });
      const workbook = utils.book_new();
      utils.book_append_sheet(
        workbook,
        Object.assign(sheet, newSheet),
        "考勤记录"
      );
      writeFile(workbook, "考勤记录.xls");
    },
  },
};
</script>
<style scoped lang="scss">
.table-outer {
  height: calc(100% - 165px);
  ::v-deep .weekend {
    color: #009bdd;
    background: #00acf60a !important;
  }
}
</style>
