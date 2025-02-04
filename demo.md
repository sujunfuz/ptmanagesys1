```base
<script setup lang="tsx">
import { ContentWrap } from '@/components/ContentWrap'
import { useI18n } from '@/hooks/web/useI18n'
import { Table } from '@/components/Table'
import { ref, unref, watch, reactive } from 'vue'
import { ElButton, ElTree, ElOption } from 'element-plus'
import { getUserByIdApi, saveUserApi, deleteUserByIdApi } from '@/api/department'
import type { DepartmentUserItem } from '@/api/department/types'
import { useTable } from '@/hooks/web/useTable'
import { Search } from '@/components/Search'
import Write from './components/Write.vue'
import Detail from './components/Detail.vue'
import { Dialog } from '@/components/Dialog'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { SelectOption, FormSchema } from '@/components/Form'
import { dateTimeRange } from '@/utils/time'

const { t } = useI18n()

const { tableRegister, tableState, tableMethods } = useTable({
  fetchDataApi: async () => {
    const { pageSize, currentPage } = tableState
    const res = await getUserByIdApi({
      id: unref(currentNodeKey),
      pageIndex: unref(currentPage),
      pageSize: unref(pageSize),
      ...unref(searchParams)
    })
    return {
      list: res.data.list || [],
      total: res.data.total || 0
    }
  },
  fetchDelApi: async () => {
    const res = await deleteUserByIdApi(unref(ids))
    return res
  }
})
const { total, loading, dataList, pageSize, currentPage } = tableState
const { getList, getElTableExpose, delList } = tableMethods

const crudSchemas = reactive<CrudSchema[]>([
  {
    field: 'selection',
    search: {
      hidden: true
    },
    form: {
      hidden: true
    },
    detail: {
      hidden: true
    },
    table: {
      type: 'selection'
    }
  },
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
    field: 'loginName',
    label: t('userDemo.operatorLoginName')
  },
  {
    field: 'operatorName',
    label: t('userDemo.operatorName'),
    search: {
      hidden: true
    },
    form: {
      component: 'Select',
      componentProps: {
        style: {
          width: '100%'
        },
        options: [
          {
            label: '重要',
            value: 3
          },
          {
            label: '良好',
            value: 2
          },
          {
            label: '一般',
            value: 1
          }
        ]
      }
    }
  },
  {
    field: 'createTime',
    label: t('userDemo.createTime'),
    search: {
      hidden: true
    },
    form: {
      component: 'DatePicker',
      componentProps: {
        type: 'datetime',
        valueFormat: 'YYYY-MM-DD HH:mm:ss'
      }
    }
  },
  {
    field: 'iphone',
    label: t('userDemo.iphone'),
    form: {
      component: 'Input',
      hidden: true
    },
    search: {
      hidden: true
    }
  },
  {
    field: 'action',
    label: t('userDemo.action'),
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
      width: 240,
      slots: {
        default: (data: any) => {
          const row = data.row as DepartmentUserItem
          return (
            <>
              <ElButton type="success" onClick={() => action(row, 'detail')}>
                {t('exampleDemo.detail')}
              </ElButton>
              <ElButton type="primary" onClick={() => action(row, 'edit')}>
                {t('exampleDemo.edit')}
              </ElButton>
              <ElButton type="primary" onClick={() => action(row, 'edit')}>
                {t('userDemo.disable')}
              </ElButton>
              <ElButton type="danger" onClick={() => delData(row)}>
                {t('exampleDemo.del')}
              </ElButton>
            </>
          )
        }
      }
    }
  }
])

const { allSchemas } = useCrudSchemas(crudSchemas)

const schema = reactive<FormSchema[]>([
  {
    field: 'field5',
    label: '',
    component: 'Input',
    componentProps: {
      slots: {
        prepend: () => <div>{t('operator.loginName')}</div>
        // append: () => <Icon icon="ep:share" />
      },
      on: {
        change: () => {
          console.log('-----')
        }
      }
    }
  },
  {
    field: 'field15',
    label: '',
    component: 'Select',
    componentProps: {
      options: [
        {
          label: 'option1',
          value: '1'
        },
        {
          label: 'option2',
          value: '2'
        }
      ],
      slots: {
        default: (options: SelectOption[]) => {
          if (options.length) {
            return options?.map((v) => {
              return <ElOption key={v.value} label={v.label} value={v.value} />
            })
          } else {
            return null
          }
        },
        prefix: () => <div>{t('operator.loginName')}</div>
      },
      on: {
        change: () => {
          console.log('1222')
        }
      }
    }
  },
  {
    field: 'field53',
    component: 'DatePicker',
    componentProps: dateTimeRange()
  }
])

const searchParams = ref({})
const setSearchParams = (params: any) => {
  currentPage.value = 1
  searchParams.value = params
  getList()
}

const treeEl = ref<typeof ElTree>()

const currentNodeKey = ref('')

const currentDepartment = ref('')
watch(
  () => currentDepartment.value,
  (val) => {
    unref(treeEl)!.filter(val)
  }
)

const dialogVisible = ref(false)
const dialogTitle = ref('')

const currentRow = ref<DepartmentUserItem>()
const actionType = ref('')

const AddAction = () => {
  dialogTitle.value = t('exampleDemo.add')
  currentRow.value = undefined
  dialogVisible.value = true
  actionType.value = ''
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

const action = (row: DepartmentUserItem, type: string) => {
  dialogTitle.value = t(type === 'edit' ? 'exampleDemo.edit' : 'exampleDemo.detail')
  actionType.value = type
  currentRow.value = { ...row, department: unref(treeEl)?.getCurrentNode() || {} }
  dialogVisible.value = true
}

const writeRef = ref<ComponentRef<typeof Write>>()

const saveLoading = ref(false)

const save = async () => {
  const write = unref(writeRef)
  const formData = await write?.submit()
  console.log(formData)
  if (formData) {
    saveLoading.value = true
    try {
      const res = await saveUserApi(formData)
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

'<template>
  <ContentWrap>
    <Search :schema="schema" @reset="setSearchParams" @search="setSearchParams" />
    <div class="mb-10px">
      <ElButton type="primary" @click="AddAction">{{ t('exampleDemo.add') }}</ElButton>
      <ElButton :loading="delLoading" type="danger" @click="delData()">
        {{ t('exampleDemo.del') }}
      </ElButton>
    </div>

    <Table
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :columns="allSchemas.tableColumns"
      :data="dataList"
      :loading="loading"
      @register="tableRegister"
      :pagination="{
        total
      }"
    />
  </ContentWrap>

  <Dialog v-model="dialogVisible" :title="dialogTitle">
    <Write
      v-if="actionType !== 'detail'"
      ref="writeRef"
      :form-schema="allSchemas.formSchema"
      :current-row="currentRow"
    />

    <Detail
      v-if="actionType === 'detail'"
      :detail-schema="allSchemas.detailSchema"
      :current-row="currentRow"
    />

    <template #footer>
      <ElButton v-if="actionType !== 'detail'" type="primary" :loading="saveLoading" @click="save">
        {{ t('project.confirm') }}
      </ElButton>
      <ElButton @click="dialogVisible = false">{{ t('dialogDemo.close') }}</ElButton>
    </template>
  </Dialog>
</template>'
```