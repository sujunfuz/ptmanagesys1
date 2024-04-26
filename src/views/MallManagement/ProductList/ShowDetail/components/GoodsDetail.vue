<template>
  <ContentWrap>
    <div class="font-size-20px color-colorBlack">{{ t('productList.detail') }}</div>
    <div
      v-if="allData?.spuDetail.goodsDetail"
      v-html="allData?.spuDetail.goodsDetail"
      class="log-text-class"
    ></div>
    <Empty v-else />
  </ContentWrap>
</template>
<script setup lang="tsx">
import { ContentWrap } from '@/components/ContentWrap/index.ts'
import { useI18n } from '@/hooks/web/useI18n'
import Empty from '@/components/customComponents/Empty/index.vue'
import { watch, ref } from 'vue'
const { t } = useI18n()

defineProps({
  allData: {
    type: Object,
    default: () => {}
  }
})
</script>
<style lang="less" scoped></style>
