<template>
  <ContentWrap>
    <div class="flex-b">
      <Search
        v-hasPermi="'goods:ecGoodsSaleLimit:list'"
        :schema="schema"
        @reset="setSearchParams"
        @search="setSearchParams"
      />
      <ElButton v-hasPermi="'goods:ecGoodsSaleLimit:add'" type="primary" @click="AddAction">{{
        t('RestrictedSales.addBts')
      }}</ElButton>
    </div>
  </ContentWrap>
  <ContentWrap class="mt-20px flex-1" :isBlock="false">
    <div class="flex-c p-20px">
      <span class="subString">{{ t('project.yisel') }} </span>
      <span class="colorMain">&nbsp;{{ chooseCount }}&nbsp;</span>
      <span class="subString">{{ t('RestrictedSales.Items') }}</span>
      <div
        v-hasPermi="'goods:ecGoodsSaleLimit:delete'"
        class="aCustomBtn"
        @click="batchDelete"
        :class="chooseCount > 0 ? 'customBtnHover' : ''"
      >
        {{ t('project.delete') }}
      </div>
    </div>
    <Table
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :columns="allSchemas.tableColumns"
      :data="dataList"
      :loading="loading"
      @select="handleSelectionChange"
      @select-all="handleSelectionAllChange"
      @register="tableRegister"
      :pagination="{
        total,
        layout: ' ->, total, sizes, prev, pager, next, jumper'
      }"
    />
  </ContentWrap>

  <Dialog v-model="dialogVisible" :title="dialogTitle" max-height="250px">
    <Write
      ref="writeRef"
      :currentRow="currentRow"
      :categoryTreeList="categoryTreeList"
      :areaList="areaList"
    />

    <template #footer>
      <ElButton @click="dialogVisible = false">{{ t('project.cancel') }}</ElButton>
      <ElButton type="primary" :loading="saveLoading" @click="save">
        {{ t('project.confirm') }}
      </ElButton>
    </template>
  </Dialog>
</template>

<script setup lang="tsx">
import { ContentWrap } from '@/components/ContentWrap'
import { useI18n } from '@/hooks/web/useI18n'
import { ref, unref, reactive, onMounted } from 'vue'
import { ElButton, ElLink, ElCascader, ElMessage, rowContextKey } from 'element-plus'
import {
  pageTop,
  ecGoodsSaleLimitList,
  addecGoodsSaleLimit,
  editecGoodsSaleLimit,
  getAllArea,
  delecGoodsSaleLimit
} from '@/api/RuleManage/RestrictedSales'
import type { DepartmentUserItem } from '@/api/department/types'
import { useTable } from '@/hooks/web/useTable'
import { Search } from '@/components/Search'
import Write from './components/Write.vue'
import { Dialog } from '@/components/Dialog'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { SelectOption, FormSchema } from '@/components/Form'
import { Table } from '@/components/Table'
import { getTreeApi } from '@/api/mallManagement/productList'

const { t } = useI18n()

onMounted(() => {
  init()
})

const batchDelete = async () => {
  const res = await delecGoodsSaleLimit(chooseIdsList.value)
  if (res.code == 200) {
    ElMessage.success(t('common.operateSuccess'))
    getList()
  }
}

const categoryTreeList = ref()
const areaList = ref()
const addressMenuTree = (obj, len) => {
  if (len == 3) {
    return
  }
  if (obj.children && obj.children.length > 0) {
    for (const a of obj.children) {
      addressMenuTree(a, len + 1)
    }
  } else {
    obj.disabled = true
  }
}
const init = async () => {
  const res = await getTreeApi()
  if (res.code == 200) {
    for (const a of res.data) {
      addressMenuTree(a, 1)
    }
    categoryTreeList.value = res.data
  }
  const res1 = await getAllArea()
  if (res1.code == 200) {
    let tempArr: any = []
    for (const a of res1.data[0].children) {
      for (const b of a.children) {
        tempArr.push(b)
      }
    }
    areaList.value = tempArr
  }
  getList()
}

const { tableRegister, tableState, tableMethods } = useTable({
  fetchDataApi: async () => {
    const { pageSize, currentPage } = tableState
    const res = await ecGoodsSaleLimitList({
      currentPage: unref(currentPage),
      pageSize: unref(pageSize),
      ...unref(searchParams)
    })
    res.data.list.forEach((item) => {
      item.addressNo = JSON.parse(item.addressNo)
    })
    return {
      list: res.data.list,
      total: res.data.total
    }
  },
  fetchDelApi: async () => {
    const res = await delecGoodsSaleLimit(unref(ids))
    return res
  },
  immediate: false
})
const { total, loading, dataList, pageSize, currentPage } = tableState
const { getList, getElTableExpose, delList } = tableMethods

const crudSchemas = reactive<CrudSchema[]>([
  {
    field: 'selection',
    table: {
      type: 'selection'
    }
  },
  // {
  //   field: 'id',
  //   label: t('checkPrice.id'),
  //   search: {
  //     hidden: true
  //   }
  // },
  {
    field: 'index',
    label: t('userDemo.index'),

    search: {
      hidden: true
    },

    table: {
      type: 'index'
    }
  },
  {
    field: 'addressName',
    label: t('RestrictedSales.search1'),
    search: {
      hidden: true
    }
  },
  {
    field: 'categoryName',
    label: t('RestrictedSales.search2'),
    search: {
      hidden: true
    }
  },
  {
    field: 'categoryLevel',
    label: t('RestrictedSales.Categorylevel'),
    search: {
      hidden: true
    }
  },
  {
    field: 'keyWord',
    label: t('RestrictedSales.search3'),
    search: {
      hidden: true
    }
  },
  {
    field: 'reason',
    label: t('RestrictedSales.reason'),
    search: {
      hidden: true
    }
  },
  {
    field: 'action',
    label: t('userDemo.action'),
    table: {
      width: 240,
      fixed: 'right',
      slots: {
        default: (data: any) => {
          const row = data.row as DepartmentUserItem
          return (
            <>
              <div class="[&>span]:(cursor-pointer m-2) flex flex-wrap colorMain ">
                <span v-hasPermi="goods:ecGoodsSaleLimit:edit" onClick={() => action(row, 'edit')}>
                  {' '}
                  {t('project.edit')}{' '}
                </span>
                <span
                  v-hasPermi="goods:ecGoodsSaleLimit:delete"
                  class="color-red-500"
                  onClick={() => delData(row)}
                >
                  {t('role.delete')}
                </span>
              </div>
            </>
          )
        }
      }
    }
  }
])

const { allSchemas } = useCrudSchemas(crudSchemas)

const schema = reactive<FormSchema[]>([
  {
    field: 'addressNo',
    formItemProps: {
      slots: {
        default: (data) => {
          return (
            <>
              <div
                class={[
                  'w-280px',
                  'flex-c',
                  'border-rd-4px',
                  'specialInput',
                  'border-(#dcdfe6 solid 1px )'
                ]}
              >
                <div class="color-#b0b4b7 w-70px text-center ml-10px">
                  {t('RestrictedSales.search1')}
                </div>
                <div style="background-color: #dcdfe6;width: 0.5px;height: 23px;margin-left: 10px;"></div>
                <ElCascader
                  clearable
                  v-model={data.addressNo}
                  options={areaList.value}
                  props={{
                    checkStrictly: true
                  }}
                  show-all-levels={false}
                  class="ml-1px"
                />
              </div>
            </>
          )
        }
      }
    }
  },
  {
    field: 'categoryId',
    formItemProps: {
      slots: {
        default: (data) => {
          return (
            <>
              <div
                class={[
                  'w-280px',
                  'flex-c',
                  'border-rd-4px',
                  'specialInput',
                  'border-(#dcdfe6 solid 1px )'
                ]}
              >
                <div class="color-#b0b4b7 w-70px text-center ml-10px">
                  {t('productcategory.form1')}
                </div>
                <div style="background-color: #dcdfe6;width: 0.5px;height: 23px;margin-left: 10px;"></div>
                <ElCascader
                  clearable
                  v-model={data.categoryId}
                  options={categoryTreeList.value}
                  props={{
                    value: 'id',
                    label: 'categoryName'
                  }}
                  show-all-levels={false}
                  class="ml-1px"
                />
              </div>
            </>
          )
        }
      }
    }
  },
  {
    field: 'keyWord',
    colProps: {
      span: 12
    },
    component: 'Input',
    componentProps: {
      slots: {
        prefix: () => <div>{t('RestrictedSales.search3')}</div>
      }
    }
  }
])

const searchParams = ref({})
const setSearchParams = (params: any) => {
  currentPage.value = 1
  searchParams.value = params
  if (searchParams.value.categoryId) {
    searchParams.value.categoryId =
      searchParams.value.categoryId[searchParams.value.categoryId.length - 1]
  }
  if (searchParams.value.addressNo) {
    searchParams.value.addressNo =
      searchParams.value.addressNo[searchParams.value.addressNo.length - 1]
  }
  getList()
}

// 表格选择
const chooseCount = ref(0)
const chooseIdsList = ref<any>([]) //ids

const handleSelectionChange = (row: any) => {
  chooseCount.value = row.length
  row.forEach((e: any) => {
    chooseIdsList.value.push(e.id)
  })
}

const handleSelectionAllChange = (row: any) => {
  if (!row.length) {
    chooseCount.value = 0
    chooseIdsList.value = []
  } else {
    chooseIdsList.value = []
    row.forEach((e: any) => {
      chooseIdsList.value.push(e.id)
    })
    chooseCount.value = chooseIdsList.value.length
  }
}

const dialogVisible = ref(false)
const dialogTitle = ref('')

const currentRow = ref<any>()
const actionType = ref('')

const AddAction = () => {
  dialogTitle.value = t('project.add') + t('RestrictedSales.name')
  currentRow.value = undefined
  dialogVisible.value = true
  actionType.value = 'add'
}

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

const action = (row: any, type: string) => {
  dialogTitle.value = t('project.edit') + t('RestrictedSales.name')
  if (row.categoryId && !(row.categoryId instanceof Array)) {
    for (const a of categoryTreeList.value) {
      if (a.id == row.categoryId) {
        row.categoryId = [a.id]
        break
      }
      let flag = false
      if (a.children) {
        for (const b of a.children) {
          if (b.id == row.categoryId) {
            row.categoryId = [a.id, b.id]
            flag = true
            break
          }
          if (b.children) {
            for (const c of b.children) {
              if (c.id == row.categoryId) {
                row.categoryId = [a.id, b.id, c.id]
                flag = true
                break
              }
            }
          }
          if (flag) {
            break
          }
        }
      }
      if (flag) {
        break
      }
    }
  }
  currentRow.value = row

  actionType.value = type
  dialogVisible.value = true
}

const writeRef = ref<ComponentRef<typeof Write>>()

const saveLoading = ref(false)

const save = async () => {
  const write = unref(writeRef)
  let formData = await write?.submit()
  formData = { ...formData }

  if (formData) {
    if (formData.categoryId && formData.categoryId.length >= 1) {
      formData.categoryId = formData.categoryId[formData.categoryId.length - 1]
    }
    formData.addressNo = JSON.stringify(formData.addressNo)
    saveLoading.value = true
    let res
    try {
      if (actionType.value == 'add') {
        res = await addecGoodsSaleLimit({ ...formData, status: 'ACTIVE' })
        if (res.code == 200) {
          ElMessage.success(t('common.operateSuccess'))
        }
      } else {
        res = await editecGoodsSaleLimit(formData)
        if (res.code == 200) {
          ElMessage.success(t('common.operateSuccess'))
        }
      }

      if (res) {
        currentPage.value = 1
        getList()
      }
    } catch (error) {
      console.log(error)
    } finally {
      saveLoading.value = false
      dialogVisible.value = false
    }
  }
}
</script>

<style lang="less" scoped>
.subString {
  color: #747474;
  font-size: 14px;
}
</style>
