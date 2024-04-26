<script setup lang="tsx">
import { Form, FormSchema, SelectOption } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { ref, reactive, PropType, watch, onMounted } from 'vue'
import { useValidator } from '@/hooks/web/useValidator'
import { useI18n } from '@/hooks/web/useI18n'
import { ElButton, ElInput, ElMessage } from 'element-plus'
import { Icon } from '@/components/Icon'
import UploadImage from '@/components/UploadImage/UploadImage.vue'
import { isDepsOptimizerEnabled } from 'vite'

const { required, validNumberPointer1, validNumber, validNoChinese } = useValidator()
const { t } = useI18n()

const props = defineProps({
  currentRow: {
    type: Object as PropType<any>,
    default: () => null
  },
  channelType: {
    type: Object as PropType<any>,
    default: () => null
  },
  status: {
    type: Object as PropType<any>,
    default: () => null
  },
  payType: {
    type: Object as PropType<any>,
    default: () => null
  },
  channelName: {
    type: Array as PropType<any>,
    default: () => [{ label: '77', value: '9999' }]
  },
  actionType: {
    type: Object as PropType<any>,
    default: () => null
  },
  channelBelong: {
    type: Object as PropType<any>,
    default: () => null
  },
  currencyEnum: {
    type: Object as PropType<any>,
    default: () => null
  },
  dataArr1: {
    type: Array as PropType<any>,
    default: () => [{ key: '', value: '' }]
  }
})

const dataArr = ref([{ key: '', value: '' }])

const channelIcon = ref<any>([])

onMounted(() => {
  dataArr.value = props.dataArr1
})
const formSchema1 = reactive<FormSchema[]>([
  {
    field: '',
    formItemProps: {
      slots: {
        default: () => {
          return (
            <>
              <div class="color-#3d3f41 font-size-15px h-14px mt--7px">{t('Freight.info')}</div>
            </>
          )
        }
      }
    }
  },
  {
    field: 'channelName',
    label: t('paymentChannel.code'),
    component: 'Select',
    colProps: {
      span: 17
    },
    componentProps: {
      disabled: true,
      options: props.channelName
    },
    formItemProps: {
      labelWidth: '200px'
    }
  },
  {
    field: 'channelCode',
    label: t('common.b21'),
    component: 'Input',
    colProps: {
      span: 17
    },
    componentProps: {
      disabled: true
    },
    formItemProps: {
      labelWidth: '200px'
    }
  },
  {
    field: 'appid',
    label: t('paymentChannel.sub4'),
    component: 'Input',
    colProps: {
      span: 17
    },
    componentProps: {
      style: {
        width: '80%'
      }
    },
    formItemProps: {
      labelWidth: '200px'
    }
  },
  {
    field: 'mid',
    label: t('paymentChannel.sub5'),
    component: 'Input',
    colProps: {
      span: 17
    },
    componentProps: {
      style: {
        width: '80%'
      }
    },
    formItemProps: {
      labelWidth: '200px'
    }
  },
  {
    field: 'secretKey',
    label: t('paymentChannel.sub6'),
    component: 'Input',
    colProps: {
      span: 17
    },
    componentProps: {
      showPassword: true,
      style: {
        width: '80%'
      }
    },
    formItemProps: {
      labelWidth: '200px'
    }
  },
  {
    field: 'publicKey',
    label: t('paymentChannel.sub12'),
    component: 'Input',
    colProps: {
      span: 17
    },
    componentProps: {
      showPassword: true,
      style: {
        width: '80%'
      }
    },
    formItemProps: {
      labelWidth: '200px'
    }
  },
  {
    field: 'requestUrl',
    label: t('paymentChannel.sub7'),
    component: 'Input',
    colProps: {
      span: 17
    },
    componentProps: {
      style: {
        width: '80%'
      }
    },
    formItemProps: {
      labelWidth: '200px'
    }
  },
  {
    field: 'asynNotifyUrl',
    label: t('paymentChannel.sub8'),
    component: 'Input',
    colProps: {
      span: 17
    },
    componentProps: {
      style: {
        width: '80%'
      }
    },
    formItemProps: {
      labelWidth: '200px'
    }
  },
  {
    field: 'syncReturnUrl',
    label: t('paymentChannel.sub9'),
    component: 'Input',
    colProps: {
      span: 17
    },
    componentProps: {
      style: {
        width: '80%'
      }
    },
    formItemProps: {
      labelWidth: '200px'
    }
  },
  {
    field: 'data',
    label: t('paymentChannel.sub11'),
    colProps: {
      span: 17
    },
    componentProps: {
      style: {
        width: '80%'
      }
    },
    formItemProps: {
      labelWidth: '200px',
      slots: {
        default: () => {
          return (
            <div>
              <div>
                {dataArr.value.map((item, index) => {
                  return (
                    <div class="flex-c mb-10px">
                      <ElInput modelValue={item.key} v-model={item.key} />
                      <ElInput modelValue={item.value} v-model={item.value} class="ml-5px" />
                      <div onClick={() => clickTrash(index)}>
                        <Icon icon="ep:delete" class="colorMain ml-5px cursor-pointer" />
                      </div>
                    </div>
                  )
                })}
              </div>

              <ElButton type="primary" onClick={() => addArr()} class="w-100% mb-5px">
                {t('project.add')}
              </ElButton>
            </div>
          )
        }
      }
    }
  }
])

const formSchema = reactive<FormSchema[]>([
  {
    field: '',
    formItemProps: {
      slots: {
        default: () => {
          return (
            <>
              <div class="color-#3d3f41 font-size-15px h-14px mt--7px">{t('Freight.info')}</div>
            </>
          )
        }
      }
    }
  },
  {
    field: 'channelName',
    label: t('paymentChannel.code'),
    component: 'Input',
    colProps: {
      span: 17
    },
    formItemProps: {
      labelWidth: '150px'
    }
  },
  {
    field: 'channelCode',
    label: t('common.b21'),
    component: 'Input',
    remove: props.actionType == 'add',
    colProps: {
      span: 17
    },
    componentProps: {
      disabled: props.actionType == 'edit'
    },
    formItemProps: {
      labelWidth: '150px'
    }
  },
  {
    field: 'channelIcon',
    label: t('paymentChannel.image'),
    colProps: {
      span: 24
    },
    formItemProps: {
      labelWidth: '150px',
      slots: {
        default: (data) => {
          return (
            <>
              <div class="w-100%">
                <UploadImage
                  limit={1}
                  v-model={channelIcon.value}
                  onUpdateImgUrl={(val) => {
                    data.channelIcon = val
                  }}
                ></UploadImage>
                <div class="color-#9b9d9e">{t('common.a40')}</div>
              </div>
            </>
          )
        }
      }
    }
  },
  {
    field: 'channelBelong',
    label: t('common.b22'),
    component: 'CheckboxGroup',
    colProps: {
      span: 17
    },
    componentProps: {
      options: props.channelBelong
    },
    formItemProps: {
      labelWidth: '150px'
    }
  },
  {
    field: 'status',
    label: t('paymentChannel.sub3'),
    component: 'RadioGroup',
    value: 'NORMAL',
    colProps: {
      span: 17
    },
    componentProps: {
      options: props.status
    },
    formItemProps: {
      labelWidth: '150px'
    }
  },
  {
    field: '',
    formItemProps: {
      slots: {
        default: () => {
          return (
            <>
              <div class="color-#3d3f41 font-size-15px h-20px mt--5px">{t('common.b20')}</div>
            </>
          )
        }
      }
    }
  },
  {
    field: 'channelType',
    label: t('paymentChannel.type'),
    component: 'Select',
    colProps: {
      span: 17
    },
    formItemProps: {
      labelWidth: '150px'
    },
    componentProps: {
      options: props.channelType
    }
  },
  {
    field: 'currencyCode',
    label: t('paymentChannel.sub1'),
    component: 'Select',
    value: 'CNY',
    colProps: {
      span: 17
    },
    componentProps: {
      options: props.currencyEnum,
      filterable: true,
      style: {
        width: '80%'
      }
    },
    formItemProps: {
      labelWidth: '150px'
    }
  },
  {
    field: 'costRate',
    label: t('paymentChannel.sub10'),
    component: 'Input',
    colProps: {
      span: 17
    },
    componentProps: {
      slots: {
        append: () => <div>%</div>
      },
      style: {
        width: '80%'
      }
    },
    formItemProps: {
      labelWidth: '150px'
    }
  },
  {
    field: 'sort',
    label: t('paymentChannel.sort'),
    component: 'Input',
    colProps: {
      span: 17
    },
    componentProps: {
      style: {
        width: '80%'
      }
    },
    formItemProps: {
      labelWidth: '150px'
    }
  },
  {
    field: 'remark',
    label: t('paymentChannel.remark'),
    component: 'Input',
    componentProps: {
      style: {
        width: '80%'
      },
      type: 'textarea',
      rows: 4,
      maxlength: 200,
      showWordLimit: true
    },
    formItemProps: {
      labelWidth: '150px'
    }
  }
])

const checkCostRate = (rule: any, value: any, callback: any) => {
  if (parseFloat(value) > 0 && parseFloat(value) < 100) {
    callback()
  } else {
    callback(new Error(t('common.b17')))
  }
}

const rules = reactive({
  channelName: [required()],
  channelType: [required()],
  channelBelong: [required()],
  payType: [required()],
  appid: [required(), validNoChinese()],
  mid: [validNoChinese()],
  secretKey: [required(), validNoChinese()],
  publicKey: [validNoChinese()],
  requestUrl: [required(), validNoChinese()],
  asynNotifyUrl: [validNoChinese()],
  syncReturnUrl: [validNoChinese()],
  costRate: [required(), validNumberPointer1(), { validator: checkCostRate, trigger: 'blur' }],
  currencyCode: [required()],
  data: [validNoChinese()],
  sort: [required(), validNumber()],
  status: [required()],
  channelIcon: [required()]
})

const { formRegister, formMethods } = useForm()
const { setValues, getFormData, getElFormExpose } = formMethods

const submit = async () => {
  const elForm = await getElFormExpose()
  const valid = await elForm?.validate().catch((err) => {
    console.log(err)
  })

  let flag = true
  if (props.actionType == 'ApiSet') {
    for (var item in dataArr.value) {
      if (!dataArr.value[item].key && dataArr.value[item].value) {
        flag = false
        break
      } else if (dataArr.value[item].key && !dataArr.value[item].value) {
        flag = false
        break
      }
    }
  }

  if (valid && flag) {
    const formData = await getFormData()
    formData.data = dataArr.value
    return formData
  } else {
    ElMessage.warning(t('common.b28'))
  }
}

watch(
  () => props.currentRow,
  (currentRow) => {
    if (!currentRow) return
    channelIcon.value = [{ url: currentRow.channelIcon }]
  },
  {
    deep: true,
    immediate: true
  }
)

const clickTrash = (index: any) => {
  if (dataArr.value.length == 1) {
    dataArr.value = [{ key: '', value: '' }]
  } else {
    dataArr.value.splice(index, 1)
  }
}

const addArr = () => {
  dataArr.value.push({ key: '', value: '' })
}

defineExpose({
  submit,
  formMethods
})
</script>

<template>
  <Form
    :rules="rules"
    :model="currentRow"
    @register="formRegister"
    :schema="actionType == 'ApiSet' ? formSchema1 : formSchema"
    :isCol="false"
  />
</template>
