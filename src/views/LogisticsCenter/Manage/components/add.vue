<script setup lang="tsx">
import { Form, FormSchema } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { PropType, reactive, watch, ref } from 'vue'
import { useValidator } from '@/hooks/web/useValidator'
import { useI18n } from '@/hooks/web/useI18n'
import { ElMessage } from 'element-plus'

const { t } = useI18n()

const { required, validD } = useValidator()

const props = defineProps({
  currentRow: {
    type: Object as PropType<any>,
    default: () => null
  },
  deliveryType: {
    type: Object as PropType<any>,
    default: () => null
  },
  logisticsCompanyEnum: {
    type: Object as PropType<any>,
    default: () => null
  },
  actionType: {
    type: String,
    default: ''
  }
})

const formSchema = reactive<FormSchema[]>([
  {
    field: 'orderNo',
    label: t('logistics.orderNo'),
    component: 'Input',
    colProps: {
      span: 24
    },
    componentProps: {
      style: {
        width: '100%'
      },
      disabled: props.actionType == 'edit',
      maxlength: 30,
      showWordLimit: true
    }
  },
  {
    field: 'logisticsCode',
    label: t('offlinesign.logCompany'),
    colProps: {
      span: 24
    },
    component: 'Select',
    componentProps: {
      props: {
        value: 'name',
        label: 'companyName'
      },
      filterable: true,
      options: props.logisticsCompanyEnum,
      style: {
        width: '100%'
      }
    }
  },
  {
    field: 'logisticsNo',
    label: t('aftersalesList.kuaidiNo'),
    component: 'Input',
    colProps: {
      span: 24
    },
    componentProps: {
      style: {
        width: '100%'
      },
      maxlength: 30,
      showWordLimit: true
    }
  },
  {
    field: 'deliveryDate',
    label: t('logistics.delivery'),
    colProps: {
      span: 24
    },
    component: 'DatePicker',
    componentProps: {
      format: 'YYYY/MM/DD HH:mm:ss',
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
      style: {
        width: '100%'
      }
    }
  },
  {
    field: 'deliveryType',
    label: t('logistics.way'),
    colProps: {
      span: 24
    },
    component: 'Select',
    componentProps: {
      style: {
        width: '100%'
      },
      options: props.deliveryType
    }
  },
  {
    field: 'carrier',
    label: t('logistics.director'),
    component: 'Input',
    colProps: {
      span: 24
    }
  }
])

const rules = reactive({
  orderNo: [required(), validD()],
  logisticsCode: [required()],
  deliveryDate: [required()],
  deliveryType: [required()],
  logisticsNo: [required()]
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
  <div v-if="actionType != 'view'">
    <Form
      :rules="rules"
      :model="currentRow"
      @register="formRegister"
      :schema="formSchema"
      class="baseClass"
    />
  </div>
  <div v-else>
    <div class="flex-c color-#7A7A7A font-size-14px">
      <div class="text-right w-120px min-w-120px">{{ t('logistics.orderNo') }}:</div>
      <div class="ml-15px color-colorBlack">{{ currentRow?.storeBatchNo || '-' }}</div>
    </div>
    <div class="flex-c mt-20px color-#7A7A7A font-size-14px">
      <div class="text-right w-120px min-w-120px">{{ t('offlinesign.logCompany') }}:</div>
      <div class="ml-15px color-colorBlack">{{ currentRow?.logisticsCodeStr || '-' }}</div>
    </div>
    <div class="flex-c mt-20px color-#7A7A7A font-size-14px">
      <div class="text-right w-120px min-w-120px">{{ t('logistics.delivery') }}:</div>
      <div class="ml-15px color-colorBlack">{{ currentRow?.deliveryDate || '-' }}</div>
    </div>
    <div class="flex-c mt-20px color-#7A7A7A font-size-14px">
      <div class="text-right w-120px min-w-120px">{{ t('logistics.way') }}:</div>
      <div class="ml-15px color-colorBlack">{{ currentRow?.deliveryTypeStr || '-' }}</div>
    </div>
    <div class="flex-c mt-20px color-#7A7A7A font-size-14px">
      <div class="text-right w-120px min-w-120px">{{ t('logistics.director') }}:</div>
      <div class="ml-15px color-colorBlack">{{ currentRow?.carrier || '-' }}</div>
    </div>
  </div>
</template>

<style lang="less">
.baseClass {
  .el-upload {
    width: 150px;
    height: 150px;
    position: relative;
    overflow: hidden;
    cursor: pointer;
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    transition: var(--el-transition-duration-fast);
  }

  .el-upload:hover {
    border-color: var(--el-color-primary);
    .el-icon svg {
      color: var(--el-color-primary);
    }
  }

  .el-icon.avatar-uploader-icon {
    width: 178px;
    height: 178px;
    font-size: 28px;
    color: #8c939d;
    text-align: center;
  }
}
</style>
