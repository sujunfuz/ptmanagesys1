<template>
  <ContentWrap>
    <div class="flex-b">
      <Search :schema="schema" @reset="setSearchParams" @search="setSearchParams" />
      <div class="flex">
        <ElButton  plain @click="fieldVisible = true">{{
          t('common.fieldFiltering')
        }}</ElButton>
        <ElButton type="primary" v-hasPermi="'pms:param:addparam'" plain @click="AddAction">{{
          t('parameterDemo.addParameter')
        }}</ElButton>
        <ElButton type="primary" v-hasPermi="'pms:param:refreshparam'" @click="AddActionReFresh">{{
          t('parameterDemo.parameterFlush')
        }}</ElButton>
      </div>
    </div>
  </ContentWrap>
  <ContentWrap class="mt-20px flex-1" :isBlock="false">
    <Table
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :columns="allSchemas"
      :data="dataList"
      :loading="loading"
      @register="tableRegister"
      :pagination="{
        total,
        layout: ' ->, total, sizes, prev, pager, next, jumper'
      }"
    />
  </ContentWrap>

  <Dialog v-model="dialogVisible" :title="dialogTitle" max-height="170px">
    <Write ref="writeRef" />

    <template #footer v-if="actionType === 'edit' || actionType === 'add'">
      <ElButton @click="dialogVisible = false">{{ t('common.cancel') }}</ElButton>
      <ElButton type="primary" :loading="saveLoading" @click="save">
        {{ t('project.confirm') }}
      </ElButton>
    </template>
  </Dialog>
  <FieldFilter
    v-if="fieldVisible"
    v-model:fieldVisible="fieldVisible"
    :ui-url="'/param/operatorSortColumnUI'"
    :sort-url="'/param/operatorSortColumn'"
  />
</template>

<script setup lang="tsx">
import { ContentWrap } from '@/components/ContentWrap'
import { useI18n } from '@/hooks/web/useI18n'
import { ref, unref, reactive, nextTick, onMounted, watch } from 'vue'
import { ElButton, ElMessageBox } from 'element-plus'
import { useTable } from '@/hooks/web/useTable'
import { Search } from '@/components/Search'
import Write from './components/Write.vue'
import { Dialog } from '@/components/Dialog'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { FormSchema } from '@/components/Form'
import { Table } from '@/components/Table'
import {
  getParamListApi,
  refreshParamListApi,
  addParamApi,
  updateParamApi,
  deleteParamApi,
  getParamPageTop
} from '@/api/systemconfig/paramsApi'
import FieldFilter from '@/components/customComponents/FieldFilter/index.vue'
import generateSchema from '@/utils/schemaUtil'
import { useAppStore } from '@/store/modules/app'
const appStore = useAppStore()
appStore.setRenderLoading(true)

const fieldVisible = ref(false)
const { t } = useI18n()

const { tableRegister, tableState, tableMethods } = useTable({
  fetchDataApi: async () => {
    const { pageSize, currentPage } = tableState
    const res = await getParamListApi({
      pageSize: pageSize.value,
      currentPage: currentPage.value,
      ...searchParams.value
    })
    return res.data
  },
  fetchDelApi: async () => {
    const res = await deleteParamApi({
      id: delId.value
    })
    return res
  },
  immediate: false
})
const { total, loading, dataList, pageSize, currentPage } = tableState
const { getList, delList } = tableMethods

const crudSchemas = reactive<CrudSchema[]>([
  {
    field: 'paramName',
    label: t('parameterDemo.parameter'),
    search: {
      hidden: true
    }
  },
  {
    field: 'paramText',
    label: t('parameterDemo.content'),
    search: {
      hidden: true
    }
  },
  {
    field: 'remark',
    label: t('parameterDemo.remark'),
    search: {
      hidden: true
    }
  },
  {
    field: 'createTime',
    label: t('parameterDemo.createTime'),
    search: {
      hidden: true
    }
  },
  {
    field: 'editTime',
    label: t('parameterDemo.editTime'),
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
          const row = data.row
          return (
            <>
              <div class="[&>span]:(cursor-pointer m-2) flex flex-wrap colorMain ">
                <span v-hasPermi="pms:param:view" onClick={() => action(row, 'look')}>
                  {' '}
                  {t('project.view')}{' '}
                </span>
                <span v-hasPermi="pms:param:edit" onClick={() => action(row, 'edit')}>
                  {' '}
                  {t('project.edit')}{' '}
                </span>
                <span
                  v-hasPermi="pms:param:delete"
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

// const { allSchemas } = useCrudSchemas(crudSchemas)
const allSchemas = ref<any>([])
const schema = reactive<FormSchema[]>([
  {
    field: 'paramName',
    label: '',
    component: 'Input',
    componentProps: {
      slots: {
        prepend: () => <div>{t('parameterDemo.parameter')}</div>
      }
    }
  },
  {
    field: 'paramText',
    label: '',
    component: 'Input',
    componentProps: {
      slots: {
        prepend: () => <div>{t('parameterDemo.content')}</div>
      }
    }
  }
])

const searchParams = ref({})
const setSearchParams = (params: any) => {
  currentPage.value = 1
  searchParams.value = params
  getList()
}

const dialogVisible = ref(false)
const dialogTitle = ref('')

const actionType = ref('')

const AddAction = () => {
  dialogTitle.value = t('project.add')
  dialogVisible.value = true
  actionType.value = 'add'
}

const AddActionReFresh = () => {
  ElMessageBox.confirm(t('common.refreshparameters'), t('common.delWarning'), {
    confirmButtonText: t('project.confirm'),
    cancelButtonText: t('common.cancel'),
    type: 'warning'
  })
    .then(() => {
      refreshParamListApi()
    })
    .catch(() => {})
}

const delLoading = ref(false)
const delId = ref<string>('')

const delData = async (row: any) => {
  delId.value = row.id
  delLoading.value = true

  await delList(1).finally(() => {
    delLoading.value = false
  })
}

const action = (row: any, type: string) => {
  dialogTitle.value = t(
    type === 'edit'
      ? 'project.edit'
      : type === 'viewAssociation'
      ? 'fields.viewAssociation'
      : 'project.view'
  )

  actionType.value = type
  dialogVisible.value = true
  nextTick(() => {
    writeRef.value?.formMethods.setValues(row)
    actionType.value == 'look' &&
      writeRef.value?.formMethods.setSchema([
        {
          field: 'paramName',
          path: 'componentProps.readonly',
          value: true
        },
        {
          field: 'paramText',
          path: 'componentProps.readonly',
          value: true
        },
        {
          field: 'remark',
          path: 'componentProps.readonly',
          value: true
        }
      ])
  })
}

const writeRef = ref<ComponentRef<typeof Write>>()

const saveLoading = ref(false)

const save = async () => {
  const write = unref(writeRef)
  const formData = await write?.submit()
  if (formData) {
    saveLoading.value = true
    try {
      let res: any = null
      if (actionType.value == 'add') {
        res = await addParamApi(formData)
      } else if (actionType.value == 'edit') {
        res = await updateParamApi(formData)
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
onMounted(async () => {
  await init()
})
watch(
  () => fieldVisible.value,
  (val) => {
    if (!val) {
      init()
    }
  }
)
const staticSchema = []
const actionSchema = {
  field: 'action',
  label: t('userDemo.action'),
  fixed: 'right',
  minWidth: '300px',
  slots: {
    default: (data: any) => {
      const row = data.row
      return (
        <>
          <div class="[&>span]:(cursor-pointer m-2) flex flex-wrap colorMain ">
            <span v-hasPermi="pms:param:view" onClick={() => action(row, 'look')}>
              {' '}
              {t('project.view')}{' '}
            </span>
            <span v-hasPermi="pms:param:edit" onClick={() => action(row, 'edit')}>
              {' '}
              {t('project.edit')}{' '}
            </span>
            <span v-hasPermi="pms:param:delete" class="color-red-500" onClick={() => delData(row)}>
              {t('role.delete')}
            </span>
          </div>
        </>
      )
    }
  }
}
const init = async () => {
  appStore.setRenderLoading(true)
  const res = await getParamPageTop()
  if (res) {
    let arr = generateSchema(res.data.pageColumn, staticSchema)
    arr.push(actionSchema)
    allSchemas.value = arr
  }
  nextTick(() => {
    getList()
  })
}
</script>
