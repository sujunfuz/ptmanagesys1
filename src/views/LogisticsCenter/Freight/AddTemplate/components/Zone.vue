<template>
  <div class="w-100% mt-30px">
    <div class="flex-c">
      <a-checkbox v-model:checked="checkAll" :indeterminate="isIndeterminate" />
      <span class="ml-6px color-colorBlack">{{ areaData.label }}</span>
    </div>
    <div class="flex-c w-100% flex-wrap mt-20px">
      <SelectArea
        v-for="item in areaData.children"
        :key="item.value"
        :area-data="item"
        :echo-code="echoCode"
        :zone-check-all="checkAll"
        :zone-indeterminate="isIndeterminate"
        :get-flag="getFlag"
        @get-area-data="getZoneAreaData"
        @update-selected-length="updateSelectedLength"
      />
    </div>
  </div>
</template>
<script setup lang="tsx">
import { ref, onMounted, watch } from 'vue'
import SelectArea from './SelectArea.vue'
import { Checkbox as ACheckbox } from 'ant-design-vue'

const props = defineProps({
  areaData: {
    type: Object,
    default: () => {}
  },
  echoCode: {
    type: Array,
    default: () => []
  },
  writeCheckAll: {
    type: Boolean,
    default: false
  },
  getFlag: {
    type: Boolean,
    default: false
  },
  writeIndeterminate: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['updateSelectedLength', 'getAreaData'])
const checkAll = ref(false)
const isIndeterminate = ref(false)
let allLength = 10000
const hadSelectedLength = ref(0)
let emitFlag = 0
//已经全选的区域
watch(
  () => hadSelectedLength.value,
  (val) => {
    if (val == allLength) {
      checkAll.value = true
      isIndeterminate.value = false
      if (emitFlag == 0) {
        emitFlag = 1
        emit('updateSelectedLength', 1)
      }
    } else if (val > 0) {
      checkAll.value = false
      isIndeterminate.value = true
      if (emitFlag == 1) {
        emitFlag = 0
        emit('updateSelectedLength', -1)
      }
    } else {
      checkAll.value = false
      isIndeterminate.value = false
      if (emitFlag == 1) {
        emitFlag = 0
        emit('updateSelectedLength', -1)
      }
    }
  }
)
//顶部全选
watch(
  () => props.writeCheckAll,
  (val) => {
    if (val && !checkAll.value) {
      checkAll.value = true
    } else if (!val && checkAll.value && !props.writeIndeterminate) {
      checkAll.value = false
    }
  }
)

//监听获取数据
let getFlagNum = 0
let zoneCodeVal: Array<any> = []
let zoneStrVal: Array<any> = []
const getZoneAreaData = (codeVal, strVal) => {
  getFlagNum++
  zoneCodeVal = [...zoneCodeVal, ...codeVal]
  zoneStrVal = [...zoneStrVal, ...strVal]
  if (getFlagNum == props.areaData.children.length) {
    emit('getAreaData', [...zoneCodeVal], [...zoneStrVal])
    zoneCodeVal = []
    zoneStrVal = []
    getFlagNum = 0
  }
}

const updateSelectedLength = (val) => {
  hadSelectedLength.value += val
}
onMounted(() => {
  allLength = props.areaData.children.length
})
</script>
