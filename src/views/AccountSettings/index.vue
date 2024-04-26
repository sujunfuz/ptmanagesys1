<template>
  <ContentWrap class="h-790px flex flex-items-centerc flex-justify-center">
    <div class="w-600px h-500px text-left mt-70px">
      <h1 class="font-size-22px">{{ t('accountSettings.title') }}</h1>
      <div class="text-center">
        <img :src="avatarImg" class="w-100px h-100px border-rd-100px" />
        <div class="w-100% h-40px text-center relative mt-10px">
          <span class="color-colorMain">{{ t('common.l') }}</span>
          <UploadImage
            v-if="showFlag"
            :avatarShow="true"
            @update-img-url="updateImgUrl"
            style="left: calc(50% - 32px)"
            class="customClass absolute z-10 w-64px h-31px top-0px color-colorMain"
          />
        </div>
      </div>
      <div class="flex-b mt-40px mb-30px pb-15px border-b-#f8f8f8 border-b-solid border-b-1px">
        <div class="color-#7A7A7A">{{ t('accountSettings.name') }}</div>
        <div class="color-#373737">{{ data?.realName || '-' }}</div>
      </div>
      <div class="flex-b mt-40px mb-30px pb-15px border-b-#f8f8f8 border-b-solid border-b-1px">
        <div class="color-#7A7A7A">{{ t('accountSettings.iphone') }}</div>
        <div class="color-#373737">{{ data?.mobileNo || '-' }}</div>
      </div>
      <div class="flex-b mt-40px mb-30px pb-15px border-b-#f8f8f8 border-b-solid border-b-1px">
        <div class="color-#7A7A7A">{{ t('accountSettings.role') }}</div>
        <div class="color-#373737">{{ data?.roleNames || '-' }}</div>
      </div>
      <div class="flex-b mt-40px mb-30px pb-15px border-b-#f8f8f8 border-b-solid border-b-1px">
        <div class="color-#7A7A7A">{{ t('accountSettings.pwd') }}</div>
        <div class="flex-c color-#373737"
          >{{ data?.setIs || '-' }}
          <span
            class="font-size-14px colorMain ml-10px cursor-pointer"
            @click="dialogVisible = true"
            >{{ t('project.edit2') }}</span
          ></div
        >
      </div>
    </div>
  </ContentWrap>

  <Dialog v-model="dialogVisible" :title="t('accountSettings.title2')" max-height="160px">
    <Write ref="writeRef" />
    <template #footer>
      <ElButton @click="dialogVisible = false">{{ t('common.cancel') }}</ElButton>
      <ElButton type="primary" :loading="saveLoading" @click="save">
        {{ t('project.confirm') }}
      </ElButton>
    </template>
  </Dialog>
</template>

<script setup lang="tsx">
import { ContentWrap } from '@/components/ContentWrap'
import { useI18n } from '@/hooks/web/useI18n'
import { ElButton, ElMessage } from 'element-plus'
import { Dialog } from '@/components/Dialog'
import Write from './components/add.vue'
import { ref, onMounted, unref, computed } from 'vue'
import UploadImage from '@/components/UploadImage/UploadImage.vue'
import { setAccountApi, postUpdatePwdApi, changeIconApi } from '@/api/account/set'
import { nextTick } from 'vue'

import Avatar1 from '@/assets/imgs/avatar1.png'
import Avatar from '@/assets/imgs/avatar.png'
import { useStorage } from '@/hooks/web/useStorage'

const { getStorage } = useStorage('localStorage')
const userRoleInfo = getStorage('ptUserInfo').userType
const userInfo = getStorage('ptUserInfo')

const avatarImg = ref()

const dialogVisible = ref(false)
const showFlag = ref(true)
const data = ref()
const { t } = useI18n()
const saveLoading = ref(false)
onMounted(async () => {
  await getData()
})
const localStore = useStorage('localStorage')
const affixImgUrl = import.meta.env.VITE_IMG_URL
const getData = async () => {
  const res = await setAccountApi()
  if (res.code == 200) {
    data.value = res.data
    if (res.data.icon) {
      avatarImg.value = affixImgUrl + res.data.icon
      userInfo.icon = res.data.icon
      localStore.setStorage('ptUserInfo', userInfo)
    } else {
      avatarImg.value = userRoleInfo == 'BOSS' ? Avatar : Avatar1
    }
  }
}

const writeRef = ref<ComponentRef<typeof Write>>()
const save = async () => {
  const write = unref(writeRef)
  const formData = await write?.submit()
  if (formData) {
    saveLoading.value = true
    try {
      const res = await postUpdatePwdApi(formData)
      if (res.code == 200) {
        ElMessage.success(t('common.operateSuccess'))
      }
    } catch (error) {
      console.log(error)
    } finally {
      saveLoading.value = false
      dialogVisible.value = false
    }
  }
}

const updateImgUrl = async (val) => {
  // avatarImg.value = affixImgUrl + val
  const res = await changeIconApi({ icon: val })
  if (res.code == 200) {
    ElMessage.success(t('common.operateSuccess'))
    await getData()
    window.location.reload()
  }
  showFlag.value = false
  nextTick(() => {
    showFlag.value = true
  })
}
</script>

<style lang="less" scoped>
:deep(.el-upload-list__item) {
  opacity: 0;
  max-width: 64px;
  max-height: 31px;
  overflow: hidden;
}
:deep(.customClass) {
  .el-upload {
    border: none !important;
    opacity: 0 !important;
  }
  .el-upload--picture-card {
    border: none !important;
    background-color: transparent !important;
    width: auto !important;
    height: auto !important;
  }
  .el-upload-list {
    // display: none;
  }
}
</style>
