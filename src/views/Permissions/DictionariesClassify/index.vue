<template>
  <ContentWrap>
    <div class="flex-b">
      <Search :schema="schema" @reset="setSearchParams" @search="setSearchParams" />
      <ElButton plain @click="fieldVisible = true">{{ t('common.fieldFiltering') }}</ElButton>
      <div v-hasPermi="'pms:dict:add'" class="ml-20px">
        <ElButton type="primary" @click="AddAction">{{ t('project.add') }}</ElButton>
      </div>
    </div>
  </ContentWrap>
  <ContentWrap class="mt-20px flex-1" :isBlock="false">
    <Table
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :columns="allSchemas"
      :data="dataList"
      :loading="loading"
      @register="tableRegister"
      :pagination="{
        total,
        layout: ' ->, total, sizes, prev, pager, next, jumper'
      }"
    />
  </ContentWrap>

  <Dialog v-model="dialogVisible" :title="dialogTitle">
    <EditDicParameters
      ref="EditDicParameterRef"
      v-if="actionType === 'editDicParameters'"
      :dictId="dictId"
    />
    <Write ref="writeRef" :current-row="currentRow" :actionType="actionType" v-else />
    <template #footer v-if="actionType === 'edit' || actionType === 'add'">
      <ElButton @click="dialogVisible = false">{{ t('common.cancel') }}</ElButton>
      <ElButton type="primary" :loading="saveLoading" @click="save">
        {{ t('project.confirm') }}
      </ElButton>
    </template>
  </Dialog>
  <FieldFilter
    v-if="fieldVisible"
    v-model:fieldVisible="fieldVisible"
    :ui-url="'/dict/operatorSortColumnUI'"
    :sort-url="'/dict/operatorSortColumn'"
  />
</template>

<script setup lang="tsx">
import { ContentWrap } from '@/components/ContentWrap'
import { useI18n } from '@/hooks/web/useI18n'
import { ref, unref, watch, reactive, onMounted } from 'vue'
import { ElButton, ElTree } from 'element-plus'
import { tableStatusStyle } from '@/utils/componentUtils'
import {
  getDictListApi,
  addDictListApi,
  updateDictListApi,
  deleteDictListApi,
  getDictPageTop
} from '@/api/dictionariesClassify'
import type { DepartmentUserItem } from '@/api/department/types'
import { useTable } from '@/hooks/web/useTable'
import { Search } from '@/components/Search'
import Write from './components/Write.vue'
import EditDicParameters from './components/EditDicParameters.vue'
import { Dialog } from '@/components/Dialog'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { FormSchema } from '@/components/Form'
import { dateTimeRange } from '@/utils/time'
import { Table } from '@/components/Table'
import FieldFilter from '@/components/customComponents/FieldFilter/index.vue'
import generateSchema from '@/utils/schemaUtil'
import { useAppStore } from '@/store/modules/app'
import { nextTick } from 'vue'
const appStore = useAppStore()
appStore.setRenderLoading(true)

const fieldVisible = ref(false)
const { t } = useI18n()

const { tableRegister, tableState, tableMethods } = useTable({
  fetchDataApi: async () => {
    const { pageSize, currentPage } = tableState
    let res = { data: { list: [], total: 0 } }
    if (
      searchParams.value.time &&
      searchParams.value.time[0] != '' &&
      searchParams.value.time[1] != ''
    ) {
      res = await getDictListApi({
        pageNum: unref(currentPage),
        numPerPage: unref(pageSize),
        ...unref(searchParams),
        startTime: searchParams.value.time[0] ? searchParams.value.time[0] : '',
        endTime: searchParams.value.time[1] ? searchParams.value.time[1] : ''
      })
    } else {
      res = await getDictListApi({
        pageNum: unref(currentPage),
        numPerPage: unref(pageSize),
        ...unref(searchParams)
      })
    }
    return {
      list: res.data.list || [],
      total: res.data.total || 0
    }
  },
  fetchDelApi: async () => {
    const res = await deleteDictListApi(unref(ids))
    return res
  },
  immediate: false
})
const { total, loading, dataList, pageSize, currentPage } = tableState
const { getList, getElTableExpose, delList } = tableMethods

const crudSchemas = reactive<CrudSchema[]>([
  {
    field: 'itemCode',
    label: t('dictionariesClassify.itemCode'),
    search: {
      hidden: true
    }
  },
  {
    field: 'dataType',
    label: t('dictionariesClassify.dictType'),
    search: {
      hidden: true
    },
    formatter: (obj: any) => {
      let value = obj.dataType
      if (value === 0) {
        return (
          <>
            <div>{t('image.sub19')}</div>
          </>
        )
      }
      if (value === 1) {
        return (
          <>
            <div>{t('image.sub20')}</div>
          </>
        )
      }
      if (value != 1 && value != 0) {
        return (
          <>
            <div>{t('common.a39')}</div>
          </>
        )
      }
    }
  },
  {
    field: 'dictName',
    label: t('dictionariesClassify.dictName'),
    search: {
      hidden: true
    }
  },
  {
    field: 'description',
    label: t('dictionariesClassify.description'),
    search: {
      hidden: true
    }
  },
  // {
  //   field: 'statusStr',
  //   label: t('dictionariesParameter.statusStr'),
  //   search: {
  //     hidden: true
  //   },
  //   formatter: (cellValue: string) => {
  //     return tableStatusStyle(cellValue)
  //   }
  // },
  {
    field: 'remark',
    label: t('dictionariesParameter.remark'),
    search: {
      hidden: true
    }
  },
  {
    field: 'action',
    label: t('userDemo.action'),
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
      width: 280,
      slots: {
        default: (data: any) => {
          const row = data.row as DepartmentUserItem
          return (
            <>
              <div class="[&>span]:(cursor-pointer m-2) flex flex-wrap colorMain ">
                <span v-hasPermi="pms:dict:view" onClick={() => action(row, 'look')}>
                  {' '}
                  {t('project.view')}{' '}
                </span>
                <span v-hasPermi="pms:dict:edit" onClick={() => action(row, 'edit')}>
                  {' '}
                  {t('project.edit')}{' '}
                </span>
                <span
                  v-hasPermi="pms:dict:editdictparams"
                  onClick={() => action(row, 'editDicParameters')}
                >
                  {t('dictionariesClassify.editDicParameters')}
                </span>
                <span
                  v-hasPermi="pms:dict:delete"
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

// const { allSchemas } = useCrudSchemas(crudSchemas)
const allSchemas = ref<any>([])

const schema = reactive<FormSchema[]>([
  {
    field: 'dictName',
    label: '',
    component: 'Input',
    componentProps: {
      slots: {
        prepend: () => <div>{t('dictionariesClassify.dictName')}</div>
        // append: () => <Icon icon="ep:share" />
      }
    }
  },
  {
    field: 'dataType',
    label: '',
    component: 'Select',
    componentProps: {
      slots: {
        prefix: () => <div>{t('dictionariesClassify.dictType')}</div>
        // append: () => <Icon icon="ep:share" />
      },
      options: [
        {
          label: t('image.sub19'),
          value: 0
        },
        {
          label: t('image.sub20'),
          value: 1
        }
      ]
    }
  },
  {
    field: 'itemCode',
    label: '',
    component: 'Input',
    componentProps: {
      slots: {
        prepend: () => <div>{t('dictionariesClassify.itemCode')}</div>
        // append: () => <Icon icon="ep:share" />
      }
    }
  },
  {
    field: 'description',
    label: '',
    component: 'Input',
    componentProps: {
      slots: {
        prepend: () => <div>{t('dictionariesClassify.description')}</div>
        // append: () => <Icon icon="ep:share" />
      }
    }
  },
  {
    field: 'time',
    component: 'DatePicker',
    componentProps: dateTimeRange()
  }
])

const searchParams = ref({ time: ['', ''] })
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

const dialogVisible = ref(false)
const dialogTitle = ref('')

const currentRow = ref<DepartmentUserItem>()

const actionType = ref('')

const AddAction = () => {
  dialogTitle.value = t('project.add')
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

const dictId = ref('')

const action = (row: DepartmentUserItem, type: string) => {
  dialogTitle.value = t(
    type === 'edit'
      ? 'project.edit'
      : type === 'viewAssociation'
      ? 'fields.viewAssociation'
      : type === 'editDicParameters'
      ? 'dictionariesClassify.editDicParameters'
      : 'project.view'
  )
  currentRow.value = row
  actionType.value = type
  if (type == 'editDicParameters') {
    dictId.value = row.id
  }
  dialogVisible.value = true
}

const writeRef = ref<ComponentRef<typeof Write>>()

const saveLoading = ref(false)

const save = async () => {
  const write = unref(writeRef)
  const formData = await write?.submit()
  if (formData) {
    saveLoading.value = true
    try {
      if (actionType.value == 'add') {
        const res = await addDictListApi(formData)
        if (res) {
          currentPage.value = 1
          getList()
        }
      }
      if (actionType.value == 'edit') {
        const res = await updateDictListApi(formData)
        if (res) {
          currentPage.value = 1
          getList()
        }
      }
    } catch (error) {
    } finally {
      saveLoading.value = false
      dialogVisible.value = false
    }
  }
}

onMounted(async () => {
  await init()
})
watch(
  () => fieldVisible.value,
  (val) => {
    if (!val) {
      init()
    }
  }
)
const staticSchema = [
  {
    field: 'dataType',
    label: t('dictionariesClassify.dictType'),
    search: {
      hidden: true
    },
    formatter: (obj: any) => {
      let value = obj.dataType
      if (value === 0) {
        return (
          <>
            <div>{t('image.sub19')}</div>
          </>
        )
      }
      if (value === 1) {
        return (
          <>
            <div>{t('image.sub20')}</div>
          </>
        )
      }
      if (value != 1 && value != 0) {
        return (
          <>
            <div>{t('common.a39')}</div>
          </>
        )
      }
    }
  }
]
const actionSchema = {
  field: 'action',
  label: t('userDemo.action'),
  fixed: 'right',
  minWidth: '300px',
  slots: {
    default: (data: any) => {
      const row = data.row as DepartmentUserItem
      return (
        <>
          <div class="[&>span]:(cursor-pointer m-2) flex flex-wrap colorMain ">
            <span v-hasPermi="pms:dict:view" onClick={() => action(row, 'look')}>
              {' '}
              {t('project.view')}{' '}
            </span>
            <span v-hasPermi="pms:dict:edit" onClick={() => action(row, 'edit')}>
              {' '}
              {t('project.edit')}{' '}
            </span>
            <span
              v-hasPermi="pms:dict:editdictparams"
              onClick={() => action(row, 'editDicParameters')}
            >
              {t('dictionariesClassify.editDicParameters')}
            </span>
            <span v-hasPermi="pms:dict:delete" class="color-red-500" onClick={() => delData(row)}>
              {t('role.delete')}
            </span>
          </div>
        </>
      )
    }
  }
}
const init = async () => {
  appStore.setRenderLoading(true)
  const res = await getDictPageTop()
  if (res) {
    let arr = generateSchema(res.data.pageColumn, staticSchema)
    arr.push(actionSchema)
    allSchemas.value = arr
  }
  nextTick(() => {
    getList()
  })
}
</script>
