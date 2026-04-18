// 產品種類中文映射
export const CATEGORY_MAP = {
  oolong: "烏龍",
  "black-tea": "紅茶",
  green: "綠茶",
  puerh: "普洱",
};

// 產品狀態中文映射
export const STATUS_MAP = {
  active: "上架中",
  soldout: "已售罄",
  low_stock: "庫存不足",
  draft: "草稿",
};

// 狀態class映射
export const PRODUCT_STATUS_CLASS_MAP: Record<string, string> = {
  上架中: "status-active",
  已售罄: "status-soldout",
  庫存不足: "status-low-stock",
  草稿: "status-draft",
};

// 產品表格資料欄位定義
export const PRODUCTS_TABLE_HEAD = [
  {
    label: "產品",
    prop: "imageUrl",
    type: "image",
  },
  {
    label: "產品名稱",
    prop: "name",
    minWidth: "120",
  },
  {
    label: "產品種類",
    prop: "category",
    mapping: CATEGORY_MAP,
  },
  {
    label: "產品價格",
    prop: "price",
  },
  {
    label: "產品描述",
    prop: "description",
    minWidth: "120",
  },
  {
    label: "產品庫存",
    prop: "stock",
  },
  {
    label: "產品狀態",
    prop: "status",
    mapping: STATUS_MAP,
  },
  {
    label: "上架狀態",
    prop: "isListed",
    type: "switch",
  },
];
