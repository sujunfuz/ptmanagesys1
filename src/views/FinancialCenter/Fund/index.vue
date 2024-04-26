<template>
  <ContentWrap v-hasPermi="'meraccounthistory:merAccountHistory:list'">
    <Search :schema="schema" @reset="setSearchParams" @search="setSearchParams" />
  </ContentWrap>
  <ContentWrap class="mt-20px flex-1" :isBlock="false">
    <div class="flex flex-items-center p-20px">
      <div class="flex-c">
        <span class="subString"
          >{{ t('project.yisel') }}<span class="colorMain">&nbsp;{{ chooseCount }}&nbsp;</span
          >{{ t('account.sub10') }}</span
        >
        <div
          class="aCustomBtn !w-96px"
          :class="chooseCount > 0 ? 'customBtnHover' : ''"
          @click="exportMerAccountHistory()"
          v-hasPermi="'meraccounthistory:merAccountHistory:export'"
        >
          {{ t('account.export') }}
        </div>
      </div>
    </div>

    <Table
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :columns="allSchemas.tableColumns"
      @select="handleSelectionChange"
      @select-all="handleSelectionAllChange"
      :data="dataList"
      :loading="loading"
      @register="tableRegister"
      :pagination="{
        total,
        layout: ' ->, total, sizes, prev, pager, next, jumper'
      }"
    />
  </ContentWrap>
</template>

<script lang="tsx" setup>
import { ContentWrap } from '@/components/ContentWrap'
import { ElButton, ElMessage, ElTag } from 'element-plus'
import { ref, reactive, unref, onMounted } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import { Table } from '@/components/Table'
import { Search } from '@/components/Search'
import { FormSchema } from '@/components/Form'
import { useTable } from '@/hooks/web/useTable'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { useRouter } from 'vue-router'
import {
  getPageTopApi,
  getPageListApi,
  exportMerAccountHistoryApi
} from '@/api/financialCenter/fund'

const chooseCount = ref(0)
const { push } = useRouter()

const dialogVisible = ref(false)
const saveLoading = ref(false)

const { t } = useI18n()
const currentRow = ref<any>()

const searchParams = ref({})
const setSearchParams = (params: any) => {
  currentPage.value = 1
  searchParams.value = params
  getList()
}

const exportMerAccountHistory = async () => {
  if (chooseIdsList.value.length > 0) {
    const res = await exportMerAccountHistoryApi(chooseIdsList.value)
    if (res) {
      let downloadElement = document.createElement('a')
      let href = window.URL.createObjectURL(res as unknown as Blob) // 创建下载的链接
      downloadElement.href = href
      downloadElement.download = new Date().getTime() + '.xlsx' // 下载后文件名
      document.body.appendChild(downloadElement)
      downloadElement.click() // 点击下载
      document.body.removeChild(downloadElement) // 下载完成移除元素
      window.URL.revokeObjectURL(href) // 释放blob对象
    }
  } else {
    ElMessage.warning(t('common.a5'))
  }
}

// 表格选择
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
      total: res.data.total || 0
    }
  },
  immediate: false
})
const { total, loading, dataList, pageSize, currentPage } = tableState
const { getList, getElTableExpose, delList } = tableMethods

onMounted(() => {
  init()
})

const accountHistoryTypeEnum = ref()
const init = async () => {
  const res = await getPageTopApi()
  accountHistoryTypeEnum.value = res.data.MerAccountHistorySourceTypeEnum
  getList()
}

const action = (row: any, type: string) => {
  currentRow.value = row
  dialogVisible.value = true
}
const schema = reactive<FormSchema[]>([
  {
    field: 'sourceType',
    label: '',
    component: 'Select',
    componentProps: {
      options: accountHistoryTypeEnum,
      slots: {
        prefix: () => <div>{t('account.type')}</div>
      }
    }
  }
])

const crudSchemas = reactive<CrudSchema[]>([
  {
    field: 'selection',
    search: {
      hidden: true
    },
    form: {
      hidden: true
    },
    detail: {
      hidden: true
    },
    table: {
      type: 'selection'
    }
  },
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
    field: 'sourceTypeStr',
    label: t('account.type'),
    search: {
      hidden: true
    }
  },
  {
    field: 'accountTypeStr',
    label: t('account.sub11'),
    search: {
      hidden: true
    }
  },
  {
    field: 'totalAmount',
    label: t('account.money'),
    search: {
      hidden: true
    },
    table: {
      slots: {
        default: (data: any) => {
          const row = data.row
          return (
            <>
              {row.towords == 'SUB' || row.towords == 'EXPENSE' ? '-' : '+'}
              {row.amount || 0}
            </>
          )
        }
      }
    }
  },
  {
    field: 'trxNo',
    label: t('account.id'),
    search: {
      hidden: true
    }
  },
  {
    field: 'serverAmount',
    label: t('account.service'),
    search: {
      hidden: true
    }
  },
  {
    field: 'tradeStatusStr',
    label: t('account.status'),
    search: {
      hidden: true
    },
    table: {
      slots: {
        default: (data: any) => {
          const row = data.row
          if (row.tradeStatusStr) {
            return (
              <>
                <ElTag
                  type={
                    row.tradeStatus === 'MER_ACCOUNT_HISTORY_TRADE_STATUS_WAIT_DELIVERY'
                      ? 'success'
                      : 'warning'
                  }
                >
                  {row.tradeStatusStr}
                </ElTag>
              </>
            )
          } else {
            return (
              <>
                <div>-</div>
              </>
            )
          }
        }
      }
    }
  },
  {
    field: 'createTimeStr',
    label: t('account.time'),
    search: {
      hidden: true
    }
  }
  // {
  //   field: 'action',
  //   label: t('userDemo.action'),
  //   form: {
  //     hidden: true
  //   },
  //   detail: {
  //     hidden: true
  //   },
  //   search: {
  //     hidden: true
  //   },
  //   table: {
  //     slots: {
  //       default: (data: any) => {
  //         const row = data.row
  //         return (
  //           <>
  //             <div class="[&>span]:(cursor-pointer m-2) flex flex-wrap colorMain ">
  //               <span onClick={() => push('/usermanage/merchant/specifics')}>
  //                 {' '}
  //                 {t('project.detail')}{' '}
  //               </span>
  //             </div>
  //           </>
  //         )
  //       }
  //     }
  //   }
  // }
])

const { allSchemas } = useCrudSchemas(crudSchemas)

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
</script>

<style lang="less" scoped>
.subString {
  color: #747474;
  font-size: 14px;
  margin-right: 10px;
}
</style>
