<script setup lang="ts">
import { useProductsStore } from "@/stores/products.ts";
import TableWrapper from "@/components/Table/TableWrapper.vue";
import ProductDialog from "@/components/Dialog/ProductDialog.vue";
import Pagination from "@/components/Pagination/index.vue";
import IconEdit from "@/components/icons/IconEdit.vue";
import IconDelete from "@/components/icons/IconDelete.vue";
import { PRODUCTS_TABLE_HEAD } from "@/constants/products.ts";

import { ElMessage, ElMessageBox } from "element-plus";
import type { TProduct } from "@/types/product";

const productsStore = useProductsStore();
const { fetchProducts } = productsStore;
const { products } = storeToRefs(productsStore);

// ========================
// 彈窗狀態管理
// ========================
const dialogVisible = ref(false);
// 彈窗資料與類型
const dialogState = reactive({
  visible: false,
  type: "" as "add" | "edit" | "delete",
  formData: null as TProduct | null,
  dialogTitle: "",
});

const dialogRules = {
  name: [
    { required: true, message: "產品名稱為必填項", trigger: "blur" },
    { min: 2, max: 50, message: "名稱長度應在 2-50 個字符之間", trigger: "blur" },
  ],
  description: [
    { required: true, message: "產品描述為必填項", trigger: "blur" },
    { min: 10, max: 500, message: "描述長度應在 10-500 個字符之間", trigger: "blur" },
  ],
  category: [{ required: true, message: "請選擇產品分類", trigger: "change" }],
  price: [
    { required: true, message: "價格為必填項", trigger: "blur" },
    { type: "number", message: "價格必須是數字", trigger: "blur" },
    {
      validator: (rule: any, value: any, callback: any) => {
        if (value <= 0) {
          callback(new Error("價格必須大於 0"));
        } else {
          callback();
        }
      },
      trigger: "blur",
    },
  ],
  stock: [
    { required: true, message: "庫存為必填項", trigger: "blur" },
    { type: "number", message: "庫存必須是數字", trigger: "blur" },
    {
      validator: (rule: any, value: any, callback: any) => {
        if (value < 0) {
          callback(new Error("庫存不能為負數"));
        } else {
          callback();
        }
      },
      trigger: "blur",
    },
  ],
  isListed: [{ type: "boolean", message: "上架狀態必須是布林值" }],
};

// 打開新增彈窗
const handleOpenAddDialog = () => {
  dialogState.type = "add";
  dialogState.formData = null;
  dialogVisible.value = true;
};

// 打開編輯彈窗
const handleOpenEditDialog = (type: "edit", product: TProduct) => {
  dialogState.type = type;
  dialogState.dialogTitle = "編輯";
  dialogState.formData = product;
  dialogVisible.value = true;
};

// 關閉彈窗
const handleDialogClose = () => {
  dialogVisible.value = false;
  dialogState.formData = null;
};

// 處理彈窗提交
const handleDialogSubmit = async (formData: TProduct) => {
  try {
    if (dialogType.value === "add") {
      await addProduct(formData);
    } else if (dialogType.value === "edit" && currentEditingProduct.value) {
      await updateProduct(currentEditingProduct.value.id, formData);
    }

    // 重新獲取產品列表
    await fetchProducts();
    dialogVisible.value = false;
  } catch (error) {
    console.error("提交失敗:", error);
    ElMessage.error("操作失敗，請稍後再試");
  }
};

// 處理刪除
const handleDeleteProduct = async (product: TProduct) => {
  try {
    await ElMessageBox.confirm(`確定要刪除「${product.name}」嗎？此操作無法撤銷。`, "刪除產品", {
      confirmButtonText: "刪除",
      cancelButtonText: "取消",
      type: "warning",
    });

    await deleteProduct(product.id);
    await fetchProducts();
    ElMessage.success("刪除成功");
  } catch (err) {
    if (err === "cancel" || err === "close") {
      return;
    }
    ElMessage.error("刪除失敗，請稍後再試");
  }
};

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
    callback: (productData: any) => {
      // handleCallDialog("modify", productData);
      handleOpenEditDialog("edit", productData);
    },
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

  <ProductDialog
    :dialogVisible="dialogVisible"
    :dialogTitle="dialogState.dialogTitle"
    :defaultFormData="dialogState.formData"
    :dialogRules="dialogRules"
    :dialogType="dialogState.type"
    @update:dialogVisible="(val: any) => (dialogVisible = val)"
    @submit="handleDialogSubmit"
    @close="handleDialogClose"
  />
</template>

<style lang="scss" scoped></style>
