<script setup lang="tsx">
import { Form, FormSchema, SelectOption } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { ref, reactive, PropType, watch } from 'vue'
import { useValidator } from '@/hooks/web/useValidator'
import { useI18n } from '@/hooks/web/useI18n'
import {
  ElButton,
  ElInput,
  ElMessage,
  ElSelect,
  ElOption,
  ElRadioGroup,
  ElRadio,
  ElInputNumber
} from 'element-plus'

const { required } = useValidator()
const { t } = useI18n()

const props = defineProps({
  currentRow: {
    type: Object as PropType<any>,
    default: () => null
  },
  recommendStatus: {
    type: Array,
    default: () => []
  },
  actionType: {
    type: String,
    default: ''
  },
  tabPosition: {
    type: String,
    default: ''
  },
  choiceTimeEnum: {
    type: Array,
    default: () => []
  },
  tabPositionEnum: {
    type: Array,
    default: () => []
  }
})

const radio1 = ref('1')
const radio1_1 = ref(1)
const radio1_2 = ref('DAY')
const radio1_3 = ref(1)

const radio2 = ref('1')
const radio2_1 = ref(1)

const formSchema = reactive<FormSchema[]>([
  {
    field: 'title',
    label: t('Recommendation.name'),
    component: 'Input',
    componentProps: {
      style: {
        width: '100%'
      },
      maxlength: 6,
      minlength: 2,
      showWordLimit: true
    }
  },
  {
    field: 'sort',
    label: t('Recommendation.name1') + t('Recommendation.sort'),
    component: 'InputNumber',
    componentProps: {
      min: 0,
      controlsPosition: 'right'
    },
    value: 0
  },
  {
    field: 'priority',
    label: t('Recommendation.rule'),
    formItemProps: {
      slots: {
        default: (row: any) => {
          return (
            <div>
              <span class="mr-5px">{t('Recommendation.sub1_1')}</span>
              <ElSelect style="width: 130px;" v-model={row.priority} placeholder=" ">
                {props.tabPositionEnum.map((item: any) => {
                  return <ElOption label={item.label} value={item.value} />
                })}
              </ElSelect>
              <span class="ml-5px">{t('Recommendation.sort')}</span>
            </div>
          )
        }
      }
    }
  },
  {
    field: 'choiceRange',
    label: t('Recommendation.range'),
    value: '0',
    formItemProps: {
      slots: {
        default: (row: any) => {
          return (
            <>
              <ElRadioGroup class="mt--4px" v-model={radio1.value} onChange={getValidRes1}>
                <div class="w-100%">
                  <ElRadio label="1" size="large">
                    {t('Recommendation.sub2_1')}
                  </ElRadio>
                </div>
                <div>
                  <ElRadio label="2" size="large">
                    <ElInputNumber
                      v-model={radio1_1.value}
                      style="width: 110px"
                      controls-position="right"
                      min={1}
                    />
                    <ElSelect
                      style="width: 100px;margin-left: 5px;margin-right: 5px"
                      v-model={radio1_2.value}
                    >
                      {props.choiceTimeEnum.map((item: any) => {
                        return <ElOption label={item.label} value={item.value} />
                      })}
                    </ElSelect>
                    {t('Recommendation.sub2_2')}
                    <ElInputNumber
                      v-model={radio1_3.value}
                      style="width: 110px;margin-left: 5px;margin-right: 5px"
                      controls-position="right"
                    />
                    {t('Recommendation.sub2_3')}
                  </ElRadio>
                </div>
              </ElRadioGroup>
            </>
          )
        }
      }
    }
  },
  {
    field: 'shopLimit',
    label: t('Recommendation.restrict'),
    value: '0',
    formItemProps: {
      slots: {
        default: (row: any) => {
          if (props.tabPosition != 'RECOMMEND_TYPE_FACTORY') {
            return (
              <>
                <ElRadioGroup class="mt--4px" v-model={radio2.value} onChange={getValidRes2}>
                  <div class="w-100%">
                    <ElRadio label="1" size="large">
                      {t('Recommendation.sub2_1')}
                    </ElRadio>
                  </div>
                  <div>
                    <ElRadio label="2" size="large">
                      {t('Recommendation.sub3_1')}
                      <ElInputNumber
                        onChange={getValidRes2}
                        style="width: 80px;margin-left: 5px;margin-right: 5px"
                        controls-position="right"
                        v-model={radio2_1.value}
                      />
                      {t('Recommendation.sub2_3')}
                    </ElRadio>
                  </div>
                </ElRadioGroup>
              </>
            )
          } else {
            return (
              <>
                <ElRadioGroup class="mt--4px" v-model={radio2.value} onChange={getValidRes2}>
                  <div class="w-100%">
                    <ElRadio label="1" size="large">
                      {t('Recommendation.sub2_1')}
                    </ElRadio>
                  </div>
                </ElRadioGroup>
              </>
            )
          }
        }
      }
    }
  }
])

const rules = reactive({
  title: [required()],
  sort: [required()],
  priority: [required()],
  choiceRange: [required()],
  shopLimit: [required()]
})

const { formRegister, formMethods } = useForm()
const { setValues, getFormData, getElFormExpose } = formMethods

const validRadio = () => {
  if (radio1.value == '1') {
    setValues({
      choiceRange: '0'
    })
  }
  if (radio1.value == '2') {
    if (radio1_1.value && radio1_2.value && radio1_3.value) {
      setValues({
        choiceRange: radio1_1.value + ',' + radio1_2.value + ',' + radio1_3.value
      })
    } else {
      setValues({
        choiceRange: '0'
      })
    }
  }

  if (radio2.value == '1') {
    setValues({
      shopLimit: '0'
    })
  }
  if (radio2.value == '2') {
    setValues({
      shopLimit: radio2_1.value
    })
  }
}

const getValidRes1 = async () => {
  console.log(radio1.value)
  await validRadio()
  console.log(getFormData())
  const elForm = await getElFormExpose()
  // const valid = await elForm?.validateField['choiceRange']
}

const getValidRes2 = async () => {
  await validRadio()
  const elForm = await getElFormExpose()
  const valid = await elForm?.validateField['shopLimit']
}

const submit = async () => {
  await validRadio()
  const elForm = await getElFormExpose()
  const valid = await elForm?.validate().catch((err) => {
    console.log(err)
  })
  if (valid) {
    const formData = await getFormData()
    return formData
  }
}

const changeDanwei = (data) => {
  for (let item in props.choiceTimeEnum) {
    if (props.choiceTimeEnum[item].value == data) return props.choiceTimeEnum[item].label
  }
}

watch(
  () => props.currentRow,
  (currentRow) => {
    if (!currentRow) return
    setValues(currentRow)
    if (currentRow.choiceRange.split(',').length != 3) {
      radio1.value = '1'
    } else {
      radio1.value = '2'
      radio1_1.value = currentRow.choiceRange.split(',')[0]
      radio1_2.value = currentRow.choiceRange.split(',')[1]
      radio1_3.value = currentRow.choiceRange.split(',')[2]
    }

    if (currentRow.shopLimit == '0') {
      radio2.value = '1'
    } else {
      radio2.value = '2'
      radio2_1.value = currentRow.shopLimit
    }
  },
  {
    deep: true,
    immediate: true
  }
)

defineExpose({
  submit,
  formMethods
})
</script>

<template>
  <div v-if="actionType == 'view'" class="mb-10px">
    <div class="flex-c color-#7A7A7A font-size-14px">
      <div class="text-right w-120px min-w-120px">{{ t('Recommendation.name') }}:</div>
      <div class="ml-15px color-colorBlack">{{ currentRow.title || '-' }}</div>
    </div>
    <div class="flex-c color-#7A7A7A mt-20px font-size-14px">
      <div class="text-right w-120px min-w-120px"
        >{{ t('Recommendation.name1') + t('Recommendation.sort') }}:</div
      >
      <div class="ml-15px color-colorBlack">{{ currentRow.sort || '-' }}</div>
    </div>
    <div class="flex-c color-#7A7A7A mt-20px font-size-14px">
      <div class="text-right w-120px min-w-120px">{{ t('Recommendation.rule') }}:</div>
      <div class="ml-15px color-colorBlack">{{
        t('Recommendation.sub1_1') + (currentRow.priorityStr || '-') + t('Recommendation.sub1_2')
      }}</div>
    </div>
    <div class="flex-c color-#7A7A7A mt-20px font-size-14px">
      <div class="text-right w-120px min-w-120px">{{ t('Recommendation.range') }}:</div>
      <div class="ml-15px color-colorBlack">{{
        currentRow.choiceRange.length == 0
          ? '-'
          : (currentRow.choiceRange.split(',')[0] || '-') +
            (changeDanwei(currentRow.choiceRange.split(',')[1]) || '-') +
            t('Recommendation.sub2_2') +
            (currentRow.choiceRange.split(',')[2] || '-') +
            t('Recommendation.sub2_3')
      }}</div>
    </div>
    <div class="flex-c color-#7A7A7A mt-20px font-size-14px">
      <div class="text-right w-120px min-w-120px">{{ t('Recommendation.restrict') }}:</div>
      <div class="ml-15px color-colorBlack">{{
        currentRow.shopLimit == 0
          ? '-'
          : t('Recommendation.sub3_1') + (currentRow.shopLimit || '-') + t('Recommendation.sub2_3')
      }}</div>
    </div>
  </div>
  <div v-else>
    <Form
      :rules="rules"
      :model="currentRow"
      @register="formRegister"
      :schema="formSchema"
      :isCol="false"
    />
  </div>
</template>
