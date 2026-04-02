import type { TOrder } from "@/types/order";

export const orders: TOrder[] = [
  {
    id: "ORD-20240401-001",
    customerName: "王小明",
    customerEmail: "wang@example.com",
    status: "pending",
    items: [
      { productId: 1, productName: "阿里山高山烏龍", quantity: 2, price: 850 },
      { productId: 4, productName: "碧螺春綠茶", quantity: 1, price: 520 },
    ],
    total: 2220,
    createdAt: "2024-04-01T10:30:00Z",
  },
  {
    id: "ORD-20240401-002",
    customerName: "李美華",
    customerEmail: "lee@example.com",
    status: "shipped",
    items: [{ productId: 2, productName: "東方美人茶", quantity: 1, price: 1200 }],
    total: 1200,
    createdAt: "2024-04-01T14:00:00Z",
  },
  {
    id: "ORD-20240402-001",
    customerName: "陳大偉",
    customerEmail: "chen@example.com",
    status: "completed",
    items: [{ productId: 5, productName: "老茶師普洱熟茶", quantity: 3, price: 950 }],
    total: 2850,
    createdAt: "2024-04-02T09:15:00Z",
  },
  {
    id: "ORD-20240402-002",
    customerName: "林佳穎",
    customerEmail: "lin@example.com",
    status: "cancelled",
    items: [{ productId: 3, productName: "日月潭紅玉紅茶", quantity: 2, price: 680 }],
    total: 1360,
    createdAt: "2024-04-02T16:45:00Z",
  },
];
