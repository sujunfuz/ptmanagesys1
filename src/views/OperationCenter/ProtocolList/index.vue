<template>
  <ContentWrap>
    <div class="flex justify-between">
      <Search
        v-hasPermi="'pfprotocol:pfProtocol:list'"
        :schema="searchSchema"
        @search="setSearchParams"
        @reset="setSearchParams"
      />
      <ElButton v-hasPermi="'pfprotocol:pfProtocol:add'" type="primary" @click="AddAction">{{
        t('project.add') + t('protocolList.name')
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
import { useRouter } from 'vue-router'
import { ref, unref, reactive, onMounted } from 'vue'
import { ElButton, ElRadioGroup, ElRadioButton, ElCascader, ElMessage } from 'element-plus'
import {
  getPageTopApi,
  getPageListApi,
  addDataListApi,
  editDataListApi,
  deleteDataListApi,
  getPageListByIdApi
} from '@/api/operationCenter/protocolList'
import type { DepartmentUserItem } from '@/api/department/types'
import { useTable } from '@/hooks/web/useTable'
import { Search } from '@/components/Search'
import { Dialog } from '@/components/Dialog'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { SelectOption, FormSchema } from '@/components/Form'
import { Table } from '@/components/Table'
import { tableStatusStyleTag } from '@/utils/componentUtils'

const { t } = useI18n()
const { push, currentRoute } = useRouter()

onMounted(() => {
  init()
})

const belongTypeEnum = ref()
const protocolTypeEnum = ref()
const searchSchema = reactive<FormSchema[]>([
  {
    field: 'belongPlatform',
    label: '',
    component: 'Select',
    componentProps: {
      options: belongTypeEnum,
      slots: {
        prefix: () => <div>{t('protocolList.sub1')}</div>
      }
    }
  },
  {
    field: 'protocolName',
    label: '',
    component: 'Input',
    componentProps: {
      slots: {
        prepend: () => <div>{t('protocolList.sub2')}</div>
      }
    }
  },
  {
    field: 'protocolType',
    label: '',
    component: 'Select',
    componentProps: {
      options: protocolTypeEnum,
      slots: {
        prefix: () => <div>{t('protocolList.sub3')}</div>
      }
    }
  }
])

const init = async () => {
  const res = await getPageTopApi()
  if (res.code == 200) {
    belongTypeEnum.value = res.data.belongTypeEnum
    protocolTypeEnum.value = res.data.protocolTypeEnum
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
    field: 'belongPlatformStr',
    label: t('protocolList.sub1'),
    search: {
      hidden: true
    }
  },
  {
    field: 'protocolName',
    label: t('protocolList.sub2'),
    search: {
      hidden: true
    }
  },
  {
    field: 'protocolTypeStr',
    label: t('protocolList.sub3'),
    search: {
      hidden: true
    }
  },
  {
    field: 'editTimeStr',
    label: t('protocolList.sub4'),
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
                <span v-hasPermi="pfprotocol:pfProtocol:edit" onClick={() => action(row, 'edit')}>
                  {' '}
                  {t('project.edit')}{' '}
                </span>
                <span
                  v-hasPermi="pfprotocol:pfProtocol:delete"
                  class="color-red-500"
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

const { allSchemas } = useCrudSchemas(crudSchemas)

const searchParams = ref({})
const setSearchParams = (params: any) => {
  currentPage.value = 1
  searchParams.value = params
  getList()
}

const AddAction = () => {
  push({
    path: '/operationCenter/protocolList/protocolEdit'
  })
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
  console.log(row)
  push({
    path: '/operationCenter/protocolList/protocolEdit',
    query: { id: row.id }
  })
}
</script>

<style lang="less" scoped>
.subString {
  color: #747474;
  font-size: 14px;
}
</style>
