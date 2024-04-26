<template>
  <ContentWrap :isBlock="false">
    <div class="p-20px pb-0px">
      <div class="flex-b pb-0px">
        <ElRadioGroup
          v-hasPermi="'ordstorebatchorder:ordStoreBatchOrder:list'"
          v-model="tabPosition"
          @change="changeTab"
        >
          <ElRadioButton label="">{{ t('orderList.sub1') }}</ElRadioButton>
          <ElRadioButton label="WAITING_PAYMENT">{{ t('orderList.sub2') }}</ElRadioButton>
          <ElRadioButton label="WAIT_SEND_GOODS">{{ t('orderList.sub3') }}</ElRadioButton>
          <ElRadioButton label="HAS_RECEIVE_GOODS">{{ t('orderList.sub4') }}</ElRadioButton>
          <ElRadioButton label="ABNORMAL_CARGO">{{ t('orderList.sub5') }}</ElRadioButton>
        </ElRadioGroup>
        <ElButton
          v-hasPermi="'ordstorebatchorder:ordStoreBatchOrder:genDRCOrd'"
          type="primary"
          @click="push('/orderManagement/orderList/directsalesorder')"
          >{{ t('orderList.add') }}</ElButton
        >
      </div>
      <div
        v-hasPermi="'ordstorebatchorder:ordStoreBatchOrder:list'"
        v-if="!showFlag"
        class="pt-20px pb-20px"
      >
        <Search
          :schema="schema"
          @reset="setSearchParams"
          @register="formRegister"
          @search="setSearchParams"
        />
      </div>
    </div>

    <div class="bg-#f0f2f5 h-20px" v-if="!showFlag"></div>

    <div class="flex flex-items-center p-20px" >
      <div class="flex-c" >
        <span class="subString"
          >{{ t('project.yisel') }}<span class="colorMain">&nbsp;{{ hasSelect.length }}&nbsp;</span
          >{{ t('orderManage.commodity2') }}</span
        >
        <div
          class="aCustomBtn !w-96px"
          @click="batchJianhuo"
          v-hasPermi="'ordstorebatchorder:ordStoreBatchOrder:genPDF'"
          :class="hasSelect.length > 0 ? 'customBtnHover' : ''"
        >
          {{ t('orderList.btn') }}
        </div>
      </div>
    </div>
    <div>
      <Table
        ref="TableRef"
        :height="tableHeight"
        v-model:pageSize="pageSize"
        v-model:currentPage="currentPage"
        :columns="columns"
        :data="dataList"
        :loading="loading"
        @select="handleSelectionChange"
        @select-all="handleSelectionChange"
        :pagination="{
          total: total,
          layout: ' ->, total, sizes, prev, pager, next, jumper',
          pageSize: pageSize,
          currentPage: currentPage
        }"
        @register="tableRegister"
      />
    </div>
  </ContentWrap>
  <Dialog
    v-if="dialogConfig.visible"
    v-model="dialogConfig.visible"
    :title="dialogConfig.title"
    :maxHeight="dialogConfig.height"
    :class="dialogConfig.type != 8 ? '!w-650px' : '!w-650px'"
  >
    <Write
      ref="writeRef"
      :delivery-type-enum="deliveryTypeEnum"
      :logistics-company-enum="logisticsCompanyEnum"
      :current-row="currentRow"
      :flag="dialogConfig.type"
    />
    <template #footer v-if="dialogConfig.type != 3">
      <el-button @click="dialogConfig.visible = false" v-show="dialogConfig.type != 8">{{ t('exampleDemo.cancel') }}</el-button>
      <ElButton
        type="primary"
        :loading="submitLoading"
        v-show="dialogConfig.type != 8"
        @click="save"
        >{{ t('project.confirm') }}</ElButton
      >
    </template>
  </Dialog>
</template>

<script lang="tsx" setup>
import { ContentWrap } from '@/components/ContentWrap'
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
  ElMessageBox,
  ElInput,
  ElMessage
} from 'element-plus'
import { ArrowDown } from '@element-plus/icons-vue'
import { createImageViewer } from '@/components/ImageViewer'
import { ref, reactive, unref, onMounted, onUnmounted } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import { Table, TableColumn } from '@/components/Table'
import { Search } from '@/components/Search'
import { SelectOption, FormSchema } from '@/components/Form'
import { useTable } from '@/hooks/web/useTable'
import { Icon } from '@iconify/vue'
import { useRouter } from 'vue-router'
import { Dialog } from '@/components/Dialog'
import Write from './components/Write.vue'
import { dateTimeRange } from '@/utils/time'
import {
  getOrderTopApi,
  getOrderListApi,
  goSendAPi,
  goApplyAPi,
  cancelOrderApi,
  editFreightApi,
  viewLogisticsInfoApi,
  cutOrderApi
} from '@/api/orderManagement/OrderList.ts'
import { useForm } from '@/hooks/web/useForm'
// 静态枚举
const { push } = useRouter()

const { t } = useI18n()
const affixImgUrl = ref(import.meta.env.VITE_IMG_URL)
const afterSaleStatusEnum = ref()
const orderStatusEnum = ref()
const orderTypeEnum = ref()
const payTypeEnum = ref()
const settStatusEnum = ref()
const deliveryTypeEnum = ref()
const logisticsCompanyEnum = ref()
const payStatusEnum = ref()
const submitLoading = ref(false)

const tableHeight = ref('calc(100vh - 440px)')

const tabPosition = ref('all')

const schema = reactive<FormSchema[]>([
  {
    field: 'storeBatchNo',
    label: '',
    component: 'Input',
    componentProps: {
      slots: {
        prepend: () => <div>{t('orderList.orderId')}</div>
      }
    }
  },
  {
    field: 'logisticsNo',
    label: '',
    component: 'Input',
    componentProps: {
      slots: {
        prepend: () => <div>{t('offlinesign.logNumber')}</div>
      }
    }
  },
  {
    field: 'queryStatus',
    label: '',
    component: 'Select',
    componentProps: {
      options: orderStatusEnum,
      slots: {
        prefix: () => <div>{t('orderList.status')}</div>
      }
    }
  },
  {
    field: 'orderType',
    label: '',
    component: 'Select',
    componentProps: {
      options: orderTypeEnum,
      slots: {
        prefix: () => <div>{t('orderList.type1')}</div>
      }
    }
  },
  {
    field: 'userName',
    label: '',
    component: 'Input',
    componentProps: {
      slots: {
        prepend: () => <div>{t('orderList.buyerName')}</div>
      }
    }
  },
  {
    field: 'payStatus',
    label: '',
    component: 'Select',
    componentProps: {
      props: {
        label: 'desc',
        value: 'name'
      },
      options: payStatusEnum,
      slots: {
        prefix: () => <div>{t('common.b30')}</div>
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
        prefix: () => <div>{t('image.sub17')}</div>
      }
    }
  },
  {
    field: 'afterSalesStatus',
    label: '',
    component: 'Select',
    componentProps: {
      options: afterSaleStatusEnum,
      slots: {
        prefix: () => <div>{t('image.sub18')}</div>
      }
    }
  },
  {
    field: 'startTime',
    component: 'DatePicker',
    componentProps: dateTimeRange()
  }
])

const searchParams = ref<any>({})
const setSearchParams = (params: any) => {
  //   currentPage.value = 1
  searchParams.value = params
  currentPage.value = 1
  getList()
  if (params.queryStatus == '') {
    tabPosition.value = ''
  } else {
    const temp = ['WAITING_PAYMENT', 'WAIT_SEND_GOODS', 'HAS_RECEIVE_GOODS', 'ABNORMAL_CARGO']
    if (temp.includes(params.queryStatus)) {
      tabPosition.value = params.queryStatus
    } else {
      tabPosition.value = ''
    }
  }
}

const hasSelect = ref<any>([])
const handleSelectionChange = (val) => {
  hasSelect.value = val
}
const { tableRegister, tableMethods, tableState } = useTable({
  fetchDataApi: async () => {
    const { currentPage, pageSize } = tableState
    if (searchParams.value.startTime) {
      searchParams.value.endTime = searchParams.value.startTime[1]
      searchParams.value.startTime = searchParams.value.startTime[0]
    }
    const res = await getOrderListApi({
      currentPage: unref(currentPage),
      pageSize: unref(pageSize),
      ...searchParams.value
    })
    res.data.list.forEach((item) => chuli(item))
    return {
      list: res.data.list || [],
      total: res.data.total || 0
    }
  }
})
const { getList } = tableMethods
const chuli = (obj) => {
  for (const item of dataList.value) {
    if (item.id == obj.id) {
      obj.expandFlag = item.expandFlag
      return
    }
  }
  if (obj.list.length > 1) {
    obj.expandFlag = 1
  } else {
    obj.expandFlag = 0
  }
}
const { loading, dataList, total, currentPage, pageSize } = tableState

const sizeMap = [
  {
    title: t('orderList.more1'),
    value: 1
  },
  {
    title: t('orderList.sub7'),
    value: 2
  },
  {
    title: t('orderList.more3'),
    value: 3
  },
  {
    title: t('orderList.more4'),
    value: 4
  },
  {
    title: t('common.a29'),
    value: 5
  },
  {
    title: t('common.a30'),
    value: 6
  },
  {
    title: t('common.a31'),
    value: 7
  },
  {
    title: t('orderList.sub8'),
    value: 8
  }
]
const clickImage = (data) => {
  createImageViewer({
    urlList: [data]
  })
}

const columns = reactive<TableColumn[]>([
  {
    field: 'selection',
    type: 'selection'
  },
  {
    field: 'storeBatchNo',
    label: t('orderList.orderId'),
    width: 280
  },
  {
    field: 'logisticsNo',
    label: t('logistics.info'),
    width: 510,
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
                <div class="flex" key={index}>
                  <div onClick={() => clickImage(affixImgUrl.value + item.spuImage)}>
                    <ElImage
                      src={affixImgUrl.value + item.spuImage}
                      class="w-80px min-w-80px h-80px min-h-80px"
                    ></ElImage>
                  </div>

                  <div style="width: 380px;" class="ml-12px flex">
                    <div>
                      <div class="flex">
                        <div style="width: 350px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis">
                          {item.spuName}
                        </div>
                      </div>

                      <div class="flex flex-wrap colorGrey font-size-15px mt-6px flex-wrap">
                        {item.skuIndexexVals.map((aitem, index) => (
                          <div class="mr-20px" key={index}>
                            <span>
                              {t('productList.specifications')}
                              {index + 1}:
                            </span>
                            <span class="ml-3px">{aitem}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div class="ml-15px">×{item.num}</div>
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
                {data.row.expandFlag == 1 ? t('project.view') : t('common.shrink')}
                {t('orderList.danwei')}({t('project.total')}
                {list.length}
                {t('checkPrice.checkPrice')})
              </div>
            )}
          </>
        )
      }
    }
  },
  {
    field: 'realAmount',
    label: t('orderList.money')
  },
  {
    field: 'orderTypeStr',
    label: t('orderList.type1')
  },
  {
    field: 'payStatusStr',
    label: t('common.b30'),
    width: '100px'
  },
  {
    field: 'statusStr',
    label: t('orderList.status'),
    width: 100,
    slots: {
      default: (data) => {
        let status = data.row.status
        if (data.row.statusStr) {
          if (status == 'HAS_SEND_GOODS' || status == 'HAS_RECEIVE_GOODS') {
            return <ElTag type="info">{data.row.statusStr}</ElTag>
          } else if (status == 'WAITING_PAYMENT') {
            return <ElTag type="warning">{data.row.statusStr}</ElTag>
          } else if (status == 'WAIT_SEND_GOODS') {
            return <ElTag>{data.row.statusStr}</ElTag>
          } else if (status == 'ABNORMAL_CARGO') {
            return <ElTag type="danger">{data.row.statusStr}</ElTag>
          } else {
            return <ElTag type="info">{data.row.statusStr}</ElTag>
          }
        } else {
          return <div>-</div>
        }
      }
    }
  },
  {
    field: 'company',
    label: t('orderList.logistics'),
    width: 200,
    slots: {
      default: (data) => {
        return (
          <div class="color-colorMain font-size-14px">
            <div>{data.row.logisticsCodeStr || '-'}</div>
            <div>{data.row.logisticsNo || '-'}</div>
          </div>
        )
      }
    }
  },
  {
    field: 'afterSalesStatusStr',
    label: t('aftersalesList.status'),
    width: 100,
    slots: {
      default: (data) => {
        let status = data.row.afterSaleStatus
        if (status == 'CLOSE_AF') {
          return <ElTag type="info">{data.row.afterSaleStatusStr}</ElTag>
        } else if (status == 'SUCCESS_AF') {
          return <ElTag type="success">{data.row.afterSaleStatusStr}</ElTag>
        } else if (status == 'IN_AF') {
          return <ElTag type="danger">{data.row.afterSaleStatusStr}</ElTag>
        } else if (status == 'ALL' || status == 'PART') {
          return <ElTag type="danger">{data.row.afterSaleStatusStr}</ElTag>
        } else {
          return <ElTag type="info">{data.row.afterSaleStatusStr || '-'}</ElTag>
        }
      }
    }
  },
  {
    field: 'settStatus',
    label: t('image.sub17'),
    width: 100,
    slots: {
      default: (data) => {
        let status = data.row.settStatus
        if (status == 'SETTLED') {
          return <ElTag type="success">{data.row.settStatusStr}</ElTag>
        } else if (status == 'WAIT_SETTLE') {
          return <ElTag type="warning">{data.row.settStatusStr}</ElTag>
        } else if (status == 'WAIT_APPLY') {
          return <ElTag type="danger">{data.row.settStatusStr}</ElTag>
        } else {
          return <div>-</div>
        }
      }
    }
  },
  {
    field: 'createTime',
    label: t('orderList.time'),
    width: 170
  },
  {
    field: 'action',
    label: t('exampleDemo.operate'),
    fixed: 'right',
    width: '200px',
    slots: {
      default: (data) => {
        return (
          <div class="flex-c flex-col">
            <ElButton
              type="primary"
              text
              v-hasPermi="ordstorebatchorder:ordStoreBatchOrder:view"
              onClick={() => {
                push('/orderManagement/orderList/orderdetail?id=' + data.row.storeBatchNo)
              }}
              class="ml--15px"
            >
              {t('project.detail')}
            </ElButton>
            <ElDropdown
              trigger="click"
              onCommand={(e) => {
                changSize(e, data.row)
              }}
            >
              {{
                default: () => {
                  return (
                    <>
                      <ElButton type="primary" text>
                        {t('project.more')}
                        <ElIcon>
                          <ArrowDown />
                        </ElIcon>
                      </ElButton>
                    </>
                  )
                },
                dropdown: () => {
                  return (
                    <ElDropdownMenu>
                      {{
                        default: () => {
                          return sizeMap.map((v) => {
                            if (v.value == 1 && data.row.status != 'WAIT_SEND_GOODS') {
                              return
                            }
                            if (data.row.status != 'WAIT_SEND_GOODS' && v.value == 2) {
                              return
                            }
                            if (
                              data.row.status != 'WAIT_SEND_GOODS' &&
                              data.row.status != 'WAITING_PAYMENT' &&
                              v.value == 4
                            ) {
                              return
                            }
                            if (v.value == 5 && data.row.settStatus != 'WAIT_APPLY') {
                              return
                            }
                            if (data.row.status != 'HAS_SEND_GOODS' && v.value == 7) {
                              return
                            }
                            if (v.value == 6 && data.row.payStatus != 'WAITING_BK') {
                              return
                            }
                            if (v.value == 3) {
                              return (
                                <ElDropdownItem key={v.value} command={v}>
                                  {v.title}
                                </ElDropdownItem>
                              )
                            }
                            if (v.value == 8 && data.row.orderType == 'ORD_DIRECT_SELLING') {
                              return (
                                <ElDropdownItem key={v.value} command={v}>
                                  {v.title}
                                </ElDropdownItem>
                              )
                            } else if (v.value == 8 && data.row.orderType != 'ORD_DIRECT_SELLING') {
                              return
                            }
                            return (
                              <div v-hasPermi={judgePermi(v)} key={v.value}>
                                <ElDropdownItem command={v}>{v.title}</ElDropdownItem>
                              </div>
                            )
                          })
                        }
                      }}
                    </ElDropdownMenu>
                  )
                }
              }}
            </ElDropdown>
          </div>
        )
      }
    }
  }
])
const judgePermi = (val) => {
  if (val.value == 1) {
    return 'ordstorebatchorder:ordStoreBatchOrder:genPDF'
  } else if (val.value == 2) {
    return 'ordstorebatchorder:ordStoreBatchOrder:sendGoods'
  } else if (val.value == 4) {
    return 'ordstorebatchorder:ordStoreBatchOrder:cancel'
  } else if (val.value == 5) {
    return 'ordstorebatchorder:ordStoreBatchOrder:goApply'
  } else if (val.value == 6) {
    return 'ordstorebatchorder:ordStoreBatchOrder:cutOrd'
  } else if (val.value == 7) {
    return 'ordstorebatchorder:ordStoreBatchOrder:changeLogisticsInfo'
  } else {
    return ''
  }
}
const currentRow = ref<any>({})
const changSize = async (data, row = {} as any) => {
  currentRow.value = row
  if (data.value == 1) {
    push('/orderManagement/orderList/generatepickorder?id=' + JSON.stringify([row.storeBatchNo]))
  } else if (data.value == 2) {
    dialogConfig.title = t('orderList.sendOutGoods')
    dialogConfig.height = 400

    dialogConfig.visible = true
    dialogConfig.type = 2
  } else if (data.value == 5) {
    dialogConfig.title = t('common.a32')
    dialogConfig.height = 400

    dialogConfig.visible = true
    dialogConfig.type = 5
  } else if (data.value == 3) {
    dialogConfig.title = t('orderList.more3')
    dialogConfig.height = 100

    dialogConfig.visible = true
    dialogConfig.type = 3
  } else if (data.value == 4) {
    cancelOrder()
  } else if (data.value == 7) {
    dialogConfig.title = t('orderList.sendOutGoods')
    dialogConfig.height = 400
    const res = await viewLogisticsInfoApi(currentRow.value.storeBatchNo)
    if (res) {
      currentRow.value.deliveryDate = res.data.deliveryDate
      currentRow.value.deliveryType = res.data.deliveryType
      currentRow.value.carrier = res.data.carrier
      dialogConfig.visible = true
      dialogConfig.type = 7
    }
  } else if (data.value == 6) {
    dialogConfig.title = t('common.a30')
    dialogConfig.height = 500
    dialogConfig.visible = true
    dialogConfig.type = 6
    // const res = await getOrderGoodsApi(currentRow.value.storeBatchNo)
  } else if (data.value == 8) {
    dialogConfig.title = t('common.a35')
    dialogConfig.height = 170
    dialogConfig.visible = true
    dialogConfig.type = 8
  }
}
const dialogConfig = reactive({
  visible: false,
  title: t('orderList.sendOutGoods'),
  type: 1,
  height: 100
})
const writeRef = ref()
const cancelOrder = () => {
  ElMessageBox({
    title: t('orderList.cancel'),
    message: t('orderList.cancelContent'),
    showCancelButton: true,
    confirmButtonText: t('project.confirm'),
    cancelButtonText: t('project.cancel'),
    showClose: false
  })
    .then(async (action) => {
      const res = await cancelOrderApi(currentRow.value.storeBatchNo)
      if (res) {
        ElMessage.success(res.msg)
        getList()
      }
    })
    .catch(() => {})
}
const save = async () => {
  submitLoading.value = true
  let params = await writeRef.value.submit()
  if (params) {
    let res: any = null
    if (dialogConfig.type == 2) {
      params.storeBatchOrderNo = currentRow.value.storeBatchNo
      params = {
        storeBatchOrderNo: params.storeBatchOrderNo,
        carrier: params.carrier,
        deliveryDate: params.deliveryDate,
        deliveryType: params.deliveryType,
        logisticsCode: params.logisticsCode,
        logisticsNo: params.logisticsNo
      }
      res = await goSendAPi(params)
    }
    if (dialogConfig.type == 7) {
      params.storeBatchOrderNo = currentRow.value.storeBatchNo
      params = {
        storeBatchOrderNo: params.storeBatchOrderNo,
        carrier: params.carrier,
        deliveryDate: params.deliveryDate,
        deliveryType: params.deliveryType,
        logisticsCode: params.logisticsCode,
        logisticsNo: params.logisticsNo
      }
      res = await editFreightApi(params)
    }
    if (dialogConfig.type == 5) {
      params = {
        contractImageAddress: params.contractImageAddress,
        invoiceImgAddress: params.invoiceImgAddress,
        pickingListImgAddress: params.pickingListImgAddress,
        storeBatchOrderNo: currentRow.value.storeBatchNo
      }
      res = await goApplyAPi(params)
    }
    if (dialogConfig.type == 6) {
      res = await cutOrderApi(params)
    }
    if (res) {
      ElMessage.success(res.msg)
      dialogConfig.visible = false
      await getList()
    }
  }
  submitLoading.value = false
}

const TableRef = ref()
const showFlag = ref(false)

const scrollBehavior = (e: any) => {
  // 滚动方向判定
  const scrollDirection = e.deltaY > 0 ? 'down' : 'up'
  // 获取提供实际滚动的容器
  const dom =
    TableRef.value.elTableRef.$refs.bodyWrapper.getElementsByClassName('el-scrollbar__wrap')[0]

  const { clientHeight, scrollTop, scrollHeight } = dom
  // 父容器高度 + 子容器距离父容器顶端的高度 = 子容器可滚动的高度
  if (scrollTop == 0) {
    showFlag.value = false
    tableHeight.value = 'calc(100vh - 440px)'
  } else {
    showFlag.value = true
    tableHeight.value = 'calc(100vh - 270px)'
  }
}

onMounted(() => {
  init()
  // 挂载
  TableRef.value &&
    TableRef.value.elTableRef.$refs.bodyWrapper.addEventListener('mousewheel', scrollBehavior)
})

onUnmounted(() => {
  // 卸载
  TableRef.value &&
    TableRef.value.elTableRef.$refs.bodyWrapper.removeEventListener('mousewheel', scrollBehavior)
})

const init = async () => {
  const res = await getOrderTopApi()
  afterSaleStatusEnum.value = res.data.afterSaleStatus
  orderStatusEnum.value = res.data.orderStatus
  orderTypeEnum.value = res.data.orderType
  payTypeEnum.value = res.data.payType
  settStatusEnum.value = res.data.settStatus
  deliveryTypeEnum.value = res.data.deliveryType
  logisticsCompanyEnum.value = res.data.logisticsCompany
  payStatusEnum.value = res.data.payStatus
}

const batchJianhuo = () => {
  if (hasSelect.value.length > 0) {
    let arr: any = []
    hasSelect.value.forEach((item) => arr.push(item.storeBatchNo))
    push('/orderManagement/orderList/generatepickorder?id=' + JSON.stringify(arr))
  } else {
    ElMessage.warning(t('common.a5'))
  }
}

const { formRegister, formMethods } = useForm()
const { setValues, getFormData, getElFormExpose } = formMethods
const changeTab = async (val) => {
  await formMethods.setValues({
    queryStatus: val
  })
  searchParams.value.queryStatus = val
  currentPage.value = 1
  getList()
}
</script>

<style lang="less" scoped>
.subString {
  color: #747474;
  font-size: 14px;
  margin-right: 10px;
}
</style>
