<template>
  <div
    class="w-13% pa-20px box-border border-rd-4px h-132px"
    style="border: 1px solid #f0f2f5; box-shadow: 1px 3px 12px 1px rgba(0, 0, 0, 0.08)"
  >
    <div class="flex-cb font-size-14px font-500">
      <span>{{ t('DataCenter.txt9') }}</span>
      <el-checkbox v-model="checked1" size="large" />
    </div>
  </div>
</template>
<script setup lang="tsx">
import { ref, onMounted } from 'vue'
import { ElCheckbox } from 'element-plus'
import { useI18n } from '@/hooks/web/useI18n'

const checked1 = ref(false)
const { t } = useI18n()
</script>
<style lang="less" scoped></style>
