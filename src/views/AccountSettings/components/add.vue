<script setup lang="tsx">
import { Form, FormSchema } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { PropType, reactive, watch, ref } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import { ElMessage } from 'element-plus'
import { InputPassword } from '@/components/InputPassword'
import { useValidator } from '@/hooks/web/useValidator'
const { required, validPWD } = useValidator()

const { t } = useI18n()

const password = ref('')
const formSchema = reactive<FormSchema[]>([
  {
    field: 'oldPwd',
    label: t('accountSettings.sub1'),
    component: 'InputPassword',
    colProps: {
      span: 24
    },
    componentProps: {
      style: {
        width: '400px'
      }
    }
  },
  {
    field: 'newPwd1',
    label: t('accountSettings.sub2'),
    component: 'InputPassword',
    colProps: {
      span: 24
    },
    componentProps: {
      style: {
        width: '400px'
      }
    }
  },
  {
    field: 'newPwd2',
    label: t('accountSettings.sub3'),
    component: 'InputPassword',
    colProps: {
      span: 24
    },
    componentProps: {
      style: {
        width: '400px'
      }
    }
  }
])

const validateCopy = async (rule, value, callback) => {
  const formData = await getFormData()
  if (value != formData.newPwd1) {
    callback(new Error(t('common.isEqual')))
  } else {
    callback()
  }
}

const rules = reactive({
  oldPwd: [required()],
  newPwd1: [required(), validPWD()],
  newPwd2: [required(), validPWD(), { validator: validateCopy, trigger: 'blur' }]
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
