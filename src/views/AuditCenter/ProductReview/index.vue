<template>
  <ContentWrap v-hasPermi="'goods:ecSpuAudit:list'">
    <div>
      <ElRadioGroup v-model="tabPosition" style="margin-bottom: 20px" @change="setSearchParams">
        <ElRadioButton label="">{{ t('productList.block1') }}</ElRadioButton>
        <ElRadioButton v-for="(item, key) in goodsAuditStatusEnum" :key="key" :label="item.value"
          >{{ item.label }}({{ item.num }})</ElRadioButton
        >
      </ElRadioGroup>
    </div>
    <div>
      <Search :schema="schema" @reset="setSearchParams" @search="setSearchParams" />
    </div>
  </ContentWrap>

  <ContentWrap class="mt-20px flex-1" :isBlock="false">
    <div v-if="flag">
      <Table
        v-if="dataList.length != 0"
        v-model:pageSize="pageSize"
        v-model:currentPage="currentPage"
        :columns="columns"
        :data="dataList"
        :loading="loading"
        :pagination="{
          total: total,
          layout: ' ->, total, sizes, prev, pager, next, jumper',
          pageSize: pageSize,
          currentPage: currentPage
        }"
        @register="tableRegister"
        @refresh="refresh"
      />
      <Empty v-else />
    </div>
  </ContentWrap>
</template>

<script lang="tsx" setup>
import { ContentWrap } from '@/components/ContentWrap'
import Empty from '@/components/customComponents/Empty/index.vue'
import {
  ElRadioGroup,
  ElRadioButton,
  ElButton,
  ElOption,
  ElTag,
  ElImage,
  ElDropdown,
  TableColumnCtx,
  ElDropdownMenu,
  ElDropdownItem,
  ElIcon,
  ElInput
} from 'element-plus'
import { ArrowDown } from '@element-plus/icons-vue'
import { createImageViewer } from '@/components/ImageViewer'
import { ref, reactive, unref, onMounted } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import { Table, TableColumn } from '@/components/Table'
import { Search } from '@/components/Search'
import { SelectOption, FormSchema } from '@/components/Form'
import { useTable } from '@/hooks/web/useTable'
import { Icon } from '@iconify/vue'
import { useRouter } from 'vue-router'
import { getPageTopApi, getPageListApi } from '@/api/auditCenter/productReview'
import { getListAllApi } from '@/api/information'
const { push } = useRouter()

const tabPosition = ref('')

const chuli = (obj) => {
  for (const item of dataList.value) {
    if (item.id == obj.id) {
      obj.expandFlag = item.expandFlag
      return
    }
  }
  if (obj.skuList.length > 3) {
    obj.expandFlag = 1
  } else {
    obj.expandFlag = 0
  }
}

const schema = reactive<FormSchema[]>([
  {
    field: 'name',
    label: '',
    component: 'Input',
    componentProps: {
      slots: {
        prepend: () => <div>{t('productList.name')}</div>
        // append: () => <Icon icon="ep:share" />
      }
    }
  }
])

const flag = ref(false)
const goodsAuditStatusEnum = ref()
onMounted(() => {
  init()
})
const init = async () => {
  const res = await getPageTopApi()
  goodsAuditStatusEnum.value = res.data.goodsAuditStatusEnum
  getList()
}

const searchParams = ref({})
const setSearchParams = (params: any) => {
  currentPage.value = 1
  searchParams.value = params
  getList()
}

const dataListData = ref()

const imgUrl = import.meta.env.VITE_IMG_URL

const { tableRegister, tableMethods, tableState } = useTable({
  fetchDataApi: async () => {
    flag.value = false
    const { currentPage, pageSize } = tableState
    const res = await getPageListApi({
      currentPage: unref(currentPage),
      pageSize: unref(pageSize),
      ...unref(searchParams),
      auditStatus: tabPosition.value
    })

    flag.value = true
    res.data.list.forEach((item) => chuli(item))
    return {
      list: res.data.list || [],
      total: res.data.total || 0
    }
  },
  immediate: false
})
const { loading, dataList, total, currentPage, pageSize } = tableState
const { refresh, getList } = tableMethods

const { t } = useI18n()

const clickImage = (data) => {
  createImageViewer({
    urlList: [data]
  })
}

const columns = reactive<TableColumn[]>([
  {
    field: 'id',
    label: t('AuditCenter.productReview.name'),
    width: 480,
    slots: {
      default: (data) => {
        let imgArr = data.row.descriptionImgAddr.split(',')
        let image
        let arr = ref([])
        if (imgArr.length > 1) {
          imgArr.map((item) => {
            arr.value.push(imgUrl + item)
          })
          image = imgUrl + imgArr[0]
        } else {
          image = imgUrl + data.row.descriptionImgAddr
          arr.value = [image]
        }

        const name = data.row.name
        const id = data.row.id
        const saleNum = data.row.saleNum
        const collectNum = data.row.collectNum
        const clickNum = data.row.clickNum
        return (
          <>
            <div class="flex">
              <div onClick={() => clickImage(arr.value)}>
                <ElImage src={image} style="width:80px;height: 80px"></ElImage>
              </div>

              <div style="width: 360px;" class="ml-10px">
                <div style="font-size:15px;width: 360px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis">
                  {name}
                </div>
                <div class="colorGrey font-size-14px mt-4px">ID：{id}</div>
                {/* <div class="flex colorGrey font-size-15px mt-6px">
                  <div class="mr-10px">
                    <Icon icon="ep:goods" class="mt-2px" />
                    <span class="ml-3px">{saleNum}</span>
                  </div>
                  <div class="mr-10px">
                    <Icon icon="ep:collectNum" class="mt-2px" />
                    <span class="ml-3px">{collectNum}</span>
                  </div>
                  <div class="mr-10px">
                    <Icon icon="ep:view" class="mt-2px" />
                    <span class="ml-3px">{clickNum}</span>
                  </div>
                </div> */}
              </div>
            </div>
          </>
        )
      }
    }
  },
  // {
  //   field: 'specifications',
  //   label: t('AuditCenter.productReview.specifications'),
  //   slots: {
  //     default: (data) => {
  //       const specifications = data.row.specifications
  //       const id = data.row.id
  //       const startString = specifications.indexOf(t('project.seeMore'))
  //       if (startString != 0) {
  //         return (
  //           <>
  //             <div onClick={() => getMoreClick(id)}>{specifications}</div>
  //           </>
  //         )
  //       } else {
  //         return (
  //           <>
  //             <div onClick={() => getMoreClick(id)} class="colorMain text-center cursor-pointer">
  //               {specifications}
  //               <ElIcon>
  //                 <ArrowDown />
  //               </ElIcon>
  //             </div>
  //           </>
  //         )
  //       }
  //     }
  //   }
  // },
  // {
  //   field: 'batchPrice',
  //   label: t('AuditCenter.productReview.batchPrice'),
  //   slots: {
  //     default: () => {
  //       return null
  //     }
  //   }
  // },
  {
    field: 'specifications',
    label: t('productList.specifications'),
    slots: {
      default: (data) => {
        let list = data.row.skuList
        return (
          <>
            {list.map((item, index) => {
              let temp = JSON.parse(item.ownSpec)
              let str = ''
              for (var i in temp) {
                str += temp[i]
              }

              if (index > 2 && data.row.expandFlag == 1) {
                return ''
              }
              return (
                <div class="flex h-40px" key={index}>
                  {str}
                </div>
              )
            })}
            {data.row.expandFlag == 0 ? (
              ''
            ) : (
              <div
                onClick={() => {
                  data.row.expandFlag == 1 ? (data.row.expandFlag = 2) : (data.row.expandFlag = 1)
                }}
                class="color-colorMain font-size-14px w-100% text-center cursor-pointer"
              >
                {/* {t('project.seeMore') +
                  '(' +
                  t('project.total') +
                  list.length +
                  t('project.specifications') +
                  ')'} */}
              </div>
            )}
          </>
        )
      }
    }
  },
  {
    field: 'batchPrice',
    label: t('productList.batchPrice'),
    width: '200px',
    slots: {
      default: (data) => {
        let list = data.row.skuList
        return (
          <>
            <div class={data.row.expandFlag == 1 || data.row.expandFlag == 2 ? 'mt-22px' : ''}>
              {list.map((item, index) => {
                if (index > 2 && data.row.expandFlag == 1) {
                  return ''
                }
                return (
                  <div class={['flex', 'h-40px']} key={index}>
                    ￥{JSON.parse(item.rangePrice)[0].price}
                  </div>
                )
              })}
              {data.row.expandFlag == 2 ? (
                <div
                  onClick={() => {
                    data.row.expandFlag == 2 ? (data.row.expandFlag = 1) : (data.row.expandFlag = 2)
                  }}
                  class="color-colorMain font-size-14px w-100% text-center cursor-pointer"
                >
                  {t('common.shrink')}
                </div>
              ) : (
                <div
                  onClick={() => {
                    data.row.expandFlag == 1 ? (data.row.expandFlag = 2) : (data.row.expandFlag = 1)
                  }}
                  class="color-colorMain font-size-14px w-100% text-left cursor-pointer"
                >
                  {data.row.expandFlag == 1
                    ? t('project.seeMore') +
                      '(' +
                      t('project.total') +
                      list.length +
                      t('project.specifications') +
                      ')'
                    : ''}
                </div>
              )}
            </div>
          </>
        )
      }
    }
  },
  {
    field: 'companyName',
    label: t('AuditCenter.productReview.company'),
    slots: {
      default: () => {
        return null
      }
    }
  },
  {
    field: 'auditStatus',
    label: t('AuditCenter.productReview.status'),
    slots: {
      default: (data) => {
        const auditStatus = data.row.auditStatus
        const auditStatusStr = data.row.auditStatusStr
        return (
          <>
            <ElTag
              type={
                auditStatus == 'SUCCESS_AUDIT'
                  ? 'success'
                  : auditStatus == 'FAIL_AUDIT'
                  ? 'danger'
                  : 'info'
              }
            >
              {auditStatusStr}
            </ElTag>
          </>
        )
      }
    }
  },
  {
    field: 'auditReason',
    label: t('AuditCenter.productReview.reason'),
    slots: {
      default: () => {
        return null
      }
    }
  },
  {
    field: 'createTimeStr',
    label: t('AuditCenter.productReview.time'),
    slots: {
      default: () => {
        return null
      }
    }
  },
  {
    field: 'action',
    label: t('exampleDemo.operate'),
    width: '100px',
    slots: {
      default: (data) => {
        return (
          <>
            <ElButton
              type="primary"
              text
              v-hasPermi="goods:ecSpuAudit:view"
              onClick={() => {
                push({
                  path: '/auditcenter/productreview/productdetail',
                  query: { id: data.row.id }
                })
              }}
            >
              {t('project.detail')}
            </ElButton>
          </>
        )
      }
    }
  }
])
</script>

<style lang="less" scoped>
.subString {
  color: #747474;
  font-size: 14px;
  margin-right: 10px;
}
</style>
