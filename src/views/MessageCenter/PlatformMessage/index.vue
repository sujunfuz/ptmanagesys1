<template>
  <ContentWrap>
    <div class="flex justify-between">
      <Search
        :schema="searchSchema"
        v-hasPermi="'messsagenotify:messageNotify:list'"
        @search="setSearchParams"
        @reset="setSearchParams"
      />
      <ElButton type="primary" @click="AddAction" v-hasPermi="'messsagenotify:messageNotify:add'">{{
        t('project.add')
      }}</ElButton>
    </div>
  </ContentWrap>

  <ContentWrap class="mt-20px flex-1" :isBlock="false">
    <Table
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
  </ContentWrap>

  <Dialog v-model="dialogVisible" :title="dialogTitle" max-height="280px">
    <Write
      ref="writeRef"
      :actionType="actionType"
      :currentRow="currentRow"
      :messageType="messageType"
      :pushRangeEnum="pushRangeEnum"
    />

    <template #footer v-if="actionType != 'view'">
      <ElButton @click="dialogVisible = false">{{ t('project.cancel') }}</ElButton>
      <ElButton type="primary" :loading="saveLoading" @click="save">
        {{ t('project.confirm') }}
      </ElButton>
    </template>
  </Dialog>
</template>

<script setup lang="tsx">
import { ContentWrap } from '@/components/ContentWrap'
import { useI18n } from '@/hooks/web/useI18n'
import { ref, unref, reactive, onMounted } from 'vue'
import { ElButton, ElRadioGroup, ElRadioButton, ElCascader, ElMessage } from 'element-plus'
import {
  getPageTopApi,
  getPageListApi,
  deleteApi,
  addApi,
  editApi,
  messageNotifyUpOrDownApi
} from '@/api/messageCenter/platformMessage'
import type { DepartmentUserItem } from '@/api/department/types'
import { useTable } from '@/hooks/web/useTable'
import { Search } from '@/components/Search'
import Write from './components/Write.vue'
import { Dialog } from '@/components/Dialog'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { SelectOption, FormSchema } from '@/components/Form'
import { Table } from '@/components/Table'
import { tableStatusStyleTag } from '@/utils/componentUtils'
import { dateTimeRange } from '@/utils/time'

const { t } = useI18n()

onMounted(() => {
  init()
})

const messageStatus = ref()
const pushRangeEnum = ref()
const messageType = ref()

const searchSchema = reactive<FormSchema[]>([
  {
    field: 'title',
    label: '',
    component: 'Input',
    componentProps: {
      slots: {
        prepend: () => <div>{t('platformMessage.name')}</div>
      }
    }
  },
  {
    field: 'pushRange',
    label: '',
    component: 'Select',
    componentProps: {
      options: pushRangeEnum,
      slots: {
        prefix: () => <div>{t('platformMessage.range')}</div>
      }
    }
  },
  {
    field: 'status',
    label: '',
    component: 'Select',
    componentProps: {
      options: messageStatus,
      slots: {
        prefix: () => <div>{t('platformMessage.status')}</div>
      }
    }
  },
  {
    field: 'createTime',
    component: 'DatePicker',
    componentProps: dateTimeRange()
  }
])

const init = async () => {
  const res = await getPageTopApi()
  if (res.code == 200) {
    messageStatus.value = res.data.MessageStatus
    pushRangeEnum.value = res.data.PushRangeEnum
    messageType.value = res.data.MessageType
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
      startTime: unref(searchParams).createTime ? unref(searchParams).createTime[0] : '',
      endTime: unref(searchParams).createTime ? unref(searchParams).createTime[1] : ''
    })
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

const crudSchemas = reactive<CrudSchema[]>([
  {
    field: 'index',
    label: t('userDemo.index'),
    form: {
      hidden: true
    },
    search: {
      hidden: true
    },
    detail: {
      hidden: true
    },
    table: {
      type: 'index'
    }
  },
  {
    field: 'title',
    label: t('platformMessage.title'),
    search: {
      hidden: true
    }
  },
  {
    field: 'messageTypeStr',
    label: t('platformMessage.type'),
    search: {
      hidden: true
    }
  },
  {
    field: 'createTimeStr',
    label: t('platformMessage.time'),
    search: {
      hidden: true
    }
  },
  {
    field: 'pushRangeStr',
    label: t('platformMessage.range'),
    search: {
      hidden: true
    }
  },
  {
    field: 'readCount',
    label: t('platformMessage.read'),
    search: {
      hidden: true
    }
  },
  {
    field: 'statusStr',
    label: t('platformMessage.status'),
    search: {
      hidden: true
    },
    formatter: (data: any) => {
      const status = data.status || ''
      return tableStatusStyleTag(status, t('RotationChart.grounding'), t('RotationChart.Offshelf'))
    }
  },
  {
    field: 'action',
    label: t('userDemo.action'),
    table: {
      width: 150,
      fixed: 'right',
      slots: {
        default: (data: any) => {
          const row = data.row as DepartmentUserItem
          return (
            <>
              <div class="[&>span]:(cursor-pointer m-2) flex flex-wrap colorMain ">
                <span
                  v-hasPermi="messsagenotify:messageNotify:view"
                  onClick={() => action(row, 'view')}
                >
                  {' '}
                  {t('project.view')}{' '}
                </span>
                <span
                  v-hasPermi="messsagenotify:messageNotify:edit"
                  onClick={() => action(row, 'edit')}
                  v-show={row.status != 'PUT_ON_SALE'}
                >
                  {' '}
                  {t('project.edit')}{' '}
                </span>
                <span
                  onClick={() => changeStatus(row)}
                  v-hasPermi="messsagenotify:messageNotify:changeStatus"
                >
                  {row.status != 'PUT_ON_SALE'
                    ? t('RotationChart.grounding')
                    : t('RotationChart.Offshelf')}
                </span>
                <span
                  class="color-red-500"
                  v-hasPermi="messsagenotify:messageNotify:delete"
                  onClick={() => delData(row)}
                >
                  {t('role.delete')}
                </span>
              </div>
            </>
          )
        }
      }
    }
  }
])

const changeStatus = async (row: any) => {
  const res = await messageNotifyUpOrDownApi({ id: row.id })
  if (res.code == 200) {
    ElMessage.success(t('common.operateSuccess'))
    getList()
  }
}

const { allSchemas } = useCrudSchemas(crudSchemas)

const searchParams = ref({})
const setSearchParams = (params: any) => {
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

const dialogVisible = ref(false)
const dialogTitle = ref('')

const currentRow = ref<any>()
const actionType = ref('')

const AddAction = () => {
  dialogTitle.value = t('project.add') + t('platformMessage.name1')
  currentRow.value = undefined
  dialogVisible.value = true
  actionType.value = 'add'
}

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

const action = (row: any, type: string) => {
  switch (type) {
    case 'view':
      dialogTitle.value = t('project.view') + t('platformMessage.name1')
      break
    case 'edit':
      dialogTitle.value = t('project.edit') + t('platformMessage.name1')
      break
  }

  currentRow.value = row
  actionType.value = type
  dialogVisible.value = true
}

const writeRef = ref<ComponentRef<typeof Write>>()

const saveLoading = ref(false)

const save = async () => {
  const write = unref(writeRef)
  let formData = await write?.submit()
  if (formData) {
    saveLoading.value = true
    let res
    try {
      if (actionType.value == 'add') {
        res = await addApi({ ...formData, status: 'PULL_OFF_SHELVES' })
        if (res.code == 200) {
          ElMessage.success(t('common.operateSuccess'))
        }
      } else {
        res = await editApi(formData)
        if (res.code == 200) {
          ElMessage.success(t('common.operateSuccess'))
        }
      }

      if (res) {
        currentPage.value = 1
        getList()
      }
    } catch (error) {
      console.log(error)
    } finally {
      saveLoading.value = false
      dialogVisible.value = false
    }
  }
}
</script>

<style lang="less" scoped>
.subString {
  color: #747474;
  font-size: 14px;
}
</style>
