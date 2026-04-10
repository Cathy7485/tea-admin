import { productsApi } from "@/api";
import type { TProduct } from "@/types/product";

export const useProductsStore = defineStore("productsStore", () => {
  const products = ref<TProduct[]>([]);

  const fetchProducts = async () => {
    try {
      const { data } = await productsApi.getList();

      console.log("data", data);
      products.value = data.data;
    } catch (error) {}
  };

  return {
    products,
    fetchProducts,
  };
});
