<template>
  <div v-if="categoryList" class="flex-b w-100% items-stretch flex-wrap min-w-1600px">
    <div class="customW bg-white">
      <SelectGoods
        ref="selectRef"
        :category-list="categoryList"
        :del-spu-id="delSpuId"
        :del-sku-id="delSkuId"
        :huixian-arr="huixianArr"
        @update-has-select="updateHasSelect"
        @intel-distribute="intelDistribute"
      />
    </div>
    <div class="customW bg-white">
      <!-- <OrderInfo /> -->
      <div>
        <div class="pa-20px w-100% min-w-725px">
          <div class="font-size-20px color-colorBlack">{{ t('chooseGoods.manifestInfo') }}</div>
        </div>
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
            <div class="w-40% flex-b">
              <span>{{ t('chooseGoods.sub1') }}：</span>
              <span class="color-colorBlack">￥{{ allGoodsAmount }}</span>
            </div>
          </div>
          <div class="flex mt-20px">
            <div class="w-60%"
              >{{ t('chooseGoods.sub5') }}：<span class="color-colorBlack">{{
                allGoodsNum
              }}</span></div
            >
            <div class="w-40% flex-b">
              <span>{{ t('chooseGoods.sub2') }}：</span>
              <span class="color-colorBlack">￥{{ allFreightAmount }}</span>
            </div>
          </div>
          <!-- 优惠 -->
          <div class="flex mt-20px justify-end">
            <div class="w-40% flex-b">
              <span>{{ t('chooseGoods.sub6') }}：</span>
              <div v-if="couponFlag" class="color-colorGray flex items-center">
                <ElInputNumber
                  v-model="allCouponAmount"
                  size="small"
                  controlsPosition="right"
                  :min="0"
                  class="!w-90px color-colorBlack"
                />
                <div
                  @click="changeCoupon"
                  class="w-32px h-22px bg-colorMain color-white line-height-22px text-center font-size-12px border-rd-4px ml-5px"
                >
                  {{ t('project.confirm') }}</div
                >
              </div>
              <div v-else @click="couponFlag = true" class="flex-c">
                <div class="font-size-14px color-colorBlack mr-5px">￥{{ allCouponAmount }}</div>
                <Icon class="!w-10px !h-10px inline-block" icon="svg-icon:edit" />
              </div>
            </div>
          </div>
          <!-- 应付总额 -->
          <div class="flex mt-20px justify-end">
            <div class="w-40% flex-b">
              <span
                >{{ t('chooseGoods.sub7') }}：<span class="color-colorBlack font-size-20px"
                  >￥{{
                    (
                      parseFloat(allGoodsAmount) +
                      parseFloat(allFreightAmount) -
                      (!allCouponAmount ? 0 : parseFloat(allCouponAmount))
                    ).toFixed(2)
                  }}</span
                ></span
              >
            </div>
          </div>
          <!-- 按钮 -->
          <div class="flex mt-40px justify-end">
            <div class="w-40% flex min-w-232px">
              <el-button text bg @click="push('/orderManagement/orderList')">{{
                t('project.cancel')
              }}</el-button>
              <el-button
                v-hasPermi="'ordstorebatchorder:ordStoreBatchOrder:genDRCOrd'"
                type="primary"
                @click="submitOrder"
                class="ml-20px"
                >{{ t('chooseGoods.btn') }}</el-button
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <Dialog v-model="dialogVisible" :title="t('common.a34')" class="!w-450px" max-height="170px">
    <div class="flex">
      <div class="w-62px text-left color-colorBlack font-size-14px">{{ t('common.a35') }}</div>
      <div class="flex flex-col">
        <ElInput v-model="directCode" :disabled="true" />
        <div
          @click="copy"
          class="mt-20px w-300px h-40px border-rd-4px bg-#0068e3 line-height-40px font-size-14px color-white text-center"
          >{{ t('common.a36') }}</div
        >
      </div>
    </div>
  </Dialog>
</template>
<script setup lang="tsx">
import SelectGoods from './components/SelectGoods.vue'
import OrderInfo from './components/OrderInfo.vue'
import { getDirectOrderTopApi, generateDistributeAPi } from '@/api/orderManagement/OrderList.ts'
import { onMounted, ref, reactive, watch } from 'vue'
import { cloneDeep, debounce } from 'lodash-es'
import { Table, TableColumn } from '@/components/Table'
import { useTable } from '@/hooks/web/useTable'
import { ElButton, ElScrollbar, ElInput, ElInputNumber, ElMessage } from 'element-plus'
import Icon from '@/components/Icon/src/Icon.vue'
import { useI18n } from '@/hooks/web/useI18n'
import { Dialog } from '@/components/Dialog'
import { useRouter } from 'vue-router'
const { t } = useI18n()
const { currentRoute, push } = useRouter()
const affixImgUrl = import.meta.env.VITE_IMG_URL
onMounted(() => {
  init()
})
const dialogVisible = ref<any>(false)
const directCode = ref<any>('')
const remark = ref<any>('')
const allGoodsType = ref<any>(0)
const allGoodsNum = ref<any>(0)
const allGoodsAmount = ref<any>(0)
const allFreightAmount = ref<any>(0)
const allCouponAmount = ref<any>(0)
const couponFlag = ref(false)
//table
const changePrice = (item) => {
  for (const a of item.rangePrice) {
    let endCount = parseInt(a.endCount)
    let num = parseInt(item.num)
    if (num <= endCount) {
      item.price = (num * parseFloat(a.price)).toFixed(2)
      break
    }
  }
}
const delSpuId = ref('')
const delSkuId = ref('')
const deleteSku = (item) => {
  delSpuId.value = item.spuId
  delSkuId.value = item.skuId
}
const tableSchema = reactive<TableColumn[]>([
  {
    field: 'field1',
    label: t('chooseGoods.info'),
    width: '720px',
    slots: {
      default: (data) => {
        console.log(data.row, 'woshidatarow')
        return (
          <div class="w-100% flex overflow-hidden min-w-535px">
            <img
              class="w-50px h-50px bg-colorGray border-rd-4px"
              src={affixImgUrl + data.row.spuImage}
              alt=""
            />
            <div class="flex flex-col ml-10px" style="width: calc(100% - 70px)">
              <div class="truncate">{data.row.spuName}</div>
              {data.row.skus.map((item, index) => (
                <div class="flex-b w-100% mt-10px" key={item.skuId}>
                  <div class="w-45% flex">
                    <span class="inline-block">
                      {t('productList.specifications')}
                      {index + 1}:
                    </span>
                    <span class="inline-block pl-10px" style="width: calc(100% - 50px)">
                      {item.indesexVal}
                    </span>
                  </div>
                  {/* 区间价格 */}
                  <div class="rangePrice flex-c mr-20px">
                    {item.rangePrice.map((aitem, index) => {
                      return (
                        <div class="flex-c real-item" key={index}>
                          <span>
                            ${aitem.price}/{aitem.startCount}-{aitem.endCount}
                            {t('chooseGoods.danwei')}
                          </span>
                          <div class="w-1px h-13px bg-#e3e3e3 line ml-10px mr-10px"></div>
                        </div>
                      )
                    })}
                    {/* 数量 */}
                  </div>
                  {item.editFlag ? (
                    <div class="w-25% color-colorGray flex items-center">
                      <ElInputNumber
                        v-model={item.num}
                        onChange={() => {
                          changePrice(item)
                        }}
                        size="small"
                        max={item.stock}
                        min={1}
                        controlsPosition="right"
                      />
                      <div
                        onClick={() => {
                          item.editFlag = false
                          item.num = !item.num ? 1 : item.num
                        }}
                        class="w-32px h-22px bg-colorMain color-white line-height-22px text-center font-size-12px border-rd-4px ml-5px"
                      >
                        {t('common.ok')}
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

                  <div class="w-18%">￥{item.price}</div>
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
  },
  {
    field: 'field2',
    label: t('chooseGoods.fright'),
    width: '210px',
    slots: {
      default: (data) => {
        return (
          <div>
            {data.row.freightAmountFlag ? (
              <div class="w-100% color-colorGray flex items-center">
                <ElInputNumber
                  controlsPosition="right"
                  size="small"
                  class="!w-90px"
                  v-model={data.row.freightAmount}
                  min={0}
                />
                <div
                  onClick={() => {
                    data.row.freightAmountFlag = false
                    console.log(data.row.freightAmount)
                    data.row.freightAmount = !data.row.freightAmount ? 0 : data.row.freightAmount
                  }}
                  class="w-32px h-22px bg-colorMain color-white line-height-22px text-center font-size-12px border-rd-4px ml-5px"
                >
                  {t('common.ok')}
                </div>
              </div>
            ) : (
              <div
                class="flex-c cursor-pointer"
                onClick={() => {
                  data.row.freightAmountFlag = true
                }}
              >
                <div>{data.row.freightAmount}</div>
                <Icon class="!w-10px !h-10px inline-block ml-5px" icon="svg-icon:edit" />
              </div>
            )}
          </div>
        )
      }
    }
  }
])

const hasSelect = ref<any>([])
let timer: any = null
const countData = () => {
  let tempGoodsType = 0
  let tempGoodsNum = 0
  let tempGoodsAmount = 0
  let tempFreightAmount = 0
  hasSelect.value.forEach((item) => {
    tempFreightAmount += !item.freightAmount ? 0 : parseInt(item.freightAmount)
    tempGoodsType++
    item.skus.forEach((aitem) => {
      tempGoodsNum += !aitem.num ? 1 : parseInt(aitem.num)
      tempGoodsAmount += parseFloat(aitem.price)
    })
  })
  console.log(tempGoodsAmount.toFixed(2), tempFreightAmount.toFixed(2))
  allGoodsType.value = tempGoodsType
  allGoodsNum.value = tempGoodsNum
  allGoodsAmount.value = tempGoodsAmount.toFixed(2)
  allFreightAmount.value = tempFreightAmount.toFixed(2)
}
const huixianArr = ref<any>([])
const createHuiXian = () => {
  let obj: any = {}
  hasSelect.value.forEach((item) => {
    obj[item.spuId] = []
    item.skus.forEach((aitem) => {
      obj[item.spuId].push(aitem.skuId)
    })
  })
  huixianArr.value = obj
}
const selectRef = ref()
const intelDistribute = (val) => {
  for (const item of val) {
    item.freightAmount = 0
    item.freightAmountFlag = false
    for (const aitem of item.skus) {
      aitem.editFlag = false
      aitem.rangePrice = JSON.parse(aitem.rangePrice)
      changePrice(aitem)
    }
    // createHuiXian
  }
  hasSelect.value = val
  setTimeout(() => {
    selectRef.value.setDataList()
  }, 300)
}
watch(
  () => hasSelect.value,
  () => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      countData()
      createHuiXian()
    }, 200)
  },
  {
    deep: true
  }
)
const categoryList = ref()
const updateHasSelect = (type, spuData, skuDataArr) => {
  if (type == 'add') {
    if (huixianArr.value[spuData.spuId]) {
      let skuId = skuDataArr[0].skuId
      for (const item of huixianArr.value[spuData.spuId]) {
        if (item == skuId) {
          return
        }
      }
    }
    let flag = true
    for (const item of hasSelect.value) {
      if (item.spuId == spuData.spuId) {
        let tempSkuDataArr = cloneDeep(skuDataArr)
        tempSkuDataArr.forEach((aitem) => {
          aitem.rangePrice = JSON.parse(aitem.rangePrice)
          aitem.num = 1
          aitem.price = aitem.rangePrice[0].price
          aitem.editFlag = false
          item.skus.push(aitem)
        })
        flag = false
      }
    }
    if (flag) {
      let tempSpuData = cloneDeep(spuData)
      let tempSkuDataArr = cloneDeep(skuDataArr)
      tempSkuDataArr.forEach((aitem) => {
        aitem.rangePrice = JSON.parse(aitem.rangePrice)
        aitem.num = 1
        aitem.price = aitem.rangePrice[0].price
        aitem.editFlag = false
      })
      tempSpuData.freightAmount = 0
      tempSpuData.freightAmountFlag = false
      tempSpuData.skus = []
      tempSpuData.skus = tempSkuDataArr
      hasSelect.value.push(tempSpuData)
    }
    hasSelect.value = cloneDeep(hasSelect.value)
  } else if (type == 'delete') {
    let tempArr: any = []
    for (const item of hasSelect.value) {
      if (item.spuId == spuData.spuId) {
        item.skus = item.skus.filter((aitem) => {
          for (const bitem of skuDataArr) {
            if (bitem.skuId == aitem.skuId) {
              return false
            }
          }
          return true
        })
        if (item.skus.length == 0) {
          continue
        }
      }

      tempArr.push(cloneDeep(item))
    }
    hasSelect.value = cloneDeep(tempArr)
  }
}
const submitOrder = async () => {
  let param: any = {
    discountAmount: allCouponAmount.value,
    remark: remark.value,
    spus: []
  }
  for (const item of hasSelect.value) {
    let obj: any = {
      spuId: item.spuId,
      storeNo: item.storeNo,
      freightAmount: !item.freightAmount ? 0 : item.freightAmount,
      skus: []
    }
    for (const aitem of item.skus) {
      let aObj = {
        num: !aitem.num ? 1 : aitem.num,
        specCode: aitem.specCode
      }
      obj.skus.push(aObj)
    }
    param.spus.push(obj)
  }
  const res = await generateDistributeAPi(param)
  if (res) {
    directCode.value = res.data
    dialogVisible.value = true
  }
}
const copy = () => {
  const el = document.createElement('input')
  // 给input元素赋值需要复制的文本
  el.setAttribute('value', directCode.value)
  // 将input元素插入页面
  document.body.appendChild(el)
  // 选中input元素的文本
  el.select()
  // 复制内容到剪贴板
  document.execCommand('copy')
  // 删除input元素
  document.body.removeChild(el)
  ElMessage.success(t('common.a37'))
  push('/orderManagement/orderList')
}
const addressMenuTree = (obj, len) => {
  if (len == 3) {
    return
  }
  if (obj.children && obj.children.length > 0) {
    for (const a of obj.children) {
      addressMenuTree(a, len + 1)
    }
  } else {
    obj.disabled = true
  }
}
const init = async () => {
  const res = await getDirectOrderTopApi()
  if (res) {
    for (const a of res.data.categoryList) {
      addressMenuTree(a, 1)
    }
    categoryList.value = res.data.categoryList
  }
}
const changeCoupon = () => {
  couponFlag.value = false
  if (!allCouponAmount.value) {
    allCouponAmount.value = 0
  }
}
</script>
<style lang="less" scoped>
.customW {
  width: calc(50% - 10px);
}
.customWT {
  width: calc(100% - 40px);
}
:deep(.rangePrice) {
  .real-item:last-child {
    .line {
      display: none;
      margin-left: 0px !important;
      margin-right: 0px !important;
    }
  }
}
</style>
