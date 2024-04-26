<template>
  <div class="w-95px h-30px relative">
    <div class="w-100% h-100% absolute flex-c justify-end top-0 left-0 z-12">
      <span>{{ options.title }}</span>
      <Icon icon="ep:arrow-down" class="ml-6px" color="#222222" :size="12" />
    </div>
    <div class="w-100% h-100% flex-cb absolute z-14">
      <div>
        <el-checkbox v-model="checkAll" @change="changeCheck" :indeterminate="isIndeterminate" size="large" />
      </div>
      <ElCascader ref="cusCascader" v-model="checkNode" :options="options.children"
        class="!h-100% !w-77% overflow-hidden opacity-0" @expand-change="expandChange"
        :props="{ multiple: true, value: 'id', label: 'title' }" />
    </div>
  </div>
</template>
<script setup lang="tsx">
import { ElCheckbox, ElCascader } from 'element-plus'
import { onMounted } from 'vue'
import { ref, watch } from 'vue'
import { differenceWith, isEqual, cloneDeep } from 'lodash-es'
import { nextTick } from 'vue'
const props = defineProps({
  options: {
    type: Object,
    default: () => { }
  },
  selectData: {
    type: Array || String || Object,
    default: () => []
  }
})
const emit = defineEmits(['update:selectData', 'updateCategory'])
const checkAll = ref(false)
const isIndeterminate = ref(false)
const checkNode = ref<Array<any>>([])
let checkAllNode: Array<any> = []
let updateFlag = false //用于判断监听器是否要生效
const cusCascader = ref()
watch(
  () => checkNode.value,
  (val, oldVal) => {
    // emit('update:selectData', val)
    // if (updateFlag || val.length == oldVal.length) {
    //   // 打包完的需要重新展开不然默认会展开第一个满的
    //   if (oldEle) {
    //     nextTick(() => {
    //       oldEle.forEach((item) => {
    //         let cusEl = document.querySelector(`li[id=${item.id}]`) as HTMLElement
    //         if (cusEl) {
    //           cusEl.click()
    //         }
    //       })
    //     })
    //   }
    //   updateFlag = false
    //   return
    // }
    if (val.length == props.options.allCheckedArr.length) {
      checkAll.value = true
      isIndeterminate.value = false
      emit('updateCategory', props.options.id, true)
    } else if (val.length > 0) {
      checkAll.value = false
      isIndeterminate.value = true
      emit('updateCategory', props.options.id, true)
    } else {
      checkAll.value = false
      isIndeterminate.value = false
      emit('updateCategory', props.options.id, false)
    }

    emit('update:selectData', val)
  }
)

const changeCheck = (val) => {
  isIndeterminate.value = false
  cusCascader.value.togglePopperVisible(true)
  emit('updateCategory', props.options.id, val)
  if(val){
    checkNode.value = cloneDeep(props.options.allCheckedArr)
  } else {
    checkNode.value = []
  }
}
let oldEle: any = null
const expandChange = () => {
  nextTick(() => {
    oldEle = document.querySelectorAll('div[aria-hidden=false] li[aria-expanded=true]')
  })
}
onMounted(() => {
  let selectData = cloneDeep(props.selectData)
  if (selectData.length == props.options.allCheckedArr.length) {
    checkAll.value = true
    emit('updateCategory', props.options.id, true)
  } else if (selectData.length > 0) {
    isIndeterminate.value = true
  }
  checkNode.value = selectData
})
</script>
<style lang="less" scoped>
:deep(.el-cascader__tags) {
  .el-tag__close {
    display: none !important;
  }
}
</style>
