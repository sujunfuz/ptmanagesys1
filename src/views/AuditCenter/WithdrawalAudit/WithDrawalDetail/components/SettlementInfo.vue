<template>
  <ContentWrap>
    <div class="font-size-20px color-colorBlack">{{ t('withdrawalAudit.sub13') }}</div>
    <div class="font-size-14px color-colorBlack mt-30px">
      <div>
        <span class="color-colorGray inline-block w-84px text-end">{{
          t('withdrawalAudit.sub14')
        }}</span
        ><span class="ml-20px">{{ allData?.balance || '-' }}{{ allData?.currencyCode }}</span>
      </div>
      <div class="mt-20px">
        <span class="color-colorGray inline-block w-84px text-end">{{
          t('withdrawalAudit.sub15')
        }}</span
        ><span class="ml-20px">{{ allData?.settAmount || '-' }}{{ allData?.currencyCode }}</span>
      </div>
      <div class="mt-20px">
        <span class="color-colorGray inline-block w-84px text-end">{{ t('accountPage.sub8') }}</span
        ><span class="ml-20px"
          >{{ allData?.predictIncomeAmount || '-' }}{{ allData?.currencyCode }}</span
        >
      </div>
      <div class="mt-20px">
        <span class="color-colorGray inline-block w-84px text-end">{{ t('accountPage.sub9') }}</span
        ><span class="ml-20px">{{ allData?.exchangeRate || '-' }}</span>
      </div>
      <div class="mt-20px">
        <span class="color-colorGray inline-block w-84px text-end">{{
          t('accountPage.result3')
        }}</span
        ><span class="ml-20px">{{ allData?.serviceFee || '-' }}{{ allData?.currencyCode }}</span>
      </div>
    </div>
  </ContentWrap>
</template>
<script lang="tsx" setup>
import { ContentWrap } from '@/components/ContentWrap/index.ts'
import { useI18n } from '@/hooks/web/useI18n'
import { PropType } from 'vue'
const { t } = useI18n()

defineProps({
  allData: {
    type: Object as PropType<any>,
    default: () => null
  }
})
</script>
<style lang="less" scoped></style>
