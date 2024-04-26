<script setup lang="tsx">
import { Form, FormSchema } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { PropType, reactive, watch, ref } from 'vue'
import { useValidator } from '@/hooks/web/useValidator'
import { useI18n } from '@/hooks/web/useI18n'
import { ElMessage } from 'element-plus'
import UploadImage from '@/components/UploadImage/UploadImage.vue'

const { t } = useI18n()

const { required } = useValidator()

const props = defineProps({
  currentRow: {
    type: Object as PropType<any>,
    default: () => null
  }
})

const imgArr = ref([])

const formSchema = reactive<FormSchema[]>([
  {
    field: 'licenseTerm',
    label: t('merchantDetail.period'),
    component: 'DatePicker',
    componentProps: {
      format: 'YYYY/MM/DD',
      valueFormat: 'YYYY-MM-DD',
      type: 'daterange',
      style: {
        width: '100%'
      }
    },
    formItemProps: {
      rules: [required()]
    },
    colProps: {
      span: 17
    }
  },
  {
    field: 'licenseImages',
    label: t('companyInformationEdit1.sub3'),
    colProps: {
      span: 24
    },
    formItemProps: {
      rules: [required()],
      slots: {
        default: (data: any) => {
          return (
            <>
              <UploadImage
                limit={1}
                onUpdateImgUrl={(val) => {
                  data.licenseImages = val
                }}
                v-model={imgArr.value}
              />
              <div class="color-colorGray font-size-13px w-600px">{t('auth.licenseImgTips')}</div>
            </>
          )
        }
      }
    }
  }
])

const rules = reactive({
  name: [required()],
  address: [required()],
  detail: [required()],
  code: [required()],
  contacts: [required()],
  iphone1: [required()]
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
    setValues({
      licenseTerm: currentRow.licenseTerm,
      licenseImages: currentRow.licenseImages
    })
    imgArr.value = [{ url: currentRow.licenseImages }]
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
