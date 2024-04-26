<template>
  <div>
    <div class="flex-c">
      <ElImage
        v-if="currentRow?.anonymous != 'YES'"
        :src="imgUrl + currentRow?.avatar"
        class="w-30px h-30px"
      />
      <img v-else src="@/assets/imgs/avatar1.png" class="w-30px h-30px" />
      <span class="ml-10px">{{ currentRow?.userName }}</span>
      <ElRate class="ml-12px" disabled v-model="starGrade" />
    </div>
    <div class="w-100% text-wrap mt-20px color-#393939 font-size-14px">
      {{ JSON.parse(currentRow?.content).text }}
    </div>
    <div class="w-100% text-wrap mt-10px color-#393939 font-size-14px"
      ><span class="color-#848484"> {{ t('evaluate.orderID') }} </span>：{{
        currentRow?.goodsOrderNo
      }}
    </div>
    <div class="w-100% text-wrap mt-10px color-#393939 font-size-14px"
      ><span class="color-#848484"> {{ t('evaluate.title1') }} </span>：{{
        currentRow?.appealRefuseReason
      }}
    </div>
    <div class="w-100% text-wrap mt-10px color-#393939 font-size-14px">
      <div>
        <el-radio-group v-model="radio1">
          <el-radio label="AGREE" size="large">{{ t('common.aggress') }}</el-radio>
          <el-radio label="REFUSE" size="large">{{ t('common.refuse') }}</el-radio>
        </el-radio-group>
      </div>
      <div v-show="warnFlag1" class="color-red1 mt-5px">{{ t('evaluate.word') }}</div>
    </div>
    <el-input
      v-model="textarea"
      class="mt-10px"
      :maxlength="300"
      :show-word-limit="true"
      :rows="5"
      type="textarea"
      :placeholder="t('common.inputText')"
      @input="changeText"
    />
    <div v-show="warnFlag" class="color-red1 mt-5px">{{ t('evaluate.word') }}</div>
  </div>
</template>
<script setup lang="tsx">
import { ElRate, ElInput, ElRadio, ElRadioGroup, ElImage } from 'element-plus'
import { ref, watch } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'

const { t } = useI18n()

const props = defineProps({
  dialogType: {
    type: String,
    default: 'appeal'
  },
  currentRow: {
    type: Array,
    default: () => []
  }
})

const imgUrl = import.meta.env.VITE_IMG_URL
const radio1 = ref()
const starGrade = ref(0)

watch(
  () => props.currentRow,
  (val) => {
    starGrade.value = val?.score
  },
  { immediate: true }
)

const textarea = ref('')
const warnFlag = ref(false)
const warnFlag1 = ref(false)

const changeText = () => {
  if (textarea.value.length > 0) {
    warnFlag.value = false
  } else {
    warnFlag.value = true
  }
}
const submit = () => {
  warnFlag.value = false
  warnFlag1.value = false

  if (radio1.value && textarea.value) {
    return {
      appealRefuseReason: textarea.value,
      appealStatus: radio1.value
    }
  } else if (!radio1.value) {
    warnFlag1.value = true
  } else if (!textarea.value) {
    warnFlag.value = true
  } else {
    return null
  }
}
defineExpose({
  submit
})
</script>
