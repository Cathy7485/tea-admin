export const LOGIN_RULES = {
  email: [
    {
      required: true,
      message: "請輸入使用者信箱",
      trigger: "blur",
    },
    {
      type: "email",
      message: "請輸入有效的 Email 地址",
      trigger: ["blur", "change"],
    },
  ],
  password: [
    {
      required: true,
      message: "請輸入密碼",
      trigger: "blur",
    },
    { min: 1, max: 16, message: "字數長度必須為1至16字元", trigger: "blur" },
    {
      pattern: /^[A-Za-z\d]{1,16}$/,
      message: "密碼必須包含至少一個字母或一個數字",
      trigger: "blur",
    },
  ],
};

export const SIGNUP_RULES = {
  name: [
    {
      required: true,
      message: "請輸入使用者名稱",
      trigger: "blur",
    },
  ],
  email: [
    {
      required: true,
      message: "請輸入使用者信箱",
      trigger: "blur",
    },
    {
      type: "email",
      message: "請輸入有效的 Email 地址",
      trigger: ["blur", "change"],
    },
  ],
  password: [
    {
      required: true,
      message: "請輸入密碼",
      trigger: "blur",
    },
    { min: 1, max: 16, message: "字數長度必須為1至16字元", trigger: "blur" },
    {
      pattern: /^[A-Za-z\d]{1,16}$/,
      message: "密碼必須包含至少一個字母或一個數字",
      trigger: "blur",
    },
  ],
  confirmPassword: [{ required: true, message: "請再次輸入密碼", trigger: "blur" }],
};
