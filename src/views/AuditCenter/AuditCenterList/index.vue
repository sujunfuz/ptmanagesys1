<template>
  <ContentWrap>
    <Search
      v-hasPermi="'mer:merintopieces:list'"
      :schema="searchSchema"
      @search="searchAuditList"
      @reset="searchAuditList"
    />
  </ContentWrap>
  <ContentWrap class="mt-20px flex-1" :isBlock="false">
    <Table
      v-if="dataList.length != 0"
      :columns="tableSchema"
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
import { onMounted, reactive } from 'vue'
import { Search } from '@/components/Search'
import { FormSchema } from '@/components/Form'
import { Table, TableColumn } from '@/components/Table'
import { ref } from 'vue'
import { ElTag } from 'element-plus'
import { useTable } from '@/hooks/web/useTable'
import { useRouter } from 'vue-router'
import { useI18n } from '@/hooks/web/useI18n'
import { ContentWrap } from '@/components/ContentWrap'
import { useAppStore } from '@/store/modules/app'
const appStore = useAppStore()
appStore.setRenderLoading(true)
const { t } = useI18n()
const { push } = useRouter()
import { getMerchantPageTopApi, getMerchantListApi } from '@/api/auditCenter/merchantSettlement'
import { unref } from 'vue'
// 静态枚举值
const manageModel = ref()
const auditStatusEnum = ref()
//输入框
const searchParam = ref<any>({})
const searchAuditList = (val) => {
  searchParam.value = val
  currentPage.value = 1
  pageSize.value = 10
  getList()
}

const searchSchema = reactive<FormSchema[]>([
  {
    field: 'merchantName',
    label: '',
    component: 'Input',
    componentProps: {
      slots: {
        prepend: () => <div>{t('AuditCenter.AuditList.corporateName')}</div>
      }
    }
  },
  {
    field: 'managementModel',
    label: '',
    component: 'Select',
    componentProps: {
      options: manageModel,
      slots: {
        prefix: () => t('AuditCenter.AuditList.managementModel')
      }
    }
  },
  {
    field: 'startTime',
    label: '',
    component: 'DatePicker',
    componentProps: {
      type: 'datetimerange',
      valueFormat: 'YYYY-MM-DD HH:mm:ss'
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
  }
])
//表格
const constantSchema: TableColumn[] = [
  {
    field: 'merchantName',
    label: t('merchant.name')
  },
  {
    field: 'managementModelStr',
    label: t('merchant.mode')
  },
  {
    field: 'applicantName',
    label: t('merchant.applicant')
  },
  {
    field: 'applicantEmail',
    label: t('merchant.email')
  },
  {
    field: 'applicantMobile',
    label: t('merchant.iphone')
  },
  {
    field: 'guarantor',
    label: t('merchant.guarantor')
  },
  {
    field: 'auditStatus',
    label: t('AuditCenter.productReview.status'),
    slots: {
      default: (data) => {
        const { auditStatus, auditStatusStr } = data.row
        const renderTag = () => {
          if (
            auditStatus == auditStatusEnum.value[1].value ||
            auditStatus == auditStatusEnum.value[2].value
          ) {
            return (
              <ElTag effect="light" type="success">
                {auditStatusStr}
              </ElTag>
            )
          } else if (auditStatus == auditStatusEnum.value[0].value) {
            return (
              <ElTag effect="light" type="warning">
                {auditStatusStr}
              </ElTag>
            )
          } else {
            return (
              <ElTag effect="light" type="danger">
                {auditStatusStr}
              </ElTag>
            )
          }
        }

        return <>{renderTag()}</>
      }
    }
  },
  {
    field: 'createTime',
    label: t('AuditCenter.productReview.time')
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
            v-hasPermi="mer:merintopieces:detail"
            onClick={() => {
              push({
                path: '/auditcenter/list/auditlistdetail',
                query: {
                  id: data.row.id
                }
              })
            }}
          >
            {t('review.detail1')}
          </span>
        )
      }
    }
  }
]
const tableSchema = ref<TableColumn[]>(constantSchema)

const { tableMethods, tableState } = useTable({
  fetchDataApi: async () => {
    const res = await getMerchantListApi({
      ...unref(searchParam),
      startTime: searchParam.value.startTime ? searchParam.value.startTime[0] : '',
      endTime: searchParam.value.startTime ? searchParam.value.startTime[1] : '',
      currentPage: currentPage.value,
      pageSize: pageSize.value
    })
    return {
      list: res.data.list || [],
      total: res.data.total || 0
    }
  },
  immediate: false
})
const { getList } = tableMethods
const { currentPage, pageSize, total, dataList, loading } = tableState
onMounted(() => {
  init()
})
const init = async () => {
  const res = await getMerchantPageTopApi()
  manageModel.value = res.data.manageModel
  auditStatusEnum.value = res.data.auditStatusEnum
  getList()
}
</script>
<style scoped lang="less">
// @prefix-tab: ~'@{namespace}-table__header';
// .@{prefix-tab} {
//   display: none;
// }
</style>
