<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8">
      <el-col :span="23">
        <el-form
          :model="queryParams"
          ref="queryForm"
          size="small"
          v-show="showSearch"
          label-width="80px"
        >
          <el-row :gutter="24">
            <el-col :span="6">
              <el-form-item label="月份" prop="month">
                <el-date-picker
                  v-model="queryParams.month"
                  type="month"
                  value-format="yyyy-MM"
                  placeholder="选择月"
                  :clearable="false"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="状态" prop="status">
                <el-select
                  v-model="queryParams.status"
                  style="width: 100%"
                  placeholder="请选择"
                >
                  <el-option label="全部" :value="undefined" />
                  <el-option
                    v-for="(item, index) in flows"
                    :key="item"
                    :label="item"
                    :value="[index]"
                  />
                  <!-- <el-option label="已提交" :value="[1]" /> -->
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item
                label="部门"
                prop="deptId"
                v-if="notLookSelf"
                v-hasPermi="['system:user:list']"
              >
                <el-cascader
                  style="width: 100%"
                  v-model="queryParams.deptId"
                  :options="deptOptions"
                  :props="{ checkStrictly: true, value: 'id' }"
                  :show-all-levels="false"
                  :clearable="false"
                ></el-cascader>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="姓名" prop="name">
                <el-input
                  v-model="queryParams.name"
                  placeholder="请输入警员姓名"
                  clearable
                  style="width: 100%"
                  @keyup.enter.native="handleQuery"
                />
              </el-form-item>
            </el-col>
            <el-col
              :span="24"
              style="
                display: flex;
                align-items: center;
                justify-content: flex-end;
              "
            >
              <el-button
                type="primary"
                icon="el-icon-search"
                size="mini"
                @click="handleQuery"
              >
                搜索
              </el-button>
              <el-button
                type="primary"
                icon="el-icon-search"
                size="mini"
                @click="handleUpdate"
                v-hasPermi="['attendance:summary:add']"
              >
                同步最新考勤
              </el-button>
              <el-button
                icon="el-icon-download"
                size="mini"
                @click="handleExport"
                v-hasPermi="['attendance:summary:export']"
              >
                导出
              </el-button>
            </el-col>
          </el-row>
        </el-form>
      </el-col>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>
    <div class="table_outer">
      <el-table
        v-show="selectValue == 'basic'"
        v-loading="loading"
        height="100%"
        :data="summaryList"
        align="center"
      >
        <el-table-column label="序号" type="index" width="50" align="center" />
        <el-table-column label="单位" prop="deptName" align="center" />
        <el-table-column label="姓名" prop="nickName" align="center" />
        <el-table-column label="状态" prop="status" width="120" align="center">
          <template slot-scope="scope"
            ><span :style="{ color: statusColors[scope.row.status] }">
              {{ flows[scope.row.status] }}</span
            >
          </template>
        </el-table-column>
        <el-table-column label="出勤情况" align="center">
          <el-table-column label="出勤天数" prop="attDays" align="center" />
          <el-table-column label="请假天数" prop="leaveDays" align="center" />
          <el-table-column
            label="出差已享受补助天数"
            prop="hasSubsidy"
            width="120"
            align="center"
          />
          <el-table-column
            label="实际发放值勤津贴天数≤22"
            prop="realSubsidy"
            align="center"
            width="120"
          />
        </el-table-column>
        <el-table-column
          label="岗位类型"
          prop="category"
          width="100"
          align="center"
        >
          <template slot-scope="scope">
            <el-select
              v-if="hasCategory"
              v-model="scope.row.category"
              placeholder="请选择"
              size="mini"
              @change="setCategory(scope.row)"
            >
              <el-option label="1类" value="1类" />
              <el-option label="2类" value="2类" />
            </el-select>
            <span v-else>{{ scope.row.category }}</span>
          </template>
        </el-table-column>
        <el-table-column label="加班总天数" prop="overtimeDays" />
        <el-table-column
          label="实际发放加班补贴天数≤6"
          prop="overtimeSubsidy"
          align="center"
        />
        <!-- <el-table-column label="备注" prop="remark" /> -->
        <el-table-column
          label="操作"
          align="center"
          width="60"
          fixed="right"
          v-if="showEdit"
        >
          <template slot-scope="scope">
            <el-popconfirm
              confirm-button-text="提交"
              cancel-button-text="取消"
              icon="el-icon-info"
              icon-color="red"
              title="请仔细审核无误后提交至部门负责人审批！"
              v-if="
                !scope.row.status ||
                scope.row.status === 1 ||
                scope.row.status === 0
              "
              v-hasRole="['attendance_submit']"
              @confirm="handleSubmit(scope.row)"
            >
              <el-button type="text" size="small" slot="reference">
                提交
              </el-button>
            </el-popconfirm>
            <el-popconfirm
              confirm-button-text="通过"
              cancel-button-text="退回"
              icon="el-icon-info"
              icon-color="red"
              title="审核无误通过进入下一步政治部填报员审批，否则请退回填报员！"
              v-if="scope.row.status === 2"
              v-hasRole="['attendance_approval']"
              @confirm="doApprove(scope.row)"
              @cancel="recoil(scope.row)"
            >
              <el-button type="text" size="small" slot="reference">
                审批
              </el-button>
            </el-popconfirm>

            <el-popconfirm
              confirm-button-text="通过"
              cancel-button-text="退回"
              icon="el-icon-info"
              icon-color="red"
              title="审核无误通结束审核，否则请退回填报员！"
              v-if="scope.row.status === 3 || scope.row.status === 4"
              v-hasRole="['attendance_last']"
              @confirm="doApprove(scope.row)"
              @cancel="recoil(scope.row)"
            >
              <el-button
                type="text"
                :disabled="scope.row.status === 4"
                size="small"
                slot="reference"
              >
                审批
              </el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>

      <el-table
        v-show="selectValue == 'society'"
        v-loading="loading"
        height="100%"
        :data="summaryList"
      >
        <el-table-column label="序号" type="index" width="60" align="center" />
        <el-table-column label="单位" prop="deptName" align="center" />
        <el-table-column label="姓名" prop="nickName" align="center" />
        <el-table-column label="状态" prop="status" width="120" align="center">
          <template slot-scope="scope"
            ><span :style="{ color: statusColors[scope.row.status] }">
              {{ flows[scope.row.status] }}</span
            >
          </template>
        </el-table-column>
        <el-table-column label="出勤情况" align="center">
          <el-table-column
            label="当月法定工作日出勤天数"
            prop="workDays"
            width="180"
            align="center"
          />
          <el-table-column
            label="工作日请假天数"
            prop="leaveDays"
            width="150"
            align="center"
          />
          <el-table-column
            label="工作日出差已享受补助天数"
            prop="hasSubsidy"
            width="180"
            align="center"
          />
          <el-table-column
            label="实际发放值勤津贴天数≤21"
            prop="realSubsidy"
            width="160"
            align="center"
          />
        </el-table-column>
        <el-table-column label="加班情况" align="center">
          <el-table-column
            label="督察班(个)"
            prop="supervisionShift"
            align="center"
          />
          <el-table-column
            label="外医备勤班(个)"
            prop="medicalStandbyShift"
            align="center"
          />
          <el-table-column
            label="外医班(个)"
            prop="medicalShift"
            align="center"
          />
          <el-table-column
            label="监控班(个)"
            prop="monitoringShift"
            align="center"
          />
          <el-table-column
            label="临时加班(个)"
            prop="temporaryOvertime"
            align="center"
          />
        </el-table-column>
        <el-table-column label="实际发放加班个数" align="center">
          <el-table-column label="机关标准(个)" prop="standardInOffice" />
          <el-table-column
            label="监区标准(个)"
            prop="standardInCorrectionalUnit"
            align="center"
          />
        </el-table-column>
        <!-- <el-table-column label="备注" prop="remark" /> -->
        <el-table-column
          label="操作"
          align="center"
          width="60"
          fixed="right"
          v-if="showEdit"
        >
          <template slot-scope="scope">
            <el-popconfirm
              confirm-button-text="提交"
              cancel-button-text="取消"
              icon="el-icon-info"
              icon-color="red"
              title="请仔细审核无误后提交至部门负责人审批！"
              v-if="
                !scope.row.status ||
                scope.row.status === 1 ||
                scope.row.status === 0
              "
              v-hasRole="['attendance_submit']"
              @confirm="handleSubmit(scope.row)"
            >
              <el-button type="text" size="small" slot="reference">
                提交
              </el-button>
            </el-popconfirm>
            <el-popconfirm
              confirm-button-text="通过"
              cancel-button-text="退回"
              icon="el-icon-info"
              icon-color="red"
              title="审核无误通过进入下一步政治部填报员审批，否则请退回填报员！"
              v-if="scope.row.status === 2"
              v-hasRole="['attendance_approval']"
              @confirm="doApprove(scope.row)"
              @cancel="recoil(scope.row)"
            >
              <el-button type="text" size="small" slot="reference">
                审批
              </el-button>
            </el-popconfirm>

            <el-popconfirm
              confirm-button-text="通过"
              cancel-button-text="退回"
              icon="el-icon-info"
              icon-color="red"
              title="审核无误通结束审核，否则请退回填报员！"
              v-if="scope.row.status === 3 || scope.row.status === 4"
              v-hasRole="['attendance_last']"
              @confirm="doApprove(scope.row)"
              @cancel="recoil(scope.row)"
            >
              <el-button
                :disabled="scope.row.status === 4"
                type="text"
                size="small"
                slot="reference"
              >
                审批
              </el-button>
            </el-popconfirm>
          </template>
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
import { updateSummary, querySummary } from "@/api/summary";
import { listReport } from "@/api/attendance/report";
import { mapGetters } from "vuex";
import { isWorkday } from "chinese-workday";
import { deptTreeSelect } from "@/api/system/user";
import auth from "@/plugins/auth";
import {
  summary,
  sumHasSubsidy,
  summaryByMark,
  summaryByType,
} from "@/utils/summary";
import { utils, writeFile } from "xlsx-js-style";
import dayjs from "dayjs";
import { bFooter, bHeader, sFooter, sHeader } from "./sheetData";
export default {
  name: "Summary",
  data() {
    return {
      dialogFormVisible: false,
      detailForm: {},
      flows: [
        "已退回",
        "待填报员提交",
        "待负责人审批",
        "待政治处审批",
        "已审核完成",
      ],
      statusColors: ["#F56C6C", "#909399", "#409EFF", "#409EFF", "#67C23A"],
      deptOptions: [],
      approveStatus: null,
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
      // 基层民警加班汇总表格数据
      summaryList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        month: "",
        pageSize: 10,
        status: undefined,
        name: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
      isBasic: false,
    };
  },
  computed: {
    ...mapGetters(["user"]),
    selectValue() {
      if (this.isBasic) {
        return "basic";
      }
      return "society";
    },
    notLookSelf() {
      return !auth.hasPermi("system:look:self");
    },
    showEdit() {
      return auth.hasRoleOr([
        "attendance_submit",
        "attendance_approval",
        "attendance_last",
      ]);
    },
    hasCategory() {
      return auth.hasPermi("auth:category");
    },
  },
  mounted() {
    console.log(88, auth.hasPermi("system:user:list"));

    this.queryParams.month = dayjs().format("YYYY-MM");
    this.queryParams.deptId = this.user.deptId;
    if (
      !auth.hasPermi("system:user:list") &&
      !auth.hasPermi("system:look:self")
    )
      this.queryParams.userId = this.user.userId;
    this.isBasic = this.user.dept.parentId === 201;
    if (auth.hasPermi("system:user:list")) {
      deptTreeSelect().then(async (res) => {
        this.deptOptions = res.data[0].children;
        // this.queryParams.deptId = this.deptOptions[0].children[0].id;
        this.handleQuery();
        // await this.handleUpdate(false);
      });
      return;
    }
    this.handleQuery();
  },
  methods: {
    // 提交审核数据
    handleSubmit({ userId, sumMonth }) {
      this.updateSummary([{ userId, sumMonth, status: 2 }], true);
    },
    recoil({ userId, sumMonth }) {
      this.updateSummary([{ userId, sumMonth, status: 0 }], true);
    },
    doApprove({ userId, sumMonth, status }) {
      this.updateSummary([{ userId, sumMonth, status: status + 1 }], true);
    },
    /** 查询汇总 */
    getList() {
      this.loading = true;
      querySummary({
        ...this.queryParams,
        sumMonth: this.queryParams.month,
      }).then(({ rows, total }) => {
        this.summaryList = rows || [];
        this.total = total;
        this.loading = false;
      });
    },
    async handleUpdate(isFresh = true) {
      this.loading = true;
      const { month, name, deptId, userId } = this.queryParams;
      const { code, rows } = await listReport({
        month,
        pageSize: 10000,
        pageNum: 1,
        name,
        deptId: typeof deptId === "number" ? deptId : deptId[deptId.length - 1],
        userId,
      });
      if (code === 200) {
        this.updateSummary(this.getOption(rows), isFresh);
        return;
      }
      this.loading = false;
    },
    setCategory({ userId, sumMonth, category }) {
      this.updateSummary([{ userId, sumMonth, category }], false);
    },
    updateSummary(data, isFresh) {
      updateSummary(data)
        .then(() => {
          this.loading = false;
          this.$message.success("最新数据已同步");
          if (isFresh) this.getList();
        })
        .catch(() => {
          this.loading = false;
        });
    },
    getOption(data) {
      const { isBasic } = this;
      let workDays = 0;
      for (let i = 1; i <= dayjs(this.queryParams.month).daysInMonth(); i++) {
        if (isWorkday(`${this.queryParams.month}-${i < 10 ? "0" + i : i}`)) {
          workDays += 1;
        }
      }
      const sum =
        data
          ?.filter((row) => row.timeType == "早上")
          .map((row) => {
            const personAtt = data.filter((item) => item.userid === row.userid);
            const obj = {};
            obj.userId = row.userid;
            obj.deptId = row.sysUser.deptId;
            obj.sumMonth = this.queryParams.month;
            // 本月法定工作日
            obj.workDays = workDays;
            // 出勤天数
            obj.attDays = summary(personAtt, "出勤");
            // 请假天数
            obj.leaveDays = summaryByType(personAtt, "a");
            // 出差已享受补助天数
            obj.hasSubsidy = sumHasSubsidy(personAtt);
            // 督察班(个)
            obj.supervisionShift = summaryByMark(personAtt, "D");
            // 外医备勤班
            obj.medicalStandbyShift = summaryByType(personAtt, "d", true);
            // 外医班
            obj.medicalShift = summaryByType(personAtt, "e", true, true);
            // 监控班
            obj.monitoringShift = summaryByType(personAtt, "f", true);
            // 临时加班
            obj.temporaryOvertime = summaryByType(personAtt, "g", true);
            // 实际发放值勤津贴天数≤22
            obj.realSubsidy = isBasic
              ? 22 - obj.hasSubsidy - obj.leaveDays
              : workDays - obj.leaveDays - obj.hasSubsidy;
            obj.realSubsidy = obj.realSubsidy > 0 ? obj.realSubsidy : 0;
            obj.realSubsidy =
              obj.realSubsidy > (isBasic ? 22 : 21)
                ? isBasic
                  ? 22
                  : 21
                : obj.realSubsidy;
            // 加班总天数
            obj.overtimeDays = obj.attDays - 22 > 0 ? obj.attDays - 22 : 0;
            obj.overtimeSubsidy = obj.overtimeDays > 6 ? 6 : obj.overtimeDays;
            // 机关标准
            obj.standardInOffice =
              obj.supervisionShift +
              obj.medicalStandbyShift +
              obj.monitoringShift +
              obj.temporaryOvertime;
            obj.standardInOffice =
              obj.standardInOffice > 4 ? 4 : obj.standardInOffice;
            // 监区标准
            obj.standardInCorrectionalUnit =
              obj.medicalShift > 4 ? 4 : obj.medicalShift;
            // 机关标准
            obj.standardInOffice =
              obj.standardInCorrectionalUnit + obj.standardInOffice > 3
                ? 4 - obj.standardInCorrectionalUnit
                : obj.standardInOffice;
            return obj;
          }) ?? [];
      return sum;
    },
    /** 搜索按钮操作 */
    handleQuery() {
      if (auth.hasPermi("system:user:list")) {
        const { deptId } = this.queryParams;
        if (typeof deptId === "object") this.isBasic = deptId.includes(201);
        this.queryParams.deptId =
          typeof deptId === "number" ? deptId : deptId[deptId.length - 1];
      }
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 导出按钮操作 */
    handleExport() {
      const header = this.isBasic ? bHeader : sHeader;
      const footer = utils.sheet_to_json(this.isBasic ? bFooter : sFooter);
      const data = this.isBasic ? this.getBasicData() : this.getSocietyData();
      const workbook = utils.book_new();
      const newSheet = utils.sheet_add_aoa(
        header,
        data.map((item) => Object.values(item)),
        { origin: "A4" }
      );
      const exportSheet = utils.sheet_add_json(newSheet, footer, {
        origin: `A${this.summaryList.length + 4}`,
      });
      exportSheet["!rows"] = [{ hpx: 40 }, { hpx: 20 }, { hpx: 50 }]
        .concat(
          ...new Array(this.summaryList.length).fill({
            hpx: 20,
          })
        )
        .concat(...[{ hpx: 30 }, { hpx: 30 }]);
      utils.book_append_sheet(workbook, exportSheet, "考勤汇总");
      writeFile(
        workbook,
        `${this.queryParams.month}${
          this.isBasic ? "基层监区" : "机关"
        }民警值勤、加班情况汇总表.xlsx`
      );
    },
    getBasicData() {
      return this.summaryList.map((item, index) => ({
        index: index + 1,
        deptName: item.deptName,
        nickName: item.nickName,
        attDays: item.attDays,
        leaveDays: item.leaveDays,
        hasSubsidy: item.hasSubsidy,
        realSubsidy: item.realSubsidy,
        category: item.category,
        overtimeDays: item.overtimeDays,
        overtimeSubsidy: item.overtimeSubsidy,
      }));
    },
    getSocietyData() {
      return this.summaryList.map((item, index) => ({
        index: index + 1,
        deptName: item.deptName,
        nickName: item.nickName,
        workDays: item.workDays,
        attDays: item.attDays,
        hasSubsidy: item.hasSubsidy,
        realSubsidy: item.realSubsidy,
        supervisionShift: item.supervisionShift,
        medicalStandbyShift: item.medicalStandbyShift || 0,
        medicalShift: item.medicalShift,
        monitoringShift: item.monitoringShift,
        temporaryOvertime: item.temporaryOvertime,
        standardInOffice: item.standardInOffice,
        standardInCorrectionalUnit: item.standardInCorrectionalUnit,
        remark: item.remark,
      }));
    },
  },
};
</script>
<style lang="scss" scoped>
.table_outer {
  height: calc(100% - 155px);
}
</style>
