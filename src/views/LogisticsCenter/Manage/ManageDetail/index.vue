<template>
  <div v-if="goodsInfo">
    <ContentWrap class="font-size-20px color-colorBlack">{{ goodsInfo.statusStr }}</ContentWrap>
    <ContentWrap class="mt-20px">
      <div class="flex justify-between w-100% font-size-14px">
        <div class="w-25%">
          <div class="font-size-20px color-colorBlack">{{ t('orderList.info1') }}</div>
          <div class="flex flex-col w-100% mt-20px">
            <div class="color-colorGray">
              {{ t('orderList.id') }}：<span class="color-colorBlack">{{
                goodsInfo.storeBatchNo || '-'
              }}</span>
            </div>
            <div class="color-colorGray mt-10px">
              {{ t('orderList.type1') }}：<span class="color-colorBlack">{{
                goodsInfo.orderTypeStr || '-'
              }}</span>
            </div>
            <div class="color-colorGray mt-10px">
              {{ t('orderList.time1') }}：<span class="color-colorBlack">{{
                goodsInfo.createtime || '-'
              }}</span>
            </div>
            <div class="color-colorGray mt-10px">
              {{ t('orderList.time2') }}：<span class="color-colorBlack">{{
                goodsInfo.payTime || '-'
              }}</span>
            </div>
          </div>
        </div>
        <div class="w-25%">
          <div class="font-size-20px color-colorBlack"> {{ t('orderList.buyerInfo') }}</div>
          <div class="flex flex-col w-100% mt-20px">
            <div class="color-colorGray">
              {{ t('orderList.buyerName') }}：<span class="color-colorBlack">{{
                goodsInfo.receiveInfo.receiveName
              }}</span>
            </div>
            <div class="color-colorGray mt-10px">
              {{ t('orderList.buyerIphone') }}：<span class="color-colorBlack">{{
                goodsInfo.receiveInfo.mobile
              }}</span>
            </div>
            <div class="color-colorGray mt-10px flex">
              <div class="!min-w-70px"> {{ t('orderList.buyerAddress') }}：</div
              ><div class="color-colorBlack text-wrap max-w-250px">{{
                goodsInfo.totalAddress || '-'
              }}</div>
            </div>
          </div>
        </div>
        <div class="w-25%" v-if="goodsInfo.logisticsInfo">
          <div class="font-size-20px color-colorBlack">{{ t('orderList.logisticsInfo') }}</div>
          <div class="flex flex-col w-100% mt-20px text-left">
            <div class="color-colorGray flex">
              <div class="min-w-100px">{{ t('orderList.logisticsCanpany') }}：</div
              ><span class="color-colorBlack">{{
                goodsInfo.logisticsInfo.logisticsCodeStr || '-'
              }}</span>
            </div>
            <div class="color-colorGray mt-10px flex">
              <div class="min-w-100px">{{ t('orderList.logisticsid') }}：</div
              ><span class="color-colorBlack">{{
                goodsInfo.logisticsInfo.logisticsNo || '-'
              }}</span>
            </div>
            <div class="color-colorGray mt-10px flex">
              <div class="min-w-100px">{{ t('orderList.sendOutGoods2') }}：</div
              ><span class="color-colorBlack">{{
                goodsInfo.logisticsInfo.deliveryDate || '-'
              }}</span>
            </div>
            <div class="color-colorGray mt-10px flex">
              <div class="min-w-100px">{{ t('orderList.sendOutGoods3') }}：</div
              ><span class="color-colorBlack">{{
                goodsInfo.logisticsInfo.deliveryTypeStr || '-'
              }}</span>
            </div>
            <div class="color-colorGray mt-10px flex">
              <div class="min-w-100px">{{ t('orderList.sendOutGoods4') }}：</div
              ><span class="color-colorBlack">{{ goodsInfo.logisticsInfo.carrier || '-' }}</span>
            </div>
          </div>
        </div>
        <div class="w-25%">
          <div class="font-size-20px color-colorBlack">{{ t('common.remark') }}</div>
          <div class="flex flex-col w-100% mt-20px">
            <div class="color-colorGray max-w-250px">
              {{ goodsInfo.remark || '-' }}
            </div>
          </div>
        </div>
      </div>
      <div
        class="bg-#F9F9F9 pl-30px pr-30px mt-10px pt-10px"
        :class="foldFlag ? 'h-150px box-border overflow-hidden' : ''"
      >
        <div class="flex-c justify-end font-size-14px color-colorMain">
          <span @click="foldFlag = !foldFlag"
            >{{ foldFlag ? t('common.expand') : t('common.shrink')
            }}{{ t('orderList.sub10') }}</span
          >
          <Icon icon="ep:arrow-down" class="ml-6px" color="#0068E3" :size="12" />
        </div>
        <StepLine
          v-if="goodsInfo.logisticsInfo"
          class="mt--10px"
          stepType="product"
          :stepList="goodsInfo.logisticsInfo.items"
        />
        <Empty v-else />
      </div>
    </ContentWrap>
    <ContentWrap class="mt-20px">
      <div class="font-size-20px color-colorBlack">{{ t('orderList.info2') }}</div>
      <div class="mt-20px">
        <Table :columns="tableSchema" :data="dataList" :border="false" />
        <div class="flex justify-end">
          <div class="w-316px pt-20px font-size-14px color-colorGray">
            <div class="w-100% flex-cb">
              <span>{{ t('orderList.bottom1') }}:</span>
              <span class="color-colorBlack">￥{{ goodsInfo.amount }}</span>
            </div>
            <div class="w-100% flex-cb mt-10px">
              <span>{{ t('orderList.bottom2') }}:</span>
              <span class="color-colorBlack">￥{{ goodsInfo.freightAmount }}</span>
            </div>
            <div class="w-100% flex-cb mt-10px">
              <span>{{ t('orderList.bottom3') }}:</span>
              <span class="color-colorBlack">-￥{{ goodsInfo.couponAmount }}</span>
            </div>
            <div class="color-colorBlack h-30px mt-15px">
              <span>{{ t('orderList.bottom4') }}：</span>
              <span class="font-size-20px">￥{{ goodsInfo.realAmount }}</span>
            </div>
          </div>
        </div>
        <div class="h-88px flex-c w-100% justify-end">
          <div class="flex">
            <el-button @click="dialogVisible = true">{{ t('orderList.more3') }}</el-button>
            <el-button
              @click="cancelOrder"
              v-if="goodsInfo.status == 'WAIT_SEND_GOODS' || goodsInfo.status == 'WAITING_PAYMENT'"
              >{{ t('orderList.more4') }}</el-button
            >
            <el-button @click="push('/logisticsCenter/manage')">{{ t('common.back') }}</el-button>
          </div>
        </div>
      </div>
    </ContentWrap>
  </div>

  <Dialog :title="t('orderList.more3')" v-model="dialogVisible" maxHeight="150px">
    <div class="font-size-14px color-colorGray text-right ml-20px">
      <div class="flex-c">
        <div class="w-60px">{{ t('orderList.name') }}</div>
        <div class="color-colorBlack ml-20px">{{ goodsInfo.receiveInfo.receiveName }}</div>
      </div>
      <div class="flex-c mt-20px">
        <div class="w-60px">{{ t('orderList.iphone') }}</div>
        <div class="color-colorBlack ml-20px">{{ goodsInfo.receiveInfo.mobile }}</div>
      </div>
      <div class="flex-c mt-20px">
        <div class="w-60px">{{ t('orderList.address') }}</div>
        <!-- <div class="color-colorBlack ml-20px">{{
        receiveInfo.province + receiveInfo.city + receiveInfo.area + receiveInfo.address
      }}</div> -->
        <div class="color-colorBlack ml-20px">{{ goodsInfo.totalAddress }}</div>
      </div>
    </div>
  </Dialog>
</template>
<script lang="tsx" setup>
import { ContentWrap } from '@/components/ContentWrap/index.ts'
import { useI18n } from '@/hooks/web/useI18n'
import { Table, TableColumn } from '@/components/Table'
import { ref, onMounted } from 'vue'
import { ElButton, ElMessageBox, ElMessage } from 'element-plus'
import StepLine from '@/components/customComponents/StepLine/index.vue'
import { Icon } from '@/components/Icon'
// import { getOrderByIdApi } from '@/api/orderManagement/OrderList.ts'
import { getPageListByIdApi } from '@/api/LogisticsCenter/manage'
import { useRouter } from 'vue-router'
import Empty from '@/components/customComponents/Empty/index.vue'
import { Dialog } from '@/components/Dialog'
import { cancelOrderApi } from '@/api/orderManagement/OrderList.ts'
const { t } = useI18n()
const { currentRoute, push } = useRouter()
const dialogVisible = ref(false)
const affixImgUrl = ref(import.meta.env.VITE_IMG_URL)
const foldFlag = ref(true)
const dataList = ref([
  {
    merchantInfo: '',
    specific: '',
    count: 1,
    price: '￥39.90'
  }
])
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

const orderId = ref(currentRoute.value.query.id)
const goodsInfo = ref<any>()
onMounted(async () => {
  const res = await getPageListByIdApi(orderId.value)
  res.data.receiveInfo = JSON.parse(res.data.receiveInfo)
  res.data.totalAddress =
    res.data.receiveInfo.province +
    res.data.receiveInfo.city +
    res.data.receiveInfo.area +
    res.data.receiveInfo.address
  goodsInfo.value = res.data

  if (res.data.logisticsInfo) {
    res.data.logisticsInfo.items.forEach((item) => {
      item.title = item.status
      item.time = item.logisticsTime
      item.content = item.context
      item.itemClass = 'bg-#797979'
    })
  }
  dataList.value = res.data.list
})
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
      const res = await cancelOrderApi(orderId.value)
      if (res) {
        ElMessage.success(res.msg)
        push('/orderManagement/orderList')
      }
    })
    .catch(() => {})
}
</script>
<style lang="less" scoped>
.el-card {
  border: none;
}
</style>
