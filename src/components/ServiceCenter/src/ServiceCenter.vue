<script setup lang="tsx">
import { computed, unref } from 'vue'
import { ElDropdown, ElDropdownMenu, ElDropdownItem } from 'element-plus'
import { useLocaleStore } from '@/store/modules/locale'
import { useLocale } from '@/hooks/web/useLocale'
import { propTypes } from '@/utils/propTypes'
import { useDesign } from '@/hooks/web/useDesign'
import { packNewMenu } from '@/utils/common'
import { useRouter } from 'vue-router'
import { useI18n } from '@/hooks/web/useI18n'

const { getPrefixCls } = useDesign()
const prefixCls = getPrefixCls('locale-dropdown')
defineProps({
  color: propTypes.string.def('')
})

const { t } = useI18n()

const { push } = useRouter()
</script>

<template>
  <!-- <ElDropdown :class="prefixCls" trigger="click"> -->
  <span class="flex-c" @click="push('/dashboard/serviceCenter')">
    <Icon
      :size="27"
      icon="svg-icon:headset"
      class="cursor-pointer !p-0"
      :class="$attrs.class"
      :color="color"
    />
  </span>
  <!-- <template #dropdown>
      <ElDropdownMenu>
        <ElDropdownItem class="h-35px">
          <Icon icon="svg-icon:headPhone" :size="20" />
          <div>{{ t('serviceCenter.name') }}</div>
        </ElDropdownItem>
        <ElDropdownItem class="h-35px">
          <Icon icon="svg-icon:iphone" :size="20" />
          <div>133456781234</div>
        </ElDropdownItem>
        <ElDropdownItem class="h-35px">
          <Icon icon="svg-icon:question1" :size="20" />
          <div>{{ t('serviceCenter.name3') }}</div>
        </ElDropdownItem>
      </ElDropdownMenu>
    </template> -->
  <!-- </ElDropdown> -->
</template>
