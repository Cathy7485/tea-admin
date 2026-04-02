import client from "./client";
import type { TAdminUser } from "@/types/user";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: TAdminUser;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export const authApi = {
  login(payload: LoginPayload) {
    return client.post<LoginResponse>("/auth/login", payload);
  },

  logout() {
    return client.post("/auth/logout");
  },

  me() {
    return client.get<TAdminUser>("/auth/me");
  },

  register(payload: RegisterPayload) {
    return client.post<LoginResponse>("/auth/register", payload);
  },
};
