export type TProduct = {
  id: number;
  name: string;
  slug: string;
  category: string;
  price: number;
  stock: number;
  status: ProductStatus;
  isListed: boolean;
  description: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
};

export type ProductStatus = "active" | "soldout" | "low_stock" | "draft";

export type ProductPayload = Omit<TProduct, "id" | "createdAt" | "updatedAt">;
