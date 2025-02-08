<template>
  <div class="login">
    <div class="login-box">
      <div class="mid">
        <!--登录表单-->
        <el-form
          ref="dataFormRef"
          :model="dataForm"
          :rules="dataRule"
          status-icon
        >
          <el-form-item prop="userName">
            <el-input
              v-model="dataForm.userName"
              class="info"
              placeholder="请输入帐号"
            />
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="dataForm.password"
              class="info"
              placeholder="请输入密码"
              type="password"
            />
          </el-form-item>
          <el-form-item prop="userName">
            <el-input
              v-model="dataForm.code"
              class="info"
              placeholder="请输入验证码"
            />
          </el-form-item>
          <el-form-item>
            <div class="item-btn">
              <input
                type="button"
                value="点我登录"
                @click="`login`"
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

const router = useRouter()
let isSubmit = false

/**
 * 表单引用
 */
const dataFormRef = ref(null)

/**
 * 表单数据
 */
const dataForm = ref({
  userName: '',
  password: '',
  code: ''
})

/**
 * 表单验证规则
 */
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
  code: [
    {
      required: true,
      message: '验证码不能为空',
      trigger: 'blur'
    }
  ]
}


onMounted(() => {
})


const login = () => {
  if (isSubmit) {
    return
  }
  isSubmit = true
  http({
    url: http.adornUrl('/adminLogin'),
    method: 'get',
    data: http.adornData({
      userName: dataForm.value.userName,
      passWord: encrypt(dataForm.value.password),
      code: dataForm.value.code
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
    ElMessage({
      message: "登录失败",
      type: 'error',
      duration: 1000
    });
  })
}


</script>

