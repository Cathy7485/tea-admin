// src/stores/dashboard.ts
import { defineStore } from "pinia";
import { ref } from "vue";
import { dashboardApi } from "@/api";
import type { DashboardStats } from "@/api";

export const useDashboardStore = defineStore("dashboard", () => {
  const stats = ref<DashboardStats | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const fetchStats = async () => {
    isLoading.value = true;
    error.value = null;
    try {
      const { data } = await dashboardApi.getStats();
      stats.value = data;
    } catch {
      error.value = "統計資料載入失敗";
    } finally {
      isLoading.value = false;
    }
  };

  return { stats, isLoading, error, fetchStats };
});
