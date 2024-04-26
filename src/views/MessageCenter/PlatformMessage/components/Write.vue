<script setup lang="tsx">
import { Form, FormSchema, SelectOption } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { ref, reactive, PropType, watch, onMounted } from 'vue'
import { useValidator } from '@/hooks/web/useValidator'
import { useI18n } from '@/hooks/web/useI18n'
import { ElButton, ElInput, ElMessage, ElTag } from 'element-plus'
import { Icon } from '@/components/Icon'
import UploadImage from '@/components/UploadImage/UploadImage.vue'

const { required } = useValidator()
const { t } = useI18n()

const affixImgUrl = import.meta.env.VITE_IMG_URL

const fileName = ref<any>([])

const preview = () => {
  let temp = affixImgUrl + fileName.value[0].response.data.fileAdder
  let elemIF = document.createElement('iframe')
  elemIF.src = temp
  elemIF.style.display = 'none'
  document.body.appendChild(elemIF)
}

onMounted(async () => {
  const formData = await getFormData()
  if (formData.messageType == 'MESSAGE_TYPE_NOTICE') {
    formMethods.setSchema([
      {
        field: 'fileUrl',
        path: 'remove',
        value: true
      }
    ])
  } else {
    formMethods.setSchema([
      {
        field: 'fileName',
        path: 'remove',
        value: true
      }
    ])
  }
})

watch(
  () => fileName.value,
  async (val) => {
    if (fileName.value.length == 2) {
      fileName.value.shift()
    }

    setValues({
      fileName: fileName.value.length > 0 ? fileName.value[0].name : '',
      fileUrl: fileName.value.length > 0 ? fileName.value[0].response.data.fileAdder : ''
    })
    const elForm = await getElFormExpose()
    const valid = await elForm?.validateField('fileName').catch((err) => {
      console.log(err)
    })
  }
)

const images = ref()
watch(
  () => images.value,
  async (val) => {
    const elForm = await getElFormExpose()
    const valid = await elForm?.validateField('images').catch((err) => {
      console.log(err)
    })
  },
  {
    deep: true
  }
)

const props = defineProps({
  currentRow: {
    type: Object as PropType<any>,
    default: () => null
  },
  messageType: {
    type: String,
    default: () => ''
  },
  pushRangeEnum: {
    type: Array,
    default: () => []
  },
  actionType: {
    type: String,
    default: ''
  }
})

const { formRegister, formMethods } = useForm()
const { setValues, getFormData, getElFormExpose } = formMethods

const formSchema = reactive<FormSchema[]>([
  {
    field: 'title',
    label: t('platformMessage.title'),
    component: 'Input',
    componentProps: {
      style: {
        width: '80%'
      }
    }
  },
  {
    field: 'subTitle',
    label: t('platformMessage.subTitle'),
    component: 'Input',
    componentProps: {
      style: {
        width: '80%'
      }
    }
  },
  {
    field: 'remark',
    label: t('platformMessage.remark'),
    component: 'Input',
    componentProps: {
      type: 'textarea',
      rows: 4,
      placeholder: t('exampleDemo.maxInput') + 200 + t('exampleDemo.word'),
      maxlength: 200,
      showWordLimit: true,
      style: {
        width: '80%'
      }
    }
  },
  {
    field: 'messageType',
    label: t('platformMessage.type'),
    component: 'RadioGroup',
    colProps: {
      span: 12
    },
    value: 'MESSAGE_TYPE_NOTICE',
    componentProps: {
      options: [
        {
          label: t('common.remark8'),
          value: 'MESSAGE_TYPE_NOTICE'
        },
        {
          label: t('common.remark9'),
          value: 'MESSAGE_TYPE_ACTIVITY'
        }
      ],
      on: {
        change: (data: any) => {
          formMethods.setSchema([
            {
              field: 'fileName',
              path: 'remove',
              value: data == 'MESSAGE_TYPE_ACTIVITY' ? true : false
            },
            {
              field: 'fileUrl',
              path: 'remove',
              value: data == 'MESSAGE_TYPE_NOTICE' ? true : false
            }
          ])
        }
      }
    }
  },
  {
    field: 'images',
    label: t('platformMessage.img'),
    colProps: {
      span: 24
    },
    formItemProps: {
      slots: {
        default: (data) => {
          return (
            <>
              <div class="w-100%">
                <UploadImage
                  limit={1}
                  v-model={images.value}
                  onUpdateImgUrl={(val) => {
                    data.images = val
                  }}
                ></UploadImage>
                <div class="color-colorGray">{t('auth.IdCardsTips')}</div>
              </div>
            </>
          )
        }
      }
    }
  },
  {
    field: 'pushRange',
    label: t('platformMessage.range'),
    component: 'CheckboxGroup',
    colProps: {
      span: 12
    },
    componentProps: {
      options: props.pushRangeEnum
    }
  },
  {
    field: 'fileUrl',
    label: t('platformMessage.url'),
    component: 'Input',
    remove: props.currentRow?.messageType == 'MESSAGE_TYPE_NOTICE',
    componentProps: {
      style: {
        width: '80%'
      }
    }
  },
  {
    field: 'fileName',
    label: t('platformMessage.file'),
    remove: props.currentRow?.messageType == 'MESSAGE_TYPE_ACTIVITY',
    formItemProps: {
      slots: {
        default: (data: any) => {
          if (fileName.value.length != 0) {
            return (
              <>
                <div class="flex-c">
                  <Icon icon="ep:link" />
                  <span>{fileName.value[0]?.name}</span>
                  <UploadImage
                    limit={2}
                    v-model={fileName.value}
                    class="customClass"
                    showCenter={false}
                  ></UploadImage>
                  {/* <span class="ml-10px colorMain cursor-pointer" onClick={preview}>
                    {t('platformMessage.view')}
                  </span> */}
                </div>
              </>
            )
          } else {
            return (
              <>
                <div class="flex-c">
                  <span>{fileName.value[0]?.name}</span>
                  <UploadImage
                    limit={2}
                    v-model={fileName.value}
                    class="customClass"
                    showCenter={false}
                  ></UploadImage>
                </div>
              </>
            )
          }
        }
      }
    }
  }
])

const rules = reactive({
  title: [required()],
  subTitle: [required()],
  remark: [required()],
  messageType: [required()],
  pushRange: [required()],
  fileUrl: [required()],
  images: [required()],
  fileName: [required()]
})

const submit = async () => {
  const elForm = await getElFormExpose()
  const valid = await elForm?.validate().catch((err) => {
    console.log(err)
  })
  if (valid) {
    const formData = await getFormData()
    if (formData.messageType == 'MESSAGE_TYPE_NOTICE') {
      formData.fileUrl = fileName.value[0].response.data.fileAdder
    }
    formData.pushRange = formData.pushRange + ''
    return formData
  }
}

watch(
  () => props.currentRow,
  (currentRow) => {
    if (!currentRow) return
    setValues({
      pushRange: currentRow.pushRange.split(','),
      fileUrl: currentRow.fileUrl
    })
    images.value = [{ url: currentRow.images }]

    if (currentRow.messageType == 'MESSAGE_TYPE_NOTICE') {
      fileName.value = [
        {
          name: currentRow.fileName,
          response: {
            data: {
              fileAdder: currentRow.fileUrl
            }
          }
        }
      ]
    }
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
      <div class="text-right w-120px min-w-120px">{{ t('platformMessage.title') }}:</div>
      <div class="ml-15px color-colorBlack">{{ currentRow.title || '-' }}</div>
    </div>
    <div class="flex-c color-#7A7A7A mt-20px font-size-14px">
      <div class="text-right w-120px min-w-120px">{{ t('platformMessage.type') }}:</div>
      <div class="ml-15px color-colorBlack">{{ currentRow.messageTypeStr || '-' }}</div>
    </div>
    <div class="flex-c color-#7A7A7A mt-20px font-size-14px">
      <div class="text-right w-120px min-w-120px">{{ t('platformMessage.remark') }}:</div>
      <div class="ml-15px color-colorBlack">{{ currentRow.remark || '-' }}</div>
    </div>
    <div class="flex-c color-#7A7A7A mt-20px font-size-14px">
      <div class="text-right w-120px min-w-120px">{{ t('platformMessage.time') }}:</div>
      <div class="ml-15px color-colorBlack">{{ currentRow.createTimeStr || '-' }}</div>
    </div>
    <div class="flex-c color-#7A7A7A mt-20px font-size-14px">
      <div class="text-right w-120px min-w-120px">{{ t('platformMessage.range') }}:</div>
      <div class="ml-15px color-colorBlack">{{ currentRow.pushRangeStr || '-' }}</div>
    </div>
    <div class="flex-c color-#7A7A7A mt-20px font-size-14px">
      <div class="text-right w-120px min-w-120px">{{ t('platformMessage.read') }}:</div>
      <div class="ml-15px color-colorBlack">{{ currentRow.readCount || '0' }}</div>
    </div>
    <div class="flex-c color-#7A7A7A mt-20px font-size-14px">
      <div class="text-right w-120px min-w-120px">{{ t('platformMessage.status') }}:</div>
      <el-tag class="ml-15px" :type="currentRow.status == 'PUT_ON_SALE' ? 'success' : 'danger'">{{
        currentRow.statusStr || '-'
      }}</el-tag>
    </div>
  </div>
</template>
<style lang="less" scoped>
:deep(.customClass) {
  .el-upload {
    border: none !important;
  }
  .el-upload--picture-card {
    border: none !important;
    background-color: transparent !important;
    width: auto !important;
    height: auto !important;
  }
  .el-upload-list {
    display: none;
  }
}
</style>
