<template>
  <div>
    <ContentWrap class="h-700px text-center pt-120px flex justify-center">
      <img src="@/assets/imgs/ok.png" />
      <div class="mt-20px font-size-20px">{{ t('accountPage.result1') }}!</div>
      <div class="w-200px">
        <div class="color-#7A7A7A font-size-16px mt-30px flex">
          <div class="w-100px text-right">{{ t('accountPage.result6') }}:</div>
          <span class="ml-15px color-colorBlack">张三风</span></div
        >
        <div class="color-#7A7A7A font-size-16px mt-20px flex">
          <div class="w-100px text-right">{{ t('accountPage.result3') }}:</div
          ><span class="ml-15px color-colorBlack">张三风</span></div
        >
        <div class="color-#7A7A7A font-size-16px mt-20px flex">
          <div class="w-100px text-right"> {{ t('accountPage.result4') }}: </div
          ><span class="ml-15px color-colorBlack">张三风</span></div
        >
        <div class="color-#7A7A7A font-size-16px mt-20px flex">
          <div class="w-100px text-right">{{ t('accountPage.result5') }}:</div
          ><span class="ml-15px color-colorBlack">张三风</span></div
        >
      </div>
      <div class="mt-20px">
        <ElButton type="primary" @click="push('/financialCenter/managementProfile')">
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
const { t } = useI18n()
</script>
