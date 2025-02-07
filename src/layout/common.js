import {defineStore} from 'pinia'
import router from '@/router/index.js'

// 文件分类
export const fileTypeMap = {
  image: ['gif', 'jpg', 'jpeg', 'png', 'bmp', 'webp', 'ico'],
  video: ['mp4', 'webm', 'm3u8', 'rmvb', 'avi', 'swf', '3gp', 'mkv', 'flv'],
  audio: ['mp3', 'wav', 'wma', 'ogg', 'aac', 'flac', 'm4a'],
  text: ['scss', 'sass', 'kt', 'gitignore', 'bat', 'properties', 'yml', 'css', 'js', 'md', 'xml', 'txt', 'py', 'go', 'html', 'less', 'php', 'rb', 'rust', 'script', 'java', 'sh', 'sql'],
  executable: ['exe', 'dll', 'com', 'vbs'],
  archive: ['7z', 'zip', 'rar', 'tar', 'gz'],
  pdf: ['pdf'],
  office: ['doc', 'docx', 'csv', 'xls', 'xlsx', "ppt", 'pptx'],
  three3d: ['dae', 'fbx', 'gltf', 'glb', 'obj', 'ply', 'stl'],
  document: ['txt', 'pages', 'epub', 'numbers', 'keynote']
};


export const useCommonStore = defineStore('common', {
  state: () => {
    return {
      // 页面文档可视高度(随窗口改变大小)
      documentClientHeight: 0, // 侧边栏, 布局皮肤, light(浅色) / dark(黑色)
      sidebarLayoutSkin: 'light', // 侧边栏, 折叠状态
      sidebarFold: true, // 侧边栏, 菜单
      menuList: [],
      menuActiveName: '', // 主入口标签页
      mainTabs: [],
      mainTabsActiveName: '', // 当前选择的标签
      selectMenu: [], // 路由列表
      routeList: [],
      menuIds: [],
      selectLeftId: '',
      selectRightId: ''
    }
  },
  actions: {
    updateDocumentClientHeight(height) {
      this.documentClientHeight = height
    },
    updateSidebarFold(fold) {
      this.sidebarFold = fold
    },
    updateMenuList(list) {
      this.menuList = list
    },
    updateMenuActiveName(name) {
      this.menuActiveName = name
    },
    updateMainTabs(tabs) {
      this.mainTabs = tabs
    },
    updateMainTabsActiveName(name) {
      this.mainTabsActiveName = name
    },
    updateRouteList(list) {
      this.routeList = list
    },
    updateSelectMenu(list) {
      this.selectMenu = list
    },
    updateSelectLeftId(id) {
      this.selectLeftId = id
    },
    updateSelectRightId(id) {
      this.selectRightId = id
    },
    replaceSelectMenu(title) {
      this.selectMenu.splice(this.selectMenu.length - 1, 1, title)
    },
    updateMenuIds(list) {
      this.menuIds = []
      list.forEach(menu => {
        this.menuIds.push(String(menu.menuId + ''))
      })
    },
    removeMainActiveTab() {
      this.mainTabs = this.mainTabs.filter(item => item.name !== this.mainTabsActiveName)
      if (this.mainTabs.length >= 1) {
        // 当前选中tab被删除
        router.push({name: this.mainTabs[this.mainTabs.length - 1].name}, () => {
          this.mainTabsActiveName = this.mainTabs[this.mainTabs.length - 1].name
        })
      } else {
        this.menuActiveName = ''
        router.push({name: 'home'})
      }
    }
  }
})
