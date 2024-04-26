<template>
  <AftersalesHeader @open-dialog="openDialog" :af-sales-type="afSalesType" :all-data="allData" />
  <ContentWrap class="mt-20px" v-if="allData.receiveInfo">
    <div class="flex w-100% font-size-15px">
      <div class="w-32%">
        <div class="font-size-20px color-colorBlack">{{ t('aftersalesList.orderInfo') }}</div>
        <div class="flex flex-col w-100% mt-20px">
          <div class="color-colorGray">
            {{ t('aftersalesList.orderNo') }}：<span class="color-colorBlack">{{
              allData.batchOrderNo || '-'
            }}</span>
          </div>
          <div class="color-colorGray mt-10px">
            {{ t('aftersalesList.type1') }}：<span class="color-colorBlack">{{
              allData.ordTypeStr || '-'
            }}</span>
          </div>
          <div class="color-colorGray mt-10px">
            {{ t('aftersalesList.time1') }}：<span class="color-colorBlack">{{
              allData.createTime || '-'
            }}</span>
          </div>
          <div class="color-colorGray mt-10px">
            {{ t('aftersalesList.time3') }}：<span class="color-colorBlack">{{
              allData.payTime || '-'
            }}</span>
          </div>
        </div>
      </div>
      <div class="w-32%">
        <div class="font-size-20px color-colorBlack">{{ t('aftersalesList.maiInfo') }}</div>
        <div class="flex flex-col w-100% mt-20px">
          <div class="color-colorGray">
            {{ t('aftersalesList.name') }}：<span class="color-colorBlack">{{
              allData.receiveInfo.receiveName || '-'
            }}</span>
          </div>
          <div class="color-colorGray mt-10px">
            {{ t('aftersalesList.mobile') }}：<span class="color-colorBlack">{{
              allData.receiveInfo.mobile || '-'
            }}</span>
          </div>
          <div class="color-colorGray mt-10px flex">
            <div class="!min-w-70px"> {{ t('aftersalesList.address') }}：</div
            ><div class="color-colorBlack text-wrap max-w-250px">{{
              allData.totalAddress || '-'
            }}</div>
          </div>
        </div>
      </div>
      <div class="w-32%">
        <div class="font-size-20px color-colorBlack">{{ t('aftersalesList.afterInfo') }}</div>
        <div class="flex flex-col w-100% mt-20px text-left">
          <div class="color-colorGray flex">
            <div class="min-w-70px">{{ t('aftersalesList.afterNo') }}：</div
            ><span class="color-colorBlack">{{ allData.afterSalesNo || '-' }}</span>
          </div>
          <div class="color-colorGray mt-10px flex">
            <div class="min-w-70px">{{ t('aftersalesList.type') }}：</div
            ><span class="color-colorBlack">{{ allData.afSalesTypeStr || '-' }}</span>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="allData.afSalesType == 'EXCHANGE_AND_REFUND' && allData.logisticsInfoVO"
      class="bg-#F9F9F9 pl-30px pr-30px pt-10px mt-25px"
      :class="foldFlag ? 'h-150px box-border overflow-hidden' : ''"
    >
      <div>
        <div
          v-if="allData.logisticsInfoVO.items.length > 0"
          class="flex-c justify-end font-size-14px color-colorMain"
        >
          <span @click="foldFlag = !foldFlag"
            >{{ foldFlag ? t('aftersalesList.records2') : t('aftersalesList.records1')
            }}{{ t('orderList.sub10') }}</span
          >
          <Icon icon="ep:arrow-down" class="ml-6px" color="#0068E3" :size="12" />
        </div>
        <StepLine
          v-if="allData.logisticsInfoVO.items.length != 0"
          class="mt--10px"
          stepType="afSales"
          :stepList="allData.logisticsInfoVO.items"
        />
        <Empty v-else />
      </div>
    </div>
    <div class="mt-30px">
      <Table :columns="tableSchema" :data="dataList" />
    </div>
  </ContentWrap>
  <ContentWrap class="mt-20px">
    <div class="font-size-20px color-colorBlack">{{ t('aftersalesList.records') }}</div>
    <NegotiationRecord :all-data="allData" />
  </ContentWrap>
  <Dialog
    v-if="dialogConfig.visible"
    :max-height="dialogConfig.height"
    v-model="dialogConfig.visible"
    :title="dialogConfig.title"
    class="!w-800px"
  >
    <Write
      ref="writeRef"
      :refuseReasonEnum="refuseReasonEnum"
      :all-data="allData"
      :open-type="dialogConfig.type"
    />
    <template #footer>
      <ElButton @click="dialogConfig.visible = false">{{ t('project.cancel') }}</ElButton>
      <ElButton type="primary" @click="submit">
        {{ t('project.confirm') }}
      </ElButton>
    </template>
  </Dialog>
</template>
<script lang="tsx" setup>
import { ContentWrap } from '@/components/ContentWrap/index.ts'
import { useI18n } from '@/hooks/web/useI18n'
import { Table, TableColumn } from '@/components/Table'
import { ref } from 'vue'
import { ElButton, ElMessage, ElTag } from 'element-plus'
import StepLine from '@/components/customComponents/StepLine/index.vue'
import { Icon } from '@/components/Icon'
import NegotiationRecord from './component/NegotiationRecord.vue'
import { Dialog } from '@/components/Dialog'
import Write from './component/Write.vue'
import AftersalesHeader from './component/AftersalesHeader.vue'
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'
import Empty from '@/components/customComponents/Empty/index.vue'
import {
  getAfSalesById,
  getAfterSalesTopApi,
  agreeAfSalesRecordApi,
  refuseAfSalesRecordApi,
  refundAfSalesRecordApi
} from '@/api/orderManagement/AfterSales'
const { t } = useI18n()
const foldFlag = ref(true)
const { currentRoute } = useRouter()
const currentId = ref<any>('')
const affixImgUrl = import.meta.env.VITE_IMG_URL
const afSalesType = ref('REFUND_ONLY')
const refuseReasonEnum = ref([])

//头部

//表格
const dataList = ref([])
const tableSchema = ref<TableColumn[]>([
  {
    field: 'merchantInfo',
    label: t('aftersalesList.goodsInfo'),
    width: '450px',
    slots: {
      default: (data) => {
        return (
          <div class="flex w-100%">
            <img
              class="w-50px h-50px border-rd-4px bg-#777D93 "
              src={affixImgUrl + data.row.spuImage}
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
    field: 'status',
    label: t('aftersalesList.status2'),
    slots: {
      default: (data) => {
        return (
          <div>
            {data.$index != 0 ? '' : <ElTag class="ml-2">{allData.value.ordStatusStr}</ElTag>}
          </div>
        )
      }
    }
  },
  {
    field: 'specific',
    label: t('aftersalesList.guige'),
    slots: {
      default: (data) => {
        return (
          <div class="color-colorBlack font-size-14px">
            {data.row.skuDes.map((item, index) => (
              <div key={index}>{item.str}</div>
            ))}
          </div>
        )
      }
    }
  },
  {
    field: 'count',
    label: t('aftersalesList.jian'),
    slots: {
      default: (data) => {
        return (
          <div class="color-colorBlack font-size-14px">
            {data.row.skuDes.map((item, index) => (
              <div key={index}>x{item.num}</div>
            ))}
          </div>
        )
      }
    }
  },
  {
    field: 'aftersalecount',
    label: t('aftersalesList.jian1'),
    slots: {
      default: (data) => {
        return (
          <div class="color-colorBlack font-size-14px">
            {data.row.skuDes.map((item, index) => (
              <div key={index}>x{item.refundNum}</div>
            ))}
          </div>
        )
      }
    }
  },
  {
    field: 'amount',
    label: t('aftersalesList.price1'),
    slots: {
      default: (data) => <div>{'￥' + data.row.amount}</div>
    }
  },
  {
    field: 'refundAmount',
    label: t('aftersalesList.price2'),
    slots: {
      default: (data) => <div>{'￥' + data.row.refundAmount}</div>
    }
  }
])
//dialog
//type 1-1是买家发起退款状态下打开同意 1-2是拒绝
const dialogConfig = ref({
  title: t('aftersalesList.agree1'),
  type: '1-1',
  visible: false,
  height: 150
})
const openDialog = (obj) => {
  switch (obj.type) {
    case '1-1':
      dialogConfig.value = obj
      break
    case '1-2':
      dialogConfig.value = obj
      break
    case '1-3':
      dialogConfig.value = obj
      break
    case '1-4':
      dialogConfig.value = obj
      break
  }
}
//获取数据
const allData = ref<any>({})
const writeRef = ref()
onMounted(() => {
  currentId.value = currentRoute.value.query.id
  init()
})

const submit = async () => {
  if (dialogConfig.value.type == '1-1') {
    const res = await agreeAfSalesRecordApi({ id: currentId.value, addrId: '' })
    if (res.code == 200) {
      ElMessage.success(res.msg)
      dialogConfig.value.visible = false
      setTimeout(() => {
        location.reload()
      }, 750)
    }
  } else if (dialogConfig.value.type == '1-2') {
    const formEl = await writeRef.value.formMethods.getElFormExpose()
    formEl.validate(async (valid) => {
      if (valid) {
        const params = await writeRef.value.formMethods.getFormData()
        params.id = currentId.value
        const res = await refuseAfSalesRecordApi(params)
        if (res.code == 200) {
          ElMessage.success(res.msg)
          dialogConfig.value.visible = false
          setTimeout(() => {
            location.reload()
          }, 750)
        }
      }
    })
  } else if (dialogConfig.value.type == '1-3') {
    const res = await refundAfSalesRecordApi({ id: currentId.value })
    if (res.code == 200) {
      ElMessage.success(res.msg)
      dialogConfig.value.visible = false
      setTimeout(() => {
        location.reload()
      }, 750)
    }
  } else if (dialogConfig.value.type == '1-4') {
    const formEl = await writeRef.value.formMethods.getElFormExpose()
    formEl.validate(async (valid) => {
      if (true) {
        const params = await writeRef.value.formMethods.getFormData()
        params.id = currentId.value
        const res = await agreeAfSalesRecordApi(params)
        if (res.code == 200) {
          ElMessage.success(res.msg)
          dialogConfig.value.visible = false
          setTimeout(() => {
            location.reload()
          }, 750)
        }
      }
    })
  }
}
const init = async () => {
  const ares = await getAfterSalesTopApi()
  const res = await getAfSalesById({ id: currentId.value })
  res.data.receiveInfo = JSON.parse(res.data.receiveInfo)
  res.data.totalAddress =
    res.data.receiveInfo.province +
    res.data.receiveInfo.city +
    res.data.receiveInfo.area +
    res.data.receiveInfo.address
  res.data.afSalesConsultRecordVOS.forEach((item) => {
    item.content = item.content.replaceAll("src='", "src='" + affixImgUrl)
  })
  if (res.data.afSalesType == 'EXCHANGE_AND_REFUND' && res.data.logisticsInfoVO) {
    res.data.logisticsInfoVO.items.forEach((item) => {
      item.title = item.status
      item.time = item.logisticsTime
      item.content = item.context
      item.itemClass = 'bg-#797979'
    })
  }

  allData.value = res.data
  if (!allData.value.logisticsInfoVO || allData.value.logisticsInfoVO.items.length == 0) {
    foldFlag.value = false
  }
  chuli(allData.value)
  dataList.value = allData.value.goodsEntities
  afSalesType.value = allData.value.afSalesType
  refuseReasonEnum.value = ares.data.refuseReasonEnum
}
const chuli = (val) => {
  if (val.afSalesGoodsList.length == 0) return
  let tempObj: any = {}
  val.afSalesGoodsList.forEach((item) => {
    if (!tempObj[item.spuId]) {
      tempObj[item.spuId] = {
        spuName: item.spuName,
        spuId: item.spuId,
        spuImage: item.spuImage,
        skuDes: [],
        amount: 0,
        refundAmount: 0
      }
    }
    tempObj[item.spuId].skuDes.push({
      str:
        t('productList.specifications') +
        (tempObj[item.spuId].skuDes.length + 1) +
        '：' +
        item.skuIndexesVal,
      num: item.num,
      refundNum: item.refundNum
    })
    tempObj[item.spuId].amount += item.amount
    tempObj[item.spuId].refundAmount += item.refundAmount
  })
  let listArr: any = []
  Object.keys(tempObj).forEach((key: any) => {
    listArr.push(tempObj[key])
  })
  val.goodsEntities = listArr
}
</script>
<style lang="less" scoped>
.el-card {
  border: none;
}
</style>
