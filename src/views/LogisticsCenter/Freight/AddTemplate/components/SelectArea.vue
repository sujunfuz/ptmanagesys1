<template>
  <div class="w-100px h-22px relative mt-20px">
    <div class="absolute flex-c">
      <a-checkbox v-model:checked="checkAll" :indeterminate="isIndeterminate" />
      <span class="ml-6px color-colorBlack">{{ areaData.label }}</span>
      <Icon icon="ep:arrow-down" class="ml-2px" color="#222222" :size="12" />
    </div>
    <Cascader
      v-model:value="arr"
      class="!h-22px !w-100% opacity-0"
      multiple
      max-tag-count="responsive"
      :options="areaData.children"
      placeholder="Please select"
    />
  </div>
</template>
<script setup lang="tsx">
import { ref, onMounted, watch } from 'vue'
import { Cascader, Checkbox as ACheckbox } from 'ant-design-vue'
import { Icon } from '@/components/Icon'

const props = defineProps({
  areaData: {
    type: Object,
    default: () => {}
  },
  echoCode: {
    type: Array<Array<any>>,
    default: () => []
  },
  zoneCheckAll: {
    type: Boolean,
    default: false
  },
  getFlag: {
    type: Boolean,
    default: false
  },
  zoneIndeterminate:{
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['updateSelectedLength', 'getAreaData'])

const checkAll = ref(false)
const isIndeterminate = ref(false)
const arr = ref<Array<any>>([])
let allChecked: Array<any> = []
let arrChinese = ''
let arrCode: Array<any> = []
const getArrChinese = () => {
  if (checkAll.value) {
    arrChinese = props.areaData.label
    arrCode = [[props.areaData.value]]
    return
  }

  let temp: Array<any> = []
  let tempCode: Array<any> = []
  for (const item of arr.value) {
    let str = props.areaData.label
    let aTempCode = [props.areaData.value]
    for (const aitem of props.areaData.children) {
      if (item[0] == aitem.value) {
        str += aitem.label
        aTempCode.push(aitem.value)
        if (item.length == 1) {
          temp.push(str)
          tempCode.push(aTempCode)
        } else {
          for (const bitem of aitem.children) {
            if (item[1] == bitem.value) {
              str += bitem.label
              aTempCode.push(bitem.value)
              temp.push(str)
              tempCode.push(aTempCode)
              break
            }
          }
        }
        break
      }
    }
  }
  arrChinese = temp + ''
  arrCode = tempCode
}
let emitFlag = 0
let arrFlag = false
watch(
  () => arr.value,
  (val) => {
    let realFlag = true
    if (val.length == allChecked.length) {
      for (const item of val) {
        let flag = true
        for (const aitem of allChecked) {
          if (aitem + '' == item + '') {
            flag = false
            break
          }
        }
        if (flag) {
          realFlag = false
          break
        }
      }
    } else {
      realFlag = false
    }
    if (realFlag && val.length > 0) {
      if (!checkAll.value) {
        arrFlag = true
        checkAll.value = true
      }
      isIndeterminate.value = false
      if (emitFlag == 0) {
        emitFlag = 1
        emit('updateSelectedLength', 1)
      }
    } else if (val.length > 0) {
      if (checkAll.value) {
        arrFlag = true
        checkAll.value = false
      }
      isIndeterminate.value = true
      if (emitFlag == 1) {
        emitFlag = 0

        emit('updateSelectedLength', -1)
      }
    } else {
      if (checkAll.value) {
        arrFlag = true
        checkAll.value = false
      }

      isIndeterminate.value = false
      if (emitFlag == 1) {
        emitFlag = 0
        emit('updateSelectedLength', -1)
      }
    }
    getArrChinese()
  },
  {
    immediate: true
  }
)
watch(
  () => checkAll.value,
  (val) => {
    if (val) {
      arr.value = [...allChecked]
    } else if (!arrFlag) {
      arr.value = []
    }
    arrFlag = false
  },
  {
    immediate: true
  }
)
watch(
  () => props.zoneCheckAll,
  (val) => {
    if (val && !checkAll.value) {
      arr.value = [...allChecked]
    } else if (!val && checkAll.value && !props.zoneIndeterminate) {
      arr.value = []
    }
  }
)
watch(
  () => props.getFlag,
  () => {
    // console.log(arrChinese, '我是什么东西')
    let strParam = arrChinese ? [arrChinese] : []
    emit('getAreaData', arrCode, strParam)
  }
)
onMounted(() => {
  props.areaData.children.forEach((item: any) => {
    allChecked.push([item.value])
  })
  if (props.echoCode.length > 0) {
    for (let i = 0; i < props.echoCode.length; i++) {
      if (props.echoCode[i][0] == props.areaData.value) {
        if (props.echoCode[i].length == 1) {
          arr.value = [...allChecked]
          break
        } else {
          let tempArr: Array<any> = [...props.echoCode[i]]
          tempArr.shift()
          arr.value = [...arr.value, tempArr]
        }
      }
    }
  }
})
</script>
