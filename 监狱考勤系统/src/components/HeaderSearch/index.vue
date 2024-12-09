<template>
  <div :class="{ show: show }" class="header-search">
    <!-- <svg-icon class-name="search-icon" icon-class="search" @click.stop="click" /> -->
    <el-popover placement="bottom" width="400" trigger="click">
      <el-card :body-style="{ padding: '0px' }">
        <div class="avatar-wrapper">
          <img :src="avatar" class="user-avatar" />
          <i class="el-icon-caret-bottom" />
        </div>
        <div style="padding: 14px">
          <span v-if="user.dept"
            >{{ user.dept.deptName }} / {{ postGroup }}：</span
          >
          <span>{{ user.userName }}</span>
          <div class="bottom clearfix">
            <!-- <div> -->
            <el-button type="text" class="button">
              <router-link to="/user/profile"> 个人中心 </router-link>
            </el-button>
            <!-- </div> -->
            <el-button type="text" class="button" @click.native="logout"
              >退出登录</el-button
            >
          </div>
        </div>
      </el-card>

      <el-button
        class-name="search-icon"
        icon="el-icon-user"
        circle
        slot="reference"
        style="margin-top: 10px"
      ></el-button>
    </el-popover>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { getUserProfile } from "@/api/system/user";
export default {
  name: "HeaderSearch",
  data() {
    return {
      user: {},
      roleGroup: {},
      postGroup: {},
      activeTab: "userinfo",
    };
  },
  computed: {
    ...mapGetters(["user", "avatar"]),
  },
  mounted() {
    this.getUser();
  },
  created() {
    this.getUser();
  },
  methods: {
    ...mapActions(["SetPostGroup"]),
    async logout() {
      this.$confirm("确定注销并退出系统吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$store.dispatch("LogOut").then(() => {
            location.href = "/index";
          });
        })
        .catch(() => {});
    },
    getUser() {
      getUserProfile().then((response) => {
        this.user = response.data;
        this.roleGroup = response.roleGroup;
        this.postGroup = response.postGroup;
        this.SetPostGroup(response.postGroup);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.header-search {
  font-size: 0 !important;

  .search-icon {
    cursor: pointer;
    font-size: 18px;
    vertical-align: middle;
  }

  .header-search-select {
    font-size: 18px;
    transition: width 0.2s;
    width: 0;
    overflow: hidden;
    background: transparent;
    border-radius: 0;
    display: inline-block;
    vertical-align: middle;

    ::v-deep .el-input__inner {
      border-radius: 0;
      border: 0;
      padding-left: 0;
      padding-right: 0;
      box-shadow: none !important;
      border-bottom: 1px solid #d9d9d9;
      vertical-align: middle;
    }
  }

  &.show {
    .header-search-select {
      width: 210px;
      margin-left: 10px;
    }
  }
}

.avatar-container {
  margin-right: 30px;

  .avatar-wrapper {
    margin-top: 5px;
    position: relative;

    .user-avatar {
      cursor: pointer;
      width: 40px;
      height: 40px;
      border-radius: 10px;
    }

    .el-icon-caret-bottom {
      cursor: pointer;
      position: absolute;
      right: -20px;
      top: 25px;
      font-size: 12px;
    }
  }
}

.el-card ::v-deep .el-card__body {
  display: flex;
}
</style>
