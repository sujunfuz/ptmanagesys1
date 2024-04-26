<template>
  <ContentWrap>
    <div class="flex justify-between">
      <ElRadioGroup
        v-hasPermi="'goods:ecSpu:list'"
        v-model="tabPosition"
        style="margin-bottom: 20px"
        @change="setSearchParams"
      >
        <ElRadioButton label="">{{ t('productcategory.all') }}</ElRadioButton>
        <ElRadioButton label="PUT_ON_SALE">{{ t('orderManage.tip1') }}</ElRadioButton>
        <ElRadioButton label="UNDER_AUDIT">{{ t('orderManage.tip2') }}</ElRadioButton>
        <ElRadioButton label="ILLEGAL_GOODS">{{ t('orderManage.tip3') }}</ElRadioButton>
        <ElRadioButton label="DRAFT">{{ t('orderManage.tip4') }}</ElRadioButton>
        <ElRadioButton label="RECYCLING">{{ t('orderManage.tip5') }}</ElRadioButton>
      </ElRadioGroup>
      <ElButton
        type="primary"
        v-hasPermi="'goods:ecSpu:add'"
        @click="push({ path: '/mallManagement/productList/detail', query: { id: '' } })"
        >{{ t('project.add') }}</ElButton
      >
    </div>
    <div>
      <Search
        v-hasPermi="'goods:ecSpu:list'"
        :schema="schema"
        @reset="setSearchParams"
        @search="setSearchParams"
      />
    </div>
  </ContentWrap>

  <ContentWrap class="mt-18px flex-1" :isBlock="false">
    <div>
      <div class="flex-c p-20px">
        <span class="subString"
          >{{ t('project.yisel') }}<span class="colorMain">&nbsp;{{ chooseCount }}&nbsp;</span
          >{{ t('checkPrice.checkPrice') }}</span
        >
        <div
          v-hasPermi="'goods:ecSpu:delete'"
          class="aCustomBtn"
          @click="batchDelete"
          :class="chooseCount > 0 ? 'customBtnHover' : ''"
        >
          {{ t('project.delete') }}
        </div>
      </div>
      <div>
        <Table
          v-model:pageSize="pageSize"
          v-model:currentPage="currentPage"
          :columns="columns"
          @select="handleSelectionChange"
          @select-all="handleSelectionAllChange"
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
      </div>
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
  ElInput,
  ElCascader,
  ElMessage,
  ElMessageBox
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
import {
  getListApi,
  deleteApi,
  getTreeApi,
  getTopApi,
  getUpdateShowStatusByIdApi,
  updatedInventoryApi,
  revokeGoodsAuditRecord
} from '@/api/mallManagement/productList'
import { getInventoryRule } from '@/api/RuleManage/OrderRule'
import { Console } from 'console'

const { push } = useRouter()

const chooseCount = ref(0)

const tabPosition = ref('')
const categoryTreeList = ref<any>([])

const batchDelete = async () => {
  const res = await deleteApi(selectChose.value)
  if (res.code == 200) {
    ElMessage.success(t('common.operateSuccess'))
    getList()
    chooseCount.value = 0
  }
}
const goodsSortTypeEnum = ref()
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
  },
  {
    field: 'categoryId',
    formItemProps: {
      slots: {
        default: (data) => {
          return (
            <>
              <div
                class={[
                  'w-280px',
                  'flex-c',
                  'border-rd-4px',
                  'specialInput',
                  'border-(#dcdfe6 solid 1px )'
                ]}
              >
                <div class="color-#b0b4b7 w-70px text-center ml-10px">
                  {t('productcategory.form1')}
                </div>
                <div style="background-color: #dcdfe6;width: 0.5px;height: 23px;margin-left: 10px;"></div>
                <ElCascader
                  clearable
                  v-model={data.categoryId}
                  options={categoryTreeList.value}
                  props={{
                    value: 'id',
                    label: 'categoryName'
                  }}
                  show-all-levels={false}
                  class="ml-1px"
                />
              </div>
            </>
          )
        }
      }
    }
  },
  {
    field: 'sortType',
    label: '',
    component: 'Select',
    componentProps: {
      options: goodsSortTypeEnum,
      slots: {
        prefix: () => <div>{t('productList.sortWay')}</div>
      }
    }
  }
])

const searchParams = ref({})
const setSearchParams = (params: any) => {
  //   currentPage.value = 1
  searchParams.value = params
  if (searchParams.value.categoryId) {
    searchParams.value.categoryId =
      searchParams.value.categoryId[searchParams.value.categoryId.length - 1]
  }

  getList()
}

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

const { tableRegister, tableMethods, tableState } = useTable({
  fetchDataApi: async () => {
    let arr1 = ['PUT_ON_SALE', 'ILLEGAL_GOODS', 'DRAFT', 'RECYCLING']
    let arr2 = ['UNDER_AUDIT', 'SUCCESS_AUDIT', 'FAIL_AUDIT']
    let showStatus = ''
    let auditStatus = ''
    if (arr1.includes(tabPosition.value)) {
      showStatus = tabPosition.value
    }
    if (arr2.includes(tabPosition.value)) {
      auditStatus = tabPosition.value
    }
    const { currentPage, pageSize } = tableState
    const res = await getListApi({
      currentPage: unref(currentPage),
      pageSize: unref(pageSize),
      ...unref(searchParams),
      showStatus: showStatus,
      auditStatus: auditStatus
    })

    res.data.list.forEach((item) => chuli(item))
    return {
      list: res.data.list || [],
      total: res.data.total || 0
    }
  },
  immediate: false
})

onMounted(() => {
  init()
})

const params = ref(0)
const addressMenuTree = (obj, len) => {
  if (len == 3) {
    return
  }
  if (obj.children && obj.children.length > 0) {
    for (const a of obj.children) {
      addressMenuTree(a, len + 1)
    }
  } else {
    obj.disabled = true
  }
}
const init = async () => {
  const res1 = await getTopApi()
  if (res1.code == 200) {
    goodsSortTypeEnum.value = res1.data.goodsSortTypeEnum
  }

  const res = await getTreeApi()
  if (res.code == 200) {
    for (const a of res.data) {
      addressMenuTree(a, 1)
    }
    categoryTreeList.value = res.data
  }

  const res2 = await getInventoryRule()
  if (res2.code == 200) {
    params.value = Number(res2.data[0].param)
  }
  getList()
}

const { loading, dataList, total, currentPage, pageSize } = tableState
const { getList, refresh } = tableMethods

const { t } = useI18n()

const clickImage = (data) => {
  createImageViewer({
    urlList: [data]
  })
}

const selectChose = ref({})

const handleSelectionChange = (row) => {
  selectChose.value = row.map((item) => item.id)
  chooseCount.value = row.length
}

const handleSelectionAllChange = (row) => {
  if (!row.length) {
    chooseCount.value = 0
    selectChose.value = {}
  } else {
    let obj = {}
    let peon = dataList.value.reduce((cur, next) => {
      obj[next.id] ? '' : (obj[next.id] = true && cur.push(next))
      return cur
    }, [])
    selectChose.value = peon.map((item) => item.id)
    chooseCount.value = peon.length
  }
}

const editClick = (data) => {
  openInventoryTag.value = data
}
const mouseEnter = (data) => {
  openInventoryMouse.value = data
}

const openInventoryTag = ref('')
const openInventoryMouse = ref('')

const updatedInventory = async (number, id) => {
  var reg = /^\d+$/
  if (reg.test(number)) {
    const res = await updatedInventoryApi(id, number)
    if (res.code == 200) {
      ElMessage.success(t('common.operateSuccess'))
      openInventoryTag.value = ''
      openInventoryMouse.value = ''
      getList()
    }
  } else {
    ElMessage.warning(t('common.b14'))
  }
}

{
  /* <span class="colorfff bgcolorMainRed p-6px border-rd-40% ml-2">库存不足</span> */
}
const imgUrl = import.meta.env.VITE_IMG_URL
const columns = reactive<TableColumn[]>([
  {
    field: 'selection',
    type: 'selection'
  },
  {
    field: 'id',
    label: t('productList.info'),
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
                <div style="width: 360px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis">
                  {name}
                </div>
                <div class="colorGrey font-size-14px ">ID：{id}</div>
                <div class="flex colorGrey font-size-15px mt-6px">
                  <div class="mr-10px flex-c">
                    <Icon icon="ep:goods" class="mt-2px" />
                    <span class="ml-4px">{saleNum}</span>
                  </div>
                  <div class="mr-10px flex-c">
                    <Icon icon="ep:star" class="mt-2px" />
                    <span class="ml-4px">{collectNum}</span>
                  </div>
                  <div class="mr-10px flex-c">
                    <Icon icon="ep:view" class="mt-2px" />
                    <span class="ml-4px">{clickNum}</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )
      }
    }
  },
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
            <div class={data.row.expandFlag == 1 || data.row.expandFlag == 2 ? 'mt-20px' : ''}>
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
                  class="color-colorMain font-size-14px w-100% text-center cursor-pointer"
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
    field: 'inventory',
    label: t('productList.inventory'),
    minWidth: '150px',
    slots: {
      default: (data) => {
        let list = data.row.skuList
        return (
          <>
            {list.map((item, index) => {
              if (index > 2 && data.row.expandFlag == 1) {
                return ''
              }
              const temp = data.row.id + ',' + item.id
              if (openInventoryTag.value == temp) {
                return (
                  <>
                    <div class="flex h-40px" key={index}>
                      <span onClick={() => editClick(temp)}></span>
                      <ElInput style="width: 60px;height: 32px" v-model={item.realInventory} />
                      <ElButton
                        type="primary"
                        class="ml-5px"
                        onClick={() => updatedInventory(item.realInventory, item.id)}
                      >
                        {t('project.confirm')}
                      </ElButton>
                    </div>
                  </>
                )
              } else {
                if (openInventoryMouse.value == temp) {
                  const inventoryWarning = data.row.inventoryWarning
                  if (inventoryWarning) {
                    if (item.realInventory < inventoryWarning) {
                      return (
                        <>
                          <div class="flex h-40px">
                            <span>{item.realInventory}</span>
                            <span class="colorfff mt-2px bgcolorMainRed h-20px text-center line-height-20px w-50px border-rd-10px font-size-11px ml-2">
                              {t('common.b18')}
                            </span>
                            <span
                              v-hasPermi="goods:ecSku:updateInventory"
                              onClick={() => editClick(temp)}
                              onMouseenter={() => mouseEnter(temp)}
                            >
                              <Icon class="ml-1 mt-2px" id="iconEditInvisible" icon="ep:edit" />
                            </span>
                          </div>
                        </>
                      )
                    } else {
                      return (
                        <>
                          <div class="flex h-40px">
                            <span>{item.realInventory}</span>
                            <span
                              v-hasPermi="goods:ecSku:updateInventory"
                              onClick={() => editClick(temp)}
                              onMouseenter={() => mouseEnter(temp)}
                            >
                              <Icon class="ml-1 mt-2px" id="iconEditInvisible" icon="ep:edit" />
                            </span>
                          </div>
                        </>
                      )
                    }
                  } else {
                    if (item.realInventory < params.value) {
                      return (
                        <>
                          <div class="flex h-40px">
                            <span>{item.realInventory}</span>
                            <span class="colorfff mt-2px bgcolorMainRed h-20px text-center line-height-20px w-50px border-rd-10px font-size-11px ml-2">
                              {t('common.b18')}
                            </span>
                            <span
                              v-hasPermi="goods:ecSku:updateInventory"
                              onClick={() => editClick(temp)}
                              onMouseenter={() => mouseEnter(temp)}
                            >
                              <Icon class="ml-1 mt-2px" id="iconEditInvisible" icon="ep:edit" />
                            </span>
                          </div>
                        </>
                      )
                    } else {
                      return (
                        <>
                          <div class="flex h-40px">
                            <span>{item.realInventory}</span>
                            <span
                              v-hasPermi="goods:ecSku:updateInventory"
                              onClick={() => editClick(temp)}
                              onMouseenter={() => mouseEnter(temp)}
                            >
                              <Icon class="ml-1 mt-2px" id="iconEditInvisible" icon="ep:edit" />
                            </span>
                          </div>
                        </>
                      )
                    }
                  }
                } else {
                  const inventoryWarning = data.row.inventoryWarning
                  if (inventoryWarning) {
                    if (item.realInventory < inventoryWarning) {
                      return (
                        <>
                          <div class="flex h-40px">
                            <span>{item.realInventory}</span>
                            <span class="colorfff mt-2px bgcolorMainRed h-20px text-center line-height-20px w-50px border-rd-10px font-size-11px ml-2">
                              {t('common.b18')}
                            </span>
                            <span
                              v-hasPermi="goods:ecSku:updateInventory"
                              onClick={() => editClick(temp)}
                              onMouseenter={() => mouseEnter(temp)}
                            >
                              <Icon
                                class="ml-1 invisible mt-2px"
                                id="iconEditInvisible"
                                icon="ep:edit"
                              />
                            </span>
                          </div>
                        </>
                      )
                    } else {
                      return (
                        <>
                          <div class="flex h-40px">
                            <span>{item.realInventory}</span>
                            <span
                              v-hasPermi="goods:ecSku:updateInventory"
                              onClick={() => editClick(temp)}
                              onMouseenter={() => mouseEnter(temp)}
                            >
                              <Icon
                                class="ml-1 invisible mt-2px"
                                id="iconEditInvisible"
                                icon="ep:edit"
                              />
                            </span>
                          </div>
                        </>
                      )
                    }
                  } else {
                    if (item.realInventory < params.value) {
                      return (
                        <>
                          <div class="flex h-40px">
                            <span>{item.realInventory}</span>
                            <span class="colorfff mt-2px bgcolorMainRed h-20px text-center line-height-20px w-50px border-rd-10px font-size-11px ml-2">
                              {t('common.b18')}
                            </span>
                            <span
                              v-hasPermi="goods:ecSku:updateInventory"
                              onClick={() => editClick(temp)}
                              onMouseenter={() => mouseEnter(temp)}
                            >
                              <Icon
                                class="ml-1 invisible mt-2px"
                                id="iconEditInvisible"
                                icon="ep:edit"
                              />
                            </span>
                          </div>
                        </>
                      )
                    } else {
                      return (
                        <>
                          <div class="flex h-40px">
                            <span>{item.realInventory}</span>
                            <span
                              v-hasPermi="goods:ecSku:updateInventory"
                              onClick={() => editClick(temp)}
                              onMouseenter={() => mouseEnter(temp)}
                            >
                              <Icon
                                class="ml-1 invisible mt-2px"
                                id="iconEditInvisible"
                                icon="ep:edit"
                              />
                            </span>
                          </div>
                        </>
                      )
                    }
                  }
                }
              }
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
    field: 'status',
    label: t('project.status'),
    slots: {
      default: (data) => {
        const showStatus = data.row.showStatus
        const showStatusStr = data.row.showStatusStr
        const auditStatus = data.row.auditStatus
        const auditStatusStr = data.row.auditStatusStr
        return (
          <>
            <ElTag
              type={
                showStatus == 'PUT_ON_SALE'
                  ? 'success'
                  : showStatus == 'PULL_OFF_SHELVES'
                  ? 'danger'
                  : 'info'
              }
            >
              {showStatusStr}
            </ElTag>
            <div class="mt-10px" />
            {auditStatus != 'WAIT_AUDIT' ? (
              <ElTag
                type={
                  auditStatus == 'SUCCESS_AUDIT'
                    ? 'success'
                    : auditStatus == 'FAIL_AUDIT'
                    ? 'danger'
                    : 'warning'
                }
              >
                {auditStatusStr}
              </ElTag>
            ) : (
              <div>-</div>
            )}
          </>
        )
      }
    }
  },
  {
    field: 'action',
    label: t('exampleDemo.operate'),
    width: '200px',
    fixed: 'right',
    slots: {
      default: (data) => {
        let status = data.row.showStatus
        let auditStatus = data.row.auditStatus
        let row = data.row
        if (status == 'PULL_OFF_SHELVES' || status == 'DRAFT' || status == 'RECYCLING') {
          return (
            <>
              <div class="[&>span]:(cursor-pointer m-2) flex flex-wrap colorMain ">
                <span
                  v-hasPermi="goods:ecSpu:view"
                  onClick={() => {
                    push({
                      path: '/mallManagement/productList/showdetail',
                      query: { id: data.row.id }
                    })
                  }}
                >
                  {t('project.detail')}
                </span>
                <span v-hasPermi="goods:ecSpu:edit" onClick={() => clickEdit(data.row.id)}>
                  {t('project.edit2')}
                </span>
                <br />
                <span
                  v-hasPermi="goods:ecSpu:updateShowStatus"
                  v-show={ row.showStatus != 'ILLEGAL_GOODS' && row.showStatus != 'DRAFT' && row.showStatus != 'RECYCLING'}
                  onClick={() => changeStatus(data.row.id, 'PUT_ON_SALE')}
                >
                  {t('RotationChart.grounding')}
                </span>
                {auditStatus == 'UNDER_AUDIT' ? (
                  <span
                    v-hasPermi="goods:ecSpu:revokeGoodsAuditRecord"
                    onClick={() => withdrawAction(data.row)}
                  >
                    {t('Replenishment.withdraw')}
                  </span>
                ) : (
                  ''
                )}
              </div>
            </>
          )
        } else {
          return (
            <>
              <div class="[&>span]:(cursor-pointer m-2) flex flex-wrap colorMain ">
                {/* <ElButton
                v-hasPermi="goods:ecSpu:edit"
                type="primary"
                text
                onClick={() => clickEdit(data.row.id)}
              >
                {t('project.edit2')}
              </ElButton> */}

                {/* <br /> */}
                <span
                  v-hasPermi="goods:ecSpu:view"
                  onClick={() => {
                    push({
                      path: '/mallManagement/productList/showdetail',
                      query: { id: data.row.id }
                    })
                  }}
                >
                  {t('project.detail')}
                </span>
                <span v-hasPermi="goods:ecSpu:edit" v-show={row.showStatus == 'ILLEGAL_GOODS'} onClick={() => clickEdit(data.row.id)}>
                  {t('project.edit2')}
                </span>
                <span
                  v-hasPermi="goods:ecSpu:updateShowStatus"
                  v-show={ row.showStatus != 'ILLEGAL_GOODS' && row.showStatus != 'DRAFT' && row.showStatus != 'RECYCLING'}
                  onClick={() => changeStatus(data.row.id, 'PULL_OFF_SHELVES')}
                >
                  {t('RotationChart.Offshelf')}
                </span>
                {auditStatus == 'UNDER_AUDIT' ? (
                  <span
                    v-hasPermi="goods:ecSpu:revokeGoodsAuditRecord"
                    onClick={() => withdrawAction(data.row)}
                  >
                    {t('Replenishment.withdraw')}
                  </span>
                ) : (
                  ''
                )}
              </div>
              {/* <br /> */}
              {/* <ElButton type="primary" text onClick={() => actionFn(data)}>
                {t('orderManage.code')}
              </ElButton> */}
              {/* <ElDropdown trigger="click" onCommand={changSize}>
              {{
                default: () => {
                  return (
                    <>
                      <ElButton type="primary" text onClick={() => actionFn(data)}>
                        {t('project.more')}
                        <ElIcon>
                          <ArrowDown />
                        </ElIcon>
                      </ElButton>
                    </>
                  )
                },
                dropdown: () => {
                  return (
                    <ElDropdownMenu>
                      {{
                        default: () => {
                          return unref(sizeMap).map((v) => {
                            return (
                              <ElDropdownItem key={v} command={v}>
                                {t(`project.${v}`)}
                              </ElDropdownItem>
                            )
                          })
                        }
                      }}
                    </ElDropdownMenu>
                  )
                }
              }}
            </ElDropdown> */}
            </>
          )
        }
      }
    }
  }
])

const actionFn = (data: any) => {
  console.log(data)
}

const clickEdit = (id) => {
  push({ path: '/mallManagement/productList/detail', query: { id: id } })
}
const changeStatus = async (id, status) => {
  const res = await getUpdateShowStatusByIdApi(id, status)
  if (res.code == 200) {
    ElMessage.success(t('common.operateSuccess'))
    getList()
  }
}

const withdrawAction = (row) => {
  ElMessageBox.confirm(t('orderList.txt1'), {
    confirmButtonText: t('project.confirm'),
    cancelButtonText: t('project.cancel')
  })
    .then(async () => {
      const res = await revokeGoodsAuditRecord(row.id)
      if (res) {
        ElMessage.success(res.msg)
        getList()
      }
    })
    .catch(() => {})
}
</script>

<style lang="less" scoped>
.subString {
  color: #747474;
  font-size: 14px;
  margin-right: 10px;
}
</style>
