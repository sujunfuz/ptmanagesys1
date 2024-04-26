<template>
  <span>{{
    `${day}${t('timeWords.day')}${hour}${t('timeWords.hour')}${minute}${t(
      'timeWords.minute'
    )}${second}${t('timeWords.second')}`
  }}</span>
</template>
<script lang="tsx" setup>
import { propTypes } from '@/utils/propTypes'
import { ref, computed, onUnmounted } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
const { t } = useI18n()
// import { number } from 'vue-types'
const props = defineProps({
  secondTime: propTypes.number.def(0)
})
const remainder = ref(props.secondTime)
const day = computed(() => {
  return Math.floor(remainder.value / (1000 * 60 * 60 * 24))
})
const hour = computed(() => {
  return Math.floor((remainder.value % (1000 * 60 * 60 * 24)) / 3600000)
})
const minute = computed(() => {
  return Math.floor((remainder.value % (1000 * 60 * 60)) / 60000)
})
const second = computed(() => {
  return remainder.value % 60
})
const timer = setInterval(() => {
  remainder.value--
}, 1000)
onUnmounted(() => {
  clearInterval(timer)
})
</script>
<style lang="less" scoped></style>
