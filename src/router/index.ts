// admin/router/index.ts
import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/LoginView.vue"),
    meta: { title: "後台登入", guestOnly: true },
  },

  // 後台主體（AdminLayout 包覆）
  {
    path: "/",
    component: () => import("@/layouts/AdminLayout.vue"),
    meta: { requiresAuth: true },
    children: [
      {
        path: "",
        name: "dashboard",
        component: () => import("@/views/DashboardView.vue"),
        meta: { title: "總覽" },
      },

      // 商品管理
      {
        path: "products",
        meta: { title: "商品管理", roles: ["admin", "editor"] },
        children: [
          {
            path: "",
            name: "products",
            component: () => import("@/views/products/ProductListView.vue"),
          },
          {
            path: "create",
            name: "product-create",
            component: () => import("@/views/products/ProductFormView.vue"),
            meta: { title: "新增商品" },
          },
          {
            path: ":id/edit",
            name: "product-edit",
            component: () => import("@/views/products/ProductFormView.vue"),
            meta: { title: "編輯商品" },
          },
        ],
      },

      // 訂單管理
      {
        path: "orders",
        meta: { title: "訂單管理", roles: ["admin", "editor"] },
        children: [
          {
            path: "",
            name: "orders",
            component: () => import("@/views/orders/OrderListView.vue"),
          },
          {
            path: ":id",
            name: "order-detail",
            component: () => import("@/views/orders/OrderDetailView.vue"),
            meta: { title: "訂單詳情" },
          },
        ],
      },

      // 會員管理（僅 admin）
      {
        path: "users",
        meta: { title: "會員管理", roles: ["admin"] },
        children: [
          {
            path: "",
            name: "users",
            component: () => import("@/views/users/UserListView.vue"),
          },
          {
            path: ":id",
            name: "user-detail",
            component: () => import("@/views/users/UserDetailView.vue"),
            meta: { title: "會員詳情" },
          },
        ],
      },

      // 系統設定（僅 admin）
      {
        path: "settings",
        name: "settings",
        component: () => import("@/views/SettingsView.vue"),
        meta: { title: "系統設定", roles: ["admin"] },
      },

      // 403 無權限頁
      {
        path: "forbidden",
        name: "forbidden",
        component: () => import("@/views/ForbiddenView.vue"),
        meta: { title: "無存取權限" },
      },
    ],
  },

  // 404
  {
    path: "/:pathMatch(.*)*",
    name: "not-found",
    component: () => import("@/views/NotFoundView.vue"),
    meta: { title: "找不到頁面" },
  },
];

const router = createRouter({
  history: createWebHistory("/"),
  routes,
  scrollBehavior: () => ({ top: 0 }),
});

export default router;
