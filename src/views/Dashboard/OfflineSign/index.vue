<template>
  <div
    ><ContentWrap>
      <div>
        <Steps :currentStep="currentStep" :stepsDesc="stepsDesc" />
      </div>
    </ContentWrap>
    <div class="marT20 flex">
      <ContentWrap class="w-33%">
        <div>
          <div class="font-size-18px">{{ t('offlinesign.step1') }}</div>
          <div class="flex-cb bg-blue1 pt-25px pb-25px pl20px pr-20px mt-20px">
            <div class="flex-c mt-20px">
              <img class="w-50px h-50px" :src="Img1" />
              <div class="ml-12px">
                <div>{{ t('common.a9') }}.word</div>
                <div class="font-size-12px color-colorGray">20.13KB</div>
              </div>
            </div>
            <div class="cursor-pointer color-colorMain" @click="download()">{{
              t('batchImport.download')
            }}</div>
          </div>
          <div class="font-size-18px mt-30px">{{ t('offlinesign.merreturn') }}</div>
          <div class="color-colorGray mt-5px">{{ t('offlinesign.mertip') }}</div>
          <ElButton
            v-if="merLogisticsRecordList"
            @click="openDialog(1)"
            class="w160px !h-40px mt-20px mb-30px"
            type="primary"
            >{{ t('offlinesign.uploadbts') }}</ElButton
          >
          <div class="font-size-18px pt-30px border-t-(1px solid #E8EAED)">{{
            t('offlinesign.platreturn')
          }}</div>
          <div class="color-colorGray mt-5px">{{ t('offlinesign.plattip') }}</div>
          <ElButton disabled @click="openDialog(1)" class="w160px !h-40px mt-20px" type="info">{{
            t('offlinesign.uploadbts')
          }}</ElButton>
        </div>
      </ContentWrap>
      <ContentWrap class="marL20 w-67%">
        <div>
          <div>
            <div class="flex-c">
              <div class="mr-5px font-size-18px">{{ t('offlinesign.viewLog') }}</div>
              <div class="platform1">{{ t('project.platform') }}</div>
            </div>
            <!-- <div class="flex-b mt-10px font-size-15px">
              <div>{{ t('aftersalesList.kuaidigs') }}:</div>
              <div>{{ t('aftersalesList.kuaidiNo') }}:</div>
              <div>{{ t('common.w') }}:</div>
              <div>{{ t('common.r') }}:</div>
            </div> -->
            <ElScrollbar
              v-if="bossLogisticsRecordList.length != 0"
              :height="'300px'"
              class="w-800px mt-10px bg-#f9f9f9 mb-30px"
            >
              <StepLine :stepList="bossLogisticsRecordList" stepType="afSales" />
            </ElScrollbar>
            <Empty v-else />
          </div>
          <div>
            <div class="flex-c">
              <div class="mr-5px font-size-18px">{{ t('offlinesign.viewLog') }}</div>
              <div class="business1">{{ t('project.business') }}</div>
            </div>
            <div class="w-800px flex-b mt-10px font-size-15px" v-if="merLogistics?.logisticsNo">
              <div>{{ t('aftersalesList.kuaidigs') }}:{{ merLogistics?.logisticsName }}</div>
              <div>{{ t('aftersalesList.kuaidiNo') }}:{{ merLogistics?.logisticsNo }}</div>
              <div>{{ t('common.w') }}:{{ merLogistics?.phone }}</div>
              <div>{{ t('common.r') }}:{{ merLogistics?.remark }}</div>
            </div>
            <ElScrollbar
              v-if="merLogisticsRecordList.length != 0"
              :height="'300px'"
              class="w-800px mt-10px bg-#f9f9f9"
            >
              <StepLine :stepList="merLogisticsRecordList" stepType="afSales" />
            </ElScrollbar>
            <Empty v-else />
          </div>
        </div>
      </ContentWrap>
      <Dialog
        v-model="DialogShow"
        :title="t('offlinesign.uploadbts')"
        :maxHeight="150"
        :width="680"
      >
        <Write :isCol="false" :currentRow="currentRow" ref="writeRef" :allEnum="allEnum" />
        <template #footer>
          <ElButton @click="DialogShow = false">{{ t('project.cancel') }}</ElButton>
          <ElButton type="primary" :loading="saveLoading" @click="save">
            {{ t('project.confirm') }}
          </ElButton>
        </template>
      </Dialog>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElScrollbar } from 'element-plus'
import { ElButton, ElMessage } from 'element-plus'
import { ref, unref, onMounted } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import Steps from './components/Steps.vue'
import { Dialog } from '@/components/Dialog'
import Write from './components/Write.vue'
import { ContentWrap } from '@/components/ContentWrap'
import Img1 from '@/assets/imgs/Dashboard/file.png'
import StepLine from '@/components/customComponents/StepLine/index.vue'
import Empty from '@/components/customComponents/Empty/index.vue'
import {
  getLogisticsEnumApi,
  uploadLogisticsApi,
  getLogisticsDetailApi,
  getContractTemplateApi
} from '@/api/auditCenter/merchantSettlement'
const { t } = useI18n()

const currentStep = ref(2)
const stepsDesc = [
  t('offlinesign.step1'),
  t('offlinesign.step2'),
  t('offlinesign.step3'),
  t('offlinesign.step4'),
  t('offlinesign.step5'),
  t('offlinesign.step6')
]
// const onChange = (index: any) => {
//   currentStep.value = index
// }

const imgUrl = import.meta.env.VITE_IMG_URL

const download = async () => {
  const res = await getContractTemplateApi()
  if (res.code == 200) {
    let temp = imgUrl + res.data
    let elemIF = document.createElement('iframe')
    elemIF.src = temp
    elemIF.style.display = 'none'
    document.body.appendChild(elemIF)
  }
}

const DialogShow = ref(false)
const currentRow = ref()
const writeRef = ref()
const saveLoading = ref(false)

const openDialog = async (type: any) => {
  DialogShow.value = true
}
const save = async () => {
  const write = unref(writeRef)
  const formData = await write?.submit()
  if (formData) {
    const res = await uploadLogisticsApi(formData)
    if (res.code == 200) {
      ElMessage.success(res.msg)
      DialogShow.value = false
      currentStep.value = 3
      await getData()
    }
  }
}

const allEnum = ref()
const bossLogisticsRecordList = ref<Array<any>>([])
const merLogisticsRecordList = ref<Array<any>>([])

const merLogistics = ref()
const getData = async () => {
  const res = await getLogisticsEnumApi()
  allEnum.value = res.data

  const res1 = await getLogisticsDetailApi()
  if (res1.code == 200) {
    merLogistics.value = res1.data.merLogistics
    for (var item in res1.data.bossLogisticsRecordList) {
      bossLogisticsRecordList.value.push({
        content: res1.data.bossLogisticsRecordList[item].context,
        time: res1.data.bossLogisticsRecordList[item].createTimeStr,
        title: res1.data.bossLogisticsRecordList[item].status
      })
    }
    for (var item in res1.data.merLogisticsRecordList) {
      merLogisticsRecordList.value.push({
        content: res1.data.merLogisticsRecordList[item].context,
        time: res1.data.merLogisticsRecordList[item].createTimeStr,
        title: res1.data.merLogisticsRecordList[item].status
      })
    }

    if (merLogisticsRecordList.value.length != 0) {
      currentStep.value = 3
    }

    if (bossLogisticsRecordList.value.length != 0) {
      currentStep.value = 5
    }
  }
}

onMounted(async () => {
  await getData()
})
</script>
