<template>
  <ContentWrap>
    <div class="flex-b">
      <div class="flex-c">
        <img src="@/assets/imgs/service.png" class="w-60px h-60px" />
        <div class="font-bold flex-c font-size-18px ml-5px"
          ><div>{{ t('service.proportion') }}:</div
          ><div class="ml-10px">{{ commonCharge.chargeRate }}%</div></div
        >
      </div>
      <div class="flex-c">
        <ElButton
          v-hasPermi="'financialCenter:finServiceCharge:edit'"
          @click="action(commonCharge, 'editCommon')"
          >{{ t('service.edit') }}</ElButton
        >
        <ElButton
          v-hasPermi="'financialCenter:finServiceCharge:add'"
          type="primary"
          @click="action('', 'addTop')"
          >{{ t('service.add') }}</ElButton
        >
      </div>
    </div>
  </ContentWrap>
  <ContentWrap class="mt-20px flex-1" :isBlock="false">
    <div class="p-20px">
      <Search
        v-hasPermi="'financialCenter:finServiceCharge:list'"
        :schema="schema"
        @reset="setSearchParams"
        @search="setSearchParams"
      />
      <div class="flex flex-items-center mt-20px">
        <div class="flex-c">
          <span class="subString"
            >{{ t('project.yisel') }}<span class="colorMain">&nbsp;{{ chooseCount }}&nbsp;</span
            >{{ t('service.sub') }}</span
          >
          <div
            v-hasPermi="'financialCenter:finServiceCharge:edit'"
            class="aCustomBtn !w-96px"
            @click="batchEdit"
            :class="hasSelect.length > 0 ? 'customBtnHover' : ''"
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
      @select="handleSelectionChange"
      @select-all="handleSelectionAllChange"
      @register="tableRegister"
      :pagination="{
        total,
        layout: ' ->, total, sizes, prev, pager, next, jumper'
      }"
    />
  </ContentWrap>
  <Dialog v-if="dialogVisible" v-model="dialogVisible" :title="dialogTitle" :max-height="height">
    <Write ref="writeRef" :current-row="currentRow" :openType="actionType" />
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
import { ref, reactive, unref, onMounted } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import { Table } from '@/components/Table'
import { Search } from '@/components/Search'
import { FormSchema } from '@/components/Form'
import { useTable } from '@/hooks/web/useTable'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { useRouter } from 'vue-router'
import { Dialog } from '@/components/Dialog'
import Write from './components/add.vue'
import {
  getPageTopApi,
  getPageListApi,
  getCommonChargeApi,
  addDataListApi,
  editDataListApi,
  deleteDataListApi,
  editBatchDataListApi,
  editCommonChargeApi
} from '@/api/financialCenter/service'
import { useAppStore } from '@/store/modules/app'
const appStore = useAppStore()
appStore.setRenderLoading(true)
const chooseCount = ref(0)

const hasSelect = ref<any>([])

const handleSelectionChange = (row: any) => {
  chooseCount.value = row.length
  row.forEach((e: any) => {
    hasSelect.value.push(e)
  })
}

const handleSelectionAllChange = (row: any) => {
  if (!row.length) {
    chooseCount.value = 0
    hasSelect.value = []
  } else {
    hasSelect.value = []
    row.forEach((e: any) => {
      hasSelect.value.push(e)
    })
    chooseCount.value = hasSelect.value.length
  }
}

const { push } = useRouter()

const searchParams = ref({})

const height = ref('')
const dialogVisible = ref(false)
const saveLoading = ref(false)
const dialogTitle = ref('')
const actionType = ref('')

const { t } = useI18n()
const currentRow = ref<any>()

const { tableRegister, tableState, tableMethods } = useTable({
  fetchDataApi: async () => {
    const { pageSize, currentPage } = tableState
    const res = await getPageListApi({
      pageNum: unref(currentPage),
      numPerPage: unref(pageSize),
      ...unref(searchParams.value)
    })

    return {
      list: res.data.list || [],
      total: res.data.total
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

const action = (row: any, type: string) => {
  type == 'edit' || type == 'editAll' || type == 'editCommon'
    ? (currentRow.value = row)
    : (currentRow.value = '')
  type == 'addTop'
    ? ((dialogTitle.value = t('service.add')), (height.value = '150px'))
    : ((dialogTitle.value = t('service.edit')), (height.value = '50px'))
  actionType.value = type

  dialogVisible.value = true
}

const setSearchParams = (val) => {
  searchParams.value = val
  currentPage.value = 1
  getList()
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
    field: 'companyName',
    label: t('merchant.name'),
    search: {
      hidden: true
    }
  },
  {
    field: 'merchantNo',
    label: t('service.merchantId'),
    search: {
      hidden: true
    }
  },
  {
    field: 'applicantName',
    label: t('service.applicant'),
    search: {
      hidden: true
    }
  },
  {
    field: 'chargeRate',
    label: t('service.money'),
    search: {
      hidden: true
    }
  },
  {
    field: 'editTimeStr',
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
                  onClick={() => action(data.row, 'edit')}
                  v-hasPermi="financialCenter:finServiceCharge:edit"
                  class="[&>span]:(cursor-pointer m-2) colorMain"
                >
                  {t('project.edit')}
                </span>
                <span
                  class="[&>span]:(cursor-pointer m-2) color-red-500 mr-10px"
                  v-hasPermi="financialCenter:finServiceCharge:delete"
                  onClick={() => {
                    currentRow.value = data.row
                    delList(1)
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

const commonCharge = ref<any>({})
const writeRef = ref()
onMounted(async () => {
  const ares = await getCommonChargeApi()
  commonCharge.value = ares.data
  await getList()
})
const batchEdit = () => {
  if (hasSelect.value.length == 0) {
    ElMessage.warning(t('common.selectText'))
    return
  }
  action(commonCharge, 'editAll')
}
const save = async () => {
  let params = await writeRef.value.submit()
  params.status = 'ACTIVE'
  if (params) {
    let res: any = null
    if (actionType.value == 'addTop') {
      res = await addDataListApi(params)
    } else if (actionType.value == 'edit') {
      params.id = currentRow.value.id
      res = await editDataListApi(params)
    } else if (actionType.value == 'editAll') {
      let arr: any = []
      hasSelect.value.forEach((item) => arr.push(item.id))
      params.ids = arr
      params = {
        ids: params.ids,
        chargeRate: params.chargeRate
      }
      res = await editBatchDataListApi(params)
    } else if (actionType.value == 'editCommon') {
      res = await editCommonChargeApi({ serviceCharge: params.chargeRate })
      const ares = await getCommonChargeApi()
      commonCharge.value = ares.data
    }
    if (res.code == 200) {
      ElMessage.success(res.msg)
      dialogVisible.value = false
      chooseCount.value = 0
      getList()
    }
  }
}
</script>

<style lang="less" scoped>
.subString {
  color: #747474;
  font-size: 14px;
  margin-right: 10px;
}
</style>
