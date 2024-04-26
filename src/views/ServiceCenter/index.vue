<template>
  <div class="bg-#fff">
    <img src="@/assets/imgs/ServiceCenter/backImg.png" class="w-100%" />
    <div class="relative top--340px left-220px">
      <div class="font-size-35px">{{ t('serviceCenter.centerTitle') }}</div>
      <div class="mt-15px">{{ t('serviceCenter.centerSub') }}</div>
      <div class="mt-70px flex-b w-63%">
        <div
          @click="openDialog(t('serviceCenter.sub1'), 'first')"
          class="h-230px min-w-210px border-rd-10px border-#d0d1d5 border-solid border-1px bg-#fff text-center flex flex-col flex-justify-center cursor-pointer"
        >
          <img src="@/assets/imgs/ServiceCenter/item1.png" class="w-60px h-60px ml-75px" />

          <div class="mt-15px">{{ t('serviceCenter.sub1') }}</div>
        </div>
        <div
          @click="openDialog(t('serviceCenter.sub2'), 'second')"
          class="h-230px min-w-210px border-rd-10px border-#d0d1d5 border-solid border-1px bg-#fff text-center flex flex-col flex-justify-center cursor-pointer"
        >
          <img src="@/assets/imgs/ServiceCenter/item2.png" class="w-60px h-60px ml-75px" />
          <div class="mt-15px">{{ t('serviceCenter.sub2') }}</div>
        </div>
        <div
          @click="openDialog(t('serviceCenter.sub3'), 'third')"
          class="h-230px min-w-210px border-rd-10px border-#d0d1d5 border-solid border-1px bg-#fff text-center flex flex-col flex-justify-center cursor-pointer"
        >
          <img src="@/assets/imgs/ServiceCenter/item3.png" class="w-60px h-60px ml-75px" />
          <div class="mt-15px">{{ t('serviceCenter.sub3') }}</div>
        </div>
        <div
          @click="openHotLine()"
          class="h-230px min-w-210px border-rd-10px border-#d0d1d5 border-solid border-1px bg-#fff text-center flex flex-col flex-justify-center cursor-pointer"
        >
          <img src="@/assets/imgs/ServiceCenter/item4.png" class="w-60px h-60px ml-75px" />
          <div class="mt-15px">{{ t('serviceCenter.sub4') }}</div>
        </div>
      </div>

      <div class="mt-30px w-63%">
        <div class="font-size-18px">{{ t('serviceCenter.process') }}</div>
        <div v-if="dataList?.length != 0">
          <div
            v-for="(item, key) in dataList"
            :key="key"
            class="w-100% border-solid border-#ececec border-1px border-rd-7px h-150px mt-30px"
          >
            <div class="flex-b p-20px">
              <div class="flex">
                <el-avatar v-if="item.icon" :src="imgUrl + item.icon" :size="50" />
                <el-avatar v-else :src="imgUrl + commonUrl" :size="50" />
                <div class="ml-10px w-300px">
                  <div clas="color-#828184">{{ item?.userName }}</div>
                  <div class="mt-6px">
                    <el-tag :type="item.questionType == 'ADVICE'?'warning':item.questionType == 'COMPLAINT'?'danger':''"
                    >
                      {{ item.questionTypeStr }}
                    </el-tag>
                    <span class="font-size-13px ml-5px break-all"
                      >{{ t('serviceCenter.id') }}:{{ item?.id }}</span
                    >
                  </div>
                  <div class="mt-5px w-350px textOverFlow color-#7d7d7d font-size-14px mt-7px">
                    {{ item?.questionDetail }}
                  </div>
                </div>
              </div>

              <div class="mt-30px">
                <el-tag :type="item.questionStatus == 'DEALED' ? 'success' : ''">
                  {{ item.questionStatusStr }}</el-tag
                >
              </div>

              <div class="mt-33px font-size-14px">{{ item?.createTimeStr }}</div>
              <div
                class="colorMain mt-33px font-size-14px mr-10px cursor-pointer"
                @click="push('/dashboard/serviceDetail?id=' + item.id)"
                >{{ t('project.detail') }}</div
              >
            </div>
          </div>
        </div>
        <Empty v-else />

        <div class="relative w-100% mt-20px">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[10, 20, 30, 40]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            class="absolute right-3px"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>
  </div>

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
import { useI18n } from '@/hooks/web/useI18n'
import {
  ElButton,
  ElAvatar,
  ElTag,
  ElMessageBox,
  ElPagination,
  ElMessage,
  ElImage
} from 'element-plus'
import { Dialog } from '@/components/Dialog'
import Write from './components/add.vue'
import { ref, onMounted, unref } from 'vue'
import { pageListApi, pageTopApi, addQuestionApi } from '@/api/pfQuestionFeedback/index'
import Empty from '@/components/customComponents/Empty/index.vue'

const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const dataList = ref([])

const saveLoading = ref(false)
const imgUrl = import.meta.env.VITE_IMG_URL
const commonUrl = '/common/ptmp/statics/file/StoreDefaultLogo.png'

const handleSizeChange = async (val: number) => {
  await getDataList()
}
const handleCurrentChange = async (val: number) => {
  await getDataList()
}

import { useRouter } from 'vue-router'
const { push } = useRouter()

onMounted(async () => {
  await getDataList()
})

const getDataList = async () => {
  const res = await pageListApi({
    currentPage: currentPage.value,
    pageSize: pageSize.value
  })
  total.value = res.data.total
  dataList.value = res.data.list
}
const dialogVisible = ref(false)
const dialogTitle = ref('')
const openType = ref('')
const { t } = useI18n()

const circleUrl = 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'

const openHotLine = () => {
  ElMessageBox.alert(t('serviceCenter.num') + ': 1885917698', t('serviceCenter.iphone1'), {
    // if you want to disable its autofocus
    // autofocus: false,
    confirmButtonText: t('project.confirm')
  })
}

const writeRef = ref<ComponentRef<typeof Write>>()
const save = async () => {
  const write = unref(writeRef)
  const formData = await write?.submit()
  if (formData) {
    saveLoading.value = true
    try {
      console.log(openType)
      let questionType = ''
      switch (openType.value) {
        case 'first':
          questionType = 'QUESTION_FEEDBACK'
          break
        case 'second':
          questionType = 'ADVICE'
          break
        case 'third':
          questionType = 'COMPLAINT'
          break
      }
      const res = await addQuestionApi({ ...formData, questionType: questionType })
      if (res.code == 200) {
        ElMessage.success(t('common.operateSuccess'))
        getDataList()
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
