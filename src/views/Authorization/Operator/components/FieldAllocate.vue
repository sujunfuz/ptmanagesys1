<template>
  <!-- <Search :schema="fieldFindSchema" :showReset="false" @search="setFieldSearchParam" /> -->
  <div class="flex mb-20px">
    <div class="font-bold">{{ t('role.roleName') }}</div>
    <div class="ml-10px font-bold">{{ currentRoleName }}</div>
  </div>
  <Table
    v-model:pageSize="fieldPageSize"
    :columns="fieldColumns"
    :data="fieldList"
    :loading="fieldLoading"
  />
  <!--     :pagination="{
      total: fieldTotal,
      layout: ' ->, total, sizes, prev, pager, next, jumper',
      pageSize: fieldPageSize,
      currentPage: fieldCurrentPage
    }" -->
  <Dialog @close="closeFieldDialog" v-model="showFieldVisible" :title="t('role.allocateField')">
    <Form @register="fieldRegister" :schema="realFieldSchema" :isCol="false" />
    <template #footer>
      <el-button @click="closeFieldDialog">{{ t('exampleDemo.cancel') }}</el-button>
      <ElButton type="primary" @click="saveOperatorMenuColumn">{{ t('project.confirm') }}</ElButton>
    </template>
  </Dialog>
</template>
<script lang="tsx" setup>
import { reactive, ref } from 'vue'
import { useTable } from '@/hooks/web/useTable'
import { useI18n } from '@/hooks/web/useI18n'
import { Table, TableColumn } from '@/components/Table'
import { ElButton, ElCheckbox, ElMessage, ElMessageBox } from 'element-plus'
import { Search } from '@/components/Search'
import { FormSchema, Form } from '@/components/Form'
import { Dialog } from '@/components/Dialog'
import { useForm } from '@/hooks/web/useForm'
import {
  getOperatorMenuListApi,
  saveOperatorMenuColumnApi,
  getOperatorMenuColumnUIApi
} from '@/api/operator/index'
const { t } = useI18n()
const props = defineProps({
  operatorId: {
    type: String,
    default: ''
  },
  currentRoleName: {
    type: String,
    default: ''
  }
})
// console.log(props.operatorId, '我是什么id')
// 字段分配弹窗
// const fieldVisible = ref(false)
// const fieldFindSchema = reactive<FormSchema[]>([
//   {
//     field: 'menuName',
//     label: t('menu.menuName'),
//     component: 'Input',
//     componentProps: {
//       placeholder: t('exampleDemo.search') + t('role.menuName')
//     }
//   }
// ])
// const fieldSearchParam = ref({
//   menuName: ''
// })
// const setFieldSearchParam = (data: any) => {
//   data.menuName ? (fieldSearchParam.value = data) : (fieldSearchParam.value.menuName = '')
//   fieldCurrentPage.value == 1 ? getFieldList() : (fieldCurrentPage.value = 1)
// }
let menuId = ''
const fieldColumns = reactive<TableColumn[]>([
  {
    field: 'title',
    label: t('menu.menuName'),
    headerAlign: 'center',
    align: 'center'
  },
  {
    field: 'component',
    label: t('common.address'),
    headerAlign: 'center',
    align: 'center'
  },
  {
    field: 'operate',
    label: t('exampleDemo.operate'),
    headerAlign: 'center',
    width: '100px',
    align: 'center',
    slots: {
      default: (data) => {
        return (
          <>
            <span
              onClick={() => {
                menuId = data.row.id
                getMenuColumnUI(data.row.id)
              }}
              class="colorMain cursor-pointer"
            >
              {t('role.allocateField')}
            </span>
          </>
        )
      }
    }
  }
])
//点击字段分配，获取字段分配静态数据
let allFieldUI = []
let tempTotalColumn: Array<any> = []
const getMenuColumnUI = async (menuId: string) => {
  const res = await getOperatorMenuColumnUIApi({
    menuId,
    operatorId: props.operatorId
  })
  const { checkColumn, totalColumn } = res.data
  tempTotalColumn = [...totalColumn]
  res.data.totalColumn.forEach((item: any) => {
    if (item.mustSelectedColumn) {
      item.disabled = true
      let flag = true
      for (let aitem of res.data.checkColumn) {
        if (aitem == item.id) {
          flag = false
        }
      }
      flag && res.data.checkColumn.push(item.id)
    }
  })
  console.log(res.data.totalColumn, '我是总体')
  showFieldVisible.value = true
  allFieldUI = res.data.totalColumn
  if (checkColumn.length == totalColumn.length) {
    isIndeterminate.value = false
    isChecked.value = true
  } else if (checkColumn.length > 0) {
    isIndeterminate.value = true
    isChecked.value = false
  } else {
    isChecked.value = false
    isIndeterminate.value = false
  }
  await fieldFormMethods.setValues({
    operatorName: res.data.operatorName,
    menuName: res.data.menuName,
    fieldList: res.data.checkColumn
  })

  await fieldFormMethods.setSchema([
    {
      field: 'fieldList',
      path: 'componentProps.options',
      value: res.data.totalColumn
    }
  ])
}
//字段分配表格
const { tableState: fieldState, tableMethods: fieldMethods } = useTable({
  fetchDataApi: async () => {
    if (!props.operatorId) {
      return {
        list: [],
        total: 0
      }
    }
    const res = await getOperatorMenuListApi({
      pageSize: 10000,
      currentPage: fieldCurrentPage.value,
      operatorId: props.operatorId
      // menuName: fieldSearchParam.value.menuName
    })
    const { total, list } = res.data
    return {
      list: list,
      total: total
    }
  }
})

const {
  dataList: fieldList,
  loading: fieldLoading,
  total: fieldTotal,
  pageSize: fieldPageSize,
  currentPage: fieldCurrentPage
} = fieldState
const { getList: getFieldList } = fieldMethods
// 字段分配选择弹窗
const { formRegister: fieldRegister, formMethods: fieldFormMethods } = useForm()
const showFieldVisible = ref(false)
const isIndeterminate = ref(false)
const isChecked = ref(false)
const allRef = ref()

const realFieldSchema = reactive<FormSchema[]>([
  {
    field: 'operatorName',
    label: t('role.operator'),
    component: 'Input',
    componentProps: {
      disabled: true
    }
  },
  {
    field: 'menuName',
    label: t('role.menuName'),
    component: 'Input',
    componentProps: {
      disabled: true
    }
  },
  {
    field: 'selectAll',
    label: t('role.fieldSelect'),
    // component: 'CheckboxButton',
    formItemProps: {
      slots: {
        default: () => {
          const selectAllMethods = (e: boolean) => {
            isIndeterminate.value = false
            if (e) {
              isChecked.value = true
              let temp: Array<string> = []
              allFieldUI.forEach((item: any) => {
                temp.push(item.id)
              })
              fieldFormMethods.setValues({
                fieldList: temp
              })
            } else {
              isChecked.value = false
              let temp: Array<string> = []
              allFieldUI.forEach((item: any) => {
                if (item.mustSelectedColumn) {
                  temp.push(item.id)
                }
              })
              if (temp.length == allFieldUI.length) {
                isChecked.value = true
              } else if (temp.length > 0) {
                isIndeterminate.value = true
              }
              fieldFormMethods.setValues({
                fieldList: temp
              })
            }
          }
          return (
            <ElCheckbox
              ref={allRef}
              indeterminate={isIndeterminate.value}
              v-model={isChecked.value}
              onChange={selectAllMethods}
            >
              {t('productcategory.all')}
            </ElCheckbox>
          )
        }
      }
    }
  },
  {
    field: 'fieldList',
    label: ' ',
    component: 'CheckboxGroup',
    componentProps: {
      props: {
        label: 'columnValue',
        value: 'id'
      },
      style: {
        display: 'flex',
        flexWrap: 'wrap'
      },
      on: {
        change: (v: Array<string>) => {
          if (v.length == allFieldUI.length) {
            isIndeterminate.value = false
            isChecked.value = true
          } else if (v.length > 0) {
            isIndeterminate.value = true
            isChecked.value = false
          } else {
            isChecked.value = false
            isIndeterminate.value = false
          }
        }
      }
    }
  }
])
const saveOperatorMenuColumn = async () => {
  await fieldFormMethods.getFormData().then(async (res) => {
    let tempArr: Array<any> = []
    tempTotalColumn.forEach((item: any) => {
      if (res.fieldList.indexOf(item.id) != -1) {
        tempArr.push(item)
      }
    })
    const ares = await saveOperatorMenuColumnApi({
      menuId,
      operatorId: props.operatorId,
      column: JSON.stringify(tempArr)
    })
    if (ares.code == 200) {
      ElMessage({
        showClose: true,
        message: ares.msg,
        type: 'success'
      })
      showFieldVisible.value = false
    }
  })
}
const closeFieldDialog = () => {
  isChecked.value = false
  isIndeterminate.value = false
  showFieldVisible.value = false
}
</script>
<style scoped lang="less"></style>
