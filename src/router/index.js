import {createRouter, createWebHistory} from 'vue-router'
import cookie from 'vue-cookies'
import {clearLoginInfo} from '@/layout/index.js'
import {useCommonStore} from "@/layout/common.js";
import Layout from '@/layout/main.vue'
import http from '@/utils/webUtil/http.js'


// 导入页面组件
import Login from '@/views/common/login/index.vue'
import User from '@/views/modules/user/user/index.vue'


// 全局路由 (无需嵌套上左右整体布局)
const globalRoutes = [{
  path: '/404', component: () => import('@/views/common/error-page/404.vue'), name: '404', meta: {title: '404未找到'}
}, {
  path: '/login', component: Login, name: 'login', meta: {title: '登录'}
}]

/**
 * 主路由
 * @type {{redirect: string, path: string, component: {}, children: [{path: string, component: (function(): Promise<*>), name: string},{path: string, component: (function(): Promise<{}>), name: string}], beforeEnter(*, *, *): void, name: string}}
 */
export const mainRoutes = {
  path: '/',
  component: Layout,
  name: 'home',
  redirect: '/home',
  children: [{
    path: 'home', name: 'home', component: () => import('@/views/common/home/index.vue')
  }, {
    path: '/user/user', component: User, name: 'user-management', meta: {title: '用户管理'}
  }], // eslint-disable-next-line no-unused-vars
  beforeEnter(to, from, next) {
    const authorization = cookie.get('Authorization')
    if (!authorization || !/\S/.test(authorization)) {
      clearLoginInfo()
      next({name: 'login'})
    }
    next()
  }
}

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior: () => ({top: 0}),
  isAddDynamicMenuRoutes: false, // 是否已经添加动态(菜单)路由
  routes: globalRoutes.concat(mainRoutes)
})

// eslint-disable-next-line no-unused-vars
router.beforeEach((to, from, next) => {
  const commonStore = useCommonStore()
  const routerType = import.meta.env.VITE_APP_ROUTER_TYPE


  // 添加动态(菜单)路由
  // 1. 已经添加 or 全局路由, 直接访问, 如果开启了伪静态路由, 则全部按照静态路由逻辑来 (没测过, 别开! )
  // 2. 获取菜单列表, 添加并保存本地存储
  if (router.options.isAddDynamicMenuRoutes || fnCurrentRouteType(to, globalRoutes) === 'global' || routerType === 'static') {
    const routeList = commonStore.routeList
    let navTitles = []
    let leftMenuId = ''
    routeList.forEach(item => {
      if (to.meta.menuId === item.menuId) {
        navTitles.push(item.name)
        routeList.forEach(item1 => {
          if (item.parentId === item1.menuId) {
            navTitles.push(item1.name)
            leftMenuId = item.parentId
            routeList.forEach(item2 => {
              if (item1.parentId === item2.menuId) {
                navTitles.push(item2.name)
                leftMenuId = item1.parentId
              }
            })
          }
        })
      }
    })
    navTitles = navTitles.reverse()
    if (to.meta.isLeftMenu || to.path === '/home' || leftMenuId) {
      if (leftMenuId) {
        commonStore.updateSelectLeftId(leftMenuId)
        commonStore.updateSelectRightId(to.meta.menuId)
      } else {
        commonStore.updateSidebarFold(true)
        commonStore.updateSelectLeftId(to.path === '/home' ? '' : to.meta.menuId)
      }
    }
    commonStore.updateSelectMenu(navTitles)
    next()
  } else {
    http({ // 请求菜单列表
      url: http.adornUrl('/Pub/fronts/nav'), method: 'get', params: http.adornParams()
    }).then(({data}) => {

      fnAddDynamicMenuRoutes(data)
      router.options.isAddDynamicMenuRoutes = true
      const rList = []
      data.forEach(item => {
        item.isLeftMenu = item.parentId === 0
        rList.push({
          menuId: item.menuId, name: item.name, parentId: item.parentId, url: item.url
        })
        if (item.list) {
          item.list.forEach(item1 => {
            item1.isLeftMenu = item1.parentId === 0
            rList.push({
              menuId: item1.menuId, name: item1.name, parentId: item1.parentId, url: item1.url
            })
            if (item1.list) {
              item1.list.forEach(item2 => {
                item2.isLeftMenu = item2.parentId === 0
                rList.push({
                  menuId: item2.menuId, name: item2.name, parentId: item2.parentId, url: item2.url
                })
              })
            }
          })
        }
      })
      fnAddDynamicMenuRoutes(data)
      sessionStorage.setItem('menuList', JSON.stringify(data || '[]'))
      console.log(`%c${JSON.stringify(rList)} 请求菜单列表和权限成功，跳转至...`, 'color:blue')
      commonStore.updateRouteList(rList)
      commonStore.updateMenuIds(rList)
      next({
        ...to, replace: true
      })
    }).catch(e => {
      console.log(`%c${e} 请求菜单列表和权限失败`, 'color:blue')
      router.push({name: 'login'})
    })
  }
})

/**
 * 判断当前路由类型, global: 全局路由, main: 主入口路由
 * @param {*} route 当前路由
 * @param globalRoutes 全局路由
 */
function fnCurrentRouteType(route, globalRoutes = []) {
  let temp = []
  for (let i = 0; i < globalRoutes.length; i++) {
    if (route.path === globalRoutes[i].path) {
      return 'global'
    } else if (globalRoutes[i].children && globalRoutes[i].children.length >= 1) {
      temp = temp.concat(globalRoutes[i].children)
    }
  }
  return temp.length >= 1 ? fnCurrentRouteType(route, temp) : 'main'
}

/**
 * 添加动态(菜单)路由
 * @param {*} menuList 菜单列表
 * @param {*} routes 递归创建的动态(菜单)路由
 */
function fnAddDynamicMenuRoutes(menuList = [], routes = []) {
  console.log(`%c${JSON.stringify(menuList)} 添加动态(菜单)路由...`, 'color : red')
  let temp = []
  const modules = import.meta.globEager('../views/modules/**/index.vue')
  console.log(`%c${JSON.stringify(modules)} 模块对象`, 'color : red')
  // todo 这里 modules 是空啊!!!!
  for (let i = 0; i < menuList.length; i++) {
    if (menuList[i].list && menuList[i].list.length >= 1) {
      temp = temp.concat(menuList[i].list)
    } else if (menuList[i].url && /\S/.test(menuList[i].url)) {
      menuList[i].url = menuList[i].url.replace(/^\//, '')
      const route = {
        path: menuList[i].url,
        component: null,
        name: menuList[i].url,
        meta: {
          menuId: menuList[i].menuId, title: menuList[i].name, isDynamic: true, isTab: true, iframeUrl: ''
        }
      }

      try {
        // 会把传递的后端URL数据转换为前端模块的文件路径进行绑定
        route.component = modules[`../views/modules/${menuList[i].url}/index.vue`] || null
        console.log(`%c${JSON.stringify(route.component)} 对象为`, 'color : blue')
      } catch (e) {
      }

      routes.push(route)
    }
  }
  if (temp.length >= 1) {
    fnAddDynamicMenuRoutes(temp, routes)
  } else {
    mainRoutes.name = 'main-dynamic'
    mainRoutes.children = routes
    router.addRoute(mainRoutes)
  }
  router.addRoute({
    path: '/:pathMatch(.*)*', redirect: {name: '404'}
  })
}

export default router
