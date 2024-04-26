<script setup lang="tsx">
import { Form, FormSchema, SelectOption } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { ref, reactive } from 'vue'
import { useValidator } from '@/hooks/web/useValidator'
import { useI18n } from '@/hooks/web/useI18n'

const { required } = useValidator()
const { t } = useI18n()

const props = defineProps({
  categoryType: {
    type: Number,
    default: 1
  },
  delName: {
    type: String,
    default: ''
  },
  inheritList: {
    type: Array,
    default: () => []
  }
})

const tagList = reactive([
  {
    lable: '红色',
    value: '1',
    ischeck: false
  },
  {
    lable: '白色2',
    value: '2',
    ischeck: false
  },
  {
    lable: '红色2',
    value: '3',
    ischeck: false
  },
  {
    lable: '白色1',
    value: '4',
    ischeck: false
  },
  {
    lable: '红色1',
    value: '5',
    ischeck: true
  }
])

const formSchema = reactive<FormSchema[]>([
  {
    field: 'id',
    label: t('productcategory.deltext2'),
    formItemProps: {
      slots: {
        default: () => {
          return (
            <>
              {props.categoryType == 1 ? (
                <div class="color-#F45057">
                  {t('productcategory.title1')}：{props.delName}
                </div>
              ) : props.categoryType == 2 ? (
                <div class="color-#F45057">
                  {t('productcategory.title2')}：{props.delName}
                </div>
              ) : (
                <div class="color-#F45057">
                  {t('productcategory.title3')}：{props.delName}
                </div>
              )}
            </>
          )
        }
      }
    }
  },
  {
    field: 'sucId',
    label: t('productcategory.deltext3'),
    component: 'Select',
    componentProps: {
      style: {
        width: '100%'
      },
      options: props.inheritList,
      placeholder: t('project.select'),
      props: {
        label: 'categoryName',
        value: 'id'
      }
    }
  }
])

const rules = reactive({
  sucId: [required()]
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

defineExpose({
  submit,
  formMethods
})
</script>

<template>
  <div class="color-#F45057 bg-#FFF1F2 pt-10px pr-10px pl-10px pb-10px mb-20px inline-block">{{
    t('productcategory.deltext1')
  }}</div>
  <Form :rules="rules" @register="formRegister" :schema="formSchema" :isCol="false" />
</template>
