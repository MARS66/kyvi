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
              @click="syncAttendance"
              v-hasPermi="['attendance:type:listHnc']"
            >
              考勤机同步
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
      <span v-for="item in workTypes" :key="item.name">
        {{ item.name + "：" + item.mark }}
      </span>
      <span style="color: #e6a23c"
        >双击修改，快捷修改：选中 + Enter标记出勤、选中 + Backspace清除
      </span>
    </div>
    <div class="table-outer">
      <el-table
        v-loading="loading"
        :data="reportList"
        :key="key"
        height="100%"
        :span-method="objectSpanMethod"
        :header-cell-class-name="isWorkday"
        :cell-class-name="isWorkday"
        @cell-dblclick="tabClick"
        @cell-click="cellClick"
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

    <el-dialog
      title="编辑考勤"
      :visible.sync="dialogFormVisible"
      width="400px"
      top="0"
    >
      <el-form :model="form" label-width="120px">
        <el-form-item label="类型：">
          <el-select v-model="form.attType" placeholder="请选择" clearable>
            <el-option
              v-for="item in workTypes"
              :key="item.name"
              :label="item.name"
              :value="item.name"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部门：">
          <div>{{ form.deptName }}</div>
        </el-form-item>
        <el-form-item label="姓名：">
          <div>{{ form.name }}</div>
        </el-form-item>
        <el-form-item label="时间：">
          <div>{{ form.attDate + form.timeType }}</div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateReport">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { listReport, batchAttendance, listHnc } from "@/api/attendance/report";
import { getPersonUserProfile } from "@/api/person/user";
import { utils, writeFile } from "xlsx";
import { code2status } from "./report.js";
import { isWorkday } from "chinese-workday";
import { nameToMark, workTypes } from "@/utils/work-type";
import { summary, breakSummary } from "@/utils/summary";
import dayjs from "dayjs";
export default {
  name: "Report",
  data() {
    return {
      sys_attendance_time: [],
      form: {
        deptName: "",
        attDate: "",
        attType: "",
        timeType: "",
        userId: 1,
      },
      dialogFormVisible: false,
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
  async created() {
    window.addEventListener("keydown", this.handleKeyDown);
    this.queryParams.date = dayjs().format("YYYY-MM");
    this.getList();
    const { data } = await this.getDicts("sys_attendance");
    this.sys_attendance_time = data;
  },
  computed: {
    ...mapGetters(["user"]),
  },
  watch: {
    "queryParams.date"(val) {
      this.daysInMonth = dayjs(val).daysInMonth();
    },
  },
  methods: {
    isWorkday({ row, column }) {
      const date = `${this.queryParams.date}-${
        column.label.length > 1 ? column.label : "0" + column.label
      }`;
      return isWorkday(date) ? "" : "weekend";
    },
    async syncAttendance() {
      this.loading = true;
      const { list } = await listHnc({
        startTime: dayjs().format("YYYY-MM") + "-01 00:00:00",
        endTime: dayjs().format("YYYY-MM") + "-31 00:00:00",
      });
      if (list === null || list.length === 0) {
        this.loading = false;
        this.$message.info("暂无考勤记录！");
        return;
      }
      const att = [];
      for (let index = 1; index < 32; index++) {
        const classes = {};
        const day = index < 10 ? "0" + index : index;
        const current = dayjs().format("YYYY-MM") + "-" + day;
        // 当天早上打卡人员
        classes.zsdk = this.getBetween(list, "上班打卡", current);
        classes.cd = this.getBetween(list, "迟到", current);
        classes.zt = this.getBetween(list, "早退", current);
        classes.xwdk = this.getBetween(list, "下班打卡", current);
        // 白天正常出勤
        classes.zsdk.forEach((item) => {
          att.push({
            attDate: current,
            userId: item.userid,
            timeType: "早上",
            attType: "出勤",
          });
        });

        classes.xwdk.forEach((item) => {
          att.push({
            attDate: current,
            userId: item.userid,
            timeType: "下午",
            attType: "出勤",
          });
        });
        // 迟到
        classes.cd.forEach((item) => {
          if (!classes.zsdk.some((i) => i.userid === item.userid)) {
            att.push({
              attDate: current,
              userId: item.userid,
              timeType: "早上",
              attType: "迟到",
            });
          }
        });
        // 早退
        classes.zt.forEach((item) => {
          if (!classes.xwdk.some((i) => i.userid === item.userid)) {
            att.push({
              attDate: current,
              userId: item.userid,
              timeType: "下午",
              attType: "早退",
            });
          }
        });
      }
      batchAttendance(att)
        .then(() => {
          this.$message.success("已同步最新考勤记录");
          this.loading = false;
          this.getList();
        })
        .catch(() => {
          this.$message.warning("数据异常情联系管理员");
          this.loading = false;
        });
    },
    getBetween(data, type, day) {
      const timeT = this.sys_attendance_time.map((item) => ({
        type: item.dictLabel,
        start: item.dictValue.split("-")[0],
        end: item.dictValue.split("-")[1],
      }));
      // 早上迟到
      return data.filter(
        (c) =>
          dayjs(c.time).isAfter(
            day + timeT.find((i) => i.type === type).start
          ) &&
          dayjs(c.time).isBefore(day + timeT.find((i) => i.type === type).end)
      );
    },
    tabClick(row, column) {
      if ((row.status && row.status !== 0) || row.status !== null) {
        this.$message.warning("当前考勤已提交，不可再更改！！");
        return;
      }
      if (!parseInt(column.label)) return;
      this.dialogFormVisible = true;
      this.form = {
        deptName: row.deptName,
        name: row.name,
        attDate: `${this.queryParams.date}-${
          column.label.length > 1 ? column.label : "0" + column.label
        }`,
        userId: row.userid,
        timeType: row.timeType,
        attType: this.getLabel({ row, column }),
      };
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
    updateReport() {
      // const attType =
      //   this.workTypes.find((workType) => workType.mark === this.form.attType)
      //     ?.name || " ";
      this.dialogFormVisible = false;
      batchAttendance([
        {
          attDate: this.form.attDate,
          attType: this.form.attType || " ",
          userId: this.form.userId,
          timeType: this.form.timeType,
        },
      ]).then(() => {
        this.$message.success("已修改考勤记录");
        this.getList();
      });
    },
    addReport(data) {
      batchAttendance([data]).then(() => {
        this.$message.success("已修改考勤记录");
        this.getList();
      });
    },
    getLabel({ row, column }) {
      const current = row.attendance.find((item) => {
        const time = dayjs(item.attDate).format("YYYY-MM-DD");
        return (
          time.split("-")[2] ===
          (column.label.length > 1 ? column.label : "0" + column.label)
        );
      });
      return current?.attType ?? "";
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
      // this.loading = true;
      listReport({
        ...this.queryParams,
        month: this.queryParams.date,
        deptId: this.user.deptId,
      }).then((response) => {
        this.reportList = response.rows;
        this.total = response.total;
        this.loading = false;
        this.keyDownEdit = false;
        if (this?.cell?.style) this.cell.style.background = "unset";
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
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
    resetForm(name) {
      this.$refs[name]?.resetFields();
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
    cellClick(row, column, cell) {
      if (!parseInt(column.label)) return;
      if (this.cell) this.cell.classList.remove("select_cell");
      cell.classList.add("select_cell");
      this.cell = cell;
      this.keyDownEdit = true;
      this.form = {
        status: row.status,
        deptName: row.deptName,
        name: row.name,
        attDate: `${this.queryParams.date}-${
          column.label.length > 1 ? column.label : "0" + column.label
        }`,
        userId: row.userid,
        timeType: row.timeType,
        attType: "出勤",
      };
    },
    handleKeyDown(event) {
      if (!this.keyDownEdit) return;

      if (event.key === "Enter") {
        if (
          (this.form.status && this.form.status !== 0) ||
          this.form.status !== null
        ) {
          this.$message.warning("当前考勤已提交，不可再更改！！");
          return;
        }
        this.updateReport();
      }
      if (event.key === "Delete" || event.key === "Backspace") {
        if (
          (this.form.status && this.form.status !== 0) ||
          this.form.status !== null
        ) {
          this.$message.warning("当前考勤已提交，不可再更改！！");
          return;
        }
        this.form.attType = " ";
        this.updateReport();
      }
      this.keyDownEdit = false;
    },
  },
};
</script>
<style scoped lang="scss">
.table-outer {
  height: calc(100% - 165px);
  ::v-deep .weekend {
    color: #009bdd;
    background: #00acf60a;
  }
  ::v-deep .select_cell {
    background: #00acf63d !important;
  }
}
::v-deep .el-dialog__wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
