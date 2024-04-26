<template>
  <Form
    v-if="flag == 2 || flag == 5 || flag == 7"
    @register="formRegister"
    :model="currentRow"
    :rules="flag == 5?rules1:rules"
    :schema="allSchema"
  />
  <div v-else-if="flag == 6" class="customW bg-white">
    <!-- <OrderInfo /> -->
    <div>
      <!-- 虚假表格 -->
      <div class="w-100%">
        <Table :columns="tableSchema" :data="hasSelect" />
      </div>
      <!-- 底部计算信息 -->
      <div
        class="min-w-424px box-border pt-10px pb-10px pl-20px pr-20px border-t-(1px solid #E8EAED ) border-b-(1px solid #E8EAED ) mt-12px flex font-size-14px color-colorBlack h-78px"
      >
        <div class="flex-b items-center w-60% overflow-hidden">
          <div class="w-10%"> {{ t('chooseGoods.remark') }}</div>
          <ElInput v-model="remark" class="w-85% h-40px ml-10px" />
        </div>
        <div class="w-40% pl-40px flex-b flex-col">
          <div class="flex-b">
            <span>{{ t('chooseGoods.sub1') }}:</span>
            <span>￥{{ allGoodsAmount }}</span>
          </div>
          <div class="flex-b">
            <span>{{ t('chooseGoods.sub2') }}:</span>
            <span>￥{{ allFreightAmount }}</span>
          </div>
        </div>
      </div>
      <div class="pa-20px font-size-14px color-colorGray min-w-424px">
        <div>{{ t('chooseGoods.sub3') }}:</div>
        <div class="flex mt-20px">
          <div class="w-60%"
            >{{ t('chooseGoods.sub4') }}：<span class="color-colorBlack">{{
              allGoodsType
            }}</span></div
          >
        </div>
        <div class="flex mt-20px">
          <div class="w-60%"
            >{{ t('chooseGoods.sub5') }}：<span class="color-colorBlack">{{
              allGoodsNum
            }}</span></div
          >
        </div>
      </div>
      <div class="flex justify-end">
        <div class="flex color-colorBlack items-end">
          <span class="font-size-14px mb-2px">{{ t('common.a33') }}：</span>
          <span class="font-size-20px">￥{{ hadPaidAmount }}</span>
        </div>
      </div>
    </div>
  </div>
  <div v-else-if="flag == 3" class="font-size-14px color-colorGray text-right ml-20px">
    <div class="flex-c">
      <div class="w-60px">{{ t('orderList.name') }}</div>
      <div class="color-colorBlack ml-20px">{{ receiveInfo.receiveName || '-' }}</div>
    </div>
    <div class="flex-c mt-20px">
      <div class="w-60px">{{ t('orderList.iphone') }}</div>
      <div class="color-colorBlack ml-20px">{{ receiveInfo.mobile || '-' }}</div>
    </div>
    <div class="flex-c mt-20px">
      <div class="w-60px">{{ t('orderList.address') }}</div>
      <!-- <div class="color-colorBlack ml-20px">{{
        receiveInfo.province + receiveInfo.city + receiveInfo.area + receiveInfo.address
      }}</div> -->
      <div class="color-colorBlack ml-20px">{{
        receiveInfo.province && receiveInfo.address && receiveInfo.city && receiveInfo.area
          ? receiveInfo.province + receiveInfo.city + receiveInfo.area + receiveInfo.address
          : '-'
      }}</div>
    </div>
  </div>
  <div v-else-if="flag == 8" class="flex">
    <div class="w-62px text-left color-colorBlack font-size-14px">{{ t('common.a35') }}</div>
    <div class="flex flex-col">
      <ElInput :value="currentRow?.directCode" :disabled="true" />
      <div
        @click="copy"
        class="mt-20px w-300px h-40px border-rd-4px bg-#0068e3 line-height-40px font-size-14px color-white text-center"
        >{{ t('common.a36') }}</div
      >
    </div>
  </div>
</template>
<script setup lang="tsx">
import { FormSchema, Form } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { reactive, ref, watch, onMounted } from 'vue'
import UploadImage from '@/components/UploadImage/UploadImage.vue'
import { useValidator } from '@/hooks/web/useValidator'
import { useI18n } from '@/hooks/web/useI18n'
import { ElMessage, ElInput, ElInputNumber } from 'element-plus'
import { Table, TableColumn } from '@/components/Table'
import Icon from '@/components/Icon/src/Icon.vue'
import { getOrderGoodsApi } from '@/api/orderManagement/OrderList.ts'
const { t } = useI18n()

const { required } = useValidator()
const props = defineProps({
  flag: {
    type: Number,
    value: 2
  },
  currentRow: {
    type: Object,
    value: () => {}
  },
  deliveryTypeEnum: {
    type: Array,
    value: () => []
  },
  logisticsCompanyEnum: {
    type: Array,
    value: () => []
  }
})
const receiveInfo = ref<any>(
  props.currentRow.receiveInfo ? JSON.parse(props.currentRow.receiveInfo) : {}
)
const { formRegister, formMethods } = useForm()
const rules = ref({
  logisticsNo: [required()],
  deliveryDate: [required()],
  deliveryType: [required()],
  pickingListImgAddress: [required()],
  invoiceImgAddress: [required()],
  contractImageAddress: [required()],
  logisticsCode: [required()]
})

const rules1 = ref({
  // logisticsNo: [required()],
  deliveryDate: [required()],
  deliveryType: [required()],
  // pickingListImgAddress: [required()],
  // invoiceImgAddress: [required()],
  // contractImageAddress: [required()],
  logisticsCode: [required()]
})


const allSchema = ref<FormSchema[]>([
  {
    field: 'logisticsNo',
    label: t('orderList.sendOutGoods1'),
    component: 'Input',
    colProps: {
      span: 24
    },
    componentProps: {
      maxlength: 30,
      showWordLimit: true
    }
  },
  {
    field: 'deliveryDate',
    label: t('orderList.sendOutGoods2'),
    component: 'DatePicker',
    colProps: {
      span: 24
    },
    componentProps: {
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
      type: 'datetime',
      style: {
        width: '100%'
      }
    }
  },
  {
    field: 'deliveryType',
    label: t('orderList.sendOutGoods3'),
    component: 'Select',
    colProps: {
      span: 24
    },
    componentProps: {
      options: props.deliveryTypeEnum,

      style: {
        width: '100%'
      }
    }
  },
  {
    field: 'logisticsCode',
    label: t('aftersalesList.kuaidigs'),
    component: 'Select',
    colProps: {
      span: 24
    },
    componentProps: {
      options: props.logisticsCompanyEnum,
      filterable: true,
      props: {
        value: 'name',
        label: 'companyName'
      },
      style: {
        width: '100%'
      }
    }
  },
  {
    field: 'carrier',
    label: t('orderList.sendOutGoods4'),
    component: 'Input',
    colProps: {
      span: 24
    }
  }
  // {
  //   field: 'jianhuodan',
  //   label: t('orderList.sendOutGoods5'),
  //   colProps: {
  //     span: 12
  //   },
  //   formItemProps: {
  //     slots: {
  //       default: (data) => {
  //         return <UploadImage ref={jianhuodanRef} v-model={jianhuodanImgs.value}></UploadImage>
  //       }
  //     }
  //   }
  // }
  // {
  //   field: 'fapiao',
  //   label: t('orderList.sendOutGoods6'),
  //   colProps: {
  //     span: 12
  //   },
  //   formItemProps: {
  //     slots: {
  //       default: (data) => {
  //         return <UploadImage ref={fapiaoRef} v-model={fapiaoImgs.value}></UploadImage>
  //       }
  //     }
  //   }
  // },
  // {
  //   field: 'pangbai',
  //   label: t('orderList.sendOutGoods6'),
  //   colProps: {
  //     span: 24
  //   },
  //   formItemProps: {
  //     slots: {
  //       default: () => {
  //         return <span>{t('orderList.sub')}</span>
  //       }
  //     }
  //   }
  // }
])
const pickingImg = ref<any>([])
const invoiceImg = ref<any>([])
const contractImg = ref<any>([])
const fahuoSchema = ref<FormSchema[]>([
  {
    field: 'logisticsNo',
    label: t('orderList.sendOutGoods1'),
    component: 'Input',
    colProps: {
      span: 24
    },
    componentProps: {
      disabled: true,
      maxlength: 30,
      showWordLimit: true
    }
  },
  {
    field: 'pickingListImgAddress',
    label: t('aftersalesList.a'),
    colProps: {
      span: 12
    },
    formItemProps: {
      slots: {
        default: (data) => {
          return (
            <UploadImage
              onUpdateImgUrl={(e) => {
                data.pickingListImgAddress = e
              }}
              v-model={pickingImg.value}
            ></UploadImage>
          )
        }
      }
    }
  },
  {
    field: 'invoiceImgAddress',
    label: t('orderList.sendOutGoods6'),
    colProps: {
      span: 12
    },
    formItemProps: {
      slots: {
        default: (data) => {
          return (
            <UploadImage
              onUpdateImgUrl={(e) => {
                data.invoiceImgAddress = e
              }}
              v-model={invoiceImg.value}
            ></UploadImage>
          )
        }
      }
    }
  },
  {
    field: 'aa',
    label: ' ',
    colProps: {
      span: 24
    },
    formItemProps: {
      slots: {
        default: () => {
          return <div>{t('common.p1')}</div>
        }
      }
    }
  },
  {
    field: 'contractImageAddress',
    label: t('aftersalesList.b'),
    colProps: {
      span: 24
    },
    formItemProps: {
      slots: {
        default: (data) => {
          return (
            <UploadImage
              onUpdateImgUrl={(e) => {
                data.contractImageAddress = e
              }}
              v-model={contractImg.value}
            ></UploadImage>
          )
        }
      }
    }
  },
  {
    field: 'bb',
    label: ' ',
    colProps: {
      span: 24
    },
    formItemProps: {
      slots: {
        default: () => {
          return <div>{t('common.p2')}</div>
        }
      }
    }
  }
])
onMounted(async () => {
  if (props.flag == 5) {
    allSchema.value = fahuoSchema.value
  } else if (props.flag == 6) {
    const res = await getOrderGoodsApi(props.currentRow.storeBatchNo)
    if (res) {
      allFreightAmount.value = res.data.freightAmount
      hadPaidAmount.value = res.data.paidAmount
      res.data.spuInfoList.forEach((e) => {
        e.skuInfoList.forEach((a) => {
          a.editFlag = false
        })
      })
      hasSelect.value = res.data.spuInfoList
      countData()
    }
  }
})
const submit = async () => {
  if (props.flag == 6) {
    let params = {
      goodsOrd: {},
      storeOrdNo: props.currentRow.storeBatchNo
    }
    hasSelect.value.forEach((a) => {
      a.skuInfoList.forEach((b) => {
        params.goodsOrd[b.goodsOrdNo] = b.num
      })
    })
    return params
  }
  const formEl = await formMethods.getElFormExpose()
  const valid = await formEl?.validate()
  if (valid) {
    let params = await formMethods.getFormData()
    return params
  }
  return null
}
const copy = () => {
  const el = document.createElement('input')
  // 给input元素赋值需要复制的文本
  el.setAttribute('value', props.currentRow.directCode)
  // 将input元素插入页面
  document.body.appendChild(el)
  // 选中input元素的文本
  el.select()
  // 复制内容到剪贴板
  document.execCommand('copy')
  // 删除input元素
  document.body.removeChild(el)
  ElMessage.success(t('common.a37'))
}
defineExpose({
  formMethods,
  submit
})

//截单
const affixImgUrl = import.meta.env.VITE_IMG_URL
const hasSelect = ref<any>([])
const remark = ref('')
const allGoodsAmount = ref(0)
const allFreightAmount = ref(0)
const allGoodsType = ref(0)
const allGoodsNum = ref(0)
const hadPaidAmount = ref(0)
const tableSchema = reactive<TableColumn[]>([
  {
    field: 'field1',
    label: t('chooseGoods.info'),
    slots: {
      default: (data) => {
        return (
          <div class="w-100% flex overflow-hidden min-w-535px">
            <img
              class="w-50px h-50px bg-colorGray border-rd-4px"
              src={affixImgUrl + data.row.spuImage}
              alt=""
            />
            <div class="flex flex-col ml-10px" style="width: calc(100% - 70px)">
              <div class="truncate">{data.row.spuName}</div>
              {data.row.skuInfoList.map((item, index) => (
                <div class="flex-b w-100% mt-10px" key={item.goodsOrdNo}>
                  <div class="w-45% flex">
                    <span class="inline-block">{t('aftersalesList.guige')}{index + 1}:</span>
                    <span class="inline-block pl-10px" style="width: calc(100% - 50px)">
                      {item.skuIndexesVal}
                    </span>
                  </div>
                  {item.editFlag ? (
                    <div class="w-25% color-colorGray flex items-center">
                      <ElInputNumber
                        v-model={item.num}
                        onChange={() => {
                          countData()
                        }}
                        size="small"
                        min={1}
                        controlsPosition="right"
                      />
                      {/* max={item.stock} */}
                      <div
                        onClick={() => {
                          item.editFlag = false
                        }}
                        class="w-32px h-22px bg-colorMain color-white line-height-22px text-center font-size-12px border-rd-4px ml-5px"
                      >
                        {t('project.confirm')}
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => {
                        item.editFlag = true
                      }}
                      class="w-25% color-colorGray flex items-center"
                    >
                      <span>x{item.num}</span>
                      <Icon class="!w-10px !h-10px inline-block" icon="svg-icon:edit" />
                    </div>
                  )}

                  {/* <div class="w-18%">￥{item.price}</div> */}
                  <div class="w-18%">￥{parseInt(item.num) * item.unitPrice}</div>
                  <div
                    onClick={() => {
                      deleteSku(item)
                    }}
                    class="w-10% color-red1 cursor-pointer"
                  >
                    {t('project.delete')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      }
    }
  }
  // {
  //   field: 'field2',
  //   label: t('chooseGoods.fright'),
  //   width: '210px',
  //   slots: {
  //     default: (data) => {
  //       return (
  //         <div>
  //           {data.row.freightAmountFlag ? (
  //             <div class="w-100% color-colorGray flex items-center">
  //               <ElInput v-model={data.row.freightAmount} type="number" class="!w-70px !h-22px" />
  //               <div
  //                 onClick={() => {
  //                   data.row.freightAmountFlag = false
  //                 }}
  //                 class="w-32px h-22px bg-colorMain color-white line-height-22px text-center font-size-12px border-rd-4px ml-5px"
  //               >
  //                 确认
  //               </div>
  //             </div>
  //           ) : (
  //             <div
  //               class="flex-c cursor-pointer"
  //               onClick={() => {
  //                 data.row.freightAmountFlag = true
  //               }}
  //             >
  //               <div>{data.row.freightAmount}</div>
  //               <Icon class="!w-10px !h-10px inline-block ml-5px" icon="svg-icon:edit" />
  //             </div>
  //           )}
  //         </div>
  //       )
  //     }
  //   }
  // }
])
//改变数量时修改价格
const countData = () => {
  let totalAmount = 0
  let totalCatogary = 0
  let totalNum = 0
  hasSelect.value.forEach((e) => {
    totalCatogary++
    e.skuInfoList.forEach((a) => {
      totalNum += a.num
      totalAmount += parseInt(a.num) * a.unitPrice
    })
  })
  allGoodsAmount.value = totalAmount
  allGoodsType.value = totalCatogary
  allGoodsNum.value = totalNum
}
//删除某个规格
const deleteSku = (item) => {
  if (hasSelect.value.length == 1 && hasSelect.value[0].skuInfoList.length == 1) {
    ElMessage.warning(t('common.p3'))
    return
  }
  let arr: any = []
  hasSelect.value.forEach((a) => {
    arr.push({ ...a })
    // arr.skuInfoList = []
    arr[arr.length - 1].skuInfoList = []
    a.skuInfoList.forEach((b) => {
      if (b.goodsOrdNo != item.goodsOrdNo) {
        arr[arr.length - 1].skuInfoList.push({ ...b })
      }
    })
    if (arr[arr.length - 1].skuInfoList.length == 0) {
      arr.pop()
    }
  })
  hasSelect.value = arr
  countData()
  // delSpuId.value = item.spuId
  // delSkuId.value = item.skuId
}
</script>
