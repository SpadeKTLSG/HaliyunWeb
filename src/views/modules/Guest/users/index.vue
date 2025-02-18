<template>
</template>

<script setup>
import {treeDataTranslate} from '@/layout/index.js'
import {ElMessage, ElMessageBox} from 'element-plus'

const dataForm = ref({})
onMounted(() => {
  getDataList()
})

const dataList = ref([])
/**
 * 获取数据列表
 */
const getDataList = () => {
  http({
    url: http.adornUrl('/sys/menu/table'),
    method: 'get',
    params: http.adornParams()
  }).then(({data}) => {
    dataList.value = treeDataTranslate(data, 'menuId')
  })
}
const addOrUpdateRef = ref(null)
const addOrUpdateVisible = ref(false)
/**
 * 新增 / 修改
 * @param id
 */
const onAddOrUpdate = (id) => {
  addOrUpdateVisible.value = true
  nextTick(() => {
    addOrUpdateRef.value?.init(id)
  })
}
/**
 * 删除
 * @param id
 */
const onDelete = (id) => {
  ElMessageBox.confirm(`确定对[id=${id}]进行[删除]操作?`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    http({
      url: http.adornUrl(`/sys/menu/${id}`),
      method: 'delete',
      data: http.adornData()
    }).then(() => {
      ElMessage({
        message: '操作成功',
        type: 'success',
        duration: 1500,
        onClose: () => {
          getDataList()
        }
      })
    })
  })
}
</script>
