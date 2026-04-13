import { productsApi } from "@/api";
import type { ProductStatus, TProduct } from "@/types/product";

export const useProductsStore = defineStore("productsStore", () => {
  const products = ref<TProduct[]>([]);
  const error = ref<string | null>(null);

  // 分頁資訊
  const pagination = reactive({
    totalCount: 0,
    page: 1,
    limit: 10,
  });

  // 取得商品列表
  const fetchProducts = async () => {
    try {
      const { data } = await productsApi.getList();

      console.log("data", data);
      products.value = data.data;

      pagination.limit = data.limit;
      pagination.page = data.page;
      pagination.totalCount = data.total;
    } catch (error) {}
  };

  // 編輯商品狀態
  const toggleStatus = async (id: number, isListed: boolean) => {
    try {
      await productsApi.toggleStatus(id, isListed);
      const index = products.value.findIndex((p) => p.id === id);
      if (index !== -1) {
        products.value[index].isListed = isListed;
      }
    } catch {
      error.value = "狀態更新失敗";
    }
  };

  return {
    error,
    products,
    pagination,
    fetchProducts,
    toggleStatus,
  };
});
