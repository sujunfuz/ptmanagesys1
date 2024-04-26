<template>
  <!-- 1 -->

  <div v-if="allData.afSalesConsultRecordVOS" class="font-size-18px">
    <div v-for="item in allData.afSalesConsultRecordVOS" :key="item.id" class="w-100% mt-30px">
      <div class="flex justify-between">
        <div
          v-if="item.operateType == 'USER'"
          class="w-50px h-50px border-rd-50px bg-#FF770F text-center line-height-50px color-white"
          >{{ t('aftersalesList.role') }}</div
        >
        <div
          v-else-if="item.operateType == 'MERCHANT'"
          class="w-50px h-50px border-rd-50px bg-colorMain text-center line-height-50px color-white"
          >{{ t('aftersalesList.role1') }}</div
        >
        <div
          v-else-if="item.operateType == 'BOSS'"
          class="w-50px h-50px border-rd-50px bg-#BED9F8 text-center line-height-50px color-white"
          >{{ t('aftersalesList.role2') }}</div
        >
        <div class="customW border-(1px solid #c7c7c7 rd-4px) font-size-16px color-colorBlack pb-10px">
          <div
            class="w-100% flex-cb box-border pl-15px pr-15px pt-13px pb-13px border-b-(1px solid #c7c7c7) bg-#F0F2F5"
          >
            <span class="font-size-16px">{{ item.afSalesStatusStr }}</span>
            <span class="color-colorGray ">{{ item.createTime }}</span>
          </div>
          <div class="w-100% customStyle" v-html="item.content"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="tsx">
import { useI18n } from '@/hooks/web/useI18n'
const { t } = useI18n()
const props = defineProps({
  allData: {
    type: Object,
    default: () => {}
  }
})
</script>
<style lang="less" scoped>
.customW {
  width: calc(100% - 60px);
}
.custom {
  div {
    padding: 0px 0px 0px 0px !important;
  }
}
</style>
