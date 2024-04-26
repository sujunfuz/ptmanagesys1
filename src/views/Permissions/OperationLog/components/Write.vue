<script setup lang="tsx">
import { Form, FormSchema } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { PropType, reactive, watch } from 'vue'
import { DepartmentUserItem } from '@/api/department/types'
import { useI18n } from '@/hooks/web/useI18n'

const { t } = useI18n()

const props = defineProps({
  currentRow: {
    type: Object as PropType<DepartmentUserItem>,
    default: () => {
      return {
        status: -1
      }
    }
  }
})

const formSchema = reactive<FormSchema[]>([
  {
    field: 'operation',
    label: t('operationLog.operation'),
    component: 'Input',
    componentProps: {
      style: {
        width: '100%'
      },
      readonly: true
    }
  },
  {
    field: 'ip',
    label: t('operationLog.ip'),
    component: 'Input',
    componentProps: {
      style: {
        width: '100%'
      },
      readonly: true
    }
  },
  {
    field: 'requestMethod',
    label: t('operationLog.requestMethod'),
    component: 'Input',
    componentProps: {
      readonly: true
    }
  },
  {
    field: 'operatorID',
    label: t('operationLog.operatorID'),
    component: 'Input',
    componentProps: {
      readonly: true
    }
  },
  {
    field: 'errReason',
    label: t('operationLog.errReason'),
    component: 'Input',
    remove: props.currentRow.status == 1 ? true : false,
    componentProps: {
      readonly: true,
      type: 'textarea',
      rows: 6
    }
  },
  {
    field: 'requestParams',
    label: t('operationLog.requestParams'),
    component: 'Input',
    componentProps: {
      readonly: true,
      type: 'textarea',
      rows: 6
    },
    // formItemProps: {
    //   slots: {
    //     default: (formData) => {
    //       return (
    //         <div class="w-[100%] flex">
    //           <ElInput v-model={formData.code} placeholder={t('login.codePlaceholder')} />
    //         </div>
    //       )
    //     }
    //   }
    // }
    formItemProps: {
      slots: {
        default: (data: any) => {
          if (data.requestParams) {
            let temp = data.requestParams.replace(/{|}/g, '')
            let res = temp.replace(/\\/g, '')
            let result = res.replace(/\n|\r/g, '')
            return result || '-'
          }
          return data.requestParams || '-'
        }
      }
    }
  },
  {
    field: 'requestTime',
    label: t('operationLog.requestTime'),
    component: 'Input',
    componentProps: {
      readonly: true
    }
  },
  {
    field: 'requestUri',
    label: t('operationLog.requestUri'),
    component: 'Input',
    componentProps: {
      readonly: true
    }
  },
  {
    field: 'status',
    label: t('operationLog.status1'),
    component: 'Input',
    componentProps: {
      readonly: true
    },
    formItemProps: {
      slots: {
        default: (data: any) => {
          if (data.status == 0) {
            return <span>{t('image.fail')}</span>
          } else {
            return <span>{t('image.success')}</span>
          }
        }
      }
    }
  },
  {
    field: 'createTime',
    label: t('operationLog.createTime'),
    component: 'Input',
    componentProps: {
      readonly: true
    }
  },
  {
    field: 'operatorName',
    label: t('operationLog.operatorName'),
    component: 'Input',
    componentProps: {
      readonly: true
    }
  }
])

const { formRegister, formMethods } = useForm()
const { setValues } = formMethods

watch(
  () => props.currentRow,
  (currentRow) => {
    if (!currentRow) return
    setValues(currentRow)
  },
  {
    deep: true,
    immediate: true
  }
)
</script>

<template>
  <Form @register="formRegister" :schema="formSchema" :isCol="false" />
</template>
