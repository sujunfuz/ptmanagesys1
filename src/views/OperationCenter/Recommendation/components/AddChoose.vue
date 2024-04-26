<template>
  <div class="flex">
    <Search :schema="Allschema" @reset="setSearchParams" @search="setSearchParams" />
  </div>
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
</template>

<script setup lang="tsx">
import { useI18n } from '@/hooks/web/useI18n'
import { ref, unref, watch, reactive, nextTick, computed } from 'vue'
import { ElTree, ElMessage, ElImage, ElTag } from 'element-plus'
import { postAddPageListOperatingApi } from '@/api/operationCenter/recommendation'
import { useTable } from '@/hooks/web/useTable'
import { Search } from '@/components/Search'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { FormSchema } from '@/components/Form'
import { dateTimeRange } from '@/utils/time'
import { Table } from '@/components/Table'
import { createImageViewer } from '@/components/ImageViewer'
import { tableStatusStyleTag } from '@/utils/componentUtils'

const { t } = useI18n()

const chooseItem = ref()

const multipleTableRef = ref()

const multipleSelection = ref([])
const handleSelectionChange = (val) => {
  multipleSelection.value = []
  val.map((item) => {
    multipleSelection.value.push(item.id)
  })
}
// const select = (selection, row) => {
//   // 清除 所有勾选项
//   multipleTableRef.value.elTableRef.clearSelection()
//   // 当表格数据都没有被勾选的时候 就返回
//   // 主要用于将当前勾选的表格状态清除
//   if (selection.length == 0) return
//   multipleTableRef.value.elTableRef.toggleRowSelection(row, true)
// }

// 控制单选——table选择项发生变化时
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
    console.log(rows == dataList.value[item].id)
    if (rows == dataList.value[item].id) {
      multipleTableRef.value.elTableRef.toggleRowSelection(dataList.value[item], true)
    }
  }
}

const { tableRegister, tableState, tableMethods } = useTable({
  fetchDataApi: async () => {
    const { pageSize, currentPage } = tableState
    const res = await postAddPageListOperatingApi({
      currentPage: unref(currentPage),
      pageSize: unref(pageSize),
      ...unref(searchParams),
      startTime: unref(searchParams).createTime ? unref(searchParams).createTime[0] : '',
      endTime: unref(searchParams).createTime ? unref(searchParams).createTime[1] : '',
      type: props.tabPosition
    })
    return res.data
  }
})
const { total, loading, dataList, pageSize, currentPage } = tableState
const { getList } = tableMethods

const clickImage = (data) => {
  createImageViewer({
    urlList: [data]
  })
}

const props = defineProps({
  openType: {
    type: String,
    default: () => ''
  },
  goodsStatusEnum: {
    type: Object as any,
    default: () => {}
  },
  tabPosition: {
    type: String,
    default: () => ''
  }
})

const Allschema = computed(() => {
  return props.openType == 'relevancyId1' ? schema : baseSchema
})

const baseSchema = reactive<FormSchema[]>([
  {
    field: 'bannerName',
    label: '',
    component: 'Input',
    componentProps: {
      slots: {
        prepend: () => <div>{t('RotationChart.sub7')}</div>
        // append: () => <Icon icon="ep:share" />
      }
    }
  },
  {
    field: 'id',
    label: '',
    component: 'Input',
    componentProps: {
      slots: {
        prepend: () => <div>{t('merchant.id')}</div>
      }
    }
  }
])

const imgUrl = import.meta.env.VITE_IMG_URL

const crudSchemas1 = reactive<CrudSchema[]>([
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
    field: 'name',
    label: t('productList.name'),
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
                  <div
                    class="color-#c2c0c1"
                    style="width: 150px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis"
                  >
                    ID: {data.row.id}
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
    field: 'remark',
    label: t('userDemo.remark'),
    search: {
      hidden: true
    }
  },
  {
    field: 'status',
    label: t('userDemo.status'),
    search: {
      hidden: true
    },
    formatter: (data: any) => {
      const status = data.status || ''
      return tableStatusStyleTag(status, t('RotationChart.grounding'), t('RotationChart.Offshelf'))
    }
  },
  {
    field: 'createTimeStr',
    label: t('exampleDemo.displayTime'),
    search: {
      hidden: true
    },
    width: '200px'
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
    field: 'storeName',
    label: t('RotationChart.name2'),
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
    label: t('merchant.id'),
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
          console.log(data.row.status)
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
  }
])

const { allSchemas } = useCrudSchemas(
  props.openType == 'relevancyId1' ? crudSchemas1 : crudSchemas2
)

const schema = reactive<FormSchema[]>([
  {
    field: 'name',
    label: '',
    component: 'Input',
    componentProps: {
      slots: {
        prepend: () => <div>{t('orderManage.commodity')}</div>
        // append: () => <Icon icon="ep:share" />
      }
    }
  },
  {
    field: 'remark',
    label: '',
    component: 'Input',
    componentProps: {
      slots: {
        prepend: () => <div>{t('userDemo.remark')}</div>
      }
    }
  },
  {
    field: 'status',
    label: '',
    component: 'Select',
    componentProps: {
      options: props.goodsStatusEnum,
      slots: {
        prefix: () => <div>{t('userDemo.status')}</div>
      }
    }
  },
  {
    field: 'createTime',
    component: 'DatePicker',
    componentProps: dateTimeRange()
  }
])

const searchParams = ref<any>({})
const setSearchParams = (params: any) => {
  currentPage.value = 1
  searchParams.value = params
  getList()
}

defineExpose({
  chooseItem,
  toggleSelection,
  multipleSelection
})
</script>
