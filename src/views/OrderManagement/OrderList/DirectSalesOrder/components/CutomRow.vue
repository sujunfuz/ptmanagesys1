<template>
  <div
    class="customW font-size-14px flex-b items-stretch color-colorBlack pt-10px pb-10px"
    style="margin: 0 auto"
  >
    <div class="w-74% flex overflow-hidden">
      <el-checkbox v-model="checkAll" @change="changeAll" :indeterminate="isIndeterminate" />
      <img
        class="w-50px h-50px bg-colorGray border-rd-4px ml-15px"
        @click="showFlag = !showFlag"
        :src="affixImgUrl + listItem.spuImage"
        alt=""
      />
      <div class="flex flex-col ml-10px" style="width: calc(100% - 140px)">
        <div class="truncate" @click="showFlag = !showFlag">{{ listItem.spuName }}</div>
        <div v-if="showFlag">
          <div class="color-colorGray mt-15px">{{ t('chooseGoods.choose') }}</div>
          <div class="flex flex-wrap">
            <el-checkbox-group v-model="checkList" @change="changeCheck">
              <ElCheckbox
                v-for="(item, index) in listItem.skus"
                :disabled="item.stock == 0"
                :key="item.skuId"
                :label="index"
                >{{ item.indesexVal }}</ElCheckbox
              >
            </el-checkbox-group>
          </div>
        </div>
      </div>
    </div>
    <div class="w-19%">￥{{ listItem.price }}</div>
    <div class="w-7%">{{ listItem.store }}{{ t('chooseGoods.danwei') }}</div>
  </div>
</template>
<script setup lang="tsx">
import { useI18n } from '@/hooks/web/useI18n'
import { reactive, ref, watch, onMounted } from 'vue'
import { ElButton, ElScrollbar, ElCheckbox, ElPagination, ElCheckboxGroup } from 'element-plus'
const { t } = useI18n()
const affixImgUrl = import.meta.env.VITE_IMG_URL
const props = defineProps({
  listItem: {
    type: Object,
    default: () => {}
  },
  listIndex: {
    type: Number,
    default: 0
  },
  delSpuId: {
    type: String,
    default: ''
  },
  delSkuId: {
    type: String,
    default: ''
  },
  huixianArr: {
    type: Object,
    default: () => [] as Object
  }
})
const emit = defineEmits(['updateHasSelect'])
const checkAll = ref(false)
const isIndeterminate = ref(false)
const showFlag = ref(false)
const checkList = ref<any>([])
let allCheck = []
let oldCheck: any = []
watch(
  () => props.delSkuId,
  (val) => {
    if (props.listItem.spuId != props.delSpuId) {
      return
    }
    let index: any = -1
    for (const item of props.listItem.skus) {
      index++
      if (item.skuId == props.delSkuId) {
        break
      }
    }
    checkList.value = checkList.value.filter((item) => item != index)
  }
)

watch(
  () => props.listItem,
  () => {
    let arr: any = []
    props.listItem.skus.forEach((item, index) => {
      if (item.stock > 0) {
        arr.push(index)
      }
    })
    allCheck = arr
  },
  {
    deep: true,
    immediate: true
  }
)
watch(
  () => checkList.value,
  (newVal, oldVal) => {
    let type: any = ''
    let tempIndex: any = []
    let length = Math.abs(newVal.length - oldVal.length)
    changeCheck()
    if (newVal.length > oldVal.length) {
      type = 'add'
      for (const item of newVal) {
        let flag = true
        for (const aitem of oldVal) {
          if (item == aitem) {
            flag = false
            break
          }
        }
        if (flag) {
          tempIndex.push(item)
          length--
          if (!length) {
            break
          }
        }
      }
    } else if (newVal.length < oldVal.length) {
      type = 'delete'
      for (const item of oldVal) {
        let flag = true
        for (const aitem of newVal) {
          if (item == aitem) {
            flag = false
            break
          }
        }
        if (flag) {
          tempIndex.push(item)
          length--
          if (!length) {
            break
          }
        }
      }
    }
    let tempArr: any = []
    tempIndex.forEach((item) => {
      tempArr.push(props.listItem.skus[item])
    })

    emit('updateHasSelect', type, props.listItem, tempArr)
  }
)
const changeCheck = () => {
  if (checkList.value.length == allCheck.length) {
    checkAll.value = true
    isIndeterminate.value = false
  } else if (checkList.value.length > 0) {
    checkAll.value = false
    isIndeterminate.value = true
  } else {
    checkAll.value = false
    isIndeterminate.value = false
  }
  // checkList.value = [...checkList.value]
  // oldCheck = checkList.value
}

const changeAll = (val) => {
  if (val) {
    isIndeterminate.value = false
    checkList.value = [...allCheck]
  } else {
    isIndeterminate.value = false
    checkList.value = []
  }
  // oldCheck = checkList.value
}

onMounted(() => {
  for (const item of Object.keys(props.huixianArr)) {
    if (item == props.listItem.spuId) {
      let arr: any = []
      for (const aitem of props.huixianArr[item]) {
        let index = -1
        for (const bitem of props.listItem.skus) {
          index++
          if (bitem.skuId == aitem) {
            arr.push(index)
            break
          }
        }
      }
      checkList.value = [...arr]
      break
    }
  }
})
</script>
<style scoped lang="less">
.customW {
  width: calc(100% - 40px);
}
</style>
