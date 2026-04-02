<script setup lang="ts">
import { useAuthStore } from "@/stores/auth";
import { ElMessage, ElMessageBox } from "element-plus";

const router = useRouter();

const authStore = useAuthStore();
const { logout } = authStore;

const handleLogout = async () => {
  try {
    await ElMessageBox.confirm("您確定要登出系統嗎？", "提示", {
      confirmButtonText: "確定登出",
      cancelButtonText: "取消",
      type: "warning",
    });

    await logout();
    ElMessage.success("登出成功");
    router.push("/login");
  } catch (error) {
    if (error === "cancel") {
      // 取消
    } else {
      ElMessage.error("登出失敗，請稍後再試");
      // console.error(error);
    }
  }
};
</script>

<template>
  <header class="header">
    <h1 class="logo">
      <router-link to="/">茶葉管理系統</router-link>
    </h1>
    <button type="button" class="button outline-button" @click.prevent="handleLogout">登出</button>
  </header>
</template>

<style lang="scss" scoped></style>
