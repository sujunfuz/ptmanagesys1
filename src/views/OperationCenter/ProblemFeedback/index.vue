<template>
  <ContentWrap>
    <ElRadioGroup v-model="tabPosition" style="margin-bottom: 20px" @change="setSearchParams">
      <ElRadioButton
        v-hasPermi="'pfQuestionFeedback:pfQuestionFeedback:list'"
        v-for="(item, index) in questionType"
        :key="index"
        :label="item.value"
        >{{ item.label }}</ElRadioButton
      >
    </ElRadioGroup>
    <div v-hasPermi="'pfQuestionFeedback:pfQuestionFeedback:list'" class="flex justify-between">
      <Search :schema="searchSchema" @search="setSearchParams" @reset="setSearchParams" />
    </div>
    <div class="flex mb-20px mt-20px">
      <div class="bg-#f1f2f6 w-150px h-90px mr-20px p-15px box-border"
        ><div class="color-#a2a4a6">{{ t('ProblemFeedback.sub1') }}</div>
        <div class="mt-5px color-red font-size-20px">{{
          tabPosition == 'COMPLAINT'
            ? waitDealCountComplaint
            : tabPosition == 'QUESTION_FEEDBACK'
            ? waitDealCountFeedback
            : waitDealCountAdvice
        }}</div></div
      >
      <div class="bg-#f1f2f6 w-150px h-90px p-15px box-border"
        ><div class="color-#a2a4a6">{{ t('ProblemFeedback.sub2') }}</div>
        <div class="mt-5px color-#43c28e font-size-20px">{{
          tabPosition == 'COMPLAINT'
            ? dealedCountComplaint
            : tabPosition == 'QUESTION_FEEDBACK'
            ? dealedCountFeedback
            : dealedCountAdvice
        }}</div></div
      >
    </div>
  </ContentWrap>
  <ContentWrap class="mt-20px flex-1" :isBlock="false">
    <Table
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :columns="allSchemas.tableColumns"
      :data="dataList"
      :loading="loading"
      @register="tableRegister"
      :pagination="{
        total,
        layout: ' ->, total, sizes, prev, pager, next, jumper'
      }"
    />
  </ContentWrap>
</template>

<script setup lang="tsx">
import { ContentWrap } from '@/components/ContentWrap'
import { useI18n } from '@/hooks/web/useI18n'
import { ref, unref, reactive, onMounted, pushScopeId } from 'vue'
import {
  ElButton,
  ElRadioGroup,
  ElRadioButton,
  ElTag,
  ElMessage,
  ElImage,
  ElAvatar
} from 'element-plus'
import type { DepartmentUserItem } from '@/api/department/types'
import { useTable } from '@/hooks/web/useTable'
import { Search } from '@/components/Search'
import { useRouter } from 'vue-router'
import Write from './components/Write.vue'
import { Dialog } from '@/components/Dialog'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { SelectOption, FormSchema } from '@/components/Form'
import { Table } from '@/components/Table'
import { createImageViewer } from '@/components/ImageViewer'
import { getPageTopApi, getPageListApi } from '@/api/operationCenter/problemFeedback'

const { t } = useI18n()
const { push, currentRoute } = useRouter()
const tabPosition = ref('QUESTION_FEEDBACK')
onMounted(() => {
  init()
})

const questionStatus = ref()

const searchSchema = reactive<FormSchema[]>([
  {
    field: 'questionStatus',
    label: '',
    component: 'Select',
    componentProps: {
      options: questionStatus,
      slots: {
        prefix: () => t('ProblemFeedback.status')
      }
    }
  },
  {
    field: 'userName',
    label: '',
    component: 'Input',
    componentProps: {
      slots: {
        prepend: () => <div>{t('ProblemFeedback.name')}</div>
      }
    }
  },
  {
    field: 'mobileNo',
    label: '',
    component: 'Input',
    componentProps: {
      slots: {
        prepend: () => <div>{t('ProblemFeedback.iphone')}</div>
      }
    }
  },
  {
    field: 'startTime',
    label: '',
    component: 'DatePicker',
    componentProps: {
      type: 'datetimerange',
      valueFormat: 'YYYY-MM-DD HH:mm:ss'
    }
  }
])

const dealedCount = ref()
const waitDealCount = ref()
const questionType = ref()

const waitDealCountComplaint = ref()
const dealedCountComplaint = ref()

const waitDealCountFeedback = ref()
const dealedCountFeedback = ref()

const waitDealCountAdvice = ref()
const dealedCountAdvice = ref()

const init = async () => {
  const res = await getPageTopApi()
  if (res.code == 200) {
    questionStatus.value = res.data.questionStatus
    dealedCount.value = res.data.dealedCount
    waitDealCount.value = res.data.waitDealCount
    questionType.value = res.data.questionType

    waitDealCountComplaint.value = res.data.waitDealCountComplaint
    dealedCountComplaint.value = res.data.dealedCountComplaint

    waitDealCountFeedback.value = res.data.waitDealCountFeedback
    dealedCountFeedback.value = res.data.dealedCountFeedback

    waitDealCountAdvice.value = res.data.waitDealCountAdvice
    dealedCountAdvice.value = res.data.dealedCountAdvice
  }
  getList()
}

const { tableRegister, tableState, tableMethods } = useTable({
  fetchDataApi: async () => {
    const { pageSize, currentPage } = tableState
    const res = await getPageListApi({
      currentPage: unref(currentPage),
      pageSize: unref(pageSize),
      ...unref(searchParams),
      questionType: tabPosition.value,
      startTime: searchParams.value.startTime ? searchParams.value.startTime[0] : '',
      endTime: searchParams.value.startTime ? searchParams.value.startTime[1] : ''
    })
    console.log(res.data)
    return {
      list: res.data.list,
      total: res.data.total
    }
  },
  fetchDelApi: async () => {
    const res = await deleteApi(unref(ids))
    return res
  },
  immediate: false
})
const { total, loading, dataList, pageSize, currentPage } = tableState
const { getList, getElTableExpose, delList } = tableMethods

const imgUrl = import.meta.env.VITE_IMG_URL
const clickImage = (data) => {
  data = data.map((item) => imgUrl + item)
  createImageViewer({
    urlList: data
  })
}

const crudSchemas = reactive<CrudSchema[]>([
  {
    field: 'title',
    label: t('ProblemFeedback.info'),
    search: {
      hidden: true
    },
    table: {
      width: 500,
      slots: {
        default: (data: any) => {
          const image = data.row.icon
          const questionImages =
            data.row.questionImages == null ? [] : data.row.questionImages.split(',')

          return (
            <>
              <div class="flex">
                <div onClick={() => clickImage(imgUrl + image)}>
                  <ElAvatar src={imgUrl + image} size={40}></ElAvatar>
                </div>

                <div style="width: 150px;" class="ml-10px">
                  <div style="width: 150px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis">
                    {data.row.userName}
                  </div>
                  <div
                    class="color-#c2c0c1"
                    style="width: 150px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis"
                  >
                    {data.row.mobileNo}
                  </div>
                  <div
                    class="color-#c2c0c1"
                    style="width: 150px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis"
                  >
                    {data.row.createTime}
                  </div>
                  <div
                    style="white-space: wrap;-webkit-line-clamp: 3;
  overflow: hidden;text-overflow: ellipsis;display: -webkit-box;
  -webkit-box-orient: vertical;"
                    class="color-#9b9d9e w-350px"
                  >
                    {data.row.questionDetail}
                  </div>
                  <div class="w-350px flex flex-wrap" onClick={() => clickImage(questionImages)}>
                    {questionImages.map((item, index) => (
                      <ElImage
                        src={imgUrl + item}
                        style="width:70px;height: 70px;margin-right: 10px;margin-top: 10px;"
                      ></ElImage>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )
        }
      }
    }
  },
  {
    field: 'priorityStr',
    label: t('ProblemFeedback.status'),
    search: {
      hidden: true
    },
    table: {
      slots: {
        default: (data: any) => {
          return (
            <>
              <ElTag
                type={
                  data.row.questionStatus == 'DEALED'
                    ? 'success'
                    : data.row.questionStatus == 'WAIT_DEAL'
                    ? 'warning'
                    : 'danger'
                }
              >
                {data.row.questionStatusStr}
              </ElTag>
            </>
          )
        }
      }
    }
  },
  {
    field: 'action',
    label: t('userDemo.action'),
    width: '100px',
    table: {
      fixed: 'right',
      slots: {
        default: (data: any) => {
          const row = data.row
          return (
            <>
              <div class="[&>span]:(cursor-pointer m-2) flex flex-wrap colorMain ">
                <span
                  v-hasPermi="pfQuestionFeedback:pfQuestionFeedback:view"
                  onClick={() =>
                    push({
                      path: '/operationCenter/problemFeedback/feedDetail',
                      query: { id: row.id }
                    })
                  }
                >
                  {row.questionStatus != 'DEALED'
                    ? t('ProblemFeedback.action')
                    : t('project.detail')}
                </span>
              </div>
            </>
          )
        }
      }
    }
  }
])

const { allSchemas } = useCrudSchemas(crudSchemas)

const searchParams = ref({})
const setSearchParams = (params: any) => {
  currentPage.value = 1
  searchParams.value = params
  getList()
}

// 表格选择

const dialogVisible = ref(false)
const dialogTitle = ref('')

const currentRow = ref<any>()

const ids = ref<string[]>([])

const writeRef = ref<ComponentRef<typeof Write>>()

const saveLoading = ref(false)
</script>

<style lang="less" scoped>
.subString {
  color: #747474;
  font-size: 14px;
}
</style>
