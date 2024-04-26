<template>
  <ContentWrap>
    <div class="flex">
      <Search
        v-hasPermi="'goods:banner:list'"
        :schema="schema"
        @reset="setSearchParams"
        @search="setSearchParams"
      />
      <div class="mb-10px">
        <ElButton
          v-hasPermi="'goods:banner:add'"
          type="primary"
          @click="viewData('', 'add')"
          :loading="delLoading"
          >{{ t('project.add') }}</ElButton
        >
      </div>
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
  <Dialog v-model="dialogVisible" :title="dialogTitle" :max-height="dialogHeight">
    <Write
      ref="writeRef"
      :currentRow="currentRow"
      :actionType="actionType"
      :bannerTypeEnum="bannerTypeEnum"
      :belongTypeEnum="belongTypeEnum"
      :goodsStatusEnum="goodsStatusEnum"
    />
    <template #footer v-if="actionType != 'view'">
      <ElButton class="w-70px !h-40px" @click="dialogVisible = false">{{
        t('project.cancel')
      }}</ElButton>
      <ElButton @click="submit" class="w-70px !h-40px" type="primary">{{
        t('project.confirm')
      }}</ElButton>
    </template>
  </Dialog>
</template>

<script setup lang="tsx">
import { useIcon } from '@/hooks/web/useIcon'
import { ContentWrap } from '@/components/ContentWrap'
import { useI18n } from '@/hooks/web/useI18n'
import { ref, unref, watch, reactive, onMounted } from 'vue'
import { ElButton, ElTree, ElMessage, ElInput, ElImage } from 'element-plus'
import {
  postPageTopApi,
  postPageListApi,
  deleteApi,
  upOrDownApi,
  editApi,
  addApi
} from '@/api/operationCenter/chartManagement'
import type { DepartmentUserItem } from '@/api/department/types'
import { useTable } from '@/hooks/web/useTable'
import { Search } from '@/components/Search'
import { Dialog } from '@/components/Dialog'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { SelectOption, FormSchema } from '@/components/Form'
import { dateTimeRange } from '@/utils/time'
import { Table } from '@/components/Table'
import Write from './components/Write.vue'
import { createImageViewer } from '@/components/ImageViewer'
import { tableStatusStyleTag } from '@/utils/componentUtils'
import { Icon } from '@/components/Icon'

const { t } = useI18n()

const { tableRegister, tableState, tableMethods } = useTable({
  fetchDataApi: async () => {
    const { pageSize, currentPage } = tableState
    const res = await postPageListApi({
      currentPage: unref(currentPage),
      pageSize: unref(pageSize),
      ...unref(searchParams),
      startTime: searchParams.value.time ? searchParams.value.time[0] : '',
      endTime: searchParams.value.time ? searchParams.value.time[1] : ''
    })
    return res.data
  },
  fetchDelApi: async () => {
    const res = await deleteApi(unref(ids))
    return res
  },
  immediate: false
})
const { total, loading, dataList, pageSize, currentPage } = tableState
const { getList, getElTableExpose, delList } = tableMethods

onMounted(() => {
  init()
})

const bannerTypeEnum = ref()
const belongTypeEnum = ref()
const goodsStatusEnum = ref()

const init = async () => {
  const res = await postPageTopApi()
  if (res.code == 200) {
    bannerTypeEnum.value = res.data.bannerTypeEnum
    belongTypeEnum.value = res.data.belongTypeEnum
    goodsStatusEnum.value = res.data.goodsStatusEnum
  }
  getList()
}

const clickImage = (data) => {
  createImageViewer({
    urlList: [data]
  })
}

const editClick = (data) => {
  openInventoryTag.value = data
}
const mouseEnter = (data) => {
  openInventoryMouse.value = data
}

const openInventoryTag = ref(-2)
const openInventoryMouse = ref(-2)

const imgUrl = import.meta.env.VITE_IMG_URL

const crudSchemas = reactive<CrudSchema[]>([
  {
    field: 'bannerName',
    label: t('RotationChart.name'),
    search: {
      hidden: true
    },
    width: '300px',
    table: {
      slots: {
        default: (data: any) => {
          const image = data.row.bannerImg
          return (
            <>
              <div class="flex">
                <div onClick={() => clickImage(imgUrl + image)}>
                  <ElImage src={imgUrl + image} style="width:70px;height: 70px"></ElImage>
                </div>

                <div style="width: 200px;" class="ml-10px">
                  <div style="width: 200px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis">
                    {data.row.bannerName}
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
    field: 'belongPlatformStr',
    label: t('RotationChart.plat'),
    search: {
      hidden: true
    }
  },
  {
    field: 'relevancyName',
    label: t('RotationChart.sub1'),
    search: {
      hidden: true
    }
  },
  {
    field: 'status',
    label: t('RotationChart.status'),
    search: {
      hidden: true
    },
    formatter: (data: any) => {
      const status = data.status || ''
      return tableStatusStyleTag(status, t('project.success'), t('project.fail'))
    }
  },
  {
    field: 'sort',
    label: t('RotationChart.sort'),
    minWidth: 100,
    search: {
      hidden: true
    },
    slots: {
      default: (data) => {
        let sort = data.row.sort
        const index = data.$index
        if (openInventoryTag.value == index) {
          return (
            <>
              {/* <span class="colorfff bgcolorMainRed p-6px border-rd-40% ml-2">库存不足</span> */}
              <span onClick={() => editClick(index)}>
                <ElInput style="width: 60px;" v-model={data.row.sort} />
                <ElButton type="primary" class="ml-5px" onClick={() => action(data.row)}>
                  {t('project.confirm')}
                </ElButton>
              </span>
            </>
          )
        } else {
          if (openInventoryMouse.value == index) {
            return (
              <>
                <span>{sort}</span>
                {/* <span class="colorfff bgcolorMainRed p-6px border-rd-40% ml-2">库存不足</span> */}
                <span onClick={() => editClick(index)} onMouseenter={() => mouseEnter(index)}>
                  <Icon class="ml-1" id="iconEditInvisible" icon="ep:edit" />
                </span>
              </>
            )
          } else {
            return (
              <>
                <span>{sort}</span>
                {/* <span class="colorfff bgcolorMainRed p-6px border-rd-40% ml-2">库存不足</span> */}
                <span onClick={() => editClick(index)} onMouseenter={() => mouseEnter(index)}>
                  <Icon class="ml-1 invisible" id="iconEditInvisible" icon="ep:edit" />
                </span>
              </>
            )
          }
        }
      }
    }
  },
  {
    field: 'createTimeStr',
    label: t('RotationChart.time'),
    search: {
      hidden: true
    },
    width: '200px',
    table: {
      slots: {
        default: (data: any) => {
          return (
            <>
              <div>{data.row.createTimeStr}</div>
              <div>{data.row.editTimeStr}</div>
            </>
          )
        }
      }
    }
  },
  {
    field: 'action',
    label: t('userDemo.action'),
    width: 200,
    form: {
      hidden: true
    },
    detail: {
      hidden: true
    },
    search: {
      hidden: true
    },
    table: {
      slots: {
        default: (data: any) => {
          const row = data.row as DepartmentUserItem
          return (
            <>
              <div class="[&>span]:(cursor-pointer m-2) flex flex-wrap colorMain ">
                <span onClick={() => viewData(row, 'view')}>{t('project.view')}</span>
                <span v-hasPermi="goods:banner:edit" onClick={() => viewData(row, 'edit')}>
                  {t('project.edit')}
                </span>
                <span
                  v-hasPermi="goods:banner:delete"
                  class="color-red-500"
                  onClick={() => delData(row)}
                >
                  {t('role.delete')}
                </span>
                <span
                  v-hasPermi="goods:banner:updateStatus"
                  onClick={() =>
                    changeStatus(
                      row,
                      row.status == 'PUT_ON_SALE' ? 'PULL_OFF_SHELVES' : 'PUT_ON_SALE'
                    )
                  }
                >
                  {row.status == 'PUT_ON_SALE'
                    ? t('RotationChart.Offshelf')
                    : t('RotationChart.grounding')}
                </span>
              </div>
            </>
          )
        }
      }
    }
  }
])

const actionType = ref('')
const dialogVisible = ref(false)
const dialogTitle = ref('')
const dialogHeight = ref('')
const viewData = async (row: any, type: string) => {
  switch (type) {
    case 'edit':
      currentRow.value = row
      dialogTitle.value = t('project.edit') + t('RotationChart.name1')
      dialogHeight.value = '450px'
      break

    case 'add':
      currentRow.value = ''
      dialogTitle.value = t('project.add') + t('RotationChart.name1')
      dialogHeight.value = '450px'
      break

    case 'view':
      currentRow.value = row
      dialogTitle.value = t('project.view') + t('RotationChart.name1')
      dialogHeight.value = '400px'
      break
  }
  actionType.value = type
  dialogVisible.value = true
}

const action = async (data) => {
  const res = await editApi(data)
  if (res.code == 200) {
    ElMessage.success(t('common.operateSuccess'))
    openInventoryTag.value = -2
    openInventoryMouse.value = -2
    getList()
  }
}
const changeStatus = async (row, status) => {
  const res = await upOrDownApi({
    id: row.id,
    status: status
  })
  if (res.code == 200) {
    ElMessage.success(t('common.operateSuccess'))
    getList()
  }
}

const { allSchemas } = useCrudSchemas(crudSchemas)

const schema = reactive<FormSchema[]>([
  {
    field: 'bannerName',
    label: '',
    component: 'Input',
    componentProps: {
      slots: {
        prepend: () => <div>{t('RotationChart.name')}</div>
      }
    }
  },
  {
    field: 'appId',
    label: '',
    component: 'Select',
    componentProps: {
      options: belongTypeEnum,
      slots: {
        prefix: () => <div>{t('RotationChart.plat')}</div>
      }
    }
  },
  {
    field: 'status',
    label: '',
    component: 'Select',
    componentProps: {
      options: goodsStatusEnum,
      slots: {
        prefix: () => <div>{t('RotationChart.status')}</div>
      }
    }
  },
  {
    field: 'time',
    component: 'DatePicker',
    componentProps: dateTimeRange()
  }
])

const searchParams = ref<any>({})
const setSearchParams = (params: any) => {
  currentPage.value = 1
  searchParams.value = params
  getList()
}

const treeEl = ref<typeof ElTree>()

const currentDepartment = ref('')
watch(
  () => currentDepartment.value,
  (val) => {
    unref(treeEl)!.filter(val)
  }
)

const writeRef = ref()
const submit = async () => {
  const write = unref(writeRef)
  const formData = await write?.save()
  console.log(formData.openType)
  if (formData.openType == 'relevancyId1') {
    formData.relevancyId = formData.relevancyId1
  }
  if (formData.openType == 'relevancyId2') {
    formData.relevancyId = formData.relevancyId2
  }
  if (formData) {
    if (actionType.value == 'add') {
      const res = await addApi(formData)
      if (res.code == 200) {
        ElMessage.success(res.msg)
        getList()
      }
    }
    if (actionType.value == 'edit') {
      const res = await editApi(formData)
      if (res.code == 200) {
        ElMessage.success(res.msg)
        getList()
      }
    }

    dialogVisible.value = false
  }
}

const currentRow = ref()

const delLoading = ref(false)
const ids = ref<string[]>([])

const delData = async (row?: DepartmentUserItem) => {
  const elTableExpose = await getElTableExpose()
  ids.value = row
    ? [row.id]
    : elTableExpose?.getSelectionRows().map((v: DepartmentUserItem) => v.id) || []
  delLoading.value = true
  await delList(unref(ids).length).finally(() => {
    delLoading.value = false
  })
}
</script>
