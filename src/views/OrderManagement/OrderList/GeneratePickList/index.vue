<template>
  <ContentWrap>
    <div class="font-size-20px color-colorBlack">{{ t('orderList.more1') }}</div>
    <div class="mt-20px">
      <Table
        v-for="item in dataList"
        :key="item.batchOrdNo"
        :columns="tableSchema"
        :data="item.list"
        :border="false"
      />
      <div class="flex justify-end">
        <div class="w-316px pt-20px font-size-14px color-colorGray">
          <div class="w-100% flex-cb">
            <span>{{ t('orderList.bottom1') }}:</span>
            <span class="color-colorBlack">￥{{ allAmount.toFixed(2) }}</span>
          </div>
          <div class="w-100% flex-cb mt-10px">
            <span>{{ t('orderList.bottom2') }}:</span>
            <span class="color-colorBlack">￥{{ allFreightAmount.toFixed(2) }}</span>
          </div>
          <div class="w-100% flex-cb mt-10px">
            <span>{{ t('orderList.bottom3') }}:</span>
            <span class="color-colorBlack">-￥{{ allCouponAmount.toFixed(2) }}</span>
          </div>
          <div class="color-colorBlack h-30px mt-15px">
            <span>{{ t('orderList.bottom4') }}：</span>
            <span class="font-size-20px">￥{{ allRealAmount.toFixed(2) }}</span>
          </div>
        </div>
      </div>
      <div class="h-88px flex-c w-100% justify-end">
        <div class="flex">
          <el-button @click="push('/orderManagement/orderList')">{{
            t('project.cancel')
          }}</el-button>
          <el-button type="primary" :loading="btnLoading" @click="batchExport">{{
            t('orderList.btn1')
          }}</el-button>
        </div>
      </div>
    </div>
  </ContentWrap>
</template>
<script lang="tsx" setup>
import { ContentWrap } from '@/components/ContentWrap/index.ts'
import { useI18n } from '@/hooks/web/useI18n'
import { Table, TableColumn } from '@/components/Table'
import { ref, onMounted, watch } from 'vue'
import { ElButton } from 'element-plus'
import { useRouter } from 'vue-router'
import { getBatchOrderApi, pdfOrderApi } from '@/api/orderManagement/OrderList.ts'

const affixImgUrl = ref(import.meta.env.VITE_IMG_URL)
const { currentRoute, push } = useRouter()
const { t } = useI18n()
// const goodsInfo = ref<any>({})
const dataList = ref<any>([
  // {
  //   merchantInfo: '',
  //   specific: '',
  //   count: 1,
  //   price: '￥39.90'
  // }
])
const btnLoading = ref(false)
const tableSchema = ref<TableColumn[]>([
  {
    field: 'merchantInfo',
    label: t('orderList.info'),
    width: '350px',
    slots: {
      default: (data) => {
        return (
          <div class="flex w-100%">
            <img
              src={affixImgUrl.value + data.row.spuImage}
              class="w-50px min-w-50px h-50px min-h-50px border-rd-4px bg-#777D93 "
            ></img>
            <div class="color-colorBlack font-size-14px w-380px ml-10px mr-10px text-wrap line-clamp-2">
              {data.row.spuName}
            </div>
          </div>
        )
      }
    }
  },
  {
    field: 'specific',
    label: t('orderList.list2'),
    width: 300,
    slots: {
      default: (data) => {
        if (!data.row.skuIndexexVals) {
          return <div>-</div>
        }
        return (
          <div class="color-colorBlack font-size-14px">
            {data.row.skuIndexexVals.map((item, index) => (
              <div class="w-100% text-nowrap overflow-hidden text-ellipsis" key={index}>
                {t('aftersalesList.guige')}
                {index + 1}：{item}
              </div>
            ))}
          </div>
        )
      }
    }
  },
  {
    field: 'count',
    label: t('orderList.list3'),
    slots: {
      default: (data) => {
        if (!data.row.perNum) {
          return <div>-</div>
        }
        return (
          <div class="color-colorBlack font-size-14px">
            {data.row.perNum.map((item, index) => (
              <div key={index}>x{item}</div>
            ))}
          </div>
        )
      }
    }
  },
  {
    field: 'allAmount',
    label: t('orderList.list4')
  }
])

//操作
const orderId = ref(
  currentRoute.value.query.id ? JSON.parse(currentRoute.value.query.id as string) : []
)
onMounted(async () => {
  // const res = await getOrderByIdApi(orderId.value)
  const res = await getBatchOrderApi({
    ordNos: orderId.value.join(',')
  })
  if (res) {
    dataList.value = res.data
  }
  // goodsInfo.value = res.data[0]
  // dataList.value = res.data[0].list
})
const allAmount = ref<any>(0)
const allFreightAmount = ref<any>(0)
const allCouponAmount = ref<any>(0)
const allRealAmount = ref<any>(0)

watch(
  () => dataList.value,
  () => {
    let tempAmount = 0
    let tempFreightAmount = 0
    let tempCouponAmount = 0
    let tempRealAmount = 0
    dataList.value.forEach((item) => {
      if (item.amount) {
        tempAmount += item.amount
      }
      if (item.freightAmount) {
        tempFreightAmount += item.freightAmount
      }
      if (item.couponAmount) {
        tempCouponAmount += item.couponAmount
      }
      if (item.realAmount) {
        tempRealAmount += item.realAmount
      }
    })
    allAmount.value = tempAmount
    allFreightAmount.value = tempFreightAmount
    allCouponAmount.value = tempCouponAmount
    allRealAmount.value = tempRealAmount
  }
)

const batchExport = async () => {
  btnLoading.value = true
  const res = await pdfOrderApi({ ordNos: orderId.value.join(',') })

  if (res) {
    let downloadElement = document.createElement('a')
    let href = window.URL.createObjectURL(res as unknown as Blob) // 创建下载的链接
    downloadElement.href = href
    downloadElement.download = new Date().getTime() + '.pdf' // 下载后文件名
    document.body.appendChild(downloadElement)
    downloadElement.click() // 点击下载
    document.body.removeChild(downloadElement) // 下载完成移除元素
    window.URL.revokeObjectURL(href) // 释放blob对象
    btnLoading.value = false
  }
}
</script>
<style lang="less" scoped>
.el-card {
  border: none;
}
</style>
