<template>
  <div>
    <ElUpload
v-if="showVisible" ref="upload" :class="{ hide: hideFlag, hideDelete: onlyView }"
      v-model:fileList="fileList" :action="btnStyle || !complexIs ? requestUrl : skuImportExcel"
      :list-type="showCenter ? 'picture-card' : 'text'" :before-upload="beforeImgUpload" :on-preview="handleImgPreview"
      :on-remove="removeImg" :on-error="errorImg" :on-success="successImg" :on-progress="progressImg" :limit="limitNum"
      :headers="headers" :drag="!complexIs || !dragIs" :show-file-list="complexIs">
      <div v-if="dragIs">
        <div v-if="!avatarShow">
          <ElIcon v-if="showCenter && complexIs">
            <Plus />
          </ElIcon>
          <div v-else-if="!showCenter && btnStyle">
            <div
v-if="fileList.length == 0"
              class="color-#0068E3 cursor-pointer w-95px mr-auto flex mt-3px flex-justify-center h-23px border-(#0068E3 solid 1px) border-rd-6px">
              <div class="flex-c">
                <Icon color="#0068E3" icon="ep:upload" />
                <span class="ml-3px">{{ t('platformMessage.file') }}</span>
              </div>
            </div>
            <div v-else class="colorMain">
              <span class="ml-10px">{{ t('platformMessage.sub') }}</span>
            </div>
          </div>
          <div v-else-if="complexIs == false">
            <div class="text-center pt-20px pb-10px">
              <img src="@/assets/imgs/uploadImage.png" class="w-50px h-50px text-center" />
              <div class="flex text-align">
                <div class="flex-c color-#9b9d9e pl-30px pr-30px">
                  <div class="font-size-13px">{{ t('common.b') }}</div>
                  <ElButton class="ml-10px" size="small" type="info" plain disabled>{{
                    t('image.sub8')
                  }}</ElButton>
                </div>
              </div>
            </div>
          </div>
          <div v-else>
            <ElButton class="mt-10px">{{ t('image.sub8') }}</ElButton>
          </div>
        </div>
        <div v-else>
          <div class="pt-10px colorMain font-size-16px cursor-pointer">{{
            t('common.l')
          }}</div>
        </div>
      </div>
      <div v-else class="p-40px">
        <Icon icon="svg-icon:uploadcloud" :size="50" />
        <div class="el-upload__text">{{ t('image.sub7') }}</div>
        <div class="el-upload__tip">{{ t('image.sub6') }}</div>
      </div>
    </ElUpload>
    <ElDialog v-model="dialogVisible">
      <img class="w-full" :src="dialogImageUrl" alt="Preview Image" />
    </ElDialog>
  </div>
</template>
<script setup lang="tsx">
import { ref, watch, computed, onMounted, nextTick } from 'vue'
import { ElUpload, ElDialog, ElIcon, ElMessage, ElButton } from 'element-plus'
import type { UploadProps, UploadUserFile, UploadInstance } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { deleteImgApi } from '@/api/common'
import { useI18n } from '@/hooks/web/useI18n'
import { useStorage } from '@/hooks/web/useStorage'
const { getStorage } = useStorage('localStorage')
import { outGoLogin } from '@/utils/common'

const { t } = useI18n()
const headers = ref({
  'Boss-Token': getStorage('TOKEN') || '',
  Lang: getStorage('lang') || 'zh'
})
const props = defineProps({
  avatarShow: {
    type: Boolean,
    default: false
  },
  showCenter: {
    type: Boolean,
    default: true
  },
  btnStyle: {
    type: Boolean,
    default: true
  },
  complexIs: {
    type: Boolean,
    default: true
  },
  dragIs: {
    type: Boolean,
    default: true
  },
  //当图片组件可以删除和编辑需要传值limit和v-model
  limit: {
    type: Number,
    default: 1
  },
  modelValue: {
    type: Array,
    default: () => []
  },
  //当图片只能观看时需要传值onlyView和viewImgList和limit
  onlyView: {
    type: Boolean,
    default: false
  },
  nullImgList: {
    type: String,
    default: ''
  },
  viewImgList: {
    type: Array,
    default: () => []
  },
  // 最大多少mb
  maxSize: {
    type: Number,
    default: 10
  },
  onlyNull: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['update:modelValue', 'updateImgUrl'])
const hideFlag = ref(false)
const showVisible = ref(true)
const affixImgUrl = import.meta.env.VITE_IMG_URL
const imgType = computed(() =>
  props.showCenter
    ? 'image/gif, image/jpg, image/jpeg, image/png'
    : 'application/vnd.ms-excel, application/pdf, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/msword'
)
const requestUrl = ref(import.meta.env.VITE_BASE_URL + "/save/file/saveIdImg ")
const skuImportExcel = ref(import.meta.env.VITE_BASE_URL + "/ecSpu/importExcel")
const tempFileList = props.modelValue.map((item: any) => {
  return {
    name: item.name,
    url: affixImgUrl + item.url
  }
})

const upload = ref<UploadInstance>()

const viewImgList = props.viewImgList.map((item: any) => {
  return {
    name: item.name,
    url: affixImgUrl + item.url
  }
})

let nullImgList: any = props.nullImgList.split(',')
if (!nullImgList[0]) {
  nullImgList = []
}
nullImgList = nullImgList.map((item) => {
  return {
    name: new Date().getTime(),
    url: affixImgUrl + item
  }
})

const fileList = ref<UploadUserFile[]>(
  !props.onlyView
    ? props.onlyNull
      ? [...nullImgList]
      : [...(tempFileList as any)]
    : [...viewImgList]
)
const delFileListBefore = ref<UploadUserFile[]>([]) //之前回显的图片
const delFileListAfter = ref<UploadUserFile[]>([]) //后面增加的图片
const beforeImgUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (imgType.value.indexOf(rawFile.type) == -1 || !rawFile.type) {
    props.showCenter ? ElMessage.error(t('uploadImg.imgType')) : ElMessage.error(t('uploadImg.sub'))
    // fileList.value.pop()
    return false
  } else if (rawFile.size / 1024 / 1024 > props.maxSize) {
    ElMessage.error(t('uploadImg.maxSize', { max: props.maxSize }))
    // fileList.value.pop()
    return false
  }
  return true
}
const removeImg: UploadProps['onRemove'] = (uploadFile) => {
  let val = fileList.value.length
  if (val == limitNum.value) {
    hideFlag.value = true
  } else {
    hideFlag.value = false
  }
  if (!props.onlyView) {
    emit('updateImgUrl', getFileList())
    if (!props.onlyNull) {
      emit('update:modelValue', fileList.value)
    }
  }
  if (uploadFile.hasOwnProperty('response')) {
    delFileListAfter.value.push(uploadFile)
  } else {
    delFileListBefore.value.push(uploadFile)
  }
}
const errorImg: UploadProps['onError'] = (uploadFile) => {
  ElMessage.error(t('uploadImg.errMsg'))
  fileList.value.pop()
  if (fileList.value.length == props.limit) {
    hideFlag.value = true
  } else {
    hideFlag.value = false
  }
  return
  emit('update:modelValue', fileList.value)
}
const successImg: UploadProps['onSuccess'] = (uploadFile) => {
  if (uploadFile.code != 200) {
    ElMessage.error(uploadFile.msg)
    fileList.value.pop()
    if (fileList.value.length == props.limit) {
      hideFlag.value = true
    } else {
      hideFlag.value = false
    }
    return
  }
  if (uploadFile.code == 401) {
    outGoLogin()
  }
  let val = fileList.value.length

  if (val == limitNum.value) {
    hideFlag.value = true
  } else {
    hideFlag.value = false
  }

  // if (!props.showCenter) {
  //   if (fileList.value.length == 2) {
  //     fileList.value = fileList.value.splice(1, 1)
  //   }
  // }
  if (!props.onlyView) {
    emit('updateImgUrl', getFileList())
    if (!props.onlyNull) {
      emit('update:modelValue', fileList.value)
    }
  }
}
const progressImg: UploadProps['onProgress'] = () => {
  let val = fileList.value.length
  if (val == limitNum.value) {
    hideFlag.value = true
  } else {
    hideFlag.value = false
  }
}

const dialogVisible = ref(false)
const dialogImageUrl = ref('')
const handleImgPreview: UploadProps['onPreview'] = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url || ''
  dialogVisible.value = true
}
const cancelDelImg = () => {
  fileList.value.forEach((item) => {
    if (item.hasOwnProperty('response')) {
      delFileListAfter.value.push(item)
    }
  })
  let str = ''
  delFileListAfter.value.forEach((item: any) => {
    str += item.response.data.url.split(affixImgUrl)[1] + ','
  })
  str = str.substring(0, str.length - 1)
  if (!str) {
    return
  }
  deleteImgApi({ address: str })
}
const submitDelImg = () => {
  let str = ''
  delFileListAfter.value.forEach((item: any) => {
    str += item.response.data.url.split(affixImgUrl)[1] + ','
  })
  delFileListBefore.value.forEach((item: any) => {
    str += item.url.split(affixImgUrl)[1] + ','
  })
  str = str.substring(0, str.length - 1)
  if (!str) {
    return
  }
  deleteImgApi({ address: str })
}
const getFileList = () => {
  if (props.btnStyle) {
    let str = ''
    fileList.value.forEach((item: any) => {
      if (item.hasOwnProperty('response')) {
        str += item.response.data.url.split(affixImgUrl)[1] + ','
      } else {
        str += item.url.split(affixImgUrl)[1] + ','
      }
    })
    str = str.substring(0, str.length - 1)
    return str
  } else {
    return fileList.value[0].response
  }
}
const printf = () => {
  console.log(fileList.value, delFileListBefore.value, delFileListAfter.value)
}
const limitNum = computed(() => {
  return props.limit as any as number
})
// watch(
//   () => fileList.value.length,
//   (val) => {
//     if (val == limitNum.value) {
//       hideFlag.value = true
//     } else {
//       hideFlag.value = false
//     }
//     emit('update:modelValue', fileList.value)
//   }
// )
watch(
  () => props.nullImgList,
  (val) => {
    if (val == '') {
      fileList.value = []
      hideFlag.value = false
    }
  }
)
watch(
  () => props.modelValue.length,
  (val) => {
    if (val > fileList.value.length && !props.onlyView) {
      let tempFileList = props.modelValue.map((item: any) => {
        return {
          name: item.name,
          url: affixImgUrl + item.url
        }
      })
      fileList.value = [...tempFileList]
    } else if (!props.onlyView && val < fileList.value.length) {
      fileList.value = [...props.modelValue] as any
    }
    if (fileList.value.length == limitNum.value) {
      hideFlag.value = true
    } else {
      hideFlag.value = false
    }
  }
)
onMounted(() => {
  if (
    props.modelValue.length == props.limit ||
    props.viewImgList.length == props.limit ||
    props.nullImgList
  ) {
    hideFlag.value = true
  }
})
defineExpose({
  cancelDelImg, //取消时删除图片
  submitDelImg, //提交时删除图片
  getFileList //得到文件列表
})
</script>
<style lang="less">
.el-upload {
  position: relative;
  overflow: hidden;
  cursor: pointer;
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  // transition: var(--el-transition-duration-fast);
}

.el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  width: 178px;
  height: 178px;
  font-size: 28px;
  color: #8c939d;
  text-align: center;
}

.hide .el-upload--picture-card {
  display: none;
}

.hideDelete {
  .el-upload-list__item-delete {
    display: none !important;
  }
}
</style>
