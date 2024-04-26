<script setup lang="tsx">
import { Form, FormSchema, SelectOption } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { ref, reactive, PropType, watch } from 'vue'
import { useValidator } from '@/hooks/web/useValidator'
import { useI18n } from '@/hooks/web/useI18n'
import { ElButton, ElInput, ElMessage } from 'element-plus'
import { Icon } from '@/components/Icon'

const { required, validNumber, validIp } = useValidator()
const { t } = useI18n()

const props = defineProps({
  currentRow: {
    type: Object as PropType<any>,
    default: () => null
  },
  tabPosition: {
    type: String,
    default: ''
  },
  actionType: {
    type: String,
    default: ''
  }
})

const formSchema = reactive<FormSchema[]>([
  {
    field: 'ip',
    label: t('whiteList.ip'),
    component: 'Input',
    remove: props.tabPosition != '1'
  },
  {
    field: 'cardGroupName',
    label: t('cardBank.name'),
    component: 'Input',
    remove: props.tabPosition != '2'
  },
  {
    field: 'cardGroupCode',
    label: t('cardBank.code'),
    component: 'Input',
    remove: props.tabPosition != '2'
  },
  {
    field: 'cardNo',
    label: t('whiteList.sub5'),
    component: 'Input',
    remove: props.tabPosition != '3'
  },
  {
    field: 'behavior',
    label: t('blacklist.sub7'),
    component: 'Input',
    componentProps: {
      type: 'textarea',
      rows: 6,
      maxlength: 300,
      showWordLimit: true
    }
  }
])

const rules = reactive({
  cardNo: [required(), validNumber()],
  behavior: [required()],
  ip: [required(), validIp()],
  cardGroupName: [required()],
  cardGroupCode: [required(), validNumber()]
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
    <div v-if="tabPosition == '1'">
      <div class="flex-c color-#7A7A7A font-size-14px">
        <div class="text-right w-120px min-w-120px">{{ t('abnormalMerchant.sub4') }}:</div>
        <div class="ml-15px color-colorBlack">{{ currentRow.ip || '-' }}</div>
      </div>
      <div class="flex-c mt-20px color-#7A7A7A font-size-14px">
        <div class="text-right w-120px min-w-120px">{{ t('blacklist.reason') }}:</div>
        <div class="ml-15px color-colorBlack">{{ currentRow.monitoringEvent || '-' }}</div>
      </div>
    </div>
    <div v-else-if="tabPosition == '2'">
      <div class="flex-c color-#7A7A7A font-size-14px">
        <div class="text-right w-120px min-w-120px">{{ t('cardBank.name') }}:</div>
        <div class="ml-15px color-colorBlack">{{ currentRow.cardGroupName || '-' }}</div>
      </div>
      <div class="flex-c mt-20px color-#7A7A7A font-size-14px">
        <div class="text-right w-120px min-w-120px">{{ t('cardBank.code') }}:</div>
        <div class="ml-15px color-colorBlack">{{ currentRow.cardGroupCode || '-' }}</div>
      </div>
    </div>
    <div v-else-if="tabPosition == '3'">
      <div class="flex-c color-#7A7A7A font-size-14px">
        <div class="text-right w-120px min-w-120px">{{ t('whiteList.sub5') }}:</div>
        <div class="ml-15px color-colorBlack">{{ currentRow.cardNo || '-' }}</div>
      </div>
    </div>

    <div class="flex-c mt-20px color-#7A7A7A font-size-14px">
      <div class="text-right w-120px min-w-120px">{{ t('whiteList.time') }}:</div>
      <div class="ml-15px color-colorBlack">{{ currentRow.createTimeStr || '-' }}</div>
    </div>
    <div class="flex-c mt-20px color-#7A7A7A font-size-14px">
      <div class="text-right w-120px min-w-120px">{{ t('whiteList.people') }}:</div>
      <div class="ml-15px color-colorBlack">{{ currentRow.operatorName || '-' }}</div>
    </div>

    <div class="flex justify-start mt-20px color-#7A7A7A font-size-14px">
      <div class="text-right w-120px min-w-120px">{{ t('blackList.sub5') }}:</div>
      <div class="ml-15px">
        <div v-if="currentRow.listRecordList.length == 0">-</div>
        <div
          v-else
          class="color-colorBlack mb-10px"
          v-for="(item, key) in currentRow.listRecordList"
          :key="key"
          >{{ item.createTimeStr || '-' }}&nbsp;&nbsp;&nbsp;{{
            item.operatorName || '-'
          }}&nbsp;&nbsp;&nbsp;{{ item.behavior || '-' }}</div
        >
      </div>
    </div>
  </div>
</template>
