<!--
 * @Description: 
 * @Author: Kevin
 * @Date: 2024-05-21 09:18:20
 * @LastEditors: Kevin
 * @LastEditTime: 2024-10-25 11:06:59
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
      <el-form-item label="姓名" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入姓名"
          clearable
          size="small"
          prefix-icon="el-icon-search"
        />
      </el-form-item>
      <el-form-item label="部门" prop="deptId">
        <el-cascader
          v-model="queryParams.deptId"
          :options="deptOptions"
          :props="{ checkStrictly: true, value: 'id' }"
        ></el-cascader>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择">
          <el-option
            v-for="item in statusOptions"
            :key="item.label"
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
        <el-table-column label="操作" align="center" width="60">
          <template slot-scope="scope">
            
            <el-button
              :disabled="scope.row.status > currentLevel"
              @click="approve(scope.row)"
              type="text"
              size="small"
            >
              审批
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <pagination
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="handleQuery"
    />
    <el-dialog title="请假审批" :visible.sync="dialogFormVisible">
      <el-descriptions title="">
        <el-descriptions-item label="部门">
          {{ detailForm.deptName }}
        </el-descriptions-item>
        <el-descriptions-item label="姓名">
          {{ detailForm.nickName }}
        </el-descriptions-item>
        <el-descriptions-item label="请假类型">
          {{ detailForm.leaveType }}
        </el-descriptions-item>
        <el-descriptions-item label="开始时间">
          {{ detailForm.startTime }}
        </el-descriptions-item>
        <el-descriptions-item label="结束时间">
          {{ detailForm.endTime }}
        </el-descriptions-item>
        <el-descriptions-item label="共计天数">
          {{ detailForm.days }}
        </el-descriptions-item>
        <el-descriptions-item label="事由">
          {{ detailForm.reason }}
        </el-descriptions-item>
      </el-descriptions>
      <div style="padding: 15px 0">备注：</div>
      <el-input type="textarea" v-model="detailForm.remark"></el-input>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false"> 取消 </el-button>
        <el-button type="primary" @click="recoil"> 驳回 </el-button>
        <el-button type="success" @click="doApprove"> 通过 </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { deptTreeSelect } from "@/api/system/user";
import { batchAttendance } from "@/api/attendance/report";
import { queryLeaves, editLeave } from "@/api/leave";
import dayjs from "dayjs";
export default {
  name: "",
  components: {},
  props: {},
  data() {
    return {
      detailForm: {},
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
            return (
              this.statusOptions?.find((item) =>
                item.value.includes(row.status)
              )?.label ?? "待审批"
            );
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
        deptId: 100,
        pageNum: 1,
        status:undefined,
        pageSize: 10,
      },
      currentLevel: 0,
      statusOptions: [],
    };
  },
  computed: {
    ...mapGetters(["user", "group"]),
  },
  watch: {},
  async created() {
    this.statusOptions = await this.setOptions();
    deptTreeSelect().then((res) => {
      this.deptOptions = res.data;
      this.queryParams.deptId = [res.data[0]?.id];
      this.queryParams.status = this.statusOptions[0].value;
      this.handleQuery();
    });
  },
  mounted() {},
  methods: {
    setOptions() {
      const { roles } = this.user;
      const zkFlow = ["审批员", "典狱长"];
      const normalFlow = ["部门主任", "审批员", "政治处主任"];
      const zk = roles.find((r) => zkFlow.includes(r.roleName))?.roleName;
      const fk = roles.find((r) => normalFlow.includes(r.roleName))?.roleName;
      let flow = [];
      if (zk === "审批员") {
        this.queryParams.flow = this.group?.includes("正科") ? "zk" : "pt";
        flow = this.group?.includes("正科") ? zkFlow : normalFlow;
      } else {
        flow = zk ? zkFlow : normalFlow;
        this.queryParams.flow = zk ? "zk" : "pt";
      }
      roles?.forEach((rol) => {
        const index = flow.findIndex((i) => i.includes(rol.roleName));
        if (index > -1) {
          this.currentLevel = index;
        }
      });
      return new Promise((resolve) => {
        resolve([
          {
            label: "全部",
            value: [this.currentLevel, this.currentLevel + 1],
          },
          {
            label: "待审批",
            value: [this.currentLevel],
          },
          {
            label: "已审批",
            value: [this.currentLevel + 1],
          },
        ]);
      });
    },
    approve(row) {
      this.detailForm = { ...row };
      this.dialogFormVisible = true;
    },
    doApprove() {
      const { status, remark, id } = this.detailForm;
      editLeave({
        id,
        status: status + 1,
        remark,
        approver: this.user.nickName,
      }).then(() => {
        this.$message.success("已审批");
        if (this.queryParams.flow === 'zk' && status === 2) this.freshData();
        if (this.queryParams.flow === 'pt' && status === 3) this.freshData();
        this.query();
        this.dialogFormVisible = false;
      });
    },
    // 更新考勤
    freshData() {
      const { userId, days, leaveType, classes, startTime } =
        this.detailForm;
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
          const current = dayjs(startTime).add(index, "day").format("YYYY-MM-DD");
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
      batchAttendance(data);
    },
    recoil() {
      const { status, remark, id } = this.detailForm;
      editLeave({
        id,
        status: status - 1,
        remark,
        approver: this.user.nickName,
      }).then(() => {
        this.$message.success("已驳回！");
        this.dialogFormVisible = false;
      });
    },
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.query();
    },
    query() {
      this.loading = true;
      const { deptId } = this.queryParams;
      queryLeaves(
        Object.assign(this.queryParams, {
          deptId: typeof deptId === "number" ? deptId : deptId?.slice(-1)[0],
        })
      )
        .then((res) => {
          this.tableData = res.rows;
          this.total = res.total;
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
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
