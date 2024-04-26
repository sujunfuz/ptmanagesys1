<script lang="tsx">
import {
  ElTable,
  ElTableColumn,
  ElPagination,
  ComponentSize,
  ElTooltipProps,
  ElImage,
  ElMessage
} from 'element-plus'
import { defineComponent, PropType, ref, computed, unref, watch, onMounted } from 'vue'
import { propTypes } from '@/utils/propTypes'
import { setIndex } from './helper'
import type { TableProps, TableColumn, Pagination, TableSetProps } from './types'
import { set, get } from 'lodash-es'
import { CSSProperties } from 'vue'
import { getSlot } from '@/utils/tsxHelper'
import TableActions from './components/TableActions.vue'
import Sortable from 'sortablejs'
// import { sortMenuApi } from '@/api/authorization/menu'
// import { id } from 'element-plus/es/locale'
// import { arrFlat } from 'vue-json-pretty/types/utils'
// import { Icon } from '@/components/Icon'
import { useI18n } from '@/hooks/web/useI18n'
import emptyBack from '@/assets/imgs/emptyBack.png'
const { t } = useI18n()

export default defineComponent({
  name: 'Table',
  props: {
    sortType: propTypes.string.def(''),
    showSort: propTypes.bool.def(false),
    expandedArr: propTypes.array.def([]),
    pageSize: propTypes.number.def(10),
    currentPage: propTypes.number.def(1),
    // 是否展示缩放工具
    showWindow: propTypes.bool.def(false),
    // 是否展示表格的工具栏
    showAction: propTypes.bool.def(false),
    // 是否所有的超出隐藏，优先级低于schema中的showOverflowTooltip,
    showOverflowTooltip: propTypes.bool.def(true),
    // 表头
    columns: {
      type: Array as PropType<TableColumn[]>,
      default: () => []
    },
    // 展开行
    // expand: propTypes.bool.def(false),
    // 是否展示分页
    pagination: {
      type: Object as PropType<Pagination>,
      default: (): Pagination | undefined => undefined
    },
    // 仅对 type=selection 的列有效，类型为 Boolean，为 true 则会在数据更新之后保留之前选中的数据（需指定 row-key）
    reserveSelection: propTypes.bool.def(false),
    // 加载状态
    loading: propTypes.bool.def(false),
    // 是否叠加索引
    reserveIndex: propTypes.bool.def(false),
    // 对齐方式
    align: propTypes.string
      .validate((v: string) => ['left', 'center', 'right'].includes(v))
      .def('left'),
    // 表头对齐方式
    headerAlign: propTypes.string
      .validate((v: string) => ['left', 'center', 'right'].includes(v))
      .def('left'),
    data: {
      type: Array as PropType<Recordable[]>,
      default: () => []
    },
    // 是否自动预览
    preview: {
      type: Array as PropType<string[]>,
      default: () => []
    },
    // sortable: propTypes.bool.def(false),
    height: propTypes.oneOfType([Number, String]),
    maxHeight: propTypes.oneOfType([Number, String]),
    stripe: propTypes.bool.def(false),
    border: propTypes.bool.def(true),
    size: {
      type: String as PropType<ComponentSize>,
      validator: (v: ComponentSize) => ['medium', 'small', 'mini'].includes(v)
    },
    fit: propTypes.bool.def(true),
    showHeader: propTypes.bool.def(true),
    highlightCurrentRow: propTypes.bool.def(false),
    currentRowKey: propTypes.oneOfType([Number, String]),
    // row-class-name, 类型为 (row: Recordable, rowIndex: number) => string | string
    rowClassName: {
      type: [Function, String] as PropType<(row: Recordable, rowIndex: number) => string | string>,
      default: ''
    },
    rowStyle: {
      type: [Function, Object] as PropType<
        (row: Recordable, rowIndex: number) => Recordable | CSSProperties
      >,
      default: () => undefined
    },
    cellClassName: {
      type: [Function, String] as PropType<
        (row: Recordable, column: any, rowIndex: number) => string | string
      >,
      default: ''
    },
    cellStyle: {
      type: [Function, Object] as PropType<
        (row: Recordable, column: any, rowIndex: number) => Recordable | CSSProperties
      >,
      default: () => undefined
    },
    headerRowClassName: {
      type: [Function, String] as PropType<(row: Recordable, rowIndex: number) => string | string>,
      default: ''
    },
    headerRowStyle: {
      type: [Function, Object] as PropType<
        (row: Recordable, rowIndex: number) => Recordable | CSSProperties
      >,
      default: () => undefined
    },
    headerCellClassName: {
      type: [Function, String] as PropType<
        (row: Recordable, column: any, rowIndex: number) => string | string
      >,
      default: 'elTableHeaderStyle'
    },
    headerCellStyle: {
      type: [Function, Object] as PropType<
        (row: Recordable, column: any, rowIndex: number) => Recordable | CSSProperties
      >,
      default: () => undefined
    },
    rowKey: propTypes.string.def('id'),
    emptyText: propTypes.string.def('No Data'),
    defaultExpandAll: propTypes.bool.def(false),
    expandRowKeys: {
      type: Array as PropType<string[]>,
      default: () => []
    },
    defaultSort: {
      type: Object as PropType<{ prop: string; order: string }>,
      default: () => ({})
    },
    tooltipEffect: {
      type: String as PropType<'dark' | 'light'>,
      default: 'dark'
    },
    tooltipOptions: {
      type: Object as PropType<
        Pick<
          ElTooltipProps,
          | 'effect'
          | 'enterable'
          | 'hideAfter'
          | 'offset'
          | 'placement'
          | 'popperClass'
          | 'popperOptions'
          | 'showAfter'
          | 'showArrow'
        >
      >,
      default: () => ({
        enterable: true,
        placement: 'top',
        showArrow: true,
        hideAfter: 200,
        popperOptions: { strategy: 'fixed' }
      })
    },
    showSummary: propTypes.bool.def(false),
    sumText: propTypes.string.def('Sum'),
    summaryMethod: {
      type: Function as PropType<(param: { columns: any[]; data: any[] }) => any[]>,
      default: () => undefined
    },
    spanMethod: {
      type: Function as PropType<
        (param: { row: any; column: any; rowIndex: number; columnIndex: number }) => any[]
      >,
      default: () => undefined
    },
    selectOnIndeterminate: propTypes.bool.def(true),
    indent: propTypes.number.def(16),
    lazy: propTypes.bool.def(false),
    load: {
      type: Function as PropType<(row: Recordable, treeNode: any, resolve: Function) => void>,
      default: () => undefined
    },
    treeProps: {
      type: Object as PropType<{ hasChildren?: string; children?: string; label?: string }>,
      default: () => ({ hasChildren: 'hasChildren', children: 'children', label: 'label' })
    },
    tableLayout: {
      type: String as PropType<'auto' | 'fixed'>,
      default: 'fixed'
    },
    scrollbarAlwaysOn: propTypes.bool.def(false),
    flexible: propTypes.bool.def(false)
  },
  emits: [
    'update:pageSize',
    'update:currentPage',
    'register',
    'refresh',
    'sortable-change',
    'queryTableData',
    'start',
    'updatedData',
    'end',
    'update:expandedArr',
    'updateExpandedArr',
    'updateSortType'
  ],
  setup(props, { attrs, emit, slots, expose }) {
    const elTableRef = ref<ComponentRef<typeof ElTable>>()

    // 实现拖拽
    // 将树数据转化为平铺数据
    function treeToTile(treeData, childKey = 'children') {
      const arr = []
      const expanded = (data) => {
        if (data && data.length > 0) {
          data
            .filter((d) => d)
            .forEach((e) => {
              arr.push(e)
              expanded(e[childKey] || [])
            })
        }
      }
      expanded(treeData)
      return arr
    }

    //接收平铺数组List
    function transListDataToTreeData(list, root) {
      const arr = []
      // 1.遍历
      list.forEach((item) => {
        // 2.首次传入空字符串  判断list的pid是否为空 如果为空就是一级节点
        if (item.parentId === root) {
          // 找到之后就要去找item下面有没有子节点  以 item.id 作为 父 id, 接着往下找
          const children = transListDataToTreeData(list, item.id)
          if (children && children.length > 0) {
            // 如果children的长度大于0,说明找到了子节点
            item.children = children
          }
          // 将item项, 追加到arr数组中
          arr.push(item)
        }
      })
      return arr
    }

    // 行拖拽
    function rowDrop(data) {
      const tbody = document.querySelectorAll('.el-table__body-wrapper tbody')
      Sortable.create(tbody[tbody.length - 1], {
        animation: 150,
        delay: 0,
        handle: '.sortIcon',
        onStart: () => {
          // emit('start', 0)
        },
        // 结束拖拽后的回调函数
        onEnd: async (evt: { newIndex: any; oldIndex: any }) => {
          const endIndex = evt.newIndex
          const startIndex = evt.oldIndex
          if (props.sortType == 'autoType') {
            emit('end', { startIndex, endIndex })
          } else {
            const arr: Array<any> = treeToTile(elTableRef.value?.data)

            const startItem = arr[startIndex]

            if (startIndex == endIndex) {
              emit('updatedData', elTableRef.value?.data)
              ElMessage.warning(t('common.a43'))
              return
            }

            if (arr[startIndex].expanded == '2') {
              emit('updatedData', elTableRef.value?.data)
              ElMessage.warning(t('common.a44'))
              return
            }

            let sort = 0
            let parentId = '0'

            if (endIndex == 0) {
              parentId = '0'
              sort = 0
            } else {
              let overIndex = 0
              let arrItem: any = null
              let origin
              if (startIndex < endIndex) {
                origin = endIndex
              } else {
                origin = endIndex - 1
              }
              for (let i = origin; i >= 0; i--) {
                if (arr[i].expanded == '2' || arr[i].parentId == '0') {
                  overIndex = i
                  arrItem = arr[i]
                  break
                }
              }
              if (!arrItem) {
                return
              }
              if (arrItem.parentId == '0' && arrItem.expanded == '1') {
                for (let i = 0; i < endIndex; i++) {
                  if (arr[i].parentId == '0') {
                    sort++
                  }
                }
              } else {
                for (let i = overIndex + 1; i < endIndex; i++) {
                  if (arr[i].parentId == arrItem.id) {
                    sort++
                  }
                }
                parentId = arrItem.expanded == '2' ? arrItem.id : '0'
              }
            }

            if (parentId != '0') {
              for (var item in arr) {
                if (arr[item].id == parentId) {
                  const judge1 = arr[item].menuType == 'D' && startItem.menuType == 'M'
                  const judge2 =
                    (arr[item].menuType == 'M' && startItem.menuType == 'C') ||
                    startItem.menuType == 'B'
                  // 移动上下是目录菜单 或菜单子菜单 或菜单按钮
                  if (judge1 || judge2) {
                    for (var it in arr) {
                      if (arr[it].id == startItem.id) {
                        arr.splice(Number(it), 1)
                      }
                    }
                    startItem.parentId = parentId
                    const temp = Number(item) + Number(sort) + 1
                    arr.splice(temp, 0, startItem)
                  } else {
                    console.log(arr[item].menuType)
                    console.log(startItem.menuType)
                    emit('updatedData', transListDataToTreeData(arr, '0'))
                    ElMessage.warning(t('common.a45'))
                    return
                  }
                  break
                }
              }
              console.log(transListDataToTreeData(arr, '0'))
              // console.log(arr)
              emit('updateSortType', transListDataToTreeData(arr, '0'))
            } else {
              if (startItem.menuType == 'D') {
                const endItem = arr[endIndex]
                const sortStartIndex = elTableRef.value?.data.findIndex(
                  (item) => item.id == startItem.id
                )
                if (sortStartIndex != -1) {
                  elTableRef.value?.data.splice(Number(sortStartIndex), 1)
                }
                const sortIndex = elTableRef.value?.data.findIndex((item) => item.id == endItem.id)
                elTableRef.value?.data.splice(Number(sortIndex), 0, startItem)
              } else {
                ElMessage.warning(t('common.a46'))
                emit('updatedData', elTableRef.value?.data)
                return
              }
              console.log(elTableRef.value?.data)
              emit('updateSortType', elTableRef.value?.data)
            }
          }
        }
      })
    }

    // 注册
    onMounted(() => {
      const tableRef = unref(elTableRef)
      emit('register', tableRef?.$parent, elTableRef)
      rowDrop(props.data)
    })

    const pageSizeRef = ref(props.pageSize)

    const currentPageRef = ref(props.currentPage)

    // useTable传入的props
    const outsideProps = ref<TableProps>({})

    const mergeProps = ref<TableProps>({})

    const getProps = computed(() => {
      const propsObj = { ...props }
      Object.assign(propsObj, unref(mergeProps))
      return propsObj
    })

    // const sortableEl = ref()
    // 初始化拖拽
    // const initDropTable = () => {
    //   const el = unref(elTableRef)?.$el.querySelector('.el-table__body tbody')
    //   if (!el) return
    //   if (unref(sortableEl)) unref(sortableEl).destroy()

    //   sortableEl.value = Sortable.create(el, {
    //     handle: '.table-move',
    //     animation: 180,
    //     onEnd(e: any) {
    //       emit('sortable-change', e)
    //     }
    //   })
    // }

    // watch(
    //   () => getProps.value.sortable,
    //   async (v) => {
    //     await nextTick()
    //     v && initDropTable()
    //   },
    //   {
    //     immediate: true
    //   }
    // )

    const setProps = (props: TableProps = {}) => {
      mergeProps.value = Object.assign(unref(mergeProps), props)
      outsideProps.value = { ...props } as any
    }

    const setColumn = (columnProps: TableSetProps[], columnsChildren?: TableColumn[]) => {
      const { columns } = unref(getProps)
      for (const v of columnsChildren || columns) {
        for (const item of columnProps) {
          if (v.field === item.field) {
            set(v, item.path, item.value)
          } else if (v.children?.length) {
            setColumn(columnProps, v.children)
          }
        }
      }
    }

    const addColumn = (column: TableColumn, index?: number) => {
      const { columns } = unref(getProps)
      if (index) {
        columns.splice(index, 0, column)
      } else {
        columns.push(column)
      }
    }

    const delColumn = (field: string) => {
      const { columns } = unref(getProps)
      const index = columns.findIndex((item) => item.field === field)
      if (index > -1) {
        columns.splice(index, 1)
      }
    }

    const refresh = () => {
      emit('refresh')
    }

    const changSize = (size: ComponentSize) => {
      setProps({ size })
    }

    const fullScreen = () => {
      console.log('-------------')
    }

    expose({
      setProps,
      setColumn,
      delColumn,
      addColumn,
      elTableRef
    })

    const pagination = computed(() => {
      return Object.assign(
        {
          small: false,
          background: false,
          pagerCount: 7,
          layout: 'sizes, prev, pager, next, jumper, ->, total',
          pageSizes: [10, 20, 30, 40, 50, 100],
          disabled: false,
          hideOnSinglePage: false,
          total: 10
        },
        unref(getProps).pagination
      )
    })

    watch(
      () => unref(getProps).pageSize,
      (val: number) => {
        pageSizeRef.value = val
      }
    )

    watch(
      () => unref(getProps).currentPage,
      (val: number) => {
        currentPageRef.value = val
      }
    )

    watch(
      () => pageSizeRef.value,
      (val: number) => {
        emit('update:pageSize', val)
      }
    )

    watch(
      () => currentPageRef.value,
      (val: number) => {
        emit('update:currentPage', val)
      }
    )

    const getBindValue = computed(() => {
      const bindValue: Recordable = { ...attrs, ...unref(getProps) }
      delete bindValue.columns
      delete bindValue.data
      return bindValue
    })

    const renderTreeTableColumn = (columnsChildren: TableColumn[]) => {
      const { align, headerAlign, showOverflowTooltip, preview } = unref(getProps)
      return columnsChildren.map((v) => {
        if (v.hidden) return null
        const props = { ...v } as any
        if (props.children) delete props.children

        const children = v.children

        const slots = {
          default: (...args: any[]) => {
            const data = args[0]
            let isImageUrl = false
            if (preview.length) {
              isImageUrl = preview.some((item) => (item as string) === v.field)
            }

            return children && children.length
              ? renderTreeTableColumn(children)
              : props?.slots?.default
              ? props.slots.default(...args)
              : v?.formatter
              ? v?.formatter?.(data.row, data.column, get(data.row, v.field), data.$index)
              : isImageUrl
              ? renderPreview(get(data.row, v.field))
              : get(data.row, v.field)
          }
        }
        if (props?.slots?.header) {
          slots['header'] = (...args: any[]) => props.slots.header(...args)
        }

        return (
          <ElTableColumn
            showOverflowTooltip={showOverflowTooltip}
            align={align}
            headerAlign={headerAlign}
            {...props}
            prop={v.field}
          >
            {slots}
          </ElTableColumn>
        )
      })
    }

    const renderPreview = (url: string) => {
      return (
        <div class="flex items-center">
          <ElImage
            src={url}
            fit="cover"
            class="w-[100%] h-100px"
            lazy
            preview-src-list={[url]}
            preview-teleported
          />
        </div>
      )
    }

    const renderTableColumn = (columnsChildren?: TableColumn[]) => {
      const {
        columns,
        reserveIndex,
        pageSize,
        currentPage,
        align,
        headerAlign,
        showOverflowTooltip,
        reserveSelection,
        preview
      } = unref(getProps)

      return (columnsChildren || columns).map((v) => {
        if (v.hidden) return null
        if (v.type === 'index') {
          return (
            <ElTableColumn
              type="index"
              index={
                v.index ? v.index : (index) => setIndex(reserveIndex, index, pageSize, currentPage)
              }
              align={v.align || align}
              headerAlign={v.headerAlign || headerAlign}
              label={v.label}
              width="65px"
            ></ElTableColumn>
          )
        } else if (v.type === 'selection') {
          return (
            <ElTableColumn
              type="selection"
              reserveSelection={reserveSelection}
              align={align}
              headerAlign={headerAlign}
              width="50"
            ></ElTableColumn>
          )
        } else {
          const props = { ...v } as any
          if (props.children) delete props.children

          const children = v.children

          const slots = {
            default: (...args: any[]) => {
              const data = args[0]

              let isImageUrl = false
              if (preview.length) {
                isImageUrl = preview.some((item) => (item as string) === v.field)
              }

              return children && children.length
                ? renderTreeTableColumn(children)
                : props?.slots?.default
                ? props.slots.default(...args)
                : v?.formatter
                ? v?.formatter?.(data.row, data.column, get(data.row, v.field), data.$index)
                : isImageUrl
                ? renderPreview(get(data.row, v.field))
                : get(data.row, v.field)
            }
          }
          if (props?.slots?.header) {
            slots['header'] = (...args: any[]) => props.slots.header(...args)
          }

          return (
            <ElTableColumn
              showOverflowTooltip={showOverflowTooltip}
              align={align}
              headerAlign={headerAlign}
              {...props}
              prop={v.field}
            >
              {slots}
            </ElTableColumn>
          )
        }
      })
    }
    const searchId = (id, arr, expanded) => {
      const digui = (obj, aid) => {
        if (obj.id == aid) {
          obj.expanded = expanded ? '2' : '1'
          return
        }
        if (obj.children && obj.children.length > 0) {
          for (const item of obj.children) {
            digui(item, aid)
          }
        }
      }
      for (const item of arr) {
        digui(item, id)
      }
    }
    const printExpand = (row, expanded) => {
      const tempArr = elTableRef.value?.data
      const linArr = [...props.expandedArr]
      if (expanded) {
        linArr.push(row)
        emit('updateExpandedArr', linArr)
      } else {
        let aArr: Array<any> = []
        linArr.forEach((item: any) => {
          if (item.id != row.id) {
            aArr.push(item)
          }
        })
        emit('updateExpandedArr', aArr)
      }
      searchId(row.id, tempArr, expanded)
    }
    return () => {
      const tableSlots = {}
      if (getSlot(slots, 'empty')) {
        tableSlots['empty'] = (...args: any[]) => getSlot(slots, 'empty', args)
      }
      if (getSlot(slots, 'append')) {
        tableSlots['append'] = (...args: any[]) => getSlot(slots, 'append', args)
      }

      // const { sortable } = unref(getProps)

      // const sortableEl = sortable ? (
      //   <ElTableColumn
      //     className="table-move cursor-move"
      //     type="sortable"
      //     prop="sortable"
      //     width="60px"
      //     align="center"
      //   >
      //     <Icon icon="ant-design:drag-outlined" />
      //   </ElTableColumn>
      // ) : null

      return (
        <div v-loading={unref(getProps).loading}>
          {unref(getProps).showAction ? (
            <TableActions
              columns={unref(getProps).columns}
              onChangSize={changSize}
              onFullScreen={fullScreen}
              onRefresh={refresh}
              TableActions={true}
            />
          ) : null}
          <ElTable
            onExpand-change={printExpand}
            ref={elTableRef}
            data={unref(getProps).data}
            {...unref(getBindValue)}
          >
            {{
              default: () => renderTableColumn(),
              ...tableSlots,
              empty: () => (
                <div class="flex-c flex-col pt-40px pb-40px">
                  <img class="h-89px w-147px" src={emptyBack}></img>
                  <div>{t('project.nodata')}</div>
                </div>
              )
            }}
          </ElTable>
          {unref(getProps).pagination ? (
            <ElPagination
              v-model:pageSize={pageSizeRef.value}
              v-model:currentPage={currentPageRef.value}
              class="mt-10px mr-15px pb-15px"
              {...unref(pagination)}
            ></ElPagination>
          ) : undefined}
        </div>
      )
    }
  }
})
</script>
