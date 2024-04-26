<script setup lang="tsx">
import { Form, FormSchema } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { computed, reactive, watch, ref, unref, nextTick } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import { ElImage, ElButton } from 'element-plus'
import { useValidator } from '@/hooks/web/useValidator'
import UploadImage from '@/components/UploadImage/UploadImage.vue'
import Write from './ChoosMer.vue'
import { Dialog } from '@/components/Dialog'

const { t } = useI18n()
const { required, validNumber } = useValidator()

const Allschema = computed(() => {
  return props.actionType == 'repwd' ? baseSchema : formSchema
})

const baseSchema = reactive<FormSchema[]>([
  {
    field: 'newPwd',
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

const props = defineProps({
  currentRow: {
    type: Object as any,
    default: () => {
      return {
        status: -1
      }
    }
  },
  bannerTypeEnum: {
    type: Object as any,
    default: () => {}
  },
  belongTypeEnum: {
    type: Object as any,
    default: () => {}
  },
  goodsStatusEnum: {
    type: Object as any,
    default: () => {}
  },
  actionType: {
    type: String,
    default: ''
  }
})

const bannerImg = ref()
const openType = ref()

const formSchema = reactive<FormSchema[]>([
  {
    field: 'bannerName',
    label: t('RotationChart.name'),
    component: 'Input',
    componentProps: {
      maxlength: 30,
      showWordLimit: true,
      style: {
        width: '100%'
      }
    }
  },
  {
    field: 'bannerImg',
    label: t('RotationChart.name1'),
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
                  v-model={bannerImg.value}
                  onUpdateImgUrl={(val) => {
                    data.bannerImg = val
                  }}
                ></UploadImage>
              </div>
              <div class="el-upload__tip">{t('RotationChart.sub6')}</div>
            </>
          )
        }
      }
    }
  },
  {
    field: 'bannerType',
    label: t('RotationChart.sub3'),
    component: 'RadioGroup',
    value: 'BANNER_TYPE_GOODS',
    componentProps: {
      options: props.bannerTypeEnum,
      on: {
        change: (data: any) => {
          formMethods.setSchema([
            {
              field: 'targetUrl',
              path: 'remove',
              value: data != 'BANNER_TYPE_OTHER' ? true : false
            },
            {
              field: 'relevancyName1',
              path: 'remove',
              value: data != 'BANNER_TYPE_GOODS' ? true : false
            },
            {
              field: 'relevancyName2',
              path: 'remove',
              value: data != 'BANNER_TYPE_STORE' ? true : false
            }
          ])
        }
      }
    }
  },
  {
    field: 'targetUrl',
    label: t('RotationChart.address'),
    component: 'Input',
    componentProps: {},
    remove: props.currentRow.bannerType != 'BANNER_TYPE_OTHER' ? true : false
  },
  {
    field: 'relevancyName1',
    label: t('RotationChart.sub1'),
    component: 'Input',
    componentProps: {
      on: {
        click: (data: any) => {
          openType.value = 'relevancyId1'
          dialogTitle.value = t('RotationChart.sub1')

          dialogVisible.value = true
          nextTick(async () => {
            if (writeRef.value) {
              await writeRef.value.toggleSelection(props.currentRow.relevancyId)
            }
          })
        }
      }
    }
  },
  {
    field: 'relevancyName2',
    label: t('RotationChart.sub4'),
    component: 'Input',
    componentProps: {
      on: {
        click: (data: any) => {
          openType.value = 'relevancyId2'
          dialogTitle.value = t('RotationChart.sub4')

          dialogVisible.value = true
          nextTick(async () => {
            if (writeRef.value) {
              await writeRef.value.toggleSelection(props.currentRow.relevancyId)
            }
          })
        }
      }
    },
    remove: props.currentRow.bannerType != 'BANNER_TYPE_STORE' ? true : false
  },
  {
    field: 'sort',
    label: t('RotationChart.sort'),
    component: 'Input',
    componentProps: {}
  },
  {
    field: 'belongPlatform',
    label: t('RotationChart.plat1'),
    component: 'Select',
    componentProps: {
      options: props.belongTypeEnum
    }
  }
])

const rules = reactive({
  bannerName: [required()],
  bannerImg: [required()],
  bannerType: [required()],
  targetUrl: [required()],
  relevancyId1: [required()],
  relevancyId2: [required()],
  relevancyName1: [required()],
  relevancyName2: [required()],
  sort: [required(), validNumber()],
  belongPlatform: [required()]
})

const { formRegister, formMethods } = useForm()
const { setValues, getFormData, getElFormExpose } = formMethods
const writeRef = ref()

watch(
  () => props.currentRow,
  async (currentRow) => {
    if (!currentRow) return
    setValues(currentRow)
    bannerImg.value = [{ url: currentRow.bannerImg }]
    if (currentRow.bannerType == 'BANNER_TYPE_GOODS') {
      setValues({ relevancyId1: currentRow.relevancyId, relevancyName1: currentRow.relevancyName })
    }
    if (currentRow.bannerType == 'BANNER_TYPE_STORE') {
      setValues({ relevancyId2: currentRow.relevancyId, relevancyName2: currentRow.relevancyName })
    }

    formMethods.setSchema([
      {
        field: 'targetUrl',
        path: 'remove',
        value: currentRow.bannerType != 'BANNER_TYPE_OTHER' ? true : false
      },
      {
        field: 'relevancyName1',
        path: 'remove',
        value: currentRow.bannerType != 'BANNER_TYPE_GOODS' ? true : false
      },
      {
        field: 'relevancyName2',
        path: 'remove',
        value: currentRow.bannerType != 'BANNER_TYPE_STORE' ? true : false
      }
    ])
  },
  {
    deep: true,
    immediate: true
  }
)

const submit = async () => {
  const write = unref(writeRef)
  let chooseItem = await write?.multipleSelection
  if (chooseItem.length > 1) {
    chooseItem = [chooseItem[chooseItem.length - 1]]
  }
  if (chooseItem.length == 1) {
    if (openType.value == 'relevancyId1') {
      formMethods.setValues({
        relevancyId1: chooseItem[0].id,
        relevancyName1: chooseItem[0].name,
        openType: 'relevancyId1'
      })
    }
    if (openType.value == 'relevancyId2') {
      formMethods.setValues({
        relevancyId2: chooseItem[0].id,
        relevancyName2: chooseItem[0].storeName,
        openType: 'relevancyId2'
      })
    }

    dialogVisible.value = false
    return chooseItem
  }
}

const save = async () => {
  const elForm = await getElFormExpose()
  const valid = await elForm?.validate().catch((err) => {
    console.log(err)
  })
  if (valid) {
    const formData = await getFormData()
    return formData
  }
}

const imgUrl = import.meta.env.VITE_IMG_URL

const dialogVisible = ref(false)
const dialogTitle = ref('')

defineExpose({
  submit,
  save
})
</script>

<template>
  <div v-if="actionType != 'view'">
    <Form @register="formRegister" :rules="rules" :schema="Allschema" :isCol="false" />
  </div>
  <div v-else>
    <div class="flex-c color-#7A7A7A font-size-14px">
      <div class="text-right w-120px min-w-120px">{{ t('RotationChart.name') }}:</div>
      <div class="ml-15px color-colorBlack">{{ currentRow.bannerName || '-' }}</div>
    </div>
    <div class="flex-c mt-20px color-#7A7A7A font-size-14px">
      <div class="text-right w-120px min-w-120px">{{ t('RotationChart.name1') }}:</div>
      <div class="ml-15px color-colorBlack cursor-pointer">
        <!-- <div @click="clickImage(imgUrl + currentRow.bannerImg)"> -->
        <ElImage
          :src="imgUrl + currentRow.bannerImg"
          :preview-src-list="[imgUrl + currentRow.bannerImg]"
          style="width: 110px; height: 110px"
        />
        <!-- </div> -->
      </div>
    </div>
    <div class="flex-c mt-20px color-#7A7A7A font-size-14px">
      <div class="text-right w-120px min-w-120px">{{ t('RotationChart.sub3') }}:</div>
      <div class="ml-15px color-colorBlack">{{ currentRow.bannerTypeStr || '-' }}</div>
    </div>
    <div
      class="flex-c mt-20px color-#7A7A7A font-size-14px"
      v-if="currentRow.bannerType == 'BANNER_TYPE_OTHER'"
    >
      <div class="text-right w-120px min-w-120px">{{ t('RotationChart.address') }}:</div>
      <div class="ml-15px color-colorBlack">
        {{ currentRow.targetUrl || '-' }}
      </div>
    </div>
    <div
      class="flex-c mt-20px color-#7A7A7A font-size-14px"
      v-else-if="currentRow.bannerType == 'BANNER_TYPE_GOODS'"
    >
      <div class="text-right w-120px min-w-120px">{{ t('RotationChart.sub1') }}:</div>
      <div class="ml-15px color-colorBlack">
        {{ currentRow.relevancyName || '-' }}
      </div>
    </div>
    <div
      class="flex-c mt-20px color-#7A7A7A font-size-14px"
      v-else-if="currentRow.bannerType == 'BANNER_TYPE_STORE'"
    >
      <div class="text-right w-120px min-w-120px">{{ t('RotationChart.sub4') }}:</div>
      <div class="ml-15px color-colorBlack">
        {{ currentRow.relevancyName || '-' }}
      </div>
    </div>
    <div class="flex-c mt-20px color-#7A7A7A font-size-14px">
      <div class="text-right w-120px min-w-120px">{{ t('RotationChart.sort') }}:</div>
      <div class="ml-15px color-colorBlack">{{ currentRow.sort || '-' }}</div>
    </div>
    <div class="flex-c mt-20px color-#7A7A7A font-size-14px">
      <div class="text-right w-120px min-w-120px">{{ t('RotationChart.plat1') }}:</div>
      <div class="ml-15px color-colorBlack">{{ currentRow.belongPlatformStr || '-' }}</div>
    </div>
  </div>
  <Dialog v-model="dialogVisible" :title="dialogTitle">
    <Write ref="writeRef" :openType="openType" :goodsStatusEnum="goodsStatusEnum" />
    <template #footer>
      <!-- <ElButton class="w-70px !h-40px" @click="dialogVisible = false">{{
        t('project.cancel')
      }}</ElButton> -->
      <ElButton @click="submit" class="w-70px !h-40px" type="primary">{{
        t('project.confirm')
      }}</ElButton>
    </template>
  </Dialog>
</template>
