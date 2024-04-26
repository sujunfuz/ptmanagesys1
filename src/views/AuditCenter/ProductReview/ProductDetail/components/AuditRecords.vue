<template>
  <ContentWrap>
    <div class="font-size-20px color-colorBlack">{{ t('AuditCenter.name1') }}</div>
    <div v-if="recodeData">
      <StepLine :stepList="recodeData" />
    </div>
    <Empty v-else />
  </ContentWrap>
</template>
<script setup lang="tsx">
import { ContentWrap } from '@/components/ContentWrap/index.ts'
import StepLine from '@/components/customComponents/StepLine/index.vue'
import { useI18n } from '@/hooks/web/useI18n'
import Empty from '@/components/customComponents/Empty/index.vue'
import { watch, ref } from 'vue'
const { t } = useI18n()

defineProps({
  recodeData: {
    type: Array,
    default: () => [{}]
  }
})
</script>
<style lang="less" scoped></style>
