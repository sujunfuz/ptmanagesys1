<script setup lang="tsx">
import { computed, unref, ref } from 'vue'
import { ElDropdown, ElDropdownMenu, ElDropdownItem } from 'element-plus'
import { useLocaleStore } from '@/store/modules/locale'
import { propTypes } from '@/utils/propTypes'
import { useDesign } from '@/hooks/web/useDesign'
import { colorIsDark, lighten, hexToRGB } from '@/utils/color'
import { onMounted } from 'vue'
import { useAppStore } from '@/store/modules/app'
import { useI18n } from '@/hooks/web/useI18n'
import { useCssVar } from '@vueuse/core'
import { trim, setCssVar } from '@/utils'

const { getPrefixCls } = useDesign()
const prefixCls = getPrefixCls('locale-dropdown')
const { t } = useI18n()

defineProps({
  color: propTypes.string.def('')
})

const localeStore = useLocaleStore()

const themeColorMap = ref([
  { label: t('project.black'), value: '#14181d', checked: false, flag: 'black' },
  { label: t('project.white'), value: '#f0f4f7', checked: false, flag: 'white' },
  { label: t('project.blue'), value: '#0D3868', checked: false, flag: 'blue' },
  { label: t('project.green'), value: '#02383f', checked: false, flag: 'green' }
])

const colorFlag = ref(0)
onMounted(() => {
  let nowThemeColor = localeStore.getThemeColor
  console.log(nowThemeColor)
  for (let i = 0; i < themeColorMap.value.length; i++) {
    if (themeColorMap.value[i].flag == nowThemeColor) {
      colorFlag.value = i
      themeColorMap.value[i].checked = true
    } else {
      themeColorMap.value[i].checked = false
    }
  }
  setLang(nowThemeColor)
})

const appStore = useAppStore()

const setSystemTheme = (color: string) => {
  setCssVar('--el-color-primary', color)
  appStore.setTheme({ elColorPrimary: color })
  const leftMenuBgColor = useCssVar('--left-menu-bg-color', document.documentElement)
  setMenuTheme(trim(unref(leftMenuBgColor)))
}

const setHeaderTheme = (color: string) => {
  const isDarkColor = colorIsDark(color)
  const textColor = isDarkColor ? '#fff' : 'inherit'
  const textHoverColor = isDarkColor ? lighten(color!, 6) : '#f6f6f6'
  const topToolBorderColor = isDarkColor ? color : '#eee'
  setCssVar('--top-header-bg-color', color)
  setCssVar('--top-header-text-color', textColor)
  setCssVar('--top-header-hover-color', textHoverColor)
  appStore.setTheme({
    topHeaderBgColor: color,
    topHeaderTextColor: textColor,
    topHeaderHoverColor: textHoverColor,
    topToolBorderColor
  })
}

const setMenuTheme = (color: string) => {
  const primaryColor = useCssVar('--el-color-primary', document.documentElement)
  const isDarkColor = colorIsDark(color)
  const theme: Recordable = {
    // 左侧菜单边框颜色
    leftMenuBorderColor: isDarkColor ? 'inherit' : '#eee',
    // 左侧菜单背景颜色
    leftMenuBgColor: color,
    // 左侧菜单浅色背景颜色
    leftMenuBgLightColor: color,
    // 左侧菜单选中背景颜色
    leftMenuBgActiveColor: isDarkColor
      ? 'var(--el-color-primary)'
      : hexToRGB(unref(primaryColor), 0.1),
    // 左侧菜单收起选中背景颜色
    leftMenuCollapseBgActiveColor: isDarkColor
      ? 'var(--el-color-primary)'
      : hexToRGB(unref(primaryColor), 0.1),
    // 左侧菜单字体颜色
    leftMenuTextColor: isDarkColor ? '#bfcbd9' : '#333',
    // 左侧菜单选中字体颜色
    leftMenuTextActiveColor: isDarkColor ? '#fff' : 'var(--el-color-primary)',
    // logo字体颜色
    logoTitleTextColor: isDarkColor ? '#fff' : 'inherit',
    // logo边框颜色
    logoBorderColor: isDarkColor ? color : '#eee'
  }
  appStore.setTheme(theme)
  appStore.setCssVarTheme()
}

const setLang = async (themeColor: String) => {
  if (themeColor == 'black') {
    setHeaderTheme('#14181d')
    setMenuTheme('#14181d')
    setSystemTheme('#0068E3')
  }
  if (themeColor == 'white') {
    setHeaderTheme('#f0f4f7')
    setMenuTheme('#f0f4f7')
    setSystemTheme('#0068E3')
  }
  if (themeColor == 'blue') {
    setHeaderTheme('#0D3868')
    setMenuTheme('#0D3868')
    setSystemTheme('#264c78')
  }
  if (themeColor == 'green') {
    setHeaderTheme('#02383f')
    setMenuTheme('#02383f')
    setSystemTheme('#1b4c52')
  }
}

const handleClick = (index) => {
  console.log(index)
  if (colorFlag.value == index) {
    return
  }
  for (let i = 0; i < themeColorMap.value.length; i++) {
    if (index == i) {
      themeColorMap.value[i].checked = true
      colorFlag.value = i
      localeStore.setThemeColor(themeColorMap.value[i].flag)
    } else {
      themeColorMap.value[i].checked = false
    }
  }
  let nowThemeColor = localeStore.getThemeColor
  setLang(nowThemeColor)
}
</script>

<template>
  <ElDropdown :class="prefixCls" trigger="click" @command="setLang">
    <Icon
      :size="19"
      icon="svg-icon:clothing"
      :color="color"
      class="cursor-pointer !p-0"
      :class="$attrs.class"
    />
    <template #dropdown>
      <label>
        <ElDropdownMenu>
          <ElDropdownItem
            v-for="(item, index) in themeColorMap"
            :key="index"
            @click="handleClick(index)"
            :command="item.flag"
          >
            <div class="w-100% flex-b">
              <div class="flex-c">
                <div :style="`--backGroundColor: ${item.value}`" class="colorBlock"></div>
                <div class="elDropdownItem">{{ item.label }}</div>
              </div>
              <input type="radio" class="checkbox" :checked="item.checked" />
            </div>
          </ElDropdownItem>
        </ElDropdownMenu>
      </label>
    </template>
  </ElDropdown>
</template>

<style lang="less" scoped>
.colorBlock {
  width: 25px;
  height: 25px;
  border-radius: 50%;
  background-color: var(--backGroundColor);
  margin-right: 7px;
}

.checkbox {
  margin-left: 50px;
  -webkit-appearance: none;
  -moz-appearance: none;
  outline: none;
  // border: #d8d8d8 solid 1.5px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: solid 1px #e0e0e0;
  transition: #ffffff 0.1s;
  position: relative;
  top: 3px;
}

.elDropdownItem {
  margin: 5px 0px;
}

.checkbox:checked {
  background: #0467eb;
}

.checkbox:checked::after {
  content: '';
  height: 5px;
  width: 8px;
  border: #fff solid 2px;
  position: absolute;
  top: 3px;
  left: 2.5px;
  border-top: none;
  border-right: none;
  transform: rotate(-45deg);
}
</style>
