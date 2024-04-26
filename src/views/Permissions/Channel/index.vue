<template>
  <ContentWrap>
    <Search :schema="schema" @reset="setSearchParams" @search="setSearchParams" />
    <div class="mb-10px">
      <ElButton type="primary" @click="AddAction">{{ t('project.add') }}</ElButton>
    </div>

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

  <Dialog v-model="dialogVisible" :title="dialogTitle">
    <Write ref="writeRef" />

    <template #footer v-if="actionType === 'edit' || actionType === 'add'">
      <ElButton @click="dialogVisible = false">{{ t('common.cancel') }}</ElButton>
      <ElButton type="primary" :loading="saveLoading" @click="save">
        {{ t('project.confirm') }}
      </ElButton>
    </template>
  </Dialog>
</template>

<script setup lang="tsx">
import { ContentWrap } from '@/components/ContentWrap'
import { useI18n } from '@/hooks/web/useI18n'
import { ref, unref, watch, reactive, nextTick } from 'vue'
import { ElButton, ElTree, ElOption } from 'element-plus'
import { saveUserApi, deleteUserByIdApi } from '@/api/department'
import type { DepartmentUserItem } from '@/api/department/types'
import { useTable } from '@/hooks/web/useTable'
import { Search } from '@/components/Search'
import Write from './components/Write.vue'
import { Dialog } from '@/components/Dialog'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { SelectOption, FormSchema } from '@/components/Form'
import { dateTimeRange } from '@/utils/time'
import { Table } from '@/components/Table'
import { tableStatusStyle } from '@/utils/componentUtils'

const { t } = useI18n()

const { tableRegister, tableState, tableMethods } = useTable({
  fetchDataApi: async () => {
    // const { pageSize, currentPage } = tableState
    // const res = await getUserByIdApi({
    //   id: unref(currentNodeKey),
    //   pageIndex: unref(currentPage),
    //   pageSize: unref(pageSize),
    //   ...unref(searchParams)
    // })
    return {
      list: [
        {
          createTime: '1694586221798',
          createTimestr: '2023-09-13 14:23:41',
          dictType: 'range',
          editTime: null,
          editTimeStr: '',
          id: 'eb881167c62eacf2e19f5d47ee929b3c',
          itemCode: 'useRange',
          itemText: '指定商城商品',
          itemvalue: 'ASSIGN_MALL_GOODS',
          remark: '使用范围',
          sort: 5,
          status: 'ACTIVE',
          statusStr: '激活'
        },
        {
          createTime: '1694586221798',
          createTimestr: '2023-09-13 14:23:41',
          dictType: 'range',
          editTime: null,
          editTimeStr: '',
          id: 'eb881167c62eacf2e19f5d47ee929b3c',
          itemCode: 'useRange',
          itemText: '指定商城商品',
          itemvalue: 'ASSIGN_MALL_GOODS',
          remark: '使用范围',
          sort: 5,
          status: 'ACTIVE',
          statusStr: '激活'
        }
      ],
      total: 2
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
    field: 'createTimeStr',
    label: t('exampleDemo.displayTime'),
    search: {
      hidden: true
    }
  },
  {
    field: 'editTimeStr',
    label: t('exampleDemo.editTime'),
    search: {
      hidden: true
    }
  },
  {
    field: 'channelCode',
    label: t('channel.channelCode'),
    search: {
      hidden: true
    }
  },
  {
    field: 'channelName',
    label: t('channel.channelName'),
    search: {
      hidden: true
    }
  },
  {
    field: 'thoroughfareType',
    label: t('channel.thoroughfareType'),
    search: {
      hidden: true
    }
  },
  {
    field: 'payTypeStr',
    label: t('channel.payType'),
    search: {
      hidden: true
    }
  },
  {
    field: 'appid',
    label: t('channel.appid'),
    search: {
      hidden: true
    }
  },
  {
    field: 'mid',
    label: t('channel.mid'),
    search: {
      hidden: true
    }
  },
  {
    field: 'privateKey',
    label: t('channel.privateKey'),
    search: {
      hidden: true
    }
  },
  {
    field: 'publicKey',
    label: t('channel.publicKey'),
    search: {
      hidden: true
    }
  },
  {
    field: 'reqUrl',
    label: t('channel.reqUrl'),
    search: {
      hidden: true
    }
  },
  {
    field: 'notifyUrl',
    label: t('channel.notifyUrl'),
    search: {
      hidden: true
    }
  },
  {
    field: 'returnUrl',
    label: t('channel.returnUrl'),
    search: {
      hidden: true
    }
  },
  {
    field: 'rate',
    label: t('channel.rate'),
    search: {
      hidden: true
    }
  },
  {
    field: 'currencyStr',
    label: t('channel.currency'),
    search: {
      hidden: true
    }
  },
  {
    field: 'data',
    label: t('channel.data'),
    search: {
      hidden: true
    }
  },
  {
    field: 'sort',
    label: t('dictionariesParameter.sort'),
    search: {
      hidden: true
    }
  },
  {
    field: 'statusStr',
    label: t('dictionariesParameter.statusStr'),
    search: {
      hidden: true
    },
    formatter: (cellValue: string) => {
      return tableStatusStyle(cellValue)
    }
  },
  {
    field: 'remark',
    label: t('dictionariesParameter.remark'),
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
              <div class="[&>span]:(cursor-pointer m-2) flex flex-wrap colorMain ">
                <span onClick={() => action(row, 'look')}> {t('project.view')} </span>
                <span onClick={() => action(row, 'edit')}> {t('project.edit')} </span>
                <span class="color-red-500" onClick={() => delData(row)}>
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

const schema = reactive<FormSchema[]>([
  {
    field: 'thoroughfare',
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
        prefix: () => <div>{t('channel.thoroughfare')}</div>
      },
      on: {
        change: () => {
          console.log('1222')
        }
      }
    }
  },
  {
    field: 'thoroughfareType',
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
        prefix: () => <div>{t('channel.thoroughfareType')}</div>
      },
      on: {
        change: () => {
          console.log('1222')
        }
      }
    }
  },
  {
    field: 'status',
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
        prefix: () => <div>{t('channel.status')}</div>
      },
      on: {
        change: () => {
          console.log('1222')
        }
      }
    }
  },
  {
    field: 'time',
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
          field: 'channelCode',
          path: 'componentProps.disabled',
          value: true
        },
        {
          field: 'thoroughfareType',
          path: 'componentProps.disabled',
          value: true
        },
        {
          field: 'payType',
          path: 'componentProps.disabled',
          value: true
        },
        {
          field: 'appid',
          path: 'componentProps.disabled',
          value: true
        },
        {
          field: 'mid',
          path: 'componentProps.disabled',
          value: true
        },
        {
          field: 'privateKey',
          path: 'componentProps.disabled',
          value: true
        },
        {
          field: 'publicKey',
          path: 'componentProps.disabled',
          value: true
        },
        {
          field: 'reqUrl',
          path: 'componentProps.disabled',
          value: true
        },
        {
          field: 'notifyUrl',
          path: 'componentProps.disabled',
          value: true
        },
        {
          field: 'returnUrl',
          path: 'componentProps.disabled',
          value: true
        },
        {
          field: 'rate',
          path: 'componentProps.disabled',
          value: true
        },
        {
          field: 'currency',
          path: 'componentProps.disabled',
          value: true
        },
        {
          field: 'data',
          path: 'componentProps.disabled',
          value: true
        },
        {
          field: 'sort',
          path: 'componentProps.disabled',
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
