import type { Router } from 'vue-router'
import { useAuthStore } from '../stores/auth'

export function setupGuards(router: Router) {

  router.beforeEach((to) => {
    const auth = useAuthStore()

    // --- 第一層：是否登入 ---
    if (to.meta.requiresAuth && !auth.isLoggedIn) {
      return { name: 'login', query: { redirect: to.fullPath } }
    }

    // --- 第二層：已登入不能再進登入頁 ---
    if (to.meta.guestOnly && auth.isLoggedIn) {
      return { name: 'dashboard' }
    }

    // --- 第三層：角色權限檢查 ---
    const requiredRoles = to.meta.roles as string[] | undefined
    if (requiredRoles && !requiredRoles.includes(auth.userRole)) {
      return { name: 'forbidden' }
    }
  })

  router.afterEach((to) => {
    document.title = to.meta.title
      ? `${to.meta.title} | 茶葉後台`
      : '茶葉後台'
  })
}