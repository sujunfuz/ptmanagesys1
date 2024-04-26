<template>
  <ContentWrap>
    <div class="flex">
      <Search :schema="searchSchema" @search="queryTableData" />
      <el-button plain v-hasPermi="'pms:menu:editColumn'" @click="fieldVisible = true">{{
        t('common.fieldFiltering')
      }}</el-button>
      <el-button v-hasPermi="'pms:menu:add'" type="primary" @click="clickdialog('add1', {})">{{
        t('menu.addMenu')
      }}</el-button>
    </div>
  </ContentWrap>
  <ContentWrap class="mt-20px flex-1" :isBlock="false">
    <div class="p-20px flex">
      <el-button plain @click="unFoldOrNot">{{ t('project.unfoldAndCollapse') }}</el-button>
      <el-button plain @click="startSortList">{{ t('dictionariesParameter.sort') }}</el-button>
    </div>
    <Table
      v-loading="tableObj.loading"
      :height="'calc(100vh - 320px)'"
      v-if="expandFresh && tableObj.dataList.length != 0"
      ref="tableRef"
      @register="tableRegister"
      :show-sort="sortTemp"
      :expandedArr="expandedArr"
      :columns="tableColumns"
      :data="tableObj.dataList"
      :default-expand-all="expandFlag"
      @query-table-data="queryTableData"
      @updated-data="updatedData"
      @update-expanded-arr="updateExpandedArr"
      @update-sort-type="updateSortType"
    />
    <Empty v-else-if="expandFresh && tableObj.dataList.length == 0" />
    <div style="height: calc(100vh - 320px)" v-else v-loading="true"> </div>

    <div v-if="sortTemp" class="m-10px text-right">
      <ElButton @click="cancelTemp">{{ t('project.cancel') }}</ElButton>
      <ElButton type="primary" :loading="saveLoading" @click="sortClick">
        {{ t('project.confirm') }}
      </ElButton>
    </div>

    <Dialog
      v-if="menuVisible"
      v-model="menuVisible"
      :title="dialogTitle"
      :maxHeight="openType == 'add2' ? '320px' : openType == 'fieldConfig' ? '400px' : '320px'"
    >
      <FieldConfig
        ref="fieldConfigRef"
        v-if="openType == 'fieldConfig'"
        :fieldConfigID="fieldConfigData"
      />
      <Write
        v-else
        :menuList="tableObj.dataList"
        :currentRow="currentRow"
        :openType="openType"
        :openMenuType="openMenuType"
        ref="writeRef"
        :parent-list="parentList"
        :statusList="statusList"
      />
      <template #footer>
        <ElButton @click="menuVisible = false">{{ t('project.cancel') }}</ElButton>
        <ElButton type="primary" :loading="saveLoading1" @click="save1">
          {{ t('project.confirm') }}
        </ElButton>
      </template>
    </Dialog>
    <FieldFilter
      v-if="fieldVisible"
      v-model:fieldVisible="fieldVisible"
      :ui-url="'/menu/operatorSortColumnUI'"
      :sort-url="'/menu/operatorSortColumn'"
    />
  </ContentWrap>
</template>

<script setup lang="tsx">
import FieldConfig from './components/fieldConfig.vue'
import { ContentWrap } from '@/components/ContentWrap'
import { reactive, ref, unref, onMounted, watch } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import { Search } from '@/components/Search'
import { ElButton, ElMessage, ElMessageBox, componentSizeMap } from 'element-plus'
import Empty from '@/components/customComponents/Empty/index.vue'
import {
  menuList,
  addmenuUi,
  delmenu,
  addmenu,
  editmenu,
  saveMenuColumn,
  menuPageTop,
  sortMenuApi
} from '@/api/authorization/menu'
import { Dialog } from '@/components/Dialog'
import { FormSchema } from '@/components/Form'
import Write from './components/Write.vue'
import { pathToName } from '@/utils/common'
import { Table, TableColumn } from '@/components/Table'
import { Icon } from '@/components/Icon'
import { ElTag } from 'element-plus'
import { nextTick } from 'vue'
import { useTable } from '@/hooks/web/useTable'
import { tableStatusStyleTag } from '@/utils/componentUtils'
import FieldFilter from '@/components/customComponents/FieldFilter/index.vue'
import generateSchema from '@/utils/schemaUtil'
import { useAppStore } from '@/store/modules/app'
import { log } from 'console'
const appStore = useAppStore()
appStore.setRenderLoading(true)
const { t } = useI18n()
const expandFlag = ref(false)
const expandFresh = ref(true)
const tableRef = ref()
const expandedArr = ref<Array<any>>([]) //展开行数组
const fieldVisible = ref(false)

const statusList = ref()

const sortTemp = ref(false)

//首次加载
onMounted(() => {
  init()
})
watch(
  () => fieldVisible.value,
  (val) => {
    if (!val) {
      init()
    }
  }
)

const clickRow = (data) => {
  tableRef.value?.elTableRef?.toggleRowExpansion(data)
}

let staticArr = [
  {
    field: 'title',
    label: t('menu.menuName'),
    slots: {
      default: (data: any) => {
        return (
          <>
            <span onClick={() => clickRow(data.row)} class="w-100% cursor-pointer">
              {data.row.title}
            </span>
          </>
        )
      }
    }
  },
  {
    field: 'menuType',
    label: t('menu.menuType'),
    slots: {
      default: (data: any) => {
        return (
          <div>
            {data.row.menuType == 'D'
              ? t('common.a1')
              : data.row.menuType == 'M'
              ? t('common.a2')
              : data.row.menuType == 'C'
              ? t('common.a3')
              : t('common.a4')}
          </div>
        )
      }
    }
  },
  {
    field: 'icon',
    label: t('menu.menuIcon'),
    formatter: (data: any) => {
      const icon = data.icon || ''
      return (
        <>
          <Icon class="mr-10px" icon={icon} size={20}></Icon>
        </>
      )
    }
  },
  {
    field: 'unStatusStr',
    label: t('project.status'),
    formatter: (data: any) => {
      const status = data.unStatus || ''
      return tableStatusStyleTag(status)
    }
  }
]
const init = async () => {
  appStore.setRenderLoading(true)
  const result = await menuPageTop()
  let arr = generateSchema(result.data.pageColumn, staticArr)
  arr.push({
    field: 'operate',
    label: t('project.operations'),
    fixed: 'right',
    width: '200px',
    // maxWidth: '200px',
    slots: {
      default: (data: any) => {
        if (sortTemp.value) {
          return (
            <>
              <div class="[&>span]:(cursor-pointer m-2) flex flex-wrap colorMain">
                <span
                  v-hasPermi="pms:menu:edit"
                  onClick={() => {
                    clickdialog('edit', data.row)
                  }}
                >
                  {t('role.edit')}
                </span>
                <span
                  v-hasPermi="pms:menu:add"
                  v-show={data.row.menuType != 'B' && !data.row.link}
                  onClick={() => {
                    clickdialog('add2', data.row)
                  }}
                >
                  {t('project.add')}
                </span>
                <span
                  v-hasPermi="pms:menu:delete"
                  class="color-red-500"
                  onClick={() => {
                    clickdialog('delete', data.row)
                  }}
                >
                  {t('project.delete')}
                </span>
                {/* v-hasPermi="pms:menu:fieldset"
                v-show={data.row.menuType == 'M' || data.row.menuType == 'C'} */}
                <span
                  onClick={() => {
                    clickdialog('fieldConfig', data.row)
                  }}
                  v-show={data.row.menuType != 'D' && data.row.menuType != 'B'}
                >
                  {t('menu.fieldConfig')}
                </span>
                <span v-hasPermi="pms:menu:edit">
                  <Icon icon="svg-icon:sort" size={17} class="mt-3px sortIcon" />
                </span>
              </div>
            </>
          )
        } else {
          return (
            <>
              <div class="[&>span]:(cursor-pointer m-2) flex flex-wrap colorMain ">
                <span
                  v-hasPermi="pms:menu:edit"
                  onClick={() => {
                    clickdialog('edit', data.row)
                  }}
                >
                  {t('role.edit')}
                </span>
                <span
                  v-hasPermi="pms:menu:add"
                  v-show={data.row.menuType != 'B' && !data.row.link}
                  onClick={() => {
                    clickdialog('add2', data.row)
                  }}
                >
                  {t('project.add')}
                </span>
                <span
                  v-hasPermi="pms:menu:delete"
                  class="color-red-500"
                  onClick={() => {
                    clickdialog('delete', data.row)
                  }}
                >
                  {t('project.delete')}
                </span>
                {/* v-hasPermi="pms:menu:fieldset"
                v-show={data.row.menuType == 'M' || data.row.menuType == 'C'} */}
                <span
                  onClick={() => {
                    clickdialog('fieldConfig', data.row)
                  }}
                  v-show={data.row.menuType != 'D' && data.row.menuType != 'B'}
                >
                  {t('menu.fieldConfig')}
                </span>
                {/* <span v-hasPermi="pms:menu:edit">
                  <Icon icon="svg-icon:sort" size={20} class="mt-2px sortIcon" />
                </span> */}
              </div>
            </>
          )
        }
      }
    }
  })
  tableColumns.value = arr
  nextTick(() => {
    statusList.value = result.data.status
    getList()
  })
}

const cancelTemp = async () => {
  sortTemp.value = false
  await init()
}

const { tableRegister, tableMethods } = useTable({
  fetchDataApi: async () => {
    queryTableData({})
    return null
  },
  fetchDelApi: async () => {
    const res = await delmenu(unref(ids))
    return res
  },
  immediate: false
})
const { getList, getElTableExpose, delList } = tableMethods

const searchSchema = reactive<FormSchema[]>([
  {
    field: 'title',
    label: '',
    component: 'Input',
    componentProps: {
      slots: {
        prepend: () => <div>{t('menu.menuName')}</div>
        // append: () => <Icon icon="ep:share" />
      }
    }
  },
  {
    field: 'unStatus',
    label: '',
    component: 'Select',
    componentProps: {
      options: statusList,
      slots: {
        prefix: () => <div>{t('menu.status')}</div>
      }
    }
  }
])
const tableColumns = ref<TableColumn[]>([])
const tableObj = ref({
  dataList: [] as Array<any>,
  loading: false
})

const startSortList = () => {
  sortTemp.value = true
}

const setExpanded = () => {
  //  0 是组件 1是关闭 2是打开
  // let tempArr: Array<any> = []
  // expandedArr.value = []
  const digui = (obj: any) => {
    // console.log(obj.children.length)
    if (obj.children && obj.children.length > 0) {
      obj.expanded = expandFlag.value ? '2' : '1'
      if (obj.expanded == '2') {
        expandedArr.value.push(obj)
      }
      for (let item of expandedArr.value) {
        if (item.id == obj.id) {
          item = obj
          break
        }
      }
      obj.children.forEach((item: any) => {
        digui(item)
      })
    } else {
      obj.expanded = '0'
    }
  }
  tableObj.value.dataList.forEach((item: any) => {
    digui(item)
  })
}
const unFoldOrNot = async () => {
  expandFlag.value = !expandFlag.value
  expandedArr.value = []
  setExpanded()
  expandFresh.value = false
  nextTick(() => {
    expandFresh.value = true
  })
}

const updateExpandedArr = (arr: any) => {
  expandedArr.value = arr
}
const parentList = ref<any>([])
const menuVisible = ref(false)
const dialogTitle = ref('')
const currentRow = ref()
const openType = ref('')
const openMenuType = ref('')
const writeRef = ref()
const fieldConfigRef = ref()
const saveLoading = ref(false)
const ids = ref<string[]>([])

const tableDataTemp = ref()
const updatedData = (data: any) => {
  appStore.setRenderLoading(true)
  tableObj.value.loading = true
  expandFresh.value = !expandFresh.value
  expandFlag.value = false
  tableObj.value.dataList = data
  setTimeout(() => {
    tableObj.value.loading = false
    expandFresh.value = !expandFresh.value
    appStore.setRenderLoading(false)
  }, 100)
}

const updateSortType = (val) => {
  tableDataTemp.value = val
}

//列表
const queryTableData = async (data: any) => {
  // appStore.setRenderLoading(true)
  tableObj.value.loading = true
  const res = await menuList({
    title: data.title,
    unStatus: data.unStatus
  })
  expandFlag.value = false
  if (res) {
    tableObj.value.dataList = res.data
    expandFresh.value = !expandFresh.value
    setTimeout(() => {
      expandFresh.value = !expandFresh.value
      setExpanded()
      tableObj.value.loading = false
      nextTick(() => {
        expandedArr.value.forEach((item: any) => {
          tableRef.value.elTableRef.toggleRowExpansion(item, true)
        })
        appStore.setRenderLoading(false)
      })
    }, 500)
  }
}

const treeToTile = (treeData, childKey = 'children') => {
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

const sortClick = async () => {
  const res = await sortMenuApi(tableDataTemp.value)
  if (res.code == 200) {
    sortTemp.value = false
    ElMessage.success(t('common.operateSuccess'))
    await queryTableData({})
  } else {
    ElMessage.success(t('common.a47'))
  }
}

const fieldConfigData = ref('')
//打开弹窗
const clickdialog = async (type: any, row: any) => {
  openType.value = type
  saveLoading1.value = false
  switch (type) {
    case 'add1':
      const res = await addmenuUi({ menuType: 'D' })
      if (res) {
        parentList.value = []
        res.data.listMenu.forEach((e: { id: any; title: any }) => {
          parentList.value.push({
            id: e.id,
            title: e.title
          })
        })
      }
      currentRow.value = {
        menuType: 'D',
        parentId: '0',
        icon: '',
        title: '',
        sort: '',
        link: false,
        path: '',
        unStatus: 'STATUS_0_0_0_0',
        children: []
      }
      dialogTitle.value = t('project.add')
      menuVisible.value = true

      break
    case 'add2':
      openMenuType.value = row.menuType
      const res1 = await addmenuUi({
        menuType: openMenuType.value == 'D' ? 'M' : openMenuType.value == 'M' ? 'C' : 'B'
      })
      if (res1) {
        parentList.value = []
        res1.data.listMenu.forEach((e: { id: any; title: any }) => {
          parentList.value.push({
            id: e.id,
            title: e.title
          })
        })
      }

      currentRow.value = {
        menuType: openMenuType.value == 'D' ? 'M' : openMenuType.value == 'M' ? 'C' : 'B',
        parentId: row.id,
        icon: '',
        title: '',
        sort: row.sort,
        link: false,
        path: '',
        children: row.children || [],
        unStatus: 'STATUS_0_0_0_0'
      }
      dialogTitle.value = t('project.add')
      menuVisible.value = true

      break
    case 'edit':
      const res2 = await addmenuUi({ menuType: row.menuType })
      if (res2) {
        parentList.value = []
        res2.data.listMenu.forEach((e: { id: any; title: any }) => {
          parentList.value.push({
            id: e.id,
            title: e.title
          })
        })
      }
      if (row.unStatus != 'STATUS_0_0_0_0') {
        row.unStatus = 'UNACTIVE'
      }
      currentRow.value = row
      dialogTitle.value = t('project.edit')
      menuVisible.value = true

      break
    case 'delete':
      const elTableExpose = await getElTableExpose()
      ids.value = row ? [row.id] : elTableExpose?.getSelectionRows().map((v: any) => v.id) || []
      await delList(unref(ids).length).finally(() => {})
      break
    case 'fieldConfig':
      dialogTitle.value = t('menu.fieldConfig')
      menuVisible.value = true
      fieldConfigData.value = row.id
      break
  }
}

const saveLoading1 = ref()
const save1 = async () => {
  if (openType.value == 'fieldConfig') {
    saveLoading1.value = true
    const fieldConfig = unref(fieldConfigRef)
    fieldConfig?.dataListData.forEach((item, index) => {
      Object.assign(item, { sort: index })
    })

    for (var item in fieldConfig?.dataListData) {
      if (fieldConfig?.dataListData[item].columnValue == '') {
        ElMessage.warning(t('common.y'))
        return
      }
    }

    const res = await saveMenuColumn({
      menuId: fieldConfigData.value,
      column: JSON.stringify(fieldConfig?.dataListData)
    })
    if (res.code == 200) {
      // setTimeout(() => {
      ElMessage.success(t('common.operateSuccess'))
      menuVisible.value = false
      saveLoading1.value = false
      // }, 2000)
    } else {
      ElMessage.error(res.data)
    }
    return
  }
  const write = unref(writeRef)
  const formData = await write?.submit()
  if (!formData) return
  formData.name = pathToName(formData.path)

  var reg = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/

  if (formData.menuType == 'D') {
    if (formData.link) {
      if (!reg.test(formData.path)) {
        ElMessage.warning(t('common.b12'))
        return
      }
    }
  } else {
    if (formData.link) {
      if (!reg.test(formData.requestUrl)) {
        ElMessage.warning(t('common.b12'))
        return
      }
    }
  }

  switch (openType.value) {
    case 'edit':
      try {
        const res1 = await editmenu(formData)
        if (res1) {
          menuVisible.value = false
          ElMessage.success(res1.msg)
          queryTableData({})
        }
      } catch (error) {
        console.log(error)
      } finally {
        saveLoading.value = false
      }
      break
    default:
      try {
        const res2 = await addmenu(formData)
        if (res2) {
          menuVisible.value = false
          ElMessage.success(res2.msg)
          queryTableData({})
        }
      } catch (error) {
        console.log(error)
      } finally {
        saveLoading.value = false
      }
      break
  }
}
</script>
