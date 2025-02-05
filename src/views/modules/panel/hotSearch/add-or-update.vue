<template>
  <div class="mod-hotSearch-add-or-update">
    <el-dialog
      v-model="visible"
      :close-on-click-modal="false"
      :title="!dataForm.hotSearchId ? '新增' : '修改'"
    >
      <el-form
        ref="dataFormRef"
        :model="dataForm"
        :rules="dataRule"
        label-width="80px"
        @keyup.enter="onSubmit()"
      >
        <el-form-item
          label="标题"
          prop="title"
        >
          <el-input
            v-model="dataForm.title"
            :min="0"
            controls-position="right"
            label="标题"
            maxlength="50"
            show-word-limit
          />
        </el-form-item>

        <el-form-item
          label="内容"
          prop="content"
        >
          <el-input
            v-model="dataForm.content"
            :min="0"
            controls-position="right"
            label="内容"
            maxlength="255"
            show-word-limit
            type="textarea"
          />
        </el-form-item>
        <el-form-item
          label="排序号"
          prop="seq"
        >
          <el-input-number
            v-model="dataForm.seq"
            :min="0"
            controls-position="right"
            label="排序号"
          />
        </el-form-item>
        <el-form-item
          label="状态"
          prop="status"
        >
          <el-radio-group v-model="dataForm.status">
            <el-radio :label="0">
              下线
            </el-radio>
            <el-radio :label="1">
              正常
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="visible = false">
            取消
          </el-button>
          <el-button
            type="primary"
            @click="onSubmit()"
          >
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import {ElMessage} from 'element-plus'
import {Debounce} from '@/utils/http.js'

const emit = defineEmits(['refreshDataList'])
const dataForm = ref({
  hotSearchId: 0,
  title: '',
  content: '',
  recDate: '',
  seq: 0,
  status: 0
})
const page = reactive({
  total: 0, // 总页数
  currentPage: 1, // 当前页数
  pageSize: 10 // 每页显示多少条
})
const visible = ref(false)
const dataRule = {
  title: [
    {
      required: true,
      message: '标题不能为空',
      trigger: 'blur'
    },
    {
      min: 1,
      max: 50,
      message: '长度在1到50个字符内',
      trigger: 'blur'
    },
    {
      pattern: /\s\S+|S+\s|\S/,
      message: '标题不能为空',
      trigger: 'blur'
    }
  ],
  content: [
    {
      required: true,
      message: '内容不能为空',
      trigger: 'blur'
    },
    {
      min: 1,
      max: 255,
      message: '长度在1到255个字符内',
      trigger: 'blur'
    },
    {
      pattern: /\s\S+|S+\s|\S/,
      message: '内容不能为空',
      trigger: 'blur'
    }
  ]
}

const dataFormRef = ref(null)
const init = (id) => {
  dataForm.value.hotSearchId = id || 0
  visible.value = true
  nextTick(() => {
    dataFormRef.value?.resetFields()
    if (dataForm.value.hotSearchId) {
      http({
        url: http.adornUrl('/admin/hotSearch/info/' + dataForm.value.hotSearchId),
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
  dataFormRef.value?.validate(valid => {
    if (valid) {
      const param = dataForm.value
      http({
        url: http.adornUrl('/admin/hotSearch'),
        method: param.hotSearchId ? 'put' : 'post',
        data: http.adornData(param)
      })
        .then(() => {
          ElMessage({
            message: '操作成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
              visible.value = false
              emit('refreshDataList', page)
            }
          })
        })
    }
  })
})

</script>
