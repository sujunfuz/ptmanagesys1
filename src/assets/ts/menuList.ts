import { useI18n } from '@/hooks/web/useI18n'
const { t } = useI18n()

export const MenuList = [
  {
    id: '1',
    path: '/dashboard',
    component: '#',
    name: 'DashBoard',
    // redirect: '/dashboard/index',
    meta: {
      title: t('router.home'),
      icon: 'svg-icon:index'
    },
    children: [
      {
        id: '001',
        name: 'Index',
        path: 'index',
        component: '/Dashboard/Dashboard/index',
        meta: {
          title: t('router.home'),
          icon: 'svg-icon:index',
          affix: true, //固定在tag  bu被删除
          permission: ['DashBoard:delete']
        }
      },
      {
        id: '002',
        name: 'Auth',
        path: 'auth',
        component: '/Dashboard/EnterpriseAuth/index',
        meta: {
          title: t('auth.title'),
          hidden: true,
          icon: 'svg-icon:index'
        }
      },
      {
        id: '003',
        name: 'OfflineSign',
        path: 'offlinesign',
        component: '/Dashboard/OfflineSign/index',
        meta: {
          title: t('offlinesign.title'),
          hidden: true,
          icon: 'svg-icon:index'
        }
      },
      {
        id: '004',
        name: 'AccountSettings',
        path: 'accountSettings',
        component: '/AccountSettings/index',
        meta: {
          title: t('accountSettings.title'),
          hidden: true
        }
      },
      {
        id: '005',
        name: 'ServiceCenter',
        path: 'serviceCenter',
        component: '/ServiceCenter/index',
        meta: {
          title: t('serviceCenter.title'),
          hidden: true
        }
      },
      {
        id: '006',
        name: 'ServiceDetail',
        path: 'serviceDetail',
        component: '/ServiceCenter/Detail/index',
        meta: {
          title: t('serviceCenter.title'),
          hidden: true
        }
      }
    ]
  }
  // {
  //   path: '/link',
  //   component: '#',
  //   meta: {
  //     name: 'ExternalLink'
  //   },
  //   children: [
  //     {
  //       path: 'https://github.com/kailong321200875/vue-element-plus-admin-doc',
  //       meta: {
  //         name: 'Link',
  //         title: '外链'
  //       }
  //     }
  //   ]
  // },
  // {
  //   path: '/demo',
  //   component: '#',
  //   name: 'Demo',
  //   // redirect: '',
  //   meta: {
  //     title: 'Demo',
  //     icon: 'ant-design:dashboard-filled'
  //   },
  //   children: [
  //     {
  //       name: 'Demo1',
  //       path: 'demo',
  //       component: '#',
  //       // redirect: '/authorization/operator',
  //       meta: {
  //         title: 'Demo1'
  //       },
  //       children: [
  //         {
  //           name: 'Demo11',
  //           path: 'demo11',
  //           component: '/Demo/Demo1/Demo11/index',
  //           meta: {
  //             title: 'Demo11',
  //             hidden: false, //不在侧边框展示出来,
  //             permission: ['Demo11:delete']
  //           }
  //         },
  //         {
  //           name: 'Demo22',
  //           path: 'https://www.baidu.com',
  //           component: '/Demo/Demo1/Demo22/index',
  //           meta: {
  //             title: 'Demo22'
  //           }
  //         }
  //       ]
  //     },
  //     {
  //       name: 'Demo2',
  //       path: 'demo2',
  //       component: '/Demo/Demo2/index',
  //       meta: {
  //         title: 'Demo2'
  //       }
  //     }
  //   ]
  // }
  // {
  //   path: '/authorization',
  //   component: '#',
  //   name: 'Authorization',
  //   // redirect: 'noredirect',
  //   meta: {
  //     title: '权限管理',
  //     icon: 'svg-icon:base'
  //   },
  //   children: [
  //     {
  //       name: 'Menu',
  //       path: 'menu',
  //       component: '/Authorization/Menu/index',
  //       meta: {
  //         title: '菜单管理',
  //         icon: 'svg-icon:cardtype',
  //         permission: ['view', 'list']
  //       },
  //       children: []
  //     },
  //     {
  //       name: 'Role',
  //       path: 'role',
  //       component: '/Authorization/Role/index',
  //       meta: {
  //         title: '角色管理',
  //         icon: 'svg-icon:mmg',
  //         permission: ['view', 'list']
  //       },
  //       children: []
  //     },
  //     {
  //       name: 'Operator',
  //       path: 'operator',
  //       component: '/Authorization/Operator/index',
  //       meta: {
  //         title: '操作员管理',
  //         icon: 'svg-icon:user',
  //         permission: ['view', 'list']
  //       },
  //       children: []
  //     }
  //   ]
  // }
]
