<script setup lang="ts">
import { ElDropdown, ElDropdownMenu, ElDropdownItem, ElMessageBox } from 'element-plus'
import { useI18n } from '@/hooks/web/useI18n'
// import { useStorage } from '@/hooks/web/useStorage'
// import { resetRouter } from '@/router'
// import { useRouter } from 'vue-router'
import { useDesign } from '@/hooks/web/useDesign'
// import { useTagsViewStore } from '@/store/modules/tagsView'
import LockDialog from './components/LockDialog.vue'
import { ref, computed } from 'vue'
import LockPage from './components/LockPage.vue'
import { useLockStore } from '@/store/modules/lock'
import { outGoLogin } from '@/utils/common'

const lockStore = useLockStore()

const getIsLock = computed(() => lockStore.getLockInfo?.isLock ?? false)

// const tagsViewStore = useTagsViewStore()

const { getPrefixCls } = useDesign()

const prefixCls = getPrefixCls('user-info')

const { t } = useI18n()

// const { clear } = useStorage()
// const clearLocalStorage = useStorage('localStorage')

// const { replace } = useRouter()
const emit = defineEmits(['quit'])

const loginOut = () => {
  ElMessageBox.confirm(t('common.loginOutMessage'), t('common.reminder'), {
    confirmButtonText: t('project.confirm'),
    confirmButtonClass: 'btnConfirm',
    cancelButtonText: t('common.cancel'),
    type: 'warning'
  })
    .then(async () => {
      // const res = await loginOutApi().catch(() => {})
      // if (res) {
      //   clear()
      //   tagsViewStore.delAllViews()
      //   resetRouter() // 重置静态路由表
      //   replace('/login')
      // }
      outGoLogin()
      emit('quit', true)
    })
    .catch(() => {})
}

const dialogVisible = ref<boolean>(false)

// 锁定屏幕
const lockScreen = () => {
  dialogVisible.value = true
}

const toDocument = () => {
  window.open('https://element-plus-admin-doc.cn/')
}
</script>

<template>
  <div @click="loginOut" class="pr-5px pt-3px pl-5px cursor-pointer custom-hover">
    <Icon :size="17" icon="svg-icon:quit" color="var(--top-header-text-color)" />
  </div>
</template>
