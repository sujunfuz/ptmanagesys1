<template>
  <ContentWrap v-hasPermi="'merinfo:merInfo:list'">
    <div class="flex-b">
      <Search :schema="schema" @reset="setSearchParams" @search="setSearchParams" />
    </div>
  </ContentWrap>
  <ContentWrap class="mt-20px flex-1" :isBlock="false">
    <div class="flex flex-items-center p-20px">
      <div class="flex-c">
        <span class="subString"
          >{{ t('project.yisel') }}<span class="colorMain">&nbsp;{{ chooseCount }}&nbsp;</span
          >{{ t('buyer.sub') }}</span
        >
        <div
          class="aCustomBtn"
          @click="exportFile"
          v-hasPermi="'merinfo:merInfo:export'"
          :class="chooseCount > 0 ? 'customBtnHover' : ''"
        >
          {{ t('project.export') }}
        </div>
      </div>
    </div>
    <Table
      ref="tableRef"
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      @select="handleSelectionChange"
      @select-all="handleSelectionAllChange"
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
    :title="t('project.edit2') + t('merchant.info')"
    max-height="200px"
  >
    <Write ref="writeRef" :current-row="currentRow" :statusEnum="statusEnum" />
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
  getMerInfoTopApi,
  getMerInfoListApi,
  editMerInfoApi,
  exportChooseFile
} from '@/api/userManage/MerchantInfo.ts'
import { onMounted } from 'vue'
import { useAppStore } from '@/store/modules/app'
const appStore = useAppStore()
appStore.setRenderLoading(true)
//静态枚举
const managementModelEnum = ref()
//
const chooseCount = ref(0)
const { push } = useRouter()

const searchParams = ref<any>({})

const dialogVisible = ref(false)
const saveLoading = ref(false)

const tableRef = ref()

const { t } = useI18n()
const currentRow = ref<any>()
const selectChose = ref({})

const handleSelectionChange = (row) => {
  selectChose.value = row.map((item) => item.id)
  chooseCount.value = row.length
}

const exportFile = async () => {
  if (selectChose.value.length > 0) {
    const res = await exportChooseFile(selectChose.value)
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

const handleSelectionAllChange = (row) => {
  if (!row.length) {
    chooseCount.value = 0
    selectChose.value = {}
  } else {
    let obj = {}
    let peon = dataList.value.reduce((cur, next) => {
      obj[next.id] ? '' : (obj[next.id] = true && cur.push(next))
      return cur
    }, [])
    selectChose.value = peon.map((item) => item.id)
    chooseCount.value = peon.length
  }
}

const { tableRegister, tableState, tableMethods } = useTable({
  fetchDataApi: async () => {
    const { pageSize, currentPage } = tableState
    let params = {
      pageSize: pageSize.value,
      currentPage: currentPage.value,
      ...searchParams.value
    }
    if (searchParams.value.startTime) {
      params.startTime = searchParams.value.startTime[0]
      params.endTime = searchParams.value.startTime[1]
    }
    const res = await getMerInfoListApi(params)
    return {
      list: res.data.list || [],
      total: res.data.total || 0
    }
  },
  immediate: false
})
const { total, loading, dataList, pageSize, currentPage } = tableState
const { getList, getElTableExpose, delList } = tableMethods
let actionType = ''
const action = (row: any, type: string) => {
  currentRow.value = row
  dialogVisible.value = true
  actionType = type
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
  },
  {
    field: 'managementModel',
    label: '',
    component: 'Select',
    componentProps: {
      options: managementModelEnum,
      slots: {
        prefix: () => <div>{t('merchant.mode')}</div>
      }
    }
  },
  {
    field: 'startTime',
    component: 'DatePicker',
    componentProps: dateTimeRange()
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
    field: 'managementModelStr',
    label: t('merchant.mode'),
    search: {
      hidden: true
    }
  },
  {
    field: 'applicantName',
    label: t('merchant.applicant'),
    search: {
      hidden: true
    }
  },
  {
    field: 'applicantEmail',
    label: t('merchant.email'),
    search: {
      hidden: true
    }
  },
  {
    field: 'applicantMobile',
    label: t('merchant.iphone'),
    search: {
      hidden: true
    }
  },
  {
    field: 'guarantor',
    label: t('merchant.guarantor'),
    search: {
      hidden: true
    }
  },
  {
    field: 'creditLimit',
    label: t('merchant.money'),
    search: {
      hidden: true
    }
  },
  {
    field: 'statusStr',
    label: t('merchant.status'),
    search: {
      hidden: true
    },
    table: {
      slots: {
        default: (data: any) => {
          const statusColor = data.row.statusColor
          // const row = data.row as DepartmentUserItem
          return (
            <>
              <div class="[&>span]:(cursor-pointer m-2) flex flex-wrap colorMain ">
                <ElTag
                  type={statusColor == '0' ? 'success' : statusColor == '1' ? 'info' : 'danger'}
                >
                  {data.row.statusStr}
                </ElTag>
              </div>
            </>
          )
        }
      }
    }
  },
  {
    field: 'createTimeStr',
    label: t('merchant.time'),
    search: {
      hidden: true
    }
  },
  {
    field: 'action',
    label: t('userDemo.action'),
    width: '150px',
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
      slots: {
        default: (data: any) => {
          const row = data.row
          return (
            <>
              <div class="[&>span]:(cursor-pointer m-2) flex flex-wrap colorMain ">
                <span
                  v-hasPermi="merinfo:merInfo:view"
                  onClick={() =>
                    push('/usermanage/merchant/specifics?merchantNo=' + row.merchantNo)
                  }
                >
                  {' '}
                  {t('project.detail')}{' '}
                </span>
                <span v-hasPermi="merinfo:merInfo:edit" onClick={() => action(row, 'edit')}>
                  {' '}
                  {t('project.edit2')}{' '}
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

onMounted(() => {
  init()
})

const writeRef = ref()
const statusEnum = ref()
const init = async () => {
  const res = await getMerInfoTopApi()
  managementModelEnum.value = res.data.managementModel
  statusEnum.value = res.data.statusEnum
  await getList()
}

const save = async () => {
  const params = await writeRef.value.submit()
  if (params) {
    const res = await editMerInfoApi(params)
    if (res.code == 200) {
      ElMessage.success(res.msg)
      dialogVisible.value = false
      await getList()
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
