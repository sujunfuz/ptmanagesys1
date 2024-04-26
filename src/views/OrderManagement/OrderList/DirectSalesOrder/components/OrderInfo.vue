<template>
  <div>
    <div class="pa-20px w-100% min-w-725px">
      <div class="font-size-20px color-colorBlack">{{ t('chooseGoods.manifestInfo') }}</div>
    </div>
    <!-- 虚假表格 -->
    <div class="bg-#E8EAED w-100% h-50px min-w-500px">
      <div
        class="customW h-100% font-size-14px font-600 flex-b color-colorBlack [&>div]:(line-height-50px h-100%)"
        style="margin: 0 auto"
      >
        <div class="w-84%">{{ t('chooseGoods.info') }}</div>
        <!-- <div class="w-19%">价格</div> -->
        <div class="w-12%">{{ t('chooseGoods.fright') }}</div>
      </div>
    </div>
    <div class="w-100% border-b-(1px solid #E8EAED )">
      <ElScrollbar :height="'670px'">
        <div
          class="customW font-size-14px flex-b items-stretch color-colorBlack pt-10px pb-10px"
          style="margin: 0 auto"
          v-for="index in 10"
          :key="index"
        >
          <div class="w-84% flex overflow-hidden min-w-535px">
            <img class="w-50px h-50px bg-colorGray border-rd-4px" alt="" />
            <div class="flex flex-col ml-10px" style="width: calc(100% - 70px)">
              <div class="truncate"
                >夏季短袖男ins潮牌t恤2023宽松百搭体恤衫潮流字母印花打dhsdsdsahdjsahdjsahjdh</div
              >
              <div class="flex-b w-100% mt-10px" v-for="i in 4" :key="i">
                <div class="w-45% flex">
                  <span class="inline-block">规格1:</span>
                  <span class="inline-block pl-10px" style="width: calc(100% - 50px)">红色xl</span>
                </div>
                <div class="w-25% color-colorGray flex items-center">
                  <span>x1</span>
                  <Icon class="!w-10px !h-10px inline-block" icon="svg-icon:edit" />
                  <!-- <ElInput class="!w-70px !h-22px" />
                  <div
                    class="w-32px h-22px bg-colorMain color-white line-height-22px text-center font-size-12px border-rd-4px ml-5px"
                    >确认</div
                  > -->
                </div>
                <div class="w-18%">￥79.80</div>
                <div class="w-10% color-red1 cursor-pointer">{{ t('project.delete') }}</div>
              </div>
            </div>
          </div>
          <div class="w-12%">675</div>
        </div>
      </ElScrollbar>
    </div>
    <!-- 底部计算信息 -->
    <div
      class="min-w-424px box-border pt-10px pb-10px pl-20px pr-20px border-t-(1px solid #E8EAED ) border-b-(1px solid #E8EAED ) mt-12px flex font-size-14px color-colorBlack h-78px"
    >
      <div class="flex-b items-center w-60% overflow-hidden">
        <div class="w-10%"> {{ t('chooseGoods.remark') }}</div>
        <ElInput class="w-85% h-40px ml-10px" />
      </div>
      <div class="w-40% pl-40px flex-b flex-col">
        <div class="flex-b">
          <span>{{ t('chooseGoods.sub1') }}:</span>
          <span>￥1835.40</span>
        </div>
        <div class="flex-b">
          <span>{{ t('chooseGoods.sub2') }}:</span>
          <span>￥64.40</span>
        </div>
      </div>
    </div>
    <div class="pa-20px font-size-14px color-colorGray min-w-424px">
      <div>{{ t('chooseGoods.sub3') }}:</div>
      <div class="flex mt-20px">
        <div class="w-60%"
          >{{ t('chooseGoods.sub4') }}：<span class="color-colorBlack">8</span></div
        >
        <div class="w-40% flex-b">
          <span>{{ t('chooseGoods.sub1') }}：</span>
          <span class="color-colorBlack">￥1835.40</span>
        </div>
      </div>
      <div class="flex mt-20px">
        <div class="w-60%"
          >{{ t('chooseGoods.sub5') }}：<span class="color-colorBlack">8</span></div
        >
        <div class="w-40% flex-b">
          <span>{{ t('chooseGoods.sub2') }}：</span>
          <span class="color-colorBlack">￥64.00</span>
        </div>
      </div>
      <!-- 优惠 -->
      <div class="flex mt-20px justify-end">
        <div class="w-40% flex-b">
          <span>{{ t('chooseGoods.sub6') }}：</span>
          <div class="color-colorGray flex items-center">
            <ElInput class="!w-70px !h-22px color-colorBlack" />
            <div
              class="w-32px h-22px bg-colorMain color-white line-height-22px text-center font-size-12px border-rd-4px ml-5px"
            >
              {{ t('project.confirm') }}</div
            >
          </div>
        </div>
      </div>
      <!-- 应付总额 -->
      <div class="flex mt-20px justify-end">
        <div class="w-40% flex-b">
          <span
            >{{ t('chooseGoods.sub7') }}：<span class="color-colorBlack font-size-20px"
              >￥1899.40</span
            ></span
          >
        </div>
      </div>
      <!-- 按钮 -->
      <div class="flex mt-40px justify-end">
        <div class="w-40% flex min-w-232px">
          <el-button text bg>{{ t('project.cancel') }}</el-button>
          <el-button type="primary" class="ml-20px">{{ t('chooseGoods.btn') }}</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="tsx">
import { ElButton, ElScrollbar, ElInput } from 'element-plus'
import Icon from '@/components/Icon/src/Icon.vue'
import { useI18n } from '@/hooks/web/useI18n'
const { t } = useI18n()
</script>
<style lang="less" scoped>
.customW {
  width: calc(100% - 40px);
}
</style>
