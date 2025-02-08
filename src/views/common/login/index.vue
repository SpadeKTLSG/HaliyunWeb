<template>
  <div class="login">
    <div class="login-box">
      <div class="top">
        <div class="logo">
          <img
            alt=""
            src="~@/assets/img/login-logo.png"
          >
        </div>
      </div>

      <div class="mid">
        <el-form
          ref="dataFormRef"
          :model="dataForm"
          :rules="dataRule"
          status-icon
          @keyup.enter="dataFormSubmit()"
        >
          <el-form-item prop="userName">
            <el-input
              v-model="dataForm.userName"
              class="info"
              placeholder="帐号"
            />
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="dataForm.password"
              class="info"
              placeholder="密码"
              type="password"
            />
          </el-form-item>
          <el-form-item>
            <div class="item-btn">
              <input
                type="button"
                value="登录"
                @click="dataFormSubmit()"
              >
            </div>
          </el-form-item>
        </el-form>
      </div>
      <div class="bottom-sign">
        Copyright © 2025 睡眠促进委员会 Sleep Promotion Committee
      </div>
    </div>
  </div>
</template>

<script setup>
import './index.scss'
import {encrypt} from '@/utils/crypto'
import cookie from 'vue-cookies'
import {ElMessage} from "element-plus";

const dataForm = ref({
  userName: '',
  password: '',
  uuid: '',
  captcha: ''
})

const dataRule = {
  userName: [
    {
      required: true,
      message: '帐号不能为空',
      trigger: 'blur'
    }
  ],
  password: [
    {
      required: true,
      message: '密码不能为空',
      trigger: 'blur'
    }
  ],
  captcha: [
    {
      required: true,
      message: '验证码不能为空',
      trigger: 'blur'
    }
  ]
}


onMounted(() => {
})

const router = useRouter()
const verifyRef = ref(null)
const dataFormRef = ref(null)
let isSubmit = false

/**
 * 提交表单
 */
const dataFormSubmit = () => {
  dataFormRef.value?.validate((valid) => {
    if (valid) {
      verifyRef.value?.show()
    }
  })
}


const login = (verifyResult) => {
  if (isSubmit) {
    return
  }
  isSubmit = true
  http({
    url: http.adornUrl('/adminLogin'),
    method: 'post',
    data: http.adornData({
      userName: dataForm.value.userName,
      passWord: encrypt(dataForm.value.password),
      captchaVerification: verifyResult.captchaVerification
      // todo 解构函数
    })
  }).then(({data}) => {
    ElMessage({
      message: "登录成功",
      type: 'success',
      duration: 1000
    });
    cookie.set('Authorization', data.accessToken)
    router.replace({name: 'home'})
  }).catch(() => {
    isSubmit = false
  })
}


</script>

