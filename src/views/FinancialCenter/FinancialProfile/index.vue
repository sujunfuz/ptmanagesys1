<template>
  <ContentWrap v-hasPermi="'finOverview:platformAmount:view'">
    <div class="flex-c justify-between">
      <div class="w-75% flex-c box-border">
        <div class="min-w-70px">{{ t('financialProfile.title1') }}</div>
        <div class="ml-10%">
          <div
            ><span class="font-bold font-size-18px">{{ allData?.turnover }}</span>
            <span class="font-size-13px ml-10px">￥</span></div
          >
          <div class="font-bold font-size-13px mt-10px">{{ t('managementProfile.sub1_1') }}</div>
        </div>
        <div class="ml-10%">
          <div
            ><span class="font-bold font-size-18px">{{ allData?.settled }}</span>
            <span class="font-size-13px ml-10px">￥</span></div
          >
          <div class="font-bold font-size-13px mt-10px">{{ t('financialProfile.sub1') }}</div>
        </div>
        <div class="ml-10%">
          <div
            ><span class="font-bold font-size-18px">{{ allData?.unSettle }}</span>
            <span class="font-size-13px ml-10px">￥</span></div
          >
          <div class="font-bold font-size-13px mt-10px">{{ t('financialProfile.sub2') }}</div>
        </div>
        <div class="ml-10%">
          <div
            ><span class="font-bold font-size-18px">{{ allData?.outstanding }}</span>
            <span class="font-size-13px ml-10px">￥</span></div
          >
          <div class="font-bold font-size-13px mt-10px">{{ t('financialProfile.sub3') }}</div>
        </div>
        <div class="ml-10%">
          <div
            ><span class="font-bold font-size-18px">{{ allData?.serviceCharge }}</span>
            <span class="font-size-13px ml-10px">￥</span></div
          >
          <div class="font-bold font-size-13px mt-10px">{{ t('financialProfile.sub4') }}</div>
        </div>
      </div>
      <div class="ml-5% min-w-300px">
        <div class="flex-c">
          <span>
            {{ t('financialProfile.sub5') }}
          </span>
          <el-radio-group v-model="calculateExchangeType" class="ml-4">
            <el-radio
              :label="item.value"
              size="large"
              v-for="(item, index) in calculateExchangeTypeEnum"
              :key="index"
              >{{ item.label }}</el-radio
            >
          </el-radio-group>
        </div>
        <div class="flex-c flex color-colorBlack">
          <div class="w-170px h-87px box-border border-(1px solid #E9E9E9) border-rd-4px">
            <div
              class="box-border pt-10px pb-10px pl-20px pr-20px h-40px bg-#F3F6F8 border-b-(1px solid #E9E9E9) font-size-14px"
              >CNY&nbsp;&nbsp;￥-{{ t('pointer.title2') }}</div
            >
            <div class="h-45px pt-10px pb-10px pl-20px pr-20px font-size-20px font-600">1.00</div>
          </div>
          <Icon icon="gg:arrows-exchange-alt" class="ml-30px mr-30px" :size="40" color="#797979" />
          <div class="w-170px h-87px box-border border-(1px solid #E9E9E9) border-rd-4px">
            <el-select
              v-model="biType"
              class="!w-100% !h-40px customSel"
              :placeholder="t('image.sub25')"
            >
              <el-option
                :label="item.label"
                :value="item.value"
                v-for="(item, index) in newCurrencyEnum"
                :key="index"
              />
            </el-select>
            <ElInput type="number" class="h-45px !bg-white customInput" v-model="biValue" />
            <!-- <div class="h-45px pt-10px pb-10px pl-20px pr-20px font-size-20px font-600">1.00</div> -->
          </div>
        </div>
      </div>
    </div>
  </ContentWrap>

  <ContentWrap class="mt-20px" v-hasPermi="'finOverview:creditAnalysis:view'">
    <div class="flex-c justify-between">
      <div class="w-75% flex-c box-border">
        <div class="min-w-70px">{{ t('managementProfile.sub2') }}</div>
        <div class="ml-10%">
          <div
            ><span class="font-bold font-size-18px">{{ allData1?.creditAmount }}</span>
            <span class="font-size-13px ml-10px">￥</span></div
          >
          <div class="font-bold font-size-13px mt-10px">{{ t('financialProfile.sub6') }}</div>
        </div>

        <div class="ml-15%">
          <div
            ><span class="font-bold font-size-18px">{{ allData1?.usedCreditAmount }}</span>
            <span class="font-size-13px ml-10px">￥</span></div
          >
          <div class="font-bold font-size-13px mt-10px">{{ t('managementProfile.sub2_2') }}</div>
        </div>
        <div class="ml-15%">
          <div
            ><span class="font-bold font-size-18px">{{ allData1?.availableCreditAmount }}</span>
            <span class="font-size-13px ml-10px">￥</span></div
          >
          <div class="font-bold font-size-13px mt-10px">{{ t('managementProfile.sub2_3') }}</div>
        </div>
        <div class="ml-15%">
          <div
            ><span class="font-bold font-size-18px">{{ allData1?.creditInterest }}</span>
            <span class="font-size-13px ml-10px">￥</span></div
          >
          <div class="font-bold font-size-13px mt-10px">{{ t('financialProfile.sub7') }}</div>
        </div>
        <div class="ml-15%">
          <div
            ><span class="font-bold font-size-18px">{{ allData1?.unReturnInterest }}</span>
            <span class="font-size-13px ml-10px">￥</span></div
          >
          <div class="font-bold font-size-13px mt-10px w-100px">{{
            t('financialProfile.sub8')
          }}</div>
        </div>
      </div>
      <!-- <div class="flex flex-col">
        <div>
          <ElButton
            type="primary"
            class="w-100px"
            @click="push('/financialCenter/managementProfile/advanceSettlement')"
            >{{ t('managementProfile.txt4') }}</ElButton
          >
        </div>
        <div>
          <ElButton
            type="primary"
            class="w-100px mt-10px"
            plain
            @click="push('/financialCenter/managementProfile/immediateRepayment')"
            >{{ t('managementProfile.btn3') }}</ElButton
          >
        </div>
      </div> -->
    </div>
  </ContentWrap>

  <!-- <ContentWrap class="mt-20px">
    <div>{{ t('managementProfile.sub3') }}</div>
    <ElButton
      type="primary"
      class="w-100px mt-10px"
      plain
      @click="push('/financialCenter/managementProfile/submitSuccessfully')"
      >{{ t('myAccount.title1') }}</ElButton
    >
  </ContentWrap> -->
  <SecondPart v-hasPermi="'finOverview:profitAnalysis:view'" />
  <ThirdPart v-hasPermi="'finOverview:channelComposition:view'" />
</template>

<script setup lang="tsx">
import { ContentWrap } from '@/components/ContentWrap'
import { useI18n } from '@/hooks/web/useI18n'
import { ref, unref, reactive, onMounted } from 'vue'
import {
  ElButton,
  ElRadioGroup,
  ElRadio,
  ElCascader,
  ElInput,
  ElMessage,
  ElSelect,
  ElOption
} from 'element-plus'
import type { DepartmentUserItem } from '@/api/department/types'
import { useTable } from '@/hooks/web/useTable'
import { Search } from '@/components/Search'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { SelectOption, FormSchema } from '@/components/Form'
import { Table } from '@/components/Table'
import { tableStatusStyleTag } from '@/utils/componentUtils'
import { useRouter } from 'vue-router'
import SecondPart from './components/SecondPart.vue'
import ThirdPart from './components/ThirdPart.vue'
import {
  platformAmountApi,
  creditAnalysisApi,
  getPageTopApi,
  getCurrencyRuleListApi
} from '@/api/financialCenter/financialProfile'

const { push, currentRoute } = useRouter()

const calculateExchangeType = ref('REAL_TIME')
const { t } = useI18n()
const biType = ref('')
const biValue = ref(0)

const allData = ref()
const allData1 = ref()

const calculateExchangeTypeEnum = ref()
const newCurrencyEnum = ref<Array<any>>([])
onMounted(async () => {
  const res = await platformAmountApi()
  if (res.code == 200) {
    allData.value = res.data
  }

  const res1 = await creditAnalysisApi()
  if (res1.code == 200) {
    allData1.value = res1.data
  }

  const res3 = await getPageTopApi()
  if (res3.code == 200) {
    calculateExchangeTypeEnum.value = res3.data.calculateExchangeTypeEnum
  }

  const res4 = await getCurrencyRuleListApi()
  if (res4.code == 200) {
    newCurrencyEnum.value = []
    for (var item in res4.data) {
      newCurrencyEnum.value.push({
        label:
          res4.data[item].currencyCode +
          '  ' +
          res4.data[item].currencySymbol +
          '-' +
          res4.data[item].currencyName,
        value: res4.data[item].id
      })
    }
  }
})
</script>

<style lang="less" scoped>
:deep(.select-trigger) {
  height: 40px !important;
}
:deep(.select-trigger) {
  .el-input__wrapper {
    border-radius: 0px !important;
    box-shadow: none !important;
    background-color: #f3f6f8 !important;
    border-bottom: 1px solid #e9e9e9 !important;
    height: 40px !important;
  }
  .el-input__wrapper.is-focus {
    box-shadow: none !important;
  }
}
:deep(.customInput.el-input) {
  .el-input__wrapper {
    border-radius: 0px !important;
    box-shadow: none !important;

    .el-input__inner {
      color: #14181f !important;
      font-size: 20px !important;
      font-weight: 600 !important;
    }
  }
}
</style>
