import router from './router'
import { useAppStoreWithOut } from '@/store/modules/app'
import { useStorage } from '@/hooks/web/useStorage'
import type { RouteRecordRaw } from 'vue-router'
import { useTitle } from '@/hooks/web/useTitle'
import { useNProgress } from '@/hooks/web/useNProgress'
import { usePermissionStoreWithOut } from '@/store/modules/permission'
import { usePageLoading } from '@/hooks/web/usePageLoading'
import { outGoLogin } from '@/utils/common'
const permissionStore = usePermissionStoreWithOut()

const appStore = useAppStoreWithOut()

const { getStorage } = useStorage()
const getLocalStorage = useStorage('localStorage')

const { start, done } = useNProgress()

const { loadStart, loadDone } = usePageLoading()

const whiteList = ['/login', '/lqmlogin', '/test'] // 不重定向白名单

router.beforeEach(async (to, from, next) => {
  start()
  loadStart()
  if (getLocalStorage.getStorage(appStore.getToken)) {
    if (to.path === '/login') {
      next()
    } else {
      try {
        if (permissionStore.getIsAddRouters) {
          next()
          return
        }

        // 开发者可根据实际情况进行修改
        const roleRouters = getLocalStorage.getStorage('roleRouters') || []

        // 是否使用动态路由
        if (appStore.getDynamicRouter) {
          appStore.serverDynamicRouter
            ? await permissionStore.generateRoutes(
                'server',
                roleRouters as AppCustomRouteRecordRaw[]
              )
            : await permissionStore.generateRoutes('frontEnd', roleRouters as string[])
        } else {
          await permissionStore.generateRoutes('static')
        }
        // 使用动态路由
        // await permissionStore.generateRoutes('server', roleRouters as AppCustomRouteRecordRaw[])

        permissionStore.getAddRouters.forEach((route) => {
          router.addRoute(route as unknown as RouteRecordRaw) // 动态添加可访问路由表
        })
        const redirectPath = from.query.redirect || to.path
        const redirect = decodeURIComponent(redirectPath as string)
        const nextData = to.path === redirect ? { ...to, replace: true } : { path: redirect }
        permissionStore.setIsAddRouters(true)
        next(nextData)
      } catch (err) {
        outGoLogin()
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      outGoLogin()
      // next(`/login?redirect=${to.path}`) // 否则全部重定向到登录页
    }
  }
})

router.afterEach((to) => {
  useTitle(to?.meta?.title as string)
  done() // 结束Progress
  loadDone()
})
