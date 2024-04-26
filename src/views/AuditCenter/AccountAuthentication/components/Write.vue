<script setup lang="tsx">
import { Form, FormSchema, SelectOption } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { ref, reactive, PropType, watch } from 'vue'
import { useValidator } from '@/hooks/web/useValidator'
import { useI18n } from '@/hooks/web/useI18n'
import { ElButton, ElInput, ElMessage } from 'element-plus'
import { Icon } from '@/components/Icon'

const { required } = useValidator()
const { t } = useI18n()

const props = defineProps({
  currentRow: {
    type: Object as PropType<any>,
    default: () => null
  }
})

const formSchema = reactive<FormSchema[]>([
  {
    field: 'failedReason',
    label: t('accountAuthentication.sub9'),
    component: 'Input',
    componentProps: {
      type: 'textarea',
      rows: 4,
      maxlength: 90,
      showWordLimit: true
    }
  }
])

const rules = reactive({
  failedReason: [required()]
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

watch(
  () => props.currentRow,
  (currentRow) => {
    if (!currentRow) return
  },
  {
    deep: true,
    immediate: true
  }
)

defineExpose({
  submit,
  formMethods
})
</script>

<template>
  <Form
    :rules="rules"
    :model="currentRow"
    @register="formRegister"
    :schema="formSchema"
    :isCol="false"
  />
</template>
