<template>
  <div class="w-100px h-22px relative">
    <div class="absolute flex-c">
      <a-checkbox v-model:checked="checkAll" :indeterminate="isIndeterminate" />
      <span class="ml-6px color-colorBlack">{{ t('productList.block1') }}</span>
      <Icon icon="ep:arrow-down" class="ml-2px" color="#222222" :size="12" />
    </div>
  </div>
  <Zone
    v-for="item in allAreaData"
    :key="item.value"
    @update-selected-length="updateSelectedLength"
    @get-area-data="getAreaData"
    :area-data="item"
    :echo-code="echoCode"
    :write-indeterminate="isIndeterminate"
    :write-check-all="checkAll"
    :get-flag="getFlag"
  />
</template>
<script setup lang="tsx">
import { onMounted, watch } from 'vue'
import Zone from './Zone.vue'
import { ref } from 'vue'
import { Checkbox as ACheckbox } from 'ant-design-vue'
import { ElMessage } from 'element-plus'
import { useI18n } from '@/hooks/web/useI18n'
const { t } = useI18n()
const props = defineProps({
  openType: {
    type: String,
    default: ''
  },
  echoCode: {
    type: Array,
    default: () => []
  },
  getFlag: {
    type: Boolean,
    default: false
  },
  areaData: {
    type: Array,
    default: () => []
  },
  allowBlank: {
    type: Boolean,
    default: () => false
  }
})
const emit = defineEmits(['modifyColumn'])
const checkAll = ref(false)
const isIndeterminate = ref(false)
const allAreaData = ref()
let allLength = 0
const hadSelectedLength = ref(0)
watch(
  () => hadSelectedLength.value,
  (val) => {
    if (val == allLength) {
      checkAll.value = true
      isIndeterminate.value = false
    } else if (val > 0) {
      checkAll.value = false
      isIndeterminate.value = true
    } else {
      checkAll.value = false
      isIndeterminate.value = false
    }
  }
)
const updateSelectedLength = (val) => {
  hadSelectedLength.value += val
}
let getFlagNum = 0
let writeCodeVal: Array<any> = []
let writeStrVal: Array<any> = []
const getAreaData = (codeVal, strVal) => {
  getFlagNum++
  writeCodeVal = [...writeCodeVal, ...codeVal]
  writeStrVal = [...writeStrVal, ...strVal]
  if (getFlagNum == allAreaData.value.length) {
    getFlagNum = 0
    if (writeCodeVal.length == 0 && !props.allowBlank) {
      ElMessage.warning(t('image.sub3'))
    } else {
      emit('modifyColumn', [...writeCodeVal], [...writeStrVal])
    }
    // console.log(writeCodeVal)
    // console.log(writeStrVal + '')
    writeCodeVal = []
    writeStrVal = []
  }
}
onMounted(() => {
  allAreaData.value = props.areaData
  allLength = allAreaData.value.length
})
</script>
<style>
.ant-select-dropdown {
  z-index: 2000000 !important;
}
</style>
