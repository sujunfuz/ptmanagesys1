<template>
  <ContentWrap>
    <div class="flex-c">
      <div class="font-size-20px color-colorBlack">{{
        t('AuditCenter.AuditList.viewLogistics')
      }}</div>
      <div class="business1 ml-5px">{{ t('project.business') }}</div>
    </div>
    <div class="w-800px flex-b mt-10px font-size-15px" v-if="merLogistics?.logisticsNo">
      <div>{{ t('aftersalesList.kuaidigs') }}:{{ merLogistics?.logisticsName }}</div>
      <div>{{ t('aftersalesList.kuaidiNo') }}:{{ merLogistics?.logisticsNo }}</div>
      <div>{{ t('common.w') }}:{{ merLogistics?.phone }}</div>
      <div>{{ t('common.r') }}:{{ merLogistics?.remark }}</div>
    </div>

    <ElScrollbar
      v-if="merLogisticsRecordList.length"
      :height="'300px'"
      class="w-800px mt-20px bg-#f9f9f9"
    >
      <StepLine :stepList="merLogisticsRecordList" />
    </ElScrollbar>
    <Empty v-else />

    <div class="flex-c mt-20px">
      <div class="font-size-20px color-colorBlack">{{
        t('AuditCenter.AuditList.viewLogistics')
      }}</div>
      <div class="platform1 ml-5px">{{ t('project.platform') }}</div>
    </div>

    <!-- <div class="flex-b mt-10px font-size-15px">
      <div>{{ t('aftersalesList.kuaidigs') }}:</div>
      <div>{{ t('aftersalesList.kuaidiNo') }}:</div>
      <div>{{ t('common.w') }}:</div>
      <div>{{ t('common.r') }}:</div>
    </div> -->
    <ElScrollbar
      v-if="bossLogisticsRecordList.length"
      :height="'300px'"
      class="w-800px mt-20px bg-#f9f9f9"
    >
      <StepLine :stepList="bossLogisticsRecordList" />
    </ElScrollbar>
    <Empty v-else />
  </ContentWrap>
</template>
<script setup lang="tsx">
import { ContentWrap } from '@/components/ContentWrap/index.ts'
import StepLine from '@/components/customComponents/StepLine/index.vue'
import { ElScrollbar } from 'element-plus'
import { useI18n } from '@/hooks/web/useI18n'
import Empty from '@/components/customComponents/Empty/index.vue'

defineProps({
  merLogisticsRecordList: {
    type: Array,
    default: () => []
  },
  bossLogisticsRecordList: {
    type: Array,
    default: () => []
  },
  merLogistics: {
    type: Array,
    default: () => []
  }
})
const { t } = useI18n()
</script>
<style lang="less" scoped></style>
