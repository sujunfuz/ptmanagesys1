<script setup lang="tsx">
import { Form, FormSchema, SelectOption } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { ref, reactive, PropType, watch } from 'vue'
import { useValidator } from '@/hooks/web/useValidator'
import { useI18n } from '@/hooks/web/useI18n'
import { ElButton, ElInput, ElMessage } from 'element-plus'
import { Icon } from '@/components/Icon'

const { required, validNumber, validNumberPointer } = useValidator()
const { t } = useI18n()

const props = defineProps({
  currentRow: {
    type: Object as PropType<any>,
    default: () => null
  }
})

const formSchema = reactive<FormSchema[]>([
  {
    field: 'name',
    label: t('cardBank.name'),
    component: 'Input',
    colProps: {
      span: 17
    },
    componentProps: {
      style: {
        width: '80%'
      }
    }
  },
  {
    field: 'code',
    label: t('cardBank.code'),
    component: 'Input',
    colProps: {
      span: 17
    },
    componentProps: {
      style: {
        width: '80%'
      }
    }
  },
  {
    field: 'maximumLimitDay',
    label: t('cardBank.sub1'),
    component: 'Input',
    colProps: {
      span: 17
    },
    componentProps: {
      style: {
        width: '80%'
      }
    }
  },
  {
    field: 'maximumLimitOnce',
    label: t('cardBank.sub2'),
    component: 'Input',
    colProps: {
      span: 17
    },
    componentProps: {
      style: {
        width: '80%'
      }
    }
  },
  {
    field: 'minimumLimitOnce',
    label: t('cardBank.sub3'),
    component: 'Input',
    colProps: {
      span: 17
    },
    componentProps: {
      style: {
        width: '80%'
      }
    }
  },
  {
    field: 'passwordErrorDay',
    label: t('cardBank.sub4'),
    component: 'Input',
    colProps: {
      span: 17
    },
    componentProps: {
      style: {
        width: '80%'
      }
    }
  }
])

const rules = reactive({
  name: [required()],
  code: [required(), validNumber()],
  maximumLimitDay: [required(), validNumberPointer()],
  maximumLimitOnce: [required(), validNumberPointer()],
  minimumLimitOnce: [required(), validNumberPointer()],
  passwordErrorDay: [required(), validNumber()]
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
