<template>
  <div class="flex-b">
    <Search
      v-hasPermi="'operatoing:operatoing:edit'"
      :schema="Allschema"
      @reset="setSearchParams"
      @search="setSearchParams"
    />
    <ElButton
      v-hasPermi="'operatoing:operatoing:add'"
      type="primary"
      v-if="openType == 'operate'"
      :loading="saveLoading"
      @click="addProduct"
    >
      {{
        tabPosition == 'RECOMMEND_TYPE_GOODS'
          ? t('project.add') + t('orderManage.commodity')
          : t('project.add') + t('RotationChart.sub7')
      }}
    </ElButton>
  </div>
  <ElButton
    v-hasPermi="'operatoing:operatoing:delete'"
    size="small"
    class="mt-20px"
    v-if="openType == 'operate'"
    @click="batchDelete"
    >{{ t('project.batchDelete') }}</ElButton
  >
  <div class="mt-20px">
    <!-- @select="select"
      @row-click="selectClick" -->
    <Table
      ref="multipleTableRef"
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :columns="allSchemas.tableColumns"
      :data="dataList"
      :loading="loading"
      @selection-change="handleSelectionChange"
      @register="tableRegister"
      :pagination="{
        total,
        layout: ' ->, total, sizes, prev, pager, next, jumper'
      }"
    />
  </div>
  <Dialog v-model="dialogVisible" :title="dialogTitle" class="dialogAdd">
    <AddChoose
      ref="addChooseRef"
      :tabPosition="tabPosition"
      :openType="dialogType"
      :goodsStatusEnum="goodsStatusEnum"
    />
    <template #footer>
      <!-- <ElButton class="w-70px !h-40px" @click="dialogVisible = false">{{
        t('project.cancel')
      }}</ElButton> -->
      <ElButton @click="submit" class="w-70px !h-40px" type="primary">{{
        t('project.confirm')
      }}</ElButton>
    </template>
  </Dialog>
</template>

<script setup lang="tsx">
import { useI18n } from '@/hooks/web/useI18n'
import { ref, unref, watch, reactive, nextTick, computed } from 'vue'
import { ElTree, ElMessage, ElImage, ElButton, ElMessageBox, ElTag } from 'element-plus'
import {
  getDefaultListApi,
  postPageListApi,
  postPageTopApi,
  postAddOperatingApi,
  postDeleteBatchByIdApi
} from '@/api/operationCenter/recommendation'
import { useTable } from '@/hooks/web/useTable'
import { Search } from '@/components/Search'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { FormSchema } from '@/components/Form'
import { dateTimeRange } from '@/utils/time'
import { Table } from '@/components/Table'
import { createImageViewer } from '@/components/ImageViewer'
import AddChoose from './AddChoose.vue'
import { Dialog } from '@/components/Dialog'

const { t } = useI18n()

const chooseItem = ref()
const saveLoading = ref(false)

const multipleTableRef = ref()
const goodsStatusEnum = ref()

const dialogType = ref()
const dialogVisible = ref(false)
const dialogTitle = ref('')

const multipleSelection = ref([])
const handleSelectionChange = (val) => {
  multipleSelection.value = val
}

const batchDelete = async () => {
  if (multipleSelection.value.length > 1) {
    ElMessageBox.alert(t('common.delMessage'), t('common.delWarning'), {
      confirmButtonText: t('common.ok'),
      callback: async () => {
        let arr = []
        multipleSelection.value.map((item) => {
          arr.push(item.id)
        })
        const res = await postDeleteBatchByIdApi({
          ids: arr,
          id: props.openId
        })
        if (res.code == 200) {
          ElMessage.success(t('common.operateSuccess'))
          getList()
        }
      }
    })
  } else {
    ElMessage.error(t('common.choose'))
  }
}

// const select = (selection, row) => {
//   // 清除 所有勾选项
//   multipleTableRef.value.elTableRef.clearSelection()
//   // 当表格数据都没有被勾选的时候 就返回
//   // 主要用于将当前勾选的表格状态清除
//   if (selection.length == 0) return
//   multipleTableRef.value.elTableRef.toggleRowSelection(row, true)
// }

// // 控制单选——table选择项发生变化时
// const selectClick = (row) => {
//   const selectData = multipleSelection.value
//   multipleTableRef.value.elTableRef.clearSelection()
//   if (selectData.length == 1) {
//     selectData.forEach((item) => {
//       // 判断 如果当前的一行被勾选, 再次点击的时候就会取消选中
//       if (item == row) {
//         multipleTableRef.value.elTableRef.toggleRowSelection(row, false)
//       }
//       // 不然就让当前的一行勾选
//       else {
//         multipleTableRef.value.elTableRef.toggleRowSelection(row, true)
//       }
//     })
//   } else {
//     multipleTableRef.value.elTableRef.toggleRowSelection(row, true)
//   }
// }

const toggleSelection = async (rows) => {
  await getList()
  //   nextTick(() => {
  for (let item in dataList.value) {
    if (rows == dataList.value[item].id) {
      multipleTableRef.value.elTableRef.toggleRowSelection(dataList.value[item], true)
    }
  }
  //   })
}

const ids = ref<string[]>([])

const { tableRegister, tableState, tableMethods } = useTable({
  fetchDataApi: async () => {
    const { pageSize, currentPage } = tableState
    let res
    if (props.openType == 'acquiesce') {
      res = await getDefaultListApi({
        currentPage: unref(currentPage),
        pageSize: unref(pageSize),
        ...unref(searchParams),
        id: props.openId
      })
    } else {
      res = await postPageListApi({
        currentPage: unref(currentPage),
        pageSize: unref(pageSize),
        ...unref(searchParams),
        id: props.openId,
        type: props.tabPosition
      })
    }
    return {
      list: res.data.list,
      total: res.data.total
    }
  },
  fetchDelApi: async () => {
    const res = await postDeleteBatchByIdApi({ id: props.openId, ids: unref(ids) })
    return res
  }
})
const { total, loading, dataList, pageSize, currentPage } = tableState
const { getList, delList, getElTableExpose } = tableMethods

const clickImage = (data) => {
  createImageViewer({
    urlList: [data]
  })
}

const addProduct = async () => {
  const res = await postPageTopApi()
  goodsStatusEnum.value = res.data.status
  props.tabPosition == 'RECOMMEND_TYPE_GOODS'
    ? (dialogType.value = 'relevancyId1')
    : (dialogType.value = 'relevancyId2')

  dialogTitle.value =
    props.tabPosition == 'RECOMMEND_TYPE_GOODS'
      ? t('Recommendation.add1')
      : t('Recommendation.add2')
  dialogVisible.value = true
}

const props = defineProps({
  openType: {
    type: String,
    default: () => ''
  },
  tabPosition: {
    type: String,
    default: () => ''
  },
  openId: {
    type: String,
    default: () => ''
  }
})

const Allschema = computed(() => {
  return props.tabPosition == 'RECOMMEND_TYPE_GOODS' ? schema : baseSchema
})

const baseSchema = reactive<FormSchema[]>([
  {
    field: 'param',
    label: '',
    component: 'Input',
    componentProps: {
      slots: {
        prepend: () => <div>{t('RotationChart.sub7')}</div>
        // append: () => <Icon icon="ep:share" />
      }
    }
  }
])

const imgUrl = import.meta.env.VITE_IMG_URL

const crudSchemas1 = reactive<CrudSchema[]>([
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
    label:
      props.tabPosition == 'RECOMMEND_TYPE_GOODS'
        ? t('productList.name')
        : t('RotationChart.name2'),
    search: {
      hidden: true
    },
    width: '250px',
    table: {
      slots: {
        default: (data: any) => {
          const image = data.row.image
          return (
            <>
              <div class="flex">
                <div onClick={() => clickImage(imgUrl + image)}>
                  <ElImage src={imgUrl + image} style="width:70px;height: 70px"></ElImage>
                </div>

                <div style="width: 150px;" class="ml-10px">
                  <div style="width: 150px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis">
                    {data.row.name}
                  </div>
                  {/* <div
                    class="color-#c2c0c1"
                    style="width: 150px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis"
                  >
                    ID: {data.row.id}
                  </div> */}
                </div>
              </div>
            </>
          )
        }
      }
    }
  },
  {
    field: 'id',
    label:
      props.tabPosition == 'RECOMMEND_TYPE_GOODS' ? t('Recommendation.code') : t('merchant.id'),
    search: {
      hidden: true
    }
  }
])

const crudSchemas2 = reactive<CrudSchema[]>([
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
    label: t('Recommendation.sort'),
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
      type: 'index'
    }
    // table: {
    //   slots: {
    //     default: (data: any) => {
    //       const sort = data.row.sort
    //       return (
    //         <>
    //           <div>{sort}</div>
    //         </>
    //       )
    //     }
    //   }
    // }
  },
  {
    field: 'storeName',
    label:
      props.tabPosition == 'RECOMMEND_TYPE_GOODS'
        ? t('productList.name')
        : t('RotationChart.name2'),
    search: {
      hidden: true
    },
    width: '250px',
    table: {
      slots: {
        default: (data: any) => {
          const image = data.row.image
          return (
            <>
              <div class="flex">
                <div onClick={() => clickImage(imgUrl + image)}>
                  <ElImage src={imgUrl + image} style="width:70px;height: 70px"></ElImage>
                </div>

                <div style="width: 150px;" class="ml-10px">
                  <div style="width: 150px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis">
                    {data.row.name}
                  </div>
                </div>
              </div>
            </>
          )
        }
      }
    }
  },
  {
    field: 'id',
    width: '200px',
    label:
      props.tabPosition == 'RECOMMEND_TYPE_GOODS' ? t('Recommendation.code') : t('merchant.id'),
    search: {
      hidden: true
    }
  },
  {
    field: 'statusStr',
    label: t('project.status'),
    table: {
      slots: {
        default: (data: any) => {
          return (
            <>
              <ElTag
                type={
                  data.row.status == 'PUT_ON_SALE' || data.row.status == 'STATUS_0_0_0_0'
                    ? 'success'
                    : 'danger'
                }
              >
                {data.row.statusStr}
              </ElTag>
            </>
          )
        }
      }
    }
  },
  {
    field: 'action',
    label: t('userDemo.action'),
    table: {
      width: 100,
      fixed: 'right',
      slots: {
        default: (data: any) => {
          const row = data.row
          return (
            <>
              <div class="[&>span]:(cursor-pointer m-2) flex flex-wrap colorMain ">
                <span
                  v-hasPermi="operatoing:operatoing:delete"
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

const delLoading = ref(false)
const delData = async (row?: any) => {
  const elTableExpose = await getElTableExpose()
  ids.value = row ? [row.id] : elTableExpose?.getSelectionRows().map((v: any) => v.id) || []
  delLoading.value = true

  await delList(unref(ids).length).finally(() => {
    delLoading.value = false
  })
}

const { allSchemas } = useCrudSchemas(props.openType == 'acquiesce' ? crudSchemas1 : crudSchemas2)

const schema = reactive<FormSchema[]>([
  {
    field: 'param',
    label: '',
    component: 'Input',
    componentProps: {
      slots: {
        prepend: () => <div>{t('orderManage.commodity')}</div>
        // append: () => <Icon icon="ep:share" />
      }
    }
  }
])

const searchParams = ref<any>({})
const setSearchParams = (params: any) => {
  currentPage.value = 1
  searchParams.value = params
  getList()
}

const addChooseRef = ref()
const submit = async () => {
  const ids = addChooseRef.value.multipleSelection
  const res = await postAddOperatingApi({ id: props.openId, ids: ids })
  if (res.code == 200) {
    dialogVisible.value = false
    getList()
    ElMessage.success(t('common.operateSuccess'))
  }
}
defineExpose({
  chooseItem,
  toggleSelection
})
</script>
