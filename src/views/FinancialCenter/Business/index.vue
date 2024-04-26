<template>
  <ContentWrap v-hasPermi="'meraccount:merAccount:list'">
    <div class="flex-b">
      <Search :schema="schema" @reset="setSearchParams" @search="setSearchParams" />
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
  <Dialog v-model="dialogVisible" :title="dialogTitle" max-height="100px">
    <template #footer>
      <ElButton @click="dialogVisible = false">{{ t('project.cancel') }}</ElButton>
      <ElButton type="primary" :loading="saveLoading" @click="save">
        {{ t('project.confirm') }}
      </ElButton>
    </template>
  </Dialog>
</template>

<script lang="tsx" setup>
import { ContentWrap } from '@/components/ContentWrap'
import { ElButton, ElTag } from 'element-plus'
import { ref, reactive, unref, onMounted } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import { Table } from '@/components/Table'
import { Search } from '@/components/Search'
import { FormSchema } from '@/components/Form'
import { useTable } from '@/hooks/web/useTable'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { useRouter } from 'vue-router'
import { tableStatusStyleTag } from '@/utils/componentUtils'
import { dateTimeRange } from '@/utils/time'
import { Dialog } from '@/components/Dialog'
import { getPageTopApi, getPageListApi } from '@/api/financialCenter/business'

const searchParams = ref({})
const dialogTitle = ref('')

const dialogVisible = ref(false)
const saveLoading = ref(false)

const { t } = useI18n()
const currentRow = ref<any>()

const setSearchParams = (params: any) => {
  searchParams.value = params
  currentPage.value = 1
  getList()
}

const { tableRegister, tableState, tableMethods } = useTable({
  fetchDataApi: async () => {
    const { pageSize, currentPage } = tableState
    const res = await getPageListApi({
      currentPage: unref(currentPage),
      numPerPage: unref(pageSize),
      ...unref(searchParams)
    })
    return {
      list: res.data.list,
      total: res.data.total || 0
    }
  },
  immediate: false
})

onMounted(() => {
  init()
})

const init = async () => {
  const res = await getPageTopApi()
  if (res.code == 200) {
    console.log(res)
  }
  getList()
}

const { total, loading, dataList, pageSize, currentPage } = tableState
const { getList, getElTableExpose, delList } = tableMethods

const action = (row: any) => {
  currentRow.value = row
  dialogVisible.value = true
}
const schema = reactive<FormSchema[]>([
  {
    field: 'merchantName',
    label: '',
    component: 'Input',
    componentProps: {
      slots: {
        prepend: () => <div>{t('merchant.name')}</div>
      }
    }
  }
])

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
    field: 'merchantName',
    label: t('merchant.name'),
    search: {
      hidden: true
    }
  },
  {
    field: 'merchantNo',
    label: t('business.merchantId'),
    search: {
      hidden: true
    }
  },
  {
    field: 'bankName',
    label: t('business.bank'),
    search: {
      hidden: true
    }
  },
  {
    field: 'subbranchName',
    label: t('business.branch'),
    search: {
      hidden: true
    }
  },
  {
    field: 'bankNo',
    label: t('business.bankNum'),
    search: {
      hidden: true
    }
  },
  {
    field: 'auditTimeStr',
    label: t('business.time'),
    search: {
      hidden: true
    }
  },
  {
    field: 'effectiveTimeStr',
    label: t('business.validity'),
    search: {
      hidden: true
    }
  }
  // {
  //   field: 'action',
  //   label: t('userDemo.action'),
  //   form: {
  //     hidden: true
  //   },
  //   detail: {
  //     hidden: true
  //   },
  //   search: {
  //     hidden: true
  //   },
  //   table: {
  //     width: 240,
  //     slots: {
  //       default: (data: any) => {
  //         const row = data.row
  //         return (
  //           <>
  //             <div class="[&>span]:(cursor-pointer m-2) flex flex-wrap colorMain ">
  //               <span onClick={() => action(row)}>{t('project.detail')}</span>
  //             </div>
  //           </>
  //         )
  //       }
  //     }
  //   }
  // }
])

const { allSchemas } = useCrudSchemas(crudSchemas)

const delLoading = ref(false)
const ids = ref<string[]>([])
const delData = async (row?: any) => {
  const elTableExpose = await getElTableExpose()
  ids.value = row ? [row.id] : elTableExpose?.getSelectionRows().map((v: any) => v.id) || []
  delLoading.value = true

  await delList(unref(ids).length).finally(() => {
    delLoading.value = false
  })
}
</script>

<style lang="less" scoped>
.subString {
  color: #747474;
  font-size: 14px;
  margin-right: 10px;
}
</style>
