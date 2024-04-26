<template>
  <ContentWrap>
    <div class="flex-cb mb-20px">
      <ElRadioGroup v-hasPermi="'goods:ecAttr:list'" v-model="tabRadio" @change="setSearchParams">
        <ElRadioButton v-for="(it, i) in RadioList" :key="i" :label="it.value">{{
          it.label
        }}</ElRadioButton>
      </ElRadioGroup>
      <div class="flex-c">
        <!-- <ElButton type="primary" plain @click="fieldFilterVisible = true">{{
          t('common.fieldFiltering')
        }}</ElButton> -->
        <ElButton v-hasPermi="'goods:ecAttr:add'" type="primary" @click="AddAction">{{
          t('CategoryAttribute.addcategoryatt')
        }}</ElButton>
      </div>
    </div>
    <Search
      v-hasPermi="'goods:ecAttr:list'"
      :schema="schema"
      @reset="setSearchParams"
      @search="setSearchParams"
    />
  </ContentWrap>
  <ContentWrap class="mt-20px flex-1" :isBlock="false">
    <div class="flex-c p-20px">
      <span class="subString">{{ t('project.yisel') }} </span>
      <span class="colorMain">&nbsp;{{ chooseCount }}&nbsp;</span>
      <span class="subString">{{ t('CategoryAttribute.attunit') }}</span>
      <div
        v-hasPermi="'goods:ecAttr:delete'"
        class="aCustomBtn"
        @click="batchDelete"
        :class="chooseCount > 0 ? 'customBtnHover' : ''"
      >
        {{ t('project.delete') }}
      </div>
    </div>
    <Table
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :columns="allSchemas.tableColumns"
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

  <Dialog v-model="dialogVisible" :title="dialogTitle" max-height="300px">
    <Write
      ref="writeRef"
      :currentRow="currentRow"
      :requiredEnum="requiredEnum"
      :attrTypeEnum="attrTypeEnum"
      :inputTypeEnum="inputTypeEnum"
      :options="aOptions"
    />

    <template #footer v-if="actionType === 'edit' || actionType === 'add'">
      <ElButton @click="dialogVisible = false">{{ t('project.cancel') }}</ElButton>
      <ElButton type="primary" :loading="saveLoading" @click="save">
        {{ t('project.confirm') }}
      </ElButton>
    </template>
  </Dialog>

  <FieldFilter
    v-if="fieldFilterVisible"
    :ui-url="'/attr/getOperatorSortColumn'"
    :sort-url="'/attr/updateOperatorSortColumn'"
    v-model:fieldVisible="fieldFilterVisible"
  />
</template>

<script setup lang="tsx">
import { ContentWrap } from '@/components/ContentWrap'
import { useI18n } from '@/hooks/web/useI18n'
import FieldFilter from '@/components/customComponents/FieldFilter/index.vue'
import { ref, unref, watch, reactive, onMounted } from 'vue'
import {
  ElButton,
  ElOption,
  ElRadioGroup,
  ElRadioButton,
  ElMessage,
  ElCascader
} from 'element-plus'
import type { DepartmentUserItem } from '@/api/department/types'
import { useTable } from '@/hooks/web/useTable'
import { Search } from '@/components/Search'
import Write from './components/Write.vue'
import { Dialog } from '@/components/Dialog'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { SelectOption, FormSchema } from '@/components/Form'
import { Table } from '@/components/Table'
import {
  pageTop,
  attrList,
  addattr,
  attrDetails,
  editattr,
  delattr
} from '@/api/RuleManage/CategoryAttribute'

import { getAllTreeApi } from '@/api/mallManagement/productList'
import { cloneDeep } from 'lodash-es'

const { t } = useI18n()

const tabRadio = ref('ALL')

//字段筛选功能
const fieldFilterVisible = ref(false)

const RadioList = ref()
const inputTypeEnum = ref()
const requiredEnum = ref()
const attrTypeEnum = ref()
const options = ref()
const aOptions = ref()
const currentRow = ref()

//首次加载
onMounted(() => {
  init()
})
const init = async () => {
  const res = await pageTop()
  inputTypeEnum.value = res.data.inputTypeEnum
  RadioList.value = res.data.attrRelationEnum
  requiredEnum.value = res.data.requiredEnum
  attrTypeEnum.value = res.data.attrTypeEnum

  const res1 = await getAllTreeApi({ isShowAll: true })
  if (res1.code == 200) {
    aOptions.value = cloneDeep(res1.data)
    res1.data.shift()
    options.value = res1.data
  }
  getList()
}

const batchDelete = async () => {
  if (chooseIdsList.value.length != 0) {
    const res = await delattr(chooseIdsList.value)
    if (res.code == 200) {
      ElMessage.success(t('common.operateSuccess'))
      getList()
    }
  } else {
    ElMessage.warning(t('common.a5'))
  }
}

const { tableRegister, tableState, tableMethods } = useTable({
  fetchDataApi: async () => {
    const { pageSize, currentPage } = tableState
    const res = await attrList({
      currentPage: unref(currentPage),
      pageSize: unref(pageSize),
      ...unref(searchParams),
      attrRelation: tabRadio.value
    })
    return {
      list: res.data.list,
      total: res.data.total
    }
  },
  fetchDelApi: async () => {
    const res = await delattr(unref(ids))
    return res
  },
  immediate: false
})
const { total, loading, dataList, pageSize, currentPage } = tableState
const { getList, getElTableExpose, delList } = tableMethods

const crudSchemas = reactive<CrudSchema[]>([
  {
    field: 'selection',
    table: {
      type: 'selection'
    }
  },
  {
    field: 'index',
    label: t('userDemo.index'),

    search: {
      hidden: true
    },

    table: {
      type: 'index'
    }
  },
  {
    field: 'attrName',
    label: t('CategoryAttribute.sub2'),
    search: {
      hidden: true
    }
  },
  {
    field: 'attrValue',
    label: t('CategoryAttribute.sub3'),
    search: {
      hidden: true
    }
  },
  {
    field: 'categoryName',
    label: t('CategoryAttribute.sub4'),
    search: {
      hidden: true
    }
  },
  {
    field: 'attrTypeStr',
    label: t('CategoryAttribute.attType'),
    search: {
      hidden: true
    }
  },
  {
    field: 'requiredStr',
    label: t('CategoryAttribute.sub5'),
    search: {
      hidden: true
    }
  },
  {
    field: 'inputTypeStr',
    label: t('CategoryAttribute.attInputType'),
    search: {
      hidden: true
    }
  },
  {
    field: 'remark',
    label: t('dictionariesParameter.remark'),
    search: {
      hidden: true
    }
  },
  {
    field: 'action',
    label: t('userDemo.action'),
    table: {
      width: 240,
      fixed: 'right',
      slots: {
        default: (data: any) => {
          const row = data.row as DepartmentUserItem
          return (
            <>
              <div class="[&>span]:(cursor-pointer m-2) flex flex-wrap colorMain ">
                <span v-hasPermi="goods:ecAttr:edit" onClick={() => action(row, 'edit')}>
                  {' '}
                  {t('project.edit')}{' '}
                </span>
                <span
                  v-hasPermi="goods:ecAttr:delete"
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

const { allSchemas } = useCrudSchemas(crudSchemas)

const schema = reactive<FormSchema[]>([
  {
    field: 'attrType',
    component: 'Select',
    componentProps: {
      options: attrTypeEnum,
      slots: {
        prefix: () => <div>{t('CategoryAttribute.attType')}</div>
      },
      on: {
        change: () => {
          console.log('1222')
        }
      }
    }
  },
  {
    field: 'attrValue',
    colProps: {
      span: 12
    },
    component: 'Input',
    componentProps: {
      slots: {
        prefix: () => <div>{t('CategoryAttribute.attvalue')}</div>
      }
    }
  },
  {
    field: 'categoryId',
    formItemProps: {
      slots: {
        default: (data) => {
          return (
            <>
              {' '}
              <div
                class={[
                  'w-280px',
                  'flex-c',
                  'border-rd-4px',
                  'specialInput',
                  'border-(#dcdfe6 solid 1px )'
                ]}
              >
                <div class="color-#b0b4b7 w-70px text-center ml-10px">
                  {t('productcategory.form1')}
                </div>
                <div style="background-color: #dcdfe6;width: 0.5px;height: 23px;margin-left: 10px;"></div>{' '}
                <ElCascader
                  clearable
                  v-model={data.categoryId}
                  options={options.value}
                  props={{
                    value: 'id',
                    label: 'categoryName',
                    checkStrictly: true
                  }}
                  show-all-levels={false}
                  class="ml-1px"
                />{' '}
              </div>{' '}
            </>
          )
        }
      }
    }
  },
  {
    field: 'inputType',
    component: 'Select',
    componentProps: {
      options: inputTypeEnum,
      slots: {
        prefix: () => <div>{t('CategoryAttribute.attInputType')}</div>
      },
      on: {
        change: () => {
          console.log('1222')
        }
      }
    }
  },
  {
    field: 'required',
    component: 'Select',
    componentProps: {
      options: requiredEnum,
      slots: {
        prefix: () => <div>{t('CategoryAttribute.isMandatory')}</div>
      },
      on: {
        change: () => {
          console.log('1222')
        }
      }
    }
  }
])

const searchParams = ref({})
const setSearchParams = (params: any) => {
  currentPage.value = 1
  searchParams.value = params

  if (searchParams.value.categoryId && searchParams.value.categoryId.length > 1) {
    searchParams.value.categoryId =
      searchParams.value.categoryId[searchParams.value.categoryId.length - 1]
  }
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

const actionType = ref('')

const AddAction = () => {
  dialogTitle.value = t('project.add') + t('CategoryAttribute.name')
  currentRow.value = {}
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
  dialogTitle.value = t('project.edit') + t('CategoryAttribute.name')
  const res = await attrDetails(row.id)
  currentRow.value = res.data
  actionType.value = type
  dialogVisible.value = true
}

const writeRef = ref<ComponentRef<typeof Write>>()

const saveLoading = ref(false)

const save = async () => {
  const write = unref(writeRef)
  const formData = await write?.submit()

  if (formData) {
    saveLoading.value = true
    let res
    try {
      if (actionType.value == 'add') {
        res = await addattr({ ...formData, status: 'ACTIVE' })
        if (res.code == 200) {
          ElMessage.success(t('common.operateSuccess'))
        }
      } else {
        res = await editattr(formData)
        if (res.code == 200) {
          ElMessage.success(t('common.operateSuccess'))
        }
      }

      getList()
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
