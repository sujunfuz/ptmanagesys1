<template>
  <div>
    <ContentWrap>
      <div>{{ t('Freight.info') }}</div>
      <div class="mt-20px">
        <Form :is-col="true" :schema="schema" :rules="rules" @register="formRegister" />
      </div>
    </ContentWrap>
    <ContentWrap class="mt-20px">
      <div>{{ t('Freight.set') }}</div>
      <Table class="mt-20px" :columns="allSchemas.tableColumns" :data="dataList" />
    </ContentWrap>
    <div class="colorMain font-size-14px mt-7px ml-7px cursor-pointer" @click="action('add')"
      >+{{ t('common.add') }}</div
    >
    <div class="text-right">
      <ElButton @click="push({ path: '/logisticsCenter/freight' })">{{
        t('common.cancel')
      }}</ElButton>
      <ElButton type="primary" @click="saveTemplate">
        {{ t('project.confirm') }}
      </ElButton>
    </div>
    <Dialog v-model="dialogVisible" :title="t('Freight.add')">
      <Write
        :echo-code="echoCode"
        :get-flag="getFlag"
        :open-type="openAreaType"
        :area-data="allAreaData"
        @modify-column="modifyColumn"
      />
      <template #footer>
        <ElButton @click="dialogVisible = false">{{ t('common.cancel') }}</ElButton>
        <ElButton type="primary" @click="save">
          {{ t('project.confirm') }}
        </ElButton>
      </template>
    </Dialog>
  </div>
</template>

<script lang="tsx" setup>
import { ContentWrap } from '@/components/ContentWrap'
import { Form, FormSchema } from '@/components/Form'
import { unref, ref, reactive } from 'vue'
import { Table } from '@/components/Table'
import { useI18n } from '@/hooks/web/useI18n'
import { useValidator } from '@/hooks/web/useValidator'
import { useForm } from '@/hooks/web/useForm'
import {
  ElButton,
  ElCheckbox,
  ElInputNumber,
  ElSelect,
  ElOption,
  ElCheckboxGroup,
  ElMessage
} from 'element-plus'
import { Dialog } from '@/components/Dialog'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import Write from './components/Write.vue'
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'
import {
  getFreightByIdApi,
  getFreightPageTopApi,
  getAllAreaApi,
  editFreightTemplateApi,
  addFreightTemplateApi
} from '@/api/LogisticsCenter/freight'
import { useAppStore } from '@/store/modules/app'
import { useStorage } from '@/hooks/web/useStorage'
const { getStorage } = useStorage('localStorage')
const appStore = useAppStore()
appStore.setRenderLoading(true)

const { currentRoute, push } = useRouter()

const { t } = useI18n()

const dialogVisible = ref(false)
const dataList = ref<Array<any>>([])
let id: any = ''
let openType: any = ''

const echoCode = ref([]) //弹窗要回显的值
const openAreaType = ref('add') //打开区域选择弹窗类型 edit or add
const allAreaData = ref([])

const { required } = useValidator()
const rules = reactive({
  templateName: [required()],
  freightTemplateType: [required()]
})

const { formRegister, formMethods } = useForm()

const schema = reactive<FormSchema[]>([
  {
    field: 'templateName',
    label: t('Freight.name'),
    component: 'Input',
    colProps: {
      span: 8
    },
    componentProps: {
      maxlength: 30,
      showWordLimit: true
    }
  },
  {
    field: 'freightTemplateType',
    label: t('Freight.piecework'),
    colProps: {
      span: 8
    },
    component: 'CheckboxGroup',
    componentProps: {
      options: []
    }
  }
])

const crudSchemas = reactive<CrudSchema[]>([
  {
    field: 'areaName',
    label: t('Freight.address'),
    width: '250px',
    search: {
      hidden: true
    }
  },
  {
    field: 'first',
    label: t('Freight.first'),
    search: {
      hidden: true
    },
    table: {
      width: '400px',
      slots: {
        default: (data: any) => {
          if (!data.row.fullDecrementType) {
            data.row.fullDecrementType = fullDecrementType.value[0].value || ''
          }
          const row = data.row
          return (
            <>
              <div>
                <ElInputNumber
                  style="width: 120px;"
                  v-model={row.defaultNum}
                  controls-position="right"
                  min={1}
                />
                <span class="ml-9px">{t('Freight.within')}</span>
              </div>
              <div class="flex flex-items-center w-100%">
                <ElCheckboxGroup v-model={row.freeShipping}>
                  <ElCheckbox size="large" label={publicEnum.value}>
                    {t('Freight.conditions')}
                  </ElCheckbox>
                </ElCheckboxGroup>
                <span class="ml-15px flex flex-items-center">
                  <span class="mr-10px">{t('Freight.full')}</span>
                  <ElInputNumber
                    style="width: 110px;"
                    v-model={row.fullAmountOrNum}
                    controls-position="right"
                    min={1}
                  />
                  <div class="ml-10px">
                    <ElSelect style="width: 70px;" v-model={row.fullDecrementType} placeholder=" ">
                      {fullDecrementType.value.map((item: any) => {
                        return <ElOption label={item.label} value={item.value} />
                      })}
                    </ElSelect>
                    <span class="ml-9px">{t('Freight.freeShipping')}</span>
                  </div>
                </span>
              </div>
            </>
          )
        }
      }
    }
  },
  {
    field: 'money',
    label: t('Freight.money'),
    search: {
      hidden: true
    },
    table: {
      width: '150px',
      slots: {
        default: (data: any) => {
          const row = data.row
          return (
            <>
              <ElInputNumber
                min={0.0}
                style="width: 110px;"
                precision={2}
                v-model={row.defaultAmount}
                controls-position="right"
              />
            </>
          )
        }
      }
    }
  },
  {
    field: 'continuation',
    label: t('Freight.continuation'),
    search: {
      hidden: true
    },
    table: {
      width: '250px',
      slots: {
        default: (data: any) => {
          const row = data.row
          return (
            <>
              <div class="flex flex-items-center">
                <div class="mr-8px">{t('Freight.everyContinuation')}</div>
                <ElInputNumber
                  style="width: 80px;"
                  min={1}
                  v-model={row.followingNum}
                  controls-position="right"
                />
                <div class="ml-8px">{t('Freight.within')}</div>
              </div>
            </>
          )
        }
      }
    }
  },
  {
    field: 'money',
    label: t('Freight.money'),
    search: {
      hidden: true
    },
    table: {
      width: '150px',
      slots: {
        default: (data: any) => {
          const row = data.row
          return (
            <>
              <ElInputNumber
                style="width: 110px;"
                min={0.0}
                precision={2}
                v-model={row.followingAmount}
                controls-position="right"
              />
            </>
          )
        }
      }
    }
  },
  {
    field: 'action',
    label: t('userDemo.action'),
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
      // width: 240,
      slots: {
        default: (data: any) => {
          const row = data.row
          row.index = data.$index
          return (
            <>
              <div class="[&>span]:(cursor-pointer m-2) flex flex-wrap colorMain ">
                <span
                  onClick={() => {
                    currentRow = row
                    action('edit')
                  }}
                >
                  {' '}
                  {t('Freight.edit')}{' '}
                </span>
                <span
                  class="color-red-500"
                  onClick={() => {
                    currentRow = row
                    action('delete')
                  }}
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

const action = async (type) => {
  openAreaType.value = type
  if (allAreaData.value.length == 0) {
    appStore.setRenderLoading(true)
    const res = await getAllAreaApi()
    allAreaData.value = res.code == 200 ? res.data[0].children : []
    appStore.setRenderLoading(false)
  }
  switch (type) {
    case 'add':
      echoCode.value = []
      dialogVisible.value = true
      break
    case 'edit':
      echoCode.value = JSON.parse(currentRow.areaCode)
      dialogVisible.value = true
      break
    case 'delete':
      let temp: Array<any> = []
      dataList.value.forEach((item: any, index) => {
        if (index != currentRow.index) {
          temp.push(item)
        }
      })
      dataList.value = temp
  }
}

const topRes = ref()
const fullDecrementType = ref<Array<any>>([])
const publicEnum = ref('')
const activeStatus = ref<Array<any>>([])
let batchNo = ''
const init = async () => {
  topRes.value = await getFreightPageTopApi()
  formMethods.setSchema([
    {
      field: 'freightTemplateType',
      path: 'componentProps.options',
      value: topRes.value.data.distFreightType
    }
  ])
  fullDecrementType.value = topRes.value.data.fullDecrementType
  publicEnum.value = topRes.value.data.publicEnum[0].value
  activeStatus.value = topRes.value.data.status
  if (openType == 'edit' || openType == 'copy') {
    const res = await getFreightByIdApi({
      id: id
    })
    batchNo = res.data.batchNo
    res.data.freightTemplateDetailList.forEach((item) => (item.freeShipping = [item.freeShipping]))
    dataList.value = res.data.freightTemplateDetailList
    await formMethods.setValues({
      templateName: res.data.templateName,
      freightTemplateType: [res.data.freightTemplateType]
    })
  }
  appStore.setRenderLoading(false)
}

let currentRow: any = {}
const userInfo = getStorage('ptUserInfo')

const modifyColumn = (codeVal, strVal) => {
  if (openAreaType.value == 'add') {
    let temp = {
      defaultNum: 1,
      defaultAmount: 0.01,
      followingNum: 1,
      followingAmount: 0.01,
      freeShipping: [],
      fullDecrementType: fullDecrementType.value[0].value,
      fullAmountOrNum: 1,
      areaCode: JSON.stringify(codeVal),
      areaName: strVal + '',
      status: activeStatus.value[0].value,
      merchantName: userInfo.merchantName,
      merchantNo: userInfo.topMerchantNo
    }
    dataList.value = [...dataList.value, temp]
  } else if (openAreaType.value == 'edit') {
    for (let item of dataList.value) {
      if (currentRow.id == item.id) {
        item.areaCode = JSON.stringify(codeVal)
        item.areaName = strVal + ''
        break
      }
    }
    dataList.value = [...dataList.value]
  }
  dialogVisible.value = false
}
onMounted(async () => {
  id = currentRoute.value.query.id || ''
  openType = currentRoute.value.query.openType || 'add'
  await init()
})

const openDialog = () => {
  dialogVisible.value = true
}
const getFlag = ref(false)

const save = () => {
  getFlag.value = !getFlag.value
}
const saveTemplate = async () => {
  const formEl = await formMethods.getElFormExpose()
  formEl?.validate(async (valid) => {
    if (valid) {
      let formParam = await formMethods.getFormData()
      formParam = { ...formParam }
      let freightTemplateDetailList: Array<any> = []
      if (openType == 'edit') {
        formParam.batchNo = batchNo
      }
      dataList.value.forEach((item: any, index) => {
        let param = {
          ...item,
          sort: index,
          freeShipping: item.freeShipping.indexOf('YES') != -1 ? 'YES' : 'NO'
        }
        if (openType != 'edit') {
          delete param.id
        }
        freightTemplateDetailList.push(param)
      })
      formParam.freightTemplateDetailList = freightTemplateDetailList
      formParam.status = activeStatus.value[0].value
      formParam.merchantName = userInfo.merchantName
      formParam.merchantNo = userInfo.topMerchantNo
      formParam.freightTemplateType = formParam.freightTemplateType[0]
      let res: any = null
      formParam.freightTemplateDetailList.forEach((item) => {
        let codeArr = JSON.parse(item.areaCode)
        item.areaName = item.areaName.replaceAll('/',',')
        let nameArr = item.areaName.split(',')
        item.distributionAreaList = [] as any
        codeArr.forEach((aitem, index) => {
          let obj = {
            code: aitem + '',
            name: nameArr[index],
            lastCode: aitem[aitem.length - 1],
            status: 'ACTIVE',
            remark: ''
          }
          item.distributionAreaList.push(obj)
        })
      })
      if (openType == 'edit') {
        formParam.id = id
        res = await editFreightTemplateApi(formParam)
      } else {
        res = await addFreightTemplateApi(formParam)
      }

      res.code == 200 && ElMessage.success(res.msg) && push({ path: '/logisticsCenter/freight' })
    }
  })
}
</script>

<style lang="less" scoped>
:deep(.flex-wrap) {
  .w-100px.relative {
    width: 170px !important;
  }
}
</style>
