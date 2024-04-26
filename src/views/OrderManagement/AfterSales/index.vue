<template>
  <ContentWrap>
    <div class="flex-cb mb-20px">
      <ElRadioGroup
        v-hasPermi="'aftersales:afSalesRecord:list'"
        v-model="afSalesStatus"
        @change="setSearchParams"
      >
        <ElRadioButton v-for="item in RadioList" :key="item.value" :label="item.value">{{
          item.label
        }}</ElRadioButton>
      </ElRadioGroup>
      <ElButton
        v-hasPermi="'aftersales:afSalesRecord:add'"
        type="primary"
        @click="push('/orderManagement/afterSales/addaftersales')"
        >{{ t('aftersalesList.addList') }}</ElButton
      >
    </div>
    <Search
      v-hasPermi="'aftersales:afSalesRecord:list'"
      @register="formRegister"
      :schema="schema"
      @reset="setSearchParams"
      @search="setSearchParams"
    />
  </ContentWrap>
  <ContentWrap class="mt-20px flex-1" :isBlock="false">
    <Table
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :columns="allSchemas.tableColumns"
      :data="dataList"
      :loading="loading"
      @register="tableRegister"
      :pagination="{
        total,
        layout: ' ->, total, sizes, prev, pager, next, jumper'
      }"
    />
  </ContentWrap>

  <!-- <Dialog >
    <Write ref="writeRef" />

    <template #footer >
      <ElButton >{{ t('project.cancel') }}</ElButton>
      <ElButton type="primary" >
        {{ t('project.confirm') }}
      </ElButton>
    </template>
  </Dialog> -->
</template>

<script setup lang="tsx">
import { ContentWrap } from '@/components/ContentWrap'
import { useI18n } from '@/hooks/web/useI18n'
import { ref, unref, watch, reactive, nextTick } from 'vue'
import { ElButton, ElRadioGroup, ElRadioButton, ElLink, ElTag } from 'element-plus'
import { useTable } from '@/hooks/web/useTable'
import { Search } from '@/components/Search'
import Write from './components/Write.vue'
import { Dialog } from '@/components/Dialog'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { SelectOption, FormSchema } from '@/components/Form'
import { Table } from '@/components/Table'
import { useForm } from '@/hooks/web/useForm'
import { getRightNowTime } from '@/utils/time.ts'
import { useRouter } from 'vue-router'
import { getAfterSalesTopApi, getAfterSalesListApi } from '@/api/orderManagement/AfterSales.ts'
import { onMounted } from 'vue'
import { useAppStore } from '@/store/modules/app'
const appStore = useAppStore()
appStore.setRenderLoading(true)
const { push } = useRouter()
const { t } = useI18n()
//静态枚举
const afSalesStatus = ref('')
const RadioList = ref<any>([])
const afterSalesTypeEnum = ref()
const affixImgUrl = import.meta.env.VITE_IMG_URL
//表格
const { tableRegister, tableState, tableMethods } = useTable({
  fetchDataApi: async () => {
    const { pageSize, currentPage } = tableState
    let params = {
      pageSize: pageSize.value,
      currentPage: currentPage.value,
      afSalesStatus: afSalesStatus.value,
      ...searchParams.value
    }
    if (searchParams.value.startTime) {
      params.startTime = searchParams.value.startTime[0]
      params.endTime = searchParams.value.startTime[1]
    }
    const res = await getAfterSalesListApi(params)
    res.data.list.forEach((item) => chuli(item))
    console.log(res.data, 'dsa')
    return {
      list: res.data.list || [],
      total: res.data.total || 0
    }
  },
  immediate: false
})
const chuli = (val) => {
  if (val.goodsEntities.length == 0) return
  let tempObj: any = {}
  val.goodsEntities.forEach((item) => {
    if (!tempObj[item.spuId]) {
      tempObj[item.spuId] = {
        spuName: item.spuName,
        spuId: item.spuId,
        spuImage: item.spuImage,
        skuDes: [],
        num: 0
      }
    }
    tempObj[item.spuId].skuDes.push(
      t('orderList.list2') + (tempObj[item.spuId].skuDes.length + 1) + '：' + item.skuIndexesVal
    )
    tempObj[item.spuId].num += item.num
  })
  let listArr: any = []
  Object.keys(tempObj).forEach((key: any) => {
    tempObj[key].skuDetail = tempObj[key].skuDes.join(' ')
    listArr.push(tempObj[key])
  })
  val.goodsEntities = listArr
}
const { total, loading, dataList, pageSize, currentPage } = tableState
const { getList } = tableMethods

const crudSchemas = reactive<CrudSchema[]>([
  {
    field: 'aftersaleNo',
    label: t('aftersalesList.orderNo') + '/' + t('aftersalesList.afterNo'),
    search: {
      hidden: true
    },
    table: {
      width: 238,
      slots: {
        default: (data) => {
          return (
            <div>
              <div>{data.row.storeBatchOrderNo}</div>
              <div>{data.row.afterSalesNo}</div>
            </div>
          )
        }
      }
    }
  },
  {
    field: 'goodsInfo',
    label: t('aftersalesList.goodsInfo'),
    search: {
      hidden: true
    },
    table: {
      width: 430,
      slots: {
        default: (data) => {
          return (
            <div>
              {data.row.goodsEntities.map((item) => (
                <div class="flex w-100% overflow-hidden mb-21px">
                  <img
                    src={affixImgUrl + item.spuImage}
                    class="min-w-50px w-50px h-50px min-h-50px border-rd-4px "
                  ></img>
                  <div class="ml-10px w-325px flex flex-col">
                    <span class="font-size-14px w-100% inline-block color-colorBlack text-ellipsis line-clamp-1">
                      {item.spuName}
                    </span>
                    <span class="font-size-12px w-98% inline-block color-colorGray text-ellipsis line-clamp-1">
                      {item.skuDetail}
                    </span>
                  </div>
                  <div class="font-size-14px min-w-20px color-colorBlack">x{item.num}</div>
                </div>
              ))}
            </div>
          )
        }
      }
    }
  },
  {
    field: 'price',
    label: t('aftersalesList.price'),
    search: {
      hidden: true
    },
    table: {
      slots: {
        default: (data) => {
          return (
            <div class="font-size-14px color-colorBlack">
              <div>￥{data.row.realAmount}</div>
              <div>￥{data.row.refundAmount}</div>
            </div>
          )
        }
      }
    }
  },
  {
    field: 'orderStatus',
    label: t('aftersalesList.status2'),
    search: {
      hidden: true
    },
    table: {
      slots: {
        default(data) {
          let ordStatus = data.row.ordStatus
          return (
            <div class="flex-cc">
              <ElTag
                class="ml-2"
                type={
                  ordStatus == 'HAS_RECEIVE_GOODS' || ordStatus == 'HAS_SEND_GOODS'
                    ? 'info'
                    : ordStatus == 'ABNORMAL_CARGO'
                    ? 'danger'
                    : ''
                }
              >
                {data.row.orderStatusStr}
              </ElTag>
            </div>
          )
        }
      }
    }
  },
  {
    field: 'afSalesTypeStr',
    label: t('aftersalesList.type'),
    search: {
      hidden: true
    }
  },
  {
    field: 'afSalesStatusStr',
    label: t('aftersalesList.status'),
    search: {
      hidden: true
    }
  },
  {
    field: 'goodsStatusStr',
    label: t('aftersalesList.status1'),
    search: {
      hidden: true
    }
  },
  {
    field: 'createTime',
    label: t('aftersalesList.time'),
    search: {
      hidden: true
    }
  },
  {
    field: 'action',
    label: t('userDemo.action'),
    table: {
      width: 240,
      fixed: 'right',
      slots: {
        default: (data: any) => {
          const row = data.row
          return (
            <>
              <div class="[&>span]:(cursor-pointer m-2) flex flex-wrap colorMain ">
                <span
                  v-hasPermi="aftersales:afSalesRecord:view"
                  onClick={() => {
                    push('/orderManagement/afterSales/aftersalesdetail?id=' + row.id)
                  }}
                >
                  {t('project.detail')}
                </span>
              </div>
            </>
          )
        }
      }
    }
  }
])

const { allSchemas } = useCrudSchemas(crudSchemas)
//搜索框
const schema = reactive<FormSchema[]>([
  {
    field: 'storeBatchOrderNo',
    colProps: {
      span: 12
    },
    component: 'Input',
    componentProps: {
      slots: {
        prefix: () => <div>{t('aftersalesList.orderNo')}</div>
      }
    }
  },
  {
    field: 'afterSalesNo',
    colProps: {
      span: 12
    },
    component: 'Input',
    componentProps: {
      slots: {
        prefix: () => <div>{t('aftersalesList.order')}</div>
      }
    }
  },
  {
    field: 'afSalesType',
    component: 'Select',
    componentProps: {
      options: afterSalesTypeEnum,
      slots: {
        prefix: () => <div>{t('aftersalesList.type')}</div>
      }
    }
  },
  {
    field: 'startTime',
    label: '',
    component: 'DatePicker',
    componentProps: {
      type: 'datetimerange',
      valueFormat: 'YYYY-MM-DD HH:mm:ss'
    }
  },
  {
    field: 'selectdate',
    formItemProps: {
      slots: {
        default: () => {
          return (
            <div class="h-100% flex-c color-colorBlack font-size-12px [&>div]:(pl-10px pr-10px cursor-pointer text-center border-(solid 1px #C7C7C7 rd-4px) text-nowrap box-border)">
              <div
                onClick={() => {
                  selectTime(3)
                }}
                class="h-100%"
              >
                3{t('aftersalesList.day')}
              </div>
              <div
                class="ml-18px"
                onClick={() => {
                  selectTime(7)
                }}
              >
                7{t('aftersalesList.day')}
              </div>
              <div
                class="ml-18px"
                onClick={() => {
                  selectTime(30)
                }}
              >
                {t('aftersalesList.month')}
              </div>
            </div>
          )
        }
      }
    }
  }
])

const { formRegister, formMethods } = useForm()
const searchParams = ref<any>({})
const setSearchParams = (params: any) => {
  currentPage.value = 1
  searchParams.value = params
  getList()
}
const selectTime = async (num) => {
  let currentTime = getRightNowTime('second')
  const timeStamp = new Date(currentTime).getTime() - 1000 * 60 * 60 * 24 * num
  let oldTime = getRightNowTime('second', timeStamp)
  await formMethods.setValues({
    startTime: [oldTime, currentTime]
  })
}

onMounted(() => {
  init()
})
const init = async () => {
  const res = await getAfterSalesTopApi()
  res.data.searchEnum.unshift({
    label: t('productcategory.all'),
    value: ''
  })
  RadioList.value = res.data.searchEnum
  res.data.afterSalesTypeEnum.unshift({
    label: t('productcategory.all'),
    value: ''
  })
  afterSalesTypeEnum.value = res.data.afterSalesTypeEnum
  getList()
}

const changeRadio = () => {
  currentPage.value = 1
  getList()
}
//dialog
// const writeRef = ref<ComponentRef<typeof Write>>()
</script>
