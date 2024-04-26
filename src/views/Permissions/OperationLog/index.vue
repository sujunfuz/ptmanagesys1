<template>
  <ContentWrap>
    <div class="flex-b">
      <Search :schema="schema" @reset="setSearchParams" @search="setSearchParams" />
      <ElButton plain @click="fieldVisible = true">{{ t('common.fieldFiltering') }}</ElButton>
      <div v-hasPermi="'pms:log:delete'" class="ml-20px">
        <ElButton type="primary" :icon="svgTrash" @click="delData()" :loading="delLoading">{{
          t('project.delete')
        }}</ElButton>
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
    <Write ref="writeRef" :currentRow="currentRow" />
  </Dialog>
  <FieldFilter
    v-if="fieldVisible"
    v-model:fieldVisible="fieldVisible"
    :ui-url="'/log/operatorSortColumnUI'"
    :sort-url="'/log/operatorSortColumn'"
  />
</template>

<script setup lang="tsx">
import { useIcon } from '@/hooks/web/useIcon'
import { ContentWrap } from '@/components/ContentWrap'
import { useI18n } from '@/hooks/web/useI18n'
import { ref, unref, watch, reactive, onMounted } from 'vue'
import { ElButton, ElTree, ElOption, ElTag } from 'element-plus'
import { logList, logDelete, logDetail, getLogPageTop } from '@/api/operationLog'
import type { DepartmentUserItem } from '@/api/department/types'
import { useTable } from '@/hooks/web/useTable'
import { Search } from '@/components/Search'
import { Dialog } from '@/components/Dialog'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { SelectOption, FormSchema } from '@/components/Form'
import { dateTimeRange } from '@/utils/time'
import { Table } from '@/components/Table'
import Write from './components/Write.vue'
import FieldFilter from '@/components/customComponents/FieldFilter/index.vue'
import generateSchema from '@/utils/schemaUtil'
import { useAppStore } from '@/store/modules/app'
import { nextTick } from 'vue'
const appStore = useAppStore()
appStore.setRenderLoading(true)

const fieldVisible = ref(false)
const { t } = useI18n()

const svgTrash = useIcon({ icon: 'ep:delete' })
const { tableRegister, tableState, tableMethods } = useTable({
  fetchDataApi: async () => {
    const { pageSize, currentPage } = tableState
    let startTime = unref(searchParams).time ? unref(searchParams).time[0] : ''
    let endTime = unref(searchParams).time ? unref(searchParams).time[1] : ''
    const res = await logList({
      currentPage: unref(currentPage),
      pageSize: unref(pageSize),
      startTime,
      endTime,
      status:
        unref(searchParams).status == null || unref(searchParams).status == undefined
          ? ''
          : unref(searchParams).status
    })
    return res.data
  },
  fetchDelApi: async () => {
    const res = await logDelete(unref(ids))
    return res
  },
  immediate: false
})
const { total, loading, dataList, pageSize, currentPage } = tableState
const { getList, getElTableExpose, delList } = tableMethods

const crudSchemas = reactive<CrudSchema[]>([
  // {
  //   field: 'selection',
  //   search: {
  //     hidden: true
  //   },
  //   form: {
  //     hidden: true
  //   },
  //   detail: {
  //     hidden: true
  //   },
  //   table: {
  //     type: 'selection'
  //   }
  // },
  {
    field: 'index',
    label: t('userDemo.index'),
    form: {
      hidden: true
    },
    search: {
      hidden: true
    },
    detail: {
      hidden: true
    },
    table: {
      type: 'index'
    }
  },
  {
    field: 'operation',
    label: t('operationLog.operation'),
    search: {
      hidden: true
    }
  },
  {
    field: 'ip',
    label: t('operationLog.ip'),
    search: {
      hidden: true
    }
  },
  {
    field: 'requestMethod',
    label: t('operationLog.requestMethod'),
    search: {
      hidden: true
    }
  },
  {
    field: 'operatorID',
    label: t('operationLog.operatorID'),
    search: {
      hidden: true
    }
  },
  {
    field: 'errReason',
    label: t('operationLog.errReason'),
    search: {
      hidden: true
    }
  },
  {
    field: 'requestTime',
    label: t('operationLog.requestTime'),
    minWidth: 100,
    search: {
      hidden: true
    }
  },
  {
    field: 'requestUri',
    label: t('operationLog.requestUri'),
    search: {
      hidden: true
    }
  },
  {
    field: 'status',
    label: t('dictionariesParameter.statusStr'),
    search: {
      hidden: true
    },
    formatter: (data: any) => {
      const status = data.status || ''
      return (
        <>
          <ElTag type={status === 1 ? '' : 'danger'}>
            {status === 1 ? t('image.success') : t('image.fail')}
          </ElTag>
        </>
      )
    }
  },
  {
    field: 'createTime',
    label: t('operationLog.createTime'),
    minWidth: 120,
    search: {
      hidden: true
    },
    sortable: true
  },
  {
    field: 'operatorName',
    minWidth: 120,
    label: t('operationLog.operatorName'),
    search: {
      hidden: true
    },
    sortable: true
  },
  {
    field: 'action',
    label: t('userDemo.action'),
    width: 140,
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
                <span v-hasPermi="pms:log:view" onClick={() => viewData(row)}>
                  {t('project.view')}
                </span>
              </div>
            </>
          )
        }
      }
    }
  }
])

const dialogVisible = ref(false)
const dialogTitle = ref('')
const viewData = async (row: any) => {
  const res = await logDetail({ id: row.id })
  if (res.code == 200) {
    currentRow.value = res.data
  }
  dialogVisible.value = true
  dialogTitle.value = t('project.view')
}

// const { allSchemas } = useCrudSchemas(crudSchemas)
const allSchemas = ref<any>([])
const schema = reactive<FormSchema[]>([
  {
    field: 'status',
    component: 'Select',
    componentProps: {
      options: [
        {
          label: t('image.fail'),
          value: 0
        },
        {
          label: t('image.success'),
          value: 1
        }
      ],
      slots: {
        prefix: () => <div>{t('operationLog.type')}</div>
      }
    }
  },
  {
    field: 'time',
    component: 'DatePicker',
    componentProps: dateTimeRange()
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

const currentRow = ref<DepartmentUserItem>()

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
    field: 'requestTime',
    label: t('operationLog.requestTime'),
    minWidth: 100
  },
  {
    field: 'status',
    label: t('dictionariesParameter.statusStr'),
    formatter: (data: any) => {
      const status = data.status || ''
      return (
        <>
          <ElTag type={status === 1 ? '' : 'danger'}>
            {status === 1 ? t('image.success') : t('image.fail')}
          </ElTag>
        </>
      )
    }
  },
  {
    field: 'createTime',
    label: t('operationLog.createTime'),
    minWidth: 120,
    sortable: true
  },
  {
    field: 'operatorName',
    minWidth: 120,
    label: t('operationLog.operatorName'),
    sortable: true
  }
]
const actionSchema = [
  {
    field: 'action',
    label: t('userDemo.action'),
    fixed: 'right',
    minWidth: '120px',
    slots: {
      default: (data: any) => {
        const row = data.row as DepartmentUserItem
        return (
          <>
            <div class="[&>span]:(cursor-pointer m-2) flex flex-wrap colorMain ">
              <span v-hasPermi="pms:log:view" onClick={() => viewData(row)}>
                {t('project.view')}
              </span>
            </div>
          </>
        )
      }
    }
  }
]
const init = async () => {
  appStore.setRenderLoading(true)
  const res = await getLogPageTop()
  if (res) {
    let arr = generateSchema(res.data.pageColumn, staticSchema)
    arr = arr.concat(actionSchema)
    allSchemas.value = arr
  }
  nextTick(() => {
    getList()
  })
  // const res = await
}
</script>
