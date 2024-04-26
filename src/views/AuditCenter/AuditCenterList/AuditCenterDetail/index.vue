<template>
  <ContentWrap>
    <div class="font-size-20px color-colorBlack">{{
      merchantData.auditStatusStr + t('AuditCenter.AuditList.a')
    }}</div>
    <div v-if="merchantData.auditStatus != 'PASS_SECOND_AUDIT'">
      <div v-if="showFlag && secondTime > 0" class="mt-5px color-colorBlack font-size-14px">{{
        t('AuditCenter.AuditList.please') }}
        <CountDown :second-time="secondTime" class="font-size-18px color-#FF770F" />
        {{ t('AuditCenter.AuditList.solve') }}
      </div>
    </div>
    <div class="mt-20px" v-if="showFlag">
      <el-button
type="primary" v-if="merchantData.auditStatus == 'WAIT_AUDIT'" @click="passAudit"
        v-hasPermi="'mer:merintopieces:firstaudit'">{{ t('AuditCenter.AuditList.passFirst') }}</el-button>
      <el-button
type="primary" v-if="merchantData.auditStatus == 'PASS_FIRST_AUDIT'" @click="openDialog('secAudit')"
        v-hasPermi="'mer:merintopieces:secaudit'">{{ t('AuditCenter.AuditList.passSecond') }}</el-button>
      <el-button
type="primary" v-if="!(
          (merchantData.auditStatus == 'WAIT_AUDIT' ||
            merchantData.auditStatus == 'FAIL_AUDIT' ||
            !merchantData.auditStatus) &&
          !merLogistics.logisticsNo
        )
        " @click="openDialog('logistics')" v-hasPermi="'mer:merintopieces:upload'">{{
    t('AuditCenter.AuditList.uploadLogistics') }}</el-button>
      <el-button
type="primary" v-if="merchantData.auditStatus == auditStatusEnum[0].value ||
        merchantData.auditStatus == auditStatusEnum[1].value
        " @click="openDialog('failAudit')" v-hasPermi="'mer:merintopieces:auditfail'" plain>{{
    t('AuditCenter.AuditList.passFail') }}</el-button>
    </div>
  </ContentWrap>
  <div class="flex-b items-stretch mt-20px" v-if="showFlag">
    <div class="customW">
      <ApplicantInfo :merchantData="merchantData" />
      <CompanyInfo :merchantData="merchantData" class="mt-20px" />
    </div>
    <div class="bg-white customW">
      <ViewLogistics
:merLogisticsRecordList="merchantLogisticsVOList" :bossLogisticsRecordList="bossLogisticsRecordList"
        :merLogistics="merLogistics" />
    </div>
  </div>
  <Dialog
v-if="showVisible" v-model="showVisible" :maxHeight="dialogConfig.height" :title="dialogConfig.title"
    width="35%">
    <Form @register="formRegister" :schema="allSchema" :isCol="false" />
    <template #footer>
      <el-button @click="showVisible = false">{{ t('project.cancel') }}</el-button>
      <ElButton type="primary" :loading="saveLoading" @click="validForm">{{
        t('project.confirm')
      }}</ElButton>
    </template>
  </Dialog>
</template>
<script setup lang="tsx">
import { ContentWrap } from '@/components/ContentWrap/index.ts'
import { ElButton, ElMessageBox, ElMessage } from 'element-plus'
import CountDown from './components/CountDown.vue'
import ApplicantInfo from './components/ApplicantInfo.vue'
import CompanyInfo from './components/CompanyInfo.vue'
import ViewLogistics from './components/ViewLogistics.vue'
// import { ContentWrap } from '@/components/ContentWrap'
import { Dialog } from '@/components/Dialog'
import { FormSchema, Form } from '@/components/Form'
import { ref, reactive } from 'vue'
import { useValidator } from '@/hooks/web/useValidator'
import { useForm } from '@/hooks/web/useForm'
import { useI18n } from '@/hooks/web/useI18n'
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'
import {
  getMerchantDetailApi,
  getMerchantPageTopApi,
  getLogisticsEnumApi,
  auditFailApi,
  passFirstAuditApi,
  passSecondAuditApi,
  passSecondAuditUIApi,
  uploadLogisticsApi1
} from '@/api/auditCenter/merchantSettlement'
import { useAppStore } from '@/store/modules/app'
const appStore = useAppStore()
appStore.setRenderLoading(true)
// 静态枚举值
const saveLoading = ref(false)
const manageModel = ref()
const auditStatusEnum = ref<any>([])
const secondTime = ref(-1)
let id: any = ''
const showFlag = ref(false)
const { currentRoute } = useRouter()
const { t } = useI18n()
const { required, validMobile } = useValidator()
const showVisible = ref(false)
const dialogConfig = ref({
  height: 400,
  title: t('AuditCenter.AuditList.uploadLogisticsNo')
})
const { formRegister, formMethods } = useForm()
const allSchema = ref<FormSchema[]>([])
let openType = ''
const openDialog = (str) => {
  openType = str
  switch (str) {
    case 'secAudit':
      allSchema.value = secAuditSchema
      dialogConfig.value = {
        height: 350,
        title: t('AuditCenter.AuditList.passSecond')
      }
      secondAuditUIApi()
      break
    case 'logistics':
      allSchema.value = logisticsSchema
      dialogConfig.value = {
        height: 150,
        title: t('AuditCenter.AuditList.uploadLogisticsNo')
      }
      showVisible.value = true
      break
    case 'failAudit':
      allSchema.value = failAuditSchema
      dialogConfig.value = {
        height: 140,
        title: t('AuditCenter.AuditList.passFail')
      }
      showVisible.value = true
  }
}
//一审通过按钮
const passAudit = () => {
  ElMessageBox({
    title: t('AuditCenter.AuditList.passFirst'),
    message: t('AuditCenter.AuditList.checkMerchant'),
    showCancelButton: true,
    confirmButtonText: t('project.confirm'),
    cancelButtonText: t('project.cancel'),
    showClose: false
  })
    .then(async (action) => {
      appStore.setRenderLoading(true)

      const res = await passFirstAuditApi({ id })
      res.code == 200 && ElMessage.success(res.msg)
      if (res) {
        ElMessage.success(res.msg)
        appStore.setRenderLoading(true)
        await init()
      }
      appStore.setRenderLoading(false)

      // appStore.setRenderLoading(true)
      // await init()
    })
    .catch(() => { })
}

const companyOption = ref()
//上传物流按钮
const logisticsSchema: FormSchema[] = [
  {
    field: 'logisticsNo',
    label: t('AuditCenter.AuditList.logisticsNo'),
    component: 'Input',
    componentProps: {
      maxlength: 30,
      showWordLimit: true,
      style: {
        paddingRight: '20%'
      }
    },
    formItemProps: {
      rules: [required(t('common.inputText'))]
    }
  },
  {
    field: 'logisticsCode',
    label: t('AuditCenter.AuditList.logisticsCompany'),
    component: 'Select',
    componentProps: {
      options: companyOption,
      style: {
        width: '100%',
        paddingRight: '20%'
      }
    },
    formItemProps: {
      rules: [required(t('common.inputText'))]
    }
  },
  {
    field: 'phone',
    label: t('AuditCenter.AuditList.phone'),
    component: 'Input',
    componentProps: {
      style: {
        paddingRight: '20%'
      }
    },
    formItemProps: {
      rules: [required(t('common.inputText')), validMobile()]
    }
  }
]
// 二次审核按钮
const secAuditSchema: FormSchema[] = [
  {
    field: 'merchantName',
    label: t('AuditCenter.AuditList.corporateName'),
    component: 'Input',
    componentProps: {
      disabled: true
    },
    formItemProps: {
      rules: [required(t('common.inputText'))]
    }
  },
  {
    field: 'managementModel',
    label: t('AuditCenter.AuditList.managementModel'),
    component: 'RadioGroup',
    value: '1',
    componentProps: {
      options: [],
      disabled: true
    },
    formItemProps: {
      rules: [required(t('common.selectText'))]
    }
  },
  {
    field: 'guarantor',
    label: t('AuditCenter.AuditList.guarantor'),
    component: 'Input',
    value: '王大锤',
    componentProps: {
      disabled: true
    }
  },
  {
    field: 'creditLimit',
    label: t('AuditCenter.AuditList.creditLimit'),
    component: 'Input',
    componentProps: {
      type: 'number'
    }
    // formItemProps: {
    //   rules: [required()]
    // }
  },
  {
    field: 'roleId',
    label: t('AuditCenter.AuditList.belongingRole'),
    component: 'RadioGroup',
    value: '1',
    componentProps: {
      options: [],
      props: {
        value: 'id',
        label: 'roleName'
      }
    },
    formItemProps: {
      rules: [required()]
    }
  }
]

// 审核未通过
const failAuditSchema: FormSchema[] = [
  {
    field: 'reason',
    label: t('AuditCenter.AuditList.passFailReason'),
    component: 'Input',
    componentProps: {
      type: 'textarea',
      maxlength: 300,
      showWordLimit: true,
      inputStyle: {
        height: '120px'
      }
    },
    formItemProps: {
      rules: [required(t('common.inputText'))]
    }
  }
]
const validForm = async () => {
  const formExpose = await formMethods.getElFormExpose()
  formExpose?.validate(async (valid) => {
    if (valid) {
      saveLoading.value = true
      const param = await formMethods.getFormData()
      let res: any = null
      param.id = id
      if (openType == 'secAudit') {
        res = await passSecondAuditApi(param)
      } else if (openType == 'failAudit') {
        res = await auditFailApi(param)
      } else if (openType == 'logistics') {
        res = await uploadLogisticsApi1(param)
      }
      saveLoading.value = false
      res.code == 200 && ElMessage.success(res.msg) && (showVisible.value = false)
      await init()
    }
  })
}
const merchantData = ref<any>({})
onMounted(() => {
  id = currentRoute.value.query.id
  init()
})

const bossLogisticsRecordList = ref<Array<any>>([])
const merLogistics = ref()
const merchantLogisticsVOList = ref<Array<any>>([])
const init = async () => {
  showFlag.value = false
  const res = await getMerchantDetailApi({ id })

  merLogistics.value = res.data.merLogistics || []
  bossLogisticsRecordList.value = []
  merchantLogisticsVOList.value = []
  if (res.data.bossLogisticsVOList.length != 0) {
    res.data.bossLogisticsVOList.forEach((e: any) => {
      bossLogisticsRecordList.value.push({
        content: e.context,
        time: e.ftime,
        title: e.status
      })
    })
  }

  if (res.data.merchantLogisticsVOList.length != 0) {
    res.data.merchantLogisticsVOList.forEach((e: any) => {
      merchantLogisticsVOList.value.push({
        content: e.context,
        time: e.ftime,
        title: e.status
      })
    })
  }

  merchantData.value = res.data
  const ares = await getMerchantPageTopApi()
  // const bres = await passSecondAuditUIApi({ id })
  // console.log(ares, bres)
  secondTime.value =
    new Date(merchantData.value.createTime).getTime() +
    1000 * 60 * 60 * 24 * 7 -
    new Date().getTime()

  appStore.setRenderLoading(false)
  manageModel.value = ares.data.manageModel
  auditStatusEnum.value = ares.data.auditStatusEnum

  showFlag.value = true
  const result = await getLogisticsEnumApi()
  if (result.code == 200) {
    companyOption.value = result.data
  }
}
const secondAuditUIApi = async () => {
  const res = await passSecondAuditUIApi({ id })
  showVisible.value = true

  await formMethods.setValues({
    merchantName: res.data.merIntoPieces.merchantName,
    managementModel: res.data.merIntoPieces.managementModel,
    guarantor: res.data.merIntoPieces.guarantor,
    creditLimit: '',
    roleId: ''
  })
  await formMethods.setSchema([
    {
      field: 'managementModel',
      path: 'componentProps.options',
      value: manageModel.value
    },
    {
      field: 'roleId',
      path: 'componentProps.options',
      value: res.data.roleList
    }
  ])
}
</script>
<style scoped lang="less">
.customW {
  width: calc(50% - 10px);
}

.el-card {
  border: none;
}
</style>
