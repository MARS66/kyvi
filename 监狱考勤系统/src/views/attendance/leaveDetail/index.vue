<!--
 * @Description: 
 * @Author: Kevin
 * @Date: 2024-05-21 09:18:20
 * @LastEditors: Kevin
 * @LastEditTime: 2024-09-03 10:59:04
-->
<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      label-width="80px"
    >
    <el-row :gutter="24">
      <el-col :span="8">
        <el-form-item label="人员姓名" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入姓名"
          clearable
          size="small"
          prefix-icon="el-icon-search"
        />
      </el-form-item>
      </el-col>
      <el-col :span="8">
      <el-form-item label="开始时间" prop="startTime">
        <el-date-picker
            v-model="queryParams.startTime"
            type="date"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
            style="width: 100%"
          />
      </el-form-item>
      </el-col>
      <el-col :span="8">
      <el-form-item label="结束时间" prop="endTime">
        <el-date-picker
            v-model="queryParams.endTime"
            type="date"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
            style="width: 100%"
          />
      </el-form-item>
      </el-col>
      <el-col :span="8">
      <el-form-item label="所属部门" prop="deptId">
        <el-cascader
          v-model="queryParams.deptId"
          :options="deptOptions"
           style="width: 100%"
          :props="{ checkStrictly: true, value: 'id' }"
        ></el-cascader>
      </el-form-item>
      </el-col>
      <el-col :span="8">
      <el-form-item label="请假类型" prop="deptId">
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
      </el-col>
      <el-col :span="8">
      <el-form-item>
        <div style="display: flex; align-items: center; justify-content: flex-end;">

          <el-button
            type="primary"
            icon="el-icon-search"
            size="mini"
            @click="handleQuery"
          >
            搜索
          </el-button>
        </div>
      </el-form-item>
        
      </el-col>
    </el-row>
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
            <el-button @click="approve(scope.row)" type="text" size="small"
              >详情</el-button
            >
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
    <el-dialog
      title="请假审批"
      :visible.sync="dialogFormVisible"
      footer="false"
    >
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
        <el-descriptions-item label="备注">
          {{ detailForm.mark }}
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { deptTreeSelect } from "@/api/system/user";
import { queryLeaves } from "@/api/leave";
import { workTypes } from "@/utils/work-type";
export default {
  name: "LeaveDetail",
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
            return row.status == -1 ? "驳回" : "通过";
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
        pageSize: 10,
      },
    };
  },
  computed: {
    ...mapGetters(["user"]),
    workTypes() {
      return workTypes.filter(item => item.type==='a')
    },
  },
  watch: {},
  created() {
    deptTreeSelect().then((res) => {
      this.deptOptions = res.data;
      this.queryParams.deptId = [res.data[0].id];
      this.handleQuery();
    });
  },
  mounted() {},
  methods: {
    approve(row) {
      this.detailForm = { ...row };
      this.dialogFormVisible = true;
    },
    doApprove(val) {
      this.detailForm.status += val;
      this.dialogFormVisible = false;
    },
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.query();
    },
    query() {
      const { deptId } = this.queryParams;
      queryLeaves(
        Object.assign(this.queryParams, {
          status: [-1, 2, 3],
          deptId: typeof deptId === "number" ? deptId : deptId?.slice(-1)[0],
        })
      ).then((res) => {
        this.tableData = res.rows;
        this.total = res.total;
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
