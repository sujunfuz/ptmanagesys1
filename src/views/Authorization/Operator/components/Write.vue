<script setup lang="ts">
import { Form, FormSchema } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { PropType, reactive, watch, onMounted, ref } from 'vue'
import { useValidator } from '@/hooks/web/useValidator'
import { useI18n } from '@/hooks/web/useI18n'
import { cloneDeep } from 'lodash-es'
const { required, validMobile, validPWD, validEmail } = useValidator()
const { t } = useI18n()

const props = defineProps({
  openType: {
    type: String,
    default: ''
  },
  arrTemp: {
    type: Array<any>,
    default: () => []
  },
  currentRow: {
    type: Object as PropType<any>,
    default: () => null
  },
  statusOptions: {
    type: Array as PropType<any>,
    default: () => []
  }
})
const formSchema1 = reactive<FormSchema[]>([
  {
    field: 'loginName',
    label: t('operator.loginName'),
    component: 'Input',
    componentProps: {
      readonly: true
    }
  },
  {
    field: 'newPwd',
    label: t('common.newPwd'),
    component: 'InputPassword',
    componentProps: {
      style: {
        width: '100%'
      },
      placeholder: t('common.inputText') + t('common.newPwd')
    }
  },
  {
    field: 'newPwd2',
    label: t('common.confirmPwd'),
    component: 'InputPassword',
    componentProps: {
      style: {
        width: '100%'
      },
      placeholder: t('common.inputText') + t('common.confirmPwd')
    }
  }
])

const formSchema = reactive<FormSchema[]>([
  {
    field: 'realName',
    label: t('operator.operatorName'),
    component: 'Input',
    componentProps: {
      maxlength: 30,
      showWordLimit: true,
      readonly: props.openType == 'view',
      style: {
        width: '100%'
      }
    }
  },
  {
    field: 'loginName',
    label: t('operator.loginName'),
    component: 'Input',
    componentProps: {
      placeholder: t('common.q'),
      readonly: props.openType == 'view'
    }
  },
  {
    field: 'mobileNo',
    label: t('operator.iphone'),
    component: 'Input',
    componentProps: {
      readonly: props.openType == 'view',
      maxlength: 11
    }
  },
  {
    field: 'pwd',
    label: t('operator.password'),
    component: 'Input',
    componentProps: {
      type: 'password',
      maxlength: 12,
      showPassword: true,
      readonly: props.openType == 'view'
    }
  },
  {
    field: 'unStatus',
    label: t('operator.status'),
    component: 'Select',
    // value: 'STATUS_0_0_0_0',
    componentProps: {
      disabled: props.openType == 'view',
      options: props.statusOptions
    }
  },
  {
    field: 'remark',
    label: t('operator.remark'),
    component: 'Input',
    componentProps: {
      type: 'textarea',
      maxlength: 50,
      showWordLimit: true,
      readonly: props.openType == 'view'
    }
  },
  {
    field: 'roleIds',
    label: t('operator.chioceRole'),
    component: 'CheckboxGroup',
    value: [],
    componentProps: {
      disabled: props.openType == 'view',
      options: props.arrTemp
    }
  },
  {
    field: 'exptime',
    label: t('operator.exptime'),
    component: 'Input',
    value: '720',
    componentProps: {
      readonly: props.openType == 'view',
      slots: {
        append: t('operator.minute')
      },
      on: {
        input: async (value) => {
          value = value.replace(/[^\d]/g, '')
          await formMethods.setValues({
            exptime: value
          })
        }
      }
    }
  },
  {
    field: 'refreshTokenTime',
    label: t('operator.refreshTokenTime'),
    component: 'Input',
    value: '720',
    componentProps: {
      readonly: props.openType == 'view',
      slots: {
        append: t('operator.minute')
      },
      on: {
        input: async (value) => {
          value = value.replace(/[^\d]/g, '')
          await formMethods.setValues({
            refreshTokenTime: value
          })
        }
      }
    }
  }
])

const { formRegister, formMethods } = useForm()
const { getFormData, getElFormExpose } = formMethods

const validateCopy = async (rule, value, callback) => {
  const formData = await getFormData()
  if (value != formData.newPwd) {
    callback(new Error(t('common.isEqual')))
  } else {
    callback()
  }
}

const rules = reactive({
  realName: [required(), { min: 2, max: 30, message: t('common.t'), trigger: 'blur' }],
  loginName: [required(), validEmail()],
  pwd: [required(), validPWD()],
  mobileNo: [required(), validMobile()],
  roleIds: [required()],
  newPwd: [required(), validPWD()],
  newPwd2: [required(), validPWD(), { validator: validateCopy, trigger: 'blur' }],
  unStatus: [required()]
  // exptime: [required()],
  // refreshTokenTime: [required()]
})

const submit = async () => {
  const elForm = await getElFormExpose()
  const valid = await elForm?.validate().catch((err) => {
    console.log(err)
  })
  if (valid) {
    let formData = await getFormData()
    formData = cloneDeep(formData)
    return formData
  }
}

let allSchema = ref<Array<any>>([])
onMounted(() => {
  if (props.openType != 'resetPwd') {
    if (props.openType == 'edit' || props.openType == 'view') {
      formMethods.setSchema([
        {
          field: 'pwd',
          path: 'remove',
          value: true
        }
      ])
    } else if (props.openType == 'add') {
      formMethods.setSchema([
        {
          field: 'pwd',
          path: 'componentProps.type',
          value: 'text'
        },
        {
          field: 'pwd',
          path: 'componentProps.showPassword',
          value: false
        },
        {
          field: 'pwd',
          path: 'componentProps.on.focus',
          value: async () => {
            await formMethods.setSchema([
              {
                field: 'pwd',
                path: 'componentProps.type',
                value: 'password'
              },
              {
                field: 'pwd',
                path: 'componentProps.showPassword',
                value: true
              }
            ])
          }
        }
      ])
    }
    allSchema.value = formSchema
  } else {
    allSchema.value = formSchema1
  }
})
defineExpose({
  submit
})
</script>

<template>
  <!-- :schema="openType != 'resetPwd' ? formSchema : formSchema1" -->

  <Form :rules="rules" :schema="allSchema" @register="formRegister" :model="currentRow" />
</template>
