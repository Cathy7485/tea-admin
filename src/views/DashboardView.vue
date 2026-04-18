<!-- src/views/DashboardView.vue -->
<script setup lang="ts">
import { onMounted, computed } from "vue";
import { useDashboardStore } from "@/stores/dashboard";

const dashboard = useDashboardStore();

onMounted(() => {
  dashboard.fetchStats();
});

const statCards = computed(() => {
  const s = dashboard.stats;
  return [
    {
      label: "總商品數",
      value: s?.totalProducts ?? "-",
      unit: "項",
      color: "teal",
    },
    {
      label: "總訂單數",
      value: s?.totalOrders ?? "-",
      unit: "筆",
      color: "blue",
    },
    {
      label: "待處理訂單",
      value: s?.pendingOrders ?? "-",
      unit: "筆",
      color: "amber",
    },
    {
      label: "總營收",
      value: s ? `$${s.revenue.toLocaleString()}` : "-",
      unit: "",
      color: "green",
    },
    {
      label: "低庫存商品",
      value: s?.lowStockProducts ?? "-",
      unit: "項",
      color: "red",
    },
  ];
});
</script>

<template>
  <div class="dashboard">
    <!-- 載入中 -->
    <div v-if="dashboard.isLoading" class="dashboard__loading">載入中...</div>

    <!-- 錯誤 -->
    <div v-else-if="dashboard.error" class="dashboard__error">
      {{ dashboard.error }}
    </div>

    <!-- 統計卡片 -->
    <template v-else>
      <div class="dashboard__stats">
        <div
          v-for="card in statCards"
          :key="card.label"
          class="stat-card"
          :class="`stat-card--${card.color}`"
        >
          <p class="stat-card__label">{{ card.label }}</p>
          <p class="stat-card__value">
            {{ card.value }}
            <span v-if="card.unit" class="stat-card__unit">{{ card.unit }}</span>
          </p>
        </div>
      </div>

      <!-- 最新訂單 -->
      <div class="card">
        <div class="card__header">
          <h2 class="card__title">最新訂單</h2>
          <RouterLink :to="{ name: 'orders' }" class="btn btn--outline btn--sm">
            查看全部
          </RouterLink>
        </div>
        <p class="text-secondary" style="font-size: 0.875rem">
          訂單列表將在 OrdersView 完成後顯示。
        </p>
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped></style>
