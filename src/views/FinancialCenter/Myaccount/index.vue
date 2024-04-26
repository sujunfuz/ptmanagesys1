<template>
  <ContentWrap class="h-750px">
    <div v-if="!showFlag">
      <div class="flex-b">
        <div>{{ t('myAccount.sub1') }}</div>
        <ElButton type="primary" @click="push('/financialCenter/myaccount/authentication')">{{
          t('myAccount.btn')
        }}</ElButton>
      </div>
      <div class="h-270px bg-[#f2f7fe] mt-10px">
        <div class="flex box-border pl-80px">
          <img src="@/assets/imgs/account.png" class="w-100px h-120px pt-80px" />
          <div class="pt-45px ml-20px">
            <div
              ><span class="font-bold">{{ t('myAccount.sub2') }}</span>
              <span class="colorOrange ml-10px font-size-13px"
                >0-2{{ t('myAccount.danwei') }}</span
              ></div
            >
            <div class="mt-20px">
              <div class="flex-c"
                ><div class="circleItem"></div
                ><span class="font-size-15px color-#393d44 ml-10px">{{
                  t('myAccount.sub3')
                }}</span></div
              >
              <div class="line"></div>
              <div class="flex-c"
                ><div class="circleItem"></div
                ><span class="font-size-15px color-#393d44 ml-10px">{{
                  t('myAccount.sub4')
                }}</span></div
              >
              <div class="line"></div>
              <div class="flex-c"
                ><div class="circleItem"></div
                ><sapn class="font-size-15px color-#393d44 ml-10px">{{
                  t('myAccount.sub5')
                }}</sapn></div
              >
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="pl-10px">
      <el-alert v-if="flag == -1" :title="t('myAccount.error')" type="error" show-icon />
      <el-alert v-if="flag == 1" :title="t('myAccount.error1')" type="error" show-icon />
      <div class="mt-20px">
        <div class="flex-c">
          <div>{{ t('myAccount.title5') }}</div>
          <ElButton
            type="primary"
            class="ml-20px"
            @click="push('/financialCenter/myaccount/authentication?type=expired')"
            >{{ t('myAccount.btn') }}</ElButton
          >
        </div>

        <div class="flex-b">
          <div class="flex-c mt-20px color-#7A7A7A font-size-14px">
            <div class="text-right w-60px min-w-60px">{{ t('myAccount.name') }}:</div>
            <div class="ml-15px color-colorBlack">{{ allData?.merchantName || '-' }}</div>
          </div>
        </div>
        <div class="flex-b">
          <div class="flex-c mt-20px color-#7A7A7A font-size-14px">
            <div class="text-right w-60px min-w-60px">{{ t('myAccount.id') }}:</div>
            <div class="ml-15px color-colorBlack">{{ allData?.merchantNo || '-' }}</div>
          </div>
        </div>
        <div class="flex-b">
          <div class="flex-c mt-20px color-#7A7A7A font-size-14px">
            <div class="text-right w-60px min-w-60px">{{ t('myAccount.sub6') }}:</div>
            <div class="ml-15px color-colorBlack">{{ allData?.bankName || '-' }}</div>
          </div>
        </div>
        <div class="flex-b">
          <div class="flex-c mt-20px color-#7A7A7A font-size-14px">
            <div class="text-right w-60px min-w-60px">{{ t('myAccount.sub7') }}:</div>
            <div class="ml-15px color-colorBlack">{{ allData?.subbranchName || '-' }}</div>
          </div>
        </div>
        <div class="flex-b">
          <div class="flex-c mt-20px color-#7A7A7A font-size-14px">
            <div class="text-right w-60px min-w-60px">{{ t('myAccount.sub8') }}:</div>
            <div class="ml-15px color-colorBlack">{{ allData?.bankNo || '-' }}</div>
          </div>
        </div>
        <div class="flex-b">
          <div class="flex-c mt-20px color-#7A7A7A font-size-14px">
            <div class="text-right w-60px min-w-60px">{{ t('myAccount.time') }}:</div>
            <div class="ml-15px color-colorBlack">{{ allData?.auditTimeStr || '-' }}</div>
          </div>
        </div>
        <div class="flex-b">
          <div class="flex-c mt-20px color-#7A7A7A font-size-14px">
            <div class="text-right w-60px min-w-60px">{{ t('myAccount.valid') }}:</div>
            <div class="ml-15px color-colorBlack">{{ allData?.effectiveTimeStr || '-' }}</div>
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="mt-40px">
      <div>
        {{ t('myAccount.sub10') }}
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
    </div> -->
  </ContentWrap>
</template>

<script lang="tsx" setup>
import { ContentWrap } from '@/components/ContentWrap'
import { ElButton, ElTag, ElAlert, ElImage } from 'element-plus'
import { ref, reactive, unref, onMounted } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import { Table } from '@/components/Table'
import { Search } from '@/components/Search'
import { FormSchema } from '@/components/Form'
import { useTable } from '@/hooks/web/useTable'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { useRouter } from 'vue-router'
import { getRightNowTime } from '@/utils/time'
import { checkMerAccountStatusApi, getPageTopApi } from '@/api/financialCenter/business'

const { push } = useRouter()

const { t } = useI18n()

const flag = ref(-1)
const showFlag = ref(false)
const allData = ref()

const judgeEffect = (str: string, time: string) => {
  if (str <= time) {
    return -1 //过期了
  } else {
    // 创建一个空数组来存储日期
    let dates = []

    // 获取当前日期
    let now = new Date(str)

    // 循环获取最近 7 天的日期
    for (let i = 0; i < 7; i++) {
      // 获取当前日期的时间戳
      let timestamp = now.getTime()

      // 计算 i 天前的时间戳
      let dayTimestamp = 24 * 60 * 60 * 1000 // 一天的毫秒数
      let iDayAgoTimestamp = timestamp - i * dayTimestamp

      // 转换为日期对象
      let date = new Date(iDayAgoTimestamp)

      // 格式化日期为 "yyyy-MM-dd" 的字符串并存入数组
      let year = date.getFullYear()
      let month = ('0' + (date.getMonth() + 1)).slice(-2)
      let day = ('0' + date.getDate()).slice(-2)
      dates.push(year + '-' + month + '-' + day)
    }
    // console.log()
    const index = dates.indexOf(time.split(' ')[0])
    if (index >= 0) {
      return 1 //近7天马上要到期
    } else {
      return 0 //没到期
    }
  }
}
onMounted(async () => {
  const res = await checkMerAccountStatusApi()
  if (res.code == 200) {
    allData.value = res.data
    showFlag.value = res.data.effectiveTime ? true : false
    if (res.data.bankNo && !res.data.effectiveTime) {
      push('/financialCenter/myaccount/authentication')
    }
    flag.value = await judgeEffect(res.data.effectiveTimeStr, getRightNowTime('second'))
  }
})
</script>

<style scoped>
.circleItem {
  width: 10px;
  height: 10px;
  border: #79aff1 solid 1.5px;
  border-radius: 50%;
}

.line {
  width: 1px;
  height: 40px;
  background-color: #79aff1;
  margin-left: 5px;
}
</style>
