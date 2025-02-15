<template>
  <el-dialog
    v-model="visible"
    :close-on-click-modal="false"
    :title="!dataForm.id ? '新增' : '修改'"
  >
    <el-form
      ref="dataFormRef"
      :model="dataForm"
      :rules="dataRule"
      label-width="80px"
      @keyup.enter="onSubmit()"
    >
      <el-form-item
        label="公告标题"
        prop="title"
      >
        <el-input v-model="dataForm.title" />
      </el-form-item>

      <el-form-item
        label="置顶"
        prop="isTop"
      >
        <el-radio-group v-model="dataForm.isTop">
          <el-radio :label="1">
            是
          </el-radio>
          <el-radio :label="0">
            否
          </el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item
        label="公告内容"
        prop="content"
      >
        <el-input
          ref="contentEnRef"
          v-model="dataForm.content"
          placeholder="请输入公告内容"
          type="textarea"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button
          @click="visible = false"
        >取消</el-button>
        <el-button
          type="primary"
          @click="onSubmit()"
        >确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import {ElMessage} from 'element-plus'
import {Debounce} from '@/utils/webUtil/http.js'

const emit = defineEmits(['refreshDataList'])
const visible = ref(false)
const contentEnRef = ref(null)

// eslint-disable-next-line no-unused-vars
const validateTitle = (rule, value, callback) => {
  if (!value.trim()) {
    dataForm.value.title = ''
    callback(new Error('公告标题不能为空'))
  } else {
    callback()
  }
}
const dataRule = {
  title: [
    {
      required: true,
      message: '公告标题不能为空',
      trigger: 'blur'
    },
    {
      validator: validateTitle,
      trigger: 'blur'
    }
  ]
}

/**
 * 表单数据 -> 对应后端 NoticeAllDTO
 */
const dataForm = ref({
  title: null,
  content: null,
  url: null, //
  isTop: 0
})

const dataFormRef = ref(null)

/**
 * 初始化
 * @param {number} id
 */
const init = (id) => {
  dataForm.value.id = id || 0
  visible.value = true
  nextTick(() => {
    dataFormRef.value?.resetFields()
    if (dataForm.value.id) { // 如果这个id存在, 就要对其进行查询
      http({
        url: http.adornUrl('/shop/notice/info/' + dataForm.value.id),
        method: 'get',
        params: http.adornParams()
      })
        .then(({data}) => {
          dataForm.value = data
        })
    }
  })
}
defineExpose({init})

/**
 * 表单提交
 */
const onSubmit = Debounce(() => {
  dataFormRef.value?.validate((valid) => {
    if (valid) {
      http({
        url: http.adornUrl('/shop/notice'), // 新增或修改URL
        method: dataForm.value.id ? 'put' : 'post',
        data: http.adornData(dataForm.value)
      })
        .then(() => {
          ElMessage({
            message: '操作很成功哈哈哈',
            type: 'success',
            duration: 1500,
            onClose: () => { // 清空表单
              visible.value = false
              emit('refreshDataList')
              dataForm.value.content = ''
            }
          })
        })
    }
  })
})

</script>
