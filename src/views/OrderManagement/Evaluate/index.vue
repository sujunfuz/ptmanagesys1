<template>
  <ContentWrap v-hasPermi="'evevaluate:evaluate:list'">
    <div class="flex-cb mb-20px">
      <ElRadioGroup v-model="tabRadio" @change="setSearchParams">
        <ElRadioButton v-for="(item, index) in RadioList" :key="index" :label="item.value">{{
          item.label + '(' + item.count + ')'
        }}</ElRadioButton>
      </ElRadioGroup>
    </div>
    <Search :schema="schema" @reset="setSearchParams" @search="setSearchParams" />
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

  <Dialog
    v-model="dialogConfig.visible"
    class="!w-600px"
    max-height="300px"
    :title="dialogConfig.type == 'appeal' ? t('evaluate.title') : t('evaluate.back')"
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
import { dateTimeRange } from '@/utils/time'
import {
  ElButton,
  ElOption,
  ElRadioGroup,
  ElRadioButton,
  ElLink,
  ElRate,
  ElScrollbar,
  ElImage,
  ElMessage
} from 'element-plus'
import { useTable } from '@/hooks/web/useTable'
import { Search } from '@/components/Search'
import Write from './components/Write.vue'
import { Dialog } from '@/components/Dialog'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { SelectOption, FormSchema } from '@/components/Form'
import { Table } from '@/components/Table'
import { Icon } from '@/components/Icon'
import {
  getPageTopApi,
  getPageListApi,
  appealApi,
  replayApi
} from '@/api/orderManagement/Evaluate.ts'
import { createImageViewer } from '@/components/ImageViewer'

const { t } = useI18n()

const replyStatusEnum = ref()
const RadioList = ref()

onMounted(() => {
  init()
})

const init = async () => {
  const res = await getPageTopApi()
  if (res.code == 200) {
    replyStatusEnum.value = res.data.replyStatusEnum
    RadioList.value = res.data.startValue
  }
  getList()
}

const tabRadio = ref(0)

const { tableRegister, tableState, tableMethods } = useTable({
  fetchDataApi: async () => {
    const { pageSize, currentPage } = tableState
    const res = await getPageListApi({
      currentPage: unref(currentPage),
      pageSize: unref(pageSize),
      score: tabRadio.value,
      ...unref(searchParams),
      startTime: searchParams.value.time ? searchParams.value.time[0] : '',
      endTime: searchParams.value.time ? searchParams.value.time[1] : ''
    })
    return {
      list: res.data.list || [],
      total: res.data.total || 0
    }
  },
  immediate: false
})
const { total, loading, dataList, pageSize, currentPage } = tableState
const { getList } = tableMethods
const imgUrl = import.meta.env.VITE_IMG_URL
const clickImage = (data) => {
  createImageViewer({
    urlList: [data]
  })
}

const crudSchemas = reactive<CrudSchema[]>([
  {
    field: 'goodsOrderNo',
    label: t('evaluate.orderID'),
    search: {
      hidden: true
    }
  },
  {
    field: 'goodsInfo',
    label: t('evaluate.info'),
    search: {
      hidden: true
    },
    table: {
      width: 300,
      slots: {
        default: (data: any) => {
          const image = data.row.skuImage
          return (
            <div class="flex w-100% overflow-hidden">
              <div onClick={() => clickImage(imgUrl + image)}>
                <ElImage src={imgUrl + image} class="w-100px h-100px"></ElImage>
              </div>
              <div class="ml-10px w-325px flex flex-col">
                <span class="font-size-14px w-100% inline-block color-colorBlack text-ellipsis line-clamp-1">
                  {data.row.spuName}
                </span>
                <span class="font-size-12px w-98% inline-block color-colorGray text-ellipsis line-clamp-1">
                  {data.row.skuIndexesVal}
                </span>
              </div>
            </div>
          )
        }
      }
    }
  },
  {
    field: 'score',
    label: t('evaluate.star'),
    search: {
      hidden: true
    },
    table: {
      width: 200,
      slots: {
        default: (data) => {
          let { score } = data.row
          return (
            <div class="flex-c">
              <ElRate v-model={score} allow-half={true} disabled></ElRate>
              {score < 3 ? (
                <span
                  class="color-colorMain cursor-pointer font-size-14px"
                  v-hasPermi="evevaluate:evaluate:appeal"
                  onClick={() => {
                    openDialog('appeal', data.row)
                  }}
                >
                  {t('evaluate.title')}
                </span>
              ) : (
                ''
              )}
            </div>
          )
        }
      }
    }
  },
  {
    field: 'content',
    label: t('evaluate.content'),
    search: {
      hidden: true
    },
    table: {
      width: 300,
      slots: {
        default: (data) => {
          const content = JSON.parse(data.row.content).text
          const images = JSON.parse(data.row.content).images || []

          return (
            <div class="w-100%">
              <div class="font-size-14px  text-wrap">
                <span class="color-colorBlack">
                  {content.length > 52
                    ? data.row.foldFlag
                      ? content.substring(0, 52) + '...'
                      : content
                    : content}
                </span>

                {content.length <= 52 ? (
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
                {content.length <= 52 ? (
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
                  {images.map((item) => (
                    <div onClick={() => clickImage(imgUrl + item)}>
                      <ElImage src={imgUrl + item} class="w-100px h-100px"></ElImage>
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
    field: 'createTimeStr',
    label: t('evaluate.time'),
    search: {
      hidden: true
    }
  },
  {
    field: 'replay',
    label: t('evaluate.back'),
    search: {
      hidden: true
    },
    table: {
      slots: {
        default: (data) => {
          const replyStatus = data.row.replyStatus
          const replyContent = data.row.replyContent

          return (
            <div>
              {replyStatus == 'REPLY' ? (
                <span class="color-colorBlack font-size-14px text-wrap">{replyContent || '-'}</span>
              ) : (
                <span
                  v-hasPermi="evevaluate:evaluate:reply"
                  onClick={() => {
                    openDialog('reply', data.row)
                  }}
                  class="color-colorMain font-size-14px cursor-pointer"
                >
                  {t('evaluate.back')}
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

const schema = reactive<FormSchema[]>([
  {
    field: 'goodsOrderNo',
    colProps: {
      span: 12
    },
    component: 'Input',
    componentProps: {
      slots: {
        prefix: () => <div>{t('evaluate.orderID')}</div>
      }
    }
  },

  {
    field: 'replyStatus',
    component: 'Select',
    componentProps: {
      options: replyStatusEnum,
      slots: {
        prefix: () => <div>{t('evaluate.status')}</div>
      }
    }
  },
  {
    field: 'time',
    component: 'DatePicker',
    componentProps: dateTimeRange()
  }
  // {
  //   field: 'evaluateTime',
  //   component: 'Select',
  //   componentProps: {
  //     options: [
  //       {
  //         label: 'option1',
  //         value: '1'
  //       },
  //       {
  //         label: 'option2',
  //         value: '2'
  //       }
  //     ],
  //     slots: {
  //       default: (options: SelectOption[]) => {
  //         if (options.length) {
  //           return options?.map((v) => {
  //             return <ElOption key={v.value} label={v.label} value={v.value} />
  //           })
  //         } else {
  //           return null
  //         }
  //       },
  //       prefix: () => <div>{t('evaluate.time')}</div>
  //     },
  //     on: {
  //       change: () => {
  //         console.log('1222')
  //       }
  //     }
  //   }
  // }
])

const searchParams = ref({})
const setSearchParams = (params: any) => {
  currentPage.value = 1
  searchParams.value = params
  getList()
}

//弹窗
const dialogConfig = ref({
  title: t('evaluate.back'),
  visible: false,
  type: 'replay'
})
const currentRow = ref()
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
        title: t('evaluate.back')
      }
  }
}
const writeRef = ref()
const save = async () => {
  const params = await writeRef.value.submit()
  if (params) {
    const type = dialogConfig.value.type
    if (type == 'appeal') {
      const res = await appealApi({
        id: currentRow.value.id,
        appealReason: params
      })
      if (res.code == 200) {
        ElMessage.success(res.msg)
        dialogConfig.value.visible = false
        getList()
      }
    }
    if (type == 'reply') {
      const res = await replayApi({
        id: currentRow.value.id,
        replyContent: params
      })
      if (res.code == 200) {
        ElMessage.success(res.msg)
        dialogConfig.value.visible = false
        getList()
      }
    }
  } else {
    ElMessage.warning(t('common.b25'))
  }
}
</script>
<style lang="less" scoped>
// :deep(.el-rate__icon:not(.is-active)) {
//   display: none;
// }
</style>
