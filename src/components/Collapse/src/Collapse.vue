<script setup lang="ts">
import { computed, unref } from 'vue'
import { useAppStore } from '@/store/modules/app'
import { propTypes } from '@/utils/propTypes'
import { useDesign } from '@/hooks/web/useDesign'
import { Icon } from '@/components/Icon'
import { useI18n } from '@/hooks/web/useI18n'

const { getPrefixCls } = useDesign()

const prefixCls = getPrefixCls('collapse')

const { t } = useI18n()

defineProps({
  color: propTypes.string.def('')
})

const appStore = useAppStore()

const collapse = computed(() => appStore.getCollapse)

const toggleCollapse = () => {
  const collapsed = unref(collapse)
  appStore.setCollapse(!collapsed)
}
</script>

<template>
  <div :class="prefixCls" class="small menuBottom" @click="toggleCollapse">
    <!-- <Icon
      :size="18"
      :icon="collapse ? 'ant-design:menu-unfold-outlined' : 'ant-design:menu-fold-outlined'"
      :color="color"
      class="cursor-pointer"
    /> -->
    <div
      v-if="!collapse"
      class="pl-25px cursor-pointer flex-c pt-6px pb-10px bg-[var(--left-menu-bg-color)]"
    >
      <Icon
        icon="svg-icon:fold"
        color="var(--left-menu-text-color)"
        :size="14"
        style="transform: rotate(90deg)"
        class="cursor-pointer mr-3px"
      />
      <span class="color-[var(--left-menu-text-color)] font-size-14px">
        {{ t('common.shrink') }}
      </span>
    </div>
    <div v-else class="cursor-pointer flex-c pb-10px pt-6px pl-7px bg-[var(--left-menu-bg-color)]">
      <span class="color-[var(--left-menu-text-color)] font-size-14px">
        {{ t('common.expand') }}
      </span>
      <Icon
        icon="svg-icon:fold"
        color="var(--left-menu-text-color)"
        :size="14"
        style="transform: rotate(-90deg)"
        class="ml-3px"
      />
    </div>
  </div>
</template>

<style lang="less" scoped>
.menuBottom {
  width: 100%;
  border-top: rgba(84, 87, 91, 0.2) solid 1px;
  position: absolute;
  bottom: 0px;
}
</style>
