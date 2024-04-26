<template>
  <ContentWrap>
    <div class="font-size-20px color-colorBlack">{{
      t('orderManage.commodity') + t('common.stats')
    }}</div>
    <div v-if="attrList.length != 0" class="flex flex-wrap w-80% font-size-14px color-colorBlack">
      <div class="w-25% mt-20px flex-b" v-for="(item, index) in attrList" :key="index">
        <span class="inline-block customW text-right">{{ item.name }}</span>
        <span class="inline-block customW">{{ item.value }}</span>
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
    let temp = props.allData?.goodsAttrList
    for (var item in temp) {
      attrList.value.push({
        name: temp[item].attrName,
        value: temp[item].attrValue
      })
    }
  }
)
</script>
<style lang="less" scoped>
.customW {
  width: calc(50% - 10px);
}
</style>
