<template>
  <div class="flex-b">
    <div class="w-50% mr-20px">
      <ContentWrap class="h-275px">
        {{ t('advanceSettlement.info') }}
        <div class="flex-c color-#7A7A7A font-size-14px mt-10px">
          <div class="mr-20px flex">
            <div>{{ t('accountAuthentication.danwei') }}：</div>
            <div class="ml-10px color-colorBlack">{{ accountInfo.company }}</div>
          </div>
        </div>
        <div class="flex-c color-#7A7A7A font-size-14px mt-10px">
          <div class="mr-20px flex">
            <div>{{ t('accountPage.sub1') }}：</div>
            <div class="ml-channel color-colorBlack">{{ accountInfo.account }}</div>
          </div>
        </div>
        <div class="flex-c color-#7A7A7A font-size-14px mt-10px">
          <div class="mr-20px flex">
            <div>{{ t('channel.currency') }}：</div>
            <div class="ml-10px color-colorBlack">{{ accountInfo.currencyStr }}</div>
          </div>
        </div>
        <div class="flex-c color-#7A7A7A font-size-14px mt-10px">
          <div class="mr-20px flex">
            <div>{{ t('advanceSettlement.sub5') }}：</div>
            <div class="ml-10px color-colorBlack">{{ accountInfo.serviceCharge }}%</div>
          </div>
        </div>
      </ContentWrap>
    </div>
    <div class="w-50%">
      <ContentWrap>
        {{ t('withdrawalAudit.sub13') }}
        <div class="flex-col mt-15px color-#7A7A7A font-size-14px">
          <div class="mr-20px flex">
            <div>{{ t('withdrawalAudit.sub14') }}:</div>
            <div class="ml-10px color-colorBlack">{{ accountInfo.balance }}</div>
          </div>
          <div class="mt-15px flex-c">
            <div>{{ t('withdrawalAudit.sub3') }}:</div>
            <div class="ml-10px color-colorBlack">
              <el-input type="number" v-model="settleAmount" />
            </div>
          </div>
          <div class="mt-15px flex">
            <div>{{ t('accountPage.sub8') }}:</div>
            <div class="ml-10px color-colorBlack">{{
              predictInfo.predictSettleAmount || '--'
            }}</div>
          </div>
          <div class="mt-15px flex">
            <div>{{ t('accountPage.sub9') }}:</div>
            <div class="ml-10px color-colorBlack">{{ predictInfo.exchangeRate || '--' }}</div>
          </div>
          <div class="mt-15px flex">
            <div>{{ t('service.money') }}:</div>
            <div class="ml-10px color-colorBlack">{{ predictInfo.serviceFee || '--' }}</div>
          </div>
          <div class="flex-c bottom-20px right-20px flex-justify-end">
            <ElButton type="primary" class="w-100px" @click="save('check')">
              {{ t('accountPage.result7') }}
            </ElButton>
          </div>
        </div>
      </ContentWrap>
    </div>
  </div>
  <div>
    <ContentWrap class="mt-20px relative h-598px">
      {{ t('advanceSettlement.title3') }}
      <div class="flex-col mt-15px color-#7A7A7A font-size-14px">
        <div class="mr-20px flex">
          <div>{{ t('accountPage.sub7') }}:</div>
          <div class="ml-10px color-colorBlack">{{ predictInfo.settleAmount || '--' }}</div>
        </div>
        <div class="mt-15px flex">
          <div>{{ t('advanceSettlement.block5') }}:</div>
          <div class="ml-10px color-colorBlack">{{ predictInfo.predictSettleAmount || '--' }}</div>
        </div>
        <div class="mt-15px flex">
          <div>{{ t('accountPage.sub9') }}:</div>
          <div class="ml-10px color-colorBlack">{{ predictInfo.exchangeRate || '--' }}</div>
        </div>
        <div class="mt-15px flex">
          <div>{{ t('advanceSettlement.block6') }}:</div>
          <div class="ml-10px color-colorBlack">{{ predictInfo.serviceFee || '--' }}</div>
        </div>
      </div>
      <div class="flex-col color-#7A7A7A font-size-14px mt-40px">
        {{ t('advanceSettlement.block8') }}
        <div>
          <el-radio-group v-model="radio" @change="changeRadio">
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
import { useRouter } from 'vue-router'
import {
  getAccountInfoApi,
  confirmAccountInfoApi,
  getFiPageTop,
  getVerifyCodeApi,
  settleApi
} from '@/api/managementProfile/index'
const { push, replace } = useRouter()

const { t } = useI18n()

let realSettleAmount = ''
const settleAmount = ref('')
const codeTypeEnum = ref<any>([])
onMounted(() => {
  init()
})
const verificaeCodeLoading = ref(false)
const schema = reactive<FormSchema[]>([
  {
    field: 'field1',
    label: t('auth.email'),
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
    scene: 'settle'
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
  const res = await getFiPageTop()
  if (res) {
    codeTypeEnum.value = res.data.codeType
  }
  const ares = await getAccountInfoApi({ scene: 'settle' })
  if (ares && ares.code == 200) {
    accountInfo.value = ares.data
    await formMethods.setValues({
      field1: ares.data.email
    })
  } else {
    replace('/financialCenter/managementProfile')
  }
  // const res = await getPageTopApi()
  // if (res.code == 200) {
  //   console.log(res)
  // }
  // getList()
}

const predictInfo = ref<any>({})
const save = async (type) => {
  if (type == 'check') {
    if (!settleAmount.value) {
      ElMessage.warning(t('common.a15'))
      return
    }

    const res = await confirmAccountInfoApi({
      settleAmount: settleAmount.value
    })
    if (res) {
      predictInfo.value = res.data
      realSettleAmount = settleAmount.value
    } else {
      predictInfo.value = {}
      realSettleAmount = ''
    }
  } else if (type == 'tijiao') {
    if (Object.keys(predictInfo.value).length == 0) {
      ElMessage.warning(t('common.a10'))
      return
    }
    const params = await getFormData()
    if (!params.verifyCode) {
      ElMessage.warning(t('common.a14'))
      return
    }
    const res = await settleApi({
      code: params.verifyCode,
      codeType: radio.value,
      settlementAmount: realSettleAmount
    })
    if (res) {
      ElMessage.success(res.msg)
      let str: string = '?'
      Object.keys(res.data).forEach((key) => {
        str += key + '=' + res.data[key] + '&'
      })
      replace('/financialCenter/managementProfile/submitSuccessfully' + str)
    }
  }
}

const changeRadio = async () => {
  if (radio.value == 'EMAIL') {
    await formMethods.setValues({
      field1: accountInfo.value.email
    })
  } else if (radio.value == 'MOBILE') {
    await formMethods.setValues({
      field1: accountInfo.value.mobile
    })
  }
}
</script>

<style lang="less" scoped>
.subString {
  color: #747474;
  font-size: 14px;
}
</style>
