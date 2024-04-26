<script setup lang="ts">
import { Form, FormSchema } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { PropType, reactive, watch } from 'vue'
import { DepartmentUserItem } from '@/api/department/types'
import { useValidator } from '@/hooks/web/useValidator'
import { useI18n } from '@/hooks/web/useI18n'

const { required } = useValidator()
const { t } = useI18n()

const props = defineProps({
  currentRow: {
    type: Object as PropType<DepartmentUserItem>,
    default: () => undefined
  },
  dictId: {
    type: String,
    default: () => ''
  },
  actionType: {
    type: String,
    default: () => ''
  }
})

const formSchema = reactive<FormSchema[]>([
  {
    field: 'itemText',
    label: t('dictionariesParameter.itemText'),
    component: 'Input',
    componentProps: {
      readonly: props.actionType == 'look' ? true : false,
      style: {
        width: '100%'
      }
    }
  },
  {
    field: 'itemValue',
    label: t('dictionariesParameter.itemValue'),
    component: 'Input',
    componentProps: {
      readonly: props.actionType == 'look' ? true : false
    }
  },
  {
    field: 'sort',
    label: t('dictionariesParameter.sort'),
    component: 'Input',
    componentProps: {
      readonly: props.actionType == 'look' ? true : false
    }
  },
  {
    field: 'remark',
    label: t('dictionariesParameter.remark'),
    component: 'Input',
    componentProps: {
      readonly: props.actionType == 'look' ? true : false
    }
  }
])

const rules = reactive({
  itemCode: [required()],
  itemText: [required()],
  itemValue: [required()],
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
    formData.dictId = props.dictId
    return formData
  }
}

watch(
  () => props.currentRow,
  (currentRow) => {
    if (!currentRow) return
    setValues(currentRow)
  },
  {
    deep: true,
    immediate: true
  }
)

defineExpose({
  submit
})
</script>

<template>
  <Form :rules="rules" @register="formRegister" :schema="formSchema" :isCol="false" />
</template>
