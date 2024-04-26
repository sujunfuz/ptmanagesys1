<script setup lang="tsx">
import { ContentWrap } from '@/components/ContentWrap'
import { useI18n } from '@/hooks/web/useI18n'
import { Table } from '@/components/Table'
import { ref, unref, watch, reactive, onMounted, nextTick } from 'vue'
import { tableStatusStyleTag } from '@/utils/componentUtils'
import { ElButton, ElTree, ElMessageBox, ElMessage } from 'element-plus'
import Empty from '@/components/customComponents/Empty/index.vue'
import {
  getUserByIdApi,
  addOperator,
  addOperatorUI,
  editOperatorUI,
  changeStatus,
  deleteOperatorById,
  resetOperatorPwd,
  getUserPageTop
} from '@/api/operator'
import { useTable } from '@/hooks/web/useTable'
import { Search } from '@/components/Search'
import Write from './components/Write.vue'
import FiledAllocate from './components/FieldAllocate.vue'
import { Dialog } from '@/components/Dialog'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { SelectOption, FormSchema } from '@/components/Form'
import { editOperatorById } from '@/api/operator'
import { getRandomPwd } from '@/utils/common'
import FieldFilter from '@/components/customComponents/FieldFilter/index.vue'
import generateSchema from '@/utils/schemaUtil'
import { useAppStore } from '@/store/modules/app'
import { cloneDeep } from 'lodash-es'
const appStore = useAppStore()
appStore.setRenderLoading(true)
const { t } = useI18n()

const statusOptions = ref()
let roleOptions = ref()

const { tableRegister, tableState, tableMethods } = useTable({
  fetchDataApi: async () => {
    const { pageSize, currentPage } = tableState
    const res = await getUserByIdApi({
      id: unref(currentNodeKey),
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
    const res = await deleteOperatorById({
      id: currentRow.value.id
    })
    return res
  },
  immediate: false
})
const { total, loading, dataList, pageSize, currentPage } = tableState
const { getList, getElTableExpose, delList } = tableMethods

const crudSchemas = reactive<CrudSchema[]>([])

// const { allSchemas } = useCrudSchemas(crudSchemas)
const allSchema = ref<any>([])
const schema = reactive<FormSchema[]>([
  {
    field: 'realName',
    label: '',
    component: 'Input',
    componentProps: {
      slots: {
        prepend: () => <div>{t('operator.operatorName')}</div>
        // append: () => <Icon icon="ep:share" />
      }
    }
  },
  {
    field: 'unStatus',
    label: '',
    component: 'Select',
    componentProps: {
      options: statusOptions,
      slots: {
        prefix: () => <div>{t('operator.status')}</div>
      },
      on: {
        change: () => {
          // console.log('1222')
        }
      }
    }
  },
  {
    field: 'roleId',
    label: '',
    component: 'Select',
    componentProps: {
      options: roleOptions,
      slots: {
        prefix: () => <div>{t('operator.role')}</div>
      },
      on: {
        change: () => {
          // console.log('1222')
        }
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

const treeEl = ref<typeof ElTree>()

const currentNodeKey = ref('')

const currentDepartment = ref('')
watch(
  () => currentDepartment.value,
  (val) => {
    unref(treeEl)!.filter(val)
  }
)

const dialogVisible = ref(false)
const dialogTitle = ref('')
const dialogHeight = ref('')

const currentRow = ref<any>()
const openType = ref('')

const arrTemp = ref<any>([])

const clickdialog = async (
  type: any,
  row: { id: String; status: String; roleIds: Array<String>; loginName: String }
) => {
  row = cloneDeep(row)
  if (type != 'delData' && type != 'changeStatus' && type != 'resetPwd') {
    const res = await addOperatorUI()
    if (res.code == 200) {
      arrTemp.value = []
      res.data.pmsRoleList.forEach((e: { roleName: String; id: String }) => {
        arrTemp.value.push({
          label: e.roleName,
          value: e.id
        })
      })
    }
  }
  openType.value = type
  dialogHeight.value = '450px'
  switch (type) {
    case 'add':
      dialogTitle.value = t('project.add')
      currentRow.value = {
        pwd: getRandomPwd()
      }
      dialogVisible.value = true
      break
    case 'view':
      dialogTitle.value = t('project.view')
      const re1 = await editOperatorUI({ id: row.id })
      if (re1.code == 200) {
        const selfRoleIds = re1.data.selfRoleIds
        if (row.unStatus != 'STATUS_0_0_0_0') {
          row.unStatus = 'UNACTIVE'
        }
        currentRow.value = {
          ...row,
          roleIds: selfRoleIds
        }
        dialogVisible.value = true
      }
      break
    case 'edit':
      dialogTitle.value = t('project.edit')
      const re = await editOperatorUI({ id: row.id })
      if (re.code == 200) {
        const selfRoleIds = re.data.selfRoleIds
        if (row.unStatus != 'STATUS_0_0_0_0') {
          row.unStatus = 'UNACTIVE'
        }
        currentRow.value = {
          ...row,
          roleIds: selfRoleIds
        }
      }
      dialogVisible.value = true
      break
    case 'changeStatus':
      ElMessageBox.confirm(t('common.changeStatus'), t('common.delWarning'), {
        confirmButtonText: t('common.delOk'),
        cancelButtonText: t('common.delCancel'),
        type: 'warning'
      })
        .then(async () => {
          const result = await changeStatus({
            id: row.id,
            unStatus: row.unStatus == 'STATUS_0_0_0_0' ? 'UNACTIVE' : 'STATUS_0_0_0_0'
          })
          if (result.code == 200) {
            ElMessage({
              message: t('common.operateSuccess'),
              type: 'success'
            })
          } else {
            ElMessage({
              message: t('common.operateError'),
              type: 'error'
            })
          }
          getList()
        })
        .catch(() => {})
      break
    case 'delData':
      currentRow.value = {
        ...row
      }
      delList(1)
      break
    case 'resetPwd':
      dialogTitle.value = t('common.resetPwd')
      dialogHeight.value = '150px'
      currentRow.value = { id: row.id, loginName: row.loginName }
      dialogVisible.value = true
      break
  }
}

const delLoading = ref(false)

const writeRef = ref<ComponentRef<typeof Write>>()

const saveLoading = ref(false)

const save = async () => {
  const write = unref(writeRef)
  const formData = await write?.submit()
  if (formData) {
    saveLoading.value = true
    let res = ref<any>([])
    try {
      if (openType.value == 'add') {
        formData.roleIds = formData.roleIds + ''
        res.value = await addOperator(formData)
      }
      if (openType.value == 'edit') {
        formData.roleIds = formData.roleIds + ''
        res.value = await editOperatorById(formData)
      }
      if (openType.value == 'resetPwd') {
        res.value = await resetOperatorPwd(formData)
      }
      if (res.value.code == 200) {
        ElMessage({
          message: t('common.operateSuccess'),
          type: 'success'
        })
        currentPage.value = 1
        dialogVisible.value = false
        getList()
      } else {
        ElMessage({
          message: t('common.operateError'),
          type: 'error'
        })
      }
    } catch (error) {
      console.log(error)
    } finally {
      saveLoading.value = false
    }
  }
}
//字段分配功能
const fieldVisible = ref(false)
const operatorId = ref('')
const currentRoleName = ref('')
//字段筛选功能
const fieldFilterVisible = ref(false)
const staticSchema = [
  {
    field: 'unStatusStr',
    label: t('project.status'),
    formatter: (data: any) => {
      return tableStatusStyleTag(data.unStatus)
    }
  }
]
const actionSchema = {
  field: 'action',
  label: t('userDemo.action'),
  fixed: 'right',
  width: '300px',
  slots: {
    default: (data: any) => {
      const row = data.row
      const status = data.row.unStatus as String
      return (
        <>
          <div class="[&>span]:(cursor-pointer m-2) flex flex-wrap colorMain ">
            <span v-hasPermi="pms:operator:view" onClick={() => clickdialog('view', row)}>
              {' '}
              {t('project.view')}{' '}
            </span>
            <span
              v-show={row.roleNames.indexOf('注册角色') == -1}
              v-hasPermi="pms:operator:edit"
              onClick={() => clickdialog('edit', row)}
            >
              {' '}
              {t('project.edit')}{' '}
            </span>
            <span v-hasPermi="pms:operator:resetpwd" onClick={() => clickdialog('resetPwd', row)}>
              {' '}
              {t('common.resetPwd')}{' '}
            </span>
            <span
              v-hasPermi="pms:operator:freezeuser"
              v-show={row.roleNames.indexOf('注册角色') == -1}
              onClick={() => clickdialog('changeStatus', row)}
            >
              {' '}
              {status != 'STATUS_0_0_0_0' ? t('userDemo.enable') : t('userDemo.disable')}{' '}
            </span>
            <span
              v-hasPermi="pms:operator:fieldallocate"
              v-show={row.roleNames.indexOf('注册角色') == -1}
              onClick={() => {
                fieldVisible.value = true
                operatorId.value = row.id
                currentRoleName.value = row.roleNames
              }}
            >
              {' '}
              {t('menu.fieldConfig')}{' '}
            </span>
            <span
              v-hasPermi="pms:operator:delete"
              class="color-red-500"
              onClick={() => clickdialog('delData', row)}
            >
              {t('role.delete')}
            </span>
          </div>
        </>
      )
    }
  }
}
watch(
  () => fieldFilterVisible.value,
  (val) => {
    if (!val) {
      init()
    }
  }
)
onMounted(async () => {
  init()
})
const init = async () => {
  appStore.setRenderLoading(true)
  const result = await getUserPageTop()
  let arr = generateSchema(result.data.pageColumn, staticSchema)
  arr.push(actionSchema)
  allSchema.value = arr
  const { roleList, status } = result.data
  roleOptions.value = [
    {
      label: '注册角色',
      value: '0'
    }
  ]
  for (let i = 0; i < roleList.length; i++) {
    roleOptions.value.push({
      label: roleList[i].roleName,
      value: roleList[i].id
    })
  }
  statusOptions.value = status
  nextTick(() => {
    getList()
  })
}
</script>

<template>
  <ContentWrap>
    <div class="flex">
      <Search
        v-hasPermi="'pms:operator:list'"
        :schema="schema"
        @reset="setSearchParams"
        @search="setSearchParams"
      />
      <div class="mb-10px flex">
        <ElButton
          v-hasPermi="'pms:operator:editColumn'"
          plain
          @click="fieldFilterVisible = true"
          >{{ t('common.fieldFiltering') }}</ElButton
        >
        <ElButton
          type="primary"
          v-hasPermi="'pms:operator:add'"
          @click="clickdialog('add', { id: '' })"
          >{{ t('exampleDemo.add') }}{{ t('operator.staff') }}</ElButton
        >
      </div>
    </div>
  </ContentWrap>
  <ContentWrap class="mt-20px flex-1" :isBlock="false">
    <!-- <div class="mb-10px"> </div> -->
    <Table
      v-if="dataList.length != 0"
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :columns="allSchema"
      :data="dataList"
      :loading="loading"
      @register="tableRegister"
      :pagination="{
        total,
        layout: ' ->, total, sizes, prev, pager, next, jumper'
      }"
    />
    <Empty v-else />
  </ContentWrap>

  <Dialog
    v-if="dialogVisible"
    v-model="dialogVisible"
    :title="dialogTitle"
    :max-height="dialogHeight"
  >
    <Write
      ref="writeRef"
      :openType="openType"
      :isCol="false"
      :currentRow="currentRow"
      :statusOptions="statusOptions"
      :arrTemp="arrTemp"
    />

    <template #footer v-if="openType !== 'view'">
      <ElButton @click="dialogVisible = false">{{ t('project.cancel') }}</ElButton>
      <ElButton type="primary" :loading="saveLoading" @click="save">
        {{ t('project.confirm') }}
      </ElButton>
    </template>
  </Dialog>
  <Dialog v-if="fieldVisible" v-model="fieldVisible" :title="t('project.edit')">
    <FiledAllocate :operatorId="operatorId" :current-role-name="currentRoleName" />
  </Dialog>
  <FieldFilter
    v-if="fieldFilterVisible"
    :ui-url="'/pms/operator/operatorSortColumnUI'"
    :sort-url="'/pms/operator/operatorSortColumn'"
    v-model:fieldVisible="fieldFilterVisible"
  />
</template>
