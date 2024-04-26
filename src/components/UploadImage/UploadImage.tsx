import { defineComponent, ref, watch, computed, defineExpose } from 'vue'
import { ElUpload, ElDialog, ElIcon, ElMessage } from 'element-plus'
import type { UploadProps, UploadUserFile } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { number } from 'vue-types'
import './UploadImage.less'
import { deleteImgApi } from '@/api/common'
export default defineComponent({
  props: {
    limit: {
      type: number,
      default: 1
    },
    imgList: {
      type: Array,
      default: () => []
    }
  },
  setup(props) {
    const affixImgUrl = import.meta.env.VITE_IMG_URL
    const imgType = 'image/gif, image/jpg, image/jpeg, image/png'
    const tempFileList = props.imgList.map((item: any) => {
      return {
        name: item.name,
        url: affixImgUrl + item.url
      }
    })
    const fileList = ref<UploadUserFile[]>([...(tempFileList as any)])
    const delFileListBefore = ref<UploadUserFile[]>([]) //之前回显的图片
    const delFileListAfter = ref<UploadUserFile[]>([]) //后面增加的图片
    const beforeImgUpload: UploadProps['beforeUpload'] = (rawFile) => {
      if (imgType.indexOf(rawFile.type) == -1) {
        ElMessage.error(
          'Avatar picture must be image/gif, image/jpg, image/jpeg, image/png format!'
        )
        return false
      } else if (rawFile.size / 1024 / 1024 > 10) {
        ElMessage.error('Avatar picture size can not exceed 10MB!')
        return false
      }
      return true
    }
    const removeImg: UploadProps['onRemove'] = (uploadFile) => {
      if (uploadFile.hasOwnProperty('response')) {
        delFileListAfter.value.push(uploadFile)
      } else {
        delFileListBefore.value.push(uploadFile)
      }
    }
    const dialogVisible = ref(false)
    const dialogImageUrl = ref('')
    const handleImgPreview: UploadProps['onPreview'] = (uploadFile) => {
      dialogImageUrl.value = uploadFile.url!
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
      deleteImgApi({ address: str })
    }
    const getFileList = () => {
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
    }
    const printf = () => {
      console.log(fileList.value, delFileListBefore.value, delFileListAfter.value)
    }
    const hideFlag = ref(false)
    const limitNum = computed(() => {
      return props.limit as any as number
    })
    watch(
      () => fileList.value.length,
      (val) => {
        if (val == limitNum.value) {
          hideFlag.value = true
        } else {
          hideFlag.value = false
        }
      }
    )
    defineExpose({
      cancelDelImg, //取消时删除图片
      submitDelImg, //提交时删除图片
      getFileList //得到文件列表
    })
    return () => (
      <>
        <ElUpload
          class={{
            hide: hideFlag.value
          }}
          v-model:fileList={fileList.value}
          action="http://192.168.110.188:8998/file/upload"
          list-type="picture-card"
          beforeUpload={beforeImgUpload}
          onPreview={handleImgPreview}
          onRemove={removeImg}
          limit={limitNum.value}
        >
          <ElIcon>
            <Plus></Plus>
          </ElIcon>
        </ElUpload>
        <ElDialog v-model={dialogVisible.value}>
          <img class="w-full" src={dialogImageUrl.value} alt="Preview Image" />
        </ElDialog>
      </>
    )
  }
})
