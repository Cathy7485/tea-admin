import client from "./client";
import type { TOrder, OrderStatus } from "@/types/order";

export interface OrderQuery {
  status?: OrderStatus;
}

export interface OrderListResponse {
  data: TOrder[];
  total: number;
}

export const ordersApi = {
  getList(query: OrderQuery = {}) {
    return client.get<OrderListResponse>("/orders", { params: query });
  },

  getById(id: string) {
    return client.get<TOrder>(`/orders/${id}`);
  },

  updateStatus(id: string, status: OrderStatus) {
    return client.patch<TOrder>(`/orders/${id}/status`, { status });
  },
};
