<script setup lang="ts">
import { RouterView, useRoute } from "vue-router";
import { useAuthStore } from "@/stores/auth";

import Navbar from "@/layouts/Navbar.vue";

const route = useRoute();
const auth = useAuthStore();

const navItems = [
  { name: "dashboard", label: "系統總覽", icon: "▦" },
  { name: "products", label: "商品管理", icon: "◫" },
  { name: "orders", label: "訂單管理", icon: "◪" },
  { name: "users", label: "會員管理", icon: "◯", roles: ["admin"] },
  { name: "settings", label: "系統設定", icon: "◎", roles: ["admin"] },
];

// 只顯示有權限的選單
const visibleNavItems = navItems.filter(
  (item) => !item.roles || item.roles.includes(auth.userRole),
);
</script>

<template>
  <div class="admin-layout">
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

    <div class="admin-main">
      <Navbar />
      <main class="admin-content">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
