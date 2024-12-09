<template>
  <div class="app-container my">
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
          <el-form-item label="年份" prop="years">
            <el-date-picker
              v-model="queryParams.years"
              type="years"
              value-format="yyyy"
              placeholder="选择年"
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
              type="primary"
              icon="el-icon-download"
              size="mini"
              @click="handleExport"
              v-hasPermi="['attendance:verify:export']"
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
    <div class="table-outer">
      <el-table
        v-loading="loading"
        :data="reportList"
        stripe
        :key="key"
        height="100%"
        border
        @cell-dblclick="tabClick"
      >
        <el-table-column label="姓名" align="center" prop="name" fixed="left" >
          <template slot-scope="scope"><span @click="showDateSet(scope.row)" style="color:#409eff; cursor: pointer;"> {{scope.row.name}}</span></template>
        </el-table-column>
        <el-table-column label="部门" align="center" prop="deptName" fixed="left"/>
        <!-- <el-table-column label="入职时间" align="center" width="100" prop="entry" fixed="left"/> -->
        <el-table-column label="计划休假" align="center">
          <el-table-column
            v-for="item in 12"
            :key="item"
            :label="item + '月'"
            align="center"
          >
            <template slot-scope="scope">
              <el-input
                v-if="scope.row.isFocus === scope.column.label"
                v-model="focusLabelValue"
                @blur="blurInput(scope)"
              >
              </el-input>
              <span v-else> {{ getValue(scope) }}</span>
            </template>
          </el-table-column>
        </el-table-column>

        <el-table-column label="汇总" align="center">
          <el-table-column
            width="100px"
            align="center"
            prop="sum"
            label="总计划休假"
          >
          <template slot-scope="scope"  v-hasRole="['admin']">
              <el-input
                v-if="scope.row.isFocus === scope.column.label"
                v-model="focusLabelValue"
                @blur="blurInput(({row:scope.row, column:{label:'99'}}))"
              >
              </el-input>
              <span v-else> {{ scope.row.sum }}</span>
            </template>
        </el-table-column>
          <el-table-column
            width="100px"
            align="center"
            prop="leaved"
            label="已休"
          />
          <el-table-column
            width="100px"
            align="center"
            prop="surplus"
            label="剩余"
          />
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
    <el-dialog title="请填写入职时间" :append-to-body="false" :visible.sync="dialogTableVisible" width="400px">
     
          <el-date-picker
          style="width: 360px;"
            v-model="value1"
            type="date"
            value-forma="yyyy-MM-dd"
            format="yyyy-MM-dd"
            placeholder="选择日期">
          </el-date-picker>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogTableVisible = false">取 消</el-button>
        <el-button type="primary" @click="setData">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { queryPlans, addPlan, editPlan } from "@/api/plan";
import { utils, writeFile } from "xlsx";
import dayjs from "dayjs";
export default {
  name: "Report",
  data() {
    return {
      dialogTableVisible:false,
      value1:'',
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
        name: "",
      },
      focusLabelValue: "",
      // 表单参数
      form: {},
    };
  },
  created() {
    this.queryParams.years = dayjs().format("YYYY");
    this.getList();
  },
  computed: {
    ...mapGetters(["user"]),
  },
  watch: {},
  methods: {
    showDateSet(row) {
      this.currentRow = row
      this.value1 = dayjs.unix(row.plans?.find((plan) => plan.months === 88)?.days ?? undefined).format('YYYY-MM-DD');
      this.dialogTableVisible=true
    },
    setData() {
      const current = this.currentRow.plans?.find((plan) => plan.months === 88) ?? undefined;
        const data = {
          years: this.queryParams.years,
          userId: this.currentRow.sysUser.userId,
          months: 88,
          days:dayjs(this.value1).unix() 
        };
        
      if (current?.id) {
        data.id=current.id
        this.updatePlan(data,false);
      } else {
        this.addPlan(data,false);
      }
      this.addPlan({
        years: this.queryParams.years,
        userId: this.currentRow.sysUser.userId,
        months: 99,
        days:this.getYearBreak(dayjs().diff(dayjs(this.value1), "year")),
      });
    },
    getYearBreak(year) {
      // [0 - 1.1 - 10.10 - 20.20 +}]年假天数[0.5.10.15]
        if(year< 1) return 0;
        if(1< year && year < 10) return 5;
        if(10< year && year < 20) return 10;
        if(year>20) return 15;
    },
    tabClick(row, column) {
      row.isFocus = column.label;
      this.focusLabelValue =column.label==='总计划休假' ?  row.sum : this.getValue({ row, column });
      this.key = Math.random();
    },
    blurInput({ row, column }) {
      row.isFocus = false;
      this.key = Math.random();
      const current =
        row.plans?.find((plan) => plan.months === parseInt(column.label)) ??
        undefined;
      if (current?.id) {
        (current.days = parseInt(this.focusLabelValue)),
          this.updatePlan(current);
      } else {
        const data = {
          years: this.queryParams.years,
          userId: row.sysUser.userId,
          months: parseInt(column.label),
          days: parseInt(this.focusLabelValue),
        };
        this.addPlan(data);
      }
    },
    // 编辑
    updatePlan(data,fresh=true) {
      editPlan(data).then(() => {
        if (!fresh) return;
        this.$message.success("年休计划已更新");
        this.getList();
      });
    },
    addPlan(data,fresh=true) {
      addPlan(data).then(() => {
        if (!fresh) return;
        this.$message.success("年休计划已更新");
        this.getList();
      });
    },
    getValue({ row, column }) {
      return (
        row.plans?.find((plan) => plan.months === parseInt(column.label))
          ?.days ?? 0
      );
    },
    /** 查询考勤数据填报列表 */
    getList() {
      queryPlans({
        ...this.queryParams,
        deptId: this.user.deptId,
      }).then(({ rows, total }) => {
        this.reportList = rows.map((item) => {
          item.entry = item.plans
            ? dayjs.unix(item.plans?.find((plan) => plan.months === 88)?.days ?? undefined).format('YYYY-MM-DD')
            : 0;
          item.sum = item.plans
            ? item.plans?.find((plan) => plan.months === 99)?.days ?? 0
            : 0;
          item.surplus =(item.sum&&item.sum > item.leaved)?item.sum - item.leaved:0;
          return item;
        });
        this.total = total;
        this.dialogTableVisible=false;
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
        } else if (key === "!fullref" || key === "!ref") {
          const arr = sheet2[key].split(/(\d+)/);
          newSheet[key] = arr[0] + arr[1] + arr[2] + (parseInt(arr[3]) + 2);
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
  height: calc(100% - 94px);
}
.my{
  ::v-deep.el-dialog__wrapper{
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
