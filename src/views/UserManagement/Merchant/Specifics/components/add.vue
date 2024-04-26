<script setup lang="tsx">
import { Form, FormSchema } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { PropType, reactive, watch, ref } from 'vue'
import { useValidator } from '@/hooks/web/useValidator'
import { useI18n } from '@/hooks/web/useI18n'
import { ElTag } from 'element-plus'

const { t } = useI18n()

defineProps({
  allBody: {
    type: Object as PropType<any>,
    default: () => null
  }
})
</script>

<template>
  <div
    ><el-tag type="danger">{{ t('merchantDetail.sub1') }} {{ t('merchantDetail.sub2') }} </el-tag>
    <div>
      <div class="mt-20px flex-c color-#7A7A7A font-size-14px">
        <div class="text-right w-120px min-w-120px">{{ t('merchantDialog.name') }}:</div>
        <div class="ml-15px color-colorBlack">{{ allBody?.merchantName }}</div>
      </div>
      <div class="mt-20px flex-c color-#7A7A7A font-size-14px">
        <div class="text-right w-120px min-w-120px">{{ t('merchantDialog.sub1') }}:</div>
        <div class="ml-15px color-colorBlack">{{ allBody?.registeredCapital }}</div>
      </div>
      <div class="mt-20px flex-c color-#7A7A7A font-size-14px">
        <div class="text-right w-120px min-w-120px">{{ t('merchantDialog.sub2') }}:</div>
        <div class="ml-15px color-colorBlack">{{ allBody?.licenseNo }}</div>
      </div>
      <div class="mt-20px flex-c color-#7A7A7A font-size-14px">
        <div class="text-right w-120px min-w-120px">{{ t('merchantDialog.sub3') }}:</div>
        <div class="ml-15px color-colorBlack">{{ allBody?.registrationAuthority }}</div>
      </div>
      <div class="mt-20px flex-c color-#7A7A7A font-size-14px">
        <div class="text-right w-120px min-w-120px">{{ t('merchantDialog.sub4') }}:</div>
        <div class="ml-15px color-colorBlack">{{ allBody?.businessTerm }}</div>
      </div>
      <div class="mt-20px flex-c color-#7A7A7A font-size-14px">
        <div class="text-right w-120px min-w-120px">{{ t('merchantDialog.sub5') }}:</div>
        <div class="ml-15px color-colorBlack">{{ allBody?.businessScope }}</div>
      </div>
      <div class="mt-20px flex-c color-#7A7A7A font-size-14px">
        <div class="text-right w-120px min-w-120px">{{ t('merchantDialog.sub6') }}:</div>
        <div class="ml-15px color-colorBlack">{{ allBody?.address }}</div>
      </div>
      <div class="mt-20px flex-c color-#7A7A7A font-size-14px">
        <div class="text-right w-120px min-w-120px">{{ t('merchantDialog.sub7') }}:</div>
        <div class="ml-15px color-colorBlack">{{ allBody?.foundTime }}</div>
      </div>
      <div class="mt-20px flex-c color-#7A7A7A font-size-14px">
        <div class="text-right w-120px min-w-120px">{{ t('merchantDialog.sub8') }}:</div>
        <div class="ml-15px color-colorBlack">{{ allBody?.legalUserName }}</div>
      </div>
      <div class="mt-20px flex-c color-#7A7A7A font-size-14px">
        <div class="text-right w-120px min-w-120px">{{ t('merchantDialog.sub9') }}:</div>
        <div class="ml-15px color-colorBlack">{{ allBody?.companyType }}</div>
      </div>
      <div class="mt-20px flex-c color-#7A7A7A font-size-14px">
        <div class="text-right w-120px min-w-120px">{{ t('merchantDialog.sub10') }}:</div>
        <div class="ml-15px color-colorBlack">{{ allBody?.issueDate }}</div>
      </div>
    </div>
  </div>
</template>

<style lang="less"></style>
