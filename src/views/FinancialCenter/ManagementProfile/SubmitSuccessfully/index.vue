<template>
  <div>
    <ContentWrap class="h-700px text-center pt-120px flex justify-center">
      <img src="@/assets/imgs/ok.png" />
      <div class="mt-20px font-size-20px">{{ t('accountPage.result1') }}!</div>
      <div class="w-200px">
        <div class="color-#7A7A7A font-size-16px mt-30px flex">
          <div class="w-100px text-right">{{ t('accountPage.result6') }}:</div>
          <span class="ml-15px color-colorBlack">{{ allData.settleAmount || '--' }}</span></div
        >
        <div class="color-#7A7A7A font-size-16px mt-20px flex">
          <div class="w-100px text-right">{{ t('accountPage.result3') }}:</div
          ><span class="ml-15px color-colorBlack">{{ allData.serviceFee || '--' }}</span></div
        >
        <div class="color-#7A7A7A font-size-16px mt-20px flex">
          <div class="w-160px text-right text-nowrap"> {{ t('accountPage.result4') }}: </div
          ><span class="ml-15px color-colorBlack text-nowrap">{{
            allData.predictSettleAmount || '--'
          }}</span></div
        >
        <div class="color-#7A7A7A font-size-16px mt-20px flex-c">
          <div class="w-160px text-right text-nowrap">{{ t('accountPage.result5') }}:</div
          ><span class="ml-15px color-colorBlack text-nowrap">{{
            allData.predictSettleTime || '--'
          }}</span></div
        >
      </div>
      <div class="mt-20px">
        <ElButton type="primary" @click="replace('/financialCenter/managementProfile')">
          {{ t('common.back') }}
        </ElButton>
      </div>
    </ContentWrap>
  </div>
</template>

<script lang="tsx" setup>
import { ContentWrap } from '@/components/ContentWrap'
import { useI18n } from '@/hooks/web/useI18n'
import { ElButton } from 'element-plus'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
const { currentRoute, push, replace } = useRouter()
const { t } = useI18n()
const allData = ref<any>({})
onMounted(() => {
  allData.value = currentRoute.value.query
})
</script>
