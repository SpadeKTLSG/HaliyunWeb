import cookie from 'vue-cookies'
import router from '@/router/index.js'


/**
 * 清除登录信息
 */
export function clearLoginInfo() {
  cookie.remove('Authorization')
  router.options.isAddDynamicMenuRoutes = false
}


/**
 * 树形数据转换
 * @param {*} data
 * @param {*} id
 * @param {*} pid
 */
export function treeDataTranslate(data, id = 'id', pid = 'parentId') {
  const res = []
  const temp = {}
  for (let i = 0; i < data.length; i++) {
    temp[data[i][id]] = data[i]
  }
  for (let k = 0; k < data.length; k++) {
    if (temp[data[k][pid]] && data[k][id] !== data[k][pid]) {
      if (!temp[data[k][pid]].children) {
        temp[data[k][pid]].children = []
      }
      if (!temp[data[k][pid]]._level) {
        temp[data[k][pid]]._level = 1
      }
      data[k]._level = temp[data[k][pid]]._level + 1
      temp[data[k][pid]].children.push(data[k])
    } else {
      res.push(data[k])
    }
  }
  return res
}


/**
 * 将数组中的parentId列表取出，倒序排列
 */
export function idList(data, val, id = 'id', children = 'children') {
  const res = []
  idListFromTree(data, val, res, id)
  return res
}

function idListFromTree(data, val, res = [], id = 'id', children = 'children') {
  for (let i = 0; i < data.length; i++) {
    const element = data[i]
    if (element[children]) {
      if (idListFromTree(element[children], val, res, id, children)) {
        res.push(element[id])
        return true
      }
    }
    if (element[id] === val) {
      res.push(element[id])
      return true
    }
  }
}


/**
 * 文件地址校验
 * @param fileUrl 获取到的文件路径
 */
export function checkFileUrl(fileUrl) {
  if (fileUrl === '') return ''
  const baseUrl = import.meta.env.VITE_APP_RESOURCES_URL
  // 适配el-image 图片组件预览功能
  if (fileUrl && typeof fileUrl === 'object') {
    return fileUrl.map(el => checkFileUrl(el))
  } else {
    if (fileUrl && fileUrl.indexOf('http') === -1) {
      return baseUrl + fileUrl
    } else {
      return fileUrl
    }
  }
}
