<template>
  <ContentWrap>
    <div class="flex-b mb-20px">
      <Search
        v-hasPermi="'goods:ecGoodsPriceLimit:list'"
        :schema="schema"
        @register="formRegister"
        @reset="resetSearchParams"
        @search="setSearchParams"
      />
      <div class="flex-c">
        <!-- <ElButton type="primary" plain @click="fieldFilterVisible = true">{{
          t('common.fieldFiltering')
        }}</ElButton> -->
        <ElButton v-hasPermi="'goods:ecGoodsPriceLimit:add'" type="primary" @click="AddAction">{{
          t('checkPrice.addBts')
        }}</ElButton>
      </div>
    </div>
  </ContentWrap>
  <ContentWrap class="mt-20px flex-1" :isBlock="false">
    <!-- <div class="flex-c p-20px">
      <span class="subString">{{ t('project.yisel') }} </span>
      <span class="colorMain">&nbsp;{{ chooseCount }}&nbsp;</span>
      <span class="subString">{{ t('checkPrice.checkPrice') }}</span>
      <div class="aCustomBtn" @click="batchDelete" :class="chooseCount > 0 ? 'customBtnHover' : ''">
        {{ t('project.delete') }}
      </div>
    </div> -->

    <!-- @select="handleSelectionChange"
      @select-all="handleSelectionAllChange" -->
    <Table
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :columns="allSchemas.tableColumns"
      :data="dataList"
      :loading="loading"
      @register="tableRegister"
      :pagination="{
        total,
        layout: ' ->, total, sizes, prev, pager, next, jumper'
      }"
    />
  </ContentWrap>

  <Dialog v-model="dialogVisible" :title="dialogTitle" max-height="200px">
    <Write ref="writeRef" :currentRow="currentRow" :categoryEnum="CategoryEnum" />

    <template #footer>
      <ElButton @click="dialogVisible = false">{{ t('project.cancel') }}</ElButton>
      <ElButton type="primary" :loading="saveLoading" @click="save">
        {{ t('project.confirm') }}
      </ElButton>
    </template>
  </Dialog>
  <FieldFilter
    v-if="fieldFilterVisible"
    :ui-url="'/ecGoodsPriceLimit/getOperatorSortColumn'"
    :sort-url="'/ecGoodsPriceLimit/updateOperatorSortColumn'"
    v-model:fieldVisible="fieldFilterVisible"
  />
</template>

<script setup lang="tsx">
import { ContentWrap } from '@/components/ContentWrap'
import { useI18n } from '@/hooks/web/useI18n'
import { ref, unref, reactive, nextTick, onMounted } from 'vue'
import { ElButton, ElLink, ElInput, ElMessage } from 'element-plus'
import {
  pageTop,
  ecGoodsPriceLimitList,
  ecGoodsPriceLimitDetails,
  addecGoodsPriceLimit,
  editecGoodsPriceLimit,
  getCategoryByLevel,
  delecGoodsPriceLimit
} from '@/api/RuleManage/checkPrice'
import FieldFilter from '@/components/customComponents/FieldFilter/index.vue'
import type { DepartmentUserItem } from '@/api/department/types'
import { useTable } from '@/hooks/web/useTable'
import { Search } from '@/components/Search'
import Write from './components/Write.vue'
import { Dialog } from '@/components/Dialog'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { SelectOption, FormSchema } from '@/components/Form'
import { Table } from '@/components/Table'
import { tableStatusStyle } from '@/utils/componentUtils'
import { useForm } from '@/hooks/web/useForm'

const { t } = useI18n()

onMounted(() => {
  init()
})

const batchDelete = async () => {
  const res = await delecGoodsPriceLimit(chooseIdsList.value)
  if (res.code == 200) {
    ElMessage.success(t('common.operateSuccess'))
    getList()
  }
}

//字段筛选功能
const fieldFilterVisible = ref(false)

const CategoryEnum = ref([])
const init = async () => {
  const res = await getCategoryByLevel({
    level: 1
  })
  CategoryEnum.value = []
  if (res.code == 200) {
    let temp = res.data
    for (let key in temp) {
      CategoryEnum.value.push({
        label: temp[key].categoryName,
        value: temp[key].id
      })
    }
  }
  getList()
}
const { tableRegister, tableState, tableMethods } = useTable({
  fetchDataApi: async () => {
    const { pageSize, currentPage } = tableState
    const res = await ecGoodsPriceLimitList({
      currentPage: unref(currentPage),
      pageSize: unref(pageSize),
      ...unref(searchParams)
    })
    return {
      list: res.data.list,
      total: res.data.total
    }
  },
  fetchDelApi: async () => {
    const res = await delecGoodsPriceLimit(unref(ids))
    return res
  },
  immediate: false
})
const { total, loading, dataList, pageSize, currentPage } = tableState
const { getList, getElTableExpose, delList } = tableMethods

const crudSchemas = reactive<CrudSchema[]>([
  // {
  //   field: 'selection',
  //   table: {
  //     type: 'selection'
  //   }
  // },
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
    field: 'keyWord',
    label: t('checkPrice.search2'),
    search: {
      hidden: true
    }
  },
  {
    field: 'categoryName',
    label: t('checkPrice.Level1'),
    search: {
      hidden: true
    }
  },
  {
    field: 'minPrice',
    label: t('checkPrice.min'),
    search: {
      hidden: true
    }
  },
  {
    field: 'maxPrice',
    label: t('checkPrice.max'),
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
          const row = data.row
          return (
            <>
              <div class="[&>span]:(cursor-pointer m-2) flex flex-wrap colorMain ">
                <span v-hasPermi="goods:ecGoodsPriceLimit:edit" onClick={() => action(row, 'edit')}>
                  {' '}
                  {t('project.edit')}{' '}
                </span>
                <span
                  v-hasPermi="goods:ecGoodsPriceLimit:delete"
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

const isFocus = ref(false)

const schema = reactive<FormSchema[]>([
  {
    field: 'categoryId',
    colProps: {
      span: 12
    },
    component: 'Select',
    componentProps: {
      slots: {
        prefix: () => <div>{t('checkPrice.search1')}</div>
      },
      options: CategoryEnum
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
        prefix: () => <div>{t('checkPrice.search2')}</div>
      }
    }
  },
  {
    field: 'Price',
    colProps: {
      span: 12
    },
    component: 'Input',
    componentProps: {
      slots: {
        prefix: () => <div>{t('checkPrice.search3')}</div>
      }
    },
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
                  isFocus.value ? 'border-(#0068E3 solid 1px )' : 'border-(#dcdfe6 solid 1px )'
                ]}
              >
                <span class="color-#b0b4b7 font-size-15px w-50px text-center ml-10px">
                  {t('checkPrice.search3')}
                </span>
                <div style="background-color: #dcdfe6;width: 0.5px;height: 23px;margin-left: 10px;"></div>
                <ElInput
                  v-model={data.minPrice}
                  style="width: 100px;"
                  placeholder={t('project.minprice')}
                  type="number"
                  onFocus={() => (isFocus.value = true)}
                  onBlur={() => (isFocus.value = false)}
                />
                -
                <ElInput
                  v-model={data.maxPrice}
                  style="width: 100px"
                  placeholder={t('project.maxprice')}
                  type="number"
                  onFocus={() => (isFocus.value = true)}
                  onBlur={() => (isFocus.value = false)}
                />
              </div>
            </>
          )
        }
      }
    }
  }
])

const { formRegister, formMethods } = useForm()
const searchParams = ref({})
const setSearchParams = (params: any) => {
  searchParams.value = params
  getList()
}
const resetSearchParams = async (params: any) => {
  params.minPrice = ''
  params.maxPrice = ''
  await formMethods.setValues({
    minPrice: '',
    maxPrice: ''
  })
  searchParams.value = params
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
  dialogTitle.value = t('project.add') + t('checkPrice.name')
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
  dialogTitle.value = t('project.edit') + t('checkPrice.name')
  currentRow.value = row
  actionType.value = type
  dialogVisible.value = true
}

const writeRef = ref<ComponentRef<typeof Write>>()

const saveLoading = ref(false)

const save = async () => {
  const write = unref(writeRef)
  const formData = await write?.submit()
  if (formData) {
    saveLoading.value = true
    let res
    try {
      if (actionType.value == 'add') {
        res = await addecGoodsPriceLimit({ ...formData, status: 'ACTIVE' })
        if (res.code == 200) {
          ElMessage.success(t('common.operateSuccess'))
        }
      } else {
        res = await editecGoodsPriceLimit(formData)
        if (res.code == 200) {
          ElMessage.success(t('common.operateSuccess'))
        }
      }

      if (res.code == 200) {
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
