<script setup lang="ts">
import { LOGIN_RULES, SIGNUP_RULES } from "@/constants/login";
import { useAuthStore } from "@/stores/auth";
import { ElMessage, type FormInstance } from "element-plus";

const router = useRouter();

const authStore = useAuthStore();
const { login, register } = authStore;

const loginFormRef = ref<FormInstance>();

const loginForm = reactive({
  email: "",
  password: "",
});

const handlerLogin = async () => {
  if (!loginFormRef.value) return;

  // 執行表單驗證
  await loginFormRef.value.validate(async (valid, fields) => {
    if (valid) {
      try {
        await login(loginForm);

        ElMessage.success("登入成功");
        router.push("/");
      } catch (error) {
        ElMessage.error("登入失敗，請檢查您的帳號密碼");
        // console.error("登入失敗", error);
      }
    } else {
      console.log("表單驗證未通過", fields);
    }
  });
};

// ----------------------

const signupFormRef = ref<FormInstance>();
const signupForm = reactive({
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
});

// 驗證密碼是否一致
const validatePass2 = (_rule: any, value: any, callback: any) => {
  if (value === "") {
    callback(new Error("請再次輸入密碼"));
  } else if (value !== signupForm.password) {
    callback(new Error("兩次輸入密碼不一致!"));
  } else {
    callback();
  }
};

// 合併規則
const extendedSignupRules = {
  ...SIGNUP_RULES,
  confirmPassword: [...SIGNUP_RULES.confirmPassword, { validator: validatePass2, trigger: "blur" }],
};

const handlerSignup = async () => {
  if (!signupFormRef.value) return;

  // 執行表單驗證
  await signupFormRef.value.validate(async (valid, fields) => {
    if (valid) {
      try {
        await register(signupForm);
        ElMessage.success("註冊成功，登入成功");
        router.push("/");
      } catch (error) {
        ElMessage.error("註冊失敗，請稍後再試");
        // console.error("註冊失敗", error);
      }
    } else {
      console.log("表單驗證未通過", fields);
    }
  });
};

// ----------------------

const isSignupCard = ref(false);

const changeClass = computed(() => {
  return isSignupCard.value ? "signup" : "login";
});

const changeCard = () => {
  isSignupCard.value = !isSignupCard.value;
};
</script>

<template>
  <div class="login-wrapper">
    <div :class="[changeClass, 'login-inner']">
      <!-- 登入 -->
      <div class="login-card">
        <div class="title">
          <img src="/images/login-logo.png" alt="登入圖示" />
          使用者登入
        </div>
        <el-form
          ref="loginFormRef"
          :rules="LOGIN_RULES"
          :model="loginForm"
          @submit.prevent="handlerLogin"
          class="login-form form-block"
        >
          <div class="input-block">
            <el-form-item prop="email" label="信箱">
              <el-input v-model="loginForm.email" placeholder="name@example.com" autofocus />
            </el-form-item>
          </div>

          <div class="input-block">
            <el-form-item prop="password" label="密碼">
              <el-input
                v-model="loginForm.password"
                type="password"
                placeholder="Password"
                show-password
              />
            </el-form-item>
          </div>

          <div class="signup-bar">
            <button type="button" class="signup-btn" @click="changeCard">註冊</button>
          </div>

          <el-button native-type="submit" class="button primary-button"> 登入 </el-button>
        </el-form>
      </div>

      <!-- 註冊 -->
      <div class="signup-card">
        <div class="title">
          <img src="/images/login-logo.png" alt="註冊圖示" />
          使用者註冊
        </div>
        <!-- 註冊表單內容 -->
        <el-form
          ref="signupFormRef"
          :rules="extendedSignupRules"
          :model="signupForm"
          @submit.prevent="handlerSignup"
          class="login-form form-block"
        >
          <div class="input-block">
            <el-form-item prop="name" label="使用者名稱">
              <el-input v-model="signupForm.name" placeholder="name" autofocus />
            </el-form-item>
          </div>
          <div class="input-block">
            <el-form-item prop="email" label="使用者信箱">
              <el-input v-model="signupForm.email" placeholder="name@example.com" autofocus />
            </el-form-item>
          </div>

          <div class="input-block">
            <el-form-item prop="password" label="使用者密碼">
              <el-input
                v-model="signupForm.password"
                type="password"
                placeholder="Password"
                show-password
              />
            </el-form-item>
          </div>

          <div class="input-block">
            <el-form-item prop="confirmPassword" label="請確認密碼">
              <el-input
                v-model="signupForm.confirmPassword"
                type="password"
                placeholder="請再次輸入密碼"
                show-password
              />
            </el-form-item>
          </div>

          <div class="signup-bar">
            <button type="button" class="signup-btn" @click="changeCard">已有帳號？返回登入</button>
          </div>

          <el-button native-type="submit" class="button primary-button"> 註冊 </el-button>
        </el-form>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
