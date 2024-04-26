<script setup lang="tsx">
import { Form, FormSchema } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { computed, reactive, watch } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import { ElTag } from 'element-plus'
import { useValidator } from '@/hooks/web/useValidator'

const { t } = useI18n()
const { required, validEmail, validMobile, validPWD } = useValidator()

const Allschema = computed(() => {
  return props.actionType == 'repwd' ? baseSchema : formSchema
})

const baseSchema = reactive<FormSchema[]>([
  {
    field: 'newPwd',
    label: t('accountSettings.sub2'),
    component: 'InputPassword',
    colProps: {
      span: 24
    },
    componentProps: {
      style: {
        width: '400px'
      }
    }
  },
  {
    field: 'newPwd2',
    label: t('accountSettings.sub3'),
    component: 'InputPassword',
    colProps: {
      span: 24
    },
    componentProps: {
      style: {
        width: '400px'
      }
    }
  }
])

const validateCopy = async (rule, value, callback) => {
  const formData = await getFormData()
  if (value != formData.newPwd) {
    callback(new Error(t('common.isEqual')))
  } else {
    callback()
  }
}

const rulesPwd = reactive({
  oldPwd: [required(), validPWD()],
  newPwd: [required(), validPWD()],
  newPwd2: [required(), validPWD(), { validator: validateCopy, trigger: 'blur' }]
})

const props = defineProps({
  currentRow: {
    type: Object as any,
    default: () => {
      return {
        status: -1
      }
    }
  },
  pmsRoleList: {
    type: Object as any,
    default: () => {}
  },
  statusEnum: {
    type: Object as any,
    default: () => {}
  },
  actionType: {
    type: String,
    default: ''
  }
})

const formSchema = reactive<FormSchema[]>([
  {
    field: 'realName',
    label: t('staff.name'),
    component: 'Input',
    componentProps: {
      style: {
        width: '100%'
      }
    }
  },
  {
    field: 'email',
    label: t('staff.email'),
    component: 'Input',
    componentProps: {
      style: {
        width: '100%'
      }
    }
  },
  {
    field: 'pwd',
    label: t('staff.pwd'),
    component: 'Input',
    componentProps: {},
    remove: props.actionType == 'edit'
  },
  {
    field: 'mobileNo',
    label: t('staff.iphone'),
    component: 'Input',
    componentProps: {}
  },
  {
    field: 'unStatus',
    label: t('staff.status1'),
    component: 'Select',
    componentProps: {
      options: props.statusEnum
    }
  },
  {
    field: 'remark',
    label: t('staff.remark'),
    component: 'Input',
    componentProps: {
      placeholder: t('project.input'),
      type: 'textarea',
      maxlength: 50,
      showWordLimit: true,
      rows: 2
    }
  },
  {
    field: 'roleIdList',
    label: t('staff.chooseRole'),
    component: 'CheckboxGroup',
    value: [],
    componentProps: {
      options: props.pmsRoleList
    }
  }
  // {
  //   field: 'stationIdList',
  //   label: t('staff.chooseSite'),
  //   component: 'CheckboxGroup',
  //   value: [],
  //   componentProps: {
  //     options: [
  //       {
  //         label: 'option-1',
  //         value: '1'
  //       },
  //       {
  //         label: 'option-2',
  //         value: '2'
  //       },
  //       {
  //         label: 'option-3',
  //         value: '3'
  //       }
  //     ]
  //   }
  // }
])

const rules = reactive({
  realName: [required()],
  email: [required(), validEmail()],
  pwd: [required(), validPWD()],
  mobileNo: [required(), validMobile()],
  roleIdList: [required()],
  stationIdList: [required()],
  unStatus: [required()]
})

const { formRegister, formMethods } = useForm()
const { setValues, getFormData, getElFormExpose } = formMethods

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

defineExpose({
  submit
})
</script>

<template>
  <div v-if="actionType != 'view'">
    <Form
      @register="formRegister"
      :rules="actionType == 'repwd' ? rulesPwd : rules"
      :schema="Allschema"
      :isCol="false"
    />
  </div>
  <div v-else>
    <div class="flex-c color-#7A7A7A font-size-14px">
      <div class="text-right w-120px min-w-120px">{{ t('staff.name') }}:</div>
      <div class="ml-15px color-colorBlack">{{ currentRow.realName || '-' }}</div>
    </div>
    <div class="flex-c mt-20px color-#7A7A7A font-size-14px">
      <div class="text-right w-120px min-w-120px">{{ t('staff.email') }}:</div>
      <div class="ml-15px color-colorBlack">{{ currentRow.email || '-' }}</div>
    </div>
    <div class="flex-c mt-20px color-#7A7A7A font-size-14px">
      <div class="text-right w-120px min-w-120px">{{ t('staff.iphone') }}:</div>
      <div class="ml-15px color-colorBlack">{{ currentRow.mobileNo || '-' }}</div>
    </div>
    <div class="flex-c mt-20px color-#7A7A7A font-size-14px">
      <div class="text-right w-120px min-w-120px">{{ t('staff.status') }}:</div>
      <div class="ml-15px color-colorBlack">
        <el-tag :type="currentRow.unStatus == 'STATUS_0_0_0_0' ? 'success' : 'info'">{{
          currentRow.unStatusStr || '-'
        }}</el-tag>
      </div>
    </div>
    <div class="flex-c mt-20px color-#7A7A7A font-size-14px">
      <div class="text-right w-120px min-w-120px">{{ t('staff.remark') }}:</div>
      <div class="ml-15px color-colorBlack">{{ currentRow.remark || '-' }}</div>
    </div>
    <div class="flex-c mt-20px color-#7A7A7A font-size-14px">
      <div class="text-right w-120px min-w-120px">{{ t('staff.role') }}:</div>
      <div class="ml-15px color-colorBlack">{{ currentRow.roleNames || '-' }}</div>
    </div>
    <!-- <div class="flex-c mt-20px color-#7A7A7A font-size-14px">
      <div class="text-right w-120px min-w-120px">{{ t('staff.chooseSite') }}:</div>
      <div class="ml-15px color-colorBlack">{{ currentRow.stationIdList || '-' }}</div>
    </div> -->
  </div>
</template>
