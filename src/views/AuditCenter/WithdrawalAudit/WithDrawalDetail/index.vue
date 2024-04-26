<template>
  <ContentWrap>
    <div class="font-size-20px color-colorBlack flex-b items-center">
      <div class="line-height-30px h-30px"> {{ allData?.auditStatusStr }}{{ t('common.b26') }}</div>
      <ElButton type="primary" @click="back">{{ t('common.back') }}</ElButton>
    </div>

    <div class="mt-20px" v-if="allData?.auditStatus == 'WAIT_AUDIT'">
      <el-button v-hasPermi="'settlement:finSettlement:audit'" type="primary" @click="passAudit">{{
        t('AuditCenter.AuditList.sub2')
      }}</el-button>
      <el-button type="primary" @click="showVisible = true" plain>{{
        t('AuditCenter.AuditList.sub3')
      }}</el-button>
    </div>
  </ContentWrap>
  <div class="flex-b items-stretch mt-20px">
    <div class="customW bg-white"><PaymentInfo :allData="allData" /></div>
    <div class="customW"><SettlementInfo :allData="allData" /></div>
  </div>
  <!-- <ContentWrap class="mt-20px">
    <OrderDeclaration />
  </ContentWrap> -->
  <Dialog
    v-model="showVisible"
    :maxHeight="140"
    :title="t('AuditCenter.AuditList.sub3')"
    width="35%"
  >
    <Form @register="formRegister" :schema="allSchema" :isCol="false" />
    <template #footer>
      <el-button @click="showVisible = false">{{ t('project.cancel') }}</el-button>
      <ElButton type="primary" @click="validForm">{{ t('project.save') }}</ElButton>
    </template>
  </Dialog>
</template>
<script setup lang="tsx">
import { ContentWrap } from '@/components/ContentWrap/index.ts'
import { ElButton, ElMessageBox, ElMessage } from 'element-plus'
import { FormSchema, Form } from '@/components/Form'
import { Dialog } from '@/components/Dialog'
import { useValidator } from '@/hooks/web/useValidator'
import { useForm } from '@/hooks/web/useForm'
import { ref, reactive, onMounted } from 'vue'
import PaymentInfo from './components/PaymentInfo.vue'
import SettlementInfo from './components/SettlementInfo.vue'
import OrderDeclaration from './components/OrderDeclaration.vue'
import { settleDetailApi, auditApi } from '@/api/withdrawalAudit/index'
import { useRouter } from 'vue-router'
import { useI18n } from '@/hooks/web/useI18n'
const { t } = useI18n()
const { back, currentRoute } = useRouter()
const showVisible = ref(false)
const { required } = useValidator()
const { formRegister, formMethods } = useForm()
//审核通过按钮
const passAudit = () => {
  ElMessageBox({
    title: t('AuditCenter.AuditList.sub2'),
    message: t('AuditCenter.AuditList.sub6'),
    showCancelButton: true,
    confirmButtonText: t('common.ok'),
    cancelButtonText: t('common.cancel'),
    showClose: false
  })
    .then(async () => {
      const res = await auditApi({ id: id.value, auditStatus: 'SUCCESS_AUDIT' })
      if (res.code == 200) {
        ElMessage.success(t('common.operateSuccess'))
        getData()
      }
    })
    .catch(() => {})
}
//审核未通过按钮

const id = ref()
const allData = ref()
onMounted(async () => {
  id.value = currentRoute.value.query.id
  getData()
})

const getData = async () => {
  const res = await settleDetailApi({ id: id.value })
  allData.value = res.data
}

const allSchema = reactive<FormSchema[]>([
  {
    field: 'refuseDescription',
    label: t('AuditCenter.AuditList.sub5'),
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
])
//验证表单
const validForm = async () => {
  const formExpose = await formMethods.getElFormExpose()
  formExpose?.validate(async (valid) => {
    if (valid) {
      const param = await formMethods.getFormData()
      const res = await auditApi({
        refuseDescription: param.refuseDescription,
        id: id.value,
        auditStatus: 'FAIL_AUDIT'
      })
      if (res.code == 200) {
        ElMessage.success(t('common.operateSuccess'))
        showVisible.value = false
        getData()
      }
    }
  })
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
