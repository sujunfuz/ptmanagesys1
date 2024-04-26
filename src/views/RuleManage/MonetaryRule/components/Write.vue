<template>
  <div class="flex-c flex color-colorBlack">
    <div class="w-300px h-87px box-border border-(1px solid #E9E9E9) border-rd-4px">
      <div
        class="box-border pt-10px pb-10px pl-20px pr-20px h-40px bg-#F3F6F8 border-b-(1px solid #E9E9E9) font-size-14px"
        >CNY&nbsp;&nbsp;￥-{{ t('pointer.title2') }}</div
      >
      <div class="h-45px pt-10px pb-10px pl-20px pr-20px font-size-20px font-600">1.00</div>
    </div>
    <Icon icon="gg:arrows-exchange-alt" class="ml-30px mr-30px" :size="40" color="#797979" />
    <div class="w-300px h-87px box-border border-(1px solid #E9E9E9) border-rd-4px">
      <el-select
        v-model="biType"
        filterable
        class="!w-100% !h-40px customSel"
        :placeholder="t('image.sub25')"
      >
        <el-option
          v-for="(item, index) in newCurrencyEnum"
          :key="index"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <ElInput
        onkeyup="this.value = this.value.replace(/[^\d.]/g,'').replace(/\.{2,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.').replace(/^\./g, '')"
        class="h-45px !bg-white customInput"
        v-model="biValue"
      />
      <!-- <div class="h-45px pt-10px pb-10px pl-20px pr-20px font-size-20px font-600">1.00</div> -->
    </div>
  </div>
  <div class="flex-c color-colorBlack font-size-14px mt-30px">
    <span class="mr-15px">{{ t('project.status') }}</span>
    <ElSwitch
      v-model="statusRadio"
      inactiveValue="CLOSE"
      activeValue="OPEN"
      style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
    />
  </div>
</template>
<script setup lang="tsx">
import { Icon } from '@/components/Icon/index.ts'
import { ref, onMounted } from 'vue'
import { ElSelect, ElOption, ElInput, ElSwitch, ElRadio, ElMessage } from 'element-plus'
import { useI18n } from '@/hooks/web/useI18n'

const { t } = useI18n()
const biType = ref('')
const biValue = ref(0)
const statusRadio = ref('OPEN')

const props = defineProps({
  newCurrencyEnum: {
    type: Array,
    default: () => []
  },
  currencyStatusEnum: {
    type: Array,
    default: () => []
  },
  currentRow: {
    type: Array,
    default: () => []
  }
})

onMounted(() => {
  if (props.currentRow.length != 0) {
    biType.value =
      props.currentRow.currencyCode +
      ',' +
      props.currentRow.currencySymbol +
      ',' +
      props.currentRow.currencyName +
      ',' +
      props.currentRow.currencyIcon

    statusRadio.value = props.currentRow.status
    biValue.value = props.currentRow.currencyRate
  }
})

const submit = async () => {
  if (biType.value && biValue.value) {
    return {
      currencyCode: biType.value.split(',')[0],
      currencyName: biType.value.split(',')[2],
      currencyIcon: biType.value.split(',')[3],
      currencySymbol: biType.value.split(',')[1],
      currencyRate: biValue.value || 0,
      status: statusRadio.value,
      id: props.currentRow.id || ''
    }
  } else {
    ElMessage.warning(t('common.sub2'))
  }
}

defineExpose({
  submit
})
</script>
<style lang="less" scoped>
:deep(.select-trigger) {
  height: 40px !important;
}
:deep(.select-trigger) {
  .el-input__wrapper {
    border-radius: 0px !important;
    box-shadow: none !important;
    background-color: #f3f6f8 !important;
    border-bottom: 1px solid #e9e9e9 !important;
    height: 40px !important;
  }
  .el-input__wrapper.is-focus {
    box-shadow: none !important;
  }
}
:deep(.customInput.el-input) {
  .el-input__wrapper {
    border-radius: 0px !important;
    box-shadow: none !important;

    .el-input__inner {
      color: #14181f !important;
      font-size: 20px !important;
      font-weight: 600 !important;
    }
  }
}
</style>
