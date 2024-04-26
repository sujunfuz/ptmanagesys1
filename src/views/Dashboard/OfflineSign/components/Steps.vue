<template>
  <div class="flex-cc">
    <div class="m-steps">
      <div class="m-steps-item" v-for="n in totalSteps" :key="n" @click="onChange(n)">
        <div class="flex-c">
          <div
            class="m-steps-icon"
            :class="
              current < n ? 'yuan1' : current == n && current != totalSteps ? 'yuan2' : 'yuan3'
            "
          >
            <span class="u-icon" v-if="current <= n && current != totalSteps">{{ n }}</span>
            <span class="u-icon" v-else>✓</span>
          </div>
          <div v-if="n != totalSteps" :class="current <= n ? 'steps-line' : 'steps-line2'"></div>
        </div>
        <div class="stepTitle" :class="current < n ? 'color-colorGray' : ''">
          {{ stepsDesc[n - 1] || 'Desc' + n }}
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="tsx">
import { ref, computed } from 'vue'
import { propTypes } from '@/utils/propTypes'

const props = defineProps({
  stepsDesc: {
    type: Array,
    default: () => []
  },
  currentStep: propTypes.number.def(1)
})
const totalSteps = computed(() => {
  return props.stepsDesc.length
})

const current = computed(() => {
  return props.currentStep > props.totalSteps ? 1 : props.currentStep
})

const emit = defineEmits(['change'])

const onChange = (index) => {
  if (current.value !== index) {
    // current.value = index
    emit('change', index)
  }
}
</script>
<style lang="less" scoped>
.m-steps {
  padding: 30px 0;
  display: flex;

  .m-steps-item {
    display: inline-block;
    flex: 1; // 弹性盒模型对象的子元素都有相同的长度，且忽略它们内部的内容
    // overflow: hidden;
    font-size: 16px;
    margin-right: 10px;

    .m-steps-icon {
      display: inline-block;
      margin-right: 8px;
      width: 80px;
      height: 80px;
      line-height: 80px;
      border-radius: 50%;
      text-align: center;

      .u-icon {
        color: #fff;
      }
    }

    .yuan1 {
      background: #c7c7c7;
    }

    .yuan2 {
      background: #0068e3;
    }

    .yuan3 {
      background: #00c068;
    }

    .steps-line {
      width: 80px;
      height: 1px;
      border-top: 2px dashed #c7c7c7;
    }

    .steps-line2 {
      width: 80px;
      height: 1px;
      border-top: 2px solid #00c068;
    }

    .stepTitle {
      text-align: center;
      margin-top: 20px;
      width: 80px;
    }
  }
}
</style>
