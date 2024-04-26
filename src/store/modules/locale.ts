import { defineStore } from 'pinia'
import { store } from '../index'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import zhTw from 'element-plus/es/locale/lang/zh-tw'
import en from 'element-plus/es/locale/lang/en'
import { useStorage } from '@/hooks/web/useStorage'
import { LocaleDropdownType } from '@/components/LocaleDropdown'

const { getStorage, setStorage } = useStorage('localStorage')

const elLocaleMap = {
  zh: zhCn,
  cht: zhTw,
  en: en
}
interface LocaleState {
  currentLocale: LocaleDropdownType
  localeMap: LocaleDropdownType[]
  themeColor: string
}

export const useLocaleStore = defineStore('locales', {
  state: (): LocaleState => {
    return {
      currentLocale: {
        lang: getStorage('lang') || 'zh',
        elLocale: elLocaleMap[getStorage('lang') || 'zh']
      },
      themeColor: 'black',
      // 多语言
      localeMap: [
        {
          lang: 'zh',
          name: '简体中文'
        },
        {
          lang: 'cht',
          name: '繁體中文'
        },
        {
          lang: 'en',
          name: 'English'
        }
      ]
    }
  },
  getters: {
    getCurrentLocale(): LocaleDropdownType {
      return this.currentLocale
    },
    getThemeColor(): String {
      return getStorage('themeColor') || this.themeColor
    },
    getLocaleMap(): LocaleDropdownType[] {
      return this.localeMap
    }
  },
  actions: {
    setCurrentLocale(localeMap: LocaleDropdownType) {
      this.currentLocale.lang = localeMap?.lang
      this.currentLocale.elLocale = elLocaleMap[localeMap?.lang]
      setStorage('lang', localeMap?.lang)
    },
    setThemeColor(themeColor: string) {
      this.themeColor = themeColor
      setStorage('themeColor', themeColor)
    }
  }
})

export const useLocaleStoreWithOut = () => {
  return useLocaleStore(store)
}
