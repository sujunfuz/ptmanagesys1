<template>
  <div class="m-steps-area m-auto">
    <div class="m-steps">
      <div
        :class="[
          'm-steps-item',
          {
            finished: current > n,
            process: current === n && n !== totalSteps,
            'last-process': current === totalSteps && n === totalSteps,
            'middle-wait': current < n && n !== totalSteps,
            'last-wait': current < n && n === totalSteps
          }
        ]"
        v-for="n in totalSteps"
        :key="n"
        @click="onChange(n)"
      >
        <!-- @click="onChange(n)" -->
        <div class="m-steps-icon">
          <!-- v-if="current <= n" -->
          <span class="u-icon">{{ n }}</span>
          <!-- <span class="u-icon" v-else>✓</span> -->
        </div>

        <div class="m-steps-content">
          <div class="u-steps-title">{{ stepsLabel[n - 1] || 'S ' + n }}</div>
          <div class="u-steps-description">{{ stepsDesc[n - 1] || 'Desc ' + n }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="tsx">
import { ref } from 'vue'
import { propTypes } from '@/utils/propTypes'

const props = defineProps({
  stepsLabel: {
    type: Array,
    default: () => []
  },
  stepsDesc: {
    type: Array,
    default: () => []
  },
  totalSteps: propTypes.number.def(3),
  currentStep: propTypes.number.def(1)
})

// const current = ref(props.currentStep > props.totalSteps ? 1 : props.currentStep)\
const current = 5

const emit = defineEmits(['change'])

const onChange = (index) => {
  // if (current.value !== index) {
  //   current.value = index
  emit('change', index)
  // }
}
</script>
<style lang="less" scoped>
.m-steps-area {
  width: 1000px;
  .m-steps {
    padding: 30px 0;
    display: flex;
    .m-steps-item {
      display: inline-block;
      flex: 1; // 弹性盒模型对象的子元素都有相同的长度，且忽略它们内部的内容
      overflow: hidden;
      font-size: 16px;
      line-height: 32px;
      .m-steps-icon {
        display: inline-block;
        margin-right: 8px;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        text-align: center;
      }
      .m-steps-content {
        display: inline-block;
        vertical-align: top;
        padding-right: 16px;
        .u-steps-title {
          position: relative;
          display: inline-block;
          padding-right: 16px;
        }
        .u-steps-description {
          font-size: 14px;
          max-width: 140px;
        }
      }
    }
    .finished {
      margin-right: 16px;
      cursor: pointer;
      &:hover {
        .m-steps-content {
          .u-steps-title {
            color: #1890ff;
          }
          .u-steps-description {
            color: #1890ff;
          }
        }
      }
      .m-steps-icon {
        background: #fff;
        border: 1px solid rgba(0, 0, 0, 0.25);
        border-color: #1890ff;
        .u-icon {
          color: #1890ff;
        }
      }
      .m-steps-content {
        color: rgba(0, 0, 0, 0.65);
        .u-steps-title {
          color: rgba(0, 0, 0, 0.65);
          &:after {
            background: #1890ff;
            position: absolute;
            top: 16px;
            left: 100%;
            display: block;
            width: 9999px;
            height: 1px;
            content: '';
          }
        }
        .u-steps-description {
          color: rgba(0, 0, 0, 0.45);
        }
      }
    }
    .process {
      margin-right: 16px;
      .m-steps-icon {
        background: #1890ff;
        border: 1px solid rgba(0, 0, 0, 0.25);
        border-color: #1890ff;
        .u-icon {
          color: #fff;
        }
      }
      .m-steps-content {
        color: rgba(0, 0, 0, 0.65);
        .u-steps-title {
          font-weight: 600;
          color: rgba(0, 0, 0, 0.85);
          &:after {
            background: #e8e8e8;
            position: absolute;
            top: 16px;
            left: 100%;
            display: block;
            width: 9999px;
            height: 1px;
            content: '';
          }
        }
        .u-steps-description {
          color: rgba(0, 0, 0, 0.65);
        }
      }
    }
    .last-process {
      margin-right: 0;
      cursor: pointer;
      &:hover {
        .m-steps-content {
          .u-steps-title {
            color: #1890ff;
          }
          .u-steps-description {
            color: #1890ff;
          }
        }
      }
      .m-steps-icon {
        // background: #1890ff;
        border: 1px solid rgba(0, 0, 0, 0.25);
        border-color: #1890ff;
        .u-icon {
          // color: #fff;
          color: #1890ff;
        }
      }
      .m-steps-content {
        color: rgba(0, 0, 0, 0.65);
        .u-steps-title {
          // font-weight: 600;
          color: rgba(0, 0, 0, 0.65);
        }
        .u-steps-description {
          color: rgba(0, 0, 0, 0.65);
        }
      }
    }
    .middle-wait {
      margin-right: 16px;
      cursor: pointer;
      &:hover {
        .m-steps-icon {
          border: 1px solid #1890ff;
          .u-icon {
            color: #1890ff;
          }
        }
        .m-steps-content {
          .u-steps-title {
            color: #1890ff;
          }
          .u-steps-description {
            color: #1890ff;
          }
        }
      }
      .m-steps-icon {
        background: #fff;
        border: 1px solid rgba(0, 0, 0, 0.25);
        .u-icon {
          color: rgba(0, 0, 0, 0.25);
        }
      }
      .m-steps-content {
        color: rgba(0, 0, 0, 0.65);
        .u-steps-title {
          color: rgba(0, 0, 0, 0.45);
          &:after {
            background: #e8e8e8;
            position: absolute;
            top: 16px;
            left: 100%;
            display: block;
            width: 9999px;
            height: 1px;
            content: '';
          }
        }
        .u-steps-description {
          color: rgba(0, 0, 0, 0.45);
        }
      }
    }
    .last-wait {
      margin-right: 0;
      cursor: pointer;
      &:hover {
        .m-steps-icon {
          border: 1px solid #1890ff;
          .u-icon {
            color: #1890ff;
          }
        }
        .m-steps-content {
          .u-steps-title {
            color: #1890ff;
          }
          .u-steps-description {
            color: #1890ff;
          }
        }
      }
      .m-steps-icon {
        background: #fff;
        border: 1px solid rgba(0, 0, 0, 0.25);
        .u-icon {
          color: rgba(0, 0, 0, 0.25);
        }
      }
      .m-steps-content {
        color: rgba(0, 0, 0, 0.65);
        .u-steps-title {
          color: rgba(0, 0, 0, 0.45);
        }
        .u-steps-description {
          color: rgba(0, 0, 0, 0.45);
        }
      }
    }
  }
}
</style>
