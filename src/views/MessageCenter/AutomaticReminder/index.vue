<template>
  <ContentWrap class="w-100% flex-1">
    <div class="font-size-18px">{{ t('automaticReminder.name') }}</div>
    <div class="flex-c mt-20px">
      <div class="block">
        <div class="title colorMain font-bold">{{ t('automaticReminder.title1') }}</div>
        <div class="items">
          <div class="sub"> {{ t('automaticReminder.sub1') }}</div>
          <div class="sub"> {{ t('automaticReminder.sub2') }}</div>
          <div class="sub"> {{ t('automaticReminder.sub3') }}</div>
          <div class="sub"> {{ t('automaticReminder.sub4') }}</div>
          <div class="sub"> {{ t('automaticReminder.sub5') }}</div>
        </div>
      </div>
      <div class="block">
        <div class="title colorMain font-bold">{{ t('automaticReminder.title2') }}</div>
        <div class="items">
          <div class="sub"> {{ t('automaticReminder.block1') }}</div>
          <div class="sub"> {{ t('automaticReminder.block2') }}</div>
          <div class="sub"> {{ t('automaticReminder.block3') }}</div>
        </div></div
      >
      <div class="block">
        <div class="title colorMain font-bold">{{ t('automaticReminder.title3') }}</div>
        <div class="items">
          <div class="sub"> {{ t('automaticReminder.item1') }}</div>
          <div class="sub"> {{ t('automaticReminder.item2') }}</div>
          <div class="sub"> {{ t('automaticReminder.item3') }}</div>
          <div class="sub"> {{ t('automaticReminder.item4') }}</div>
          <div class="sub"> {{ t('automaticReminder.item5') }}</div>
          <div class="sub"> {{ t('automaticReminder.item6') }}</div>
        </div></div
      >
      <div class="block">
        <div class="title colorMain font-bold">{{ t('automaticReminder.title4') }}</div>
        <div class="items">
          <div class="sub"> {{ t('automaticReminder.items1') }}</div>
          <div class="sub"> {{ t('automaticReminder.items2') }}</div>
          <div class="sub"> {{ t('automaticReminder.items3') }}</div>
          <div class="sub"> {{ t('automaticReminder.items4') }}</div>
          <div class="sub"> {{ t('automaticReminder.items5') }}</div>
          <div class="sub"> {{ t('automaticReminder.items6') }}</div>
          <div class="sub"> {{ t('automaticReminder.items6') }}</div>
        </div></div
      >
    </div>
  </ContentWrap>
</template>

<script setup lang="tsx">
import { ContentWrap } from '@/components/ContentWrap'
import { useI18n } from '@/hooks/web/useI18n'

const { t } = useI18n()
</script>

<style lang="less" scoped>
.block {
  width: 380px;
  text-align: center;
  margin-right: 20px;
  .title {
    height: 40px;
    line-height: 40px;
    background-color: #e6effc;
  }

  .items {
    height: 300px;
    margin-top: 10px;
    background-color: #fafafa;
    text-align: left;
    padding-left: 15px;
    padding-top: 5px;
  }

  .sub {
    font-size: 15px;
    color: #575a59;
    margin-top: 15px;
  }
}
</style>
