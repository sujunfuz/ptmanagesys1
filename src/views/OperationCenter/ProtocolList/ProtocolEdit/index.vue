<script setup lang="tsx">
import { ContentWrap } from '@/components/ContentWrap'
import { Editor, EditorExpose } from '@/components/Editor'
import { useI18n } from '@/hooks/web/useI18n'
import { IDomEditor } from '@wangeditor/editor'
import { PropType, ref, onMounted, unref, reactive, watch } from 'vue'
import { Form, FormSchema } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import UploadImage from '@/components/UploadImage/UploadImage.vue'
import { ElCol, ElRow, ElButton, ElMessage } from 'element-plus'
import { useValidator } from '@/hooks/web/useValidator'
import { useRouter } from 'vue-router'
import {
  getPageTopApi,
  addDataListApi,
  editDataListApi,
  deleteDataListApi,
  getPageListByIdApi
} from '@/api/operationCenter/protocolList'
import { setupElementPlus } from '@/plugins/elementPlus'
import { Icon } from '@/components/Icon'
import { useStorage } from '@/hooks/web/useStorage'
import wordIcon from '@/assets/imgs/wordIcon.png'
const { getStorage } = useStorage('localStorage')
const { t } = useI18n()
const { formRegister, formMethods } = useForm()

const content = ref('')
const change = (editor: IDomEditor) => {
  content.value = editor.getHtml()
}

const editorRef = ref<typeof Editor & EditorExpose>()

const defaultHtml = ref('')

// onMounted(async () => {
//   const editor = await unref(editorRef)?.getEditorRef()
//   console.log(editor)
// })

const typeOpen = ref()

const belongTypeEnum = ref()
const protocolTypeEnum = ref()
onMounted(async () => {
  const res = await getPageTopApi()

  if (res.code == 200) {
    belongTypeEnum.value = res.data.belongTypeEnum
    protocolTypeEnum.value = res.data.protocolTypeEnum
  }
  await getDataId()
})

const getDataId = async () => {
  if (currentRoute.value.query.id) {
    typeOpen.value = 'edit'
    const res = await getPageListByIdApi(currentRoute.value.query.id)
    await formMethods.setValues(res.data)
    fileUrlSize.value = res.data.fileSize
    fileUrl.value = [
      {
        name: res.data.fileName,
        response: {
          data: {
            fileAdder: res.data.fileUrl
          }
        }
      }
    ]
    defaultHtml.value = res.data.content
  } else {
    typeOpen.value = 'add'
  }
}

const fileUrl = ref<any>([])
const fileUrlSize = ref()

watch(
  () => fileUrl.value,
  async (val) => {
    await setValues({
      fileName: fileUrl.value.length == 0 ? '' : fileUrl.value[0].name,
      fileUrl: fileUrl.value.length == 0 ? '' : fileUrl.value[0].response.data.fileAdder
    })
    if (fileUrl.value[0].size) {
      fileUrlSize.value = Math.round(fileUrl.value[0]?.size / 1024) / 100 + ''
    }
    console.log(fileUrlSize.value)
  }
)

const baseSchema = ref<FormSchema[]>([
  {
    field: 'belongPlatform',
    label: t('protocolList.sub1'),
    component: 'Select',
    colProps: {
      span: 24
    },
    componentProps: {
      style: {
        width: '100%'
      },
      filterable: true,
      options: belongTypeEnum
    }
  },
  {
    field: 'protocolName',
    label: t('protocolList.sub2'),
    component: 'Input',
    colProps: {
      span: 24
    },
    componentProps: {
      maxlength: 180,
      showWordLimit: true
    }
  },
  {
    field: 'protocolType',
    label: t('protocolList.sub3'),
    component: 'Select',
    colProps: {
      span: 24
    },
    componentProps: {
      style: {
        width: '100%'
      },
      filterable: true,
      options: protocolTypeEnum
    }
  }
  // {
  //   field: 'fileUrl',
  //   label: t('protocolList.sub5'),
  //   colProps: {
  //     span: 24
  //   },
  //   componentProps: {
  //     style: {
  //       width: '100%'
  //     }
  //   },
  //   formItemProps: {
  //     slots: {
  //       default: (data: any) => {
  //         if (fileUrl.value.length != 0) {
  //           return (
  //             <>
  //               <div class="flex-b flex-items-center w-100%">
  //                 <div class="flex-c">
  //                   <img src={wordIcon} class="w-50px h-50px text-center" />
  //                   <div class="mt-5px">
  //                     <div>{fileUrl.value[0]?.name}</div>
  //                     <div class="mt--8px color-#b1b3b8">{fileUrlSize.value}kb</div>
  //                   </div>
  //                 </div>
  //                 <div class="text-right cursor-pointer" onClick={() => (fileUrl.value = [])}>
  //                   <Icon icon="ep:delete" color="#b1b3b8" />
  //                 </div>
  //               </div>
  //             </>
  //           )
  //         } else {
  //           return (
  //             <>
  //               <div class="flex-c w-100%">
  //                 <UploadImage
  //                   limit={2}
  //                   class="w-100%"
  //                   v-model={fileUrl.value}
  //                   showCenter={false}
  //                   btnStyle={false}
  //                   complexIs={false}
  //                 ></UploadImage>
  //               </div>
  //             </>
  //           )
  //         }
  //       }
  //     }
  //   }
  // }
])

const { required } = useValidator()

const rules = reactive<any>({
  typeId: [required()],
  title: [required()],
  author: [required()],
  status: [required()]
})

const saveLoading = ref(false)

const { push, currentRoute } = useRouter()

const { getFormData, getElFormExpose, setValues } = formMethods

const save = async () => {
  const elForm = await getElFormExpose()
  const valid = await elForm?.validate().catch((err) => {
    console.log(err)
  })
  if (valid) {
    const formData = await getFormData()
    formData.content = content.value

    formData.fileName = fileUrl.value[0]?.name || ''
    formData.fileSize = fileUrlSize.value || 0 + ''

    let res
    if (typeOpen.value == 'add') {
      res = await addDataListApi(formData)
    } else {
      res = await editDataListApi(formData)
    }
    if (res.data == null) {
      ElMessage.success(t('common.operateSuccess'))
    } else {
      ElMessage.error(res.msg)
    }
    push('/operationCenter/protocolList')
  }
}
const bossToken = getStorage('TOKEN')

const editorConfig = ref<any>({
  readOnly: false,
  MENU_CONF: {
    uploadImage: {
      server: import.meta.env.VITE_BASE_URL +"/save/file/richTextImgUpload",
      // 超时时间，默认为 10 秒
      headers: {
        'Boss-Token': bossToken
      },
      timeout: 30 * 1000, // 5s
      fieldName: 'file',
      maxFileSize: 10 * 1024 * 1024, // 10M
      base64LimitSize: 5 * 1024, // insert base64 format, if file's size less than 5kb
      // 选择文件时的类型限制，默认为 ['image/*'] 。如不想限制，则设置为 []
      allowedFileTypes: ['image/*'],
      // 最多可上传几个文件，默认为 100
      maxNumberOfFiles: 5,
      onBeforeUpload(file) {
        return file // will upload this file
      },
      onProgress(progress) {},
      onSuccess(file, res) {},
      onFailed(file, res) {},
      onError(file, err, res) {}
    },
    uploadVideo: {
      server: '/shopmp/save/file/saveIdImg',
      fieldName: 'file',
      maxFileSize: 5 * 1024 * 1024, // 5M
      maxNumberOfFiles: 3,
      allowedFileTypes: ['video/*'],
      timeout: 30 * 1000, // 15 秒
      onBeforeUpload() {
        ElMessage.warning(t('common.a24'))
        return false
      }
    }
  }
})
</script>

<template>
  <ContentWrap :message="t('richText.richTextDes')">
    <el-row :gutter="20">
      <el-col :span="16">
        <Editor
          v-model="defaultHtml"
          :editor-config="editorConfig"
          ref="editorRef"
          @change="change"
        />
      </el-col>
      <el-col :span="8"
        ><Form
          class="ml-10px baseClass"
          :rules="rules"
          @register="formRegister"
          :schema="baseSchema"
        />
      </el-col>
    </el-row>
    <div class="text-right mr-15px mt-20px">
      <ElButton @click="push('/OperationCenter/protocolList')">{{ t('project.cancel') }}</ElButton>
      <ElButton type="primary" :loading="saveLoading" @click="save">
        {{ t('project.save') }}
      </ElButton>
    </div>
  </ContentWrap>
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
