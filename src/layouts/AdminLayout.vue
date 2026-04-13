<!-- <script setup lang="ts">
import Navbar from "./Navbar.vue";
</script>

<template>
  <Navbar />
  <router-view />
</template>

<style lang="scss" scoped></style> -->

<!-- src/layouts/AdminLayout.vue -->
<script setup lang="ts">
import { RouterView, useRoute } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();

const navItems = [
  { name: "dashboard", label: "總覽", icon: "▦" },
  { name: "products", label: "商品管理", icon: "◫" },
  { name: "orders", label: "訂單管理", icon: "◪" },
  { name: "users", label: "會員管理", icon: "◯", roles: ["admin"] },
  { name: "settings", label: "系統設定", icon: "◎", roles: ["admin"] },
];

// 只顯示有權限的選單
const visibleNavItems = navItems.filter(
  (item) => !item.roles || item.roles.includes(auth.userRole),
);

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
  <div class="admin-layout">
    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="sidebar__logo">茶葉後台</div>

      <nav class="sidebar__nav">
        <RouterLink
          v-for="item in visibleNavItems"
          :key="item.name"
          :to="{ name: item.name }"
          class="sidebar__item"
          :class="{ 'sidebar__item--active': route.name === item.name }"
        >
          <span class="sidebar__icon">{{ item.icon }}</span>
          <span>{{ item.label }}</span>
        </RouterLink>
      </nav>
    </aside>

    <!-- 右側主體 -->
    <div class="admin-main">
      <!-- Header / Navbar -->
      <header class="admin-header">
        <h1 class="admin-header__title">{{ route.meta.title }}</h1>

        <div class="admin-header__actions">
          <span class="admin-header__user">{{ auth.user?.name }}</span>
          <button class="outline-button" @click="handleLogout">登出</button>
        </div>
      </header>

      <!-- 頁面內容 -->
      <main class="admin-content">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
