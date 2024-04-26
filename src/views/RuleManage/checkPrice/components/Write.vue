<script setup lang="tsx">
import { Form, FormSchema, SelectOption } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { ref, reactive, PropType, watch } from 'vue'
import { useValidator } from '@/hooks/web/useValidator'
import { useI18n } from '@/hooks/web/useI18n'
import { ElButton, ElInput, ElMessage } from 'element-plus'
import { Icon } from '@/components/Icon'
import { string } from 'vue-types'

const { required, validNumber } = useValidator()
const { t } = useI18n()

const props = defineProps({
  currentRow: {
    type: Object as PropType<any>,
    default: () => null
  },
  categoryEnum: {
    type: Object as PropType<any>,
    default: () => null
  }
})

const formSchema = reactive<FormSchema[]>([
  {
    field: 'keyWord',
    label: t('checkPrice.search2'),
    component: 'Input',
    componentProps: {
      maxlength: 20,
      showWordLimit: true
    }
  },
  {
    field: 'categoryId',
    label: t('checkPrice.Level1'),
    component: 'Select',
    componentProps: {
      style: {
        width: '100%'
      },
      options: props.categoryEnum,
      on: {
        change: () => {
          console.log('1222')
        }
      }
    }
  },
  {
    field: 'minPrice',
    label: t('project.minprice'),
    component: 'Input',
    componentProps: {
      type: 'number',
      on: {
        change: async (val) => {
          val = parseFloat(val).toFixed(2)
          await formMethods.setValues({
            minPrice: val
          })
        }
      }
    }
  },
  {
    field: 'maxPrice',
    label: t('project.maxprice'),
    component: 'Input',
    componentProps: {
      type: 'number',
      on: {
        change: async (val) => {
          val = parseFloat(val).toFixed(2)
          await formMethods.setValues({
            maxPrice: val
          })
        }
      }
    }
  }
])

const { formRegister, formMethods } = useForm()
const { setValues, getFormData, getElFormExpose } = formMethods

const validateField = async (rule: any, value: any, callback: any) => {
  const formData = await getFormData()
  formData.minPrice = parseFloat(formData.minPrice)
  value = parseFloat(value)
  if (value < formData.minPrice) {
    callback(new Error(t('checkPrice.sub')))
  } else {
    callback()
  }
}

const rules = reactive({
  keyWord: [required()],
  categoryId: [required()],
  minPrice: [required()],
  maxPrice: [required(), { validator: validateField, trigger: 'blur' }]
})

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
