<template>
  <ContentWrap v-hasPermi="'userinfo:userInfo:list'">
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
          v-hasPermi="'userinfo:userInfo:export'"
          :class="chooseCount > 0 ? 'customBtnHover' : ''"
        >
          {{ t('project.export') }}
        </div>
      </div>
    </div>
    <Table
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
</template>

<script lang="tsx" setup>
import { ContentWrap } from '@/components/ContentWrap'
import { ElButton, ElTag, ElMessageBox, ElMessage } from 'element-plus'
import { ref, reactive, unref, onMounted } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import { Table } from '@/components/Table'
import { Search } from '@/components/Search'
import { FormSchema } from '@/components/Form'
import { useTable } from '@/hooks/web/useTable'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { useRouter } from 'vue-router'
import { tableStatusStyleTag } from '@/utils/componentUtils'
import { dateTimeRange } from '@/utils/time'
import {
  getUserInfoTopApi,
  getUserInfoListApi,
  editUserStatusListApi,
  exportChooseFile
} from '@/api/userManage/UserInfo'
import { useAppStore } from '@/store/modules/app'
const appStore = useAppStore()
appStore.setRenderLoading(true)

const chooseCount = ref(0)
const { push } = useRouter()
const selectChose = ref({})

const handleSelectionChange = (row) => {
  selectChose.value = row.map((item) => item.id)
  chooseCount.value = row.length
}

const uerWarehouseTypeEnum = ref()
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

const searchParams = ref<any>({})
const setSearchParams = (val) => {
  searchParams.value = { ...val }
  if (val.startTime) {
    searchParams.value.endTime = val.startTime[1]
    searchParams.value.startTime = val.startTime[0]
  }
  currentPage.value = 1
  getList()
}

const dialogVisible = ref(false)

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
const { t } = useI18n()

const { tableRegister, tableState, tableMethods } = useTable({
  fetchDataApi: async () => {
    const { pageSize, currentPage } = tableState

    const res = await getUserInfoListApi({
      currentPage: unref(currentPage),
      pageSize: unref(pageSize),
      ...unref(searchParams)
    })
    return {
      list: res.data.list || [],
      total: res.data.total || 0
    }
  },
  immediate: false
})
const { total, loading, dataList, pageSize, currentPage } = tableState
const { getList, getElTableExpose, delList } = tableMethods

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
    field: 'warehouseType',
    label: '',
    component: 'Select',
    componentProps: {
      options: uerWarehouseTypeEnum,
      slots: {
        prefix: () => <div>{t('buyer.sub1')}</div>
      }
    }
  },
  {
    field: 'startTime',
    component: 'DatePicker',
    componentProps: dateTimeRange()
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
    field: 'companyName',
    label: t('merchant.name'),
    search: {
      hidden: true
    }
  },
  {
    field: 'warehouseTypeStr',
    label: t('buyer.sub1'),
    search: {
      hidden: true
    }
  },
  {
    field: 'email',
    label: t('buyer.sub2'),
    search: {
      hidden: true
    }
  },
  {
    field: 'realName',
    label: t('buyer.sub3'),
    search: {
      hidden: true
    }
  },
  {
    field: 'nickName',
    label: t('buyer.sub4'),
    search: {
      hidden: true
    }
  },
  {
    field: 'mobile',
    label: t('merchant.iphone'),
    search: {
      hidden: true
    }
  },
  {
    field: 'statusStr',
    label: t('merchant.status'),
    formatter: (data: any) => {
      const status = data.status || ''
      return tableStatusStyleTag(status, data.statusStr, data.statusStr)
    }
  },
  {
    field: 'createTime',
    label: t('merchant.time'),
    search: {
      hidden: true
    }
  },
  {
    field: 'action',
    label: t('userDemo.action'),
    width: '100ox',
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
          return (
            <>
              <div class="[&>span]:(cursor-pointer m-2) flex flex-wrap colorMain ">
                <span
                  v-hasPermi="userinfo:userInfo:edit"
                  onClick={() => {
                    openSubmit(data.row, data.row.status)
                  }}
                >
                  {data.row.status == 'ACTIVE' ? t('buyer.action1') : t('buyer.action2')}
                </span>
                {/* {t('buyer.action2')} */}
              </div>
            </>
          )
        }
      }
    }
  }
])

const { allSchemas } = useCrudSchemas(crudSchemas)

const openSubmit = (row, status) => {
  if (status == 'BAN') {
    ElMessageBox.confirm(t('buyer.sub6') + '?', '', {
      confirmButtonText: t('common.ok'),
      cancelButtonText: t('common.cancel'),
      type: 'warning'
    })
      .then(async () => {
        const res = await editUserStatusListApi({ id: row.id })
        res.code == 200 && ElMessage.success(res.msg) && getList()
      })
      .catch(() => {})
  }

  if (status == 'ACTIVE') {
    ElMessageBox.confirm(t('buyer.sub5') + '?', '', {
      confirmButtonText: t('common.ok'),
      cancelButtonText: t('common.cancel'),
      type: 'warning'
    })
      .then(async () => {
        const res = await editUserStatusListApi({ id: row.id })
        res.code == 200 && ElMessage.success(res.msg) && getList()
      })
      .catch(() => {})
  }
}

onMounted(async () => {
  const res = await getUserInfoTopApi()
  if (res.code == 200) {
    uerWarehouseTypeEnum.value = res.data.UserWarehouseTypeEnum
  }
  getList()
})
</script>

<style lang="less" scoped>
.subString {
  color: #747474;
  font-size: 14px;
  margin-right: 10px;
}
</style>
