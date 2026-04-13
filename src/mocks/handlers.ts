import { http, HttpResponse } from "msw";
import { products, orders, users } from "./fixtures";
import type { ProductPayload, ProductStatus } from "@/types/product";
import type { OrderStatus } from "@/types/order";
import type { TAdminUser } from "@/types/user";

// 用 let 讓 CRUD 操作可以修改資料
let productList = [...products];
let orderList = [...orders];

export const handlers = [
  // ==================
  // 驗證
  // ==================

  http.post("/api/auth/login", async ({ request }) => {
    const body = (await request.json()) as { email: string; password: string };
    const user = users.find((u) => u.email === body.email);

    if (!user || user.password !== body.password) {
      return HttpResponse.json({ message: "帳號或密碼錯誤" }, { status: 401 });
    }

    // 安全處理：回傳給前端前，把 password 欄位拔除
    const { password, ...safeUser } = user;

    return HttpResponse.json({
      token: `mock-token-${user.id}`,
      user: safeUser, // 沒有密碼的使用者資料
    });
  }),

  // ==================
  // 登出
  // ==================

  http.post("/api/auth/logout", () => {
    return HttpResponse.json({ message: "ok" });
  }),

  // ==================
  // 註冊
  // ==================

  http.post("/api/auth/register", async ({ request }) => {
    const body = (await request.json()) as {
      name: string;
      email: string;
      password: string;
    };

    // 檢查 email 是否已被使用
    const exists = users.find((u) => u.email === body.email);
    if (exists) {
      return HttpResponse.json({ message: "此 Email 已被註冊" }, { status: 409 });
    }

    // 建立新使用者
    const newUser: TAdminUser = {
      id: Math.max(...users.map((u) => u.id)) + 1,
      name: body.name,
      email: body.email,
      role: "editor",
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);

    return HttpResponse.json(
      {
        token: `mock-token-${newUser.id}`,
        user: newUser,
      },
      { status: 201 },
    );
  }),

  // ==================
  // 取得目前使用者資訊
  // ==================

  http.get("/api/auth/me", ({ request }) => {
    const auth = request.headers.get("Authorization");
    if (!auth) {
      return HttpResponse.json({ message: "未登入" }, { status: 401 });
    }

    // mock token 格式是 mock-token-{userId}
    const userId = Number(auth.replace("Bearer mock-token-", ""));
    const user = users.find((u) => u.id === userId);

    if (!user) {
      return HttpResponse.json({ message: "無效 token" }, { status: 401 });
    }

    return HttpResponse.json(user);
  }),

  // ==================
  // 註冊
  // ==================
  http.post("/api/auth/register", async ({ request }) => {
    const body = (await request.json()) as { name: string; email: string; password: string };

    // 檢查信箱是否已經存在
    const isExist = users.some((u) => u.email === body.email);
    if (isExist) {
      return HttpResponse.json({ message: "此 Email 已被註冊" }, { status: 409 });
    }

    // 建立新使用者
    const newUser: TAdminUser = {
      id: Math.max(...users.map((u) => u.id), 0) + 1, // 自動遞增 ID
      name: body.name || "新進人員",
      email: body.email,
      password: body.password, // 存入密碼供日後登入比對
      role: "editor", // 預設給予一般權限
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);

    // 安全處理：回傳給前端前，把 password 欄位拔除
    const { password, ...safeUser } = newUser;

    return HttpResponse.json(
      {
        message: "註冊成功",
        user: safeUser,
      },
      { status: 201 },
    );
  }),

  http.post("/api/auth/logout", () => {
    return HttpResponse.json({ message: "ok" });
  }),

  // ==================
  // 商品 CRUD
  // ==================

  http.get("/api/products", ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page") ?? 1);
    const limit = Number(url.searchParams.get("limit") ?? 10);
    const search = url.searchParams.get("search") ?? "";
    const category = url.searchParams.get("category") ?? "";

    let result = [...productList];

    if (search) result = result.filter((p) => p.name.includes(search));
    if (category) result = result.filter((p) => p.category === category);

    const total = result.length;
    const data = result.slice((page - 1) * limit, page * limit);

    return HttpResponse.json({ data, total, page, limit });
  }),

  http.get("/api/products/:id", ({ params }) => {
    const product = productList.find((p) => p.id === Number(params.id));

    if (!product) return HttpResponse.json({ message: "商品不存在" }, { status: 404 });

    return HttpResponse.json(product);
  }),

  http.post("/api/products", async ({ request }) => {
    const body = (await request.json()) as ProductPayload;
    const newProduct = {
      ...body,
      id: Math.max(...productList.map((p) => p.id)) + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    productList.push(newProduct);
    return HttpResponse.json(newProduct, { status: 201 });
  }),

  http.put("/api/products/:id", async ({ params, request }) => {
    const body = (await request.json()) as ProductPayload;
    const index = productList.findIndex((p) => p.id === Number(params.id));

    if (index === -1) return HttpResponse.json({ message: "商品不存在" }, { status: 404 });

    productList[index] = {
      ...productList[index],
      ...body,
      updatedAt: new Date().toISOString(),
    };
    return HttpResponse.json(productList[index]);
  }),

  // 產品上下架狀態切換
  http.patch("/api/products/:id/status", async ({ params, request }) => {
    const body = (await request.json()) as { isListed: boolean };
    const index = productList.findIndex((p) => p.id === Number(params.id));

    if (index === -1) return HttpResponse.json({ message: "商品不存在" }, { status: 404 });

    productList[index] = {
      ...productList[index],
      isListed: body.isListed,
      updatedAt: new Date().toISOString(),
    };
    return HttpResponse.json(productList[index]);
  }),

  http.delete("/api/products/:id", ({ params }) => {
    const index = productList.findIndex((p) => p.id === Number(params.id));

    if (index === -1) return HttpResponse.json({ message: "商品不存在" }, { status: 404 });

    productList.splice(index, 1);
    return new HttpResponse(null, { status: 204 });
  }),

  // ==================
  // 訂單
  // ==================

  http.get("/api/orders", ({ request }) => {
    const url = new URL(request.url);
    const status = url.searchParams.get("status") ?? "";

    let result = [...orderList];
    if (status) result = result.filter((o) => o.status === status);

    return HttpResponse.json({ data: result, total: result.length });
  }),

  http.get("/api/orders/:id", ({ params }) => {
    const order = orderList.find((o) => o.id === params.id);

    if (!order) return HttpResponse.json({ message: "訂單不存在" }, { status: 404 });

    return HttpResponse.json(order);
  }),

  http.patch("/api/orders/:id/status", async ({ params, request }) => {
    const body = (await request.json()) as { status: OrderStatus };
    const index = orderList.findIndex((o) => o.id === params.id);

    if (index === -1) return HttpResponse.json({ message: "訂單不存在" }, { status: 404 });

    orderList[index] = { ...orderList[index], status: body.status };
    return HttpResponse.json(orderList[index]);
  }),

  // ==================
  // Dashboard 統計
  // ==================

  http.get("/api/dashboard/stats", () => {
    return HttpResponse.json({
      totalProducts: productList.length,
      totalOrders: orderList.length,
      pendingOrders: orderList.filter((o) => o.status === "pending").length,
      revenue: orderList
        .filter((o) => o.status === "completed")
        .reduce((sum, o) => sum + o.total, 0),
      lowStockProducts: productList.filter((o) => o.status === "low_stock").length,
    });
  }),
];
