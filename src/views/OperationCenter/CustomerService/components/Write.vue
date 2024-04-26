<script setup lang="tsx">
import { Form, FormSchema, SelectOption } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { ref, reactive, PropType, watch } from 'vue'
import { useValidator } from '@/hooks/web/useValidator'
import { useI18n } from '@/hooks/web/useI18n'

const { required, validMobile } = useValidator()
const { t } = useI18n()

const props = defineProps({
  currentRow: {
    type: Object as PropType<any>,
    default: () => null
  },
  actionType: {
    type: String,
    default: ''
  },
  bannerBelongTypeEnum: {
    type: Object as PropType<any>,
    default: () => null
  }
})

const formSchema = reactive<FormSchema[]>([
  {
    field: 'contactInfo',
    label: t('customerService.iphone'),
    component: 'Input',
    componentProps: {
      style: {
        width: '80%'
      }
    }
  },
  {
    field: 'manager',
    label: t('customerService.people'),
    component: 'Input',
    componentProps: {
      style: {
        width: '80%'
      }
    }
  },
  {
    field: 'belongPlatform',
    label: t('customerService.plat'),
    component: 'Select',
    colProps: {
      span: 17
    },
    componentProps: {
      options: props.bannerBelongTypeEnum
    }
  }
])

const rules = reactive({
  contactInfo: [required(), validMobile()],
  manager: [required()],
  belongPlatform: [required()]
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
  <div v-if="actionType != 'view'">
    <Form
      :rules="rules"
      :model="currentRow"
      @register="formRegister"
      :schema="formSchema"
      :isCol="false"
    />
  </div>
  <div v-else>
    <div class="flex-c color-#7A7A7A font-size-14px">
      <div class="text-right w-120px min-w-120px">{{ t('customerService.people') }}:</div>
      <div class="ml-15px color-colorBlack">{{ currentRow.manager || '-' }}</div>
    </div>
    <div class="flex-c mt-20px color-#7A7A7A font-size-14px">
      <div class="text-right w-120px min-w-120px">{{ t('customerService.iphone') }}:</div>
      <div class="ml-15px color-colorBlack">{{ currentRow.contactInfo || '-' }}</div>
    </div>
    <div class="flex-c mt-20px color-#7A7A7A font-size-14px">
      <div class="text-right w-120px min-w-120px">{{ t('customerService.plat') }}:</div>
      <div class="ml-15px color-colorBlack">{{ currentRow.belongPlatformStr || '-' }}</div>
    </div>
  </div>
</template>
