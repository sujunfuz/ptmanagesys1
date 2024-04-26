<template>
  <ContentWrap>
    <div class="font-size-20px color-colorBlack">{{ t('productList.specifications') }}</div>
    <div v-if="attrList.length != 0" class="flex flex-wrap w-100% font-size-14px color-colorBlack">
      <div class="w-100% mt-20px flex-b ml-20px" v-for="(item, index) in attrList" :key="index">
        <span class="inline-block customLW text-right"
          >{{ t('aftersalesList.guige') }}{{ index + 1 }}</span
        >
        <span class="inline-block customLW text-right ml-10px">{{ item.name }}</span>
        <span class="inline-block customRW ml-8px"> ({{ item.value }})</span>
      </div>
    </div>
    <Empty v-else />
  </ContentWrap>
</template>
<script setup lang="tsx">
import { ContentWrap } from '@/components/ContentWrap/index.ts'
import { useI18n } from '@/hooks/web/useI18n'
import { watch, ref } from 'vue'
import Empty from '@/components/customComponents/Empty/index.vue'
const { t } = useI18n()

const props = defineProps({
  allData: {
    type: Object,
    default: () => {}
  }
})

let attrList = ref<Array<any>>([])
watch(
  () => props.allData,
  () => {
    let temp = JSON.parse(props.allData?.spuDetail.specialSpec)
    for (var item in temp) {
      attrList.value.push({
        name: item,
        value: temp[item]
      })
    }

    for (var it in attrList.value) {
      if (attrList.value[it].value instanceof Array) {
        attrList.value[it].value = attrList.value[it].value.join(';  ')
      }
    }
  }
)
</script>
<style lang="less" scoped>
.customLW {
  width: calc(10% - 10px);
}
.customRW {
  width: calc(90% - 10px);
}
</style>
