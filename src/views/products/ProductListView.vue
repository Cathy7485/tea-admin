<script setup lang="ts">
import { useProductsStore } from "@/stores/products.ts";
import TableWrapper from "@/components/Table/TableWrapper.vue";

// import Pagination from "@/components/Pagination/index.vue";
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
const handleSwitchChange = async ({ row, value }: { row: any; value: boolean }) => {
  // 紀錄原始狀態
  const originalState = !value;
  const actionText = value ? "開啟" : "關閉";

  // 將 UI 狀態改回原始狀態 (重要！防止彈窗時開關已經亮起)
  row.schedule_state = originalState;

  try {
    await ElMessageBox.confirm(
      `確定要${actionText}「${row.schedule_name}」排程嗎？`,
      "修改排程狀態",
      {
        confirmButtonText: "確定",
        cancelButtonText: "取消",
        type: value ? "primary" : "warning",
      },
    );

    // const result = await switchScheduleState(row.id, value);

    if (result.success) {
      row.schedule_state = value;
      ElMessage.success(`已成功${actionText}排程`);
    } else {
      throw new Error("API 更新失敗");
    }
  } catch (err) {
    row.schedule_state = originalState;

    // 只有在非「取消」的情況下才報錯
    if (err !== "cancel") {
      ElMessage.error("更新狀態失敗，請稍後再試");
      console.warn("切換失敗:", err);
    }
  }
};

// 表格操作按鈕UI群組
const editGroup = computed(() => {
  const btnGroup: any[] = [];
  btnGroup.push({
    iconInfo: { component: IconEdit },
    callback: (data: any) => {
      // handleCallDialog("modify", data);
    },
  });
  btnGroup.push({
    iconInfo: { component: IconDelete },
    callback: (data: any) => {
      // handleCallDialog("delete", data);
    },
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
</template>

<style lang="scss" scoped></style>
