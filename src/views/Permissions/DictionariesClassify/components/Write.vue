<script setup lang="ts">
import { Form, FormSchema } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { PropType, reactive, watch } from 'vue'
import { DepartmentUserItem } from '@/api/department/types'
import { useValidator } from '@/hooks/web/useValidator'
import { useI18n } from '@/hooks/web/useI18n'

const { required } = useValidator()
const { t } = useI18n()

const formSchema = reactive<FormSchema[]>([
  {
    field: 'dataType',
    label: t('dictionariesClassify.dictType'),
    component: 'Select',
    componentProps: {
      disabled: props.actionType == 'look',
      style: {
        width: '100%'
      },
      options: [
        {
          label: t('image.sub19'),
          value: 0
        },
        {
          label: t('image.sub20'),
          value: 1
        }
      ]
    }
  },
  {
    field: 'dictName',
    label: t('dictionariesClassify.dictName'),
    component: 'Input',
    componentProps: {
      readonly: props.actionType == 'look',
      style: {
        width: '100%'
      }
    }
  },
  {
    field: 'itemCode',
    label: t('dictionariesClassify.itemCode'),
    component: 'Input',
    componentProps: {
      readonly: props.actionType == 'look'
    }
  },
  {
    field: 'description',
    label: t('dictionariesClassify.description'),
    component: 'Input',
    componentProps: {
      readonly: props.actionType == 'look'
    }
  },
  {
    field: 'remark',
    label: t('dictionariesParameter.remark'),
    component: 'Input',
    componentProps: {
      readonly: props.actionType == 'look'
    }
  }
])

const rules = reactive({
  dataType: [required()],
  dictName: [required()],
  itemCode: [required()],
  description: [required()]
})

const { formRegister, formMethods } = useForm()
const { setValues, getFormData, getElFormExpose } = formMethods

const props = defineProps({
  currentRow: {
    type: Object as PropType<DepartmentUserItem>,
    default: () => undefined
  },
  actionType: {
    type: String,
    defult: () => ''
  }
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
