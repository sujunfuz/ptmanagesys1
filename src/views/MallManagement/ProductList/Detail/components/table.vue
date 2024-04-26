<template>
  <Table
    :columns="columns"
    headerCellClassName="newElTableHeaderStyle"
    :data="tableList"
    :span-method="objectSpanMethod"
    :loading="loading"
  />
</template>

<script setup lang="tsx">
// import { Table } from '@/components/Table'
import { ref, watch, reactive } from 'vue'
import { Table, TableColumn } from '@/components/Table'
import { useI18n } from '@/hooks/web/useI18n'
import type { TableColumnCtx } from 'element-plus'
import { ElInput, ElButton } from 'element-plus'
import UploadImage from '@/components/UploadImage/UploadImage.vue'
import { Icon } from '@/components/Icon'

const props = defineProps({
  tableList: {
    type: Array,
    default: () => []
  },
  arrHeaderItem: {
    type: Array,
    default: () => []
  },
  arrHeaderItem2: {
    type: Array,
    default: () => []
  },
  checked: {
    type: Boolean,
    defailt: false
  }
})

interface User {
  id: string
  name: string
  amount1: string
  amount2: string
  amount3: number
}

interface SpanMethodProps {
  row: User
  column: TableColumnCtx<User>
  rowIndex: number
  columnIndex: number
}

const objectSpanMethod = ({ row, column, rowIndex, columnIndex }: SpanMethodProps) => {
  if (columnIndex === 0) {
    // 获取当前单元格的值
    const currentValue = row[column.property]

    // 获取上一行相同列的值
    const preRow = props.tableList[rowIndex - 1]

    const preValue = preRow ? preRow[column.property] : null
    // 如果当前值和上一行的值相同，则将当前单元格隐藏
    if (currentValue === preValue) {
      return { rowspan: 0, colspan: 0 }
    } else {
      // 否则计算当前单元格应该跨越多少行
      let rowspan = 1
      for (let i = rowIndex + 1; i < props.tableList.length; i++) {
        const nextRow = props.tableList[i]
        const nextValue = nextRow[column.property]
        if (nextValue === currentValue) {
          rowspan++
        } else {
          break
        }
      }
      return { rowspan, colspan: 1 }
    }
  }
}

const loading = ref(false)
const { t } = useI18n()

const columns = ref<TableColumn[]>([])

watch(
  () => props.arrHeaderItem,
  () => {
    getNewTableData()
  }
  // {
  //   deep: true
  // }
)

watch(
  () => props.arrHeaderItem2,
  () => {
    getNewTableData()
  }
  // {
  //   deep: true
  // }
)

watch(
  () => props.checked,
  () => {
    getNewTableData()
  }
  // {
  //   deep: true
  // }
)

watch(
  () => props.skuImgAddr,
  () => {
    skuImgAddrTemp.value = []
    for (let item in props.skuImgAddr) {
      skuImgAddrTemp.value.push({
        url: props.skuImgAddr[item]
      })
    }
  },
  {
    deep: true
  }
)

const skuImgAddrTemp = ref([])

const editClick = (data, cellIndex) => {
  openInventoryTag.value = data + ' ' + cellIndex
}
const mouseEnter = (data, cellIndex) => {
  openInventoryMouse.value = data + ' ' + cellIndex
}

const openInventoryTag = ref('-1 -1 ')
const openInventoryMouse = ref('-1 -1')

const getNewTableData = () => {
  const columns2 = ref<TableColumn[]>([
    // {
    //   field: 'RangePrice',
    //   label: t('productList.RangePrice'),
    //   children: props.arrHeaderItem2
    // },
    ...props.arrHeaderItem2,
    {
      field: 'cost',
      label: t('productList.cost')
    },
    {
      field: 'inventory',
      label: t('productList.inventory')
    }
  ])

  if (props.checked) {
    columns2.value.push({
      field: 'price',
      label: t('productList.shipping')
    })
  } else {
    columns2.value.filter(
      (item) =>
        item ===
        {
          field: 'price',
          label: t('productList.shipping')
        }
    )
  }

  columns.value = [...props.arrHeaderItem, ...columns2.value]
  if (columns.value[0].field == 'spec1') {
    columns.value[0].slots = {
      default: (data) => {
        const showData = data.row.spec1
        if (data.row.skuImgAddr == undefined) {
          data.row.skuImgAddr = ''
        }
        return (
          <>
            <div class="text-center">{showData}</div>
            <div class="w-100% text-center">
              {data.row.skuImgAddr != undefined ? (
                <UploadImage
                  class="skuImages"
                  nullImgList={data.row.skuImgAddr}
                  onlyNull={true}
                  onUpdateImgUrl={(val) => {
                    data.row.skuImgAddr = val
                  }}
                ></UploadImage>
              ) : (
                ''
              )}
            </div>
          </>
        )
        // } else {
        //   return (
        //     <>
        //       <div class="text-center">{showData}</div>
        //     </>
        //   )
        // }
      }
    }
  }

  columns.value.forEach((item, index) => {
    if (
      item.field == 'cost' ||
      item.field == 'price' ||
      item.field == 'inventory' ||
      item.field.indexOf('price') != -1
    ) {
      columns.value[index].slots = {
        default: (data) => {
          const inventory = data.row[item.field]
          const index = data.$index
          const cellIndex = data.cellIndex
          if (openInventoryTag.value == index + ' ' + cellIndex) {
            return (
              <>
                {/* <span class="colorfff bgcolorMainRed p-6px border-rd-40% ml-2">库存不足</span> */}
                <span>
                  <ElInput style="width: 85px;" type="number" v-model={data.row[item.field]} />
                  <ElButton
                    type="primary"
                    class="ml-5px"
                    onClick={() => (openInventoryTag.value = '-1 -1')}
                  >
                    {t('project.confirm')}
                  </ElButton>
                </span>
              </>
            )
          } else {
            return (
              <div class="flex-c">
                <span>{inventory}</span>
                {/* <span class="colorfff bgcolorMainRed p-6px border-rd-40% ml-2">库存不足</span> */}
                <span class="mt-4px customShow" onClick={() => editClick(index, cellIndex)}>
                  <Icon class="ml-1 " icon="ep:edit" />
                </span>
              </div>
            )
          }
        }
      }
    }
  })
}

// defineExpose({
//   setSkuImgAddr(res) {
//     console.log(res)
//     skuImgAddrTemp.value = res
//   }
// })
</script>
<style lang="less" scoped>
:deep(.el-table__cell:hover) {
  .customShow {
    display: inline;
  }
}
:deep(.customShow) {
  display: none;
}
</style>
