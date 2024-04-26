<template>
  <div v-if="allData.afSalesStatus">
    <div v-if="openType == '1-1'" class="font-size-14px color-colorGray">
      <div v-if="allData.afSalesStatus == 'USER_SEND_WAIT_MER_TK'">
        {{ t('aftersalesList.refundTxt8') + ',' + t('aftersalesList.check') }}
      </div>
      <div v-if="allData.afSalesStatus == 'MER_WAIT_TK'">{{ t('aftersalesList.check') }}</div>
      <div class="flex-c text-left mt-20px">
        <div>{{ t('aftersalesList.type') }}：</div>
        <div class="color-colorBlack">{{ allData.afSalesTypeStr }}</div>
      </div>
      <div class="flex-c text-left mt-10px">
        <div>{{ t('aftersalesList.price2') }}：</div>
        <div class="color-colorBlack">￥{{ allData.refundAmount }}</div>
      </div>
      <div class="flex-c text-left mt-10px">
        <div>{{ t('aftersalesList.reason') }}：</div>
        <div class="color-colorBlack">{{ allData.reasonStr }}</div>
      </div>
    </div>
    <div v-if="openType == '1-2' || openType == '1-4'" class="font-size-14px color-colorGray">
      <div
        v-if="
          allData.afSalesStatus != 'MER_WAIT_TH_TK' && allData.afSalesStatus != 'MER_REFUSE_TH_TK'
        "
        >{{ t('aftersalesList.advice') }}</div
      >
      <div v-else>{{ t('aftersalesList.refundTxt10') }}</div>
      <div class="flex-c text-left mt-20px">
        <div>{{ t('aftersalesList.type') }}：</div>
        <div class="color-colorBlack">{{ allData.afSalesTypeStr }}</div>
      </div>
      <div class="flex-c text-left mt-10px">
        <div>{{ t('aftersalesList.price2') }}：</div>
        <div class="color-colorBlack">￥{{ allData.refundAmount }}</div>
      </div>
      <div class="flex-c text-left mt-10px">
        <div>{{ t('aftersalesList.reason') }}：</div>
        <div class="color-colorBlack">{{ allData.reasonStr }}</div>
      </div>
      <div class="mt-30px">
        <Form :schema="allSchema" @register="formRegister" :rules="rules" :is-col="false" />
      </div>
    </div>
    <div v-if="openType == '1-3'" class="font-size-14px color-colorGray">
      <div class="flex-c text-left mt-20px">
        <div>{{ t('aftersalesList.refundTxt5') }}</div>
      </div>
    </div>
  </div>
</template>
<script setup lang="tsx">
import { Form, FormSchema } from '@/components/Form'
import { ref } from 'vue'
import { useValidator } from '@/hooks/web/useValidator'
import { onMounted } from 'vue'
const { required } = useValidator()
import { ElSelect, ElOption } from 'element-plus'
import { useForm } from '@/hooks/web/useForm'
import { useI18n } from '@/hooks/web/useI18n'
import { useRouter } from 'vue-router'
import { getShopRefundAddr } from '@/api/orderManagement/AfterSales'
const { t } = useI18n()
const props = defineProps({
  openType: {
    type: String,
    default: '1-1'
  },
  allData: {
    type: Object,
    default: () => {}
  },
  refuseReasonEnum: {
    type: Array,
    default: () => []
  }
})
const rules = ref({
  refuseReason: [required()],
  address: [required()],
  refuseExplain: [required()]
})
const allSchema = ref<FormSchema[]>([])
const formSchema1 = [
  {
    field: 'refuseReason',
    label: t('image.sub15'),
    component: 'Select',
    componentProps: {
      options: props.refuseReasonEnum
    }
  },
  {
    field: 'refuseExplain',
    label: t('router.descriptions'),
    component: 'Input',
    componentProps: {
      type: 'textarea',
      rows: 5,
      maxlength: 300,
      showWordLimit: true
    }
  }
]

const { push } = useRouter()
const formSchema2: FormSchema[] = [
  {
    field: 'addrId',
    label: t('aftersalesList.address1'),
    formItemProps: {
      slots: {
        default: (data) => {
          const optios = addressEnum.value || []
          return (
            <div class="flex-c w-100% mt--5px">
              <ElSelect
                class="m-2 !w-80%"
                v-model={data.addrId}
                placeholder={t('common.selectText')}
              >
                {optios.map((item) => (
                  <ElOption label={item.label} value={item.value} key={item.value} />
                ))}
              </ElSelect>
              <div
                class="cursor-pointer color-colorMain"
                onClick={() => push('/logisticsCenter/warehouse')}
              >
                {t('image.sub16')}
              </div>
            </div>
          )
        }
      }
    }
  }
]

const { formRegister, formMethods } = useForm()

const addressEnum = ref<Array<any>>()
onMounted(async () => {
  if (props.openType == '1-2') {
    allSchema.value = formSchema1 as FormSchema[]
  } else if (props.openType == '1-4') {
    allSchema.value = formSchema2 as FormSchema[]
  }
  if (props.allData.afSalesStatus == 'MER_WAIT_TH_TK' && props.openType == '1-4') {
    const res = await getShopRefundAddr()
    let temp = []
    if (res.code == 200) {
      for (var item in res.data) {
        temp.push({
          label: res.data[item].fullAddress,
          value: res.data[item].id
        })
      }
      addressEnum.value = temp
    }
  }
})
defineExpose({
  formMethods
})
</script>
