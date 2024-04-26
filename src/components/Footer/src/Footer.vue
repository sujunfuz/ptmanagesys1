<script setup lang="ts">
// import { useAppStore } from '@/store/modules/app'
// import { computed } from 'vue'
import { useDesign } from '@/hooks/web/useDesign'

const { getPrefixCls } = useDesign()

const prefixCls = getPrefixCls('footer')

// const appStore = useAppStore()

// const title = computed(() => appStore.getTitle)

import { useI18n } from '@/hooks/web/useI18n'
const { t } = useI18n()
</script>

<template>
  <div
    :class="prefixCls"
    class="font-size-12px font-normal pb-10px text-center text-[var(--el-text-color-placeholder)] bg-[var(--app-content-bg-color)] h-[var(--app-footer-height)] leading-[var(--app-footer-height)] dark:bg-[var(--el-bg-color)]"
  >
    {{ t('project.footerTitle') }}
  </div>
</template>
