<script setup lang="ts">
import { useProductsStore } from "@/stores/products.ts";
import TableWrapper from "@/components/Table/TableWrapper.vue";

import Pagination from "@/components/Pagination/index.vue";
import IconEdit from "@/components/icons/IconEdit.vue";
import IconDelete from "@/components/icons/IconDelete.vue";
import { PRODUCTS_TABLE_HEAD } from "@/constants/products.ts";

import { ElMessage, ElMessageBox } from "element-plus";
import type { TProduct } from "@/types/product";

const productsStore = useProductsStore();
const { fetchProducts } = productsStore;
const { products } = storeToRefs(productsStore);

// table搜尋
const searchKey = ref("");

// 列表switch 開關
const handleSwitchChange = async ({ row, value }: { row: TProduct; value: boolean }) => {
  try {
    await ElMessageBox.confirm(
      `確定要${value ? "上架" : "下架"}「${row.name}」嗎？`,
      "修改上架狀態",
      { confirmButtonText: "確定", cancelButtonText: "取消" },
    );

    await productsStore.toggleStatus(row.id, value);
    row.isListed = value; // 同步更新 row

    ElMessage.success(`已${value ? "上架" : "下架"}`);
  } catch (err) {
    if (err === "cancel" || err === "close") {
      row.isListed = !value; // 取消 → switch 改回來
      return;
    }
    row.isListed = !value;
    ElMessage.error("更新失敗，請稍後再試");
  }
};

// 表格操作按鈕UI群組
const editGroup = computed(() => {
  const btnGroup: any[] = [];
  btnGroup.push({
    iconInfo: { component: IconEdit },
    // callback: (data: any) => {
    // handleCallDialog("modify", data);
    // },
  });
  btnGroup.push({
    iconInfo: { component: IconDelete },
    // callback: (data: any) => {
    // handleCallDialog("delete", data);
    // },
  });

  return {
    label: "狀態編輯", // 表頭顯示文字
    btnGroup,
  };
});

// -------------------------
// 分頁狀態
const currentPage = ref(1);
const limit = 6;
const maxVisible = 5;
const currentPageData = ref<TProduct[]>([]);

// 總計資料筆數
const totalCount = computed(() => products.value?.length);

// 換頁及分頁呈現資料
watch(
  [() => products.value, () => currentPage.value],
  ([list, page]) => {
    const start = (page - 1) * limit;
    currentPageData.value = list.slice(start, start + limit);
  },
  { immediate: true },
);

onMounted(() => {
  fetchProducts();
});
</script>

<template>
  <TableWrapper
    :rowHeadItems="PRODUCTS_TABLE_HEAD"
    :rowDataItems="currentPageData"
    :searchKey="searchKey"
    :edit="editGroup"
    :switch="{ callback: handleSwitchChange }"
    :rowKey="'id'"
  />

  <Pagination
    :totalCount="totalCount"
    :limit="limit"
    :maxVisible="maxVisible"
    :isShowChart="false"
    v-model:currentPage="currentPage"
  />
</template>

<style lang="scss" scoped></style>
