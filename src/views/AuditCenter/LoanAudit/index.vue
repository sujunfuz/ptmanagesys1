<template>
  <ContentWrap v-hasPermi="'settlement:finSettlement:preSettleList'">
    <Search :schema="searchSchema" @search="setSearchParams" @reset="setSearchParams" />
  </ContentWrap>
  <ContentWrap class="mt-20px flex-1" :isBlock="false">
    <Table
      v-if="dataList.length != 0"
      :columns="allSchemas.tableColumns"
      :data="dataList"
      :loading="loading"
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :pagination="{
        total: total,
        layout: ' ->, total, sizes, prev, pager, next, jumper',
        pageSize: pageSize,
        currentPage: currentPage
      }"
    />
    <Empty v-else />
  </ContentWrap>
</template>
<script setup lang="tsx">
import Empty from '@/components/customComponents/Empty/index.vue'
import { Search } from '@/components/Search'
import { FormSchema } from '@/components/Form'
import { reactive, ref, onMounted, unref } from 'vue'
import { ContentWrap } from '@/components/ContentWrap'
import { Table, TableColumn } from '@/components/Table'
import { ElTag } from 'element-plus'
import { useTable } from '@/hooks/web/useTable'
import { useRouter } from 'vue-router'
import { useI18n } from '@/hooks/web/useI18n'
import { getPageTopApi, getPageListApi } from '@/api/loanAudit/index'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'

const { t } = useI18n()
const { push } = useRouter()

onMounted(() => {
  init()
})

const auditStatusEnum = ref()
const settStatusEnum = ref()
const init = async () => {
  const res = await getPageTopApi()
  if (res.code == 200) {
    auditStatusEnum.value = res.data.auditStatusEnum
    settStatusEnum.value = res.data.settStatusEnum
  }
  getList()
}

const searchSchema = reactive<FormSchema[]>([
  {
    field: 'companyName',
    label: '',
    component: 'Input',
    componentProps: {
      slots: {
        prepend: () => <div>{t('myAccount.name')}</div>
      }
    }
  },
  {
    field: 'auditStatus',
    label: '',
    component: 'Select',
    componentProps: {
      options: auditStatusEnum,
      slots: {
        prefix: () => t('AuditCenter.AuditList.auditStatus')
      }
    }
  },
  {
    field: 'settStatus',
    label: '',
    component: 'Select',
    componentProps: {
      options: settStatusEnum,
      slots: {
        prefix: () => t('withdrawalAudit.sub1')
      }
    }
  }
])
// 表格
const crudSchemas = reactive<CrudSchema[]>([
  {
    field: 'companyName',
    label: t('merchant.name')
  },
  {
    field: 'account',
    label: t('withdrawalAudit.sub2')
  },
  {
    field: 'waitSettPayment',
    label: t('loanAudit.sub1')
  },
  {
    field: 'creditAmount',
    label: t('loanAudit.sub2')
  },
  {
    field: 'settAmount',
    label: t('loanAudit.sub3')
  },
  {
    field: 'currencyName',
    label: t('withdrawalAudit.sub4')
  },

  {
    field: 'auditStatus',
    label: t('AuditCenter.AuditList.auditStatus'),
    slots: {
      default: (data) => {
        const status = data.row.auditStatus
        return (
          <ElTag
            type={
              status == 'SUCCESS_AUDIT' ? 'success' : status == 'WAIT_AUDIT' ? 'warning' : 'danger'
            }
          >
            {data.row.auditStatusStr}
          </ElTag>
        )
      }
    }
  },
  {
    field: 'settStatus',
    label: t('withdrawalAudit.sub7'),
    slots: {
      default: (data) => {
        const status = data.row.settStatus
        return (
          <ElTag
            type={status == 'SETTLED' ? 'success' : status == 'WAIT_SETTLE' ? 'warning' : 'danger'}
          >
            {data.row.settStatusStr}
          </ElTag>
        )
      }
    }
  },
  {
    field: 'createTime',
    label: t('withdrawalAudit.sub8')
  },
  {
    field: 'settDate',
    label: t('withdrawalAudit.sub9')
  },
  {
    field: 'action',
    label: t('project.operations'),
    width: '100px',
    slots: {
      default: (data) => {
        return (
          <span
            class="clickAction"
            v-hasPermi="settlement:finSettlement:preSettleDetail"
            onClick={() => {
              push({ path: '/auditcenter/loanAudit/loanAuditDetail', query: { id: data.row.id } })
            }}
          >
            {t('project.detail')}
          </span>
        )
      }
    }
  }
])

const { allSchemas } = useCrudSchemas(crudSchemas)

const searchParams = ref({})
const setSearchParams = (params: any) => {
  searchParams.value = params
  getList()
}

const { tableMethods, tableState } = useTable({
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
const { currentPage, pageSize, total, dataList, loading } = tableState

const { getList, getElTableExpose } = tableMethods
</script>
<style scoped lang="less"></style>
