<template>
  <ContentWrap>
    <div class="flex">
      <Search
        v-hasPermi="'mer:operator:list'"
        :schema="schema"
        @reset="setSearchParams"
        @search="setSearchParams"
      />
      <div class="mb-10px" v-hasPermi="'mer:operator:add'">
        <ElButton type="primary" @click="viewData('', 'add')" :loading="delLoading"
          >{{ t('project.add') }}{{ t('staff.name1') }}</ElButton
        >
      </div>
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
  <Dialog v-model="dialogVisible" :title="dialogTitle" :max-height="dialogHeight">
    <div class="h-5px"></div>
    <Write
      ref="writeRef"
      :currentRow="currentRow"
      :actionType="actionType"
      :pmsRoleList="roleListEnum"
      :statusEnum="statusEnum"
    />
    <div class="h-5px"></div>
    <template #footer v-if="actionType != 'view'">
      <ElButton class="w-70px !h-40px" @click="dialogVisible = false">{{
        t('project.cancel')
      }}</ElButton>
      <ElButton @click="submit" class="w-70px !h-40px" type="primary">{{
        t('project.confirm')
      }}</ElButton>
    </template>
  </Dialog>
</template>

<script setup lang="tsx">
import { useIcon } from '@/hooks/web/useIcon'
import { ContentWrap } from '@/components/ContentWrap'
import { useI18n } from '@/hooks/web/useI18n'
import { ref, unref, watch, reactive, onMounted } from 'vue'
import { ElButton, ElTree, ElMessage, ElTag } from 'element-plus'
import {
  getListApi,
  deleteApi,
  getTopApi,
  getaddUI,
  addApi,
  geteditUI,
  resetPwd,
  editApi
} from '@/api/company/staff'
import type { DepartmentUserItem } from '@/api/department/types'
import { useTable } from '@/hooks/web/useTable'
import { Search } from '@/components/Search'
import { Dialog } from '@/components/Dialog'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { SelectOption, FormSchema } from '@/components/Form'
import { dateTimeRange } from '@/utils/time'
import { Table } from '@/components/Table'
import Write from './components/Write.vue'
import Repwd from './components/Repwd.vue'
import { tableStatusStyleTag } from '@/utils/componentUtils'

const { t } = useI18n()

const svgTrash = useIcon({ icon: 'ep:delete' })
const { tableRegister, tableState, tableMethods } = useTable({
  fetchDataApi: async () => {
    const { pageSize, currentPage } = tableState
    const res = await getListApi({
      currentPage: unref(currentPage),
      pageSize: unref(pageSize),
      ...unref(searchParams)
    })
    return res.data
  },
  fetchDelApi: async () => {
    const res = await deleteApi(unref(ids))
    return res
  },
  immediate: false
})
const { total, loading, dataList, pageSize, currentPage } = tableState
const { getList, getElTableExpose, delList } = tableMethods

onMounted(() => {
  init()
})

const pmsRoleList = ref()
const roleListEnum = ref()
const statusEnum = ref()

const init = async () => {
  const res = await getTopApi()
  roleListEnum.value = []
  let temp = res.data.roleList
  for (let i = 0; i < temp.length; i++) {
    roleListEnum.value.push({
      label: temp[i].roleName,
      value: temp[i].id
    })
  }
  statusEnum.value = res.data.status
  getList()
}

const crudSchemas = reactive<CrudSchema[]>([
  {
    field: 'realName',
    label: t('staff.name'),
    search: {
      hidden: true
    }
  },
  {
    field: 'email',
    label: t('staff.email'),
    search: {
      hidden: true
    }
  },
  {
    field: 'roleNames',
    label: t('staff.role'),
    search: {
      hidden: true
    }
  },
  {
    field: 'unstatusStr',
    label: t('staff.status'),
    search: {
      hidden: true
    },
    formatter: (data: any) => {
      const status = data.unStatus || ''
      return tableStatusStyleTag(status)
    }
  },
  {
    field: 'id',
    label: t('staff.id'),
    search: {
      hidden: true
    }
  },
  {
    field: 'mobileNo',
    label: t('staff.iphone'),
    minWidth: 100,
    search: {
      hidden: true
    }
  },
  {
    field: 'createTimeStr',
    label: t('staff.time'),
    search: {
      hidden: true
    }
  },
  {
    field: 'action',
    label: t('userDemo.action'),
    width: 200,
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
          const row = data.row
          return (
            <>
              {row.merTopIs != 'YES' ? (
                <div class="[&>span]:(cursor-pointer m-2) flex flex-wrap colorMain ">
                  <span v-hasPermi="pms:operator:view" onClick={() => viewData(row, 'view')}>
                    {t('project.view')}
                  </span>
                  <span v-hasPermi="pms:operator:edit" onClick={() => viewData(row, 'edit')}>
                    {t('project.edit')}
                  </span>
                  <span v-hasPermi="pms:operator:resetpwd" onClick={() => viewData(row, 'repwd')}>
                    {t('common.resetPwd')}
                  </span>
                  <span
                    v-hasPermi="pms:operator:delete"
                    class="color-red-500"
                    onClick={() => delData(row)}
                  >
                    {t('role.delete')}
                  </span>
                </div>
              ) : (
                ''
              )}
            </>
          )
        }
      }
    }
  }
])

const actionType = ref('')
const dialogVisible = ref(false)
const dialogTitle = ref('')
const dialogHeight = ref('')
const viewData = async (row: any, type: string) => {
  switch (type) {
    case 'edit':
      const editRes = await geteditUI({ id: row.id })
      if (editRes.code == 200) {
        currentRow.value = {
          ...editRes.data.pmsRoleList[0],
          ...row,
          roleIdList: editRes.data.selfRoleIds
        }
      }
      if (currentRow.value.unStatus != 'STATUS_0_0_0_0') {
        currentRow.value.unStatus = 'UNACTIVE'
      }
      dialogTitle.value = t('project.edit') + t('staff.name1')
      dialogHeight.value = '450px'
      break

    case 'add':
      const addRes = await getaddUI({ id: row.id })
      if (addRes.code == 200) {
        currentRow.value = addRes.data
      }
      pmsRoleList.value = []
      let temp = addRes.data.pmsRoleList
      for (let i = 0; i < temp.length; i++) {
        pmsRoleList.value.push({
          label: temp[i].roleName,
          value: temp[i].id
        })
      }
      dialogTitle.value = t('project.add') + t('staff.name1')
      dialogHeight.value = '450px'
      break

    case 'view':
      const viewRes = await geteditUI({ id: row.id })
      if (viewRes.code == 200) {
        currentRow.value = {
          ...viewRes.data.pmsRoleList[0],
          ...row,
          roleIdList: String(viewRes.data.selfRoleIds)
        }
        if (currentRow.value.unStatus != 'STATUS_0_0_0_0') {
          currentRow.value.unStatus = 'UNACTIVE'
        }
      }
      dialogTitle.value = t('project.view') + t('staff.name1')
      dialogHeight.value = '400px'
      break

    case 'repwd':
      currentRow.value = row
      dialogTitle.value = t('common.resetPwd')
      dialogHeight.value = '400px'
      break
  }
  actionType.value = type
  dialogVisible.value = true
}

const { allSchemas } = useCrudSchemas(crudSchemas)

const schema = reactive<FormSchema[]>([
  {
    field: 'realName',
    label: '',
    component: 'Input',
    componentProps: {
      slots: {
        prepend: () => <div>{t('staff.name')}</div>
        // append: () => <Icon icon="ep:share" />
      }
    }
  },
  {
    field: 'unStatus',
    label: '',
    component: 'Select',
    componentProps: {
      options: statusEnum,
      slots: {
        prefix: () => <div>{t('staff.status')}</div>
      }
    }
  },
  {
    field: 'roleId',
    label: '',
    component: 'Select',
    componentProps: {
      options: roleListEnum,
      slots: {
        prefix: () => <div>{t('staff.role')}</div>
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

const treeEl = ref<typeof ElTree>()

const currentDepartment = ref('')
watch(
  () => currentDepartment.value,
  (val) => {
    unref(treeEl)!.filter(val)
  }
)

const writeRef = ref()
const submit = async () => {
  const write = unref(writeRef)
  const formData = await write?.submit()
  if (formData) {
    if (actionType.value == 'add') {
      const res = await addApi(formData)
      if (res.code == 200) {
        ElMessage.success(t('common.operateSuccess'))
        getList()
      }
    }
    if (actionType.value == 'edit') {
      const res = await editApi(formData)
      if (res.code == 200) {
        ElMessage.success(t('common.operateSuccess'))
        getList()
      }
    }
    if (actionType.value == 'repwd') {
      const res = await resetPwd(formData)
      if (res.code == 200) {
        ElMessage.success(t('common.operateSuccess'))
        getList()
      }
    }

    dialogVisible.value = false
  }
}

const currentRow = ref()

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
</script>
