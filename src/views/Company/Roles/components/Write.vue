<script setup lang="tsx">
import { Form, FormSchema } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { reactive, watch, ref, onMounted, nextTick } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import { useValidator } from '@/hooks/web/useValidator'
import SelectMenu from './SelectMenu.vue'
import { differenceWith, isEqual, cloneDeep } from 'lodash-es'

const { t } = useI18n()

const props = defineProps({
  currentRow: {
    type: Object as any,
    default: () => {
      return {
        status: -1
      }
    }
  },
  allEnum: {
    type: Object as any,
    default: () => {}
  },
  actionType: {
    type: String,
    default: () => ''
  },
  menuTreeObj: {
    type: Object as any,
    default: () => {}
  },
  aMenuTreeEnum: {
    type: Array as any,
    default: () => []
  }
})

const emit = defineEmits(['changeActionIndex'])
const { required, validD, lengthRange } = useValidator()

const menuTreeEnum = ref()
const aMenuTreeObj = ref()
//onMounted
onMounted(() => {
  init()
})
const setDiabled = (obj) => {
  obj.disabled = true
  if (obj.children && obj.children.length > 0) {
    for (const a of obj.children) {
      setDiabled(a)
    }
  }
}
const init = async () => {
  let tempArr: any = cloneDeep(props.aMenuTreeEnum)
  if (props.actionType == 'view') {
    for (const a of tempArr) {
      setDiabled(a)
    }
  }
  menuTreeEnum.value = tempArr
  aMenuTreeObj.value = cloneDeep(props.menuTreeObj)
  await useForm1.formMethods.setValues(props.currentRow)
  await useForm2.formMethods.setValues(props.currentRow)
}
//记录目录的选择
let allCategoryId: any = []
const updateAllCategory = (id, val) => {
  if (val) {
    allCategoryId.push(id)
  } else {
    let tempArr = differenceWith(allCategoryId, [id], isEqual)
    allCategoryId = tempArr
  }
}
const formSchema2 = reactive<FormSchema[]>([
  {
    field: 'menuIds',
    label: t('role.menuConfigure'),
    colProps: {
      span: 24
    },
    formItemProps: {
      rules: [required()],
      slots: {
        default: (data) => {
          return (
            <div class="w-490px border-( 1px #dcdfe6 solid rd-4px) flex-c flex-wrap pa-20px min-h-255px box-border">
              {data.menuIds
                ? menuTreeEnum.value.map((item, index) => {
                    return (
                      <>
                        <SelectMenu
                          class="ml-30px selectBlock"
                          onUpdate:selectData={(val) => {
                            data.menuIds[index] = val
                          }}
                          actionType={props.actionType}
                          selectData={data.menuIds[index]}
                          options={item}
                          key={item.id}
                          menuTreeObj={
                            aMenuTreeObj.value[item.id] ? aMenuTreeObj.value[item.id] : {}
                          }
                          onUpdateCategory={(id, val) => {
                            updateAllCategory(id, val)
                          }}
                        ></SelectMenu>
                      </>
                    )
                  })
                : ''}
            </div>
          )
        }
      }
    }
  }
])

const formSchema = reactive<FormSchema[]>([
  {
    field: 'roleName',
    label: t('companyRole.name'),
    colProps: {
      span: 24
    },
    component: 'Input',
    componentProps: {
      style: {
        width: '500px'
      }
    },
    formItemProps: {
      rules: [required()]
    }
  },
  {
    field: 'unStatus',
    label: t('companyRole.status'),
    colProps: {
      span: 24
    },
    value: 'STATUS_0_0_0_0',
    component: 'Select',
    componentProps: {
      style: {
        width: '500px'
      },
      options: props.allEnum.status
    },
    formItemProps: {
      rules: [required()]
    }
  },
  {
    field: 'remark',
    label: t('companyRole.remark'),
    colProps: {
      span: 24
    },
    component: 'Input',
    // formItemProps: {
    //   rules: [required()]
    // },
    componentProps: {
      style: {
        width: '500px'
      },
      type: 'textarea',
      maxlength: 50,
      showWordLimit: true
    }
  }
])

const useForm1 = useForm()
const useForm2 = useForm()

// watch(
//   () => props.currentRow,
//   async (currentRow) => {
//     if (!currentRow) return
//     await useForm1.formMethods.setValues(currentRow)
//     await useForm2.formMethods.setValues(currentRow)
//   },
//   {
//     deep: true,
//     immediate: true
//   }
// )

//当前位置
const activeIndex = ref(1)
//步骤条步数
const stepList = [
  {
    stepIndex: 1,
    title: t('companyRole.step1')
  },
  {
    stepIndex: 2,
    title: t('companyRole.step2')
  }
]
let firstFlag = true
//点击下一步
const nextStep = async () => {
  if (props.actionType == 'view') {
    emit('changeActionIndex', 1)
    activeIndex.value += 1
    return
  }
  const elForm = await useForm1.formMethods.getElFormExpose()
  const valid = await elForm?.validate().catch((err) => {
    console.log(err)
  })
  if (valid) {
    if (activeIndex.value >= 2) {
      return
    } else {
      activeIndex.value += 1
      emit('changeActionIndex', 1)
    }

    if (activeIndex.value == 2 && props.actionType == 'add' && firstFlag) {
      firstFlag = !firstFlag
      nextTick(() => {
        let len = menuTreeEnum.value.length
        let tempArr: Array<any> = []
        for (let i = 0; i < len; i++) {
          tempArr[i] = []
        }
        useForm2.formMethods.setValues({
          menuIds: tempArr
        })
      })
    }
  }
}
//点击上一步
const lastStep = async () => {
  if (activeIndex.value <= 1) {
    return
  } else {
    activeIndex.value -= 1
  }
}

const submit = async () => {
  const elForm = await useForm1.formMethods.getElFormExpose()
  const valid = await elForm?.validate().catch((err) => {
    console.log(err)
  })
  const elForm1 = await useForm2.formMethods.getElFormExpose()
  const valid1 = await elForm1?.validate().catch((err) => {
    console.log(err)
  })
  if (valid && valid1) {
    let formData = await useForm1.formMethods.getFormData()
    let formData1 = await useForm2.formMethods.getFormData()
    formData = cloneDeep(formData)
    formData1 = cloneDeep(formData1)
    let tempObj = cloneDeep(formData1)
    let menuIds: any = []
    tempObj.menuIds.forEach((a) => {
      if (a.length > 0) {
        a.forEach((b) => {
          if (b[b.length - 1].indexOf('-all') == -1) {
            menuIds.push(b[b.length - 1])
          }
        })
      }
    })
    allCategoryId.forEach((val) => {
      menuIds.push(val[0])
    })
    formData1.menuIds = menuIds.join(',')
    return { ...formData, menuIds: formData1.menuIds, userType: 'MERCHANT' }
  }
}

defineExpose({ nextStep, lastStep, submit })
</script>

<template>
  <div class="overall">
    <!-- 步骤条盒子 -->
    <div class="steps-box m-auto">
      <!-- 步骤条 -->
      <div
        class="Article-steps text-center"
        :class="stepList.length <= activeIndex ? 'step-over' : ''"
      >
        <!-- 步骤条背景进度条 -->
        <div class="line">
          <span
            class="plan"
            :style="`width:${
              activeIndex * (100 / (stepList.length - 1)) - 100 / (stepList.length - 1) / 2
            }%`"
          ></span>
        </div>
        <!-- 每步部分 -->
        <span
          class="step"
          v-for="(i, index) in stepList"
          :key="index"
          :class="activeIndex == i.stepIndex || i.stepIndex <= activeIndex ? 'step-active' : ''"
        >
          <span class="step-num">
            <span class="num">{{ i.stepIndex }}</span>
          </span>
          <p class="title">{{ i.title }}</p>
        </span>
      </div>
      <!-- 步骤条对应内容 -->
    </div>
    <div class="Article-content">
      <div
        v-show="activeIndex == 1"
        class="mt-20px text-center m-auto w-600px flex justify-self-center"
      >
        <Form
          @register="useForm1.formRegister"
          :schema="formSchema"
          :isCol="false"
          v-show="actionType != 'view'"
        />
        <div v-if="actionType == 'view' && activeIndex == 1">
          <div class="flex-c mt-20px color-#7A7A7A font-size-14px">
            <div class="text-right w-120px min-w-120px">{{ t('companyRole.name') }}:</div>
            <div class="ml-15px color-colorBlack">{{ currentRow.roleName || '-' }}</div>
          </div>
          <div class="flex-c mt-20px color-#7A7A7A font-size-14px">
            <div class="text-right w-120px min-w-120px">{{ t('companyRole.status') }}:</div>
            <div class="ml-15px color-colorBlack">{{ currentRow.unStatusStr || '-' }}</div>
          </div>
          <div class="flex-c mt-20px color-#7A7A7A font-size-14px">
            <div class="text-right w-120px min-w-120px">{{ t('companyRole.remark') }}:</div>
            <div class="ml-15px color-colorBlack">{{ currentRow.remark || '-' }}</div>
          </div>
        </div>
      </div>
      <div
        v-show="activeIndex == 2"
        class="mt-20px text-center m-auto w-600px flex justify-self-center"
      >
        <Form @register="useForm2.formRegister" :schema="formSchema2" :isCol="false" />
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
/deep/.selectBlock > div > span {
  width: 60px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
  text-overflow: ellipsis;
}

.steps-box {
  user-select: none;
  width: 500px;
  position: relative;
  // <!-- 步骤条背景进度条 -->
  .line {
    display: block;
    margin: 0 auto;
    position: absolute;
    top: 20px;
    left: 5%;
    background: #f5f5f5;
    width: 90%;
    height: 2px;
    overflow: hidden;
    .plan {
      position: absolute;
      top: 0;
      left: 0;
      height: 2px;
      transition: 0.5s;
      background: #8ab4f3;
    }
  }
  .Article-steps {
    display: flex;
    justify-content: space-between;
    .step {
      z-index: 300;
      .title {
        font-size: 16px;
        color: #a9a9a9;
        margin-top: 5px;
      }
      .step-num {
        width: 40px;
        height: 40px;
        display: inline-block;
        line-height: 40px;
        background: #c0c0c0;
        border-radius: 50%;
        // clip-path: polygon(50% 100%, 100% 100%, 0 100%);
        color: white;
        font-weight: bold;
        // transition: 0.5s;
        .num {
          // transition: 0.5s;
          display: inline-block;
        }
      }
    }
  }

  //当前所在位置样式
  .step-active {
    .step-num {
      background: #2d7df5 !important;
      transform: rotate(90deg);
      .num {
        transform: rotate(-90deg);
      }
    }
    .title {
      color: #2d7df5 !important;
    }
  }

  //全部完成样式
  .step-over {
    // .plan {
    //   background: #91f062 !important;
    // }
    // .step-num {
    //   background: #67c23a !important;
    // }
    // .title {
    //   color: #67c23a !important;
    // }
  }
  //对应内容
  .Article-content {
    padding: 20px;
    .btn {
      width: 150px;
      display: block;
      margin: 0 auto;
      margin-bottom: 10px;
      background: #2d7df5;
      color: white;
      padding: 10px;
      border-radius: 5px;
      cursor: pointer;
    }
    .content {
      padding: 20px;
    }
  }
}
</style>
