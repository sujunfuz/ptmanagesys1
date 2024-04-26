<template>
  <ContentWrap>
    <div class="flex justify-between">
      <ElRadioGroup
        v-hasPermi="'logistics:logisticsManag:list'"
        v-model="tabPosition"
        style="margin-bottom: 20px"
        @change="changeLogisticsStatus"
      >
        <ElRadioButton label="">{{ t('productList.block1') }}</ElRadioButton>
        <ElRadioButton label="ABNORMAL_CARGO">{{ t('productList.err') }}</ElRadioButton>
        <ElRadioButton label="HAS_RECEIVE_GOODS">{{ t('orderManage.radio3') }}</ElRadioButton>
      </ElRadioGroup>
      <ElButton
        v-hasPermi="'logistics:logisticsManag:add'"
        type="primary"
        @click="action('', 'add')"
        >{{ t('project.add') }}</ElButton
      >
    </div>
    <div v-hasPermi="'logistics:logisticsManag:list'">
      <Search :schema="schema" @reset="resetSearchParams" @search="setSearchParams" />
    </div>
  </ContentWrap>

  <ContentWrap class="mt-20px flex-1" :isBlock="false">
    <div class="p-20px">
      <span class="subString"
        >{{ t('project.yisel') }}<span class="colorMain">{{ chooseCount }}</span
        >{{ t('checkPrice.checkPrice') }}</span
      >
      <ElButton v-hasPermi="'logistics:logisticsManag:export'" size="small" @click="exportExexl">{{
        t('project.export')
      }}</ElButton>
    </div>
    <div>
      <Table
        v-model:pageSize="pageSize"
        v-model:currentPage="currentPage"
        :columns="columns"
        @select="handleSelectionChange"
        @select-all="handleSelectionAllChange"
        :data="dataList"
        :loading="loading"
        :pagination="{
          total,
          layout: ' ->, total, sizes, prev, pager, next, jumper'
        }"
        @register="tableRegister"
        @refresh="refresh"
      />
    </div>
  </ContentWrap>
  <Dialog v-model="dialogVisible" :title="dialogTitle" :max-height="dialogHeight">
    <Write
      ref="writeRef"
      :deliveryType="deliveryType"
      :actionType="actionType"
      :logisticsCompanyEnum="logisticsCompanyEnum"
      :current-row="currentRow"
    />
    <template #footer v-if="actionType != 'view'">
      <ElButton @click="dialogVisible = false">{{ t('common.cancel') }}</ElButton>
      <ElButton type="primary" :loading="saveLoading" @click="save">
        {{ t('project.confirm') }}
      </ElButton>
    </template>
  </Dialog>
</template>

<script lang="tsx" setup>
import { ContentWrap } from '@/components/ContentWrap'
import { Dialog } from '@/components/Dialog'
import {
  ElRadioGroup,
  ElRadioButton,
  ElButton,
  ElOption,
  ElTag,
  ElImage,
  ElDropdown,
  TableColumnCtx,
  ElDropdownMenu,
  ElDropdownItem,
  ElIcon,
  ElInput,
  ElMessage
} from 'element-plus'
import Write from './components/add.vue'
import { createImageViewer } from '@/components/ImageViewer'
import { ref, reactive, unref, onMounted } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import { Table, TableColumn } from '@/components/Table'
import { Search } from '@/components/Search'
import { SelectOption, FormSchema } from '@/components/Form'
import { useTable } from '@/hooks/web/useTable'
import { useRouter } from 'vue-router'
import {
  getPageTopApi,
  getPageListApi,
  editDataListApi,
  addDataListApi,
  exportApi
} from '@/api/LogisticsCenter/manage'

const { push, getRoutes } = useRouter()

onMounted(() => {
  init()
})

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

const exportExexl = async () => {
  if (chooseIdsList.value.length == 0) {
    ElMessage.warning(t('common.a5'))
    return
  }
  const res = await exportApi(chooseIdsList.value)
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
}

const dialogHeight = ref('')
const dialogTitle = ref('')
const currentRow = ref()
const actionType = ref('')
const action = async (row, type) => {
  switch (type) {
    case 'view':
      // dialogTitle.value = t('project.view') + t('common.g')
      // dialogHeight.value = '100'
      push('/logisticsCenter/manage/managedetail?id=' + row.storeBatchNo)
      return
      break
    case 'edit':
      dialogTitle.value = t('project.edit') + t('common.g')
      row.orderNo = row.storeBatchNo
      dialogHeight.value = '550'
      break
    case 'add':
      dialogTitle.value = t('project.add2') + t('common.g')
      dialogHeight.value = '550'
      break
  }
  currentRow.value = row
  actionType.value = type
  dialogVisible.value = true
}

const orderStatusEnum = ref()
const deliveryType = ref()
const logisticsCompanyEnum = ref()
const orderStatus = ref()
const init = async () => {
  const res = await getPageTopApi()
  if (res.code == 200) {
    orderStatusEnum.value = res.data.orderType
    orderStatus.value = res.data.orderStatus
    deliveryType.value = res.data.deliveryType
    logisticsCompanyEnum.value = res.data.LogisticsCompanyEnum
  }

  getList()
}

const tabPosition = ref('')
const dialogVisible = ref(false)
const saveLoading = ref(false)

const schema = reactive<FormSchema[]>([
  {
    field: 'orderNo',
    label: '',
    component: 'Input',
    componentProps: {
      slots: {
        prepend: () => <div>{t('logistics.orderNo')}</div>
        // append: () => <Icon icon="ep:share" />
      }
    }
  },
  {
    field: 'logisticsNo',
    label: '',
    component: 'Input',
    componentProps: {
      slots: {
        prepend: () => <div>{t('logistics.logisticsNo')}</div>
        // append: () => <Icon icon="ep:share" />
      }
    }
  },
  {
    field: 'queryStatus',
    label: '',
    component: 'Select',
    componentProps: {
      options: orderStatus,
      slots: {
        prefix: () => <div>{t('logistics.orderStatus')}</div>
      }
    }
  }
])

const searchParams = ref({})
const setSearchParams = (params: any) => {
  currentPage.value = 1
  searchParams.value = params
  getList()
}
const resetSearchParams = (params: any) => {
  currentPage.value = 1
  searchParams.value = params
  tabPosition.value = ''
  getList()
}
const changeLogisticsStatus = () => {
  currentPage.value = 1
  getList()
}

const chuli = (obj) => {
  for (const item of dataList.value) {
    if (item.id == obj.id) {
      obj.expandFlag = item.expandFlag
      return
    }
  }
  if (obj.list.length > 2) {
    obj.expandFlag = 1
  } else {
    obj.expandFlag = 0
  }
}

const { tableRegister, tableMethods, tableState } = useTable({
  fetchDataApi: async () => {
    const { currentPage, pageSize } = tableState
    const res = await getPageListApi({
      currentPage: unref(currentPage),
      pageSize: unref(pageSize),
      ...unref(searchParams),
      logisticsStatus: tabPosition.value
    })
    res.data.list.forEach((item) => chuli(item))
    return {
      list: res.data.list,
      total: res.data.total
    }
  },
  immediate: false
})
const { loading, dataList, total, currentPage, pageSize } = tableState
const { refresh, getList } = tableMethods

const { t } = useI18n()

const clickImage = (data) => {
  createImageViewer({
    urlList: [data]
  })
}

const imgUrl = import.meta.env.VITE_IMG_URL

const columns = reactive<TableColumn[]>([
  {
    field: 'selection',
    type: 'selection'
  },
  {
    field: 'storeBatchNo',
    label: t('logistics.orderNo'),
    slots: {
      default: () => {
        return null
      }
    }
  },
  {
    field: 'logisticsNo',
    label: t('logistics.info'),
    width: 480,
    slots: {
      default: (data) => {
        let list = data.row.list
        return (
          <>
            {list.map((item, index) => {
              if (index > 0 && data.row.expandFlag == 1) {
                return ''
              }
              return (
                <div class={['flex', data.row.expandFlag == 1 ? 'mt-20px' : '']} key={index}>
                  <div class="flex">
                    <div onClick={() => clickImage(imgUrl + item.spuImage)}>
                      <ElImage src={imgUrl + item.spuImage} style="width:80px;"></ElImage>
                    </div>

                    <div style="width: 360px;" class="ml-10px">
                      <div class="flex">
                        <div style="width: 360px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis">
                          {item.spuName}
                        </div>
                        <div class="ml-15px">×{item.num}</div>
                      </div>

                      <div class="flex colorGrey font-size-15px mt-6px flex-wrap">
                        {item.skuIndexexVals.map((item1, index1) => {
                          return (
                            <>
                              <div class="mr-20px">
                                <span>
                                  {t('productList.specifications')}
                                  {index1 + 1}:
                                </span>
                                <span class="ml-3px">{item1}</span>
                              </div>
                            </>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
            {data.row.expandFlag == 0 ? (
              ''
            ) : (
              <div
                onClick={() => {
                  data.row.expandFlag == 1 ? (data.row.expandFlag = 2) : (data.row.expandFlag = 1)
                }}
                class="color-colorMain font-size-14px w-100% text-center cursor-pointer"
              >
                {data.row.expandFlag == 1
                  ? t('project.seeMore') +
                    '(' +
                    t('project.total') +
                    list.length +
                    t('checkPrice.checkPrice') +
                    ')'
                  : ''}
              </div>
            )}
          </>
        )
      }
    }
  },
  {
    field: 'logisticsNo',
    label: t('logistics.logisticsNo'),
    slots: {
      default: (data) => {
        const res = data.row.logisticsNo
        return (
          <>
            <div class="colorMain">{res || '-'}</div>
          </>
        )
      }
    }
  },
  {
    field: 'createTime',
    label: t('logistics.time'),
    slots: {
      default: (data) => {
        return (
          <div>
            <div>{data.row.createTime || '-'}</div>
            <div> {data.row.deliveryDate || '-'}</div>
          </div>
        )
      }
    }
  },
  {
    field: 'deliveryTypeStr',
    label: t('logistics.way'),
    slots: {
      default: () => {
        return null
      }
    }
  },
  {
    field: 'carrier',
    label: t('logistics.director'),
    slots: {
      default: () => {
        return null
      }
    }
  },
  {
    field: 'statusStr',
    label: t('logistics.orderStatus'),
    slots: {
      default: (data) => {
        const status = data.row.status
        const statusStr = data.row.statusStr
        return (
          <>
            <ElTag
              type={
                status == 'HAS_FINISHED'
                  ? 'success'
                  : status == 'ABNORMAL_CARGO'
                  ? 'danger'
                  : 'warning'
              }
            >
              {statusStr}
            </ElTag>
          </>
        )
      }
    }
  },
  {
    field: 'operate',
    label: t('exampleDemo.operate'),
    width: '100px',
    slots: {
      default: (data) => {
        return (
          <>
            <ElButton
              v-hasPermi="logistics:logisticsManag:view"
              type="primary"
              text
              onClick={() => action(data.row, 'view')}
            >
              {t('project.detail')}
            </ElButton>
            <br />
            <ElButton
              v-hasPermi="logistics:logisticsManag:edit"
              type="primary"
              text
              onClick={() => action(data.row, 'edit')}
            >
              {t('project.edit2')}
            </ElButton>
          </>
        )
      }
    }
  }
])

const writeRef = ref()
const save = async () => {
  saveLoading.value = true
  const write = unref(writeRef)
  const formData = await write?.submit()
  if (formData) {
    let res
    if (actionType.value == 'add') {
      res = await addDataListApi({
        ...formData
      })
    }
    if (actionType.value == 'edit') {
      res = await editDataListApi({
        ...formData
      })
    }

    if (res) {
      ElMessage.success(res.msg)
      await getList()
      // init()
      dialogVisible.value = false
    }
  }
  saveLoading.value = false
}
</script>

<style lang="less" scoped>
.subString {
  color: #747474;
  font-size: 14px;
  margin-right: 10px;
}
</style>
