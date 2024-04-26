<script setup lang="tsx">
import { Form, FormSchema } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { PropType, reactive, watch, ref, onMounted } from 'vue'
import { useValidator } from '@/hooks/web/useValidator'
import { useI18n } from '@/hooks/web/useI18n'
import { ElMessage, ElButton, ElPopconfirm, ElInput, ElSelect, ElOption } from 'element-plus'
import { Icon } from '@/components/Icon'
import { getCompanyInfoApi } from '@/api/creditManagement/index'
import { clone, cloneDeep } from 'lodash-es'
const { t } = useI18n()

const { required } = useValidator()

const props = defineProps({
  currentRow: {
    type: Object as PropType<any>,
    default: () => null
  },
  actionType: {
    type: String,
    default: ''
  }
})

const imageUrl = ref('')
const dataList = ref<any>([
  // {
  //   edit1: false,
  //   edit2: false,
  //   edit3: false
  // }
])
const loading = ref(false)
const selectOptions = ref<any>([])
const remoteMethod = async (query: string) => {
  if (query) {
    loading.value = true
    const res = await getCompanyInfoApi({ companyName: query })
    loading.value = false
    console.log(res)
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
              placeholder={t('common.inputText')}
              remote-show-suffix
              remoteMethod={remoteMethod}
              loading={loading.value}
            >
              {selectOptions.value.map((item, index) => (
                <ElOption
                  key={index}
                  label={item.companyName}
                  value={{
                    merchantNo: item.merchantNo,
                    companyName: item.companyName
                  }}
                ></ElOption>
              ))}
            </ElSelect>
          )
        }
      }
    }
  },
  {
    field: 'creditAmount',
    label: t('merchant.money'),
    colProps: {
      span: 12
    },
    component: 'Input',
    componentProps: {
      style: {
        width: '100%'
      },
      type: 'number'
    }
  }
])

const rules = reactive({
  merchantNo: [required()],
  creditLimit: [required()]
})

const { formRegister, formMethods } = useForm()
const { setValues, getFormData, getElFormExpose } = formMethods

const submit = async () => {
  if (props.actionType == 'add') {
    const elForm = await getElFormExpose()
    const valid = await elForm?.validate().catch((err) => {
      console.log(err)
    })
    if (valid) {
      const formData = await getFormData()
      formData.creditRuleList = cloneDeep(dataList.value)
      formData.companyName = formData.merchantNo.companyName
      formData.merchantNo = formData.merchantNo.merchantNo
      return { ...formData }
    }
  } else {
    return {
      creditRuleList: cloneDeep(dataList.value)
    }
  }

  return null
}

onMounted(() => {
  if (props.actionType == 'edit' || props.actionType == 'sys' || props.actionType == 'editSelect') {
    let arr = JSON.parse(props.currentRow.creditInfo)
    arr.forEach((item) => {
      item.edit1 = false
      item.edit2 = false
      item.edit3 = false
      item.interestRate = item.interestRate * 100
      item.overdueInterestRate = item.overdueInterestRate * 100
    })
    dataList.value = arr
    // console.log(arr, 'arr')
  }
})

const addDataList = () => {
  dataList.value.push({
    period: 0,
    interestRate: 0,
    overdueInterestRate: 0,
    edit1: false,
    edit2: false,
    edit3: false
  })
}
const deleteDataList = (index) => {
  dataList.value = dataList.value.filter((item, i) => {
    return index != i
  })
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
    v-if="actionType == 'add'"
    @register="formRegister"
    :schema="formSchema"
    class="baseClass"
  />
  <div class="w-100% mt-20px box-border font-size-16px border-rd-10px border-(1px solid #E5EFFC)">
    <div
      class="bg-#e5effc flex-c [&>div]:(w-30% h-50px text-center font-bold line-height-50px color-colorMain)"
    >
      <div>{{ t('advanceSettlement.block2') }}({{ t('timeWords.day') }})</div>
      <div>{{ t('advanceSettlement.block3') }}(%)</div>
      <div>{{ t('advanceSettlement.block13') }}(%)</div>
      <div class="!w-10%"></div>
    </div>

    <!-- <div v-if="dataList.length > 0"> -->
    <div
      v-for="(item, index) in dataList"
      :key="index"
      class="customStyle flex-c [&>div]:(w-30% h-60px text-center line-height-60px box-border color-colorBlack)"
    >
      <div style="border-right: 1px solid#E5EFFC; border-bottom: 1px solid#E5EFFC">
        <div class="cell flex-cc" v-if="!item.edit1">
          <div>{{ item.period }}</div>
          <Icon
            class="cell-icon !w-10px !h-10px inline-block ml-4px cursor-pointer"
            icon="svg-icon:edit"
            @click="item.edit1 = true"
          />
        </div>
        <div v-else class="flex-cc w-100% h-100%">
          <ElInput v-model="item.period" class="!w-70px !h-22px" type="number" />
          <div
            @click="item.edit1 = false"
            class="bg-colorMain border-rd-4px h-22px line-height-22px pl-2px pr-2px ml-5px color-white text-nowrap font-size-12px cursor-pointer"
          >
            {{ t('project.confirm') }}</div
          >
        </div>
      </div>
      <div style="border-right: 1px solid#E5EFFC; border-bottom: 1px solid#E5EFFC">
        <div class="cell flex-cc" v-if="!item.edit2">
          <div>{{ item.interestRate }}</div>
          <Icon
            class="cell-icon !w-10px !h-10px inline-block ml-4px cursor-pointer"
            icon="svg-icon:edit"
            @click="item.edit2 = true"
          />
        </div>
        <div v-else class="flex-cc w-100% h-100%">
          <ElInput v-model="item.interestRate" class="!w-70px !h-22px" type="number" />
          <div
            @click="item.edit2 = false"
            class="bg-colorMain border-rd-4px h-22px line-height-22px pl-2px pr-2px ml-5px color-white text-nowrap font-size-12px cursor-pointer"
          >
            {{ t('project.confirm') }}</div
          >
        </div>
      </div>
      <div style="border-right: 1px solid#E5EFFC; border-bottom: 1px solid#E5EFFC">
        <div class="cell flex-cc" v-if="!item.edit3">
          <div>{{ item.overdueInterestRate }}</div>
          <Icon
            class="cell-icon !w-10px !h-10px inline-block ml-4px cursor-pointer"
            icon="svg-icon:edit"
            @click="item.edit3 = true"
          />
        </div>
        <div v-else class="flex-cc w-100% h-100%">
          <ElInput v-model="item.overdueInterestRate" class="!w-70px !h-22px" type="number" />
          <div
            @click="item.edit3 = false"
            class="bg-colorMain border-rd-4px h-22px line-height-22px pl-2px pr-2px ml-5px color-white text-nowrap font-size-12px cursor-pointer"
          >
            {{ t('project.confirm') }}</div
          >
        </div>
      </div>
      <div class="!w-10%" style="border-bottom: 1px solid#E5EFFC">
        <el-popconfirm :title="t('common.delMessage')" @confirm="deleteDataList(index)">
          <template #reference>
            <Icon
              icon="material-symbols-light:delete-outline"
              color="#797979"
              hoverColor="#F45057"
              :size="20"
            />
          </template>
        </el-popconfirm>
      </div>
    </div>
    <!-- </div> -->
  </div>
  <div>
    <div
      @click="addDataList"
      class="mt-11px w-103px h-40px bg-#e5effc border-rd-6px text-center line-height-40px color-colorMain font-size-14px cursor-pointer"
    >
      +{{ t('project.add') }}</div
    >
  </div>
</template>

<style lang="less" scoped>
.cell:hover {
  .cell-icon {
    opacity: 1;
  }
}

.cell-icon {
  opacity: 0;
}

.customStyle:last-child {
  div {
    border-bottom: none !important;
  }
}

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
