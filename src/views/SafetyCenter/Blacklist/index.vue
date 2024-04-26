<template>
  <ContentWrap class="flex-1" :isBlock="false">
    <div class="flex justify-between p-20px">
      <ElRadioGroup v-model="tabPosition" @change="getList()">
        <ElRadioButton v-hasPermi="'safetyCenter:safIp:listBlack'" label="1">{{
          t('blackList.sub2')
        }}</ElRadioButton>
        <ElRadioButton v-hasPermi="'safetyCenter:safCardGroup:listBlack'" label="2">{{
          t('blackList.sub3')
        }}</ElRadioButton>
        <ElRadioButton v-hasPermi="'safetyCenter:safCard:listBlack'" label="3">{{
          t('blackList.sub4')
        }}</ElRadioButton>
      </ElRadioGroup>
      <ElButton
        v-if="tabPosition == '1'"
        v-hasPermi="'safetyCenter:safIp:addBlack'"
        type="primary"
        @click="AddAction"
        >{{ t('project.add') }}</ElButton
      >
      <ElButton
        v-else-if="tabPosition == '2'"
        v-hasPermi="'safetyCenter:safCardGroup:addBlack'"
        type="primary"
        @click="AddAction"
        >{{ t('project.add') }}</ElButton
      >
      <ElButton
        v-else-if="tabPosition == '3'"
        v-hasPermi="'safetyCenter:safCard:addBlack'"
        type="primary"
        @click="AddAction"
        >{{ t('project.add') }}</ElButton
      >
    </div>
    <Table
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :columns="AllSchemas.allSchemas.tableColumns"
      :data="dataList"
      :loading="loading"
      @select="handleSelectionChange"
      @select-all="handleSelectionAllChange"
      @register="tableRegister"
      :pagination="{
        total,
        layout: ' ->, total, sizes, prev, pager, next, jumper'
      }"
    />
  </ContentWrap>

  <Dialog v-model="dialogVisible" :title="dialogTitle" max-height="250px">
    <Write
      ref="writeRef"
      :currentRow="currentRow"
      :tabPosition="tabPosition"
      :actionType="actionType"
      v-if="actionType != 'action'"
    />

    <el-form
      v-else
      ref="ruleFormRef"
      label-position="top"
      label-width="100px"
      :model="ruleForm"
      :rules="rules"
    >
      <el-form-item :label="t('whiteList.sub7')" prop="behavior">
        <el-input
          maxlength="500"
          show-word-limit
          v-model="ruleForm.behavior"
          :rows="5"
          type="textarea"
        />
      </el-form-item>
    </el-form>
    <template #footer v-if="actionType != 'view'">
      <ElButton @click="dialogVisible = false">{{ t('project.cancel') }}</ElButton>
      <ElButton v-if="actionType != 'action'" type="primary" :loading="saveLoading" @click="save">
        {{ t('project.confirm') }}
      </ElButton>
      <ElButton v-else type="primary" :loading="saveLoading" @click="submitForm(ruleFormRef)">
        {{ t('project.confirm') }}
      </ElButton>
    </template>
  </Dialog>
</template>

<script setup lang="tsx">
import { ContentWrap } from '@/components/ContentWrap'
import { useI18n } from '@/hooks/web/useI18n'
import { ref, unref, reactive, onMounted } from 'vue'
import {
  ElButton,
  ElInput,
  ElForm,
  ElFormItem,
  ElMessage,
  ElRadioGroup,
  ElRadioButton
} from 'element-plus'
import {
  addDataListApi1,
  addDataListApi2,
  addDataListApi3,
  getPageListApi1,
  getPageListApi2,
  getPageListApi3,
  getPageListByIdApi1,
  getPageListByIdApi2,
  getPageListByIdApi3,
  releaseCardGroupList1,
  releaseCardGroupList2,
  releaseCardGroupList3
} from '@/api/safetyCenter/whiteList'
import type { DepartmentUserItem } from '@/api/department/types'
import { useTable } from '@/hooks/web/useTable'
import Write from './components/Write.vue'
import { Dialog } from '@/components/Dialog'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { Table } from '@/components/Table'
import type { FormInstance, FormRules } from 'element-plus'
import { computed, watch } from 'vue'
import { useValidator } from '@/hooks/web/useValidator'

const { t } = useI18n()

const id = ref()
const ruleFormRef = ref<FormInstance>()

const tabPosition = ref('1')
onMounted(() => {
  init()
})

interface RuleForm {
  behavior: ''
}
const { required } = useValidator()
const rules = reactive({
  behavior: [required()],
  cardGroupName: [required()]
})

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      let res
      if (tabPosition.value == '1') {
        res = await releaseCardGroupList1({
          id: id.value,
          type: 'BLACK',
          behavior: ruleForm.behavior
        })
      }
      if (tabPosition.value == '2') {
        res = await releaseCardGroupList2({
          id: id.value,
          type: 'BLACK',
          behavior: ruleForm.behavior
        })
      }
      if (tabPosition.value == '3') {
        res = await releaseCardGroupList3({
          id: id.value,
          type: 'BLACK',
          behavior: ruleForm.behavior
        })
      }

      if (res.code == 200) {
        ElMessage.success(t('common.operateSuccess'))
      }

      if (res) {
        currentPage.value = 1
        dialogVisible.value = false
        ruleForm.behavior = ''
        getList()
      }
    } else {
      console.log('error submit!', fields)
    }
  })
}

const ruleForm = reactive<RuleForm>({
  behavior: ''
})

const init = async () => {
  getList()
}

const { tableRegister, tableState, tableMethods } = useTable({
  fetchDataApi: async () => {
    const { pageSize, currentPage } = tableState
    let res
    if (tabPosition.value == '1') {
      res = await getPageListApi1({
        currentPage: unref(currentPage),
        pageSize: unref(pageSize),
        ...unref(searchParams),
        type: 'BLACK'
      })
    }
    if (tabPosition.value == '2') {
      res = await getPageListApi2({
        currentPage: unref(currentPage),
        pageSize: unref(pageSize),
        ...unref(searchParams),
        type: 'BLACK'
      })
    }
    if (tabPosition.value == '3') {
      res = await getPageListApi3({
        currentPage: unref(currentPage),
        pageSize: unref(pageSize),
        ...unref(searchParams),
        type: 'BLACK'
      })
    }
    return {
      list: res.data.list,
      total: res.data.total
    }
  },
  immediate: false
})
const { total, loading, dataList, pageSize, currentPage } = tableState
const { getList, getElTableExpose, delList } = tableMethods

const crudSchemas1 = reactive<CrudSchema[]>([
  {
    field: 'ip',
    label: t('whiteList.ip'),
    search: {
      hidden: true
    }
  },
  {
    field: 'monitoringEventStr',
    label: t('abnormalMerchant.sub1'),
    search: {
      hidden: true
    }
  },
  {
    field: 'behavior',
    label: t('abnormalMerchant.sub3'),
    search: {
      hidden: true
    }
  },
  {
    field: 'createTimeStr',
    label: t('whiteList.time'),
    search: {
      hidden: true
    }
  },
  {
    field: 'action',
    label: t('userDemo.action'),
    table: {
      width: 200,
      fixed: 'right',
      slots: {
        default: (data: any) => {
          const row = data.row as DepartmentUserItem
          return (
            <>
              <div class="[&>span]:(cursor-pointer m-2) flex flex-wrap colorMain ">
                <span
                  v-hasPermi="safetyCenter:safIp:blackDetail"
                  onClick={() => action(row, 'view')}
                >
                  {' '}
                  {t('project.detail')}{' '}
                </span>
                <span
                  v-hasPermi="safetyCenter:safIp:releaseBlack"
                  onClick={() => action(row, 'action')}
                >
                  {t('blackList.break')}
                </span>
              </div>
            </>
          )
        }
      }
    }
  }
])

const crudSchemas2 = reactive<CrudSchema[]>([
  {
    field: 'cardGroupName',
    label: t('cardBank.name'),
    search: {
      hidden: true
    }
  },
  {
    field: 'cardGroupCode',
    label: t('cardBank.code'),
    search: {
      hidden: true
    }
  },
  {
    field: 'behavior',
    label: t('whiteList.reason'),
    search: {
      hidden: true
    }
  },
  {
    field: 'createTimeStr',
    label: t('whiteList.time'),
    search: {
      hidden: true
    }
  },
  {
    field: 'action',
    label: t('userDemo.action'),
    table: {
      width: 200,
      fixed: 'right',
      slots: {
        default: (data: any) => {
          const row = data.row as DepartmentUserItem
          return (
            <>
              <div class="[&>span]:(cursor-pointer m-2) flex flex-wrap colorMain ">
                <span
                  v-hasPermi="safetyCenter:safCardGroup:blackDetail"
                  onClick={() => action(row, 'view')}
                >
                  {' '}
                  {t('project.detail')}{' '}
                </span>
                <span
                  v-hasPermi="safetyCenter:safCardGroup:releaseBlack"
                  onClick={() => action(row, 'action')}
                >
                  {t('blackList.break')}
                </span>
              </div>
            </>
          )
        }
      }
    }
  }
])

const crudSchemas3 = reactive<CrudSchema[]>([
  {
    field: 'cardNo',
    label: t('accountAuthentication.sub3'),
    search: {
      hidden: true
    }
  },
  {
    field: 'behavior',
    label: t('whiteList.reason'),
    search: {
      hidden: true
    }
  },
  {
    field: 'createTime',
    label: t('whiteList.time'),
    search: {
      hidden: true
    }
  },
  {
    field: 'action',
    label: t('userDemo.action'),
    table: {
      width: 200,
      fixed: 'right',
      slots: {
        default: (data: any) => {
          const row = data.row as DepartmentUserItem
          return (
            <>
              <div class="[&>span]:(cursor-pointer m-2) flex flex-wrap colorMain ">
                <span
                  v-hasPermi="safetyCenter:safCard:blackDetail"
                  onClick={() => action(row, 'view')}
                >
                  {' '}
                  {t('project.detail')}{' '}
                </span>
                <span
                  v-hasPermi="safetyCenter:safCard:releaseBlack"
                  onClick={() => action(row, 'action')}
                >
                  {t('blackList.break')}
                </span>
              </div>
            </>
          )
        }
      }
    }
  }
])

const AllSchemas = ref<any>([])
// const { allSchemas } = useCrudSchemas(crudSchemas1)

watch(
  () => tabPosition.value,
  () => {
    if (tabPosition.value == '1') {
      AllSchemas.value = useCrudSchemas(crudSchemas1)
    }
    if (tabPosition.value == '2') {
      AllSchemas.value = useCrudSchemas(crudSchemas2)
    }
    if (tabPosition.value == '3') {
      AllSchemas.value = useCrudSchemas(crudSchemas3)
    }
  },
  {
    immediate: true
  }
)

const searchParams = ref({})
const setSearchParams = (params: any) => {
  currentPage.value = 1
  searchParams.value = params
  getList()
}

// 表格选择
const chooseCount = ref(0)
const chooseIdsList = ref<any>([]) //ids

const handleSelectionChange = (row: any) => {
  chooseCount.value = row.length
  row.forEach((e: any) => {
    chooseIdsList.value.push(e.id)
  })
}

const handleSelectionAllChange = (row: any) => {
  if (!row.length) {
    chooseCount.value = 0
    chooseIdsList.value = []
  } else {
    chooseIdsList.value = []
    row.forEach((e: any) => {
      chooseIdsList.value.push(e.id)
    })
    chooseCount.value = chooseIdsList.value.length
  }
}

const dialogVisible = ref(false)
const dialogTitle = ref('')

const currentRow = ref<any>()
const actionType = ref('')

const AddAction = () => {
  dialogTitle.value = t('blackList.sub1')
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

const action = async (row: any, type: string) => {
  switch (type) {
    case 'view':
      dialogTitle.value = t('project.view')
      break
    case 'action':
      dialogTitle.value = t('blackList.break')
      id.value = row.id
      break
  }

  let res

  if (tabPosition.value == '1') {
    res = await getPageListByIdApi1(row.id)
  }

  if (tabPosition.value == '2') {
    res = await getPageListByIdApi2(row.id)
  }

  if (tabPosition.value == '3') {
    res = await getPageListByIdApi3(row.id)
  }

  currentRow.value = res.data
  actionType.value = type
  dialogVisible.value = true
}

const writeRef = ref<ComponentRef<typeof Write>>()

const saveLoading = ref(false)

const save = async () => {
  const write = unref(writeRef)
  let formData = await write?.submit()

  if (formData) {
    saveLoading.value = true
    let res
    try {
      if (tabPosition.value == '1') {
        res = await addDataListApi1({
          ...formData,
          type: 'BLACK'
        })
      }
      if (tabPosition.value == '2') {
        res = await addDataListApi2({
          ...formData,
          type: 'BLACK'
        })
      }

      if (tabPosition.value == '3') {
        res = await addDataListApi3({
          ...formData,
          type: 'BLACK'
        })
      }

      if (res.code == 200) {
        ElMessage.success(t('common.operateSuccess'))
      }
    } catch (error) {
      console.log(error)
    } finally {
      saveLoading.value = false
      dialogVisible.value = false
      currentPage.value = 1
      getList()
    }
  }
}
</script>

<style lang="less" scoped>
.subString {
  color: #747474;
  font-size: 14px;
}
</style>
