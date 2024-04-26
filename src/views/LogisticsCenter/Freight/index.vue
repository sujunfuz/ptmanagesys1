<template>
  <ContentWrap>
    <div class="flex-b">
      <Search
        v-hasPermi="'logisticsCenter:ecFreightTemplate:list'"
        :schema="schema"
        @reset="setSearchParams"
        @search="setSearchParams"
        :showReset="false"
      />
      <ElButton
        v-hasPermi="'logisticsCenter:ecFreightTemplate:add'"
        type="primary"
        @click="push('/logisticsCenter/freight/addTemplate')"
        >{{ t('project.add') }}</ElButton
      >
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

<script lang="tsx" setup>
import { ContentWrap } from '@/components/ContentWrap'
import { ElButton } from 'element-plus'
import { ref, reactive, unref, onMounted } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import { Table } from '@/components/Table'
import { Search } from '@/components/Search'
import { FormSchema } from '@/components/Form'
import { useTable } from '@/hooks/web/useTable'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { useRouter } from 'vue-router'
// import { divide } from 'lodash-es'
import { getFreightListApi, deleteFreightByBatchNoApi } from '@/api/LogisticsCenter/freight'
import { useAppStore } from '@/store/modules/app'
const appStore = useAppStore()
appStore.setRenderLoading(true)

const { push } = useRouter()

const searchParams = ref({})
const { t } = useI18n()

const setSearchParams = (params: any) => {
  currentPage.value = 1
  searchParams.value = params
  getList()
}

const { tableRegister, tableState, tableMethods } = useTable({
  fetchDataApi: async () => {
    const { pageSize, currentPage } = tableState
    const res = await getFreightListApi({
      currentPage: unref(currentPage),
      pageSize: unref(pageSize),
      ...unref(searchParams)
    })
    return {
      list: res.data.list || [],
      total: res.data.total || 0
    }
  },
  fetchDelApi: async () => {
    const res = await deleteFreightByBatchNoApi([currentRow.value.batchNo])
    return res
  },
  immediate: false
})
const { total, loading, dataList, pageSize, currentPage } = tableState
const { getList, getElTableExpose, delList } = tableMethods

const schema = reactive<FormSchema[]>([
  {
    field: 'templateName',
    label: '',
    component: 'Input',
    componentProps: {
      slots: {
        prepend: () => <div>{t('Freight.name')}</div>
      }
    }
  }
])

const crudSchemas = reactive<CrudSchema[]>([
  {
    field: 'templateName',
    label: t('Freight.name'),
    search: {
      hidden: true
    }
  },
  {
    field: 'address',
    label: t('Freight.address'),
    width: '250px',
    search: {
      hidden: true
    },
    table: {
      slots: {
        default: (data: any) => {
          const row = data.row
          return (
            <div class="flex justify-between flex-col font-size-14px color-colorBlack">
              {row.freightTemplateDetailList.map((item, index) => {
                if (index == 0) {
                  return (
                    <div class="w-100% text-ellipsis text-nowrap overflow-hidden">
                      {item.areaName}
                    </div>
                  )
                } else {
                  return (
                    <>
                      <div class="w-100% h-1px bg-#E8EAED mt-10px mb-10px"></div>
                      <div class="w-100% text-ellipsis text-nowrap overflow-hidden">
                        {item.areaName}
                      </div>
                    </>
                  )
                }
              })}
            </div>
          )
        }
      }
    }
  },
  {
    field: 'first',
    label: t('Freight.first'),
    search: {
      hidden: true
    },
    table: {
      slots: {
        default: (data: any) => {
          const row = data.row
          return (
            <div class="flex justify-between flex-col font-size-14px color-colorBlack">
              {row.freightTemplateDetailList.map((item, index) => {
                if (index == 0) {
                  return <div class="w-100%">{item.defaultNum}</div>
                } else {
                  return (
                    <>
                      <div class="w-100% h-1px bg-#E8EAED mt-10px mb-10px"></div>
                      <div class="w-100%">{item.defaultNum}</div>
                    </>
                  )
                }
              })}
            </div>
          )
        }
      }
    }
  },
  {
    field: 'amoney',
    label: t('Freight.money'),
    search: {
      hidden: true
    },
    table: {
      slots: {
        default: (data: any) => {
          const row = data.row
          return (
            <div class="flex justify-between flex-col font-size-14px color-colorBlack">
              {row.freightTemplateDetailList.map((item, index) => {
                if (index == 0) {
                  return <div class="w-100%">{item.defaultAmount}</div>
                } else {
                  return (
                    <>
                      <div class="w-100% h-1px bg-#E8EAED mt-10px mb-10px"></div>
                      <div class="w-100%">{item.defaultAmount}</div>
                    </>
                  )
                }
              })}
            </div>
          )
        }
      }
    }
  },
  {
    field: 'continuation',
    label: t('Freight.continuation'),
    search: {
      hidden: true
    },
    table: {
      slots: {
        default: (data: any) => {
          const row = data.row
          return (
            <div class="flex justify-between flex-col font-size-14px color-colorBlack">
              {row.freightTemplateDetailList.map((item, index) => {
                if (index == 0) {
                  return <div class="w-100%">{item.followingNum}</div>
                } else {
                  return (
                    <>
                      <div class="w-100% h-1px bg-#E8EAED mt-10px mb-10px"></div>
                      <div class="w-100%">{item.followingNum}</div>
                    </>
                  )
                }
              })}
            </div>
          )
        }
      }
    }
  },
  {
    field: 'bmoney',
    label: t('Freight.money'),
    search: {
      hidden: true
    },
    table: {
      slots: {
        default: (data: any) => {
          const row = data.row
          return (
            <div class="flex justify-between flex-col font-size-14px color-colorBlack w-100% h-100%">
              {row.freightTemplateDetailList.map((item, index) => {
                if (index == 0) {
                  return <div class="w-100%">{item.followingAmount}</div>
                } else {
                  return (
                    <>
                      <div class="w-100% h-1px bg-#E8EAED mt-10px mb-10px"></div>
                      <div class="w-100%">{item.followingAmount}</div>
                    </>
                  )
                }
              })}
            </div>
          )
        }
      }
    }
  },
  {
    field: 'editTimeStr',
    label: t('Freight.editTime'),
    width: '150px',
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
                <span
                  v-hasPermi="logisticsCenter:ecFreightTemplate:add"
                  onClick={() => action('copy', row)}
                >
                  {' '}
                  {t('Freight.copy')}{' '}
                </span>
                <span
                  v-hasPermi="logisticsCenter:ecFreightTemplate:edit"
                  onClick={() => action('edit', row)}
                >
                  {' '}
                  {t('project.edit')}{' '}
                </span>
                <span
                  v-hasPermi="logisticsCenter:ecFreightTemplate:delete"
                  class="color-red-500"
                  onClick={() => action('delete', row)}
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

const currentRow = ref<any>({})
const openType = ref('')
const action = async (type, row) => {
  openType.value = type
  currentRow.value = row
  switch (type) {
    case 'copy':
    case 'edit':
      push(`/logisticsCenter/freight/addTemplate?id=${row.id}&openType=${type}`)
      break
    case 'delete':
      delList(1)
      break
  }
}

onMounted(() => {
  getList()
})
</script>
