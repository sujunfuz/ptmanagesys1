<template>
  <ContentWrap class="font-size-20px color-colorBlack">
    <div v-if="allData.afSalesStatus">
      <div class="font-size-20px color-colorBlack">{{ allData.afSalesStatusStr }}</div>
      <!-- 仅退款 -->
      <div
        v-if="allData.afSalesStatus == 'MER_WAIT_TK'"
        class="mt-5px color-colorBlack font-size-15px"
        >{{ t('aftersalesList.please') }}
        <CountDown :second-time="allData.closeTimeSeconds" class="font-size-18px color-#FF770F" />
        {{ t('aftersalesList.pleaseTxt') }}
      </div>
      <div
        v-if="allData.afSalesStatus == 'MER_REFUSE_TK'"
        class="mt-5px color-colorBlack font-size-15px"
        >{{ t('aftersalesList.refundTxt3') }}
        <CountDown :second-time="allData.closeTimeSeconds" class="font-size-18px color-#FF770F" />
        {{ t('aftersalesList.refundTxt4') }}
      </div>

      <div
        v-if="allData.afSalesStatus == 'MER_AGREE_TK_ING'"
        class="mt-5px color-colorBlack font-size-15px"
        >{{ t('aftersalesList.advice1') }}
      </div>
      <div
        v-if="allData.afSalesStatus == 'SUCCESS_TK'"
        class="mt-5px color-colorBlack font-size-15px"
        >{{ t('aftersalesList.advice2') }}
      </div>

      <div
        v-if="allData.afSalesStatus == 'SUCCESS_TK'"
        class="mt-10px color-colorBlack font-size-15px"
        >{{ t('aftersalesList.hao') }}：{{ allData.refundTrxNo }}</div
      >
      <div
        v-if="allData.afSalesStatus == 'SUCCESS_TK'"
        class="mt-10px color-colorBlack font-size-15px"
        >{{ t('aftersalesList.time4') }}{{ allData.refundSuccessTime
        }}{{ t('aftersalesList.price8')
        }}<span class="color-#FF770F">{{ allData.refundAmount }}</span
        >{{ t('aftersalesList.price9') }}，{{
          allData.refundAmount - allData.realAmount == 0
            ? t('aftersalesList.refundTxt')
            : t('aftersalesList.refundTxt1') +
              `${allData.realAmount - allData.refundAmount}` +
              t('aftersalesList.refundTxt2')
        }}</div
      >

      <div
        v-if="allData.afSalesStatus == 'SYS_INTERVENE'"
        class="mt-5px color-colorBlack font-size-15px"
        >{{ t('aftersalesList.refundTxt6') }}
      </div>

      <!-- 按钮 -->
      <div v-if="userType == 'MERCHANT'">
        <div class="flex-c mt-20px" v-if="allData.afSalesStatus == 'MER_WAIT_TK'">
          <ElButton
            v-hasPermi="'aftersales:afSalesRecord:agree'"
            type="primary"
            @click="openDialog(true)"
            >{{ t('aftersalesList.agree') }}</ElButton
          >
          <ElButton v-hasPermi="'aftersales:afSalesRecord:refuse'" @click="openDialog(false)">{{
            t('aftersalesList.refuse')
          }}</ElButton>
        </div>
        <div class="flex-c mt-20px" v-if="allData.afSalesStatus == 'MER_REFUSE_TK'">
          <ElButton
            v-hasPermi="'aftersales:afSalesRecord:agree'"
            type="primary"
            @click="openDialog(true)"
            >{{ t('aftersalesList.btn') }}</ElButton
          >
        </div>
      </div>
      <div v-if="userType == 'BOSS'">
        <div class="flex-c mt-20px" v-if="allData.afSalesStatus == 'SYS_INTERVENE'">
          <ElButton
            v-hasPermi="'aftersales:afSalesRecord:refund'"
            type="primary"
            @click="pingtai(true)"
            >{{ t('aftersalesList.btn1') }}</ElButton
          >
          <ElButton v-hasPermi="'aftersales:afSalesRecord:refuse'" @click="pingtai(false)">{{
            t('aftersalesList.btn2')
          }}</ElButton>
        </div>
      </div>
    </div>

    <!-- 退货退款 -->
    <div
      v-if="allData.afSalesStatus == 'MER_WAIT_TH_TK'"
      class="mt-5px color-colorBlack font-size-15px"
      >{{ t('aftersalesList.please') }}
      <CountDown :second-time="allData.closeTimeSeconds" class="font-size-18px color-#FF770F" />
      {{ t('aftersalesList.pleaseTxt1') }}
    </div>

    <div
      v-if="allData.afSalesStatus == 'MER_AGREE_TH_TK'"
      class="mt-5px color-colorBlack font-size-15px"
      >{{ t('aftersalesList.refundTxt3') }}
      <CountDown :second-time="allData.closeTimeSeconds" class="font-size-18px color-#FF770F" />
      {{ t('aftersalesList.refundTxt7') }}
    </div>

    <div
      v-if="allData.afSalesStatus == 'USER_SEND_WAIT_MER_TK'"
      class="mt-5px color-colorBlack font-size-15px"
      >{{ t('aftersalesList.refundTxt3') }}
      <CountDown :second-time="allData.closeTimeSeconds" class="font-size-18px color-#FF770F" />
      {{ t('aftersalesList.refundTxt7') }}
    </div>

    <div
      v-if="allData.afSalesStatus == 'MER_REFUSE_TH_TK'"
      class="mt-5px color-colorBlack font-size-15px"
      >{{ t('aftersalesList.refundTxt3') }}
      <CountDown :second-time="allData.closeTimeSeconds" class="font-size-18px color-#FF770F" />
      {{ t('aftersalesList.refundTxt4') }}
    </div>
    <!-- 按钮 -->
    <div v-if="userType == 'MERCHANT'">
      <div class="flex-c mt-20px" v-if="allData.afSalesStatus == 'MER_WAIT_TH_TK'">
        <ElButton
          v-hasPermi="'aftersales:afSalesRecord:agree'"
          type="primary"
          @click="openDialog(true)"
          >{{ t('aftersalesList.agree') }}</ElButton
        >
        <ElButton
          v-hasPermi="'aftersales:afSalesRecord:refund'"
          type="primary"
          @click="pingtai(true)"
          >{{ t('aftersalesList.btn1') }}</ElButton
        >
        <ElButton v-hasPermi="'aftersales:afSalesRecord:refuse'" @click="openDialog(false)">{{
          t('aftersalesList.refuse')
        }}</ElButton>
      </div>

      <!-- <div class="flex-c mt-20px" v-if="allData.afSalesStatus == 'MER_REFUSE_TK'">
        <ElButton type="primary" @click="openDialog(true)">{{
          t('aftersalesList.refuse')
        }}</ElButton>
      </div> -->

      <div class="flex-c mt-20px" v-if="allData.afSalesStatus == 'MER_AGREE_TH_TK'">
        <ElButton
          v-hasPermi="'aftersales:afSalesRecord:refund'"
          type="primary"
          @click="pingtai(true)"
          >{{ t('aftersalesList.btn1') }}</ElButton
        >
      </div>

      <div class="flex-c mt-20px" v-if="allData.afSalesStatus == 'USER_SEND_WAIT_MER_TK'">
        <ElButton
          v-hasPermi="'aftersales:afSalesRecord:agree'"
          type="primary"
          @click="openDialog(true)"
          >{{ t('aftersalesList.btn3') }}</ElButton
        >
        <ElButton
          v-hasPermi="'aftersales:afSalesRecord:refund'"
          type="primary"
          @click="pingtai(true)"
          >{{ t('aftersalesList.btn1') }}</ElButton
        >
        <ElButton v-hasPermi="'aftersales:afSalesRecord:refuse'" @click="openDialog(false)">{{
          t('aftersalesList.btn4')
        }}</ElButton>
      </div>

      <div class="flex-c mt-20px" v-if="allData.afSalesStatus == 'MER_REFUSE_TH_TK'">
        <ElButton
          v-hasPermi="'aftersales:afSalesRecord:agree'"
          type="primary"
          @click="openDialog(true)"
          >{{ t('aftersalesList.btn5') }}</ElButton
        >
        <ElButton v-hasPermi="'aftersales:afSalesRecord:refund'" @click="pingtai(true)">{{
          t('aftersalesList.btn1')
        }}</ElButton>
      </div>
    </div>
    <!-- <div >
      <div class="font-size-20px color-colorBlack">商家已同意退款，退款处理中</div>
      <div class="mt-10px color-colorBlack font-size-15px">平台将返回买家支付原账户</div>
    </div> -->
    <!-- <div>
      <div class="font-size-20px color-colorBlack">退款成功，本次售后维权成功</div>
      <div class="mt-10px color-colorBlack font-size-15px">退款成功，售后完成</div>
      <div class="mt-10px color-colorBlack font-size-15px"
        >退款流水号：50302505242023032132368526203</div
      >
      <div class="mt-10px color-colorBlack font-size-15px"
        >已于2023-03-21 21:15:06成功退款<span class="color-#FF770F">0.01</span
        >元，已无剩余可售后金额</div
      >
    </div> -->
    <!-- <div >
      <div class="font-size-20px color-colorBlack">商家已拒绝退款</div>
      <div class="mt-5px color-colorBlack font-size-15px"
        >买家还剩
        <CountDown :second-time="95842631" class="font-size-18px color-#FF770F" />
        处理，超时则售后单自动关闭
      </div>
      <div class="flex-c mt-20px">
        <ElButton type="primary">修改为商家同意退款</ElButton>
      </div>
    </div> -->
    <!-- <div>
      <div class="font-size-20px color-colorBlack">售后关闭</div>
      <div class="mt-10px color-colorBlack font-size-15px">买家撤销申请，售后单关闭</div>
    </div> -->
    <!-- <div>
      <div class="font-size-20px color-colorBlack">平台介入中</div>
      <div class="mt-5px color-colorBlack font-size-15px">平台判定后将直接退款或关闭售后</div>
      <div class="flex-c mt-20px">
        <ElButton type="primary" @click="openDialog('1-1')">补充理由</ElButton>
        <ElButton @click="openDialog('1-2')">直接退款</ElButton>
      </div>
    </div> -->
    <!-- <div>
      <div class="font-size-20px color-colorBlack">售后关闭</div>
      <div class="mt-10px color-colorBlack font-size-15px"
        >平台判定订单不满足售后条件，售后单关闭</div
      >
    </div> -->
  </ContentWrap>
</template>
<script setup lang="tsx">
import { ContentWrap } from '@/components/ContentWrap/index.ts'
import CountDown from './CountDown.vue'
import { ElButton } from 'element-plus'
import { useI18n } from '@/hooks/web/useI18n'
import { computed } from 'vue'
import { useStorage } from '@/hooks/web/useStorage'
import { ref } from 'vue'
const getLocalStorage = useStorage('localStorage')
const userType = ref(getLocalStorage.getStorage('ptUserInfo').userType)
const { t } = useI18n()
const props = defineProps({
  afSalesType: {
    type: String,
    default: ''
  },
  allData: {
    type: Object,
    default: () => {}
  }
})
const emit = defineEmits(['openDialog'])
//flag中true表示同意 false表示不同意
const openDialog = (flag) => {
  if (flag) {
    agreeMethod()
  } else {
    disagreeMethod()
  }
}
const agreeMethod = () => {
  if (
    props.allData.afSalesStatus == 'MER_WAIT_TK' ||
    props.allData.afSalesStatus == 'MER_REFUSE_TK'
  ) {
    emit('openDialog', {
      type: '1-1',
      title: t('aftersalesList.agree1'),
      visible: true,
      height: 150
    })
  } else if (props.allData.afSalesStatus == 'USER_SEND_WAIT_MER_TK') {
    emit('openDialog', {
      type: '1-1',
      title: t('aftersalesList.btn3'),
      visible: true,
      height: 150
    })
  } else if (
    props.allData.afSalesStatus == 'MER_WAIT_TH_TK' ||
    props.allData.afSalesStatus == 'MER_REFUSE_TH_TK'
  ) {
    emit('openDialog', {
      type: '1-4',
      title: t('aftersalesList.agree2'),
      visible: true,
      height: 300
    })
  }
}
const disagreeMethod = () => {
  if (props.allData.afSalesStatus == 'MER_WAIT_TK') {
    emit('openDialog', {
      title: t('aftersalesList.refuse1'),
      type: '1-2',
      visible: true,
      height: 400
    })
  } else if (
    props.allData.afSalesStatus == 'USER_SEND_WAIT_MER_TK' ||
    props.allData.afSalesStatus == 'MER_WAIT_TH_TK'
  ) {
    emit('openDialog', {
      title: t('aftersalesList.refundTxt9'),
      type: '1-2',
      visible: true,
      height: 400
    })
  }
}

const pingtai = (flag) => {
  if (flag) {
    emit('openDialog', {
      type: '1-3',
      title: t('aftersalesList.btn1'),
      visible: true,
      height: 50
    })
  } else {
    emit('openDialog', {
      title: t('aftersalesList.btn2'),
      type: '1-2',
      visible: true,
      height: 400
    })
  }
}
</script>
<style lang="less" scoped>
.el-card {
  border: none;
}
</style>
