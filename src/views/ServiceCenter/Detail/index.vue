<template>
  <div>
    <ContentWrap
      ><span v-if="dataList?.questionStatus == 'DEALING'">{{ t('serviceDetail.title') }}</span>
      <span v-else-if="dataList?.questionStatus == 'WAIT_DEAL'">{{
        t('serviceDetail.title1')
      }}</span>
      <span v-else-if="dataList?.questionStatus == 'DEALED'">{{
        dataList?.questionStatusStr
      }}</span>
      <span v-if="!dataList?.isAgree">
        <span v-if="dataList?.questionStatus == 'DEALING'" class="colorMain font-size-14px ml-15px"
          >{{ t('serviceDetail.sub') }}?</span
        >
        <ElButton
          v-if="dataList?.questionStatus == 'DEALING'"
          @click="openDialog(t('serviceDetail.choice2'), false)"
          class="ml-15px"
          >{{ t('serviceDetail.choice2') }}</ElButton
        >
        <ElButton
          v-if="dataList?.questionStatus == 'DEALING'"
          type="primary"
          @click="openDialog(t('serviceDetail.choice1'), true)"
        >
          {{ t('serviceDetail.choice1') }}
        </ElButton>
      </span>
    </ContentWrap>
    <div class="w-100% flex-b mt-20px">
      <ContentWrap class="w-50%">
        <div>{{ t('serviceDetail.title2') }}</div>
        <div class="color-#7A7A7A font-size-15px mt-30px flex-c">
          <div class="w-70px text-right">{{ t('serviceDetail.name') }}:</div>
          <span class="ml-15px color-colorBlack" v-if="controlHide">{{ dataList?.userName }}</span>
          <span class="ml-15px color-colorBlack" v-else
            >{{ dataList?.userName.split('')[0] }}**</span
          >
          <Icon
            icon="ep:view"
            v-if="!controlHide"
            color="var(--el-color-primary)"
            @click="controlHide = !controlHide"
            class="ml-5px cursor-pointer"
          />
          <Icon
            icon="ep:hide"
            class="ml-5px cursor-pointer"
            v-else
            @click="controlHide = !controlHide"
          />
        </div>
        <div class="color-#7A7A7A font-size-15px mt-30px flex">
          <div class="text-right">{{ t('serviceDetail.iphone') }}:</div>
          <span class="ml-5px color-colorBlack">{{ dataList?.mobileNo }}</span></div
        >
      </ContentWrap>
      <ContentWrap class="w-50% ml-20px"
        ><div>{{ t('serviceDetail.title3') }}</div>
        <div>
          <div class="mt-15px" v-for="(item, key) in dataList?.questionRecords" :key="key">
            <div class="flex-c"
              ><div class="circleItem"></div
              ><span class="font-size-15px color-#393d44 ml-10px">{{ item.questionDetail }}</span>
            </div>
            <div class="line font-size-14px">
              <!-- {{ item.questionDetail }} -->
              <div class="flex flex-wrap">
                <el-image
                  style="width: 100px; height: 100px"
                  class="mt-15px mb-15px mr-15px cursor-pointer"
                  @click="clickImage(imgUrl + item1)"
                  :src="imgUrl + item1"
                  fit="fill"
                  v-for="(item1, key1) in item.questionImages?.split(',')"
                  :key="key1"
                />
              </div>
              <div class="font-size-14px mb-10px">{{ item.createTimeStr }}</div>
            </div>
          </div>
        </div>
      </ContentWrap>
    </div>
  </div>
  <ContentWrap class="mt-20px text-right">
    <ElButton @click="push('/dashboard/serviceCenter')">{{ t('common.back') }}</ElButton>
  </ContentWrap>

  <Dialog v-model="dialogVisible" :title="dialogTitle">
    <Write ref="writeRef" :openType="openType" />
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
import { ElButton, ElAvatar, ElTag, ElMessageBox, ElImage, ElMessage } from 'element-plus'
import { Dialog } from '@/components/Dialog'
import Write from '../components/handle.vue'
import { ref, onMounted, unref } from 'vue'
import { useRouter } from 'vue-router'
import { questionDetailByUser, admitReplyApi } from '@/api/pfQuestionFeedback/index'
import { createImageViewer } from '@/components/ImageViewer'

const imgUrl = import.meta.env.VITE_IMG_URL

const { push, currentRoute } = useRouter()

const saveLoading = ref(false)

const dialogVisible = ref(false)
const dialogTitle = ref('')
const openType = ref(false)
const { t } = useI18n()

const clickImage = (data) => {
  createImageViewer({
    urlList: [data]
  })
}

onMounted(async () => {
  await getData()
})

const dataList = ref()

const getData = async () => {
  const id = currentRoute.value.query.id
  const res = await questionDetailByUser({ id: id })
  dataList.value = res.data
}

const controlHide = ref(false)

const writeRef = ref<ComponentRef<typeof Write>>()
const save = async () => {
  const write = unref(writeRef)
  const formData = await write?.submit()
  if (formData) {
    saveLoading.value = true
    try {
      const res = await admitReplyApi({
        ...formData,
        id: dataList.value.id,
        agreeIs: openType.value
      })
      if (res.code == 200) {
        ElMessage.success(t('common.operateSuccess'))
        await getData()
      }
    } catch (error) {
      console.log(error)
    } finally {
      saveLoading.value = false
      dialogVisible.value = false
    }
  }
}

const openDialog = (title, type) => {
  dialogTitle.value = title
  openType.value = type
  dialogVisible.value = true
}
</script>

<style scoped>
.circleItem {
  width: 10px;
  height: 10px;
  background-color: #0069e6;
  border: #0069e6 solid 1.5px;
  border-radius: 50%;
}

.line {
  border-left: #e6e6e6 solid 1px;
  margin-left: 5px;
  padding-left: 15px;
  padding-top: 5px;
  padding-bottom: 5px;
  color: #8b8b8b;
}
</style>
