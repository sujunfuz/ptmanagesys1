<template>
  <div v-if="openType == 1">
    <div
      class="box-border w-100% h-176px pa-20px color-colorBlack font-size-14px border-(1px solid #E6E8EB) border-rd-4px"
    >
      <div>收款账户</div>
      <div class="flex-c [&>div]:( text-right mr-20px) mt-20px">
        <div class="color-colorGray w-42px">户名</div>
        <div>xx有限公司</div>
      </div>
      <div class="flex-c [&>div]:( text-right mr-20px) mt-20px">
        <div class="color-colorGray w-42px">账号</div>
        <div>4000002721920000</div>
      </div>
      <div class="flex-c [&>div]:( text-right mr-20px) mt-20px">
        <div class="color-colorGray w-42px">开户行</div>
        <div>招商银行福州古田支行</div>
      </div>
    </div>
    <div
      class="w-100% mb-20px flex-c h-50px border-rd-4px bg-#f2f7fe mt-20px box-border pt-16px pb-16px pl-20px pr-20px"
    >
      <div class="flex-cc">
        <div class="color-colorBlack font-size-14px">已用授信额度：</div>
        <div class="font-size-20px color-colorMain font-500">￥{{ repayData.waitRepayAmount }}</div>
      </div>
      <div class="flex-cc ml-60px">
        <div class="color-colorBlack font-size-14px">超期利息：</div>
        <div class="font-size-20px color-colorMain font-500">￥{{ repayData.interestAmount }}</div>
      </div>
    </div>
    <Form :is-col="false" :schema="formSchema" @register="formRegister" :rules="rules" />

    <!-- <div class="flex justify-end w-100% mt-60px">
      <ElButton type="primary" @click="changeStep">下一步</ElButton>
    </div> -->
  </div>
  <!-- <div v-else-if="step == 1">
    <div class="flex-c flex-col w-100%">
      <div class="color-colorBlack font-500 font-size-20px">￥5000</div>
      <div class="color-colorGray font-size-14px mt-20px">{{
        t('managementProfile.txt22', { mobile: 13800138000 })
      }}</div>
      <div class="flex-c justify-around w-100% mt-30px">
        <el-input
          class="!w-80px !h-100px"
          v-for="(item, index) in checkCode"
          :key="index"
          v-model="checkCode[index]"
        />
      </div>
      <div class="flex justify-end mt-10px w-100%">
        <span class="color-colorGray font-size-14px">59s{{ t('managementProfile.txt23') }}</span>
      </div>
    </div>
    <div class="flex justify-end mt-10px w-100%">
      <ElButton class="mt-60px" type="primary" @click="changeStep">{{
        t('managementProfile.txt21')
      }}</ElButton>
    </div>
  </div> -->
  <div v-else-if="openType == 2">
    <div class="flex-cc flex-col">
      <Icon icon="ep:success-filled" class="mt-90px" color="#41CC8B" :size="90" />
      <div class="font-size-18px color-colorBlack mt-20px">{{ t('managementProfile.txt20') }}</div>
    </div>
    <!-- <div class="flex justify-end mt-10px w-100%">
      <ElButton class="mt-60px" @click="changeStep">{{ t('common.back') }}</ElButton>
    </div> -->
  </div>
</template>
<script setup lang="tsx">
import { FormSchema, Form } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { ref, reactive } from 'vue'
import { ElCheckbox, ElButton, ElInput } from 'element-plus'
import { Icon } from '@/components/Icon/index'
import { useI18n } from '@/hooks/web/useI18n'
import UploadImage from '@/components/UploadImage/UploadImage.vue'
import { useValidator } from '@/hooks/web/useValidator'
// import { useForm } from '@/hooks/web/useForm'
const { formRegister, formMethods } = useForm()
const { getFormData, getElFormExpose } = formMethods
const { required } = useValidator()
const { t } = useI18n()
const props = defineProps({
  openType: {
    type: Number,
    default: 1
  },
  repayData: {
    type: Object,
    default: () => {}
  }
})
const emit = defineEmits(['updateDialogTitle'])
const step = ref(0)
const checkCode = reactive(['', '', '', '', '', ''])
const imgArr = ref([])

const rules = reactive({
  repayAmount: [required()],
  repayInterest: [required()],
  img: [required()]
})

const formSchema = reactive<FormSchema[]>([
  {
    field: 'repayAmount',
    label: t('managementProfile.txt14'),
    component: 'Input',
    componentProps: {
      style: {
        width: '334px'
      },
      type: 'number'
    }
  },
  {
    field: 'repayInterest',
    label: '还款利息',
    component: 'Input',
    componentProps: {
      style: {
        width: '334px'
      },
      type: 'number'
    }
  },
  {
    field: 'all',
    label: t('managementProfile.txt16'),
    formItemProps: {
      slots: {
        default: (data) => {
          let num1 = 0
          if (data.repayAmount) {
            num1 += parseFloat(data.repayAmount)
          }
          let num2 = 0
          if (data.repayInterest) {
            num2 += parseFloat(data.repayInterest)
          }
          return <div class="font-size-20px color-colorBlack">{num1 + num2 || '--'}</div>
        }
      }
    }
  },
  {
    field: 'img',
    label: '还款凭证',
    formItemProps: {
      slots: {
        default: (data) => {
          return (
            <div class="flex flex-col">
              <UploadImage
                onUpdateImgUrl={(val) => {
                  data.img = val
                }}
                v-model={imgArr.value}
              />
              <div>请上传银行电子回单</div>
            </div>
          )
        }
      }
    }
  }
])

const changeStep = () => {
  step.value = step.value + 1
  emit('updateDialogTitle', step.value)
}

const submit = async () => {
  const elForm = await getElFormExpose()
  const valid = await elForm?.validate().catch((err) => {
    console.log(err)
  })
  if (valid) {
    const formData = await getFormData()
    return formData
  } else {
    return null
  }
}
defineExpose({
  submit
})
</script>
<style lang="less" scoped></style>
