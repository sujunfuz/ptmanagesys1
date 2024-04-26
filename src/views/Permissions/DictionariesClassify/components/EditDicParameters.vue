<template>
  <div>
    <Search
      :schema="schema"
      @reset="setSearchParams"
      :showAdd="true"
      @add="addDictItem"
      @search="setSearchParams"
    />
    <Table
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :columns="allSchemas.tableColumns"
      :data="dataList"
      class="mt-20px"
      :loading="loading"
      @register="tableRegister"
      :pagination="{
        total,
        layout: ' ->, total, sizes, prev, pager, next, jumper'
      }"
    />
    <Dialog v-model="dialogVisible" :title="dialogTitle">
      <DialogWrite
        ref="dialogWriteRef"
        :dictId="dictId"
        :current-row="currentRow"
        :actionType="actionType"
      />
      <template #footer v-if="actionType != 'look'">
        <ElButton @click="dialogVisible = false">{{ t('common.cancel') }}</ElButton>
        <ElButton type="primary" :loading="saveLoading" @click="save">
          {{ t('project.confirm') }}
        </ElButton>
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="tsx">
import { reactive, ref, unref } from 'vue'
import { Search } from '@/components/Search'
import { FormSchema } from '@/components/Form'
import { useI18n } from '@/hooks/web/useI18n'
import { useTable } from '@/hooks/web/useTable'
import { useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { TableColumn, Table } from '@/components/Table'
import { Dialog } from '@/components/Dialog'
import { ElButton } from 'element-plus'
import {
  getListItemApi,
  addDictItemApi,
  deleteDictItemApi,
  editDictItemApi
} from '@/api/dictionariesClassify'
import { dateTimeRange } from '@/utils/time'
import type { DepartmentUserItem } from '@/api/department/types'
const { t } = useI18n()
import DialogWrite from './DialogWrite.vue'

const dialogVisible = ref(false)
const dialogTitle = ref('')
const saveLoading = ref(false)

const props = defineProps({
  dictId: {
    type: String,
    defult: () => ''
  }
})

const currentRow = ref<any>()

const searchParams = ref({ time: ['', ''] })

const { tableRegister, tableState, tableMethods } = useTable({
  fetchDataApi: async () => {
    const { pageSize, currentPage } = tableState
    let res = { data: { list: [], total: 0 } }
    if (
      searchParams.value?.time &&
      searchParams.value?.time[0] != '' &&
      searchParams.value?.time[1] != ''
    ) {
      res = await getListItemApi({
        currentPage: unref(currentPage),
        pageSize: unref(pageSize),
        dictId: props.dictId,
        ...unref(searchParams),
        startTime: searchParams?.value.time[0] ? searchParams.value?.time[0] : '',
        endTime: searchParams.value.time[1] ? searchParams.value.time[1] : ''
      })
    } else {
      res = await getListItemApi({
        currentPage: unref(currentPage),
        pageSize: unref(pageSize),
        dictId: props.dictId,
        ...unref(searchParams)
      })
    }
    return {
      list: res.data.list || [],
      total: res.data.total || 0
    }
  },
  fetchDelApi: async () => {
    const res = await deleteDictItemApi(unref(ids))
    return res
  }
})

const { total, loading, dataList, pageSize, currentPage } = tableState
const schema = reactive<FormSchema[]>([
  {
    field: 'itemText',
    label: '',
    component: 'Input',
    componentProps: {
      slots: {
        prepend: () => <div>{t('dictionariesClassify.dictName')}</div>
      }
    }
  },
  {
    field: 'time',
    component: 'DatePicker',
    componentProps: dateTimeRange()
  }
])

const actionType = ref('')

const action = (row: DepartmentUserItem, type: string) => {
  dialogTitle.value = t(
    type === 'edit'
      ? 'project.edit'
      : type === 'viewAssociation'
      ? 'fields.viewAssociation'
      : 'project.view'
  )

  actionType.value = type
  currentRow.value = row
  dialogVisible.value = true
}

const { getList, getElTableExpose, delList } = tableMethods

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

const setSearchParams = (params: any) => {
  currentPage.value = 1
  searchParams.value = params
  getList()
}

const addDictItem = () => {
  dialogTitle.value = t('project.add')
  actionType.value = 'add'
  dialogVisible.value = true
  currentRow.value = null
}

const crudSchemas = reactive<TableColumn[]>([
  {
    field: 'id',
    label: t('fields.id'),
    search: {
      hidden: true
    }
  },
  {
    field: 'createTime',
    label: t('dictionariesClassify.createTime'),
    search: {
      hidden: true
    }
  },
  {
    field: 'dictType',
    label: t('dictionariesClassify.dictType'),
    search: {
      hidden: true
    }
  },
  {
    field: 'itemCode',
    label: t('dictionariesClassify.itemCode'),
    search: {
      hidden: true
    }
  },
  {
    field: 'itemText',
    label: t('dictionariesClassify.dictName'),
    search: {
      hidden: true
    }
  },
  {
    field: 'itemValue',
    label: t('dictionariesClassify.itemValue'),
    search: {
      hidden: true
    }
  },
  {
    field: 'sort',
    label: t('dictionariesClassify.sort'),
    search: {
      hidden: true
    }
  },
  {
    field: 'remark',
    label: t('dictionariesClassify.remark'),
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
      width: 240,
      slots: {
        default: (data: any) => {
          const row = data.row as DepartmentUserItem
          return (
            <>
              <div class="[&>span]:(cursor-pointer m-2) flex flex-wrap colorMain ">
                <span onClick={() => action(row, 'look')}> {t('project.view')} </span>
                <span onClick={() => action(row, 'edit')}> {t('project.edit')} </span>
                <span class="color-red-500" onClick={() => delData(row)}>
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

const dialogWriteRef = ref<ComponentRef<typeof DialogWrite>>()

const save = async () => {
  const write = unref(dialogWriteRef)
  const formData = await write?.submit()
  if (formData) {
    saveLoading.value = true
    try {
      if (actionType.value == 'add') {
        const res = await addDictItemApi(formData)
        if (res) {
          currentPage.value = 1
          getList()
        }
      }
      if (actionType.value == 'edit') {
        const res = await editDictItemApi(formData)
        if (res) {
          currentPage.value = 1
          getList()
        }
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
