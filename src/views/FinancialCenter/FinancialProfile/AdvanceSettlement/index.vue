<template>
  <div class="flex-b">
    <div class="w-50% mr-20px">
      <ContentWrap class="h-250px">
        {{ t('advanceSettlement.info') }}
        <div class="flex-c color-#7A7A7A font-size-14px mt-10px">
          <div class="mr-20px flex">
            <div>{{ t('accountAuthentication.danwei') }}:</div>
            <div class="ml-10px color-colorBlack">3333</div>
          </div>
        </div>
        <div class="flex-c color-#7A7A7A font-size-14px mt-10px">
          <div class="mr-20px flex">
            <div>{{ t('advanceSettlement.sub1') }}:</div>
            <div class="ml-10px color-colorBlack">3333</div>
          </div>
          <div class="mr-20px flex">
            <div>{{ t('advanceSettlement.sub2') }}:</div>
            <div class="ml-10px color-colorBlack">3333</div>
          </div>
          <div class="mr-20px flex">
            <div>{{ t('advanceSettlement.sub3') }}:</div>
            <div class="ml-10px color-colorBlack">3333</div>
          </div>
        </div>
        <div class="flex-c color-#7A7A7A font-size-14px mt-10px">
          <div class="mr-20px flex">
            <div>{{ t('advanceSettlement.sub4') }}:</div>
            <div class="ml-10px color-colorBlack">3333</div>
          </div>
        </div>
        <div class="flex-c color-#7A7A7A font-size-14px mt-10px">
          <div class="mr-20px flex">
            <div>{{ t('advanceSettlement.sub5') }}:</div>
            <div class="ml-10px color-colorBlack">3333 %</div>
          </div>
        </div>
      </ContentWrap>
    </div>
    <div class="w-50%">
      <ContentWrap>
        <div class="flex-col color-#7A7A7A font-size-14px">
          <div class="mr-20px flex">
            <div class="min-w-90px text-right">{{ t('loanAudit.sub3') }}:</div>
            <div class="ml-10px color-colorBlack">3333</div>
          </div>
          <div class="mt-15px flex-c">
            <div class="min-w-90px text-right">{{ t('advanceSettlement.block2') }}:</div>
            <div class="ml-10px color-colorBlack">
              <ElSelect v-model="form.region">
                <ElOption label="Zone one" value="shanghai" />
                <ElOption label="Zone two" value="beijing" />
              </ElSelect>
            </div>
          </div>
          <div class="mt-15px flex-c">
            <div class="min-w-90px text-right">{{ t('advanceSettlement.block3') }}:</div>
            <div class="ml-10px color-colorBlack">
              <ElSelect v-model="form.region">
                <ElOption label="Zone one" value="shanghai" />
                <ElOption label="Zone two" value="beijing" /> </ElSelect
            ></div>
          </div>
          <div class="mt-15px flex-c">
            <div class="min-w-90px text-right">{{ t('advanceSettlement.block4') }}:</div>
            <div class="ml-10px color-colorBlack">
              <el-radio-group v-model="radio">
                <el-radio label="1" size="large">Option 1</el-radio>
                <el-radio label="2" size="large">Option 2</el-radio>
              </el-radio-group>
            </div>
          </div>
        </div>
        <div class="flex-c flex-justify-end mt-10px">
          <ElButton type="primary" @click="AddAction" class="w-80px">{{
            t('common.ok')
          }}</ElButton></div
        >
      </ContentWrap>
    </div>
  </div>
  <div>
    <ContentWrap class="mt-20px relative h-598px">
      {{ t('loanAudit.sub7') }}
      <div class="flex-col mt-15px color-#7A7A7A font-size-14px">
        <div class="mr-20px flex">
          <div>{{ t('loanAudit.sub3') }}:</div>
          <div class="ml-10px color-colorBlack">3333</div>
        </div>
        <div class="mt-15px flex">
          <div>{{ t('advanceSettlement.block5') }}:</div>
          <div class="ml-10px color-colorBlack">3333</div>
        </div>
        <div class="mt-15px flex">
          <div>{{ t('advanceSettlement.block6') }}:</div>
          <div class="ml-10px color-colorBlack">3333</div>
        </div>
        <div class="mt-15px flex">
          <div>{{ t('loanAudit.sub6') }}:</div>
          <div class="ml-10px color-colorBlack">3333</div>
        </div>
      </div>
      <div class="flex-col color-#7A7A7A font-size-14px mt-40px">
        {{ t('advanceSettlement.block8') }}
        <div>
          <el-radio-group v-model="radio">
            <el-radio label="1" size="large">Option 1</el-radio>
            <el-radio label="2" size="large">Option 2</el-radio>
          </el-radio-group>
        </div>
        <div class="ml--10px">
          <Form
            :schema="schema"
            class="dark:(border-1 border-[var(--el-border-color)] border-solid)"
            @register="formRegister"
          />
        </div>
        <div class="flex-c absolute bottom-20px right-20px flex-justify-end mt-90px">
          <ElButton @click="dialogVisible = false" class="w-80px">{{
            t('project.cancel')
          }}</ElButton>
          <ElButton
            type="primary"
            :loading="saveLoading"
            class="w-80px"
            @click="push('/financialCenter/managementProfile/advanceSettlement')"
          >
            {{ t('accountPage.btn') }}
          </ElButton>
        </div>
      </div></ContentWrap
    >
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
  ElFormItem,
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
