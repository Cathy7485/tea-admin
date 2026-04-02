import client from "./client";

export interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  pendingOrders: number;
  revenue: number;
}

export const dashboardApi = {
  getStats() {
    return client.get<DashboardStats>("/dashboard/stats");
  },
};
