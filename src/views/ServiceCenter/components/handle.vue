<script setup lang="tsx">
import { Form, FormSchema } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { PropType, reactive, watch, ref, computed } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import { ElMessage } from 'element-plus'
import { InputPassword } from '@/components/InputPassword'
import { useValidator } from '@/hooks/web/useValidator'
import UploadImage from '@/components/UploadImage/UploadImage.vue'

const { required, validPWD, validMobile } = useValidator()

const { t } = useI18n()

const password = ref('')
const num = computed(
  () => t('serviceCenter.voucher') + '(' + questionImages.value.length + '/6' + ')'
)

const props = defineProps({
  openType: {
    type: String,
    default: ''
  }
})

const questionImages = ref([])
const img1Ref = ref()
watch(
  () => questionImages.value.length,
  async () => {
    await formMethods.setValues({
      questionImages: img1Ref.value.getFileList()
    })
    const formEl = await formMethods.getElFormExpose()
    await formEl?.validateField(['questionImages'])
  }
)

const formSchema = reactive<FormSchema[]>([
  {
    field: 'questionDetail',
    label: t('serviceDetail.remark'),
    component: 'Input',
    colProps: {
      span: 19
    },
    componentProps: {
      placeholder: t('serviceCenter.placeHodler1'),
      type: 'textarea',
      rows: 4
    }
  },
  {
    field: 'questionImages',
    label: num,
    formItemProps: {
      style: {
        width: '100%'
      },
      slots: {
        default: () => {
          return (
            <>
              <div>
                <UploadImage limit={6} v-model={questionImages.value} ref={img1Ref}></UploadImage>
                <div class="color-colorGray font-size-13px w-600px">
                  {t('companyInformationEdit1.sub11')}
                </div>
              </div>
            </>
          )
        }
      }
    }
  }
])

const rules = reactive({
  questionDetail: [required()]
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
