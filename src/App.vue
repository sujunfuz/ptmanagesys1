<script setup lang="ts">
import { computed } from 'vue'
import { useAppStore } from '@/store/modules/app'
import { ConfigGlobal } from '@/components/ConfigGlobal'
import { isDark } from '@/utils/is'
import { useDesign } from '@/hooks/web/useDesign'
import { useStorage } from '@/hooks/web/useStorage'

const { getPrefixCls } = useDesign()

const prefixCls = getPrefixCls('app')

const appStore = useAppStore()

const currentSize = computed(() => appStore.getCurrentSize)

const greyMode = computed(() => appStore.getGreyMode)

const { getStorage } = useStorage()

// 根据浏览器当前主题设置系统主题色
const setDefaultTheme = () => {
  if (getStorage('isDark') !== null) {
    appStore.setIsDark(getStorage('isDark'))
    return
  }
}

setDefaultTheme()
</script>

<template>
  <ConfigGlobal :size="currentSize">
    <RouterView :class="greyMode ? `${prefixCls}-grey-mode` : ''" />
  </ConfigGlobal>
</template>

<style lang="less">
@prefix-cls: ~'@{namespace}-app';

.el-scrollbar__bar.is-horizontal {
  height: 8px !important;
}

.size {
  width: 100%;
  height: 100%;
}

html,
body {
  padding: 0 !important;
  margin: 0;
  overflow: hidden;
  color: #14181f;
  font-family: '微软雅黑' !important;
  .size;

  #app {
    .size;
  }
}

.@{prefix-cls}-grey-mode {
  filter: grayscale(100%);
}

.el-input.el-input--default.el-input-group.el-input-group--prepend.el-input--suffix {
  .el-input__wrapper.is-focus {
    box-shadow: none !important;
    border: solid 0.5px var(--el-input-focus-border-color) !important;
    border-left: none !important;
  }
  .el-input-group__prepend:has(+ .el-input__wrapper.is-focus) {
    box-shadow:
      1px 0 0 0 var(--el-input-focus-border-color) inset,
      0 1px 0 0 var(--el-input-focus-border-color) inset,
      0 -1px 0 0 var(--el-input-focus-border-color) inset !important;
  }
  .el-input__wrapper:hover {
    box-shadow: none !important;
  }
}
</style>
