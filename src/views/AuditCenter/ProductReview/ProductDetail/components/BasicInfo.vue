<template>
  <ContentWrap>
    <div class="font-size-20px color-colorBlack">{{ t('Freight.info') }}</div>
    <div class="font-size-14px color-colorBlack mt-30px">
      <div class="flex">
        <span class="color-colorGray inline-block w-105px text-end tracking-1px mr-20px">
          <span class="color-red1">*</span>{{ t('productList.img') }}({{
            props.allData?.descriptionImgAddr.split(',').length
          }}/9)</span
        >
        <UploadImage
          v-if="image.length"
          :limit="image.length"
          :viewImgList="image"
          :onlyView="true"
        />
      </div>
      <div class="mt-20px">
        <span class="color-colorGray inline-block w-105px text-end tracking-1px"
          ><span class="color-red1">*</span>{{ t('productList.name') }}</span
        ><span class="ml-20px">{{ allData?.name }}</span>
      </div>
      <div class="mt-20px">
        <span class="color-colorGray inline-block w-105px text-end tracking-1px"
          ><span class="color-red1">*</span>{{ t('productList.category') }}</span
        ><span class="ml-20px">{{ allData?.categoryName || '-' }}</span>
      </div>
    </div>
  </ContentWrap>
</template>
<script lang="tsx" setup>
import { ContentWrap } from '@/components/ContentWrap/index.ts'
import UploadImage from '@/components/UploadImage/UploadImage.vue'
import { useI18n } from '@/hooks/web/useI18n'
import { watch, ref } from 'vue'
const { t } = useI18n()

const props = defineProps({
  allData: {
    type: Object,
    default: () => {}
  }
})

const image = ref<Array<any>>([])
watch(
  () => props.allData,
  () => {
    let temp = props.allData?.descriptionImgAddr.split(',')
    for (var item in temp) {
      image.value.push({
        url: temp[item],
        name: ''
      })
    }
  }
)
</script>
<style lang="less" scoped></style>
