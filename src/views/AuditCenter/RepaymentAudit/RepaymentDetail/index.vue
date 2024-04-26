<template>
  <ContentWrap>
    <div class="font-size-20px color-colorBlack"
      >{{ allData?.auditStatusStr }}{{ t('repaymentAudit.sub8') }}</div
    >
    <div class="mt-20px" v-if="allData?.auditStatus == 'WAIT_AUDIT'">
      <el-button type="primary" v-hasPermi="'settlement:finRepayRecord:audit'" @click="passAudit">{{
        t('AuditCenter.AuditList.sub2')
      }}</el-button>
      <el-button
        type="primary"
        v-hasPermi="'settlement:finRepayRecord:audit'"
        @click="showVisible = true"
        plain
        >{{ t('AuditCenter.AuditList.sub3') }}</el-button
      >
    </div>
  </ContentWrap>
  <ContentWrap class="mt-20px font-size-14px">
    <div class="font-size-17px">
      {{ t('repaymentAudit.sub8') }}
    </div>
    <div class="mt-20px">
      <span class="color-colorGray inline-block text-end">{{ t('repaymentAudit.sub2') }}</span
      ><span class="ml-20px">{{ allData?.companyName || '-' }}</span>
    </div>
    <div class="mt-20px">
      <span class="color-colorGray inline-block text-end">{{ t('repaymentAudit.sub3') }}</span
      ><span class="ml-20px">{{ allData?.repayAmount || '-' }}</span>
    </div>
    <div class="mt-20px">
      <span class="color-colorGray inline-block text-end">{{ t('repaymentAudit.sub4') }}</span
      ><span class="ml-20px">{{ allData?.repayInterest || '-' }}</span>
    </div>
    <div class="mt-20px">
      <span class="color-colorGray inline-block text-end">{{ t('repaymentAudit.sub5') }}</span
      ><span class="ml-20px">{{ allData?.totalAmount || '-' }}</span>
    </div>
    <div class="mt-20px">
      <span class="color-colorGray inline-block text-end">{{ t('repaymentAudit.sub6') }}</span
      ><span class="ml-20px">{{ allData?.createTimeStr || '-' }}</span>
    </div>
    <div class="mt-20px flex">
      <span class="color-colorGray inline-block text-end">{{ t('repaymentAudit.sub9') }}</span
      ><span class="ml-20px" v-if="allData?.img">
        <div @click="clickImage(imgUrl + allData?.img)">
          <ElImage :src="imgUrl + allData?.img" style="width: 200px" />
        </div>
      </span>
      <Empty v-else />
    </div>
  </ContentWrap>
  <Dialog
    v-model="showVisible"
    :maxHeight="140"
    :title="t('AuditCenter.AuditList.sub3')"
    width="35%"
  >
    <Form @register="formRegister" :schema="allSchema" :isCol="false" />
    <template #footer>
      <el-button @click="showVisible = false">{{ t('common.cancel') }}</el-button>
      <ElButton type="primary" @click="validForm">{{ t('project.save') }}</ElButton>
    </template>
  </Dialog>
</template>
<script setup lang="tsx">
import { ContentWrap } from '@/components/ContentWrap/index.ts'
import { ElButton, ElMessageBox, ElMessage, ElImage } from 'element-plus'
import { useValidator } from '@/hooks/web/useValidator'
import { ref, reactive, onMounted } from 'vue'
import { useForm } from '@/hooks/web/useForm'
import { FormSchema, Form } from '@/components/Form'
import { Dialog } from '@/components/Dialog'
import { useRouter } from 'vue-router'
import { useI18n } from '@/hooks/web/useI18n'
import { detailApi, auditApi } from '@/api/auditCenter/repaymentAudit'
import { createImageViewer } from '@/components/ImageViewer'
import Empty from '@/components/customComponents/Empty/index.vue'

const { t } = useI18n()
const { back, push, currentRoute } = useRouter()
const showVisible = ref(false)
const { required } = useValidator()
const { formRegister, formMethods } = useForm()
const id = ref()

onMounted(() => {
  id.value = currentRoute.value.query.id
  getData()
})

const imgUrl = import.meta.env.VITE_IMG_URL

const clickImage = (data) => {
  createImageViewer({
    urlList: [data]
  })
}

const allData = ref()
//审核通过按钮
const passAudit = () => {
  ElMessageBox({
    title: t('AuditCenter.AuditList.sub2'),
    message: t('repaymentAudit.sub10'),
    showCancelButton: true,
    confirmButtonText: t('common.ok'),
    cancelButtonText: t('common.cancel'),
    showClose: false
  })
    .then(async (action) => {
      const res = await auditApi({
        id: id.value,
        auditStatus: 'SUCCESS_AUDIT'
      })
      if (res.code == 200) {
        ElMessage.success(t('common.operateSuccess'))
        getData()
      }
    })
    .catch(() => {})
}
//审核未通过按钮

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

const getData = async () => {
  const res = await detailApi({ id: id.value })
  allData.value = res.data
}
//验证表单
const validForm = async () => {
  const formExpose = await formMethods.getElFormExpose()
  formExpose?.validate(async (valid) => {
    if (valid) {
      const param = await formMethods.getFormData()
      const res = await auditApi({
        id: id.value,
        auditStatus: 'FAIL_AUDIT',
        ...param
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
