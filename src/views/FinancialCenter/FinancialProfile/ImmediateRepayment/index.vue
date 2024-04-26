<template>
  <div class="flex-b">
    <div class="w-50% mr-20px">
      <ContentWrap class="h-750px">
        {{ t('advanceSettlement.title2') }}
        <div class="font-size-14px mt-10px mb-10px"
          >{{ t('advanceSettlement.sub6') }}
          <span class="colorMain ml-15px cursor-pointer">{{ t('advanceSettlement.btn1') }}</span
          ><span class="colorMain ml-15px cursor-pointer">{{
            t('advanceSettlement.btn2')
          }}</span></div
        >
        <Search :schema="searchSchema" @search="setSearchParams" @reset="setSearchParams" />
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
        <div class="flex-c flex-justify-end mt-20px">
          <span class="subString colorMain"
            >{{ t('project.yisel') }}<span class="colorMain">&nbsp;{{ chooseCount }}&nbsp;</span
            >{{ t('orderManage.commodity2') }}
          </span>
          <span class="subString ml-10px">{{ t('advanceSettlement.total') }}:292929929 CNY</span>
          <ElButton type="primary" @click="AddAction" class="ml-15px w-80px">{{
            t('common.ok')
          }}</ElButton>
        </div>
      </ContentWrap>
    </div>
    <div class="w-50%">
      <ContentWrap class="h-750px relative">
        {{ t('managementProfile.btn3') }}
        <div class="flex-col color-#7A7A7A font-size-14px">
          <div class="mt-15px flex-c">
            <div class="min-w-90px text-right">{{ t('advanceSettlement.block10') }}:</div>
            <div class="ml-10px color-colorBlack">
              <el-input v-model="input" />
            </div>
          </div>
          <div class="mt-15px flex-c">
            <div class="min-w-90px text-right">{{ t('advanceSettlement.block11') }}:</div>
            <div class="ml-10px color-colorBlack"> <el-input v-model="input" /> </div>
          </div>
          <div class="mt-15px flex-c">
            <div class="min-w-90px text-right">{{ t('chooseGoods.sub3') }}:</div>
            <div class="ml-10px color-colorBlack font-size-19px font-bold">2840 </div>
          </div>
        </div>
        <div class="mt-10px">
          <div class="w-100% mt-20px border-(#efefef solid 1px) h-80px p-10px box-border flex-b">
            <div class="flex">
              <ElImage src="" fit="cover" class="w-60px h-60px" preview-src-list="" />
              <div class="ml-10px">
                <div>333</div>
                <div>333</div>
              </div>
            </div>
            <div class="mt-10px"> <el-checkbox v-model="checked1" label="" size="large" /></div>
          </div>
          <div class="w-100% mt-10px border-(#efefef solid 1px) h-80px p-10px box-border flex-b">
            <div class="flex">
              <img src="@/assets/imgs/nextLabel.png" class="w-60px h-60px" />
              <div class="ml-10px mt-20px">
                <div class="font-size-15px">{{ t('advanceSettlement.block12') }}</div>
              </div>
            </div>
          </div>
        </div>
        <ElButton
          class="absolute right-20px bottom-20px w-80px"
          type="primary"
          :loading="saveLoading"
          @click="save"
        >
          {{ t('common.nextLabel') }}
        </ElButton>
      </ContentWrap>
    </div>
  </div>

  <Dialog v-model="dialogVisible" :title="dialogTitle" max-height="250px">
    <template #footer>
      <ElButton @click="dialogVisible = false">{{ t('project.cancel') }}</ElButton>
      <ElButton type="primary" :loading="saveLoading" @click="save">
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
  ElRadioGroup,
  ElRadio,
  ElForm,
  ElImage,
  ElFormItem,
  ElCheckbox,
  ElInput,
  ElSelect,
  ElOption,
  ElMessage
} from 'element-plus'
import { getPageTopApi, getPageListApi, deleteApi } from '@/api/operationCenter/recommendation'
import type { DepartmentUserItem } from '@/api/department/types'
import { useTable } from '@/hooks/web/useTable'
import { Search } from '@/components/Search'
import { Dialog } from '@/components/Dialog'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { Table } from '@/components/Table'
import { tableStatusStyleTag } from '@/utils/componentUtils'
import { useForm } from '@/hooks/web/useForm'
import { Form, FormSchema } from '@/components/Form'

const { t } = useI18n()

const tabPosition = ref('RECOMMEND_TYPE_GOODS')
onMounted(() => {
  init()
})

const schema = reactive<FormSchema[]>([
  {
    field: 'applicantMobile',
    label: t('advanceSettlement.block9'),
    component: 'Input',
    componentProps: {
      placeholder: t('common.inputText'),
      style: {
        height: '35px'
      }
    }
  },
  {
    field: 'verifyCode',
    label: ' ',
    component: 'InputPassword',
    colProps: {
      span: 24
    },
    formItemProps: {
      slots: {
        default: (args) => {
          return (
            <div class="flex-c justify-between">
              <ElInput v-model={args.verifyCode} class="h-35px w-50px"></ElInput>
              <ElButton
                type="primary"
                disabled={flag.value}
                class="w-120px ml-10px"
                onClick={getVerificationCode}
              >
                {flag.value ? count.value + 's' + t('accountPage.btn2') : t('accountPage.btn1')}
              </ElButton>
            </div>
          )
        }
      }
    }
  }
])

//计算倒计时
let timeStamp: any = 0
let flag = ref(false)
let timer: any = null
const count = ref(60)

const { formRegister, formMethods } = useForm()
const { getFormData, getElFormExpose } = formMethods

//发送验证码
const getVerificationCode = async () => {
  let formEl = await getElFormExpose()
  formEl?.validateField(['applicantMobile'], async (valid) => {
    if (valid) {
      const formData = await getFormData()
      // const res = await getVerificationCodeAPi(formData.applicantMobile)
      // if (res.code == 200) {
      //   getNowTime()
      // }
    }
  })
}

const getNowTime = () => {
  clearInterval(timer)
  timeStamp = new Date().getTime() + 60 * 1000
  flag.value = true
  timer = setInterval(() => {
    let a = new Date().getTime()
    if (a > timeStamp) {
      flag.value = false
      count.value = 60
      clearInterval(timer)
    } else {
      count.value = parseInt((timeStamp - new Date().getTime()) / 1000 + '')
    }
  }, 1000)
}

const form = ref({
  region: ''
})
const radio = ref('')

const searchSchema = reactive<FormSchema[]>([
  {
    field: 'title',
    label: '',
    component: 'Input',
    componentProps: {
      slots: {
        prepend: () => <div>{t('advanceSettlement.code')}</div>
      }
    }
  }
])

const init = async () => {
  const res = await getPageTopApi()
  if (res.code == 200) {
    console.log(res)
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
    console.log(res.data)
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

const crudSchemas = reactive<CrudSchema[]>([
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
    field: 'title',
    label: t('advanceSettlement.code'),
    search: {
      hidden: true
    }
  },
  {
    field: 'priorityStr',
    label: t('advanceSettlement.status'),
    search: {
      hidden: true
    }
  },
  {
    field: 'sort',
    label: t('advanceSettlement.status1'),
    search: {
      hidden: true
    }
  },
  {
    field: 'createTimeStr',
    label: t('advanceSettlement.money'),
    search: {
      hidden: true
    }
  }
])

const { allSchemas } = useCrudSchemas(crudSchemas)

const searchParams = ref({})
const setSearchParams = (params: any) => {
  currentPage.value = 1
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
  dialogTitle.value = t('project.add') + t('paymentChannel.name1')
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

const action = (row: any, type: string) => {
  switch (type) {
    case 'view':
      dialogTitle.value = t('project.view') + t('paymentChannel.name1')
      break
    case 'edit':
      dialogTitle.value = t('project.edit') + t('paymentChannel.name1')
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
        res = await addecGoodsSaleLimit({ ...formData, status: 'ACTIVE' })
        if (res.code == 200) {
          ElMessage.success(t('common.operateSuccess'))
        }
      } else {
        res = await editecGoodsSaleLimit(formData)
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
