import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import { setupGuards } from "./router/guards";
import "./style/main.scss";

import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import { useAuthStore } from "./stores/auth";

async function initApp() {
  // 開發環境啟動 MSW
  if (import.meta.env.DEV) {
    const { worker } = await import("./mocks/browser");
    await worker.start({ onUnhandledRequest: "bypass" });
  }

  const app = createApp(App);
  const pinia = createPinia();

  app.use(ElementPlus);
  app.use(pinia);

  // 守衛設定好之後、mount 之前，先把 user 狀態還原
  await useAuthStore().init();

  app.use(router);
  setupGuards(router); // pinia 要在前面，守衛內會用到 store

  await router.isReady();

  app.mount("#app");
}

initApp();
