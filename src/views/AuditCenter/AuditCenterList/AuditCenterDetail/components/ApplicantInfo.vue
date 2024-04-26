<template>
  <ContentWrap>
    <div class="font-size-20px color-colorBlack">{{ t('register.ApplicantInfo') }}</div>
    <div class="font-size-14px color-colorBlack mt-30px">
      <div>
        <span class="color-colorGray inline-block w-42px text-end">{{ t('auth.name') }}</span
        ><span class="ml-20px">{{ merchantData.applicantName }}</span>
      </div>
      <div class="mt-20px">
        <span class="color-colorGray inline-block w-42px text-end">{{ t('auth.tel') }}</span
        ><span class="ml-20px">{{ merchantData.applicantMobile }}</span>
      </div>
      <div class="mt-20px">
        <span class="color-colorGray inline-block w-42px text-end">{{ t('auth.email') }}</span
        ><span class="ml-20px">{{ merchantData.applicantEmail }}</span>
      </div>
    </div>
  </ContentWrap>
</template>
<script lang="tsx" setup>
import { ContentWrap } from '@/components/ContentWrap/index.ts'
import { useI18n } from '@/hooks/web/useI18n'
const { t } = useI18n()
const props = defineProps({
  merchantData: {
    type: Object,
    default: () => {}
  }
})
</script>
<style lang="less" scoped></style>
