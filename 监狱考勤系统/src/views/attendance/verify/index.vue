<template>
  <div class="app-container">

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
          <el-form-item label="月份" prop="currentMonth">
            <el-input v-model="queryParams.currentMonth" placeholder="请输入月份查询" clearable
              @keyup.enter.native="handleQuery" />
          </el-form-item>
          <el-form-item label="年份" prop="currentYear">
            <el-input v-model="queryParams.currentYear" placeholder="请输入年份查询" clearable
              @keyup.enter.native="handleQuery" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button type="warning" icon="el-icon-download" size="mini" @click="handleExport"
              v-hasPermi="['attendance:verify:export']">导出</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>
    
    <el-table v-loading="loading" :data="verifyList" @selection-change="handleSelectionChange">
      <el-table-column label="当前年份" align="center" prop="currentYear" width="80px" />
      <el-table-column label="当前月份" align="center" prop="currentMonth" width="80px" />
      <el-table-column label="当前月度周期" align="center" prop="currentPeriod" width="120px" />
      <el-table-column label="参与人数" align="center" prop="participantCount" width="80px" />
      <el-table-column label="累计出勤人数" align="center" prop="totalAttendance" width="100px" />
      <el-table-column label="累计探亲人数" align="center" prop="totalVisitFamily" width="100px" />
      <el-table-column label="累计休假人数" align="center" prop="totalLeave" width="100px" />
      <el-table-column label="累计婚假人数" align="center" prop="totalMarriageLeave" width="100px" />
      <el-table-column label="累计产假人数" align="center" prop="totalMaternityLeave" width="100px" />
      <el-table-column label="累计丧假人数" align="center" prop="totalBereavementLeave" width="100px" />
      <el-table-column label="累计病假人数" align="center" prop="totalSickLeave" width="100px" />
      <el-table-column label="累计事假人数" align="center" prop="totalPersonalLeave" width="100px" />
      <el-table-column label="累计学习人数" align="center" prop="totalStudyLeave" width="100px" />
      <el-table-column label="累计补休人数" align="center" prop="totalMakeupLeave" width="100px" />
      <el-table-column label="累计公差人数" align="center" prop="totalPublicDutyLeave" width="100px" />
      <el-table-column label="累计脯乳假人数" align="center" prop="totalLactationLeave" width="120px" />
      <el-table-column label="累计陪护假人数" align="center" prop="totalCareLeave" width="120px" />
      <el-table-column label="累计体检人数" align="center" prop="totalPhysicalExam" width="100px" />
      <el-table-column label="累计外医人数" align="center" prop="totalOutpatientCare" width="100px" />
      <el-table-column label="累计督察人数" align="center" prop="totalSupervision" width="100px" />
      <el-table-column label="累计监控人数" align="center" prop="totalMonitoring" width="100px" />
      <el-table-column label="累计加班人数" align="center" prop="totalOvertime" width="100px" />
      <el-table-column label="累计正常假人数" align="center" prop="totalNormalLeave" width="120px" />
      <el-table-column label="累计活动人数" align="center" prop="totalActivityParticipants" width="100px" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['attendance:verify:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
            v-hasPermi="['attendance:verify:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />
  </div>
</template>
  
<script>
import { listVerify, getVerify, delVerify, addVerify, updateVerify } from "@/api/attendance/verify";

export default {
  name: "Verify",
  data() {
    return {
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
      // 月度考勤报告表格数据
      verifyList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        currentYear: null,
        currentMonth: null,
        currentPeriod: null,
        participantCount: null,
        totalAttendance: null,
        totalVisitFamily: null,
        totalLeave: null,
        totalMarriageLeave: null,
        totalMaternityLeave: null,
        totalBereavementLeave: null,
        totalSickLeave: null,
        totalPersonalLeave: null,
        totalStudyLeave: null,
        totalMakeupLeave: null,
        totalPublicDutyLeave: null,
        totalLactationLeave: null,
        totalCareLeave: null,
        totalPhysicalExam: null,
        totalOutpatientCare: null,
        totalSupervision: null,
        totalMonitoring: null,
        totalOvertime: null,
        totalNormalLeave: null,
        totalActivityParticipants: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        currentYear: [
          { required: true, message: "当前年份不能为空", trigger: "blur" }
        ],
        currentMonth: [
          { required: true, message: "当前月份不能为空", trigger: "blur" }
        ],
        currentPeriod: [
          { required: true, message: "当前月度周期不能为空", trigger: "blur" }
        ],
        participantCount: [
          { required: true, message: "参与人数不能为空", trigger: "blur" }
        ],
        totalAttendance: [
          { required: true, message: "累计出勤人数不能为空", trigger: "blur" }
        ],
        totalVisitFamily: [
          { required: true, message: "累计探亲人数不能为空", trigger: "blur" }
        ],
        totalLeave: [
          { required: true, message: "累计休假人数不能为空", trigger: "blur" }
        ],
        totalMarriageLeave: [
          { required: true, message: "累计婚假人数不能为空", trigger: "blur" }
        ],
        totalMaternityLeave: [
          { required: true, message: "累计产假人数不能为空", trigger: "blur" }
        ],
        totalBereavementLeave: [
          { required: true, message: "累计丧假人数不能为空", trigger: "blur" }
        ],
        totalSickLeave: [
          { required: true, message: "累计病假人数不能为空", trigger: "blur" }
        ],
        totalPersonalLeave: [
          { required: true, message: "累计事假人数不能为空", trigger: "blur" }
        ],
        totalStudyLeave: [
          { required: true, message: "累计学习人数不能为空", trigger: "blur" }
        ],
        totalMakeupLeave: [
          { required: true, message: "累计补休人数不能为空", trigger: "blur" }
        ],
        totalPublicDutyLeave: [
          { required: true, message: "累计公差人数不能为空", trigger: "blur" }
        ],
        totalLactationLeave: [
          { required: true, message: "累计脯乳假人数不能为空", trigger: "blur" }
        ],
        totalCareLeave: [
          { required: true, message: "累计陪护假人数不能为空", trigger: "blur" }
        ],
        totalPhysicalExam: [
          { required: true, message: "累计体检人数不能为空", trigger: "blur" }
        ],
        totalOutpatientCare: [
          { required: true, message: "累计外医人数不能为空", trigger: "blur" }
        ],
        totalSupervision: [
          { required: true, message: "累计督察人数不能为空", trigger: "blur" }
        ],
        totalMonitoring: [
          { required: true, message: "累计监控人数不能为空", trigger: "blur" }
        ],
        totalOvertime: [
          { required: true, message: "累计加班人数不能为空", trigger: "blur" }
        ],
        totalNormalLeave: [
          { required: true, message: "累计正常假人数不能为空", trigger: "blur" }
        ],
        totalActivityParticipants: [
          { required: true, message: "累计活动人数不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询月度考勤报告列表 */
    getList() {
      this.loading = true;
      listVerify(this.queryParams).then(response => {
        this.verifyList = response.rows;
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
        currentYear: null,
        currentMonth: null,
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
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加月度考勤报告";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getVerify(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改月度考勤报告";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateVerify(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addVerify(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除月度考勤报告编号为"' + ids + '"的数据项？').then(function () {
        return delVerify(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => { });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('attendance/verify/export', {
        ...this.queryParams
      }, `verify_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
  