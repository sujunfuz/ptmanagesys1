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
  },
  categoryTreeList: {
    type: Object as PropType<any>,
    default: () => null
  },
  areaList: {
    type: Object as PropType<any>,
    default: () => null
  }
})

const formSchema = reactive<FormSchema[]>([
  {
    field: 'addressNo',
    label: t('RestrictedSales.search1'),
    component: 'Cascader',
    componentProps: {
      style: {
        width: '100%'
      },
      filterable: true,
      options: props.areaList
    }
  },
  {
    field: 'categoryId',
    label: t('RestrictedSales.search2'),
    component: 'Cascader',
    componentProps: {
      style: {
        width: '100%'
      },
      filterable: true,
      options: props.categoryTreeList,
      props: {
        value: 'id',
        label: 'categoryName'
      }
    }
  },
  {
    field: 'keyWord',
    label: t('RestrictedSales.search3'),
    component: 'Input'
  },
  {
    field: 'reason',
    label: t('RestrictedSales.reason'),
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
  addressNo: [required()],
  categoryId: [required()],
  categoryLevel: [required()],
  keyWord: [required()]
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
