export type TProduct = {
  id: number;
  name: string;
  slug: string;
  category: string;
  price: number;
  stock: number;
  status: "active" | "soldout" | "low_stock";
  description: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
};

export type ProductPayload = Omit<TProduct, "id" | "createdAt" | "updatedAt">;
