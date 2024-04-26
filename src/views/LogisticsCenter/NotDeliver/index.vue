<template>
  <div class="w-100% bg-white flex-1 box-border border-rd-4px pa-20px">
    <div class="color-colorBlack font-size-20px mb-20px">{{ t('common.a16') }}</div>
    <div
      class="w-100% flex-c h-40px box-border pt-10px pb-10px pl-15px pr-15px border-rd-4px bg-#FEEDEE mb-30px"
      style="border: 1px solid rgba(244, 80, 87, 0.3)"
    >
      <Icon class="mt-1px" icon="mdi:warning-circle-outline" color="#F45057" />
      <div class="color-#F45057 font-size-14px ml-10px">{{ t('common.a17') }}</div>
    </div>
    <div class="w-100%" v-if="allAreaData.length > 0 && echoCode">
      <Write
        :area-data="allAreaData"
        :echo-code="echoCode"
        :get-flag="getFlag"
        :allow-blank="true"
        @modify-column="modifyColumn"
      />
    </div>
    <div class="mt-20px flex-c justify-end">
      <ElButton plain @click="cancel">{{ t('common.cancel') }}</ElButton>
      <ElButton v-hasPermi="'logisticsCenter:noFreight:edit'" type="primary" @click="changeFlag">{{
        t('common.ok')
      }}</ElButton>
    </div>
  </div>
</template>
<script setup lang="tsx">
import Write from '../Freight/AddTemplate/components/Write.vue'
import { Icon } from '@/components/Icon/index'
import { ref, onMounted } from 'vue'
import { ElButton, ElMessage } from 'element-plus'
import { getNotDeliveryPageListApi, updateNotDeliveryApi } from '@/api/LogisticsCenter/notdelivery'
import { getAllAreaApi } from '@/api/LogisticsCenter/freight'
import { useAppStore } from '@/store/modules/app'
import { nextTick } from 'vue'
import { useStorage } from '@/hooks/web/useStorage'
import { useI18n } from '@/hooks/web/useI18n'

const { t } = useI18n()
const { getStorage } = useStorage('localStorage')
const userInfo = getStorage('ptUserInfo')
const appStore = useAppStore()
appStore.setRenderLoading(true)
const allAreaData = ref([])
const echoCode = ref<any>() //回显的值
const getFlag = ref(false)

onMounted(async () => {
  await init()
})
const init = async () => {
  // const res = await getNotDeliveryPageTopApi()
  const ares = await getAllAreaApi()
  if (ares) {
    allAreaData.value = ares.data[0].children
  }
  const bres = await getNotDeliveryPageListApi()
  if (bres) {
    let arr: any = []
    bres.data.forEach((a) => {
      arr.push(a.code.split(','))
    })
    echoCode.value = arr
  }
  appStore.setRenderLoading(false)
}
const changeFlag = () => {
  getFlag.value = !getFlag.value
  appStore.setRenderLoading(true)
}
const modifyColumn = async (codeVal) => {
  appStore.setRenderLoading(true)
  let arr: any = []
  for (let i = 0; i < codeVal.length; i++) {
    let obj = {
      code: codeVal[i].join(','),
      lastCode: codeVal[i][codeVal[i].length - 1],
      status: 'ACTIVE',
      merchantNo: userInfo.topMerchantNo,
      merchantName: userInfo.merchantName
    }
    arr.push(obj)
  }
  const res = await updateNotDeliveryApi(arr)
  if (res) {
    ElMessage.success(res.msg)
  }
  appStore.setRenderLoading(false)
}

const cancel = async () => {
  echoCode.value = null
  appStore.setRenderLoading(true)
  nextTick(async () => {
    const bres = await getNotDeliveryPageListApi()
    if (bres) {
      let arr: any = []
      bres.data.forEach((a) => {
        arr.push(a.code.split(','))
      })
      echoCode.value = arr
    }
    appStore.setRenderLoading(false)
  })
}
</script>
<style lang="less" scoped>
:deep(.flex-wrap) {
  .w-100px.relative {
    width: 170px !important;
  }
}
</style>
