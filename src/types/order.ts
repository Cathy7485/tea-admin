export type TOrder = {
  id: string;
  customerName: string;
  customerEmail: string;
  status: "pending" | "shipped" | "completed" | "cancelled";
  items: TOrderItem[];
  total: number;
  createdAt: string;
};

export type TOrderItem = {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
};

export type OrderStatus = "pending" | "shipped" | "completed" | "cancelled";
