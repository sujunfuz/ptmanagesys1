<template>
  <ContentWrap v-hasPermi="'meraccountauthrecord:merAccountAuthRecord:list'">
    <div class="flex justify-between">
      <Search :schema="searchSchema" @search="setSearchParams" @reset="setSearchParams" />
    </div>
  </ContentWrap>

  <ContentWrap class="mt-20px flex-1" :isBlock="false">
    <Table v-if="dataList.length != 0" v-model:current-page="currentPage" v-model:page-size="pageSize"
      :columns="allSchemas.tableColumns" :data="dataList" :loading="loading" @select="handleSelectionChange"
      @select-all="handleSelectionAllChange" @register="tableRegister" :pagination="{
        total,
        layout: ' ->, total, sizes, prev, pager, next, jumper'
      }" />
    <Empty v-else />
  </ContentWrap>

  <Dialog v-model="dialogVisible" :title="dialogTitle" max-height="130px">
    <Write ref="writeRef" :currentRow="currentRow" />

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
import { ElButton, ElRadioGroup, ElRadioButton, ElMessageBox, ElMessage, ElTag } from 'element-plus'
import { getPageTopApi, getPageListApi, editApi } from '@/api/auditCenter/accountAuthentication'
import type { DepartmentUserItem } from '@/api/department/types'
import { useTable } from '@/hooks/web/useTable'
import { Search } from '@/components/Search'
import Empty from '@/components/customComponents/Empty/index.vue'
import Write from './components/Write.vue'
import { Dialog } from '@/components/Dialog'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { SelectOption, FormSchema } from '@/components/Form'
import { Table } from '@/components/Table'
import { tableStatusStyleTag } from '@/utils/componentUtils'
import { dateTimeRange } from '@/utils/time'


const { t } = useI18n()
//选择器状态枚举值
const statusEnum = ref()
onMounted(() => {
  init()
})

const searchSchema = reactive<FormSchema[]>([
  {
    field: 'companyName',
    label: '',
    component: 'Input',
    componentProps: {
      slots: {
        prepend: () => <div>{t('accountAuthentication.danwei')}</div>
      }
    }
  },
  {
    field: 'status',
    label: '',
    component: 'Select',
    componentProps: {
      options: statusEnum,
      slots: {
        prefix: () => t('project.status')
      }
    }
  },
  {
    field: 'time',
    component: 'DatePicker',
    componentProps: dateTimeRange()
  }
])

const init = async () => {
  const res = await getPageTopApi()
  if (res) {
    statusEnum.value = res.data.status
    getList()
  }
}

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
    field: 'companyName',
    label: t('accountAuthentication.name'),
    search: {
      hidden: true
    }
  },
  {
    field: 'bankName',
    label: t('accountAuthentication.sub1'),
    search: {
      hidden: true
    }
  },
  {
    field: 'subbranchName',
    label: t('accountAuthentication.sub2'),
    search: {
      hidden: true
    }
  },
  {
    field: 'bankNo',
    label: t('accountAuthentication.sub3'),
    search: {
      hidden: true
    }
  },
  {
    field: 'createTimeStr',
    label: t('accountAuthentication.sub4'),
    search: {
      hidden: true
    }
  },
  {
    field: 'editTimeStr',
    label: t('accountAuthentication.sub5'),
    search: {
      hidden: true
    },
    table: {
      slots: {
        default: (data) => {
          return (
            <div>
              {data.row.status == 'MER_ACCOUNT_PAY_STATUS_ENUM_HAVE_PAY' ? data.row.editTimeStr : '-'}
            </div>
          )
        }
      }
    }
  },
  {
    field: 'amount',
    label: t('accountAuthentication.sub6'),
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
      return (
        <>
          <ElTag
            type={
              status == 'MER_ACCOUNT_PAY_STATUS_ENUM_HAVE_PAY'
                ? 'success'
                : status == 'MER_ACCOUNT_PAY_STATUS_ENUM_FAILED_PAY'
                  ? 'danger'
                  : 'warning'
            }
          >
            {data.statusStr}
          </ElTag>
        </>
      )
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
              <div
                v-show={row.status != 'MER_ACCOUNT_PAY_STATUS_ENUM_HAVE_PAY'}
                class="[&>span]:(cursor-pointer m-2) flex flex-wrap colorMain "
              >
                <span
                  v-hasPermi="meraccountauthrecord:merAccountAuthRecord:edit"
                  v-show={row.status == 'MER_ACCOUNT_PAY_STATUS_ENUM_WAIT_PAY'}
                  onClick={() => getMessageBox(row.id)}
                >
                  {' '}
                  {t('accountAuthentication.action1')}{' '}
                </span>
                <span
                  v-hasPermi="meraccountauthrecord:merAccountAuthRecord:edit"
                  v-show={row.status == 'MER_ACCOUNT_PAY_STATUS_ENUM_WAIT_PAY'}
                  onClick={() => action(row)}
                >
                  {' '}
                  {t('accountAuthentication.action2')}{' '}
                </span>
                {/* <span class="color-red-500" onClick={() => delData(row)}>
                  {t('role.delete')}
                </span> */}
              </div>
            </>
          )
        }
      }
    }
  }
])

const getMessageBox = (id) => {
  ElMessageBox.confirm(t('accountAuthentication.sub8'), t('accountAuthentication.action1'), {
    confirmButtonText: t('project.confirm'),
    cancelButtonText: t('project.cancel')
  })
    .then(async () => {
      const res = await editApi({
        id: id,
        status: 'MER_ACCOUNT_PAY_STATUS_ENUM_HAVE_PAY'
      })
      if (res.code == 200) {
        ElMessage.success(t('common.operateSuccess'))
        getList()
      }
    })
    .catch(() => { })
}
const { allSchemas } = useCrudSchemas(crudSchemas)

const searchParams = ref<any>({})
const setSearchParams = (params: any) => {
  searchParams.value = params
  if (searchParams.value.time) {
    searchParams.value.startTime = searchParams.value.time[0]
    searchParams.value.endTime = searchParams.value.time[1]
  }
  currentPage.value = 1
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

const id = ref()
const action = (row: any) => {
  currentRow.value = row
  dialogTitle.value = t('accountAuthentication.sub10')
  id.value = row.id
  dialogVisible.value = true
}

const writeRef = ref<ComponentRef<typeof Write>>()

const saveLoading = ref(false)

const save = async (id) => {
  const write = unref(writeRef)
  let formData = await write?.submit()

  if (formData) {
    saveLoading.value = true
    try {
      const res = await editApi({
        id: id.value,
        ...formData,
        status: 'MER_ACCOUNT_PAY_STATUS_ENUM_FAILED_PAY'
      })
      if (res.code == 200) {
        ElMessage.success(t('common.operateSuccess'))
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
