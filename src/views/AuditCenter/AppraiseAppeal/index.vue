<template>
  <ContentWrap v-hasPermi="'evevaluate:appeal:list'">
    <div class="flex justify-between">
      <Search :schema="searchSchema" @search="setSearchParams" @reset="setSearchParams" />
    </div>
  </ContentWrap>

  <ContentWrap class="mt-20px flex-1" :isBlock="false">
    <Table
      v-if="dataList.length != 0"
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :columns="allSchemas.tableColumns"
      :data="dataList"
      :loading="loading"
      @select="handleSelectionChange"
      @select-all="handleSelectionAllChange"
      @register="tableRegister"
      :pagination="{
        total,
        layout: ' ->, total, sizes, prev, pager, next, jumper'
      }"
    />
    <Empty v-else />
  </ContentWrap>

  <Dialog
    v-model="dialogConfig.visible"
    class="!w-600px"
    max-height="350px"
    :title="t('evaluate.title')"
  >
    <Write ref="writeRef" :dialogType="dialogConfig.type" :currentRow="currentRow" />

    <template #footer>
      <ElButton @click="dialogConfig.visible = false">{{ t('project.cancel') }}</ElButton>
      <ElButton type="primary" @click="save">
        {{ t('project.confirm') }}
      </ElButton>
    </template>
  </Dialog>
</template>

<script setup lang="tsx">
import { ContentWrap } from '@/components/ContentWrap'
import { useI18n } from '@/hooks/web/useI18n'
import { ref, unref, reactive, onMounted } from 'vue'
import Empty from '@/components/customComponents/Empty/index.vue'
import {
  ElButton,
  ElRadioGroup,
  ElRate,
  ElImage,
  ElMessage,
  ElScrollbar,
  ElTag
} from 'element-plus'
import {
  appealListPageTopApi,
  appealListApi,
  appealHandleApi
} from '@/api/orderManagement/Evaluate'
import Icon from '@/components/Icon/src/Icon.vue'
import { useTable } from '@/hooks/web/useTable'
import { Search } from '@/components/Search'
import Write from './components/Write.vue'
import { Dialog } from '@/components/Dialog'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { SelectOption, FormSchema } from '@/components/Form'
import { Table } from '@/components/Table'
import { tableStatusStyleTag } from '@/utils/componentUtils'
import { dateTimeRange } from '@/utils/time'
import { createImageViewer } from '@/components/ImageViewer'

const { t } = useI18n()

onMounted(() => {
  init()
})

//弹窗
const dialogConfig = ref({
  title: t('ProblemFeedback.action'),
  visible: false,
  type: 'replay'
})

const appealStatus = ref()
const init = async () => {
  const res = await appealListPageTopApi()
  if (res.code == 200) {
    appealStatus.value = res.data.appealStatus
  }
  getList()
}

const searchSchema = reactive<FormSchema[]>([
  {
    field: 'goodsOrderNo',
    label: '',
    component: 'Input',
    componentProps: {
      slots: {
        prepend: () => <div>{t('appraiseAppeal.order')}</div>
      }
    }
  },
  {
    field: 'appealStatus',
    label: '',
    component: 'Select',
    componentProps: {
      options: appealStatus,
      slots: {
        prefix: () => <div>{t('appraiseAppeal.status')}</div>
      }
    }
  },
  {
    field: 'time',
    component: 'DatePicker',
    componentProps: dateTimeRange()
  }
])

const { tableRegister, tableState, tableMethods } = useTable({
  fetchDataApi: async () => {
    const { pageSize, currentPage } = tableState
    const res = await appealListApi({
      currentPage: unref(currentPage),
      pageSize: unref(pageSize),
      ...unref(searchParams),
      startTime: searchParams.value.time ? searchParams.value.time[0] : '',
      endTime: searchParams.value.time ? searchParams.value.time[1] : ''
    })

    return {
      list: res.data.list,
      total: res.data.total
    }
  },
  immediate: false
})
const { total, loading, dataList, pageSize, currentPage } = tableState
const { getList, getElTableExpose, delList } = tableMethods

const clickImage = (data) => {
  createImageViewer({
    urlList: [data]
  })
}

const imgUrl = import.meta.env.VITE_IMG_URL

const crudSchemas = reactive<CrudSchema[]>([
  {
    field: 'goodsOrderNo',
    label: t('appraiseAppeal.order'),
    search: {
      hidden: true
    }
  },
  {
    field: 'priorityStr',
    label: t('appraiseAppeal.info'),
    search: {
      hidden: true
    },
    width: '250px',
    table: {
      slots: {
        default: (data: any) => {
          const image = data.row.skuImage
          return (
            <>
              <div class="flex">
                <div onClick={() => clickImage(imgUrl + image)}>
                  <ElImage src={imgUrl + image} style="width:70px;height: 70px"></ElImage>
                </div>

                <div style="width: 360px;" class="ml-10px">
                  <div style="width: 360px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis">
                    {data.row.spuName || '-'}
                  </div>
                  <div
                    class="color-#8e8e8e"
                    style="width: 360px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis"
                  >
                    {data.row.skuIndexesVal || '-'}
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
    field: 'score',
    label: t('appraiseAppeal.star'),
    search: {
      hidden: true
    },
    table: {
      width: 200,
      slots: {
        default: (data) => {
          let evaluateGrade = data.row.score
          return (
            <div class="flex-c">
              <ElRate v-model={evaluateGrade} disabled></ElRate>
              {/* {evaluateGrade < 3 ? (
                <span
                  class="color-colorMain cursor-pointer font-size-14px"
                  onClick={() => {
                    openDialog('appeal', data.row)
                  }}
                >
                  {t('evaluate.title')}
                </span>
              ) : (
                ''
              )} */}
            </div>
          )
        }
      }
    }
  },
  {
    field: 'createTimeStr',
    label: t('appraiseAppeal.content'),
    search: {
      hidden: true
    },
    table: {
      width: 300,
      slots: {
        default: (data) => {
          const comment = JSON.parse(data.row.content).text || ''
          const image = JSON.parse(data.row.content).images || []

          return (
            <div class="w-100%">
              <div class="font-size-14px  text-wrap">
                <span class="color-colorBlack">
                  {comment.length > 52
                    ? data.row.foldFlag
                      ? comment.substring(0, 52) + '...'
                      : comment
                    : comment}
                </span>

                {comment.length <= 52 ? (
                  ''
                ) : (
                  <span
                    class="color-colorMain"
                    onClick={() => {
                      data.row.foldFlag = !data.row.foldFlag
                    }}
                  >
                    {data.row.foldFlag ? t('common.expand') : t('common.shrink')}
                  </span>
                )}
                {comment.length <= 52 ? (
                  ''
                ) : (
                  <Icon
                    icon="ep:arrow-down"
                    class="ml-6px"
                    color="var(--el-color-primary)"
                    size={12}
                  />
                )}
              </div>
              <ElScrollbar class="mt-10px">
                <div class="flex">
                  {image.map((item) => (
                    <div onClick={() => clickImage(imgUrl + item)}>
                      <ElImage src={imgUrl + item} style="width:70px;height: 70px"></ElImage>
                    </div>
                  ))}
                </div>
              </ElScrollbar>
            </div>
          )
        }
      }
    }
  },
  {
    field: 'createTime',
    label: t('appraiseAppeal.time'),
    search: {
      hidden: true
    }
  },
  {
    field: 'appealstatusstr',
    label: t('appraiseAppeal.status'),
    search: {
      hidden: true
    },
    formatter: (data: any) => {
      const status = data.appealStatus || ''
      return (
        <>
          <ElTag
            type={status == 'AGREE' ? 'success' : status == 'WAIT_HANDLE' ? 'warning' : 'danger'}
          >
            {data.appealStatusStr}
          </ElTag>
        </>
      )
    }
  },
  {
    field: 'appealReason',
    label: t('appraiseAppeal.reason'),
    search: {
      hidden: true
    }
  },
  {
    field: 'action',
    label: t('userDemo.action'),
    width: '100px',
    table: {
      slots: {
        default: (data) => {
          let { replay } = data.row

          return (
            <div>
              {replay ? (
                <span
                  v-hasPermi="evevaluate:appeal:handle"
                  class="color-colorBlack font-size-14px text-wrap"
                >
                  {replay}
                </span>
              ) : (
                <span
                  v-hasPermi="evevaluate:appeal:handle"
                  onClick={() => {
                    openDialog('reply', data.row)
                  }}
                  class="color-colorMain font-size-14px cursor-pointer"
                >
                  {t('ProblemFeedback.action')}
                </span>
              )}
            </div>
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
const chooseCount = ref(0)
const chooseIdsList = ref<any>([]) //ids

const handleSelectionChange = (row: any) => {
  chooseCount.value = row.length
  row.forEach((e: any) => {
    chooseIdsList.value.push(e.id)
  })
}

const handleSelectionAllChange = (row: any) => {
  if (!row.length) {
    chooseCount.value = 0
    chooseIdsList.value = []
  } else {
    chooseIdsList.value = []
    row.forEach((e: any) => {
      chooseIdsList.value.push(e.id)
    })
    chooseCount.value = chooseIdsList.value.length
  }
}

const currentRow = ref<any>()
const actionType = ref('')

const ids = ref<string[]>([])

const writeRef = ref()

const openDialog = (type, row) => {
  currentRow.value = row
  switch (type) {
    case 'appeal':
      dialogConfig.value = {
        type,
        visible: true,
        title: t('evaluate.title')
      }
    case 'reply':
      dialogConfig.value = {
        type,
        visible: true,
        title: t('ProblemFeedback.action')
      }
  }
}

const save = async () => {
  const params = await writeRef.value.submit()
  if (params.appealRefuseReason && params.appealStatus) {
    const res = await appealHandleApi({
      id: currentRow.value.id,
      ...params
    })
    if (res.code == 200) {
      ElMessage.success(res.msg)
      dialogConfig.value.visible = false
      getList()
    }
  } else {
    ElMessage.warning(t('common.sub2'))
  }
}
</script>

<style lang="less" scoped>
.subString {
  color: #747474;
  font-size: 14px;
}
</style>
