import client from "./client";
import type { TProduct, ProductPayload, ProductStatus } from "@/types/product";

// 查詢參數型別
export interface ProductQuery {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
}

// 列表回傳型別
export interface ProductListResponse {
  data: TProduct[];
  total: number;
  page: number;
  limit: number;
}

export const productsApi = {
  // 取得商品列表
  getList(query: ProductQuery = {}) {
    return client.get<ProductListResponse>("/products", { params: query });
  },

  // 取得單一商品
  getById(id: number) {
    return client.get<TProduct>(`/products/${id}`);
  },

  // 新增商品
  create(payload: ProductPayload) {
    return client.post<TProduct>("/products", payload);
  },

  // 更新商品
  update(id: number, payload: ProductPayload) {
    return client.put<TProduct>(`/products/${id}`, payload);
  },

  // 更新商品狀態
  toggleStatus(id: number, isListed: boolean) {
    return client.patch<TProduct>(`/products/${id}/status`, { isListed });
  },

  // 刪除商品
  delete(id: number) {
    return client.delete(`/products/${id}`);
  },
};
