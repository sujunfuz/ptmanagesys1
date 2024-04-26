<template>
  <ContentWrap>
    <div class="font-size-20px color-colorBlack">{{ t('withdrawalAudit.sub13') }}</div>
    <div class="font-size-14px color-colorBlack mt-30px">
      <div>
        <span class="color-colorGray inline-block w-84px text-end">{{ t('loanAudit.sub1') }}</span
        ><span class="ml-20px"
          >{{ props.allData?.waitSettPayment || '-' }}{{ props.allData?.currencyCode }}</span
        >
      </div>
      <div class="mt-20px">
        <span class="color-colorGray inline-block w-84px text-end">{{ t('loanAudit.sub3') }}</span
        ><span class="ml-20px"
          >{{ props.allData?.settAmount || '-' }}{{ props.allData?.currencyCode }}</span
        >
      </div>
      <div class="mt-20px">
        <span class="color-colorGray inline-block w-84px text-end">{{ t('accountPage.sub8') }}</span
        ><span class="ml-20px"
          >{{ props.allData?.predictIncomeAmount || '-' }}{{ props.allData?.currencyCode }}</span
        >
      </div>
      <div class="mt-20px">
        <span class="color-colorGray inline-block w-84px text-end">{{ t('accountPage.sub9') }}</span
        ><span class="ml-20px">{{ props.allData?.exchangeRate || '-' }}%</span>
      </div>
      <div class="mt-20px">
        <span class="color-colorGray inline-block w-84px text-end">{{
          t('accountPage.result3')
        }}</span
        ><span class="ml-20px"
          >{{ props.allData?.serviceFee || '-' }}{{ props.allData?.currencyCode }}</span
        >
      </div>
      <div class="mt-20px">
        <span class="color-colorGray inline-block w-84px text-end">{{ t('loanAudit.sub5') }}</span>
        <span class="ml-20px">{{ period || '-' }}{{ t('aftersalesList.day') }}</span>
      </div>
      <div class="mt-20px">
        <span class="color-colorGray inline-block w-84px text-end">{{ t('loanAudit.sub6') }}</span>
        <span class="ml-20px"
          >{{ props.interestRate * 100 || '-' }}{{ props.allData?.currencyCode }}</span
        >
      </div>
    </div>
  </ContentWrap>
</template>
<script lang="tsx" setup>
import { ContentWrap } from '@/components/ContentWrap/index.ts'
import { useI18n } from '@/hooks/web/useI18n'
import { watch } from 'fs'
import { computed } from 'vue'
import { PropType } from 'vue'
import { string } from 'vue-types'
const { t } = useI18n()

const props = defineProps({
  allData: {
    type: Object as PropType<any>,
    default: () => null
  },
  interestRate: {
    type: Number,
    default: 0
  },
  period: {
    type: String,
    default: ''
  }
})
</script>
<style lang="less" scoped></style>
