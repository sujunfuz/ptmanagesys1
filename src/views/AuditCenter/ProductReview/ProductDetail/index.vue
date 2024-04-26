<template>
  <ContentWrap>
    <div class="font-size-20px color-colorBlack"
      >{{ t('productList.info') }}{{ recodeData?.auditStatusStr || t('productList.block2') }}</div
    >
    <div
      class="mt-20px"
      v-if="recodeData?.auditStatus == 'UNDER_AUDIT' || !recodeData?.auditStatus"
    >
      <el-button v-hasPermi="'goods:ecSpuAudit:audit'" type="primary" @click="passAudit">{{
        t('AuditCenter.AuditList.sub2')
      }}</el-button>
      <el-button
        v-hasPermi="'goods:ecSpuAudit:audit'"
        type="primary"
        @click="showVisible = true"
        plain
        >{{ t('AuditCenter.AuditList.sub3') }}</el-button
      >
    </div>
  </ContentWrap>
  <div class="flex-b items-stretch mt-20px">
    <!-- 左边  -->
    <div class="customLW">
      <BasicInfo :allData="recodeData" />
      <GoodsAttributes class="mt-20px" :allData="recodeData" />
      <SpecificationsInfo class="mt-20px" :allData="recodeData" />
      <!-- <GoodsPrice class="mt-20px" :allData="recodeData" /> -->
      <Index ref="tableListRef" />
      <GoodesDetail class="mt-20px" :allData="recodeData" />
      <PackageTrans class="mt-20px" :allData="recodeData" />
    </div>
    <!-- 右边 -->
    <div class="customRW bg-white">
      <AuditRecords :recodeData="allData" />
    </div>
  </div>
  <Dialog
    v-model="showVisible"
    :maxHeight="140"
    :title="t('AuditCenter.AuditList.sub3')"
    width="35%"
  >
    <Form @register="formRegister" :schema="allSchema" :isCol="false" />
    <template #footer>
      <el-button @click="showVisible = false">{{ t('common.cancel') }}</el-button>
      <ElButton type="primary" @click="validForm">{{ t('project.save') }}</ElButton>
    </template>
  </Dialog>
</template>
<script setup lang="tsx">
import { ContentWrap } from '@/components/ContentWrap/index.ts'
import { ElButton, ElMessageBox, ElMessage } from 'element-plus'
import { useValidator } from '@/hooks/web/useValidator'
import { ref, reactive, onMounted } from 'vue'
import { useForm } from '@/hooks/web/useForm'
import { FormSchema, Form } from '@/components/Form'
import { Dialog } from '@/components/Dialog'
import { useRouter } from 'vue-router'
import AuditRecords from './components/AuditRecords.vue'
import BasicInfo from './components/BasicInfo.vue'
import GoodsAttributes from './components/GoodsAttributes.vue'
import SpecificationsInfo from './components/SpecificationsInfo.vue'
import GoodsPrice from './components/GoodsPrice.vue'
import Index from './components/Index.vue'
import GoodesDetail from './components/GoodsDetail.vue'
import { useI18n } from '@/hooks/web/useI18n'
import PackageTrans from './components/PackageTrans.vue'
import {
  getAuditRecordBySpuIdApi,
  getPageListByIdApi,
  editApi,
  getPageTopApi
} from '@/api/auditCenter/productReview'

const { t } = useI18n()
const { back, push, currentRoute } = useRouter()
const showVisible = ref(false)
const { required } = useValidator()
const { formRegister, formMethods } = useForm()
const id = ref()

const tableListRef = ref<ComponentRef<typeof Index>>()

const goodsAuditRecordTypeEnum = ref()
onMounted(async () => {
  id.value = currentRoute.value.query.id
  await getData()
})

const allData = ref()
const recodeData = ref()

const getData = async () => {
  const res = await getPageTopApi()
  if (res.code == 200) {
    goodsAuditRecordTypeEnum.value = res.data.goodsAuditRecordTypeEnum
  }
  const res1 = await getAuditRecordBySpuIdApi(id.value)
  if (res1.code == 200) {
    allData.value = res1.data
    if (allData.value.length != 0) {
      for (let i in allData.value) {
        for (let j in goodsAuditRecordTypeEnum.value) {
          if (allData.value[i].auditStatus == goodsAuditRecordTypeEnum.value[j].value) {
            allData.value[i].title = goodsAuditRecordTypeEnum.value[j].label
          }
        }
        allData.value[i].time = allData.value[i].createTimeStr || ''
        if (
          allData.value[i].auditStatus == 'APPLY' ||
          allData.value[i].auditStatus == 'MANUAL_SUCCESS'
        ) {
          allData.value[i].content = ''
          allData.value[i].itemClass = 'bg-#797979'
        } else {
          allData.value[i].content =
            t('AuditCenter.productReview.reason') + ':' + allData.value[i].auditResult || ''
          allData.value[i].itemClass = 'bg-#797979'
          switch (allData.value[i].auditStatus) {
            case 'AUTO_SUCCESS':
              allData.value[i].itemClass = 'bg-#00C068'
              break
            case 'AUTO_FAIL':
              allData.value[i].itemClass = 'bg-#F45057'
              break
          }
        }
      }
    }
    // console.log(allData.value, '和副驾驶的环境')
  }

  const res2 = await getPageListByIdApi(id.value)
  if (res2.code == 200) {
    recodeData.value = res2.data

    const data = res2.data
    // 回显规格
    let specialSpecTemp = JSON.parse(data.spuDetail.specialSpec)
    let specialSpecArr = []
    let arrHeaderItemArr = []
    let index = 0
    for (let key in specialSpecTemp) {
      specialSpecArr.push({ specifications: key, option: specialSpecTemp[key] })
      arrHeaderItemArr.push({ label: key, field: 'spec' + (index + 1) })
      index++
    }

    let arrHeaderItemArr2Temp = []
    let Arr2index = 0
    let blockItemTemp = []
    let arrHeaderItemArr2 = JSON.parse(data.skuList[0].rangePrice)
    for (let key1 in arrHeaderItemArr2) {
      arrHeaderItemArr2Temp.push({
        field: 'price' + (Arr2index + 1),
        label: arrHeaderItemArr2[key1].startCount + '-' + arrHeaderItemArr2[key1].endCount
      })
      blockItemTemp.push({
        from: arrHeaderItemArr2[key1].startCount,
        to: arrHeaderItemArr2[key1].endCount,
        price: arrHeaderItemArr2[key1].price
      })
      Arr2index++
    }

    for (let item in data.skuList) {
      let a = JSON.parse(data.skuList[item].ownSpec)
      for (let i in a) {
        for (let j in arrHeaderItemArr) {
          if (arrHeaderItemArr[j].label == i) {
            data.skuList[item][arrHeaderItemArr[j].field] = a[i]
          }
        }
      }

      let b = JSON.parse(data.skuList[item].rangePrice)
      for (let m in b) {
        let n = b[m].startCount + '-' + b[m].endCount
        for (let j in arrHeaderItemArr2Temp) {
          if (arrHeaderItemArr2Temp[j].label == n) {
            data.skuList[item][arrHeaderItemArr2Temp[j].field] = b[m].price
          }
        }
      }

      if (data.skuList[item].specCode == '0_0') {
        data.skuList[0].skuImgAddr = data.skuList[item].skuImgAddr
        console.log(data.skuList[0].skuImgAddr)
        tableListRef.value?.setSkuImgAddr([data.skuList[0].skuImgAddr])
      }
      data.skuList[item].inventory = data.skuList[item].realInventory
      data.skuList[item].price = data.skuList[item].agentPrice
    }

    tableListRef.value?.setPriceBlock({
      cost: data.skuList[0].cost,
      price: data.skuList[0].agentPrice,
      inventory: data.skuList[0].realInventory
    })
    tableListRef.value?.setObjectItem(specialSpecArr)
    tableListRef.value?.setArrHeaderItem(arrHeaderItemArr)
    tableListRef.value?.setBlockItem(blockItemTemp)
    tableListRef.value?.setArrHeaderItem2(arrHeaderItemArr2Temp)
    tableListRef.value?.setChecked(data.skuList[0].agentDeliver == 'YES')

    //回显表格数据
    tableListRef.value?.setTableList(data.skuList)
  }
}
//审核通过按钮
const passAudit = () => {
  ElMessageBox({
    title: t('AuditCenter.AuditList.sub2'),
    message: t('AuditCenter.AuditList.sub4'),
    showCancelButton: true,
    confirmButtonText: t('common.ok'),
    cancelButtonText: t('common.cancel'),
    showClose: false
  })
    .then(async (action) => {
      const res = await editApi({
        id: id.value,
        auditStatus: 'SUCCESS_AUDIT',
        auditType: 'MANUAL'
      })
      if (res.code == 200) {
        ElMessage.success(t('common.operateSuccess'))
        await getData()
      }
    })
    .catch(() => {})
}
//审核未通过按钮

const allSchema = reactive<FormSchema[]>([
  {
    field: 'auditReason',
    label: t('AuditCenter.AuditList.sub5'),
    component: 'Input',
    componentProps: {
      type: 'textarea',
      maxlength: 300,
      showWordLimit: true,
      inputStyle: {
        height: '120px'
      }
    },
    formItemProps: {
      rules: [required(t('common.inputText'))]
    }
  }
])
//验证表单
const validForm = async () => {
  const formExpose = await formMethods.getElFormExpose()
  formExpose?.validate(async (valid) => {
    if (valid) {
      const param = await formMethods.getFormData()
      const res = await editApi({
        id: id.value,
        auditType: 'MANUAL',
        auditStatus: 'FAIL_AUDIT',
        ...param
      })
      if (res.code == 200) {
        ElMessage.success(t('common.operateSuccess'))
        await getData()
        showVisible.value = false
      }
    }
  })
}
</script>
<style scoped lang="less">
.customLW {
  width: calc(63% - 10px);
}
.customRW {
  width: calc(37% - 10px);
}
.el-card {
  border: none;
}
</style>
