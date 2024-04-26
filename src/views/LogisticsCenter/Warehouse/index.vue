<template>
  <ContentWrap>
    <div class="flex-b">
      <Search
        v-hasPermi="'logisticsCenter:rpWarehouse:list'"
        :schema="schema"
        @reset="setSearchParams"
        @search="setSearchParams"
      />
      <ElButton
        v-hasPermi="'logisticsCenter:rpWarehouse:add'"
        type="primary"
        @click="action('add', {})"
        >{{ t('project.add') }}</ElButton
      >
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

  <Dialog v-model="dialogVisible" :title="t('common.f')">
    <Write
      ref="writeRef"
      :current-row="currentRow"
      :public-enum="publicEnum"
      :area-data="areaData"
    />
    <template #footer>
      <ElButton @click="dialogVisible = false">{{ t('common.cancel') }}</ElButton>
      <ElButton type="primary" :loading="saveLoading" @click="submit">
        {{ t('project.confirm') }}
      </ElButton>
    </template>
  </Dialog>
</template>

<script lang="tsx" setup>
import { ContentWrap } from '@/components/ContentWrap'
import { Dialog } from '@/components/Dialog'
import { ElButton, ElMessage } from 'element-plus'
import Write from './components/add.vue'
import { ref, reactive, unref, onMounted } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import { Table } from '@/components/Table'
import { Search } from '@/components/Search'
import { FormSchema } from '@/components/Form'
import { useTable } from '@/hooks/web/useTable'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import {
  getWarehousePageTopApi,
  getWarehouseListApi,
  deleteWarehouseByBatchNoApi,
  getAllAreaApi,
  addWarehouseApi,
  editWarehouseApi
} from '@/api/LogisticsCenter/warehouse'
import { useAppStore } from '@/store/modules/app'
import { useStorage } from '@/hooks/web/useStorage'
const { getStorage } = useStorage('localStorage')
const appStore = useAppStore()
appStore.setRenderLoading(true)
const userInfo = getStorage('ptUserInfo')
const publicEnum = ref<any>()
const areaData = ref<any>([])
const dialogVisible = ref(false)
const dialogType = ref('')
const saveLoading = ref(false)
const currentRow = ref<any>({})
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
    const res = await getWarehouseListApi({
      currentPage: unref(currentPage),
      pageSize: unref(pageSize),
      ...unref(searchParams)
    })
    res.data.list.forEach((item) => {
      item.areaCode = item.areaCode.split(',')
    })
    console.log(res.data.list)
    return {
      list: res.data.list || [],
      total: res.data.total || 0
    }
  },
  fetchDelApi: async () => {
    const res = await deleteWarehouseByBatchNoApi([currentRow.value.id])
    return res
  },
  immediate: false
})
const { total, loading, dataList, pageSize, currentPage } = tableState
const { getList, getElTableExpose, delList } = tableMethods

const schema = reactive<FormSchema[]>([
  {
    field: 'warehouseName',
    label: '',
    component: 'Input',
    componentProps: {
      slots: {
        prepend: () => <div>{t('Warehouse.name')}</div>
      }
    }
  }
])

const crudSchemas = reactive<CrudSchema[]>([
  {
    field: 'warehouseName',
    label: t('Warehouse.name'),
    search: {
      hidden: true
    }
  },
  {
    field: 'areaName',
    label: t('Warehouse.address'),
    search: {
      hidden: true
    },
    table: {
      slots: {
        default: (data) => {
          return <div>{data.row.areaName + data.row.fullAddress}</div>
        }
      }
    }
  },
  {
    field: 'zipcode',
    label: t('Warehouse.code'),
    search: {
      hidden: true
    }
  },
  {
    field: 'isDefaultStr',
    label: t('Warehouse.isDefault'),
    search: {
      hidden: true
    }
  },
  {
    field: 'contactBy',
    label: t('Warehouse.contacts'),
    search: {
      hidden: true
    }
  },
  {
    field: 'contactPhone',
    label: t('Warehouse.iphone'),
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
          let row = data.row
          return (
            <>
              <div class="[&>span]:(cursor-pointer m-2) flex flex-wrap colorMain ">
                <span
                  v-hasPermi="logisticsCenter:rpWarehouse:edit"
                  onClick={() => action('edit', row)}
                >
                  {' '}
                  {t('project.edit')}{' '}
                </span>
                <span
                  class="color-red-500"
                  v-hasPermi="logisticsCenter:rpWarehouse:delete"
                  onClick={() => {
                    currentRow.value = data.row
                    delList(1)
                  }}
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

onMounted(async () => {
  const res = await getWarehousePageTopApi()
  publicEnum.value = res.data.publicEnum
  await getList()
  let ares = await getAllAreaApi()
  let tempArr: any = []
  ares.data[0].children.forEach((a) => {
    a.children.forEach((b) => {
      tempArr.push(b)
    })
  })
  areaData.value = tempArr
})

const action = async (type, row) => {
  dialogType.value = type
  currentRow.value = row
  dialogVisible.value = true
}

const writeRef = ref()

const submit = async () => {
  let params = await writeRef.value.submit()
  params.areaCode = params.areaCode.join(',')
  params.merchantName = userInfo.merchantName
  params.merchantNo = userInfo.topMerchantNo
  params.status = 'ACTIVE'
  let res: any = null
  if (dialogType.value == 'add') {
    res = await addWarehouseApi(params)
  } else {
    res = await editWarehouseApi(params)
  }
  if (res) {
    ElMessage.success(res.msg)
    dialogVisible.value = false
    getList()
  }
}
</script>
