<script setup lang="ts">
import { useAuthStore } from "@/stores/auth";
import { ElMessage } from "element-plus";

const router = useRouter();

const authStore = useAuthStore();
const { logout } = authStore;

const handleLogout = async () => {
  try {
    await logout();
    ElMessage.success("登出成功");
    router.push("/login");
  } catch (error) {
    ElMessage.error("登出失敗");
    // console.error("登出失敗", error);
  }
  await logout();
};
</script>

<template>
  <header>
    <a href="" @click.prevent="handleLogout">登出</a>
  </header>
</template>

<style lang="scss" scoped></style>
