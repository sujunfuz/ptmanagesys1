<template>
  <ContentWrap v-hasPermi="'safetyCenter:safUserBehavior:list'">
    <div class="flex justify-between">
      <Search :schema="searchSchema" @search="setSearchParams" @reset="setSearchParams" />
    </div>
  </ContentWrap>

  <ContentWrap class="mt-20px flex-1" :isBlock="false">
    <div class="p-20px flex-c">
      <span class="subString"
        >{{ t('project.yisel') }}<span class="colorMain">&nbsp;{{ chooseCount }}&nbsp;</span>
        {{ t('abnormalUser.danwei') }}</span
      >
      <div
        v-hasPermi="'safetyCenter:safUserBehavior:exportExcel'"
        class="aCustomBtn"
        @click="exportFile"
        :class="chooseCount > 0 ? 'customBtnHover' : ''"
      >
        {{ t('project.export') }}
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

  <Dialog v-model="dialogVisible" :title="dialogTitle" max-height="250px">
    <Write ref="writeRef" :currentRow="currentRow" />

    <!-- <template #footer v-if="actionType ==">
      <ElButton @click="dialogVisible = false">{{ t('project.cancel') }}</ElButton>
      <ElButton type="primary" :loading="saveLoading" @click="save">
        {{ t('project.confirm') }}
      </ElButton>
    </template> -->
  </Dialog>
</template>

<script setup lang="tsx">
import { ContentWrap } from '@/components/ContentWrap'
import { useI18n } from '@/hooks/web/useI18n'
import { ref, unref, reactive, onMounted } from 'vue'
import { ElButton, ElRadioGroup, ElRadioButton, ElMessageBox, ElMessage, ElTag } from 'element-plus'
import {
  getPageTopApi,
  getPageListApi,
  getListAllApi,
  setUserBanStatusApi,
  getUserDetailApi,
  safIpAddApi
} from '@/api/safetyCenter/abnormalUser'
import { useTable } from '@/hooks/web/useTable'
import { Search } from '@/components/Search'
import Write from './components/Write.vue'
import { Dialog } from '@/components/Dialog'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { SelectOption, FormSchema } from '@/components/Form'
import { Table } from '@/components/Table'
import { tableStatusStyleTag } from '@/utils/componentUtils'
import { dateTimeRange } from '@/utils/time'

const { t } = useI18n()

onMounted(() => {
  init()
})

const detectEventEnum = ref()
const status = ref()
const searchSchema = reactive<FormSchema[]>([
  {
    field: 'userNo',
    label: '',
    component: 'Input',
    componentProps: {
      slots: {
        prepend: () => <div>{t('abnormalUser.id')}</div>
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
        prefix: () => <div>{t('abnormalUser.status')}</div>
      }
    }
  },
  {
    field: 'monitoringEvent',
    label: '',
    component: 'Select',
    componentProps: {
      slots: {
        prefix: () => <div>{t('abnormalUser.sub1')}</div>
      },
      options: detectEventEnum
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
  if (res.code == 200) {
    detectEventEnum.value = res.data.detectEventEnum
    status.value = res.data.status
  }
  getList()
}

const { tableRegister, tableState, tableMethods } = useTable({
  fetchDataApi: async () => {
    const { pageSize, currentPage } = tableState
    const res = await getPageListApi({
      currentPage: unref(currentPage),
      pageSize: unref(pageSize),
      startTime: searchParams.value.time ? searchParams.value.time[0] : '',
      endTime: searchParams.value.time ? searchParams.value.time[1] : '',
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
    field: 'userName',
    label: t('abnormalUser.sub2'),
    search: {
      hidden: true
    }
  },
  {
    field: 'userNo',
    label: t('abnormalUser.id'),
    search: {
      hidden: true
    }
  },
  {
    field: 'userStatus',
    label: t('paymentChannel.sub3'),
    search: {
      hidden: true
    },
    formatter: (data: any) => {
      const status = data.status || ''
      const statusStr = data.statusStr || ''
      if(!statusStr){
        return <div>-</div>
      }
      return <ElTag type={status == 'ACTIVE' ? 'success' : 'danger'}>{statusStr}</ElTag>
    }
  },
  {
    field: 'monitoringEventStr',
    label: t('abnormalUser.sub1'),
    search: {
      hidden: true
    }
  },
  {
    field: 'behavior',
    label: t('abnormalUser.sub3'),
    search: {
      hidden: true
    }
  },
  {
    field: 'ip',
    label: t('abnormalUser.sub4'),
    search: {
      hidden: true
    }
  },
  {
    field: 'mobileNo',
    label: t('abnormalUser.iphone'),
    search: {
      hidden: true
    }
  },
  {
    field: 'createTimeStr',
    label: t('abnormalUser.time'),
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
          const row = data.row
          return (
            <>
              <div class="[&>span]:(cursor-pointer m-2) flex flex-wrap colorMain ">
                <span onClick={() => action(row, 'view')}> {t('project.view')} </span>
                <span
                  v-hasPermi="safetyCenter:safUserBehavior:seal"
                  class="color-red-500"
                  v-show={ row.userNo}
                  onClick={() => clickSeal(row.userNo)}
                >
                  {t('buyer.action1')}
                </span>
                <span
                  v-hasPermi="safetyCenter:safUserBehavior:ipblack"
                  onClick={() => clickIpBlack(row)}
                >
                  {' '}
                  {t('abnormalUser.action1')}{' '}
                </span>
              </div>
            </>
          )
        }
      }
    }
  }
])

const clickSeal = async (id) => {
  ElMessageBox.confirm(t('abnormalUser.sub9'), t('buyer.action1'), {
    confirmButtonText: t('project.confirm'),
    cancelButtonText: t('project.cancel')
  })
    .then(async () => {
      const res = await setUserBanStatusApi(id)
      if (res.code == 200) {
        ElMessage.success(t('common.operateSuccess'))
        getList()
      }
    })
    .catch(() => {})
}

const clickIpBlack = async (row: any) => {
  ElMessageBox.confirm(t('abnormalUser.sub8'), t('abnormalUser.action1'), {
    confirmButtonText: t('project.confirm'),
    cancelButtonText: t('project.cancel')
  })
    .then(async () => {
      const res = await safIpAddApi({
        id: row.id,
        monitoringEvent: row.monitoringEvent,
        ip: row.ip,
        behavior: row.behavior,
        type: 'BLACK'
      })
      if (res.code == 200) {
        ElMessage.success(t('common.operateSuccess'))
        getList()
      }
    })
    .catch(() => {})
}
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
  chooseIdsList.value = []
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

const exportFile = async () => {
  if (chooseIdsList.value.length == 0) {
    ElMessage.warning(t('common.choose'))
    return
  }
  const res = await getListAllApi(chooseIdsList.value)
  if (res) {
    let href = window.URL.createObjectURL(res as unknown as Blob) // 创建下载的链接
    let elemIF = document.createElement('iframe')
    elemIF.src = href
    elemIF.style.display = 'none'
    document.body.appendChild(elemIF)
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

const action = async (row: any, type: string) => {
  dialogTitle.value = t('project.detail')
  const res = await getUserDetailApi(row.userNo)
  currentRow.value = res.data
  actionType.value = type
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
        res = await addecGoodsSaleLimit({ ...formData, status: 'ACTIVE' })
        if (res.code == 200) {
          ElMessage.success(t('common.operateSuccess'))
        }
      } else {
        res = await editecGoodsSaleLimit(formData)
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
