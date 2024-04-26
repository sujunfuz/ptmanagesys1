<script setup lang="tsx">
import { Form, FormSchema } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { PropType, reactive, watch, ref } from 'vue'
import { useValidator } from '@/hooks/web/useValidator'
import { useI18n } from '@/hooks/web/useI18n'
import { ElMessage } from 'element-plus'

const { t } = useI18n()

const { required } = useValidator()

const props = defineProps({
  currentRow: {
    type: Object as PropType<any>,
    default: () => null
  }
})

const imageUrl = ref('')

const formSchema = reactive<FormSchema[]>([
  {
    field: 'companyName',
    label: t('merchant.name'),
    component: 'Input',
    colProps: {
      span: 24
    },
    componentProps: {
      style: {
        width: '100%'
      },
      disabled: true,
      maxlength: 30,
      showWordLimit: true
    }
  },
  {
    field: 'guarantor',
    label: t('merchant.guarantor'),
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
    field: 'creditLimit',
    label: t('merchant.money'),
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
    field: 'statusColor',
    label: t('merchant.status'),
    colProps: {
      span: 24
    },
    component: 'RadioGroup',
    value: [],
    componentProps: {
      options: [
        {
          label: t('project.success'),
          value: '0'
        },
        {
          label: t('buyer.action1'),
          value: '2'
        }
        // {
        //   label: '停用',
        //   value: '1'
        // }
      ]
    }
  }
])

const rules = reactive({
  companyName: [required()],
  status: [required()]
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
  return null
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
  <Form :rules="rules" @register="formRegister" :schema="formSchema" class="baseClass" />
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
