<template>
  <ContentWrap>
    <div class="flex justify-between">
      <Search
        v-hasPermi="'pfcustel:pfCusTel:list'"
        :schema="searchSchema"
        @search="setSearchParams"
        @reset="setSearchParams"
      />
      <ElButton v-hasPermi="'pfcustel:pfCusTel:add'" type="primary" @click="AddAction">{{
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

  <Dialog v-model="dialogVisible" :title="dialogTitle" max-height="150px">
    <Write
      ref="writeRef"
      :bannerBelongTypeEnum="BannerBelongTypeEnum"
      :currentRow="currentRow"
      :actionType="actionType"
    />

    <template #footer v-if="actionType != 'view'">
      <ElButton @click="dialogVisible = false">{{ t('project.cancel') }}</ElButton>
      <ElButton
        v-hasPermi="'pfcustel:pfCusTel:edit'"
        type="primary"
        :loading="saveLoading"
        @click="save"
      >
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
  deleteDataListApi,
  editDataListApi,
  addDataListApi
} from '@/api/operationCenter/customerService'
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

const batchDelete = async () => {
  const res = await deleteDataListApi(chooseIdsList.value)
  if (res.code == 200) {
    ElMessage.success(t('common.operateSuccess'))
    getList()
  }
}

const BannerBelongTypeEnum = ref()
const searchSchema = reactive<FormSchema[]>([
  {
    field: 'belongPlatform',
    label: '',
    component: 'Select',
    componentProps: {
      options: BannerBelongTypeEnum,
      slots: {
        prefix: () => <div>{t('customerService.plat')}</div>
      }
    }
  },
  {
    field: 'contactInfo',
    label: '',
    component: 'Input',
    componentProps: {
      slots: {
        prepend: () => <div>{t('customerService.iphone')}</div>
      }
    }
  },
  {
    field: 'manager',
    label: '',
    component: 'Input',
    componentProps: {
      slots: {
        prepend: () => <div>{t('customerService.people')}</div>
      }
    }
  }
])

const init = async () => {
  const res = await getPageTopApi()
  console.log(res)
  if (res.code == 200) {
    BannerBelongTypeEnum.value = res.data.BannerBelongTypeEnum
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

const crudSchemas = reactive<CrudSchema[]>([
  {
    field: 'belongPlatformStr',
    label: t('customerService.plat'),
    search: {
      hidden: true
    }
  },
  {
    field: 'contactInfo',
    label: t('customerService.iphone'),
    search: {
      hidden: true
    }
  },
  {
    field: 'manager',
    label: t('customerService.people'),
    search: {
      hidden: true
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
                <span onClick={() => action(row, 'view')}> {t('project.view')} </span>
                <span v-hasPermi="pfcustel:pfCusTel:edit" onClick={() => action(row, 'edit')}>
                  {' '}
                  {t('project.edit')}{' '}
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
  dialogTitle.value = t('project.add')
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
      dialogTitle.value = t('project.view')
      break
    case 'edit':
      dialogTitle.value = t('project.edit')
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
        res = await addDataListApi({ ...formData, status: 'ACTIVE' })
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
