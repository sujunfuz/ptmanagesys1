<script setup lang="ts">
import { onBeforeUnmount, computed, PropType, unref, nextTick, ref, watch, shallowRef } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { IDomEditor, IEditorConfig, i18nChangeLanguage } from '@wangeditor/editor'
import { propTypes } from '@/utils/propTypes'
import { isNumber } from '@/utils/is'
import { ElMessage } from 'element-plus'
import { useLocaleStore } from '@/store/modules/locale'

const localeStore = useLocaleStore()

const currentLocale = computed(() => localeStore.getCurrentLocale)

// let lang:any = ''
// if(currentLocale.value == 'zh'){
//   lang = 'zh-CN'
// } else {
//   lang = currentLocale.value
// }
i18nChangeLanguage(unref(currentLocale).lang == 'zh' ? 'zh-CN' : unref(currentLocale).lang)

const props = defineProps({
  editorId: propTypes.string.def('wangeEditor-1'),
  height: propTypes.oneOfType([Number, String]).def('500px'),
  editorConfig: {
    type: Object as PropType<IEditorConfig>,
    default: () => undefined,
    editorConfig: {
      readOnly: false,
      MENU_CONF: {
        //上传参考https://www.wangeditor.com/v5/menu-config.html#%E5%9F%BA%E6%9C%AC%E9%85%8D%E7%BD%AE
        uploadImage: {
          server: `/shopmp/save/file/saveIdImg`,
          // 超时时间，默认为 10 秒
          timeout: 30 * 1000, // 5s
          fieldName: 'file',
          // 将 meta 拼接到 url 参数中，默认 false
          metaWithUrl: false, // join params to url
          // 自定义上传参数，例如传递验证的 token 等。参数会被添加到 formData 中，一起上传到服务端。
          meta: { dataKey: 0, bizType: 'common' },
          // 自定义增加 http  header
          // headers: {
          //   Accept: "text/x-json",
          //   otherKey: "xxx"
          // },
          // 跨域是否传递 cookie ，默认为 false
          withCredentials: true,
          // 自定义增加 http  header
          // headers: {
          //   Accept: "text/x-json",
          //   otherKey: "xxx"
          // },
          maxFileSize: 10 * 1024 * 1024, // 10M
          base64LimitSize: 5 * 1024, // insert base64 format, if file's size less than 5kb
          // 选择文件时的类型限制，默认为 ['image/*'] 。如不想限制，则设置为 []
          allowedFileTypes: ['image/*'],
          // 最多可上传几个文件，默认为 100
          maxNumberOfFiles: 30,
          onBeforeUpload(file) {
            console.log('onBeforeUpload', file)

            return file // will upload this file
            // return false // prevent upload
          },
          onProgress(progress) {
            console.log('onProgress', progress)
          },
          onSuccess(file, res) {
            console.log('onSuccess', file, res)
          },
          onFailed(file, res) {
            alert(res.message)
            console.log('onFailed', file, res)
          },
          onError(file, err, res) {
            alert(err.message)
            console.error('onError', file, err, res)
          }
        },
        uploadVideo: {
          server: '/shopmp/save/file/saveIdImg',
          fieldName: 'file',
          // 单个文件的最大体积限制，默认为 10M
          maxFileSize: 5 * 1024 * 1024, // 5M
          // 最多可上传几个文件，默认为 5
          maxNumberOfFiles: 3,
          // 选择文件时的类型限制，默认为 ['video/*'] 。如不想限制，则设置为 []
          allowedFileTypes: ['video/*'],
          // 自定义上传参数，例如传递验证的 token 等。参数会被添加到 formData 中，一起上传到服务端。
          meta: { dataKey: 0, bizType: 'video' },
          // 将 meta 拼接到 url 参数中，默认 false
          metaWithUrl: false,
          // 自定义增加 http  header
          // headers: {
          //   Accept: "text/x-json",
          //   otherKey: "xxx"
          // },
          // 跨域是否传递 cookie ，默认为 false
          withCredentials: true,
          // 超时时间，默认为 30 秒
          timeout: 30 * 1000, // 15 秒
          // 上传进度的回调函数
          onProgress(progress) {
            console.log('progress', progress)
          },
          // 单个文件上传成功之后
          onSuccess(file, res) {
            console.log(`${file.name} 上传成功`, res)
          },
          // 单个文件上传失败
          onFailed(file, res) {
            console.log(`${file.name} 上传失败`, res)
          },
          // 上传错误，或者触发 timeout 超时
          onError(file, err, res) {
            console.log(`${file.name} 上传出错`, err, res)
          }
        }
      }
    },
    modeCss: 'default' // or 'simple'
  },
  modelValue: propTypes.string.def('')
})

const emit = defineEmits(['change', 'update:modelValue'])

// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef<IDomEditor>()

const valueHtml = ref('')

watch(
  () => props.modelValue,
  (val: string) => {
    if (val === unref(valueHtml)) return
    valueHtml.value = val
  },
  {
    immediate: true
  }
)

// 监听
watch(
  () => valueHtml.value,
  (val: string) => {
    emit('update:modelValue', val)
  }
)

const handleCreated = (editor: IDomEditor) => {
  editorRef.value = editor
}

// 编辑器配置
const editorConfig = computed((): IEditorConfig => {
  return Object.assign(
    {
      readOnly: false,
      customAlert: (s: string, t: string) => {
        switch (t) {
          case 'success':
            ElMessage.success(s)
            break
          case 'info':
            ElMessage.info(s)
            break
          case 'warning':
            ElMessage.warning(s)
            break
          case 'error':
            ElMessage.error(s)
            break
          default:
            ElMessage.info(s)
            break
        }
      },
      autoFocus: false,
      scroll: true,
      uploadImgShowBase64: true
    },
    props.editorConfig || {}
  )
})

const editorStyle = computed(() => {
  return {
    height: isNumber(props.height) ? `${props.height}px` : props.height
  }
})

// 回调函数
const handleChange = (editor: IDomEditor) => {
  emit('change', editor)
}

// 组件销毁时，及时销毁编辑器
onBeforeUnmount(() => {
  const editor = unref(editorRef.value)

  // 销毁，并移除 editor
  editor?.destroy()
})

const getEditorRef = async (): Promise<IDomEditor> => {
  await nextTick()
  return unref(editorRef.value) as IDomEditor
}

defineExpose({
  getEditorRef
})
</script>

<template>
  <div class="border-1 border-solid border-[var(--el-border-color)] z-10">
    <!-- 工具栏 -->
    <Toolbar
      :editor="editorRef"
      :editorId="editorId"
      class="border-0 b-b-1 border-solid border-[var(--el-border-color)]"
    />
    <!-- 编辑器 -->
    <Editor
      v-model="valueHtml"
      :editorId="editorId"
      :defaultConfig="editorConfig"
      :style="editorStyle"
      @on-change="handleChange"
      @on-created="handleCreated"
    />
  </div>
</template>

<style src="@wangeditor/editor/dist/css/style.css"></style>
