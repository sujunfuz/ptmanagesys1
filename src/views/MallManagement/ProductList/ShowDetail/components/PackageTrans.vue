<template>
  <ContentWrap>
    <div class="font-size-20px color-colorBlack">{{ t('productList.sub') }}</div>
    <div class="flex flex-wrap w-80% font-size-14px color-colorBlack">
      <div class="mt-20px flex-b">
        <span class="min-w-100px inline-block customW text-right">{{
          t('productList.weight')
        }}</span>
        <span class="inline-block customW ml-20px">{{ allData?.packageWeight || '-' }}</span>
      </div>
      <div class="mt-20px flex-b">
        <span class="min-w-100px inline-block customW text-right">{{ t('productList.size') }}</span>
        <span class="inline-block customW ml-20px">{{
          allData?.packageSize != ',,' ? size + 'cm' : '-'
        }}</span>
      </div>
      <div class="mt-20px flex-b">
        <span class="min-w-100px inline-block customW text-right">{{ t('productList.day') }}</span>
        <span class="inline-block customW ml-20px">{{ allData?.deliverTime || '-' }}</span>
      </div>
      <div class="mt-20px flex-b">
        <span class="min-w-100px inline-block customW text-right">{{
          t('productList.freight')
        }}</span>
        <span
          class="inline-block customW ml-20px"
          v-if="allData?.freightType == 'UNIFICATION_PRICE'"
          >{{ t('Freight.money1') + '(' + (allData?.freightAmount || '-') + ')' }}</span
        >
        <span class="inline-block customW ml-20px" v-if="allData?.freightType == 'USE_TEMPLATE'">{{
          t('Freight.name1') + '(' + (allData?.freightTemplate?.name || '-') + ')'
        }}</span>
        <span class="ml-20px" v-else>-</span>
      </div>
      <div class="mt-20px flex-b">
        <span class="min-w-100px inline-block customW text-right">{{ t('OrderRule.title3') }}</span>
        <span class="inline-block customW ml-20px">{{ allData?.inventoryWarning || '-' }}</span>
      </div>
      <div class="mt-20px flex-b">
        <span class="min-w-100px inline-block customW text-right">{{ t('Freight.way') }}</span>
        <span class="inline-block customW ml-20px">{{ allData?.transportTypeStr || '-' }}</span>
      </div>
      <div class="mt-20px flex-b">
        <span class="min-w-100px inline-block customW text-right">{{
          t('productList.source')
        }}</span>
        <span class="inline-block customW ml-20px">{{ allData?.sourceTypeStr || '-' }}</span>
      </div>
    </div>
  </ContentWrap>
</template>
<script setup lang="tsx">
import { ContentWrap } from '@/components/ContentWrap/index.ts'
import { useI18n } from '@/hooks/web/useI18n'
const { t } = useI18n()
import { watch, ref } from 'vue'

const props = defineProps({
  allData: {
    type: Object,
    default: () => {}
  }
})

const size = ref('')
watch(
  () => props.allData,
  () => {
    size.value = props.allData?.packageSize.toString().replace(/,/g, 'cm*')
  }
)
</script>
<style lang="less" scoped>
.customW {
  width: calc(50% - 10px);
}
</style>
