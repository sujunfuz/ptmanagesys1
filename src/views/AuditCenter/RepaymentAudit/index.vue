<template>
  <ContentWrap v-hasPermi="'settlement:finRepayRecord:list'">
    <div class="flex justify-between">
      <Search :schema="searchSchema" @search="setSearchParams" @reset="setSearchParams" />
      <!-- <ElButton type="primary" @click="AddAction">{{ t('project.add') }}</ElButton> -->
    </div>
  </ContentWrap>

  <ContentWrap class="mt-20px flex-1" :isBlock="false">
    <Table
      v-if="dataList.length != 0"
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
    <Empty v-else />
  </ContentWrap>
</template>

<script setup lang="tsx">
import { ContentWrap } from '@/components/ContentWrap'
import { useI18n } from '@/hooks/web/useI18n'
import Empty from '@/components/customComponents/Empty/index.vue'
import { ref, unref, reactive, onMounted } from 'vue'
import { ElButton, ElRadioGroup, ElRadioButton, ElCascader, ElMessage, ElTag } from 'element-plus'
import { getPageTopApi, getPageListApi } from '@/api/auditCenter/repaymentAudit'
import type { DepartmentUserItem } from '@/api/department/types'
import { useTable } from '@/hooks/web/useTable'
import { Search } from '@/components/Search'
import Write from './components/Write.vue'
import { Dialog } from '@/components/Dialog'
import { useRouter } from 'vue-router'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { SelectOption, FormSchema } from '@/components/Form'
import { Table } from '@/components/Table'
import { tableStatusStyleTag } from '@/utils/componentUtils'
import { log } from 'console'

const { t } = useI18n()
const { back, push, currentRoute } = useRouter()

onMounted(() => {
  init()
})
const auditStatusEnum = ref()
const searchSchema = reactive<FormSchema[]>([
  {
    field: 'auditStatus',
    label: '',
    component: 'Select',
    componentProps: {
      options: auditStatusEnum,
      slots: {
        prefix: () => <div>{t('repaymentAudit.sub1')}</div>
      }
    }
  }
])

const init = async () => {
  const res = await getPageTopApi()
  if (res.code == 200) {
    auditStatusEnum.value = res.data.auditStatusEnum
  }
  getList()
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
    label: t('repaymentAudit.sub2'),
    search: {
      hidden: true
    }
  },
  {
    field: 'repayAmount',
    label: t('repaymentAudit.sub3'),
    search: {
      hidden: true
    }
  },
  {
    field: 'repayInterest',
    label: t('repaymentAudit.sub4'),
    search: {
      hidden: true
    }
  },
  {
    field: 'totalAmount',
    label: t('repaymentAudit.sub5'),
    search: {
      hidden: true
    }
  },
  {
    field: 'createTimeStr',
    label: t('repaymentAudit.sub6'),
    search: {
      hidden: true
    }
  },
  {
    field: 'auditStatus',
    label: t('repaymentAudit.sub7'),
    search: {
      hidden: true
    },
    slots: {
      default: (data: any) => {
        const status = data.row.auditStatus
        return (
          <>
            <ElTag
              type={
                status == 'SUCCESS_AUDIT' ? 'success' : status == 'FAIL_AUDIT' ? 'info' : 'warning'
              }
            >
              {data.row.auditStatusStr}
            </ElTag>
          </>
        )
      }
    }
  },
  {
    field: 'action',
    label: t('userDemo.action'),
    table: {
      width: 100,
      fixed: 'right',
      slots: {
        default: (data: any) => {
          const row = data.row as DepartmentUserItem
          return (
            <>
              <div class="[&>span]:(cursor-pointer m-2) flex flex-wrap colorMain ">
                <span
                  v-hasPermi="settlement:finRepayRecord:detail"
                  onClick={() =>
                    push({
                      path: '/AuditCenter/RepaymentAudit/RepaymentDetail',
                      query: { id: row.id }
                    })
                  }
                >
                  {' '}
                  {t('project.detail')}{' '}
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

const action = (row: any, type: string) => {
  switch (type) {
    case 'view':
      dialogTitle.value = t('project.view') + t('paymentChannel.name1')
      break
    case 'edit':
      dialogTitle.value = t('project.edit') + t('paymentChannel.name1')
      break
  }

  currentRow.value = row
  actionType.value = type
  dialogVisible.value = true
}
</script>

<style lang="less" scoped>
.subString {
  color: #747474;
  font-size: 14px;
}
</style>
