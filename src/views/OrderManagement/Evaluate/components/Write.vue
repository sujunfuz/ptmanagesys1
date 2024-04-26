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
      <ElRate v-if="dialogType != 'appeal'" class="ml-12px" disabled v-model="starGrade" />
    </div>
    <div class="w-100% text-wrap mt-20px color-#393939 font-size-14px">
      {{ JSON.parse(currentRow?.content).text }}
    </div>
    <div v-if="dialogType == 'appeal'" class="w-100% text-wrap mt-10px color-#393939 font-size-14px"
      >{{ t('evaluate.orderID') }}：{{ currentRow?.goodsOrderNo }}
    </div>
    <div
      v-if="dialogType == 'appeal'"
      class="w-100% text-wrap mt-10px color-#393939 font-size-14px"
    >
      <span class="color-red1">*</span>{{ t('evaluate.title1') }}
    </div>
    <el-input
      v-model="textarea"
      class="mt-20px"
      :maxlength="300"
      :show-word-limit="true"
      :rows="5"
      type="textarea"
      :placeholder="t('common.inputText')"
      @input="changeText"
    />
    <div v-if="dialogType == 'appeal'" v-show="warnFlag" class="color-red1 mt-5px">{{
      t('evaluate.word')
    }}</div>
  </div>
</template>
<script setup lang="tsx">
import { ElRate, ElInput, ElImage } from 'element-plus'
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

const starGrade = ref(0)
const imgUrl = import.meta.env.VITE_IMG_URL

watch(
  () => props.currentRow,
  (val) => {
    starGrade.value = val?.score
  },
  { immediate: true }
)

const textarea = ref('')
const warnFlag = ref(false)
const changeText = () => {
  if (textarea.value.length > 0) {
    warnFlag.value = false
  } else {
    warnFlag.value = true
  }
}
const submit = () => {
  if (props.dialogType == 'appeal' && !textarea.value) {
    warnFlag.value = true
    return null
  } else {
    return textarea.value
  }
}
defineExpose({
  submit
})
</script>
