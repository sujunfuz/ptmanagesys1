<script setup lang="tsx">
import { reactive, ref, watch } from 'vue'
import { Form, FormSchema } from '@/components/Form'
import { useI18n } from '@/hooks/web/useI18n'
import { ElButton, ElInput, ElMessage } from 'element-plus'
import { useForm } from '@/hooks/web/useForm'
import { useValidator } from '@/hooks/web/useValidator'
import {
  registerApi,
  getVerificationCodeAPi,
  getVerificationCodeAPi1,
  registerApi1
} from '@/api/login'
import { onUnmounted } from 'vue'
import { string } from 'vue-types'

const { required, validMobile, validPWD, validEmail } = useValidator()
const props = defineProps({
  bottomRatio: {
    type: string,
    default: '38%'
  },
  showFlag: {
    type: Number,
    default: 1
  }
})
const emit = defineEmits(['to-register', 'update:bottomRatio', 'update:registerFlag'])

const { t } = useI18n()

const rules = {
  applicantMobile: [required(), validMobile()],
  pwd: [required(), validPWD()],
  verifyCode: [required()]
}
const type = ref(1)
const changeType = async (val) => {
  type.value = val
  if (type.value == 1) {
    await forgotPWDForm.formMethods.setSchema([
      {
        field: 'email',
        path: 'remove',
        value: false
      },
      {
        field: 'mobileNo',
        path: 'remove',
        value: true
      }
    ])
  } else {
    await forgotPWDForm.formMethods.setSchema([
      {
        field: 'email',
        path: 'remove',
        value: true
      },
      {
        field: 'mobileNo',
        path: 'remove',
        value: false
      }
    ])
  }
  flag.value = false
  count.value = 60
  clearInterval(timer)
}
const schema1 = reactive<FormSchema[]>([
  {
    field: 'email',
    label: t('auth.email'),
    component: 'Input',
    colProps: {
      span: 24
    },
    componentProps: {
      placeholder: t('common.inputText'),
      style: {
        height: '50px'
      }
    }
  },
  {
    field: 'mobileNo',
    label: t('auth.tel'),
    component: 'Input',
    colProps: {
      span: 24
    },
    remove: true,
    componentProps: {
      placeholder: t('common.inputText'),
      style: {
        height: '50px'
      }
    }
  },
  {
    field: 'emailVerifyCode',
    label: ' ',
    component: 'InputPassword',
    colProps: {
      span: 24
    },
    formItemProps: {
      slots: {
        default: (args) => {
          return (
            <div class="flex w-100% justify-between">
              <ElInput
                placeholder={t('common.inputText')}
                v-model={args.emailVerifyCode}
                class="!h-50px !w-70%"
              ></ElInput>
              <ElButton
                type="primary"
                disabled={flag.value}
                class="!w-90px !h-50px ml-5px"
                onClick={getVerificationCode1}
                loading={btnLoading.value}
              >
                {flag.value ? count.value + 's' + t('accountPage.btn2') : t('accountPage.btn1')}
              </ElButton>
            </div>
          )
        }
      }
    }
  },
  {
    field: 'pwd',
    label: t('common.c'),
    component: 'InputPassword',
    colProps: {
      span: 24
    },
    componentProps: {
      style: {
        width: '100%',
        height: '50px'
      },
      placeholder: t('common.inputText')
    }
  },
  {
    field: 'pwd2',
    label: t('login.checkPassword'),
    value: '',
    component: 'InputPassword',
    colProps: {
      span: 24
    },
    componentProps: {
      style: {
        width: '100%',
        height: '50px'
      },
      placeholder: t('login.passwordPlaceholder')
    }
  },
  {
    field: 'register',
    colProps: {
      span: 24
    },
    formItemProps: {
      slots: {
        default: () => {
          return (
            <>
              <div class="w-[100%]  mt-20px flex flex-col">
                <ElButton
                  loading={loading.value}
                  type="primary"
                  onClick={register1}
                  class="w-[100%] !h-50px mb-20px"
                >
                  {t('login.btn1')}
                </ElButton>
                {type.value == 1 ? (
                  <ElButton
                    type="primary"
                    onClick={() => {
                      changeType(2)
                    }}
                    class="w-[100%] !h-50px"
                  >
                    {t('login.btn2')}
                  </ElButton>
                ) : (
                  <ElButton
                    type="primary"
                    onClick={() => {
                      changeType(1)
                    }}
                    class="w-[100%] !h-50px"
                  >
                    {t('login.btn3')}
                  </ElButton>
                )}
              </div>
            </>
          )
        }
      }
    }
  }
])

const validateCopy = async (rule, value, callback) => {
  const formData = await forgotPWDForm.formMethods.getFormData()
  if (value != formData.pwd) {
    callback(new Error(t('common.isEqual')))
  } else {
    callback()
  }
}

const rules1 = reactive({
  email: [required(), validEmail()],
  pwd: [required(), validPWD()],
  pwd2: [required(), validPWD(), { validator: validateCopy, trigger: 'blur' }],
  mobileNo: [required(), validMobile()]
})

const verifyCodeLoading = ref(false)
const schema = reactive<FormSchema[]>([
  {
    field: 'applicantName',
    label: t('merchantDetail.name'),
    component: 'Input',
    colProps: {
      span: 24
    },
    componentProps: {
      placeholder: t('common.inputText'),
      style: {
        height: '50px'
      }
    }
  },
  {
    field: 'applicantMobile',
    label: t('companyInformationEdit4.sub2'),
    component: 'Input',
    colProps: {
      span: 24
    },
    componentProps: {
      placeholder: t('common.inputText'),
      style: {
        height: '50px'
      }
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
            <div class="flex w-100% justify-between">
              <ElInput placeholder={t('common.inputText')} v-model={args.verifyCode} class="!h-50px !w-70%"></ElInput>
              <ElButton
                type="primary"
                disabled={flag.value}
                class="!w-90px !h-50px ml-5px"
                onClick={getVerificationCode}
                loading={verifyCodeLoading.value}
              >
                {flag.value ? count.value + 's' + t('accountPage.btn2') : t('accountPage.btn1')}
              </ElButton>
            </div>
          )
        }
      }
    }
  },
  {
    field: 'pwd',
    label: t('login.password'),
    component: 'InputPassword',
    colProps: {
      span: 24
    },
    componentProps: {
      style: {
        width: '100%',
        height: '50px'
      },
      placeholder: t('common.inputText')
    }
  },

  {
    field: 'register',
    colProps: {
      span: 24
    },
    formItemProps: {
      slots: {
        default: () => {
          return (
            <>
              <div class="w-[100%]  mt-20px">
                <ElButton
                  loading={loading.value}
                  type="primary"
                  onClick={register}
                  class="w-[100%] !h-50px"
                >
                  {t('login.registerNow')}
                </ElButton>
              </div>
            </>
          )
        }
      }
    }
  }
])

const { formRegister, formMethods } = useForm()
const forgotPWDForm = useForm()
const { getFormData, getElFormExpose } = formMethods

const loading = ref(false)
//发送验证码
const getVerificationCode = async () => {
  verifyCodeLoading.value = true
  let formEl = await getElFormExpose()
  formEl?.validateField(['applicantMobile'], async (valid) => {
    if (valid) {
      const formData = await getFormData()
      const res = await getVerificationCodeAPi(formData.applicantMobile)
      if (res.code == 200) {
        getNowTime()
        verifyCodeLoading.value = false
      } else {
        verifyCodeLoading.value = false
      }
    } else {
      verifyCodeLoading.value = false
    }
  })
}

const btnLoading = ref(false)
// 发送验证码
const getVerificationCode1 = async () => {
  btnLoading.value = true
  let formEl = await forgotPWDForm.formMethods.getElFormExpose()
  formEl?.validateField(['email'], async (valid) => {
    if (valid) {
      const formData = await forgotPWDForm.formMethods.getFormData()
      let res
      if (type.value == 1) {
        res = await getVerificationCodeAPi1(formData.email)
      } else if (type.value == 2) {
        res = await getVerificationCodeAPi(formData.mobileNo)
      }
      if (res.code == 200) {
        ElMessage.success(t('common.operateSuccess'))
        getNowTime()
        btnLoading.value = false
      } else {
        btnLoading.value = false
      }
    } else{
      btnLoading.value = false
    }
  })
}
//计算倒计时
let timeStamp: any = 0
let flag = ref(false)
let timer: any = null
const count = ref(60)
const getNowTime = () => {
  clearInterval(timer)
  timeStamp = new Date().getTime() + 60 * 1000
  flag.value = true
  timer = setInterval(() => {
    let a = new Date().getTime()
    if (a > timeStamp) {
      flag.value = false
      count.value = 60
      clearInterval(timer)
    } else {
      count.value = parseInt((timeStamp - new Date().getTime()) / 1000 + '')
    }
  }, 1000)
}
const register = async () => {
  const formEl = await getElFormExpose()
  await formEl?.validate(async (valid) => {
    if (valid) {
      const formData = await getFormData()
      const res = await registerApi({ ...formData })
      if (res.code == 200) {
        showSuccess.value = true
        emit('update:bottomRatio', '32%')
        fiveSeconds()
      }
    }
  })
}

const register1 = async () => {
  const formEl = await forgotPWDForm.formMethods.getElFormExpose()
  await formEl?.validate(async (valid) => {
    if (valid) {
      const formData = await forgotPWDForm.formMethods.getFormData()
      let res
      if (type.value == 1) {
        res = await registerApi1({ ...formData, type: type.value })
      } else if (type.value == 2) {
        let params = { ...formData }
        params.mobileVerifyCode = params.emailVerifyCode
        params.type = type.value
        res = await registerApi1(params)
      }
      if (res.code == 200) {
        showSuccess.value = true
        ElMessage.success(t('common.operateSuccess'))
        emit('update:bottomRatio', '32%')
        fiveSeconds()
      }
    }
  })
}
const showSuccess = ref(false)
const returnBack = () => {
  count.value = 60
  clearInterval(timer)
  showSuccess.value = false
  emit('update:registerFlag', 2)
  emit('update:bottomRatio', '38%')
}
const fiveSeconds = () => {
  count.value = 5
  timeStamp = new Date().getTime() + 5 * 1000
  timer = setInterval(() => {
    let a = new Date().getTime()
    if (a > timeStamp) {
      count.value = 60
      clearInterval(timer)
      showSuccess.value = false
      emit('update:registerFlag', 2)
      emit('update:bottomRatio', '38%')
    } else {
      count.value = parseInt((timeStamp - new Date().getTime()) / 1000 + '')
    }
  }, 1000)
}
onUnmounted(() => {
  clearInterval(timer)
})
</script>

<template>
  <div v-if="showFlag == 1">
    <Form v-if="!showSuccess" :schema="schema" :rules="rules" hide-required-asterisk size="large"
      class="dark:(border-1 border-[var(--el-border-color)] border-solid)" @register="formRegister" />
    <div v-else class="flex-c flex-col align-center ml-126px">
      <img class="w-210px" src="@/assets/imgs/Login/registerbg.png" alt="" />
      <div class="color-colorMain text-center font-size-24px font-500">{{
        t('merchantDialog.success')
      }}</div>
      <ElButton class="mt-30px !h-40px" type="primary" @click="returnBack">{{ t('login.returnLogin') }} ({{ count }}s)
      </ElButton>
    </div>
  </div>
  <div v-else>
    <Form :schema="schema1" :rules="rules1" hide-required-asterisk size="large"
      class="dark:(border-1 border-[var(--el-border-color)] border-solid)" @register="forgotPWDForm.formRegister" />
  </div>
</template>
<style scoped lang="less">
:deep(.el-button + .el-button) {
  margin-left: 0px !important;
}
</style>
