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
  <div>
    <div class="flex-c color-#7A7A7A font-size-14px">
      <div class="text-right w-120px min-w-120px">{{ t('abnormalUser.sub2') }}:</div>
      <div class="ml-15px color-colorBlack">{{ currentRow.companyName || '-' }}</div>
    </div>
    <div class="flex-c mt-20px color-#7A7A7A font-size-14px">
      <div class="text-right w-120px min-w-120px">{{ t('buyer.sub1') }}:</div>
      <div class="ml-15px color-colorBlack">{{ currentRow.warehouseTypeStr || '-' }}</div>
    </div>
    <div class="flex-c mt-20px color-#7A7A7A font-size-14px">
      <div class="text-right w-120px min-w-120px">{{ t('abnormalUser.email') }}:</div>
      <div class="ml-15px color-colorBlack">{{ currentRow.email || '-' }}</div>
    </div>
    <div class="flex-c mt-20px color-#7A7A7A font-size-14px">
      <div class="text-right w-120px min-w-120px">{{ t('abnormalUser.sub5') }}:</div>
      <div class="ml-15px color-colorBlack">{{ currentRow.realName || '-' }}</div>
    </div>
    <div class="flex-c mt-20px color-#7A7A7A font-size-14px">
      <div class="text-right w-120px min-w-120px">{{ t('abnormalUser.sub6') }}:</div>
      <div class="ml-15px color-colorBlack">{{ currentRow.nickName || '-' }}</div>
    </div>
    <div class="flex-c mt-20px color-#7A7A7A font-size-14px">
      <div class="text-right w-120px min-w-120px">{{ t('abnormalUser.iphone') }}:</div>
      <div class="ml-15px color-colorBlack">{{ currentRow.mobile || '-' }}</div>
    </div>
    <div class="flex-c mt-20px color-#7A7A7A font-size-14px">
      <div class="text-right w-120px min-w-120px">{{ t('abnormalUser.status1') }}:</div>
      <div class="ml-15px color-colorBlack">{{ currentRow.statusStr || '-' }}</div>
    </div>
    <div class="flex justify-start mt-20px color-#7A7A7A font-size-14px">
      <div class="text-right w-120px min-w-120px">{{ t('abnormalUser.sub7') }}:</div>
      <div class="ml-15px">
        <div
          class="color-colorBlack mb-10px"
          v-for="(item, key) in currentRow.userBehaviorList"
          :key="key"
          >{{ item.createTimeStr || '-' }}&nbsp;&nbsp;&nbsp;{{
            item.behavior || '-'
          }}&nbsp;&nbsp;&nbsp;{{ item.ip || '-' }}</div
        >
      </div>
    </div>
  </div>
</template>
