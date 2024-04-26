<template>
  <ContentWrap>
    <div class="flex justify-between">
      <Search
        v-hasPermi="'financialCenter:finCardGroup:list'"
        :schema="searchSchema"
        @search="setSearchParams"
        @reset="setSearchParams"
      />
      <ElButton v-hasPermi="'financialCenter:finCardGroup:add'" type="primary" @click="AddAction">{{
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

  <Dialog v-model="dialogVisible" :title="dialogTitle" max-height="330px">
    <Write ref="writeRef" :currentRow="currentRow" />

    <template #footer>
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
import { ElButton, ElRadioGroup, ElRadioButton, ElCascader, ElMessage, ElTag } from 'element-plus'
import {
  getPageTopApi,
  getPageListApi,
  addDataListApi,
  editDataListApi,
  deleteDataListApi,
  getListAllApi
} from '@/api/financialCenter/cardBank'
import type { DepartmentUserItem } from '@/api/department/types'
import { useTable } from '@/hooks/web/useTable'
import { Search } from '@/components/Search'
import Write from './components/Write.vue'
import { Dialog } from '@/components/Dialog'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { SelectOption, FormSchema } from '@/components/Form'
import { Table } from '@/components/Table'
import { tableStatusStyleTag } from '@/utils/componentUtils'

const { t } = useI18n()

onMounted(() => {
  init()
})

const searchSchema = reactive<FormSchema[]>([
  {
    field: 'name',
    label: '',
    component: 'Input',
    componentProps: {
      slots: {
        prepend: () => <div>{t('cardBank.name')}</div>
      }
    }
  },
  {
    field: 'code',
    label: '',
    component: 'Input',
    componentProps: {
      slots: {
        prepend: () => <div>{t('cardBank.code')}</div>
      }
    }
  }
])

const batchDelete = async () => {
  const res = await delecGoodsSaleLimit(chooseIdsList.value)
  if (res.code == 200) {
    ElMessage.success(t('common.operateSuccess'))
    getList()
  }
}

const init = async () => {
  const res = await getPageTopApi()
  if (res.code == 200) {
    console.log(res)
  }
  getList()
}

const { tableRegister, tableState, tableMethods } = useTable({
  fetchDataApi: async () => {
    const { pageSize, currentPage } = tableState
    const res = await getPageListApi({
      currentPage: unref(currentPage),
      pageSize: unref(pageSize),
      ...unref(searchParams)
    })
    return {
      list: res.data.list,
      total: res.data.total
    }
  },
  fetchDelApi: async () => {
    const res = await deleteDataListApi(unref(ids))
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
    field: 'name',
    label: t('cardBank.name'),
    search: {
      hidden: true
    }
  },
  {
    field: 'code',
    label: t('cardBank.code'),
    search: {
      hidden: true
    }
  },
  {
    field: 'maximumLimitDay',
    label: t('cardBank.sub1'),
    search: {
      hidden: true
    }
  },
  {
    field: 'maximumLimitOnce',
    label: t('cardBank.sub2'),
    search: {
      hidden: true
    }
  },
  {
    field: 'minimumLimitOnce',
    label: t('cardBank.sub3'),
    search: {
      hidden: true
    }
  },
  {
    field: 'passwordErrorDay',
    label: t('cardBank.sub4'),
    search: {
      hidden: true
    }
  },
  // {
  //   field: 'chargeRate',
  //   label: t('cardBank.sub5'),
  //   search: {
  //     hidden: true
  //   }
  // },
  {
    field: 'status',
    label: t('cardBank.status'),
    search: {
      hidden: true
    },
    formatter: (data: any) => {
      const statusStr = data.statusStr || ''
      const status = data.status || ''
      return (
        <>
          <ElTag type={status == 'NORMAL' ? 'success' : status == 'BLACK' ? 'danger' : ''}>
            {statusStr}
          </ElTag>
        </>
      )
    }
  },
  {
    field: 'editTimeStr',
    label: t('cardBank.time'),
    search: {
      hidden: true
    }
  },
  {
    field: 'action',
    label: t('userDemo.action'),
    table: {
      width: 300,
      fixed: 'right',
      slots: {
        default: (data: any) => {
          const row = data.row as DepartmentUserItem
          return (
            <>
              <div class="[&>span]:(cursor-pointer m-2) flex flex-wrap colorMain ">
                <span
                  onClick={() => action(row, 'edit')}
                  v-hasPermi="financialCenter:finCardGroup:edit"
                >
                  {' '}
                  {t('project.edit')}{' '}
                </span>
                <span
                  v-hasPermi="financialCenter:finCardGroup:delete"
                  class="color-red-500"
                  onClick={() => delData(row)}
                >
                  {t('role.delete')}
                </span>
                <span
                  v-hasPermi="financialCenter:finCardGroup:editStatus"
                  onClick={() => action(row, 'WHITE')}
                >
                  {' '}
                  {t('cardBank.add1')}{' '}
                </span>
                <span
                  v-hasPermi="financialCenter:finCardGroup:editStatus"
                  onClick={() => action(row, 'BLACK')}
                >
                  {' '}
                  {t('cardBank.add2')}{' '}
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
  dialogTitle.value = t('project.add') + t('cardBank.name1')
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

const action = async (row: any, type: string) => {
  switch (type) {
    case 'view':
      dialogTitle.value = t('project.view') + t('cardBank.name1')
      currentRow.value = row
      actionType.value = type
      dialogVisible.value = true
      break
    case 'edit':
      dialogTitle.value = t('project.edit') + t('Recommendation.name1')
      currentRow.value = row
      actionType.value = type
      dialogVisible.value = true
      break
    case 'WHITE':
      const res = await getListAllApi(row.id, type)
      if (res.code == 200) {
        ElMessage.success(t('common.operateSuccess'))
      }
      getList()
      break
    case 'BLACK':
      const res1 = await getListAllApi(row.id, type)
      if (res1.code == 200) {
        ElMessage.success(t('common.operateSuccess'))
      }
      getList()
      break
  }
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
        res = await addDataListApi({ ...formData, status: 'NORMAL' })
        if (res.code == 200) {
          ElMessage.success(t('common.operateSuccess'))
        }
      } else {
        res = await editDataListApi(formData)
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
