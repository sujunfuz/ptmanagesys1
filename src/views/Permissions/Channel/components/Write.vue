<script setup lang="ts">
import { Form, FormSchema, SelectOption } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { PropType, reactive, watch } from 'vue'
import { DepartmentUserItem } from '@/api/department/types'
import { useValidator } from '@/hooks/web/useValidator'
import { useI18n } from '@/hooks/web/useI18n'
import { ElOption } from 'element-plus'

const { required } = useValidator()
const { t } = useI18n()

const formSchema = reactive<FormSchema[]>([
  {
    field: 'channelCode',
    label: t('channel.channelCode'),
    component: 'Select',
    componentProps: {
      style: {
        width: '100%'
      },
      options: [
        {
          label: 'option1',
          value: '1'
        },
        {
          label: 'option2',
          value: '2'
        }
      ],
      on: {
        change: () => {
          console.log('1222')
        }
      }
    }
  },
  {
    field: 'thoroughfareType',
    label: t('channel.thoroughfareType'),
    component: 'Select',
    componentProps: {
      style: {
        width: '100%'
      },
      options: [
        {
          label: 'option1',
          value: '1'
        },
        {
          label: 'option2',
          value: '2'
        }
      ],
      on: {
        change: () => {
          console.log('1222')
        }
      }
    }
  },
  {
    field: 'payType',
    label: t('channel.payType'),
    component: 'Select',
    componentProps: {
      style: {
        width: '100%'
      },
      options: [
        {
          label: 'option1',
          value: '1'
        },
        {
          label: 'option2',
          value: '2'
        }
      ],
      on: {
        change: () => {
          console.log('1222')
        }
      }
    }
  },
  {
    field: 'appid',
    label: t('channel.appid'),
    component: 'Input',
    componentProps: {
      style: {
        width: '100%'
      }
    }
  },
  {
    field: 'mid',
    label: t('channel.mid'),
    component: 'Input'
  },
  {
    field: 'privateKey',
    label: t('channel.privateKey'),
    component: 'Input'
  },
  {
    field: 'publicKey',
    label: t('channel.publicKey'),
    component: 'Input'
  },
  {
    field: 'reqUrl',
    label: t('channel.reqUrl'),
    component: 'Input'
  },
  {
    field: 'notifyUrl',
    label: t('channel.notifyUrl'),
    component: 'Input'
  },
  {
    field: 'returnUrl',
    label: t('channel.returnUrl'),
    component: 'Input'
  },
  {
    field: 'rate',
    label: t('channel.rate'),
    component: 'Input'
  },
  {
    field: 'currency',
    label: t('channel.currency'),
    component: 'Input'
  },
  {
    field: 'data',
    label: t('channel.data'),
    component: 'Input'
  },
  {
    field: 'sort',
    label: t('dictionariesParameter.sort'),
    component: 'Input'
  },
  {
    field: 'status',
    label: t('operator.status'),
    component: 'Select',
    componentProps: {
      style: {
        width: '100%'
      },
      options: [
        {
          label: 'option1',
          value: '1'
        },
        {
          label: 'option2',
          value: '2'
        }
      ],
      on: {
        change: () => {
          console.log('1222')
        }
      }
    }
  },
  {
    field: 'remark',
    label: t('dictionariesParameter.remark'),
    component: 'Input'
  }
])

const rules = reactive({
  channelCode: [required()],
  thoroughfareType: [required()],
  payType: [required()],
  appid: [required()],
  mid: [required()],
  privateKey: [required()],
  publicKey: [required()],
  reqUrl: [required()],
  notifyUrl: [required()],
  returnUrl: [required()],
  rate: [required()],
  currency: [required()],
  data: [required()],
  sort: [required()]
})

const { formRegister, formMethods } = useForm()
const { setValues, getFormData, getElFormExpose } = formMethods

const submit = async () => {
  const elForm = await getElFormExpose()
  const valid = await elForm?.validate().catch((err) => {
    console.log(err)
  })
  if (valid) {
    const formData = await getFormData()
    return formData
  }
}

defineExpose({
  submit,
  formMethods
})
</script>

<template>
  <Form :rules="rules" @register="formRegister" :schema="formSchema" :isCol="false" />
</template>
