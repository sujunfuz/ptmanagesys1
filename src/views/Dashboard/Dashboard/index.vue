<template>
  <div class="Dashboardbg flex">
    <div class="w-630px ml-68px mt-78px">
      <img src="@/assets/imgs/bigLogo.png" class="ml--30px w-50" />
      <div class="font-size-54px">{{ t('dashboard.hello') }}</div>
      <div class="font-size-54px">{{ t('project.name') }}</div>
      <div class="flex-cb mt-50px">
        <div class="textC w-120px" v-for="(it, i) in iconList" :key="i">
          <img class="w-120px h-104px" :src="it.img" />
          <div class="font-size-16px">{{ it.label }}</div>
        </div>
      </div>
      <div v-if="showType != 'PASS_SECOND_AUDIT' && userInfo.userType != 'BOSS'">
        <div v-if="showType == 'PASS_FIRST_AUDIT'">
          <ElButton
            class="goOfflinesignBtn w-300px !h-68px mt-68px !font-size-20px !bg-green1 border-green1"
            type="primary"
            @click="goOfflinesign"
            >{{ t('dashboard.btsName3') }}</ElButton
          >
          <ElButton
            @click="btsName4()"
            class="w-300px !h-68px mt-68px !font-size-20px"
            type="primary"
            >{{ t('dashboard.btsName4') }}</ElButton
          >
        </div>
        <div v-else>
          <ElButton
            @click="goAuth"
            class="w-630px !h-68px mt-68px !font-size-20px"
            type="primary"
            v-if="userInfo.merTopIs != 'NO' && showType != 'WAIT_AUDIT'"
            >{{
              showType == 'WAIT_AUDIT' ? t('dashboard.btsName2') : t('dashboard.btsName1')
            }}</ElButton
          >

          <div class="mt20px font-size-16px">
            {{ showType == 'WAIT_AUDIT' ? t('dashboard.tiptext3') : t('dashboard.tipTitle') }}</div
          >
          <div v-if="showType != 'WAIT_AUDIT'" class="mt10px color-colorGray flex">
            <div class="ysj"></div>
            <div>{{ t('dashboard.tiptext1') }}</div>
          </div>
          <div v-if="showType != 'WAIT_AUDIT'" class="mt10px color-colorGray flex">
            <div class="ysj"></div>
            <div>{{ t('dashboard.tiptext2') }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="tsx">
import { useI18n } from '@/hooks/web/useI18n'
import { ref, onMounted } from 'vue'
import { ElButton, ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import Icon1 from '@/assets/imgs/Dashboard/icon1.png'
import Icon2 from '@/assets/imgs/Dashboard/icon2.png'
import Icon3 from '@/assets/imgs/Dashboard/icon3.png'
import Icon4 from '@/assets/imgs/Dashboard/icon4.png'
import { checkAuditStatus } from '@/api/dashboard/index'

import { useStorage } from '@/hooks/web/useStorage'
const { getStorage } = useStorage('localStorage')

const { push } = useRouter()

const { t } = useI18n()

const userInfo = getStorage('ptUserInfo')
//WAIT_AUDIT等待审核  PASS_FIRST_AUDIT一审通过 PASS_SECOND_AUDIT二审通过 (FAIL_AUDIT审核失败或为空可以企业认证)
const showType = ref('PASS_SECOND_AUDIT')

onMounted(() => {
  getStatus()
})
const getStatus = async () => {
  await checkAuditStatus().then((res: any) => {
    if (res.code == 200) {
      showType.value = res.data
    }
  })
}

// const getStatus = async () => {
//   const res = await checkAuditStatus()
//   console.log(res)
// }

const iconList = ref([
  {
    img: Icon1,
    label: t('dashboard.icontext1')
  },
  {
    img: Icon2,
    label: t('dashboard.icontext2')
  },
  {
    img: Icon3,
    label: t('dashboard.icontext3')
  },
  {
    img: Icon4,
    label: t('dashboard.icontext4')
  }
])

const goAuth = () => {
  if (showType.value == 'WAIT_AUDIT') return
  push({
    path: '/dashboard/auth'
  })
}
const goOfflinesign = () => {
  push({
    path: '/dashboard/offlinesign'
  })
}

const btsName4 = () => {
  ElMessage.warning(t('project.noOpen'))
}
</script>
<style scoped>
.Dashboardbg {
  width: 100%;
  height: calc(100vh - 90px);
  /* height: 100vh; */
  background: url('@/assets/imgs/Dashboard/bg1.png') no-repeat center left/ cover;
}
</style>
