<script setup lang="tsx">
import { Form, FormSchema } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { PropType, reactive, watch, ref, computed } from 'vue'
import { useValidator } from '@/hooks/web/useValidator'
import { useI18n } from '@/hooks/web/useI18n'
import { ElInput } from 'element-plus'
import { ContentWrap } from '@/components/ContentWrap'
import { pathask1, pathask2 } from '@/utils/common'

const { t } = useI18n()

const { required, validMobile, validNumberSpace } = useValidator()

const props = defineProps({
  currentRow: {
    type: Object as PropType<any>,
    default: () => null
  },
  allEnum: {
    type: Object as PropType<any>,
    default: () => null
  }
})

const { formRegister, formMethods } = useForm()
const { setValues, getFormData, getElFormExpose } = formMethods

const statusList = reactive([
  {
    label: t('project.success'),
    value: 'ACTIVE'
  },
  {
    label: t('project.fail'),
    value: 'UNACTIVE'
  }
])

const baseSchema = reactive<FormSchema[]>([
  {
    field: 'logisticsNo',
    label: t('offlinesign.logNumber'),
    component: 'Input',
    componentProps: {
      placeholder: t('project.input'),
      maxlength: '30',
      'show-word-limit': true
    }
  },
  {
    field: 'logisticsCode',
    label: t('offlinesign.logCompany'),
    component: 'Select',
    componentProps: {
      placeholder: t('project.select'),
      options: props.allEnum,
      filterable: true,
      style: {
        width: '100%'
      }
    }
  },
  {
    field: 'phone',
    label: t('AuditCenter.AuditList.phone'),
    component: 'Input',
    componentProps: {
      placeholder: t('project.input'),
      maxlength: '11',
      'show-word-limit': true
    }
  }
])

const rules = reactive<any>({
  logisticsNo: [required(), validNumberSpace()],
  logisticsCode: [required()],
  phone: [required(), validMobile()]
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

// watch(
//   () => props.currentRow,
//   (currentRow) => {
//     if (!currentRow) return
//   },
//   {
//     deep: true,
//     immediate: true
//   }
// )

defineExpose({
  submit
})
</script>

<template>
  <Form
    class="menuSchema"
    :rules="rules"
    :model="currentRow"
    @register="formRegister"
    :schema="baseSchema"
  />
</template>
