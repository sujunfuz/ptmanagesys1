<template>
  <Dialog v-model="realFieldVisible" :title="t('common.fieldFiltering')">
    <div class="flex justify-between w-100%">
      <div class="w-70%">
        <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">{{
          t('common.attributeSetting') }}</el-checkbox>
        <el-checkbox-group v-model="checkedField" @change="handleCheckedFieldChange">
          <el-checkbox v-for="item in allRes" :disabled="item.mustSelectedColumn" :key="item.id" :label="item.id">{{
            item.asColumnValue }}</el-checkbox>
        </el-checkbox-group>
      </div>
      <div class="w-28% pa-10px box-border border-(1px solid #C7C7C7) border-rd-4px min-w-165px">
        <el-scrollbar height="350px" class="w-100%">
          <!-- <p v-for="item in 20" :key="item" class="scrollbar-demo-item">{{ item }}</p> -->
          <div v-for="(item, index) in rightField" :class="{
            '!bg-#F2F2F2': clickFlag == index
          }" :draggable="index != rightField.length - 1" @dragstart="dragstart(item)" @dragenter="dragenter(item)" @dragend="dragend(item)"
            @dragover="dragover($event)" :key="item.id" @click="clickFlag = index"
            class="pl-15px pr-15px flex-cb font-size-14px color-colorBlack border-rd-4px bg-white w-100% h-40px box-border">
            <span>{{ item.asColumnValue }}</span>
            <Icon v-if="index != rightField.length - 1"  icon="svg-icon:sort" color="var(--el-color-primary)" :size="18" />
          </div>
        </el-scrollbar>
      </div>
    </div>
    <template #footer>
      <ElButton type="primary" @click="sortColumn"> {{ t('project.save') }} </ElButton>
    </template>
  </Dialog>
</template>
<script setup lang="tsx">
import { ref, watch } from 'vue'
import { ElCheckbox, ElCheckboxGroup, ElButton, ElScrollbar, ElMessage } from 'element-plus'
import { Dialog } from '@/components/Dialog'
import { getSortColumnUIApi, sortColumnApi } from '@/api/common'
import { onMounted } from 'vue'
import { Icon } from '@/components/Icon/index'
import Sortable from 'sortablejs'
import { useI18n } from '@/hooks/web/useI18n'
const { t } = useI18n()
const props = defineProps({
  fieldVisible: {
    type: Boolean,
    default: false
  },
  uiUrl: {
    type: String,
    default: ''
  },
  sortUrl: {
    type: String,
    default: ''
  }
})
const emit = defineEmits(['update:fieldVisible'])
const realFieldVisible = ref<any>(false)

watch(
  () => props.fieldVisible,
  (val) => {
    realFieldVisible.value = val
  },
  { immediate: true }
)
watch(
  () => realFieldVisible.value,
  (val) => {
    emit('update:fieldVisible', val)
  },
  { immediate: true }
)
const checkAll = ref(false)
const isIndeterminate = ref(false)
const checkedField = ref<Array<any>>([])
const clickFlag = ref(0)
watch(
  () => checkedField.value.length,
  () => {
    let tempArr: Array<any> = []
    checkedField.value.forEach((item: any) => {
      for (let aitem of allRes.value) {
        if (item == aitem.id) {
          tempArr.push(aitem)
          break
        }
      }
    })
    tempArr.push({ asColumnValue: '', id: 'blank' })

    rightField.value = tempArr
  },
  {
    deep: true
  }
)

const handleCheckAllChange = (val: any) => {
  checkedField.value = val ? allFields : [...mustFields]
  if (checkedField.value.length > 0 && checkedField.value.length != allFields.length) {
    isIndeterminate.value = true
  } else {
    isIndeterminate.value = false
  }
}
const handleCheckedFieldChange = (value: any) => {
  const checkedCount = value.length
  checkAll.value = checkedCount === allFields.length
  isIndeterminate.value = checkedCount > 0 && checkedCount < allFields.length
}

//拖拽
const dragstart = (val) => { }
let intoEle: any = {}
const dragenter = (val) => {
  intoEle = val
}
const dragend = (val) => {
  if (val.id == intoEle.id) {
    return
  }
  let tempArr: Array<any> = []
  if (intoEle.id == 'blank') {
    checkedField.value.forEach((item: any) => {
      if (item != val.id) {
        tempArr.push(item)
      }
    })
    tempArr.push(val.id)
  } else {
    checkedField.value.forEach((item: any) => {
      if (item == intoEle.id) {
        clickFlag.value = tempArr.length
        tempArr.push(val.id)
        tempArr.push(intoEle.id)
      } else if (item != val.id) {
        tempArr.push(item)
      }
    })
  }

  checkedField.value.length = 0
  checkedField.value = [...tempArr]
}
const dragover = (e) => {
  e.preventDefault()
}
//请求
const allRes = ref<Array<any>>([])
let allFields: Array<any> = []
let mustFields: Array<any> = []
const rightField = ref<Array<any>>([]) //右边所排列的list
const getSortColumnUI = async () => {
  const res = await getSortColumnUIApi({
    url: props.uiUrl
  })
  allRes.value = res.data
  allFields = allRes.value.map((item: any) => {
    if (item.selectedIs == 'SELECTED') {
      checkedField.value.push(item.id)
    }
    if (item.mustSelectedColumn) {
      mustFields.push(item.id)
    }
    return item.id
  })
  if (checkedField.value.length == allFields.length) {
    isIndeterminate.value = false
    checkAll.value = true
  } else if (checkedField.value.length > 0) {
    isIndeterminate.value = true
    checkAll.value = false
  } else {
    isIndeterminate.value = false
    checkAll.value = false
  }
}
const sortColumn = async () => {
  let tempArr: Array<any> = []
  checkedField.value.forEach((item: any) => {
    for (let aitem of allRes.value) {
      if (item == aitem.id) {
        tempArr.push({
          ...aitem,
          sort: tempArr.length
        })
        break
      }
    }
  })
  if (tempArr.length == 0) {
    ElMessage.warning(t('common.selectText'))
    return
  }
  const res: any = await sortColumnApi({
    url: props.sortUrl,
    columnList: tempArr
  })
  if (res.code == 200) {
    ElMessage.success(res.msg)
  }
  emit('update:fieldVisible', false)
}
onMounted(() => {
  getSortColumnUI()
})
</script>
<style lang="less" scoped></style>
