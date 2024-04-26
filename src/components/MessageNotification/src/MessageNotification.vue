<script setup lang="tsx">
import { computed, unref, ref, onMounted, onBeforeUnmount } from 'vue'
import {
  ElDropdown,
  ElDropdownMenu,
  ElDropdownItem,
  ElTag,
  ElIcon,
  ElPopover,
  ElBadge,
  ElMessage
} from 'element-plus'
import { useLocaleStore } from '@/store/modules/locale'
import { useLocale } from '@/hooks/web/useLocale'
import { propTypes } from '@/utils/propTypes'
import { useDesign } from '@/hooks/web/useDesign'
import { packNewMenu } from '@/utils/common'
import { useRouter } from 'vue-router'
import { useI18n } from '@/hooks/web/useI18n'
import { ArrowDown } from '@element-plus/icons-vue'
import Empty from '@/components/customComponents/Empty/index.vue'
import {
  getNotReadCountApi,
  getPageTopApi,
  messagePageListApi,
  singleReadApi,
  downloadFile
} from '@/api/messageCenter/platformMessage'

const props = defineProps({
  color: {
    type: String,
    default: ''
  },
  notReadCount: {
    type: Number,
    default: 0
  }
})

const { t } = useI18n()
const allMessageData = ref()

const { push } = useRouter()
const isReadStr = ref(t('productList.block1'))
const isRead = ref('')

const getDataForm = ref({ numPerPage: 10, pageNum: 1 })

const messageData = async () => {
  const res = await messagePageListApi({
    currentPage: getDataForm.value.pageNum,
    pageSize: getDataForm.value.numPerPage,
    isRead: isRead.value
  })
  allMessageData.value = res.data.list
}

const isReadEnum = ref([
  {
    label: t('productList.block1'),
    value: ''
  },
  {
    label: t('platformMessage.read1'),
    value: 'READ_ENUM_IS_READ'
  },
  {
    label: t('platformMessage.unread'),
    value: 'READ_ENUM_NOT_READ'
  }
])

const handleCommand = (command: string) => {
  let temp = command.split(',')
  isReadStr.value = temp[0]
  isRead.value = temp[1]
  messageData()
}

const imgUrl = import.meta.env.VITE_IMG_URL

const preview = async (val) => {
  await readItem(val)
  if (val.fileUrl != '') {
    let temp = imgUrl + val.fileUrl
    // const params = new URLSearchParams()
    // params.append('address', val.fileUrl)
    const res = await downloadFile({ address: val.fileUrl })
    // console.log(res, '无敌')
    if (res) {
      let downloadElement = document.createElement('a')
      let href = window.URL.createObjectURL(res as unknown as Blob) // 创建下载的链接
      downloadElement.href = href
      downloadElement.download = val.fileName // 下载后文件名
      document.body.appendChild(downloadElement)
      downloadElement.click() // 点击下载
      document.body.removeChild(downloadElement) // 下载完成移除元素
      window.URL.revokeObjectURL(href) // 释放blob对象
    }
    // let elemIF = document.createElement('iframe')
    // elemIF.src = temp
    // elemIF.style.display = 'none'
    // document.body.appendChild(elemIF)
  }

}
const popoverShow = ref(false)
const readItem = async (item) => {
  if (item.isRead == 'READ_ENUM_NOT_READ') {
    const res = await singleReadApi({ id: item.id })
    if (res.code == 200) {
      ElMessage.success(t('common.b11'))
      messageData()
    }
  }
}

const scrolling = (e) => {
  const clientHeight = e.target.clientHeight
  const scrollHeight = e.target.scrollHeight
  const scrollTop = e.target.scrollTop

  if (scrollTop + clientHeight >= scrollHeight) {
    getDataForm.value.numPerPage += 10
    messageData()
  }
}

// const getListTop = async () => {
//   const res = await getPageTopApi()
// }
const clickBadge = async () => {
  popoverShow.value = true
  // await getListTop()
  await messageData()
}

const clickMESSAGE_TYPE_REMIND = async (data: any) => {
  if (data.messageType == 'MESSAGE_TYPE_REMIND') {
    if(data.fileUrl){
       push(data.fileUrl)
    }
   
    return
  }
  if (data.fileName) {
    await preview(data)
  }
}

let timer: any = null
const closeElPopover = (val) => {
  clearTimeout(timer)
  if (!val) {
    timer = setTimeout(() => {
      popoverShow.value = val
    }, 250)
  }
}
</script>

<template>
  <ElPopover ref="popoverRef" :visible="popoverShow" popper-class="langPopoverStyle" placement="bottom" trigger="click"
    :width="400">
    <div @mouseleave="closeElPopover(false)" class="news-head-box h-400px" style="overflow: auto" @scroll="scrolling">
      <div class="newss-info flex-b">
        <div class="flex-c">
          <div class="news-head-title mr-20px">{{ t('platformMessage.name2') }}</div>

          <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
              {{ isReadStr }}<el-icon class="el-icon--right"><arrow-down /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu @mouseenter="closeElPopover(true)">
                <el-dropdown-item v-for="(item, key) in isReadEnum" :command="item.label + ',' + item.value" :key="key">{{
                  item.label }}</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
        <div class="mr-10px cursor-pointer" @click="popoverShow = false">
          <Icon icon="ep:close" />
        </div>
      </div>

      <div v-if="allMessageData?.length != 0">
        <div v-for="(item1, key1) in allMessageData" :key="key1" class="w-355px pt-15px pb-10px cursor-pointer"
          style="border-bottom: #ececec solid 1px;" @click="clickMESSAGE_TYPE_REMIND(item1)">
          <div class="flex-c" @click="readItem(item1)">
            <div v-if="item1.isRead == 'READ_ENUM_NOT_READ'" class="w-10px h-10px bg-#f94e59 border-rd-50% mr-7px"></div>
            <div class="font-size-14px">{{ item1.title }}</div>
            <el-tag class="ml-2" size="small" :type="item1.messageType == 'MESSAGE_TYPE_NOTICE'
                ? 'danger'
                : item1.messageType == 'MESSAGE_TYPE_NOTICE'
                  ? 'success'
                  : 'warning'
              ">{{ item1.messageTypeStr }}</el-tag>
          </div>
          <div class="textOverFlow mt-10px color-#767676">{{ item1.remark }}</div>
          <div class="mt-10px flex-c colorMain cursor-pointer"
            v-if="item1.fileName && item1.messageType != 'MESSAGE_TYPE_REMIND'" @click="preview(item1)">
            <Icon icon="ep:link" color="#0068E3" />
            <div class="ml-3px">{{ item1.fileName }}</div>
          </div>
        </div>
      </div>
      <Empty v-else />
    </div>

    <template #reference>
      <span class="flex-c w-30px ml-5px mr-5px mt-4px" @click="clickBadge()">
        <el-badge :hidden="notReadCount == 0" :value="notReadCount <= 99 ? notReadCount : '99+'" class="item">
          <Icon :size="26" icon="svg-icon:notification" class="cursor-pointer !p-0" :class="$attrs.class"
            :color="color" />
        </el-badge>
      </span>
    </template>
  </ElPopover>
</template>

<style lang="less" scoped>
.news-info-box {
  width: 400px;
  max-height: 540px;
}

.news-head-box {
  // display: flex;
  // align-items: center;
  // justify-content: space-between;
  width: 100%;
  padding: 10px 10px;

  .newss-info {
    display: flex;
    align-items: center;

    .news-head-title {
      font-size: 16px;
      color: #535c6f;
    }
  }
}

.news-border-none {
  margin-left: 10px;

  /deep/.el-input__inner {
    border: none;
    width: 75px;
    font-size: 12px;
    color: #b6bfd1;
  }
}

.el-dropdown-link:focus {
  outline: none;
}
</style>
