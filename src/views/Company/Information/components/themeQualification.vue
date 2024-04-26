<script setup lang="tsx">
import { Form, FormSchema } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { PropType, reactive, watch, ref } from 'vue'
import { useValidator } from '@/hooks/web/useValidator'
import { useI18n } from '@/hooks/web/useI18n'
import { ElTag } from 'element-plus'

const { t } = useI18n()

const props = defineProps({
  currentRow: {
    type: Object as PropType<any>,
    default: () => null
  }
})
</script>

<template>
  <div
    ><el-tag type="danger"
      >{{ t('merchantDetail.sub1') }} {{ currentRow?.issueDate }} {{ t('merchantDetail.sub2') }}
    </el-tag>
    <div>
      <div class="mt-20px flex-c color-#7A7A7A font-size-14px">
        <div class="text-right w-120px min-w-120px">{{ t('merchantDialog.name') }}:</div>
        <div class="ml-15px color-colorBlack">{{ currentRow?.merchantName }} </div>
      </div>
      <div class="mt-20px flex-c color-#7A7A7A font-size-14px">
        <div class="text-right w-120px min-w-120px">{{ t('merchantDialog.sub1') }}:</div>
        <div class="ml-15px color-colorBlack">{{ currentRow?.registeredCapital }}</div>
      </div>
      <div class="mt-20px flex-c color-#7A7A7A font-size-14px">
        <div class="text-right w-120px min-w-120px">{{ t('merchantDialog.sub2') }}:</div>
        <div class="ml-15px color-colorBlack">{{ currentRow?.licenseNo }}</div>
      </div>
      <div class="mt-20px flex-c color-#7A7A7A font-size-14px">
        <div class="text-right w-120px min-w-120px">{{ t('merchantDialog.sub3') }}:</div>
        <div class="ml-15px color-colorBlack">{{ currentRow?.registrationAuthority }}</div>
      </div>
      <div class="mt-20px flex-c color-#7A7A7A font-size-14px">
        <div class="text-right w-120px min-w-120px">{{ t('merchantDialog.sub4') }}:</div>
        <div class="ml-15px color-colorBlack">{{ currentRow?.businessTerm }}</div>
      </div>
      <div class="mt-20px flex-c color-#7A7A7A font-size-14px">
        <div class="text-right w-120px min-w-120px">{{ t('merchantDialog.sub5') }}:</div>
        <div class="ml-15px color-colorBlack">{{ currentRow?.businessScope }}</div>
      </div>
      <div class="mt-20px flex-c color-#7A7A7A font-size-14px">
        <div class="text-right w-120px min-w-120px">{{ t('merchantDialog.sub6') }}:</div>
        <div class="ml-15px color-colorBlack">{{ currentRow?.address }}</div>
      </div>
      <div class="mt-20px flex-c color-#7A7A7A font-size-14px">
        <div class="text-right w-120px min-w-120px">{{ t('merchantDialog.sub7') }}:</div>
        <div class="ml-15px color-colorBlack">{{ currentRow?.foundTime }}</div>
      </div>
      <div class="mt-20px flex-c color-#7A7A7A font-size-14px">
        <div class="text-right w-120px min-w-120px">{{ t('merchantDialog.sub8') }}:</div>
        <div class="ml-15px color-colorBlack">{{ currentRow?.legalUserName }}</div>
      </div>
      <div class="mt-20px flex-c color-#7A7A7A font-size-14px">
        <div class="text-right w-120px min-w-120px">{{ t('merchantDialog.sub9') }}:</div>
        <div class="ml-15px color-colorBlack">{{ currentRow?.companyType }}</div>
      </div>
    </div>
  </div>
</template>

<style lang="less"></style>
