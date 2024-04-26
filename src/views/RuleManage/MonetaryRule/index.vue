<template>
  <ContentWrap>
    <div class="flex-b">
      <Search
        v-hasPermi="'rule:rpCurrencyRule:list'"
        :schema="schema"
        @reset="setSearchParams"
        @search="setSearchParams"
      />
      <ElButton type="primary" v-hasPermi="'rule:rpCurrencyRule:add'" @click="action('add', '')">{{
        t('image.sub21')
      }}</ElButton>
    </div>
  </ContentWrap>
  <ContentWrap class="mt-20px flex-1" :isBlock="false">
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

  <Dialog
    v-model="dialogVisible"
    :title="actionType == 'edit' ? t('image.sub27') : t('image.sub21')"
    max-height="200px"
    class="!w-800px"
  >
    <Write
      ref="writeRef"
      :newCurrencyEnum="newCurrencyEnum"
      :currencyStatusEnum="currencyStatusEnum"
      :currentRow="currentRow"
    />
    <template #footer>
      <ElButton @click="dialogVisible = false">{{ t('common.cancel') }}</ElButton>
      <ElButton type="primary" :loading="saveLoading" @click="save">
        {{ t('project.confirm') }}
      </ElButton>
    </template>
  </Dialog>
</template>

<script lang="tsx" setup>
import { ContentWrap } from '@/components/ContentWrap'
import { Dialog } from '@/components/Dialog'
import { ElButton, ElMain, ElMessage, ElSwitch } from 'element-plus'
import { ref, reactive, unref, onMounted } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import { Table } from '@/components/Table'
import { Search } from '@/components/Search'
import { FormSchema } from '@/components/Form'
import { useTable } from '@/hooks/web/useTable'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import Write from './components/Write.vue'
import {
  getPageTopApi,
  getPageListApi,
  getCurrencyApi,
  addDataListApi,
  deleteDataListApi,
  editDataListApi,
  updateStatusApi
} from '@/api/RuleManage/monetaryRule'

const dialogVisible = ref(false)
const saveLoading = ref(false)

onMounted(() => {
  init()
})

const currencyStatusEnum = ref()
const newCurrencyEnum = ref<Array<any>>([])
const currencyEnum = ref<Array<any>>([])
const init = async () => {
  const res = await getPageTopApi()
  if (res.code == 200) {
    currencyStatusEnum.value = res.data.currencyStatusEnum
  }

  const res1 = await getCurrencyApi()
  if (res1.code == 200) {
    currencyEnum.value = []
    newCurrencyEnum.value = []
    for (var item in res1.data) {
      currencyEnum.value.push({
        label: res1.data[item].currencyName,
        value: res1.data[item].currencyName
      })
      newCurrencyEnum.value.push({
        label:
          res1.data[item].currencyCode +
          '  ' +
          res1.data[item].currencySymbol +
          '-' +
          res1.data[item].currencyName,
        value:
          res1.data[item].currencyCode +
          ',' +
          res1.data[item].currencySymbol +
          ',' +
          res1.data[item].currencyName +
          ',' +
          res1.data[item].currencyIcon
      })
    }
  }
  getList()
}

const searchParams = ref({})
const setSearchParams = (params: any) => {
  currentPage.value = 1
  searchParams.value = params
  getList()
}

const { t } = useI18n()

const { tableRegister, tableState, tableMethods } = useTable({
  fetchDataApi: async () => {
    const { pageSize, currentPage } = tableState
    const res = await getPageListApi({
      pageNum: unref(currentPage),
      numPerPage: unref(pageSize),
      ...unref(searchParams)
    })
    return {
      list: res.data.list || [],
      total: res.data.total || 0
    }
  },
  fetchDelApi: async () => {
    const res = await deleteDataListApi(unref(ids))
    return res
  },
  immediate: false
})
const { total, loading, dataList, pageSize, currentPage } = tableState
const { getList, getElTableExpose, delList } = tableMethods

const schema = reactive<FormSchema[]>([
  {
    field: 'currencyName',
    label: '',
    component: 'Select',
    componentProps: {
      options: currencyEnum,
      slots: {
        prefix: () => <div>{t('channel.currency')}</div>
      }
    }
  },
  {
    field: 'status',
    label: '',
    component: 'Select',
    componentProps: {
      options: currencyStatusEnum,
      slots: {
        prefix: () => <div>{t('channel.status')}</div>
      }
    }
  }
])

const crudSchemas = reactive<CrudSchema[]>([
  {
    field: 'index',
    label: t('userDemo.index'),
    table: {
      type: 'index'
    }
  },
  {
    field: 'currencyCode',
    label: t('image.sub23'),
    search: {
      hidden: true
    }
  },
  {
    field: 'currencyName',
    label: t('channel.currency'),
    search: {
      hidden: true
    }
  },
  {
    field: 'currencySymbol',
    label: t('image.sub24'),
    search: {
      hidden: true
    }
  },
  {
    field: 'currencyRate',
    label: t('accountPage.sub9'),
    search: {
      hidden: true
    }
  },
  {
    field: 'status',
    label: t('channel.status'),
    search: {
      hidden: true
    },
    table: {
      slots: {
        default: (data: any) => (
          <ElSwitch
            onChange={() => changeStatus({ id: data.row.id, status: data.row.status })}
            style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
            modelValue={data.row.status}
            v-model={data.row.status}
            inactiveValue="CLOSE"
            activeValue="OPEN"
          />
        )
      }
    }
  },
  {
    field: 'editTimeStr',
    label: t('cardBank.time'),
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
          const row = data.row
          return (
            <>
              <div class="[&>span]:(cursor-pointer m-2) flex flex-wrap colorMain ">
                <span v-hasPermi="rule:rpCurrencyRule:edit" onClick={() => action('edit', row)}>
                  {' '}
                  {t('project.edit')}{' '}
                </span>
                <span
                  v-hasPermi="rule:rpCurrencyRule:delete"
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

const changeStatus = async (data) => {
  const res = await updateStatusApi(data)
  if (res.code == 200) {
    dialogVisible.value = false
    ElMessage.success(t('common.operateSuccess'))
    getList()
  }
}
//操作
const writeRef = ref()
const save = async () => {
  let params = await writeRef.value.submit()
  if (params) {
    let res
    if (actionType.value == 'add') {
      res = await addDataListApi(params)
    } else {
      res = await editDataListApi(params)
    }
    if (res.code == 200) {
      dialogVisible.value = false
      ElMessage.success(t('common.operateSuccess'))
      getList()
    }
  }
}

const delLoading = ref(false)
const ids = ref<string[]>([])
const delData = async (row?: any) => {
  const elTableExpose = await getElTableExpose()
  ids.value = row ? [row.id] : elTableExpose?.getSelectionRows().map((v: any) => v.id) || []
  delLoading.value = true

  await delList(unref(ids).length).finally(() => {
    delLoading.value = false
  })
}

const currentRow = ref()
const actionType = ref()
const action = (type, row) => {
  actionType.value = type
  dialogVisible.value = true
  currentRow.value = row
}
</script>
