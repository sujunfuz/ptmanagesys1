<template>
  <div class="all pa-20px pl-10px" v-if="stepList && stepList.length > 0">
    <div class="font-size-12px line" v-for="(item, index) in stepList" :key="index">
      <div class="flex-c items-center">
        <div class="line-node" :class="item.itemClass ? item.itemClass : 'bg-#797979'">
          <div class="line-circle"></div>
        </div>
        <div class="flex-b w-100%">
          <div
            :class="
              stepType == 'product' || index != 0
                ? 'ml-10px font-size-14px item-title color-#797979'
                : 'ml-10px font-size-18px item-title color-colorMain'
            "
            >{{ item?.title || '-' }}</div
          >
          <div
            v-if="stepType == 'product'"
            class="mr-right font-size-13px line-time color-colorGray"
            >{{ item?.time || '-' }}</div
          >
        </div>
      </div>
      <div class="pt-10px pb-20px pl-10px line-middle">
        <div
          class="line-content font-size-12px"
          :class="stepType == 'product' ? 'color-#797979' : 'color-colorBlack'"
          >{{ item?.content }}</div
        >
        <div
          v-if="stepType == 'afSales'"
          class="mr-right font-size-13px line-time color-colorGray"
          >{{ item?.time || '-' }}</div
        >
      </div>
    </div>
  </div>
  <!-- dsad -->
</template>
<script setup lang="tsx">
import { propTypes } from '@/utils/propTypes'
import { ref } from 'vue'
defineProps({
  stepList: propTypes.array.def([]),
  stepType: propTypes.string.def('product')
})
// const temp = ref('false')
// const list = [
//   {
//     title: '已签收',
//     content: '邮件已签收[紫光科技园电话:13356781234],如有疑问请联系快递员[电话:13356781234]。',
//     time: '2023/5/6 20:31:56'
//   },
//   {
//     title: '[福州市]快件已到达仓山区物流中心',
//     content: '',
//     time: '2023/5/6 20:31:56'
//   },
//   {
//     title: '[福州市]快件已到达仓山区物流中心',
//     content: '',
//     time: '2023/5/6 20:31:56'
//   },
//   {
//     title: '[福州市]快件已到达仓山区物流中心',
//     content: '',
//     time: '2023/5/6 20:31:56'
//   },
//   {
//     title: '[福州市]快件已到达仓山区物流中心',
//     content: '',
//     time: '2023/5/6 20:31:56'
//   },
//   {
//     title: '[福州市]快件已到达仓山区物流中心',
//     content: '',
//     time: '2023/5/6 20:31:56'
//   }
// ]
</script>
<style lang="less" scoped>
.line-node {
  width: 13px;
  min-width: 13px;
  height: 13px;
  min-height: 13px;
  border-radius: 100%;
  .line-circle {
    display: none;
  }
}
.line:first-child {
  .line-node {
    box-sizing: border-box !important;
    border: 1px solid #0068e3 !important;
    background-color: white !important;
    // display: flex;
    // align-items: center;
    // justify-content: center;
    .line-circle {
      display: block !important;
      width: 5px;
      height: 5px;
      margin-top: 3px;
      margin-left: 3px;
      background: #0068e3;
      border-radius: 100%;
    }
  }
}
.line-middle {
  border-left: 1px solid #797979;
  margin: 2px 0px 2px 6.5px;
}
.all {
  .line:first-child {
    // .line-node {
    //   display: flex;
    //   align-items: center;
    //   justify-content: center;
    //   background-color: white;
    //   border: 1px solid var(--el-color-primary);
    //   .line-circle {
    //     display: block;
    //     width: 5px;
    //     height: 5px;
    //     border-radius: 100%;
    //     background-color: var(--el-color-primary);
    //   }
    // }
    // .item-title {
    // font-size: 15px;
    // color: var(--el-color-primary);
    // }
  }
  .line:last-child {
    .line-middle {
      border-left: none;
    }
  }
}
</style>
