<template>
  <ContentWrap>
    <div class="flex justify-between">
      <Search
        v-hasPermi="'financialCenter:finPayChannel:list'"
        :schema="searchSchema"
        @search="setSearchParams"
        @reset="setSearchParams"
      />
      <ElButton
        v-hasPermi="'financialCenter:finPayChannel:add'"
        type="primary"
        @click="AddAction"
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
      @select="handleSelectionChange"
      @select-all="handleSelectionAllChange"
      @register="tableRegister"
      :pagination="{
        total,
        layout: ' ->, total, sizes, prev, pager, next, jumper'
      }"
    />
  </ContentWrap>

  <Dialog v-model="dialogVisible" :title="dialogTitle">
    <Write
      ref="writeRef"
      :currentRow="currentRow"
      :channelType="channelType"
      :status="status"
      :actionType="actionType"
      :payType="payType"
      :channelName="channelName"
      :channelBelong="channelBelong"
      :currencyEnum="currencyEnum"
      :dataArr1="dataArr"
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
import { ElButton, ElTag, ElRadioButton, ElCascader, ElMessage } from 'element-plus'
import {
  getPageTopApi,
  getPageListApi,
  deleteApi,
  getPageListByIdApi,
  addDataListApi,
  editDataListApi,
  updateApiConfigApi,
  getApiConfigApi
} from '@/api/paymentChannel/index'
import { getCurrencyApi } from '@/api/RuleManage/monetaryRule'
import type { DepartmentUserItem } from '@/api/department/types'
import { useTable } from '@/hooks/web/useTable'
import { Search } from '@/components/Search'
import Write from './components/Write.vue'
import { Dialog } from '@/components/Dialog'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { SelectOption, FormSchema } from '@/components/Form'
import { Table } from '@/components/Table'
import { tableStatusStyleTag } from '@/utils/componentUtils'

const { t } = useI18n()

onMounted(() => {
  init()
})

const channelType = ref()
const status = ref()
const payType = ref()
const channelName = ref()
const channelBelong = ref()
const currencyEnum = ref()
const init = async () => {
  const res = await getPageTopApi()
  if (res.code == 200) {
    channelType.value = res.data.channelType
    status.value = res.data.status
    payType.value = res.data.payType
    channelName.value = res.data.channelName
    channelBelong.value = res.data.channelBelong
  }
  const res1 = await getCurrencyApi()

  if (res1.code == 200) {
    currencyEnum.value = []
    for (var item in res1.data) {
      currencyEnum.value.push({
        label: res1.data[item].currencyName,
        value: res1.data[item].currencyCode
      })
    }
  }
  getList()
}

const searchSchema = reactive<FormSchema[]>([
  {
    field: 'channelType',
    label: '',
    component: 'Select',
    componentProps: {
      options: channelType,
      slots: {
        prefix: () => <div>{t('paymentChannel.type')}</div>
      }
    }
  },
  {
    field: 'status',
    label: '',
    component: 'Select',
    componentProps: {
      options: status,
      slots: {
        prefix: () => <div>{t('paymentChannel.status')}</div>
      }
    }
  }
])

const { tableRegister, tableState, tableMethods } = useTable({
  fetchDataApi: async () => {
    const { pageSize, currentPage } = tableState
    const res = await getPageListApi({
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
    const res = await deleteApi(unref(ids))
    return res
  },
  immediate: false
})
const { total, loading, dataList, pageSize, currentPage } = tableState
const { getList, getElTableExpose, delList } = tableMethods

const crudSchemas = reactive<CrudSchema[]>([
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
    field: 'channelName',
    label: t('paymentChannel.code'),
    search: {
      hidden: true
    }
  },
  {
    field: 'channelTypeStr',
    label: t('paymentChannel.type'),
    search: {
      hidden: true
    }
  },
  // {
  //   field: 'payTypeStr',
  //   label: t('paymentChannel.pay'),
  //   search: {
  //     hidden: true
  //   }
  // },
  {
    field: 'currencyName',
    label: t('paymentChannel.sub1'),
    search: {
      hidden: true
    }
  },
  {
    field: 'sort',
    label: t('paymentChannel.sort'),
    search: {
      hidden: true
    }
  },
  {
    field: 'status',
    label: t('paymentChannel.sub3'),
    search: {
      hidden: true
    },
    formatter: (data: any) => {
      const status = data.status || ''
      const statusStr = data.statusStr || ''
      return <ElTag type={status == 'NORMAL' ? 'success' : 'danger'}>{statusStr}</ElTag>
    }
  },
  {
    field: 'remark',
    label: t('paymentChannel.remark'),
    search: {
      hidden: true
    }
  },
  {
    field: 'editTimeStr',
    label: t('paymentChannel.time'),
    search: {
      hidden: true
    }
  },
  {
    field: 'action',
    label: t('userDemo.action'),
    table: {
      width: 200,
      fixed: 'right',
      slots: {
        default: (data: any) => {
          const row = data.row as DepartmentUserItem
          return (
            <>
              <div class="[&>span]:(cursor-pointer m-2) flex flex-wrap colorMain ">
                <span
                  v-hasPermi="financialCenter:finPayChannel:edit"
                  onClick={() => action(row, 'edit')}
                >
                  {' '}
                  {t('project.edit')}{' '}
                </span>
                <span
                  v-hasPermi="financialCenter:finPayChannel:delete"
                  class="color-red-500"
                  onClick={() => delData(row)}
                >
                  {t('role.delete')}
                </span>
                <span onClick={() => action(row, 'ApiSet')}> {t('common.b19')} </span>
              </div>
            </>
          )
        }
      }
    }
  }
])

const { allSchemas } = useCrudSchemas(crudSchemas)

const searchParams = ref({})
const setSearchParams = (params: any) => {
  currentPage.value = 1
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
  dialogTitle.value = t('project.add') + t('paymentChannel.name1')
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

const dataArr = ref()

const action = async (row: any, type: string) => {
  switch (type) {
    case 'view':
      const res = await getPageListByIdApi({ id: row.id })
      currentRow.value = res.data
      actionType.value = type
      dialogTitle.value = t('project.view') + t('paymentChannel.name1')
      break
    case 'edit':
      const res1 = await getPageListByIdApi({ id: row.id })
      currentRow.value = res1.data
      actionType.value = type
      dialogTitle.value = t('project.edit') + t('paymentChannel.name1')
      if (currentRow.value.channelBelong) {
        currentRow.value.channelBelong = currentRow.value.channelBelong.split(',')
      }
      break
    case 'ApiSet':
      const res3 = await getApiConfigApi({ id: row.id })
      currentRow.value = res3.data
      actionType.value = type
      dialogTitle.value = t('common.b23')
      if (currentRow.value.data) {
        dataArr.value = JSON.parse(currentRow.value.data)
      } else {
        dataArr.value = [{ key: '', value: '' }]
      }
      break
  }
  dialogVisible.value = true
}

const writeRef = ref<ComponentRef<typeof Write>>()

const saveLoading = ref(false)

const save = async () => {
  const write = unref(writeRef)
  let formData = await write?.submit()
  if (formData) {
    saveLoading.value = true
    let res
    try {
      if (actionType.value == 'add') {
        res = await addDataListApi({ ...formData, channelBelong: formData.channelBelong + '' })
        if (res.code == 200) {
          ElMessage.success(t('common.operateSuccess'))
        }
      } else if (actionType.value == 'edit') {
        res = await editDataListApi({ ...formData, channelBelong: formData.channelBelong + '' })
        if (res.code == 200) {
          ElMessage.success(t('common.operateSuccess'))
        }
      } else if (actionType.value == 'ApiSet') {
        res = await updateApiConfigApi({ ...formData, data: JSON.stringify(formData.data) || '' })
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
