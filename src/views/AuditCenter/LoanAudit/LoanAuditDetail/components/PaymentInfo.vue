<template>
  <ContentWrap>
    <div class="font-size-20px color-colorBlack">{{ t('withdrawalAudit.sub20') }}</div>
    <div class="font-size-14px color-colorBlack mt-30px">
      <div>
        <span class="color-colorGray inline-block w-56px text-end">{{
          t('withdrawalAudit.sub10')
        }}</span
        ><span class="ml-20px">{{ allData?.companyName || '-' }}</span>
      </div>
      <div class="mt-20px">
        <span class="color-colorGray inline-block w-56px text-end">{{ t('accountPage.sub1') }}</span
        ><span class="ml-20px">{{ allData?.account || '-' }}</span>
      </div>
      <div class="mt-20px">
        <span class="color-colorGray inline-block w-56px text-end">{{ t('accountPage.sub3') }}</span
        ><span class="ml-20px">{{ allData?.currencyName || '-' }}{{ allData?.currencyCode }}</span>
      </div>
      <div class="mt-20px">
        <span class="color-colorGray inline-block w-56px text-end">{{ t('accountPage.sub4') }}</span
        ><span class="ml-20px">{{ allData?.serviceCharge || '-' }}%</span>
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
