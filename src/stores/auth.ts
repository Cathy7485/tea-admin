import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { authApi } from "@/api";
import type { LoginPayload } from "@/api";
import type { TAdminUser } from "@/types/user";
import type { RegisterPayload } from "@/api/auth";

export const useAuthStore = defineStore("auth", () => {
  const user = ref<TAdminUser | null>(null);
  const token = ref<string | null>(localStorage.getItem("admin_token"));

  const isLoggedIn = computed(() => !!token.value && !!user.value);
  const userRole = computed(() => user.value?.role ?? "editor");

  // app 啟動時，若有 token 就去驗證並取回 user
  const init = async () => {
    if (!token.value) return;
    try {
      const { data } = await authApi.me();
      user.value = data;
    } catch {
      // token 無效就清掉
      token.value = null;
      localStorage.removeItem("admin_token");
    }
  };

  const login = async (payload: LoginPayload) => {
    const { data } = await authApi.login(payload);
    token.value = data.token;
    user.value = data.user;
    localStorage.setItem("admin_token", data.token);
  };

  const logout = () => {
    authApi.logout().catch(() => {}); // 登出 API 失敗也不影響前端
    user.value = null;
    token.value = null;
    localStorage.removeItem("admin_token");
  };

  const register = async (payload: RegisterPayload) => {
    const { data } = await authApi.register(payload);
    token.value = data.token;
    user.value = data.user;
    localStorage.setItem("admin_token", data.token);
  };

  return {
    user,
    token,
    isLoggedIn,
    userRole,
    init,
    login,
    logout,
    register,
  };
});
