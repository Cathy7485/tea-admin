import axios from "axios";
import { useAuthStore } from "@/stores/auth";
import router from "@/router";

const client = axios.create({
  baseURL: "/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 請求攔截器 — 每次發請求前自動帶上 token
client.interceptors.request.use((config) => {
  const token = localStorage.getItem("admin_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 回應攔截器 — 統一處理錯誤
client.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      // token 過期或無效 → 登出並導回登入頁
      const auth = useAuthStore();
      auth.logout();
      router.push({ name: "login" });
    }

    if (status === 403) {
      router.push({ name: "forbidden" });
    }

    // 把錯誤往上拋，讓各 API 函式或元件自行處理
    return Promise.reject(error);
  },
);

export default client;
