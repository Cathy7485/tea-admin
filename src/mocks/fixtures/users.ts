import type { TAdminUser } from "@/types/user";

export let users: TAdminUser[] = [
  {
    id: 1,
    name: "系統管理員",
    email: "admin@mail.com",
    password: "admin1234",
    role: "admin",
    createdAt: "2026-04-01T00:00:00Z",
  },
  {
    id: 2,
    name: "商品編輯員",
    email: "editor@mail.com",
    password: "admin1234",
    role: "editor",
    createdAt: "2026-04-15T00:00:00Z",
  },
];
