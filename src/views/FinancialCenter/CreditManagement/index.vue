<template>
  <ContentWrap>
    <div class="flex justify-between items-start">
      <!-- 头部左边表格 -->
      <div class="w-1200px font-size-16px border-rd-10px border-(1px solid #E5EFFC)">
        <div
          class="bg-#e5effc flex-c [&>div]:(w-25% h-50px text-center font-bold line-height-50px color-colorMain)"
        >
          <div>{{ t('advanceSettlement.block2') }}</div>
          <div>{{ line1?.period + t('aftersalesList.day') }}</div>
          <div>{{ line2?.period + t('aftersalesList.day') }}</div>
          <div>{{ line3?.period + t('aftersalesList.day') }}</div>
          <div>{{ line4?.period + t('aftersalesList.day') }}</div>
        </div>
        <div
          class="flex-c [&>div]:(w-25% h-60px text-center line-height-60px box-border color-colorBlack)"
        >
          <div
            class="font-bold !color-colorMain"
            style="border-right: 1px solid#E5EFFC; border-bottom: 1px solid#E5EFFC"
            >{{ t('advanceSettlement.block3') }}</div
          >
          <div style="border-right: 1px solid#E5EFFC; border-bottom: 1px solid#E5EFFC"
            >{{ line1?.interestRate * 100 }}%</div
          >
          <div style="border-right: 1px solid#E5EFFC; border-bottom: 1px solid#E5EFFC"
            >{{ line2?.interestRate * 100 }}%</div
          >
          <div style="border-right: 1px solid#E5EFFC; border-bottom: 1px solid#E5EFFC"
            >{{ line3?.interestRate * 100 }}%</div
          >
          <div style="border-bottom: 1px solid#E5EFFC">{{ line4?.interestRate * 100 }}%</div>
        </div>
        <div
          class="flex-c [&>div]:(w-25% h-60px text-center box-border line-height-60px color-colorBlack)"
        >
          <div class="font-bold !color-colorMain" style="border-right: 1px solid#E5EFFC">{{
            t('advanceSettlement.block13')
          }}</div>
          <div style="border-right: 1px solid#E5EFFC">{{ line1?.overdueInterestRate * 100 }}%</div>
          <div style="border-right: 1px solid#E5EFFC">{{ line2?.overdueInterestRate * 100 }}%</div>
          <div style="border-right: 1px solid#E5EFFC">{{ line3?.overdueInterestRate * 100 }}%</div>
          <div>{{ line4?.overdueInterestRate * 100 }}%</div>
        </div>
      </div>
      <!-- 头部右边按钮 -->
      <div class="flex-c">
        <ElButton v-hasPermi="'credit:finMerCredit:edit'" @click="action(systemInfo, 'sys')">{{
          t('advanceSettlement.action')
        }}</ElButton>
        <ElButton
          v-hasPermi="'credit:finMerCredit:add'"
          type="primary"
          @click="action({}, 'add')"
          >{{ t('advanceSettlement.action1') }}</ElButton
        >
      </div>
    </div>
  </ContentWrap>

  <ContentWrap class="mt-20px flex-1" :isBlock="false">
    <div class="p-20px">
      <div class="flex-b" v-hasPermi="'credit:finMerCredit:list'">
        <Search :schema="schema" @reset="setSearchParams" @search="setSearchParams" />
      </div>
      <div class="flex flex-items-center mt-20px">
        <div class="flex-c">
          <span class="subString"
            >{{ t('project.yisel') }}<span class="colorMain">&nbsp;{{ chooseCount }}&nbsp;</span
            >{{ t('service.sub') }}</span
          >
          <div
            class="aCustomBtn !w-96px"
            @click="action(systemInfo, 'editSelect')"
            :class="selectArr.length > 0 ? 'customBtnHover' : ''"
            v-hasPermi="'credit:finMerCredit:editBatch'"
          >
            {{ t('service.manyEdit') }}
          </div>
        </div>
      </div>
    </div>

    <Table
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :columns="allSchemas.tableColumns"
      :data="dataList"
      :loading="loading"
      @register="tableRegister"
      @select="handleSelectionChange"
      @select-all="handleSelectionAllChange"
      :pagination="{
        total,
        layout: ' ->, total, sizes, prev, pager, next, jumper'
      }"
    />
  </ContentWrap>

  <Dialog v-model="dialogVisible" :title="dialogTitle" max-height="400px">
    <Write ref="writeRef" :current-row="currentRow" :action-type="actionType" />
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
import { ElButton, ElMessage, ElTag } from 'element-plus'
import { ref, reactive, unref } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import { Table } from '@/components/Table'
import { Search } from '@/components/Search'
import { FormSchema } from '@/components/Form'
import { useTable } from '@/hooks/web/useTable'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { useRouter } from 'vue-router'
import { dateTimeRange } from '@/utils/time'
import { Dialog } from '@/components/Dialog'
import Write from './components/add.vue'
import {
  getPageTopApi,
  getPageListApi,
  getInterestRateApi,
  editDataListApi,
  addDataListApi,
  deleteDataListApi,
  editBatchDataListApi
} from '@/api/creditManagement/index'
import { onMounted } from 'vue'
import { useAppStore } from '@/store/modules/app'
const appStore = useAppStore()
appStore.setRenderLoading(true)

const chooseCount = ref(0)
const { push } = useRouter()

const searchParams = ref<any>({})

const dialogVisible = ref(false)
const dialogTitle = ref('')
const saveLoading = ref(false)

const { t } = useI18n()
const currentRow = ref<any>()

const { tableRegister, tableState, tableMethods } = useTable({
  fetchDataApi: async () => {
    const { pageSize, currentPage } = tableState
    let params = {
      pageSize: pageSize.value,
      currentPage: currentPage.value,
      ...searchParams.value
    }
    const res = await getPageListApi(params)
    return {
      list: res.data.list || [],
      total: res.data.total || 0
    }
  },
  fetchDelApi: async () => {
    const res = await deleteDataListApi([currentRow.value.id])
    return res
  },
  immediate: false
})
const { total, loading, dataList, pageSize, currentPage } = tableState
const { getList, getElTableExpose, delList } = tableMethods
const actionType = ref('start')
const action = (row: any, type: string) => {
  if (type == 'add') {
    dialogTitle.value = t('project.add') + t('merchant.info')
  } else {
    dialogTitle.value = t('project.edit') + t('merchant.info')
  }
  currentRow.value = row
  dialogVisible.value = true
  actionType.value = type
}
const schema = reactive<FormSchema[]>([
  {
    field: 'companyName',
    label: '',
    component: 'Input',
    componentProps: {
      slots: {
        prepend: () => <div>{t('merchant.name')}</div>
      }
    }
  }
])
const setSearchParams = (params: any) => {
  currentPage.value = 1
  searchParams.value = params
  getList()
}

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
    field: 'companyName',
    label: t('merchant.name'),
    search: {
      hidden: true
    }
  },
  {
    field: 'merchantNo',
    label: t('merchant.id'),
    search: {
      hidden: true
    }
  },
  {
    field: 'creditAmount',
    label: t('merchant.money'),
    search: {
      hidden: true
    }
  },
  {
    field: 'period',
    label: t('advanceSettlement.block2'),
    search: {
      hidden: true
    }
  },
  {
    field: 'interestRate',
    label: t('advanceSettlement.block3'),
    search: {
      hidden: true
    }
  },
  {
    field: 'overdueInterestRate',
    label: t('advanceSettlement.block13'),
    search: {
      hidden: true
    }
  },
  {
    field: 'editTime',
    label: t('service.editTime'),
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
                <span
                  v-hasPermi="credit:finMerCredit:edit"
                  onClick={() => {
                    action(data.row, 'edit')
                  }}
                >
                  {t('project.edit')}
                </span>
                <span
                  v-hasPermi="credit:finMerCredit:delete"
                  class="[&>span]:(cursor-pointer m-2) color-red-500 mr-10px"
                  onClick={async () => {
                    currentRow.value = data.row
                    await delList(1)
                  }}
                >
                  {t('project.delete')}
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

onMounted(() => {
  init()
})

const systemInfo = ref<any>({})
const creditInfo = ref()
const writeRef = ref()

const line1 = ref()
const line2 = ref()
const line3 = ref()
const line4 = ref()

const init = async () => {
  if (actionType.value == 'start' || actionType.value == 'sys') {
    const result = await getInterestRateApi()
    if (result.code == 200) {
      systemInfo.value = result.data
      creditInfo.value = JSON.parse(result.data.creditInfo)
      line1.value = creditInfo.value[0]
      line2.value = creditInfo.value[1]
      line3.value = creditInfo.value[2]
      line4.value = creditInfo.value[3]
    }
  }

  // const res = await getPageTopApi()
  if (
    actionType.value == 'start' ||
    actionType.value == 'edit' ||
    actionType.value == 'add' ||
    actionType.value == 'editSelect'
  ) {
    await getList()
  }
}

const selectArr = ref<any>([])

const handleSelectionChange = (row: any) => {
  chooseCount.value = row.length
  row.forEach((e: any) => {
    selectArr.value.push(e)
  })
}

const handleSelectionAllChange = (row: any) => {
  if (!row.length) {
    chooseCount.value = 0
    selectArr.value = []
  } else {
    selectArr.value = []
    row.forEach((e: any) => {
      selectArr.value.push(e)
    })
    chooseCount.value = selectArr.value.length
  }
}

const save = async () => {
  const params = await writeRef.value.submit()
  if (params) {
    params.creditRuleList.forEach((item) => {
      delete item.edit1
      delete item.edit2
      delete item.edit3
      item.interestRate = item.interestRate / 100
      item.overdueInterestRate = item.overdueInterestRate / 100
    })
  }
  if (params && actionType.value == 'add') {
    params.merchantName = ''
    const res = await addDataListApi(params)
    if (res.code == 200) {
      ElMessage.success(res.msg)
      dialogVisible.value = false
      init()
    }
  } else if (params && (actionType.value == 'edit' || actionType.value == 'sys')) {
    params.merchantNo = currentRow.value.merchantNo
    params.merchantName = currentRow.value.merchantName
    params.id = currentRow.value.id
    params.companyName = currentRow.value.companyName
    params.creditAmount = currentRow.value.creditAmount
    const res = await editDataListApi(params)
    if (res.code == 200) {
      ElMessage.success(res.msg)
      dialogVisible.value = false
      init()
    }
  } else if (params && actionType.value == 'editSelect') {
    let ids: any = []
    selectArr.value.forEach((item) => {
      ids.push(item.id)
    })
    params.ids = ids
    const res = await editBatchDataListApi(params)
    if (res.code == 200) {
      ElMessage.success(res.msg)
      dialogVisible.value = false
      init()
    }
  }
  // if (params) {
  //   const res = await editDataListApi(params)
  //   if (res.code == 200) {
  //     ElMessage.success(res.msg)
  //     dialogVisible.value = false
  //   }
  // }
}
</script>

<style lang="less" scoped>
.subString {
  color: #747474;
  font-size: 14px;
  margin-right: 10px;
}
</style>
