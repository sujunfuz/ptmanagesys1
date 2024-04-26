<script lang="tsx" setup>
import { ContentWrap } from '@/components/ContentWrap'
import { Form, FormSchema } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { PropType, reactive, watch, ref, onMounted } from 'vue'
import { useValidator } from '@/hooks/web/useValidator'
import { useI18n } from '@/hooks/web/useI18n'
import { ElMessageBox, ElButton, ElMessage, ElTag } from 'element-plus'
import type { Action } from 'element-plus'
import { Dialog } from '@/components/Dialog'
import Steps from './components/Steps.vue'
import {
  getPageTopApi,
  getCheckAuthAmountApi,
  checkMerAccountStatusApi,
  getPaySideInfoApi,
  checkAuthInfoApi
} from '@/api/financialCenter/business'
import { useRouter } from 'vue-router'
const { push, currentRoute } = useRouter()

const { t } = useI18n()

const { required, validNumberSpace } = useValidator()

const currentStep = ref(1)
const stepsDesc = [t('myAccount.step1'), t('myAccount.step2'), t('myAccount.step3')]
const props = defineProps({
  currentRow: {
    type: Object as PropType<any>,
    default: () => null
  }
})

const allData = ref()
onMounted(async () => {
  await getData()
  if (currentRoute.value.query.type && currentRoute.value.query.type == 'expired') {
    currentStep.value = 2
  }
})

const merAccountBankNoData = ref()
const getData = async () => {
  const res = await getPaySideInfoApi()
  if (res.code == 200) {
    allData.value = res.data
    currentStep.value = res.data.payStatus == 'MER_ACCOUNT_PAY_STATUS_ENUM_WAIT_PAY' ? 2 : 1
  }

  const res1 = await checkMerAccountStatusApi()
  if (res1.code == 200 && res1.data) {
    await setValues({
      bankName: res1.data.bankName,
      subbranchName: res1.data.subbranchName,
      bankNo: res1.data.bankNo
    })
  }
  if (res1.data) {
    merAccountBankNoData.value = res1.data.bankNo
    currentStep.value = res1.data.effectiveTime ? 3 : currentStep.value
  }
}
const receptRule = ref({
  bankName: [required()],
  subbranchName: [required()],
  bankNo: [required()]
})
const formSchema = reactive<FormSchema[]>([
  {
    field: 'bankName',
    label: t('myAccount.sub6'),
    component: 'Input',
    colProps: {
      span: 24
    },
    componentProps: {
      style: {
        width: '300px'
      }
    }
  },
  {
    field: 'subbranchName',
    label: t('myAccount.sub7'),
    component: 'Input',
    colProps: {
      span: 24
    },
    componentProps: {
      style: {
        width: '300px'
      }
    }
  },
  // {
  //   field: 'address1',
  //   label: '  ',
  //   colProps: {
  //     span: 24
  //   },
  //   formItemProps: {
  //     slots: {
  //       default: (data) => {
  //         return (
  //           <>
  //             <div class="color-#7A7A7A w-500px">
  //               <span>{t('myAccount.sub')}</span>
  //               <span class="colorMain">{t('myAccount.sub_')}</span>
  //             </div>
  //           </>
  //         )
  //       }
  //     }
  //   }
  // },
  {
    field: 'bankNo',
    label: t('myAccount.sub8'),
    colProps: {
      span: 24
    },
    component: 'Input',
    formItemProps: {
      rules: [validNumberSpace()]
    },
    componentProps: {
      style: {
        width: '300px'
      }
    }
  }
])

const { formRegister, formMethods } = useForm()
const { setValues, getFormData, getElFormExpose } = formMethods

const dialogVisible = ref(false)
const saveLoading = ref(false)
const saveLoading1 = ref(false)

const submit = async () => {
  saveLoading1.value = true
  const elForm = await getElFormExpose()
  const valid = await elForm?.validate().catch((err) => {
    console.log(err)
  })
  if (valid) {
    const formData = await getFormData()
    const res = await checkAuthInfoApi(formData)
    if (res.code == 200) {
      ElMessage.success(t('common.operateSuccess'))
      currentStep.value = 2
      saveLoading1.value = false
      await getData()
    }
  }
}

const test = (msg) => {
  // {{t('myAccount.result2')}}
  ElMessageBox.alert(msg, t('myAccount.title1'), {
    // if you want to disable its autofocus
    // autofocus: false,
    confirmButtonText: t('project.confirm'),
    callback: (action: Action) => {
      if (action && checkFlag) {
        push('/financialCenter/myaccount')
      }
    }
  })
}

const baseSchema = reactive<FormSchema[]>([
  {
    field: 'amount',
    label: t('myAccount.money'),
    component: 'Input',
    colProps: {
      span: 24
    },
    componentProps: {
      style: {
        width: '100%'
      }
    }
  }
])

const rules = reactive({
  name: [required()],
  address: [required()],
  detail: [required()],
  amount: [required()],
  code: [required()],
  contacts: [required()],
  iphone1: [required()]
})

const bottomForm = useForm()

let checkFlag = false
const save = async () => {
  const elForm = await bottomForm.formMethods.getElFormExpose()
  const valid = await elForm?.validate().catch((err) => {
    console.log(err)
  })
  if (valid) {
    const formData = await bottomForm.formMethods.getFormData()
    const res = await getCheckAuthAmountApi(formData)
    if (res.code == 200) {
      if (res.data) {
        currentStep.value = 3
        checkFlag = true
        // ElMessage.success(t('common.operateSuccess'))
        test(res.msg)
      } else {
        // ElMessage.warning(res.msg)
        checkFlag = false
        test(res.msg)
      }
    }
    dialogVisible.value = false
  }
}
</script>

<template>
  <div>
    <ContentWrap class="h-170px">
      <!-- {{ t('myAccount.step1') }} {{ t('myAccount.step2') }} {{ t('myAccount.step3') }}
      <ElButton @click="test()">测试</ElButton>
      <ElButton @click="dialogVisible = true">{{ t('common.sub1') }}</ElButton> -->
      <Steps :currentStep="currentStep" :stepsDesc="stepsDesc" />
    </ContentWrap>
    <ContentWrap class="mt-20px">
      <div class="mb-20px">{{ t('myAccount.title3') }}</div>

      <Form
        @register="formRegister"
        :rules="receptRule"
        :schema="formSchema"
        class="baseClass h-135px"
      />
      <div class="flex justify-end mt-40px">
        <div class="text-right flex flex-col w-230px items-end">
          <ElButton
            type="primary"
            v-hasPermi="'meraccount:merAccount:checkAuthInfo'"
            :loading="saveLoading1"
            @click="submit"
          >
            {{ t('myAccount.sub11') }}
          </ElButton>
          <div class="font-size-14px mt-10px color-colorGray"
            ><span class="color-#F45057">*</span>{{ t('myAccount.sub12') }}</div
          >
        </div>
      </div>
    </ContentWrap>
    <ContentWrap class="mt-20px">
      <div class="mb-20px">{{ t('myAccount.title4') }}</div>
      <div class="flex-b">
        <div class="flex-c color-#7A7A7A font-size-14px">
          <div class="text-right w-60px min-w-60px">{{ t('myAccount.sub9') }}:</div>
          <div class="ml-15px color-colorBlack">{{ allData?.payName }}</div>
        </div>
      </div>
      <div class="flex-b">
        <div class="flex-c mt-20px color-#7A7A7A font-size-14px">
          <div class="text-right w-60px min-w-60px">{{ t('myAccount.sub8') }}:</div>
          <div class="ml-15px color-colorBlack">{{ allData?.bankNo }}</div>
        </div>
      </div>
      <div class="flex-b mt-10px" v-show="allData?.payStatusStr">
        <ElTag type="info">{{ allData?.payStatusStr }}</ElTag>
      </div>
    </ContentWrap>
    <ContentWrap class="mt-20px">
      <div class="text-right">
        <ElButton v-if="!merAccountBankNoData" @click="push('/financialCenter/myaccount')">{{
          t('common.cancel')
        }}</ElButton>
        <ElButton
          type="primary"
          :loading="saveLoading"
          @click="dialogVisible = true"
          v-if="allData?.payStatusStr"
        >
          {{ t('common.nextLabel') }}
        </ElButton>
      </div>
    </ContentWrap>
  </div>
  <Dialog v-model="dialogVisible" :title="t('myAccount.step2')" max-height="50px">
    <Form :rules="rules" @register="bottomForm.formRegister" :schema="baseSchema" />
    <template #footer>
      <ElButton @click="dialogVisible = false">{{ t('common.cancel') }}</ElButton>
      <ElButton
        type="primary"
        v-hasPermi="'meraccount:merAccount:checkAuthAmount'"
        :loading="saveLoading"
        @click="save"
      >
        {{ t('project.confirm') }}
      </ElButton>
    </template>
  </Dialog>
</template>
