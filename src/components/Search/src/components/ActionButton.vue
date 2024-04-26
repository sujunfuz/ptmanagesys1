<script setup lang="ts">
import { ElButton } from 'element-plus'
import { useIcon } from '@/hooks/web/useIcon'
import { propTypes } from '@/utils/propTypes'
import { useI18n } from '@/hooks/web/useI18n'

const emit = defineEmits(['search', 'reset', 'expand', 'add'])

const { t } = useI18n()

defineProps({
  showSearch: propTypes.bool.def(true),
  showReset: propTypes.bool.def(true),
  showAdd: propTypes.bool.def(false),
  showExpand: propTypes.bool.def(false),
  visible: propTypes.bool.def(true),
  searchLoading: propTypes.bool.def(false),
  resetLoading: propTypes.bool.def(false),
  addLoading: propTypes.bool.def(false)
})

const onSearch = () => {
  emit('search')
}

const onAdd = () => {
  emit('add')
}

const onReset = () => {
  emit('reset')
}

const onExpand = () => {
  emit('expand')
}
</script>

<template>
  <!-- :icon="useIcon({ icon: 'ep:refresh-right' })" -->
  <ElButton v-if="showReset" :loading="resetLoading" @click="onReset">
    {{ t('common.reset') }}
  </ElButton>
  <ElButton
    v-if="showAdd"
    :loading="addLoading"
    :icon="useIcon({ icon: 'ep:plus' })"
    @click="onAdd"
    plain
    type="primary"
  >
    {{ t('project.add') }}
  </ElButton>
  <!-- :icon="useIcon({ icon: 'ep:search' })" -->
  <ElButton v-if="showSearch" type="primary" :loading="searchLoading" @click="onSearch">
    {{ t('common.query') }}
  </ElButton>
  <!-- :icon="useIcon({ icon: visible ? 'ep:arrow-down' : 'ep:arrow-up' })" -->
  <ElButton v-if="showExpand" text @click="onExpand">
    {{ t(visible ? 'common.shrink' : 'common.expand') }}
  </ElButton>
</template>
