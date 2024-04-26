import { computed, ref, unref } from 'vue'
import { getMenuList } from '@/api/login'
import { MenuList } from '@/assets/ts/menuList'
import { useStorage } from '@/hooks/web/useStorage'
import { useLocaleStore } from '@/store/modules/locale'
import { usePermissionStore } from '@/store/modules/permission'
import router, { resetRouter } from '@/router'
import { useTagsViewStore } from '@/store/modules/tagsView'

const permissionStore = usePermissionStore()
const localStore = useStorage('localStorage')
const { clear } = useStorage()
const clearLocalStorage = useStorage('localStorage')
const tagsViewStore = useTagsViewStore()

// 判断是否是今天
export function isToday(date: string) {
  const d = new Date(date.toString().replace(/-/g, '/'))
  const todaysDate = new Date()
  if (d.setHours(0, 0, 0, 0) == todaysDate.setHours(0, 0, 0, 0)) {
    return true
  } else {
    return false
  }
}
// path转Name 去掉/ 首字母大写
export function pathToName(data: string) {
  const fcharac = data.substring(0, 1)
  const str = ref('')
  const newStr = ref('')
  if (fcharac == '/') {
    str.value = data.substring(1, data.length)
  } else {
    str.value = data
  }
  newStr.value = str.value.slice(0, 1).toUpperCase() + str.value.slice(1).toLowerCase()
  return newStr.value
}

// 判断是否有/ 没有就加上
export function pathask1(data: string) {
  const str = ref('')
  str.value = data.substring(0, 1) == '/' ? data : '/' + data
  return str.value
}

// 判断是第一个字符是不是/ 是的话去掉
export function pathask2(data: string) {
  const str = ref('')
  str.value = data.substring(0, 1) == '/' ? data.substring(1) : data
  return str.value
}

// 封装更新菜单
export async function packNewMenu() {
  const res = await getMenuList()
  if (res != undefined && res.code == 200) {
    localStore.setStorage('permissions', res.data.permissions)
    const obj = MenuList[0]
    const homeTitle = ref()
    const localeStore = useLocaleStore()
    const currentLang = computed(() => localeStore.getCurrentLocale)

    const lang = unref(currentLang).lang
    homeTitle.value = lang == 'zh' ? '欢迎页' : lang == 'cht' ? '歡迎頁' : 'Welcome Page'

    obj.meta.title = homeTitle.value
    obj.children[0].meta.title = homeTitle.value

    const newMenuList = res.data.menuTree
    // const obj3 = MenuList[2]
    // newMenuList.unshift(obj3)
    // const obj2 = MenuList[1]
    // newMenuList.unshift(obj2)
    newMenuList.unshift(obj)
    localStore.setStorage('roleRouters', newMenuList)

    permissionStore.setMenuTabRouters(newMenuList)
    permissionStore
      .generateRoutes('server', newMenuList as AppCustomRouteRecordRaw[])
      .catch(() => {})
    permissionStore.setIsAddRouters(true)
    // window.location.reload()
    return res
  }
}

export function getRandomPwdOne() {
  // 密码为6-12位,需同时包含数字字母或特殊符号(!{'@'}#$%^&)
  let pwd = ''
  const characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLANOPQRSTUWwXYZ0123456789(!{'@'}#$%^&)"
  for (let i = 0; i < 6; i++) {
    pwd += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return pwd
}

export function getRandomPwd() {
  let pwd = getRandomPwdOne()
  while (true) {
    const reg = /^(?![A-Za-z]+$)(?![.@$!%*#_~?&^]+$)(?!\d+$)[\da-zA-Z.@$!%*#_~?&^]{6,12}$/
    if (!reg.test(pwd)) {
      pwd = getRandomPwdOne()
    } else {
      break
    }
  }
  return pwd
}

// 登录过去跳转
export async function outGoLogin() {
  clear()
  clearLocalStorage.clear()
  tagsViewStore.delAllViews()
  resetRouter() // 重置静态路由表
  router.replace('/login')
}
