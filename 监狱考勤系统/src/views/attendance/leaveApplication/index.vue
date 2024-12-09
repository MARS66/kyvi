<!--
 * @Description: 
 * @Author: Kevin
 * @Date: 2024-05-21 09:18:20
 * @LastEditors: Kevin
 * @LastEditTime: 2024-11-12 16:05:33
-->
<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      label-width="68px"
    >
      <el-form-item label="类型" prop="deptId">
        <el-select
          v-model="queryParams.leaveType"
          style="width: 100%"
          placeholder="请选择"
          clearable
        >
          <el-option
            v-for="item in workTypes"
            :key="item.name"
            :label="item.name"
            :value="item.name"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择">
          <el-option
            v-for="(item, index) in statusOptions"
            :key="index"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
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
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
        >
          填写假单
        </el-button>
      </el-form-item>
    </el-form>
    <div class="table-outer">
      <el-table
        v-loading="loading"
        :data="tableData"
        stripe
        border
        height="100%"
      >
        <el-table-column
          v-for="item in columns"
          :key="item.prop"
          :label="item.label"
          :formatter="item.formatter"
          :prop="item.prop"
        />
        <el-table-column
          v-if="canDelete"
          label="操作"
          align="center"
          width="60"
        >
          <template slot-scope="scope">
            <el-button @click="deleteL(scope.row)" type="text" size="small">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <pagination
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="query"
    />
    <el-dialog title="假单填写" width="500px" :visible.sync="dialogFormVisible">
      <el-form ref="form" :rules="rules" :model="detailForm" label-width="80px">
        <el-form-item label="所属部门">
          {{ detailForm.deptName }}
        </el-form-item>
        <el-form-item label="职工姓名">
          <el-select
            v-model="detailForm.userId"
            style="width: 100%"
            placeholder="请选择"
            @change="getPlan"
            v-if="userlist.length"
          >
            <el-option
              v-for="item in userlist"
              :key="item.userId"
              :label="item.nickName"
              :value="item.userId"
            >
            </el-option>
          </el-select>
          <span v-else> {{ detailForm.name }}</span>
        </el-form-item>

        <el-form-item label="请假类型" prop="leaveType">
          <el-select
            v-model="detailForm.leaveType"
            style="width: 100%"
            placeholder="请选择"
          >
            <el-option
              v-for="item in workTypes"
              :key="item.name"
              :label="item.name"
              :value="item.name"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开始时间" prop="startTime">
          <el-date-picker
            v-model="detailForm.startTime"
            type="date"
            @change="upDateDays"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
            style="width: 100%"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" prop="endTime">
          <el-date-picker
            v-model="detailForm.endTime"
            type="date"
            @change="upDateDays"
            style="width: 100%"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item
          v-if="
            detailForm.endTime && detailForm.endTime === detailForm.startTime
          "
          label="请假班次"
          prop="classes"
        >
          <el-radio-group v-model="detailForm.classes" @change="upDateDays">
            <el-radio label="早上">早上</el-radio>
            <el-radio label="下午">下午</el-radio>
            <el-radio label="全天">全天</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="时间合计">
          {{ detailForm.days }} /天
        </el-form-item>
        <el-form-item label="剩余年休"> {{ surplus }} /天 </el-form-item>
        <el-form-item label="事由" prop="reason">
          <el-input type="textarea" v-model="detailForm.reason"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-checkbox v-model="checked" style="margin-right: 15px"
          >直接通过并同步到考勤</el-checkbox
        >
        <el-button @click="dialogFormVisible = false"> 取消 </el-button>
        <el-button type="primary" @click="summitLeave"> 提交 </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { queryLeaves, addLeave, editLeave, deleteLeave } from "@/api/leave";
import { queryPlans } from "@/api/plan";
import { workTypes } from "@/utils/work-type";
import { batchAttendance } from "@/api/attendance/report";
import { listUser } from "@/api/system/user";
import dayjs from "dayjs";
import auth from "@/plugins/auth";
export default {
  name: "",
  components: {},
  props: {},
  data() {
    return {
      userlist: [],
      surplus: 0,
      checked: true,
      detailForm: {
        userId: undefined,
      },
      dialogFormVisible: false,
      deptOptions: [],
      columns: [
        {
          prop: "deptName",
          label: "部门",
        },
        {
          prop: "nickName",
          label: "姓名",
        },
        {
          prop: "reason",
          label: "原因",
        },
        {
          prop: "leaveType",
          label: "类型",
        },
        {
          prop: "startTime",
          label: "开始时间",
        },
        {
          prop: "endTime",
          label: "结束时间",
        },
        {
          prop: "days",
          label: "请假天数",
        },
        {
          prop: "status",
          label: "状态",
          formatter: (row) => {
            const arr =
              row.flow === "zk"
                ? ["待审批员审批", "待狱长审批", "已审批"]
                : [
                    "待部门负责人",
                    "待审批员审批",
                    "待政治处主任审批",
                    "已审批",
                  ];
            return row.status === -1 ? "驳回" : arr[row.status];
          },
        },
        {
          prop: "remark",
          label: "备注",
        },
      ],
      total: 0,
      tableData: [],
      loading: false,
      queryParams: {
        deptId: undefined,
        pageNum: 1,
        status: undefined,
        pageSize: 10,
      },
      rules: {
        startTime: [
          { required: true, message: "请假类型不能为空", trigger: "blur" },
        ],
        leaveType: [
          { required: true, message: "开始时间不能为空", trigger: "blur" },
        ],
        endTime: [
          { required: true, message: "结束时间不能为空", trigger: "blur" },
        ],
        reason: [
          { required: false, message: "请假事由不能为空", trigger: "blur" },
        ],
        classes: [
          { required: true, message: "请假班次不能为空", trigger: "blur" },
        ],
      },
    };
  },
  computed: {
    ...mapGetters(["user", "group"]),
    workTypes() {
      return workTypes.filter((item) => item.type === "a" || item.type === "b");
    },
    canDelete() {
      return auth.hasPermi("system:leave:delete");
    },
    statusOptions() {
      const opt = [{ label: "驳回", value: [-1] }];
      if (this.group?.includes("正科")) {
        opt.push(
          { label: "待审批", value: [0, 1] },
          { label: "已审批", value: [2] }
        );
      } else {
        opt.push(
          { label: "待审批", value: [0, 1, 2] },
          { label: "已审批", value: [3] }
        );
      }
      return opt;
    },
  },
  created() {
    this.queryParams.userId = this.user.userId;
    this.queryParams.deptId = this.user.deptId;
    if (auth.hasPermi("view:this:department")) {
      this.queryParams.userId = undefined;
    }
    this.handleQuery();
    this.getPlan(this.queryParams.userId);
    if (auth.hasPermi("system:user:list")) this.getUserByDeptId();
  },
  mounted() {},
  methods: {
    async getUserByDeptId() {
      const { rows } = await listUser({
        deptId: this.user.deptId,
        pageNum: 1,
        pageSize: 99999,
      });
      this.userlist = rows;
    },
    deleteL(row) {
      deleteLeave(row.id).then(() => {
        this.query();
      });
    },
    // 获取剩余年休
    getPlan(userId) {
      queryPlans({ userId }).then(({ rows }) => {
        const item = rows[0];
        const sum = item.plans
          ? item.plans?.find((plan) => plan.months === 99)?.days ?? 0
          : 0;
        this.surplus = sum && sum > item.leaved ? sum - item.leaved : 0;
      });
    },

    upDateDays() {
      const { startTime, endTime, classes } = this.detailForm;
      let diff;
      if (startTime === endTime) {
        diff = classes === "全天" ? 1 : 0.5;
      } else if (startTime && endTime) {
        diff = dayjs(endTime).diff(dayjs(startTime), "day") + 1;
      }
      this.$set(this.detailForm, "days", diff);
    },
    handleAdd() {
      const { dept, nickName, userId } = this.user;
      this.detailForm.deptName = dept.deptName;
      this.detailForm.deptId = dept.deptId;
      this.detailForm.name = nickName;
      this.detailForm.userId = userId;
      this.dialogFormVisible = true;
    },
    summitLeave() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          addLeave({
            ...this.detailForm,
            status: 0,
            flow: this.user.postIds?.includes(2) ? "zk" : "pt",
          }).then(() => {
            this.dialogFormVisible = false;
            if (this.checked) {
              this.freshData();
              this.freshStatus({ ...this.detailForm });
            } else {
              this.query();
            }
          });
        }
      });
    },

    // 修改审批状态
    async freshStatus({ leaveType, startTime, endTime }) {
      const { rows } = await queryLeaves({
        deptId: this.user.deptId,
        pageNum: 1,
        status: [0],
        pageSize: 1000,
        leaveType,
        userId: this.user.userId,
      });
      const row = rows.find(
        (i) => i.startTime === startTime && i.endTime === endTime
      );
      if (row?.id) {
        editLeave({
          id: row?.id,
          status: row.flow == "zk" ? 2 : 3,
          approver: this.user.nickName,
        }).then(() => {
          this.query();
        });
      }
    },
    // 更新考勤
    freshData() {
      const { userId, days, leaveType, classes, startTime } = this.detailForm;
      const data = [];
      if (days === 0.5) {
        data.push({
          attDate: startTime,
          userId: userId,
          timeType: classes,
          attType: leaveType,
        });
      } else {
        for (let index = 0; index < days; index++) {
          const current = dayjs(startTime)
            .add(index, "day")
            .format("YYYY-MM-DD");
          data.push({
            attDate: current,
            userId: userId,
            timeType: "早上",
            attType: leaveType,
          });
          data.push({
            attDate: current,
            userId: userId,
            timeType: "下午",
            attType: leaveType,
          });
        }
      }
      console.log(data);

      batchAttendance(data);
    },
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.query();
    },
    query() {
      this.loading = true;
      queryLeaves(this.queryParams)
        .then((res) => {
          this.tableData = res.rows;
          this.total = res.total;
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
      const { userId, days, leaveType, classes, startTime } = this.queryParams;
    },
  },
};
</script>

<style scoped lang="scss">
.app-container {
  .table-outer {
    height: calc(100% - 90px);
  }
}
</style>
