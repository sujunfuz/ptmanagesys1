<template>
  <ContentWrap class="flex-1">
    <div class="flex-b">
      <div class="flex" v-hasPermi="'mer:role:list'">
        <Search :schema="schema" @reset="setSearchParams" @search="setSearchParams" />
      </div>
      <!-- <div class="font-size-21px font-bold">{{ t('companyRole.name2') }}</div> -->
      <div class="mb-10px">
        <!-- <ElButton v-hasPermi="'mer:role:editColumn'" @click="afieldVisible = true" type="primary">{{
          t('common.fieldFiltering') }}</ElButton> -->
        <!-- <ElButton  v-hasPermi="'mer:role:add'" type="primary" class="ml-20px" @click="viewData('', 'add')" :loading="delLoading"
          >+ {{ t('project.add') }}{{ t('companyRole.name1') }}</ElButton
        > -->
        <ElButton v-hasPermi="'mer:role:add'" type="primary" class="ml-20px"
          @click="push('/company/roles/createstaffrole?type=add')" :loading="delLoading">+ {{ t('project.add') }}{{
            t('companyRole.name1') }}</ElButton>
      </div>
    </div>


    <Table class="mt-20px" v-model:current-page="currentPage" v-model:page-size="pageSize" :columns="tableColumns"
      :data="dataList" :loading="loading" @register="tableRegister" :pagination="{
        total,
        layout: ' ->, total, sizes, prev, pager, next, jumper'
      }" />
  </ContentWrap>
  <Dialog v-if="dialogVisible" :mask-flag="saveLoading" v-model="dialogVisible" :title="dialogTitle" max-height="300px">
    <Write ref="writeRef" @change-action-index="changeActionIndex" :currentRow="currentRow" :allEnum="allEnum"
      :menu-tree-obj="menuTreeObj" :actionType="actionType" :a-menu-tree-enum="menuTreeEnum" />
    <template #footer>
      <ElButton class="w-70px !h-40px" @click="clickLastStep" v-show="actionIndex != 1">{{
        t('common.prevLabel')
      }}</ElButton>
      <ElButton @click="clickNextStep" class="w-70px !h-40px" v-show="actionIndex != 2" type="primary">{{
        t('common.nextLabel') }}</ElButton>
      <ElButton @click="submit" class="w-70px !h-40px" v-show="actionIndex == 2 && actionType != 'view'"
        :loading="saveLoading" type="primary">{{ t('project.confirm') }}</ElButton>
    </template>
  </Dialog>

  <Dialog v-model="fieldVisible" :title="t('project.edit')" width="50%">
    <Search :schema="fieldFindSchema" @search="setFieldSearchParam" :showReset="false" />
    <Table class="mt-20px" v-model:pageSize="fieldPageSize" :columns="fieldColumns" :data="fieldList"
      :loading="fieldLoading" :pagination="{
        total: fieldTotal,
        layout: ' ->, total, sizes, prev, pager, next, jumper',
        pageSize: fieldPageSize,
        currentPage: fieldCurrentPage
      }" />
    <Dialog @close="closeFieldDialog" :mask-flag="saveLoading" v-model="showFieldVisible"
      :title="t('role.allocateField')">
      <Form @register="fieldRegister" :schema="realFieldSchema" :isCol="false" />
      <template #footer>
        <el-button @click="closeFieldDialog">{{ t('exampleDemo.cancel') }}</el-button>
        <ElButton type="primary" :loading="saveLoading" @click="saveRoleMenuColumn">{{ t('project.confirm') }}</ElButton>
      </template>
    </Dialog>
  </Dialog>
  <FieldFilter v-if="afieldVisible" v-model:fieldVisible="afieldVisible" @refresh-page-top="init"
    :ui-url="'/merRole/operatorSortColumnUI'" :sort-url="'/merRole/operatorSortColumn'" />
</template>

<script setup lang="tsx">
import { useIcon } from '@/hooks/web/useIcon'
import { ContentWrap } from '@/components/ContentWrap'
import { useI18n } from '@/hooks/web/useI18n'
import { useForm } from '@/hooks/web/useForm'
import { ref, unref, watch, reactive, onMounted, nextTick } from 'vue'
import { ElButton, ElTree, ElMessage, ElCheckbox } from 'element-plus'
import {
  getListApi,
  deleteApi,
  getTopApi,
  assignMenuUI,
  addApi,
  editApi,
  getRoleMenuListApi,
  getMenuColumnUIApi,
  saveRoleMenuColumnApi
} from '@/api/company/role'
import type { DepartmentUserItem } from '@/api/department/types'
import { useTable } from '@/hooks/web/useTable'
import { Search } from '@/components/Search'
import { Dialog } from '@/components/Dialog'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { SelectOption, FormSchema, Form } from '@/components/Form'
import { dateTimeRange } from '@/utils/time'
import { Table, TableColumn } from '@/components/Table'
import Write from './components/Write.vue'
import { tableStatusStyleTag } from '@/utils/componentUtils'
import { differenceWith, isEqual, cloneDeep } from 'lodash-es'
import generateSchema from '@/utils/schemaUtil'
import FieldFilter from '@/components/customComponents/FieldFilter/index.vue'
import { useRouter } from 'vue-router'
const { t } = useI18n()
const { push } = useRouter()
//字段筛选功能
const fieldFilterVisible = ref(false)

const writeRef = ref<ComponentRef<typeof Write>>()
const afieldVisible = ref(false)

const actionType = ref()
const actionIndex = ref(1)
const saveLoading = ref(false)

const svgTrash = useIcon({ icon: 'ep:delete' })
const { tableRegister, tableState, tableMethods } = useTable({
  fetchDataApi: async () => {
    const { pageSize, currentPage } = tableState
    const res = await getListApi({
      currentPage: unref(currentPage),
      pageSize: unref(pageSize),
      ...unref(searchParams)
    })
    return res.data
  },
  fetchDelApi: async () => {
    const res = await deleteApi(unref(ids))
    return res
  },
  immediate: false
})
const { total, loading, dataList, pageSize, currentPage } = tableState
const { getList, getElTableExpose, delList } = tableMethods

const staticArr = [
  {
    field: 'unStatusStr',
    label: t('companyRole.status'),
    search: {
      hidden: true
    },
    formatter: (data: any) => {
      const status = data.unStatusStr || ''
      return tableStatusStyleTag(status)
    }
  }
]
const actionObj = {
  field: 'action',
  label: t('userDemo.action'),
  fixed: 'right',
  width: 200,
  slots: {
    default: (data: any) => {
      const row = data.row as DepartmentUserItem
      return (
        <>
          <div class="[&>span]:(cursor-pointer m-2) flex flex-wrap colorMain ">
            {/* <span onClick={() => viewData(row, 'view')}>{t('project.view')}</span> */}
            <span v-hasPermi="mer:role:edit" onClick={() => viewData(row, 'edit')}>
              {t('project.edit')}
            </span>
            <span
              v-hasPermi="mer:role:delete"
              class="color-red-500"
              onClick={() => delData(row)}
            >
              {t('role.delete')}
            </span>
            {/* <span
                  v-hasPermi="mer:role:fieldallocate"
                  onClick={() => {
                    fieldVisible.value = true
                    roleId = data.row.id
                    dialogType = 'fieldAllocate'
                    getFieldList()
                  }}
                >
                  {t('menu.fieldConfig')}
                </span> */}
          </div>
        </>
      )
    }
  }
}
onMounted(() => {
  init()
})

const statusEnum = ref()
const allEnum = ref()

const init = async () => {
  const res = await getTopApi()

  let arr: any = generateSchema(res.data.pageColumn, staticArr)
  arr.push(actionObj)
  tableColumns.value = []
  nextTick(() => {
    tableColumns.value = arr
  })
  statusEnum.value = res.data.status
  allEnum.value = res.data
  menuTreeEnum.value = res.data.menuList
  addressMenuTree()
  getList()
}
//创建menuTreeObj
const addressMenuTree = () => {
  let tempObj: any = {}
  let tempMenuTree = cloneDeep(menuTreeEnum.value)
  function recursiveMenuTree(obj, arr) {
    obj.children = {}
    for (const a of arr) {
      obj.children[a.id] = cloneDeep(a)
      delete obj.children[a.id].children
      if (a.children && a.children.length > 0) {
        obj.children[a.id].length = a.children.length
        obj.children[a.id].curLength = 0
        recursiveMenuTree(obj.children[a.id], a.children)
      }
    }
  }
  // tempObj.length = tempMenuTree.length
  // temp
  for (const a of tempMenuTree) {
    tempObj[a.id] = cloneDeep(a)
    delete tempObj[a.id].children
    if (a.children && a.children.length > 0) {
      tempObj[a.id].length = a.children.length
      tempObj[a.id].curLength = 0
      recursiveMenuTree(tempObj[a.id], a.children)
    }
  }
  menuTreeObj.value = tempObj
}

const tableColumns = ref<TableColumn[]>([])

const crudSchemas = reactive<CrudSchema[]>([
  {
    field: 'roleName',
    label: t('companyRole.name'),
    search: {
      hidden: true
    }
  },
  {
    field: 'remark',
    label: t('companyRole.remark'),
    search: {
      hidden: true
    }
  },
  {
    field: 'unStatus',
    label: t('companyRole.status'),
    search: {
      hidden: true
    },
    formatter: (data: any) => {
      const status = data.unStatusStr || ''
      return tableStatusStyleTag(status)
    }
  },
  {
    field: 'id',
    label: t('companyRole.id'),
    search: {
      hidden: true
    }
  },
  {
    field: 'relateCount',
    label: t('companyRole.operate'),
    search: {
      hidden: true
    }
  },
  {
    field: 'createTimeStr',
    label: t('companyRole.time'),
    search: {
      hidden: true
    }
  },
  {
    field: 'action',
    label: t('userDemo.action'),
    fixed: 'right',
    width: 200,
    form: {
      hidden: true
    },
    detail: {
      hidden: true
    },
    search: {
      hidden: true
    },
    table: {
      slots: {
        default: (data: any) => {
          const row = data.row as DepartmentUserItem
          return (
            <>
              <div class="[&>span]:(cursor-pointer m-2) flex flex-wrap colorMain ">
                {/* <span onClick={() => viewData(row, 'view')}>{t('project.view')}</span> */}
                <span v-hasPermi="mer:role:edit" onClick={() => viewData(row, 'edit')}>
                  {t('project.edit')}
                </span>
                <span
                  v-hasPermi="mer:role:delete"
                  class="color-red-500"
                  onClick={() => delData(row)}
                >
                  {t('role.delete')}
                </span>
                {/* <span
                  v-hasPermi="mer:role:fieldallocate"
                  onClick={() => {
                    fieldVisible.value = true
                    roleId = data.row.id
                    dialogType = 'fieldAllocate'
                    getFieldList()
                  }}
                >
                  {t('menu.fieldConfig')}
                </span> */}
              </div>
            </>
          )
        }
      }
    }
  }
])

// 字段分配弹窗
const fieldVisible = ref(false)
const fieldFindSchema = reactive<FormSchema[]>([
  {
    field: 'menuName',
    label: t('menu.menuName'),
    component: 'Input',
    componentProps: {
      placeholder: t('exampleDemo.search') + t('role.menuName')
    }
  }
])
const fieldSearchParam = ref({
  menuName: ''
})
const setFieldSearchParam = (data: any) => {
  data.menuName ? (fieldSearchParam.value = data) : (fieldSearchParam.value.menuName = '')
  fieldCurrentPage.value == 1 ? getFieldList() : (fieldCurrentPage.value = 1)
  // getFieldList()
}
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
    align: 'center',
    width: '100px',
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
let tempTotalColumn = []
const getMenuColumnUI = async (menuId: string) => {
  const res = await getMenuColumnUIApi({
    menuId,
    roleId
  })
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
  showFieldVisible.value = true
  allFieldUI = res.data.totalColumn
  const { checkColumn, totalColumn } = res.data
  tempTotalColumn = totalColumn
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
    roleName: res.data.roleName,
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

let dialogType = '' //保留打开的dialog类型
let roleId = '' //保留角色id

//字段分配表格
const { tableState: fieldState, tableMethods: fieldMethods } = useTable({
  fetchDataApi: async () => {
    if (!roleId) {
      return {
        list: [],
        total: 0
      }
    }
    const res = await getRoleMenuListApi({
      pageSize: fieldPageSize.value,
      currentPage: fieldCurrentPage.value,
      roleId: roleId,
      menuName: fieldSearchParam.value.menuName
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
    field: 'roleName',
    label: t('role.operator'),
    component: 'Input',
    componentProps: {
      readonly: true
    }
  },
  {
    field: 'menuName',
    label: t('role.menuName'),
    component: 'Input',
    componentProps: {
      readonly: true
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
const saveRoleMenuColumn = async () => {
  saveLoading.value = true
  await fieldFormMethods.getFormData().then(async (res) => {
    let tempArr: Array<any> = []
    tempTotalColumn.forEach((item: any) => {
      if (res.fieldList.indexOf(item.id) != -1) {
        tempArr.push(item)
      }
    })
    const ares = await saveRoleMenuColumnApi({
      menuId,
      roleId,
      columList: JSON.stringify(tempArr)
    })
    if (ares.code == 200) {
      ElMessage({
        showClose: true,
        message: ares.msg,
        type: 'success'
      })
      showFieldVisible.value = false
    }
    saveLoading.value = false
  })
}
const closeFieldDialog = () => {
  isChecked.value = false
  isIndeterminate.value = false
  showFieldVisible.value = false
}

const dialogVisible = ref(false)
const dialogTitle = ref('')

//递归获取选中的options
function getSelect(arr: any, menuList: any) {
  let allArr: any = []
  function RcursiveList(obj: any, tempArr: any) {
    if (obj.children && obj.children.length > 0) {
      tempArr.push(obj.id)
      if (obj.children[0].id.indexOf('-all') == -1) {
        obj.children.unshift({
          id: tempArr.join('-') + '-all',
          title: t('project.all')
        })
      }
      if (arr.indexOf(obj.id) != -1) {
        allArr.push([...tempArr])
      }
      obj.children.forEach((item: any) => {
        RcursiveList(item, [...tempArr])
      })
    } else {
      if (arr.indexOf(obj.id) != -1) {
        tempArr.push(obj.id)
        allArr.push([...tempArr])
      }
    }
  }
  menuList.forEach((item: any) => {
    let tempArr = []
    RcursiveList(item, tempArr)
  })
  return allArr
}
// function getSelect(arr: any, menuList: any) {
//   let allArr: Array<any> = []
//   function RcursiveList(obj: any, tempArr: any) {
//     if (obj.children && obj.children.length > 0) {
//       tempArr.push(obj.id)
//       obj.children.forEach((item: any) => {
//         RcursiveList(item, [...tempArr])
//       })
//     } else {
//       if (arr.indexOf(obj.id) != -1) {
//         tempArr.push(obj.id)
//         allArr.push(tempArr)
//       }
//     }
//   }
//   menuList.forEach((item: any) => {
//     let tempArr = []
//     RcursiveList(item, tempArr)
//   })
//   return allArr
// }

const menuTreeEnum = ref()
const menuTreeObj = ref()
const viewData = async (row: any, type: String) => {
  switch (type) {
    case 'add':
      actionIndex.value = 1
      dialogTitle.value = t('project.add') + t('companyRole.name1')
      currentRow.value = {}
      getSelect([], menuTreeEnum.value)
      break

    case 'edit':
      push('/company/roles/editstaffrole?type=edit&&id=' + row.id)
      return
      actionIndex.value = 1
      const res = await assignMenuUI({ id: row.id })
      if (res.code == 200) {
        let allArr = getSelect(res.data.selfMenuIds, menuTreeEnum.value)
        let tempArr: Array<any> = []
        for (let i = 0; i < menuTreeEnum.value.length; i++) {
          tempArr[i] = []
          for (let j = 0; j < allArr.length; j++) {
            if (menuTreeEnum.value[i].id == allArr[j][0]) {
              let aTempArr = allArr[j]
              if (aTempArr.length > 1) {
                aTempArr.shift()
              }
              tempArr[i].push(aTempArr)
            }
          }
        }
        currentRow.value = { menuIds: tempArr, ...row }
      }
      dialogTitle.value = t('project.edit') + t('companyRole.name1')
      break
    case 'view':
      actionIndex.value = 1
      const res1 = await assignMenuUI({ id: row.id })
      if (res1.code == 200) {
        let allArr = getSelect(res1.data.selfMenuIds, menuTreeEnum.value)
        let tempArr: Array<any> = []
        for (let i = 0; i < menuTreeEnum.value.length; i++) {
          tempArr[i] = []
          for (let j = 0; j < allArr.length; j++) {
            if (menuTreeEnum.value[i].id == allArr[j][0]) {
              let aTempArr = allArr[j]
              if (aTempArr.length > 1) {
                aTempArr.shift()
              }
              tempArr[i].push(aTempArr)
            }
          }
        }

        currentRow.value = { menuIds: tempArr, ...row }
      }
      dialogTitle.value = t('project.view') + t('companyRole.name1')
      break
  }
  actionType.value = type
  dialogVisible.value = true
}

const { allSchemas } = useCrudSchemas(crudSchemas)

const schema = reactive<FormSchema[]>([
  {
    field: 'roleName',
    label: t('companyRole.name'),
    component: 'Input',
    componentProps: {
      slots: {
        // prepend: () => <div>{t('companyRole.name')}</div>
        // append: () => <Icon icon="ep:share" />
      }
    }
  },
  {
    field: 'unStatus',
    label: t('companyRole.status'),
    component: 'Select',
    componentProps: {
      options: statusEnum
      // slots: {
      //   prefix: () => <div>{t('companyRole.status')}</div>
      // }
    }
  }
])

const searchParams = ref<any>({})
const setSearchParams = (params: any) => {
  currentPage.value = 1
  searchParams.value = params
  getList()
}

const treeEl = ref<typeof ElTree>()

const currentDepartment = ref('')
watch(
  () => currentDepartment.value,
  (val) => {
    unref(treeEl)!.filter(val)
  }
)

const currentRow = ref<any>()

const delLoading = ref(false)
const ids = ref<string[]>([])

const delData = async (row?: DepartmentUserItem) => {
  const elTableExpose = await getElTableExpose()
  ids.value = row
    ? [row.id]
    : elTableExpose?.getSelectionRows().map((v: DepartmentUserItem) => v.id) || []
  delLoading.value = true
  await delList(unref(ids).length).finally(() => {
    delLoading.value = false
  })
}

const clickNextStep = async () => {
  await writeRef.value?.nextStep()
}
const changeActionIndex = (val) => {
  actionIndex.value += val
}
const clickLastStep = async () => {
  actionIndex.value -= 1
  await writeRef.value?.lastStep()
}

const submit = async () => {
  saveLoading.value = true
  const write = unref(writeRef)
  const formData = await write?.submit()
  if (formData) {
    if (actionType.value == 'add') {
      const res = await addApi(formData)
      if (res.code == 200) {
        ElMessage.success(res.msg)
        getList()
      }
    }
    if (actionType.value == 'edit') {
      const res = await editApi(formData)
      if (res.code == 200) {
        ElMessage.success(res.msg)
        getList()
      }
    }
    dialogVisible.value = false
  }
  saveLoading.value = false
}
</script>
