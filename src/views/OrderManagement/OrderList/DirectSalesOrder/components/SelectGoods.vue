<template>
  <div class="bg-white min-w-725px bg-white">
    <!-- 头部搜索 -->
    <div class="pa-20px !pb-0px w-100%">
      <div class="font-size-20px color-colorBlack mb-30px">{{ t('chooseGoods.chooseGoods') }}</div>
      <Search :is-col="true" :schema="searchSchema" :showSearch="false" :show-reset="false" />
    </div>
    <!-- 底部类表格 -->
    <div class="bg-#E8EAED w-100% h-50px">
      <div
        class="customW h-100% font-size-14px font-600 flex-b color-colorBlack [&>div]:(line-height-50px h-100%)"
        style="margin: 0 auto"
      >
        <div class="w-74%">{{ t('chooseGoods.info') }}</div>
        <div class="w-19%">{{ t('productList.RangePrice') }}</div>
        <div class="w-7%">{{ t('chooseGoods.size') }}</div>
      </div>
    </div>
    <div class="w-100%">
      <ElScrollbar v-if="dataList.length > 0" :max-height="'670px'">
        <CutomRow
          :del-spu-id="delSpuId"
          :del-sku-id="delSkuId"
          @update-has-select="updateHasSelect"
          v-for="(item, index) in dataList"
          :key="item.spuId"
          :list-item="item"
          :list-index="index"
          :huixian-arr="huixianArr"
        />
      </ElScrollbar>
      <Empty v-else />
      <div>
        <el-pagination
          class="pa-20px"
          style="width: calc(100% - 40px)"
          :page-sizes="[10, 20, 30, 40, 50, 100]"
          layout=" ->, total, sizes, prev, pager, next, jumper"
          :total="total"
          v-model:page-size="pageSize"
          v-model:current-page="currentPage"
          @current-change="getDataList"
          @size-change="getDataList"
          @prev-click="getDataList"
          @next-click="getDataList"
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="tsx">
import { Search } from '@/components/Search'
import { FormSchema } from '@/components/Form'
import { useI18n } from '@/hooks/web/useI18n'
import { reactive, ref } from 'vue'
import {
  ElButton,
  ElScrollbar,
  ElCheckbox,
  ElPagination,
  ElMessage,
  ElCascader
} from 'element-plus'
import { getDirectOrderListApi, intelDistributeAPi } from '@/api/orderManagement/OrderList.ts'
import CutomRow from './CutomRow.vue'
import { onMounted } from 'vue'
import { nextTick } from 'vue'
import Empty from '@/components/customComponents/Empty/index.vue'

const { t } = useI18n()

const props = defineProps({
  categoryList: {
    type: Array,
    default: () => []
  },
  delSpuId: {
    type: String,
    default: ''
  },
  delSkuId: {
    type: String,
    default: ''
  },
  huixianArr: {
    type: Object,
    default: () => [] as Object
  }
})
const emit = defineEmits(['updateHasSelect', 'intelDistribute'])
const qvfan = async () => {
  if (dataList.value.length > 0) {
    dataList.value = []
  } else {
    await getDataList()
  }
}
const searchParam = ref<any>({})
const searchList = async (val) => {
  searchParam.value = {}
  Object.keys(val).forEach((item) => {
    if (val[item] && item != 'categoreId') {
      searchParam.value[item] = val[item]
    } else if (item == 'categoreId' && val[item] && val[item].length > 0) {
      searchParam.value[item] = val[item][val[item].length - 1]
    }
  })
  currentPage.value = 1
  getDataList()
}
const searchSchema = ref<FormSchema[]>([
  {
    field: 'spuName',
    label: '',
    component: 'Input',
    colProps: {
      span: 10
    },
    componentProps: {
      slots: {
        prepend: () => <div>{t('productList.name')}</div>
      },
      style: {
        width: '95% !important'
      }
    },
    formItemProps: {
      style: {
        width: '100%'
      }
    }
  },

  {
    field: 'categoreId',
    label: '',
    component: 'Cascader',
    colProps: {
      span: 10
    },

    formItemProps: {
      slots: {
        default: (data) => {
          return (
            <div class=" flex-c border-rd-4px specialInput border-(#dcdfe6 solid 1px )">
              <div class="color-#b0b4b7 w-70px text-center ml-10px">
                {t('productList.category')}
              </div>
              <div style="background-color: #dcdfe6;width: 0.5px;height: 23px;margin-left: 10px;"></div>
              <ElCascader
                clearable
                v-model={data.categoreId}
                options={props.categoryList as any}
                props={{
                  value: 'id',
                  label: 'categoryName'
                }}
                show-all-levels={false}
                class="ml-1px !w-230px"
              />
            </div>
          )
        }
      }
    }
  },
  {
    field: 'amount',
    label: '',
    component: 'Input',
    colProps: {
      span: 10
    },
    componentProps: {
      slots: {
        prepend: () => <div>{t('chooseGoods.money')}</div>
      },
      type: 'number',
      style: {
        width: '95% !important'
      }
    },
    formItemProps: {
      style: {
        width: '100%'
      }
    }
  },
  {
    field: 'btn',
    label: '',
    formItemProps: {
      slots: {
        default: (data) => {
          return (
            <div>
              <ElButton
                type="primary"
                v-hasPermi="ordstorebatchorder:ordStoreBatchOrder:autoGen"
                onClick={() => {
                  intelligentDistribution(data)
                }}
              >
                {t('chooseGoods.btn2')}
              </ElButton>
              <ElButton
                type="primary"
                onClick={() => {
                  searchList(data)
                }}
              >
                {t('common.query')}
              </ElButton>
            </div>
          )
        }
      }
    }
  }
])
onMounted(() => {})

// 表格查询
const pageSize = ref(10)
const currentPage = ref(1)
const total = ref(0)
const dataList = ref<any>([])
const getDataList = async () => {
  const res = await getDirectOrderListApi({
    ...searchParam.value,
    currentPage: currentPage.value,
    pageSize: pageSize.value
  })
  if (res) {
    total.value = res.data.total
    dataList.value = res.data.list
  }
}
const intelligentDistribution = async (val) => {
  searchParam.value = {}
  Object.keys(val).forEach((item) => {
    if (val[item] && item != 'categoreId') {
      searchParam.value[item] = val[item]
    } else if (item == 'categoreId' && val[item] && val[item].length > 0) {
      searchParam.value[item] = val[item][val[item].length - 1]
    }
  })
  if (!searchParam.value.amount) {
    ElMessage.warning(t('common.a38'))
    return
  }
  const res = await intelDistributeAPi({ ...searchParam.value })
  if (res && res.data && res.data.length > 0) {
    emit('intelDistribute', res.data)
  } else {
    ElMessage.warning(t('chooseGoods.txt1'))
  }
}
const updateHasSelect = (type, spuData, skuDataArr) => {
  emit('updateHasSelect', type, spuData, skuDataArr)
}
const setDataList = () => {
  let tempArr = dataList.value
  dataList.value = []
  nextTick(() => {
    dataList.value = tempArr
  })
}
onMounted(() => {
  getDataList()
})
defineExpose({
  searchParam: searchParam.value,
  setDataList
})
</script>
<style scoped lang="less">
.customW {
  width: calc(100% - 40px);
}
</style>
