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
import { useRouter } from 'vue-router'
import { useStorage } from '@/hooks/web/useStorage'

import Avatar1 from '@/assets/imgs/avatar1.png'
import Avatar from '@/assets/imgs/avatar.png'

const { getStorage } = useStorage('localStorage')
const userRoleInfo = getStorage('ptUserInfo').userType
const userIcon = getStorage('ptUserInfo').icon

const affixImgUrl = import.meta.env.VITE_IMG_URL
const avatarImg = computed(() => {
  if (userIcon) {
    return affixImgUrl + userIcon
  } else {
    return userRoleInfo == 'BOSS' ? Avatar : Avatar1
  }
})

const lockStore = useLockStore()

const getIsLock = computed(() => lockStore.getLockInfo?.isLock ?? false)

// const tagsViewStore = useTagsViewStore()

const { getPrefixCls } = useDesign()

const prefixCls = getPrefixCls('user-info')

const { t } = useI18n()

// const { clear } = useStorage()
// const clearLocalStorage = useStorage('localStorage')

// const { replace } = useRouter()

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
    })
    .catch(() => {})
}

const getLocalStorage = useStorage('localStorage')
const merchantName = getLocalStorage.getStorage('ptUserInfo').realName

const dialogVisible = ref<boolean>(false)

// 锁定屏幕
const lockScreen = () => {
  dialogVisible.value = true
}

const toDocument = () => {
  window.open('https://element-plus-admin-doc.cn/')
}

const { push } = useRouter()
</script>

<template>
  <ElDropdown class="custom-hover" :class="prefixCls" trigger="click">
    <div class="flex items-center">
      <img :src="avatarImg" alt="" class="w-[calc(var(--logo-height)-25px)] rounded-[50%]" />
      <div
        class="<lg:hidden text-14px pl-[5px] text-[#4d5156] nameBlock"
        style="color: var(--top-header-text-color)"
        >{{ merchantName || '-' }}</div
      >
    </div>
    <template #dropdown>
      <ElDropdownMenu>
        <ElDropdownItem>
          <div @click="push('/dashboard/accountSettings')">{{ t('accountSettings.title') }}</div>
        </ElDropdownItem>
        <ElDropdownItem divided>
          <div @click="lockScreen">{{ t('lock.lockScreen') }}</div>
        </ElDropdownItem>
        <!-- <ElDropdownItem>
          <div @click="loginOut">{{ t('common.loginOut') }}</div>
        </ElDropdownItem> -->
      </ElDropdownMenu>
    </template>
  </ElDropdown>
  <!-- <div @click="loginOut" class="pr-5px pt-3px pl-5px cursor-pointer custom-hover">
    <Icon :size="17" icon="svg-icon:quit" color="var(--top-header-text-color)" />
  </div> -->

  <LockDialog v-if="dialogVisible" v-model="dialogVisible" />
  <teleport to="body">
    <transition name="fade-bottom" mode="out-in">
      <LockPage v-if="getIsLock" />
    </transition>
  </teleport>
</template>

<style scoped lang="less">
.fade-bottom-enter-active,
.fade-bottom-leave-active {
  transition:
    opacity 0.25s,
    transform 0.3s;
}

.fade-bottom-enter-from {
  opacity: 0;
  transform: translateY(-10%);
}

.fade-bottom-leave-to {
  opacity: 0;
  transform: translateY(10%);
}
</style>
