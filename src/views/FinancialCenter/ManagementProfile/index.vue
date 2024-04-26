<template>
  <ContentWrap>
    <div class="flex-c justify-between">
      <div class="w-75% flex-c box-border border-r-(1px solid #C7C7C7)">
        <div class="min-w-70px">{{ t('managementProfile.sub1') }}</div>
        <div class="ml-10%">
          <div
            ><span class="font-bold font-size-18px">{{ data1?.dealAmount || '0' }}</span>
            <span class="font-size-13px ml-10px">￥</span></div
          >
          <div class="font-bold font-size-13px mt-10px">{{ t('managementProfile.sub1_1') }}</div>
        </div>
        <div class="ml-10%">
          <div
            ><span class="font-bold font-size-18px">{{ data1?.unpaid || '0' }}</span>
            <span class="font-size-13px ml-10px">￥</span></div
          >
          <div class="font-bold font-size-13px mt-10px">{{ t('managementProfile.sub1_2') }}</div>
        </div>
        <div class="ml-10%">
          <div
            ><span class="font-bold font-size-18px">{{ data1?.undeclared || '0' }}</span>
            <span class="font-size-13px ml-10px">￥</span></div
          >
          <div class="font-bold font-size-13px mt-10px">{{ t('managementProfile.txt1') }}</div>
        </div>
        <div class="ml-10%">
          <div
            ><span class="font-bold font-size-18px">{{ data1?.unsettled || '0' }}</span>
            <span class="font-size-13px ml-10px">￥</span></div
          >
          <div class="font-bold font-size-13px mt-10px">{{ t('managementProfile.sub1_3') }}</div>
        </div>
      </div>
      <div>
        <div
          ><span class="font-bold font-size-18px">{{ data1?.availableBalance || '0' }}</span>
          <span class="font-size-13px ml-10px">￥</span></div
        >
        <div class="font-bold font-size-13px mt-10px">{{ t('managementProfile.txt2') }}</div>
      </div>
      <ElButton
        type="primary"
        class="w-100px"
        v-hasPermi="'settlement:settle'"
        @click="push('/financialCenter/managementProfile/settleAccount')"
        >{{ t('managementProfile.txt3') }}</ElButton
      >
    </div>
  </ContentWrap>

  <ContentWrap class="mt-20px" v-if="data2?.creditAmount && data2?.creditAmount != 0">
    <div class="flex-c justify-between">
      <div class="w-75% flex-c box-border border-r-(1px solid #C7C7C7)">
        <div class="min-w-70px">{{ t('managementProfile.sub2') }}</div>
        <div class="ml-10%">
          <div
            ><span class="font-bold font-size-18px">{{ data2?.creditAmount || '0' }}</span>
            <span class="font-size-13px ml-10px">￥</span></div
          >
          <div class="font-bold font-size-13px mt-10px">{{ t('managementProfile.sub2_1') }}</div>
        </div>
        <div class="ml-15%">
          <div
            ><span class="font-bold font-size-18px">{{ data2?.usedCreditAmount || '0' }}</span>
            <span class="font-size-13px ml-10px">￥</span></div
          >
          <div class="font-bold font-size-13px mt-10px">{{ t('managementProfile.sub2_2') }}</div>
        </div>
        <div class="ml-15%">
          <div
            ><span class="font-bold font-size-18px">{{ data2?.availableCreditAmount || '0' }}</span>
            <span class="font-size-13px ml-10px">￥</span></div
          >
          <div class="font-bold font-size-13px mt-10px">{{ t('managementProfile.sub2_3') }}</div>
        </div>
      </div>
      <div>
        <div
          ><span class="font-bold font-size-18px">{{ data2?.interest || '0' }}</span>
          <span class="font-size-13px ml-10px">￥</span></div
        >
        <div class="font-bold font-size-13px mt-10px">{{ t('managementProfile.sub2_4') }}</div>
      </div>
      <div class="flex flex-col">
        <div>
          <ElButton
            type="primary"
            class="w-100px"
            v-hasPermi="'settlement:settle'"
            @click="push('/financialCenter/managementProfile/advanceSettlement')"
            >{{ t('managementProfile.txt4') }}</ElButton
          >
        </div>
        <div>
          <!-- @click="push('/financialCenter/managementProfile/immediateRepayment')" -->
          <ElButton
            v-hasPermi="'settlement:settle'"
            type="primary"
            @click="openDialog"
            class="w-100px mt-10px"
            plain
            >{{ t('managementProfile.btn3') }}</ElButton
          >
        </div>
      </div>
    </div>
  </ContentWrap>
  <!-- 
  <ContentWrap class="mt-20px">
    <div>{{ t('managementProfile.sub3') }}</div>
    <ElButton
      type="primary"
      class="w-100px mt-10px"
      plain
      @click="push('/financialCenter/managementProfile/submitSuccessfully')"
      >{{ t('myAccount.title1') }}</ElButton
    >
  </ContentWrap> -->
  <SecondPart />
  <ThirdPart />
  <Dialog
    v-model="dialogConfig.visible"
    :max-height="550"
    style="width: 35%"
    :title="dialogConfig.title"
    @close="openType = 1"
  >
    <Write
      ref="writeRef"
      :openType="openType"
      :repayData="repayData"
      @update-dialog-title="updateDialogTitle"
    />
    <template #footer>
      <ElButton type="primary" @click="save">{{ t('common.ok') }}</ElButton>
    </template>
  </Dialog>
</template>

<script setup lang="tsx">
import { ContentWrap } from '@/components/ContentWrap'
import { useI18n } from '@/hooks/web/useI18n'
import { ref, unref, reactive, onMounted } from 'vue'
import { ElButton, ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import SecondPart from './components/SecondPart.vue'
import ThirdPart from './components/ThirdPart.vue'
import Dialog from '@/components/Dialog/src/Dialog.vue'
import Write from './components/Write.vue'
import { accountApi, creditApi, getRepayInfoApi, repayApi } from '@/api/managementProfile/index'
const { push, currentRoute } = useRouter()

const { t } = useI18n()
const dialogConfig = reactive({
  title: t('managementProfile.btn3'),
  visible: false
})
const openType = ref(1)
const updateDialogTitle = (step) => {
  if (step == 0) {
    dialogConfig.title = t('managementProfile.btn3')
  } else if (step == 1) {
    dialogConfig.title = t('managementProfile.txt21')
  } else if (step == 2) {
    dialogConfig.title = t('managementProfile.txt20')
  }
}

const data1 = ref()
const data2 = ref()
onMounted(async () => {
  const res1 = await accountApi()
  if (res1.code == 200) {
    data1.value = res1.data
  }

  const res2 = await creditApi()
  if (res2.code == 200) {
    data2.value = res2.data
  }
})
const repayData = ref<any>({})
const openDialog = async () => {
  const res = await getRepayInfoApi()
  if (res) {
    repayData.value = res.data
    dialogConfig.visible = true
  }

  // console.log(res, 'dahj')
}
const writeRef = ref()

const save = async () => {
  if (openType.value == 1) {
    const params = await writeRef.value.submit()
    if (params) {
      const res = await repayApi(params)
      if (res) {
        ElMessage.success(res.msg)
        openType.value = 2
      }
    }
  } else {
    dialogConfig.visible = false
    openType.value = 1
  }
}
</script>
