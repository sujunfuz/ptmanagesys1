<template>
  <ContentWrap class="flex-1" :isBlock="false">
    <div class="flex justify-between p-20px pb-0px">
      <ElRadioGroup v-model="tabPosition" style="margin-bottom: 20px" @change="getList()">
        <ElRadioButton label="RECOMMEND_TYPE_GOODS">{{ t('Recommendation.sub1') }}</ElRadioButton>
        <ElRadioButton label="RECOMMEND_TYPE_FACTORY">{{ t('Recommendation.sub2') }}</ElRadioButton>
      </ElRadioGroup>
      <ElButton v-hasPermi="'rprecommend:rpRecommend:add'" type="primary" @click="AddAction">{{
        t('project.add')
      }}</ElButton>
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

  <Dialog v-model="dialogVisible" :title="dialogTitle" :max-height="maxHeight">
    <Write
      ref="writeRef"
      :currentRow="currentRow"
      :actionType="actionType"
      :recommendStatus="recommendStatus"
      :choiceTimeEnum="choiceTimeEnum"
      :tabPosition="tabPosition"
      :tabPositionEnum="
        tabPosition == 'RECOMMEND_TYPE_GOODS' ? goodsPriorityEnum : storePriorityEnum
      "
    />

    <template #footer v-if="actionType != 'view'">
      <ElButton @click="dialogVisible = false">{{ t('project.cancel') }}</ElButton>
      <ElButton type="primary" :loading="saveLoading" @click="save">
        {{ t('project.confirm') }}
      </ElButton>
    </template>
  </Dialog>

  <Dialog v-model="dialogVisible1" :title="dialogTitle1">
    <ChoosMer ref="choosMerRef" :openType="openType" :tabPosition="tabPosition" :openId="openId" />
  </Dialog>
</template>

<script setup lang="tsx">
import { ContentWrap } from '@/components/ContentWrap'
import { useI18n } from '@/hooks/web/useI18n'
import { ref, unref, reactive, onMounted } from 'vue'
import { ElButton, ElRadioGroup, ElRadioButton, ElCascader, ElMessage } from 'element-plus'
import {
  getPageTopApi,
  getPageListApi,
  deleteApi,
  addApi,
  editApi
} from '@/api/operationCenter/recommendation'
import type { DepartmentUserItem } from '@/api/department/types'
import { useTable } from '@/hooks/web/useTable'
import { Search } from '@/components/Search'
import Write from './components/Write.vue'
import ChoosMer from './components/ChoosMer.vue'
import { Dialog } from '@/components/Dialog'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { SelectOption, FormSchema } from '@/components/Form'
import { Table } from '@/components/Table'

const { t } = useI18n()

const tabPosition = ref('RECOMMEND_TYPE_GOODS')
onMounted(() => {
  init()
})

const openType = ref('')
const openId = ref('')
const dialogVisible1 = ref()
const dialogTitle1 = ref()

const maxHeight = ref('')

const recommendStatus = ref()
const goodsPriorityEnum = ref()
const storePriorityEnum = ref()
const choiceTimeEnum = ref()
const init = async () => {
  const res = await getPageTopApi()
  if (res.code == 200) {
    recommendStatus.value = res.data.RecommendStatus
    goodsPriorityEnum.value = res.data.GoodsPriorityEnum
    storePriorityEnum.value = res.data.StorePriorityEnum
    choiceTimeEnum.value = res.data.ChoiceTimeEnum
  }
  getList()
}

const { tableRegister, tableState, tableMethods } = useTable({
  fetchDataApi: async () => {
    const { pageSize, currentPage } = tableState
    const res = await getPageListApi({
      currentPage: unref(currentPage),
      pageSize: unref(pageSize),
      ...unref(searchParams),
      type: tabPosition.value
    })
    return {
      list: res.data.list,
      total: res.data.total
    }
  },
  fetchDelApi: async () => {
    const res = await deleteApi(unref(ids))
    return res
  },
  immediate: false
})
const { total, loading, dataList, pageSize, currentPage } = tableState
const { getList, getElTableExpose, delList } = tableMethods

const clickAction = (data, id) => {
  dialogVisible1.value = true
  openType.value = data
  openId.value = id
  if (tabPosition.value == 'RECOMMEND_TYPE_GOODS') {
    if (data == 'operate') {
      dialogTitle1.value = t('Recommendation.sub4')
    }

    if (data == 'acquiesce') {
      dialogTitle1.value = t('Recommendation.sub3')
    }
  } else {
    if (data == 'operate') {
      dialogTitle1.value = t('Recommendation.sub6')
    }

    if (data == 'acquiesce') {
      dialogTitle1.value = t('Recommendation.sub5')
    }
  }
}
const crudSchemas = reactive<CrudSchema[]>([
  {
    field: 'title',
    label: t('Recommendation.name'),
    search: {
      hidden: true
    }
  },
  {
    field: 'priorityStr',
    label: t('Recommendation.rule'),
    search: {
      hidden: true
    }
  },
  {
    field: 'sort',
    label: t('Recommendation.sort'),
    search: {
      hidden: true
    }
  },
  {
    field: 'createTimeStr',
    label: t('Recommendation.time'),
    search: {
      hidden: true
    }
  },
  {
    field: 'action',
    label: t('userDemo.action'),
    table: {
      width: 300,
      fixed: 'right',
      slots: {
        default: (data: any) => {
          const row = data.row as DepartmentUserItem
          return (
            <>
              <div class="[&>span]:(cursor-pointer m-2) flex flex-wrap colorMain ">
                <span onClick={() => action(row, 'view')}> {t('project.view')} </span>
                <span v-hasPermi="rprecommend:rpRecommend:edit" onClick={() => action(row, 'edit')}>
                  {' '}
                  {t('project.edit')}{' '}
                </span>
                <span
                  v-hasPermi="rprecommend:rpRecommend:default"
                  onClick={() => clickAction('acquiesce', row.id)}
                >
                  {tabPosition.value == 'RECOMMEND_TYPE_GOODS'
                    ? t('Recommendation.sub3')
                    : t('Recommendation.sub5')}
                </span>
                <span onClick={() => clickAction('operate', row.id)}>
                  {tabPosition.value == 'RECOMMEND_TYPE_GOODS'
                    ? t('Recommendation.sub4')
                    : t('Recommendation.sub6')}
                </span>
                {/* <span class="color-red-500" onClick={() => delData(row)}>
                  {t('role.delete')}
                </span> */}
              </div>
            </>
          )
        }
      }
    }
  }
])

const { allSchemas } = useCrudSchemas(crudSchemas)

const searchParams = ref({})

const dialogVisible = ref(false)
const dialogTitle = ref('')

const currentRow = ref<any>()
const actionType = ref('')

const AddAction = () => {
  dialogTitle.value = t('project.add') + t('Recommendation.name1')
  currentRow.value = undefined
  maxHeight.value = '280'
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
  switch (type) {
    case 'view':
      maxHeight.value = '120'
      dialogTitle.value = t('project.view') + t('Recommendation.name1')
      break
    case 'edit':
      maxHeight.value = '280'
      dialogTitle.value = t('project.edit') + t('Recommendation.name1')
      break
  }

  currentRow.value = row
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
      if (actionType.value == 'add') {
        if (formData.choiceRange == '0') {
          formData.choiceRange = ''
        }
        res = await addApi({ ...formData, type: tabPosition.value })
        if (res.code == 200) {
          ElMessage.success(t('common.operateSuccess'))
        }
      } else {
        if (formData.choiceRange == '0') {
          formData.choiceRange = ''
        }
        res = await editApi({ ...formData, type: tabPosition.value })
        if (res.code == 200) {
          ElMessage.success(t('common.operateSuccess'))
        }
      }

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

<style lang="less" scoped>
.subString {
  color: #747474;
  font-size: 14px;
}
</style>
