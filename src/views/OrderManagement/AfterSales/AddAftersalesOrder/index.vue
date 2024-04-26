<template>
  <div class="flex-b items-stretch mt-20px">
    <!-- 左边  -->
    <div class="customLW bg-white">
      <ContentWrap>
        <div class="flex-c">
          <span class="font-size-14px color-colorBlack min-w-64px text-nowrap"
            ><span class="color-red1">*</span>{{ t('aftersalesList.orderNo') }}</span
          >
          <ElInput class="!w-390px ml-20px" v-model="orderNo" :clearable="true" />
          <ElButton class="ml-30px min-w-100px" type="primary" @click="getList">{{
            t('aftersalesList.pipei')
          }}</ElButton>
        </div>
        <Table
          class="mt-30px"
          :columns="allSchemas.tableColumns"
          :data="dataList"
          :loading="loading"
          @select="handleSelectionChange"
          @select-all="handleSelectionAllChange"
          @register="tableRegister"
        />
      </ContentWrap>
    </div>
    <!-- 右边 -->
    <div class="customRW bg-white">
      <ContentWrap class="relative">
        <div
          v-show="selectArr.length == 0"
          class="absolute z-100 left-0 right-0 top-0 bottom-0"
          style="background-color: rgba(0, 0, 0, 0.5)"
        ></div>
        <Form :schema="formSchema" @register="formRegister" :rules="rules" :is-col="false" />
        <div class="flex justify-end mt-60px">
          <ElButton>{{ t('project.cancel') }}</ElButton>
          <ElButton type="primary" @click="submit">{{ t('project.confirm') }}</ElButton>
        </div>
      </ContentWrap>
    </div>
  </div>
</template>
<script setup lang="tsx">
import { Search } from '@/components/Search'
import { FormSchema, Form } from '@/components/Form'
import { ref, reactive } from 'vue'
import { ContentWrap } from '@/components/ContentWrap'
import { ElInput, ElButton, ElInputNumber, ElSelect, ElOption, ElMessage } from 'element-plus'
import { useTable } from '@/hooks/web/useTable'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { Table } from '@/components/Table'
import { Icon } from '@/components/Icon'
import UploadImage from '@/components/UploadImage/UploadImage.vue'
import { useI18n } from '@/hooks/web/useI18n'
import { getStoreOrderByOrderNoApi } from '@/api/orderManagement/OrderList.ts'
import { getAfterSalesTopApi, addAfSalesRecordApi } from '@/api/orderManagement/AfterSales.ts'
import { onMounted, watch } from 'vue'
import { useValidator } from '@/hooks/web/useValidator'
import { useForm } from '@/hooks/web/useForm'
import { useRouter } from 'vue-router'

const { t } = useI18n()
const { required } = useValidator()
const { push } = useRouter()
//静态枚举内容
const affixImgUrl = import.meta.env.VITE_IMG_URL
const afterSalesTypeEnum = ref()
const goodsStatusEnum = ref()
const noReceiveReasonEnum = ref<any>([])
const receiveReasonEnum = ref<any>([])
//左边内容
const orderNo = ref('TEST-SBN-000000001')
let currentOrderNo = ''
const { tableRegister, tableState, tableMethods } = useTable({
  fetchDataApi: async () => {
    currentOrderNo = orderNo.value
    let res: any = {
      data: []
    }
    if (orderNo.value) {
      res = await getStoreOrderByOrderNoApi(orderNo.value)
      res.data.forEach((item) => {
        item.editFlag = false
        item.showEdit = false
        item.maxNum = item.num
      })
    }

    return {
      list: res.data,
      total: 0
    }
  }
})
const { total, loading, dataList, pageSize, currentPage } = tableState
const { getList } = tableMethods

const crudSchemas = reactive<CrudSchema[]>([
  {
    field: 'selection',
    table: {
      type: 'selection'
    }
  },
  {
    field: 'goodsInfo',
    label: t('aftersalesList.info'),
    search: {
      hidden: true
    },
    table: {
      width: 350,
      slots: {
        default: (data) => {
          return (
            <div class="flex w-100% overflow-hidden">
              <img
                class="min-w-50px w-50px h-50px min-h-50px border-rd-4px bg-pink "
                src={affixImgUrl + data.row.skuImage}
              ></img>
              <div class="ml-10px w-275px flex flex-col">
                <span class="font-size-14px w-100% inline-block color-colorBlack text-ellipsis line-clamp-1">
                  {data.row.spuName}
                </span>
                <span class="font-size-12px w-98% inline-block color-colorGray text-ellipsis line-clamp-1">
                  {data.row.skuIndexesVal}
                </span>
              </div>
            </div>
          )
        }
      }
    }
  },
  {
    field: 'unitPrice',
    label: t('aftersalesList.price3'),
    search: {
      hidden: true
    }
  },
  {
    field: 'num',
    label: t('aftersalesList.count'),
    search: {
      hidden: true
    },
    table: {
      width: 200,
      slots: {
        default: (data) => {
          return (
            <div>
              {data.row.editFlag ? (
                <div class="flex-c">
                  <ElInputNumber
                    v-model={data.row.num}
                    min={1}
                    max={data.row.maxNum}
                    controlsPosition="right"
                    size="small"
                    onChange={inputNumberChange}
                  ></ElInputNumber>
                  <div
                    onClick={() => {
                      data.row.editFlag = false
                    }}
                    class="bg-colorMain ml-4px color-white border-rd-4px font-size-12px cursor-pointer pl-4px pr-4px"
                  >
                    {t('project.confirm')}
                  </div>
                </div>
              ) : (
                <div class="flex-c">
                  <div>{data.row.num}</div>
                  {data.row.showEdit ? (
                    <span
                      onClick={() => {
                        data.row.editFlag = true
                      }}
                      class="mt-5px"
                    >
                      <Icon
                        class="!w-10px !h-10px inline-block ml-6px cursor-pointer"
                        icon="svg-icon:edit"
                      />
                    </span>
                  ) : (
                    ''
                  )}
                </div>
              )}
            </div>
          )
        }
      }
    }
  },
  {
    field: 'amountPaid',
    label: t('aftersalesList.price4'),
    search: {
      hidden: true
    }
  },
  {
    field: 'logisticsStatusStr',
    label: t('aftersalesList.status1'),
    search: {
      hidden: true
    }
  }
])

const { allSchemas } = useCrudSchemas(crudSchemas)
//右边内容
const { formRegister, formMethods } = useForm()
const rules = ref({
  afSalesType: [required()],
  goodsStatus: [required()],
  reason: [required()],
  refundGoodsAmount: [required()],
  refundFreightAmount: [required()],
  remark: [required()]
})
const imgRef = ref()
const imgList = ref([])
watch(
  () => imgList.value,
  async () => {
    let imgUrl = imgRef.value.getFileList()
    await formMethods.setValues({
      imgUrl
    })
    const formEl = await formMethods.getElFormExpose()
    await formEl?.validateField(['imgUrl'])
  }
)
const formSchema = reactive<FormSchema[]>([
  {
    field: 'goodsPriceFlag',
    value: false
  },
  {
    field: 'freightPriceFlag',
    value: false
  },
  {
    field: 'afSalesType',
    label: t('aftersalesList.type'),
    component: 'RadioGroup',
    componentProps: {
      options: afterSalesTypeEnum
    }
  },
  {
    field: 'goodsStatus',
    label: t('aftersalesList.status1'),
    component: 'RadioGroup',
    value: 'NO_RECEIVE_GOODS',
    componentProps: {
      options: goodsStatusEnum,
      on: {
        change: async () => {
          await formMethods.setValues({
            reason: ''
          })
        }
      }
    }
  },
  {
    field: 'reason',
    label: t('aftersalesList.reason'),
    formItemProps: {
      slots: {
        default: (data) => {
          return (
            <ElSelect v-model={data.reason} class="m-2">
              {data.goodsStatus == 'NO_RECEIVE_GOODS'
                ? noReceiveReasonEnum.value.map((item, index) => (
                    <ElOption key={index} label={item.label} value={item.value}></ElOption>
                  ))
                : receiveReasonEnum.value.map((item, index) => (
                    <ElOption key={index} label={item.label} value={item.value}></ElOption>
                  ))}
            </ElSelect>
          )
        }
      }
    }
  },
  {
    field: 'refundGoodsAmount',
    label: t('aftersalesList.price5'),
    formItemProps: {
      slots: {
        default: (data) => {
          return (
            <div>
              {data.goodsPriceFlag ? (
                <div class="flex-c font-size-14px">
                  <ElInputNumber
                    v-model={data.refundGoodsAmount}
                    min={0}
                    max={allGoodsPrice.value}
                    precision={2}
                    controlsPosition="right"
                  ></ElInputNumber>
                  <div
                    onClick={() => {
                      data.goodsPriceFlag = false
                    }}
                    class="bg-colorMain ml-4px color-white border-rd-4px font-size-12px cursor-pointer pl-6px pr-6px"
                  >
                    {t('project.confirm')}
                  </div>
                </div>
              ) : (
                <div class="flex-c font-size-14px">
                  <span class="color-red1">{data.refundGoodsAmount}</span>
                  <span class="color-colorBlack ml-4px">{t('aftersalesList.price9')}</span>
                  <span
                    onClick={() => {
                      data.goodsPriceFlag = true
                    }}
                    class="mt-4px"
                  >
                    <Icon class="!w-10px !h-10px inline-block ml-6px" icon="svg-icon:edit" />
                  </span>
                </div>
              )}
            </div>
          )
        }
      }
    }
  },
  {
    field: 'refundFreightAmount',
    label: t('aftersalesList.price6'),
    formItemProps: {
      slots: {
        default: (data) => {
          return (
            <div>
              {data.freightPriceFlag ? (
                <div class="flex-c font-size-14px">
                  <ElInputNumber
                    v-model={data.refundFreightAmount}
                    min={0}
                    max={allFreightPrice.value}
                    precision={2}
                    controlsPosition="right"
                  ></ElInputNumber>
                  <div
                    onClick={() => {
                      data.freightPriceFlag = false
                    }}
                    class="bg-colorMain ml-4px color-white border-rd-4px font-size-12px cursor-pointer pl-6px pr-6px"
                  >
                    {t('project.confirm')}
                  </div>
                </div>
              ) : (
                <div class="flex-c font-size-14px">
                  <span class="color-red1">{data.refundFreightAmount}</span>
                  <span class="color-colorBlack ml-4px">{t('aftersalesList.price9')}</span>
                  <span
                    onClick={() => {
                      data.freightPriceFlag = true
                    }}
                    class="mt-4px"
                  >
                    <Icon class="!w-10px !h-10px inline-block ml-6px" icon="svg-icon:edit" />
                  </span>
                </div>
              )}
            </div>
          )
        }
      }
    }
  },
  {
    field: 'remark',
    label: t('image.sub13'),
    component: 'Input',
    componentProps: {
      type: 'textarea',
      rows: 5,
      showWordLimit: true,
      maxlength: 300
    }
  },
  {
    field: 'imgUrl',
    label: t('aftersalesList.reason1'),
    formItemProps: {
      slots: {
        default: () => {
          return (
            <div class="flex flex-col">
              <UploadImage ref={imgRef} v-model={imgList.value} />
              <div>{t('image.sub14')}</div>
            </div>
          )
        }
      }
    }
  }
])

onMounted(() => {
  init()
})
const init = async () => {
  const res = await getAfterSalesTopApi()
  afterSalesTypeEnum.value = res.data.afterSalesTypeEnum
  goodsStatusEnum.value = res.data.goodsStatusEnum
  noReceiveReasonEnum.value = res.data.noReceiveReasonEnum
  receiveReasonEnum.value = res.data.receiveReasonEnum
}
const selectArr = ref<Array<any>>([])
const handleSelectionChange = (val) => {
  if (val.length > selectArr.value.length) {
    for (const item of val) {
      let flag = true
      for (const aitem of selectArr.value) {
        if (item.id == aitem.id) {
          flag = false
          break
        }
      }
      if (flag) {
        item.showEdit = true
        break
      }
    }
    selectArr.value = [...val]
  } else if (val.length < selectArr.value.length) {
    for (const item of selectArr.value) {
      let flag = true
      for (const aitem of val) {
        if (item.id == aitem.id) {
          flag = false
          break
        }
      }
      if (flag) {
        item.showEdit = false
        break
      }
    }
    selectArr.value = [...val]
  }
}
const handleSelectionAllChange = (val) => {
  if (val.length > 0) {
    selectArr.value = [...val]
    selectArr.value.forEach((item) => {
      item.showEdit = true
    })
  } else if (val.length == 0) {
    selectArr.value.forEach((item) => {
      item.showEdit = false
    })
    selectArr.value = [...val]
  }
}
//总计退货商品数量
const count = ref(0)
const allGoodsPrice = ref(0)
const allFreightPrice = ref(0)
const inputNumberChange = () => {
  let tempAccount = 0
  let tempGoodsPrice = 0
  let tempFreightPrice = 0
  selectArr.value.forEach((item) => {
    tempAccount += item.num
    tempGoodsPrice += (item.amount / item.maxNum) * item.num
    tempFreightPrice += item.freightAmount
  })
  count.value = tempAccount
  allGoodsPrice.value = tempGoodsPrice
  allFreightPrice.value = tempFreightPrice
  formMethods.setValues({
    refundGoodsAmount: allGoodsPrice.value,
    refundFreightAmount: allFreightPrice.value
  })
}
watch(
  () => selectArr.value.length,
  () => {
    inputNumberChange()
  }
)

const submit = async () => {
  const elForm = await formMethods.getElFormExpose()
  await elForm?.validate(async (valid) => {
    if (valid) {
      const param = await formMethods.getFormData()
      param.goodsDTOS = []
      param.storeBatchOrderNo = currentOrderNo
      selectArr.value.forEach((item) => {
        param.goodsDTOS.push({
          goodsOrderNo: item.goodsOrderNo,
          num: item.num
        })
      })
      if (!param.imgUrl) {
        param.imgUrl = ''
      }
      const res = await addAfSalesRecordApi(param)
      res.code == 200 && ElMessage.success(res.msg) && push('/orderManagement/afterSales')
    }
  })
}
</script>
<style scoped lang="less">
.customLW {
  width: calc(50% - 10px);
}

.customRW {
  width: calc(50% - 10px);
}

.el-card {
  border: none;
}
</style>
