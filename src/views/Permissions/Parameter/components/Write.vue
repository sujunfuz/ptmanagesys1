<script setup lang="ts">
import { Form, FormSchema } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { reactive } from 'vue'
import { useValidator } from '@/hooks/web/useValidator'
import { useI18n } from '@/hooks/web/useI18n'

const { required } = useValidator()
const { t } = useI18n()

const formSchema = reactive<FormSchema[]>([
  {
    field: 'paramName',
    label: t('parameterDemo.parameter'),
    component: 'Input',
    componentProps: {
      style: {
        width: '100%'
      }
    }
  },
  {
    field: 'paramText',
    label: t('parameterDemo.content'),
    component: 'Input'
  },
  {
    field: 'remark',
    label: t('parameterDemo.remark'),
    component: 'Input'
  }
])

const rules = reactive({
  paramName: [required()],
  paramText: [required()]
})

const { formRegister, formMethods } = useForm()
const { getFormData, getElFormExpose } = formMethods

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
