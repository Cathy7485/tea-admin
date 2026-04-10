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

<style lang="scss" scoped>
@use "@/style/utils/functions" as *;

.dashboard {
  display: flex;
  flex-direction: column;
  // gap: $spacing-6;

  &__loading,
  &__error {
    text-align: center;
    // padding: $spacing-8;
    // color: $color-text-secondary;
  }

  &__error {
    // color: $color-danger;
  }

  &__stats {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    // gap: $spacing-4;

    @media (max-width: 1200px) {
      grid-template-columns: repeat(3, 1fr);
    }

    @media (max-width: 768px) {
      grid-template-columns: repeat(2, 1fr);
    }
  }
}

// 卡片基底
.stat-card {
  display: flex;
  flex-direction: column;
  margin: 0.25rem;

  &__label {
    font-size: rem(16);
    // color: $color-text-secondary;
    font-weight: 500;
  }

  &__value {
    font-size: rem(28);
    font-weight: 700;
    line-height: 1;
  }

  &__unit {
    font-size: rem(15);
    font-weight: 400;
    margin-left: 2px;
  }

  // 各顏色
  &--teal .stat-card__value {
    color: #0f6e56;
  }
  &--blue .stat-card__value {
    color: #185fa5;
  }
  &--amber .stat-card__value {
    color: #854f0b;
  }
  &--green .stat-card__value {
    color: #3b6d11;
  }
  &--red .stat-card__value {
    color: #a32d2d;
  }
}
</style>
