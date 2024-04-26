<template>
  <div>
    <!-- <Search :schema="schema" @reset="setSearchParams" @search="setSearchParams" /> -->
    <div class="flex">
      <el-button type="primary" plain @click="bacthDelete" :loading="delLoading">{{
        t('project.batchDelete')
      }}</el-button>
      <el-button type="primary" @click="action()">{{ t('fields.add') }}</el-button>
    </div>
    <div v-if="flag">
      <Table
        sortType="autoType"
        class="mt-20px"
        @register="tableRegister"
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :columns="allSchemas.tableColumns"
        :data="dataListData"
        :loading="tableloading"
        @select="handleSelectionChange"
        @select-all="handleSelectionAllChange"
        @end="endSort"
      />
      <ElButton type="primary" class="mt-20px w-full" :loading="saveLoading" @click="dataListAdd()">
        {{ t('project.add') }}
      </ElButton>
    </div>

    <div class="w-100% h-300px" v-else v-loading="!flag"> </div>

    <Dialog v-model="dialogVisible" :title="dialogTitle" class="automatically">
      <Automatically
        v-if="dialogVisible"
        ref="AutomaticallyRef"
        :fieldConfigID="props.fieldConfigID"
      />
      <template #footer>
        <ElButton @click="dialogVisible = false">{{ t('common.cancel') }}</ElButton>
        <ElButton type="primary" :loading="saveLoading" @click="save()">
          {{ t('fields.generate') }}
        </ElButton>
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="tsx">
import { reactive, ref, unref } from 'vue'
import { FormSchema } from '@/components/Form'
import { useI18n } from '@/hooks/web/useI18n'
import { useTable } from '@/hooks/web/useTable'
import { useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { TableColumn, Table } from '@/components/Table'
import { Dialog } from '@/components/Dialog'
import Automatically from '../components/automatically.vue'
import { ElButton, ElInput, ElSwitch } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getGenerateColumn } from '@/api/authorization/menu'
import { nextTick } from 'process'

const flag = ref(true)
const { t } = useI18n()
const AutomaticallyRef = ref()
const props = defineProps({
  fieldConfigID: {
    type: String,
    default: () => ''
  }
})

const dialogVisible = ref(false)
const dialogTitle = ref('')
const saveLoading = ref(false)

const dataListData = ref([])

const { tableRegister, tableState, tableMethods } = useTable({
  fetchDataApi: async () => {
    const res = await getGenerateColumn({ id: props.fieldConfigID })
    dataListData.value = res.data || []
    return res
  }
})

const endSort = (evt) => {
  flag.value = false
  tableloading.value = true
  const startIndex = evt.startIndex
  const endIndex = evt.endIndex
  const delItem = dataListData.value[startIndex]
  dataListData.value.splice(startIndex, 1)
  dataListData.value.splice(endIndex, 0, delItem)

  setTimeout(() => {
    tableloading.value = false
    flag.value = true
  }, 200)
}

const { pageSize, currentPage } = tableState
const { getElTableExpose } = tableMethods

const tableloading = ref(false)

const chooseIdsList = ref<any>([]) //ids
const delLoading = ref(false)

const handleSelectionChange = (row: any) => {
  chooseIdsList.value = []
  row.forEach((e: any) => {
    chooseIdsList.value.push(e.sort)
  })
}

const handleSelectionAllChange = (row: any) => {
  chooseIdsList.value = []
  row.forEach((e: any) => {
    chooseIdsList.value.push(e.sort)
  })
}

const delList = () => {
  if (chooseIdsList.value.length == 0) {
    ElMessage.error(t('common.a5'))
    delLoading.value = false
    return
  }
  dataListData.value = dataListData.value.filter(function (item) {
    return chooseIdsList.value.indexOf(item.sort) < 0
  })
  delLoading.value = false
  return
}
const bacthDelete = async (row) => {
  delLoading.value = true
  ElMessageBox.confirm(t('common.delMessage'), t('common.delWarning'), {
    confirmButtonText: t('common.delOk'),
    cancelButtonText: t('common.delCancel'),
    type: 'warning'
  })
    .then(async () => {
      await delList()
    })
    .catch(() => {
      delLoading.value = false
    })
}

const dataListAdd = () => {
  const temp = dataListData.value.length
  dataListData.value.push({
    columnKey: '',
    wit: 120,
    columnValue: '',
    unStatus: 'STATUS_0_0_0_0',
    mustSelectedColumn: false,
    asColumnValue: '',
    remark: '',
    sort: temp
  })
}
const schema = reactive<FormSchema[]>([
  {
    field: 'tableName',
    label: '',
    component: 'Input',
    componentProps: {
      slots: {
        prepend: () => <div>{t('fields.tableName')}</div>
      }
    }
  }
])

const crudSchemas = reactive<TableColumn[]>([
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
    field: 'columnValue',
    label: t('fields.fieldName'),
    search: {
      hidden: true
    },
    slots: {
      default: (data: any) => {
        return (
          <>
            <ElInput modelValue={data.row.columnValue} v-model={data.row.columnValue} />
          </>
        )
      }
    }
  },
  {
    field: 'columnKey',
    label: t('fields.annotate'),
    search: {
      hidden: true
    },
    slots: {
      default: (data: any) => {
        return (
          <>
            <ElInput modelValue={data.row.columnKey} v-model={data.row.columnKey} />
          </>
        )
      }
    }
  },
  {
    field: 'wit',
    label: t('fields.width'),
    search: {
      hidden: true
    },
    slots: {
      default: (data: any) => {
        return (
          <>
            <ElInput modelValue={data.row.wit} v-model={data.row.wit} />
          </>
        )
      }
    }
  },
  {
    field: 'unStatus',
    label: t('fields.status'),
    search: {
      hidden: true
    },
    slots: {
      default: (data: any) => {
        return (
          <>
            <ElSwitch
              inactiveValue="UNACTIVE"
              activeValue="STATUS_0_0_0_0"
              modelValue={data.row.unStatus}
              v-model={data.row.unStatus}
            />
          </>
        )
      }
    }
  },
  {
    field: 'mustSelectedColumn',
    label: t('fields.mustSelectedColumn'),
    width: 90,
    search: {
      hidden: true
    },
    slots: {
      default: (data: any) => {
        return (
          <>
            <ElSwitch
              modelValue={data.row.mustSelectedColumn}
              v-model={data.row.mustSelectedColumn}
            />
          </>
        )
      }
    }
  },
  {
    field: 'asColumnValue',
    label: t('fields.isStr'),
    search: {
      hidden: true
    },
    slots: {
      default: (data: any) => {
        return (
          <>
            <ElInput modelValue={data.row.asColumnValue} v-model={data.row.asColumnValue} />
          </>
        )
      }
    }
  },
  {
    field: 'remark',
    label: t('fields.remark'),
    search: {
      hidden: true
    },
    slots: {
      default: (data: any) => {
        return (
          <>
            <ElInput modelValue={data.row.remark} v-model={data.row.remark} />
          </>
        )
      }
    }
  },
  {
    field: 'action',
    label: t('userDemo.action'),
    width: '100px',
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
          return (
            <>
              <span>
                <Icon icon="ep:delete" size={20} class="mt-2px" onClick={() => trachClick(data)} />
              </span>
              <span>
                <Icon icon="svg-icon:sort" size={20} class="mt-2px ml-10px sortIcon" />
              </span>
            </>
          )
        }
      }
    }
  }
])
const { allSchemas } = useCrudSchemas(crudSchemas)

const trachClick = (data) => {
  ElMessageBox.confirm(t('common.delMessage'), t('common.delWarning'), {
    confirmButtonText: t('common.delOk'),
    cancelButtonText: t('common.delCancel'),
    type: 'warning'
  }).then(async () => {
    dataListData.value.splice(data.$index, 1)
  })
}

const action = () => {
  dialogVisible.value = true
  dialogTitle.value = t('fields.add')
}

defineExpose({
  dataListData
})
const save = () => {
  dialogVisible.value = false
  const Automatically = unref(AutomaticallyRef)
  for (let item in Automatically?.dataList) {
    dataListData.value.push(Automatically?.dataList[item])
  }
}
</script>
