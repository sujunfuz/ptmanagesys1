<script setup lang="tsx">
import { Form, FormSchema } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { PropType, reactive, watch, ref, computed, onMounted } from 'vue'
import { useValidator } from '@/hooks/web/useValidator'
import { useI18n } from '@/hooks/web/useI18n'
import { ElMessage, collapseEmits, ElSelect, ElOption } from 'element-plus'
import { getCompanyInfoApi } from '@/api/creditManagement/index'

const { t } = useI18n()

const { required } = useValidator()

const props = defineProps({
  currentRow: {
    type: Object as PropType<any>,
    default: () => null
  },
  openType: {
    type: String,
    default: ''
  }
})

const imageUrl = ref('')

const baseSchema = reactive<FormSchema[]>([
  {
    field: 'chargeRate',
    label: t('service.proportion'),
    colProps: {
      span: 24
    },
    component: 'Input',
    componentProps: {
      style: {
        width: '100%'
      },
      type: 'number',
      max: 99,
      min: 0,
      suffixIcon: <span>%</span>
    }
  }
])

const loading = ref(false)
const selectOptions = ref<any>([])
const remoteMethod = async (query: string) => {
  if (query) {
    loading.value = true
    const res = await getCompanyInfoApi({ companyName: query })
    loading.value = false
    selectOptions.value = res.data
  } else {
    selectOptions.value = []
  }
}
const formSchema = reactive<FormSchema[]>([
  {
    field: 'merchantNo',
    label: t('merchant.name'),
    // component: 'Input',
    colProps: {
      span: 12
    },
    componentProps: {
      style: {
        width: '100%'
      }
    },
    formItemProps: {
      slots: {
        default: (data) => {
          return (
            <ElSelect
              v-model={data.merchantNo}
              filterable
              remote
              reserve-keyword
              placeholder={t('project.input')}
              remote-show-suffix
              remoteMethod={remoteMethod}
              loading={loading.value}
            >
              {selectOptions.value.map((item, index) => (
                <ElOption key={index} label={item.companyName} value={item.merchantNo}></ElOption>
              ))}
            </ElSelect>
          )
        }
      }
    }
  },
  {
    field: 'chargeRate',
    label: t('service.proportion'),
    colProps: {
      span: 24
    },
    component: 'Input',
    componentProps: {
      style: {
        width: '100%'
      },
      type: 'number',
      max: 99,
      min: 1,
      suffixIcon: <span>%</span>
    }
  }
])

const rules = reactive({
  chargeRate: [required()],
  merchantNo: [required()]
})

const Allschema = computed(() => {
  return props.openType == 'addTop' ? formSchema : baseSchema
})

const { formRegister, formMethods } = useForm()
const { setValues, getFormData, getElFormExpose } = formMethods

const submit = async () => {
  const elForm = await getElFormExpose()
  const valid = await elForm?.validate().catch((err) => {
    console.log(err)
  })
  if (valid) {
    const formData = await getFormData()
    return formData
  }
}

// watch(
//   () => props.currentRow,
//   (currentRow) => {
//     if (!currentRow) return
//     setValues(currentRow)
//   },
//   {
//     deep: true,
//     immediate: true
//   }
// )

defineExpose({
  submit
})
</script>

<template>
  <Form
    :rules="rules"
    @register="formRegister"
    :model="currentRow"
    :schema="Allschema"
    class="baseClass"
  />
</template>

<style lang="less">
.baseClass {
  .el-upload {
    width: 150px;
    height: 150px;
    position: relative;
    overflow: hidden;
    cursor: pointer;
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    transition: var(--el-transition-duration-fast);
  }

  .el-upload:hover {
    border-color: var(--el-color-primary);
    .el-icon svg {
      color: var(--el-color-primary);
    }
  }

  .el-icon.avatar-uploader-icon {
    width: 178px;
    height: 178px;
    font-size: 28px;
    color: #8c939d;
    text-align: center;
  }
}
</style>
