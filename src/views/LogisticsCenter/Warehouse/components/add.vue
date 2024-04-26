<script setup lang="tsx">
import { Form, FormSchema } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { PropType, reactive, watch, ref } from 'vue'
import { useValidator } from '@/hooks/web/useValidator'
import { useI18n } from '@/hooks/web/useI18n'

const { t } = useI18n()

const { required, validNumber, validMobile } = useValidator()

const props = defineProps({
  currentRow: {
    type: Object as PropType<any>,
    default: () => null
  },
  publicEnum: {
    type: Array as PropType<any>,
    default: () => []
  },
  areaData: {
    type: Array as PropType<any>,
    default: () => []
  }
})

const formSchema = reactive<FormSchema[]>([
  {
    field: 'warehouseName',
    label: t('Warehouse.name'),
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
    field: 'areaCode',
    label: t('Warehouse.address'),
    colProps: {
      span: 24
    },
    component: 'Cascader',
    componentProps: {
      style: {
        width: '100%'
      },
      options: props.areaData
    }
  },
  {
    field: 'fullAddress',
    label: t('Warehouse.detail'),
    colProps: {
      span: 24
    },
    component: 'Input',
    componentProps: {
      style: {
        width: '100%'
      },
      maxlength: 30,
      showWordLimit: true
    }
  },
  {
    field: 'zipcode',
    label: t('Warehouse.code'),
    colProps: {
      span: 12
    },
    component: 'Input'
  },
  {
    field: 'isDefault',
    label: t('common.a18'),
    colProps: {
      span: 12
    },
    value: 'NO',
    component: 'RadioGroup',
    componentProps: {
      options: props.publicEnum
    }
  },
  {
    field: 'contactBy',
    label: t('Warehouse.contacts'),
    component: 'Input',
    colProps: {
      span: 24
    }
  },
  {
    field: 'contactPhone',
    label: t('Warehouse.iphone1'),
    component: 'Input',
    colProps: {
      span: 24
    }
  }
])

const rules = reactive({
  warehouseName: [required()],
  areaCode: [required()],
  fullAddress: [required()],
  zipcode: [required(), validNumber()],
  contactBy: [required()],
  contactPhone: [required(), validMobile()]
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
    return { ...formData }
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
  <Form
    :rules="rules"
    @register="formRegister"
    :model="currentRow"
    :schema="formSchema"
    class="baseClass"
  />
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
