<template>
  <div class="flex-b">
    <div class="w-50% mr-20px">
      <ContentWrap class="h-250px">
        {{ t('advanceSettlement.info') }}
        <div class="flex-c color-#7A7A7A font-size-14px mt-10px">
          <div class="mr-20px flex">
            <div>{{ t('accountAuthentication.danwei') }}:</div>
            <div class="ml-10px color-colorBlack">{{ accountInfo.company }}</div>
          </div>
        </div>
        <div class="flex-c color-#7A7A7A font-size-14px mt-10px">
          <div class="mr-20px flex">
            <div>{{ t('advanceSettlement.sub1') }}:</div>
            <div class="ml-10px color-colorBlack">{{ accountInfo.account }}</div>
          </div>
          <div class="mr-20px flex">
            <div>{{ t('advanceSettlement.sub2') }}:</div>
            <div class="ml-10px color-colorBlack">{{ accountInfo.unSettledAmount }}</div>
          </div>
          <div class="mr-20px flex">
            <div>{{ t('advanceSettlement.sub3') }}:</div>
            <div class="ml-10px color-colorBlack">{{ accountInfo.availableCreditAmount }}</div>
          </div>
        </div>
        <div class="flex-c color-#7A7A7A font-size-14px mt-10px">
          <div class="mr-20px flex">
            <div>{{ t('advanceSettlement.sub4') }}:</div>
            <div class="ml-10px color-colorBlack">{{ accountInfo.currencyStr }}</div>
          </div>
        </div>
        <div class="flex-c color-#7A7A7A font-size-14px mt-10px">
          <div class="mr-20px flex">
            <div>{{ t('advanceSettlement.sub5') }}:</div>
            <div class="ml-10px color-colorBlack">{{ accountInfo.serviceCharge }} %</div>
          </div>
        </div>
      </ContentWrap>
    </div>
    <div class="w-50%">
      <ContentWrap>
        <div class="flex-col color-#7A7A7A font-size-14px">
          <div class="mr-20px flex">
            <div class="min-w-90px text-right">{{ t('loanAudit.sub3') }}:</div>
            <div class="ml-10px color-colorBlack">
              <ElInput type="number" v-model="formData.preSettleAmount" class="!w-220px" />
            </div>
          </div>
          <div class="mt-15px flex-c">
            <div class="min-w-90px text-right">{{ t('advanceSettlement.block2') }}:</div>
            <div class="ml-10px color-colorBlack">
              <ElSelect v-model="formData.period" @change="changePeriod">
                <ElOption
                  v-for="(item, index) in creditRuleList"
                  :key="index"
                  :label="item.period + t('timeWords.day')"
                  :value="item.period"
                />
              </ElSelect>
            </div>
          </div>
          <div class="mt-15px flex-c">
            <div class="min-w-90px text-right">{{ t('advanceSettlement.block3') }}:</div>
            <div class="ml-10px color-colorBlack">
              <ElInput
                v-model="formData.interestRate"
                class="!w-220px"
                disabled
                :suffix-icon="percentage"
              />
            </div>
          </div>
          <div class="mt-15px flex-c">
            <div class="min-w-90px text-right">{{ t('advanceSettlement.block4') }}:</div>
            <div class="ml-10px color-colorBlack">
              <el-radio-group v-model="formData.repayType">
                <el-radio
                  v-for="item in settRepayTypeEnum"
                  :key="item.value"
                  :label="item.value"
                  size="large"
                  >{{ item.label }}</el-radio
                >
              </el-radio-group>
            </div>
          </div>
        </div>
        <div class="flex-c flex-justify-end mt-10px">
          <ElButton type="primary" @click="save('check')" class="w-80px">{{
            t('common.ok')
          }}</ElButton></div
        >
      </ContentWrap>
    </div>
  </div>
  <div>
    <ContentWrap class="mt-20px relative h-598px">
      {{ t('loanAudit.sub7') }}
      <div class="flex-col mt-15px color-#7A7A7A font-size-14px">
        <div class="mr-20px flex">
          <div>{{ t('loanAudit.sub3') }}:</div>
          <div class="ml-10px color-colorBlack">{{ predictInfo.settleAmount || '--' }}</div>
        </div>
        <div class="mt-15px flex">
          <div>{{ t('advanceSettlement.block5') }}:</div>
          <div class="ml-10px color-colorBlack">{{ predictInfo.predictSettleAmount || '--' }}</div>
        </div>
        <div class="mt-15px flex">
          <div>{{ t('advanceSettlement.block6') }}:</div>
          <div class="ml-10px color-colorBlack">{{ predictInfo.serviceFee || '--' }}</div>
        </div>
        <div class="mt-15px flex">
          <div>{{ t('loanAudit.sub6') }}:</div>
          <div class="ml-10px color-colorBlack">{{ predictInfo.interest || '--' }}</div>
        </div>
      </div>
      <div class="flex-col color-#7A7A7A font-size-14px mt-40px">
        {{ t('advanceSettlement.block8') }}
        <div>
          <el-radio-group v-model="radio" @change="changeCode">
            <el-radio
              v-for="item in codeTypeEnum"
              :key="item.value"
              :label="item.value"
              size="large"
              >{{ item.label }}</el-radio
            >
          </el-radio-group>
        </div>
        <div class="ml--10px">
          <Form
            :schema="schema"
            class="dark:(border-1 border-[var(--el-border-color)] border-solid)"
            @register="formRegister"
          />
        </div>
        <div class="flex-c absolute bottom-20px right-20px flex-justify-end mt-90px">
          <ElButton @click="replace('/financialCenter/managementProfile')" class="w-80px">{{
            t('project.cancel')
          }}</ElButton>
          <ElButton type="primary" class="w-80px" @click="save('tijiao')">
            {{ t('accountPage.btn') }}
          </ElButton>
        </div>
      </div></ContentWrap
    >
  </div>
</template>

<script setup lang="tsx">
import { ContentWrap } from '@/components/ContentWrap'
import { useI18n } from '@/hooks/web/useI18n'
import { ref, unref, reactive, onMounted, watch } from 'vue'
import {
  ElButton,
  ElRadioGroup,
  ElRadio,
  ElForm,
  ElFormItem,
  ElInput,
  ElSelect,
  ElOption,
  ElMessage
} from 'element-plus'

import { useForm } from '@/hooks/web/useForm'
import { Form, FormSchema } from '@/components/Form'
import {
  getAccountInfoApi,
  getFiPageTop,
  confirmBorrowInfoApi,
  getVerifyCodeApi,
  rightLendApi
} from '@/api/managementProfile/index'
import { useRouter } from 'vue-router'
const { t } = useI18n()
const { replace } = useRouter()
// 静态
const codeTypeEnum = ref<any>([])
const settRepayTypeEnum = ref<any>([])
const creditRuleList = ref<any>([])
const percentage = <div>%</div>
let realFormData: any = {}
const formData = reactive<any>({
  preSettleAmount: '',
  period: '',
  interestRate: '',
  repayType: 'AUTO'
})
onMounted(() => {
  init()
})
const verificaeCodeLoading = ref(false)
const schema = reactive<FormSchema[]>([
  {
    field: 'field1',
    label: t('advanceSettlement.block9'),
    component: 'Input',
    componentProps: {
      placeholder: t('common.inputText'),
      style: {
        height: '35px'
      },
      disabled: true
    }
  },
  {
    field: 'verifyCode',
    label: ' ',
    component: 'InputPassword',
    colProps: {
      span: 24
    },
    formItemProps: {
      slots: {
        default: (args) => {
          return (
            <div class="flex-c justify-between">
              <ElInput v-model={args.verifyCode} class="h-35px w-50px"></ElInput>
              <ElButton
                type="primary"
                disabled={flag.value}
                class="w-120px ml-10px"
                loading={verificaeCodeLoading.value}
                onClick={getVerificationCode}
              >
                {flag.value ? count.value + 's' + t('accountPage.btn2') : t('accountPage.btn1')}
              </ElButton>
            </div>
          )
        }
      }
    }
  }
])

//计算倒计时
let timeStamp: any = 0
let flag = ref(false)
let timer: any = null
const count = ref(60)
watch(
  () => count.value,
  (val) => {
    if (val == 0) {
      clearInterval(timer)
      flag.value = false
    }
  }
)
const { formRegister, formMethods } = useForm()
const { getFormData, getElFormExpose } = formMethods

//发送验证码
const getVerificationCode = async () => {
  if (Object.keys(predictInfo.value).length == 0) {
    ElMessage.warning(t('common.a10'))
    return
  }
  verificaeCodeLoading.value = true
  const res = await getVerifyCodeApi({
    type: radio.value,
    scene: 'preSettle'
  })
  if (res.code == 200) {
    flag.value = true
    count.value = 60
    timer = setInterval(() => {
      count.value = count.value - 1
    }, 1000)
  }
  verificaeCodeLoading.value = false
}

const radio = ref('EMAIL')

const accountInfo = ref<any>({})
const init = async () => {
  const ares = await getFiPageTop()
  if (ares) {
    codeTypeEnum.value = ares.data.codeType
    settRepayTypeEnum.value = ares.data.settRepayType
  }
  const res = await getAccountInfoApi({ scene: 'preSettle' })
  if (res) {
    accountInfo.value = res.data
    creditRuleList.value = accountInfo.value.creditRuleList
    formMethods.setValues({ field1: accountInfo.value.email })
  } else {
    replace('/financialCenter/managementProfile')
  }
  // getList()
}

const changePeriod = async () => {
  for (const item of creditRuleList.value) {
    if (item.period == formData.period) {
      formData.interestRate = item.interestRate * 100
    }
  }
}
const changeCode = async () => {
  if (radio.value == 'EMAIL') {
    await formMethods.setSchema([
      {
        field: 'field1',
        path: 'label',
        value: t('advanceSettlement.block9')
      }
    ])
    await formMethods.setValues({
      field1: accountInfo.value.email
    })
  } else {
    await formMethods.setSchema([
      {
        field: 'field1',
        path: 'label',
        value: t('auth.tel')
      }
    ])
    await formMethods.setValues({
      field1: accountInfo.value.mobile
    })
  }
}

const predictInfo = ref<any>({})
const save = async (type) => {
  if (type == 'check') {
    if (!formData.preSettleAmount) {
      ElMessage.warning(t('common.a11'))
      return
    } else if (!formData.period) {
      ElMessage.warning(t('common.a12'))
      return
    }
    const res = await confirmBorrowInfoApi({
      ...formData
    })
    if (res) {
      predictInfo.value = res.data
      realFormData = { ...formData }
    } else {
      predictInfo.value = {}
      realFormData = {}
    }
  } else if (type == 'tijiao') {
    if (Object.keys(predictInfo.value).length == 0) {
      ElMessage.warning(t('common.a13'))
      return
    }
    const params = await getFormData()
    if (!params.verifyCode) {
      ElMessage.warning(t('common.a14'))
      return
    }
    const res = await rightLendApi({
      code: params.verifyCode,
      codeType: radio.value,
      preSettlementAmount: realFormData.preSettleAmount,
      period: realFormData.period,
      repaymentType: formData.repayType
    })
    if (res) {
      ElMessage.success(res.msg)
      replace('/financialCenter/managementProfile')
    }
  }
}
</script>

<style lang="less" scoped>
.subString {
  color: #747474;
  font-size: 14px;
}
</style>
