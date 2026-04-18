<script setup lang="ts">
import { useAuthStore } from "@/stores/auth";
import { ElMessage, ElMessageBox } from "element-plus";

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();

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

    router.push({ name: "login" });
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
  <header class="admin-header">
    <h1 class="admin-header__title">{{ route.meta.title }}</h1>

    <div class="admin-header__actions">
      <span class="admin-header__user">{{ auth.user?.name }}</span>
      <button class="button outline-button" @click="handleLogout">登出</button>
    </div>
  </header>
</template>

<style lang="scss" scoped></style>
