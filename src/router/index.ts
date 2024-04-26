import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import type { App } from 'vue'
import { Layout, getParentLayout } from '@/utils/routerHelper'
import { useI18n } from '@/hooks/web/useI18n'

const { t } = useI18n()

export const constantRouterMap: AppRouteRecordRaw[] = [
  {
    path: '/',
    // component: Layout,
    // redirect: '/dashboard/index',
    component: () => import('@/views/Dashboard/Dashboard/index.vue'),
    name: 'Root',
    meta: {
      hidden: true
    }
  },
  {
    path: '/login',
    component: () => import('@/views/Login/Login.vue'),
    name: 'Login',
    meta: {
      hidden: true,
      title: t('router.login'),
      noTagsView: true
    }
  },
  // {
  //   path: '/lqmlogin',
  //   component: () => import('@/views/Login/lqmLogin.vue'),
  //   name: 'lqmLogin',
  //   meta: {
  //     hidden: true,
  //     title: t('router.login'),
  //     noTagsView: true
  //   }
  // },

  // {
  //   path: '/test',
  //   component: () => import('@/views/Demo/Demo3/index.vue'),
  //   name: 'test',
  //   meta: {
  //     hidden: true,
  //     title: '测试',
  //     noTagsView: true
  //   }
  // },
  {
    path: '/404',
    component: () => import('@/views/Error/404.vue'),
    name: 'NoFind',
    meta: {
      hidden: true,
      title: '404',
      noTagsView: true
    }
  }
]

export const asyncRouterMap: AppRouteRecordRaw[] = [
  {
    path: '/dashboard',
    component: Layout,
    name: 'Dashboard',
    redirect: '/dashboard/index',
    meta: {},
    children: [
      {
        path: 'index',
        component: () => import('@/views/Dashboard/Dashboard/index.vue'),
        name: 'index',
        meta: {
          title: t('router.dashboard'),
          icon: 'ant-design:dashboard-filled',
          noCache: true, //如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
          affix: true //默认false，如果设置为true，那么它会固定在tags-view中
        }
      }
    ]
  },
  {
    path: '/authorization',
    component: Layout,
    redirect: '/authorization/user',
    name: 'Authorization',
    meta: {
      title: t('router.authorization'),
      icon: 'eos-icons:role-binding',
      alwaysShow: true
    }
    // children: [
    //   {
    //     path: 'user',
    //     component: () => import('@/views/Authorization/User/index.vue'),
    //     name: 'User',
    //     meta: {
    //       title: t('router.user')
    //     }
    //   },
    //   {
    //     path: 'menu',
    //     component: () => import('@/views/Authorization/Menu/index.vue'),
    //     name: 'Menu',
    //     meta: {
    //       title: t('router.menuManagement')
    //     }
    //   },
    //   {
    //     path: 'role',
    //     component: () => import('@/views/Authorization/Role/index.vue'),
    //     name: 'Role',
    //     meta: {
    //       title: t('router.role')
    //     }
    //   }
    // ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  strict: true,
  routes: constantRouterMap as RouteRecordRaw[],
  scrollBehavior: () => ({ left: 0, top: 0 })
})

export const resetRouter = (): void => {
  const resetWhiteNameList = ['Redirect', 'Login', 'NoFind', 'Root']
  router.getRoutes().forEach((route) => {
    const { name } = route
    if (name && !resetWhiteNameList.includes(name as string)) {
      router.hasRoute(name) && router.removeRoute(name)
    }
  })
}

export const setupRouter = (app: App<Element>) => {
  app.use(router)
}

export default router
