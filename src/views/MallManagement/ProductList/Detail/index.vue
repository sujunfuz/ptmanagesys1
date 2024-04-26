<template>
  <div>
    <ContentWrap>
      <div>
        <Steps
          :currentStep="1"
          :totalSteps="5"
          :stepsDesc="stepsDesc"
          :stepsLabel="stepsLabel"
          @change="onChange"
        />
      </div>
    </ContentWrap>
    <ContentWrap id="info" class="mt-20px">
      <div>{{ t('companyRole.step1') }}</div>
      <Form
        class="mt-20px baseClass"
        :rules="rules"
        @register="formRegister"
        :schema="baseSchema"
      />
    </ContentWrap>
    <ContentWrap id="attribute" class="mt-20px">
      <div
        >{{ t('orderManage.commodity') + t('common.stats') }}
        <span class="colorGrey font-size-3 ml-13px">{{ t('serviceDetail.sub7') }}</span>
      </div>

      <div v-show="!category" class="colorMain mt-20px">{{ t('serviceDetail.sub8') }}</div>
      <Form
        v-show="category"
        class="mt-20px"
        :schema="AttributesSchema"
        @register="categoryForm.formRegister"
      />
    </ContentWrap>
    <ContentWrap id="specifications" class="mt-20px">
      <div>{{ t('serviceDetail.sub9') }}</div>
      <div v-show="!category" class="colorMain mt-20px">{{ t('serviceDetail.sub8') }}</div>
      <div v-show="category" class="ml-10px">
        <Index ref="tableListRef" />
      </div>
    </ContentWrap>
    <ContentWrap id="detail" class="mt-20px">
      <div>{{ t('productList.detail') }}</div>
      <div v-show="!category" class="colorMain mt-20px">{{ t('serviceDetail.sub8') }}</div>
      <Editor
        v-show="category"
        v-model="defaultHtml"
        :editor-config="editorConfig"
        class="mt-20px"
        ref="editorRef"
      />
    </ContentWrap>
    <ContentWrap id="package" class="mt-20px">
      <div>{{ t('productList.sub') }}</div>
      <div v-show="!category" class="colorMain mt-20px">{{ t('serviceDetail.sub8') }}</div>
      <div v-show="category" class="mt-20px">
        <el-form ref="ruleFormRef" :model="form" label-width="80px" :rules="rules1">
          <el-form-item :label="t('productList.weight')">
            <el-input
              v-model="form.packageWeight"
              style="width: 200px"
              type="number"
              :placeholder="t('common.inputText')"
            >
              <template #append>g</template>
            </el-input>
          </el-form-item>
          <el-form-item :label="t('productList.size')">
            <div class="flex">
              <span>
                <el-input
                  v-model="form.packageSize1"
                  style="width: 200px"
                  type="number"
                  :placeholder="t('productList.length')"
                >
                  <template #append>cm</template>
                </el-input>
              </span>
              <span class="ml-10px mr-10px">*</span>
              <span>
                <el-input
                  v-model="form.packageSize2"
                  style="width: 200px"
                  type="number"
                  :placeholder="t('productList.width')"
                >
                  <template #append>cm</template>
                </el-input>
              </span>
              <span class="ml-10px mr-10px">*</span>
              <span>
                <el-input
                  v-model="form.packageSize3"
                  style="width: 200px"
                  type="number"
                  :placeholder="t('productList.height')"
                >
                  <template #append>cm</template>
                </el-input>
              </span>
            </div>
          </el-form-item>
          <el-form-item :label="t('productList.day')" prop="deliverTime">
            <el-input
              v-model="form.deliverTime"
              style="width: 200px"
              type="number"
              :placeholder="t('common.inputText')"
            >
              <template #append>{{ t('productList.days') }}</template>
            </el-input>
          </el-form-item>
          <el-form-item :label="t('productList.freight')" prop="freightType">
            <el-radio-group v-model="form.freightType" class="w-100% mt--4px">
              <el-radio
                :label="item.value"
                size="large"
                v-for="(item, index) in freightTypeEnum"
                :key="index"
                >{{ item.label }}</el-radio
              >
            </el-radio-group>
          </el-form-item>
          <el-form-item
            v-if="form.freightType == 'UNIFICATION_PRICE'"
            class="mt--5px"
            prop="freightAmount"
          >
            <el-input
              v-model="form.freightAmount"
              style="width: 200px"
              type="number"
              :placeholder="t('common.inputText')"
            >
              <template #append>{{ t('productList.yuan') }}</template>
            </el-input>
          </el-form-item>
          <el-form-item class="mt--5px" v-else>
            <el-select v-model="form.freightFormwork" :placeholder="t('project.select')">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item class="mt--5px" :label="t('Freight.way')" prop="transportType">
            <el-select v-model="form.transportType">
              <el-option
                v-for="item in transportTypeEnum"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item class="mt--5px" :label="t('productList.source')" prop="sourceType">
            <el-select v-model="form.sourceType">
              <el-option
                v-for="item in sourceTypeEnum"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item class="mt--5px" :label="t('OrderRule.title3')" prop="inventoryWarning">
            <el-input
              v-model="form.inventoryWarning"
              style="width: 200px"
              type="number"
              :placeholder="t('common.inputText')"
            />
          </el-form-item>
        </el-form>
      </div>
    </ContentWrap>
    <ContentWrap class="mt-20px">
      <div class="text-right">
        <el-button @click="push('/mallManagement/productList')">{{ t('common.cancel') }}</el-button>
        <el-button type="primary" @click="add(ruleFormRef, 'DRAFT')">{{
          t('common.draft')
        }}</el-button>
        <el-button type="primary" @click="add(ruleFormRef, 'PULL_OFF_SHELVES')">{{
          t('project.confirm')
        }}</el-button>
      </div>
    </ContentWrap>
  </div>
</template>

<script setup lang="tsx">
import { ContentWrap } from '@/components/ContentWrap'
import { ref, reactive, onMounted, watch, unref, nextTick } from 'vue'
import Steps from '@/components/customComponents/ProductSteps/index.vue'
import Index from '../Detail/components/index.vue'
import { Form, FormSchema } from '@/components/Form'
import { useI18n } from '@/hooks/web/useI18n'
import { useValidator } from '@/hooks/web/useValidator'
import { useForm } from '@/hooks/web/useForm'
import { Editor } from '@/components/Editor'
import UploadImage from '@/components/UploadImage/UploadImage.vue'
import { IDomEditor } from '@wangeditor/editor'
import { useRouter } from 'vue-router'
import {
  ElButton,
  ElInput,
  ElSelect,
  ElOption,
  ElForm,
  ElFormItem,
  ElRadio,
  ElRadioGroup,
  ElMessage,
  ElIcon,
  ElMessageBox
} from 'element-plus'
import {
  getTreeApi,
  postAttrApi,
  getTopApi,
  addApi,
  editApi,
  getQueryByIdApi,
  queryByMerchantNoApi
} from '@/api/mallManagement/productList'
import type { FormInstance, FormRules } from 'element-plus'
import { useStorage } from '@/hooks/web/useStorage'
import { useAppStore } from '@/store/modules/app'
// import { useStorage } from '@/hooks/web/useStorage'
const { getStorage } = useStorage('localStorage')
const bossToken = getStorage('TOKEN')
const ruleFormRef = ref<FormInstance>()

const container = ref(Array<HTMLElement>)
const appStore = useAppStore()

const { push, currentRoute } = useRouter()
const options3 = ref([])
const transportTypeEnum = ref([])
const sourceTypeEnum = ref([])
const freightTypeEnum = ref()

const actionId = ref()

const imgUrl = import.meta.env.VITE_IMG_URL

const actionType = ref('add')
const getLocalStorage = useStorage('localStorage')

const options = ref<Array<any>>([])
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
onMounted(async () => {
  actionId.value = currentRoute.value.query.id
  if (actionId.value) {
    appStore.setRenderLoading(true)
  }

  container.value[0] = document.getElementById('info')
  container.value[1] = document.getElementById('attribute')
  container.value[2] = document.getElementById('specifications')
  container.value[3] = document.getElementById('detail')
  container.value[4] = document.getElementById('package')

  const temp = getLocalStorage.getStorage('ptUserInfo').topMerchantNo
  const res2 = await queryByMerchantNoApi(temp)
  if (res2.code == 200) {
    for (var item in res2.data) {
      options.value.push({
        label: res2.data[item].templateName,
        value: res2.data[item].id
      })
    }
  }

  const res = await getTreeApi()
  const res1 = await getTopApi()

  if (res1.code == 200) {
    freightTypeEnum.value = res1.data.freightTypeEnum
    transportTypeEnum.value = res1.data.transportTypeEnum
    sourceTypeEnum.value = res1.data.sourceTypeEnum
  }

  if (res.code == 200) {
    for (const a of res.data) {
      addressMenuTree(a, 1)
    }
    options3.value = res.data
  }

  if (actionId.value) {
    const ares = await getQueryByIdApi(actionId.value)
    actionType.value = 'edit'
    await changeFormat(ares)
  }
})
const { t } = useI18n()

const tableListRef = ref<ComponentRef<typeof Index>>()

const changeFormat = async (row: any) => {
  let temp = row.data.descriptionImgAddr.split(',')
  let temp1 = row.data.descriptionImgAddr
  let data = row.data
  let arr = []
  temp.map((item) => {
    arr.push({ url: item })
  })

  // 回显商品图片
  descriptionImgAddr.value = arr

  if (data.categoryId) {
    let allArr = getSelect(data.categoryId, options3.value)
    // category.value = allArr[allArr.length - 1]
    category.value = allArr
    // 回显商品属性枚举
    const categoryResult = await postAttrApi({
      categoryId: category.value[category.value.length - 1]
    })
    if (categoryResult.code == 200) {
      attributeList.value = categoryResult.data
      intoDatatoAttribute()
    }
    setValues({
      categoryId: allArr[allArr.length - 1]
    })
  }

  if (data.goodsAttrList.length != 0) {
    // 回显商品属性值
    for (let i = 0; i < data.goodsAttrList.length; i++) {
      categoryForm.formMethods.setValues({
        [data.goodsAttrList[i].attrId]: data.goodsAttrList[i].attrValue
      })
    }
  }

  // 回显商品详情
  defaultHtml.value = data.spuDetail.goodsDetail

  // 回显包装与运输
  form.value = {
    packageWeight: data.packageWeight,
    packageSize1: data.packageSize.split(',')[0],
    packageSize2: data.packageSize.split(',')[1],
    packageSize3: data.packageSize.split(',')[2],
    deliverTime: data.deliverTime,
    freightType: data.freightType,
    freightAmount: data.freightAmount,
    transportType: data.transportType,
    freightFormwork: data.freightFormwork,
    inventoryWarning: data.inventoryWarning,
    sourceType: data.sourceType
  }
  form.value.packageSize = data.packageSize

  // 回显规格
  let specialSpecTemp = JSON.parse(data.spuDetail.specialSpec)
  let specialSpecArr = []
  let arrHeaderItemArr = []
  let index = 0
  for (let key in specialSpecTemp) {
    specialSpecArr.push({ specifications: key, option: specialSpecTemp[key] })
    arrHeaderItemArr.push({ label: key, field: 'spec' + (index + 1) })
    index++
  }

  let arrHeaderItemArr2Temp = []
  let Arr2index = 0
  let blockItemTemp = []
  let arrHeaderItemArr2 = JSON.parse(data.skuList[0].rangePrice)
  for (let key1 in arrHeaderItemArr2) {
    arrHeaderItemArr2Temp.push({
      field: 'price' + (Arr2index + 1),
      label: arrHeaderItemArr2[key1].startCount + '-' + arrHeaderItemArr2[key1].endCount
    })
    blockItemTemp.push({
      from: arrHeaderItemArr2[key1].startCount,
      to: arrHeaderItemArr2[key1].endCount,
      price: arrHeaderItemArr2[key1].price
    })
    Arr2index++
  }

  for (let item in data.skuList) {
    let a = JSON.parse(data.skuList[item].ownSpec)
    for (let i in a) {
      for (let j in arrHeaderItemArr) {
        if (arrHeaderItemArr[j].label == i) {
          data.skuList[item][arrHeaderItemArr[j].field] = a[i]
        }
      }
    }

    let b = JSON.parse(data.skuList[item].rangePrice)
    for (let m in b) {
      let n = b[m].startCount + '-' + b[m].endCount
      for (let j in arrHeaderItemArr2Temp) {
        if (arrHeaderItemArr2Temp[j].label == n) {
          data.skuList[item][arrHeaderItemArr2Temp[j].field] = b[m].price
        }
      }
    }

    // if (data.skuList[item].specCode == '0,0') {
    //   data.skuList[0].skuImgAddr = data.skuList[item].skuImgAddr
    //   tableListRef.value?.setSkuImgAddr([data.skuList[0].skuImgAddr])
    // }
    data.skuList[item].inventory = data.skuList[item].realInventory
    data.skuList[item].price = data.skuList[item].agentPrice
  }

  // for (let item in data.skuList) {
  //   data.skuList[item].skuImgAddr = data.skuList[0].skuImgAddr
  // }

  tableListRef.value?.setPriceBlock({
    cost: data.skuList[0].cost,
    price: data.skuList[0].agentPrice,
    inventory: data.skuList[0].realInventory
  })
  tableListRef.value?.setObjectItem(specialSpecArr)
  tableListRef.value?.setArrHeaderItem(arrHeaderItemArr)
  tableListRef.value?.setBlockItem(blockItemTemp)
  tableListRef.value?.setArrHeaderItem2(arrHeaderItemArr2Temp)
  tableListRef.value?.setChecked(data.skuList[0].agentDeliver == 'YES')

  //回显表格数据
  tableListRef.value?.setTableList(data.skuList)

  appStore.setRenderLoading(false)
  setValues({
    descriptionImgAddr: temp1,
    name: data.name
  })
}

const stepsLabel = ref([
  t('Freight.info'),
  t('orderManage.commodity') + t('common.stats'),
  t('serviceDetail.sub9'),
  t('productList.detail'),
  t('productList.sub')
])
const stepsDesc = [' ', ' ', ' ', ' ', ' ']
const onChange = (index) => {
  container.value[index - 1].scrollIntoView({
    block: 'start',
    behavior: 'instant'
  })
}

const form = ref({
  packageWeight: '',
  packageSize1: '',
  packageSize2: '',
  packageSize3: '',
  deliverTime: '',
  freightType: '',
  packageSize: '',
  freightAmount: '',
  freightFormwork: '',
  transportType: '',
  inventoryWarning: '',
  sourceType: ''
})

const { required, validNumber } = useValidator()
const defaultHtml = ref('')

const rules = reactive<any>({
  descriptionImgAddr: [required()],
  name: [required()],
  categoryId: [required()]
})

const rules1 = reactive<FormRules<any>>({
  deliverTime: [
    {
      required: true,
      trigger: 'blur',
      message: t('image.sub9')
    }
  ],
  freightType: [
    {
      required: true,
      trigger: 'change',
      message: t('image.sub10')
    }
  ],
  transportType: [required()],
  sourceType: [required()]
  // inventoryWarning: [validNumber()]
})

//递归获取选中的options
function getSelect(arr: any, menuList: any) {
  for (let a of menuList) {
    let firstArr = [a.id]
    if (a.id == arr) {
      return firstArr
    }
    if (a.children) {
      for (const b of a.children) {
        let secArr = [...firstArr]
        secArr.push(b.id)
        if (b.id == arr) {
          return secArr
        }
        if (b.children) {
          for (const c of b.children) {
            let thirdArr = [...secArr]
            thirdArr.push(c.id)
            if (c.id == arr) {
              return thirdArr
            }
          }
        }
      }
    }
  }
}

const cancel = () => {
  ElMessageBox.confirm(t('common.cancelDraft'), t('common.delWarning'), {
    confirmButtonText: t('project.confirm'),
    cancelButtonText: t('common.cancel')
  })
    .then(() => {})
    .catch(() => {})
}

const categoryForm = useForm()

const { formRegister, formMethods } = useForm()
const { setValues, getFormData, getElFormExpose } = formMethods

const category = ref()
const editorRef = ref<typeof Editor & EditorExpose>()

// const descriptionImgAddr = ref([])
// const img1Ref = ref()

// watch(
//   () => descriptionImgAddr.value.length,
//   async () => {
//     await formMethods.setValues({
//       descriptionImgAddr: img1Ref.value.getFileList()
//     })
//     const formEl = await formMethods.getElFormExpose()
//     await formEl?.validateField(['descriptionImgAddr'])
//   }
// )
const descriptionImgAddr = ref<any>([])
const attributeList = ref()
const baseSchema = ref<FormSchema[]>([
  {
    field: 'descriptionImgAddr',
    label: t('productList.img'),
    colProps: {
      span: 24
    },
    formItemProps: {
      slots: {
        default: (data) => {
          return (
            <>
              <div class="w-100%">
                <UploadImage
                  limit={9}
                  v-model={descriptionImgAddr.value}
                  onUpdateImgUrl={(val) => {
                    data.descriptionImgAddr = val
                  }}
                ></UploadImage>
              </div>
              <div class="el-upload__tip">
                {t('image.sub1')}
                <br />
                {t('image.sub2')}
              </div>
            </>
          )
        }
      }
    }
  },
  {
    field: 'name',
    label: t('productList.name'),
    component: 'Input',
    colProps: {
      span: 24
    },
    componentProps: {
      maxlength: 180,
      showWordLimit: true
    }
  },
  {
    field: 'categoryId',
    label: t('productList.category'),
    component: 'Cascader',
    colProps: {
      span: 24
    },
    componentProps: {
      style: {
        width: '100%'
      },
      filterable: true,
      options: options3,
      props: {
        value: 'id',
        label: 'categoryName'
        // checkStrictly: true
      },
      on: {
        change: async (data) => {
          category.value = data
          const res = await postAttrApi({
            categoryId: data[data.length - 1]
          })
          if (res.code == 200) {
            attributeList.value = res.data

            intoDatatoAttribute()
          }
        }
      }
    }
  }
])

const AttributesSchema = ref<FormSchema[]>([])

const intoDatatoAttribute = () => {
  AttributesSchema.value = []
  for (let i = 0; i < attributeList.value.length; i++) {
    if (attributeList.value[i].inputType == 'SELECT') {
      let temp = attributeList.value[i].attrValue.split(',')
      let arr = []
      temp.map((item) => {
        arr.push({
          label: item,
          value: item
        })
      })

      AttributesSchema.value.push({
        field: attributeList.value[i].id,
        label: attributeList.value[i].attrName,
        component: 'Select',
        colProps: {
          span: 12
        },
        formItemProps: {
          rules: attributeList.value[i].required == 'YES' ? [required()] : []
        },
        componentProps: {
          style: {
            width: '100%'
          },
          options: arr
        }
      })
    }
    if (attributeList.value[i].inputType == 'INPUT') {
      AttributesSchema.value.push({
        field: attributeList.value[i].id,
        label: attributeList.value[i].attrName,
        component: 'Input',
        colProps: {
          span: 12
        },
        formItemProps: {
          rules: attributeList.value[i].required == 'YES' ? [required()] : []
        },
        componentProps: {
          maxlength: 20,
          showWordLimit: true
        }
      })
    }
  }
}

const add = async (formEl: FormInstance | undefined, status) => {
  if (!formEl) return

  const elForm = await getElFormExpose()
  let valid
  let valid1
  let valid2
  // if (status != 'DRAFT') {
  valid = await elForm?.validate().catch((err) => {
    console.log(err)
  })

  const elForm1 = await categoryForm.formMethods.getElFormExpose()
  valid1 = await elForm1?.validate().catch((err) => {
    console.log(err)
  })

  valid2 = await formEl.validate().catch((err) => {
    console.log(err)
  })
  if (!defaultHtml.value) {
    ElMessage.warning(t('common.a19'))
    return
  }
  // }
  // if (status == 'DRAFT') {
  //   valid = true
  //   valid1 = true
  //   valid2 = true
  // }
  if (valid && valid1 && valid2) {
    let formData = await getFormData()
    formData = { ...formData }
    if (typeof formData.categoryId != 'string' && formData.categoryId) {
      formData.categoryId = formData.categoryId[formData.categoryId.length - 1]
    }

    const categoryData = await categoryForm.formMethods.getFormData()
    let goodsAttrList = []
    for (let key in categoryData) {
      if (categoryData[key]) {
        goodsAttrList.push({
          attrId: key,
          attrValue: categoryData[key]
        })
      }
    }

    const tableTemp = tableListRef.value?.tableList
    const objectItem = tableListRef.value?.objectItem
    const checked = tableListRef.value?.checked

    // if (status != 'DRAFT') {
    if (tableTemp.length == 0) {
      ElMessage.warning(t('common.a20'))
      return
    }
    // }

    let skuImgAddrTemp = ''
    for (let key in tableTemp) {
      tableTemp[key].ownSpec = {}
      tableTemp[key].rangePriceList = []
      tableTemp[key].specCode = ''

      for (let name in tableTemp[key]) {
        if (name.startsWith('spec')) {
          const arrHeaderItem = tableListRef.value?.arrHeaderItem || []
          for (let arrHeaderItemName in arrHeaderItem) {
            if (arrHeaderItem[arrHeaderItemName].field == name) {
              let a = arrHeaderItem[arrHeaderItemName].label
              tableTemp[key].ownSpec[a] = tableTemp[key][name]

              for (let objectItemIndex in objectItem) {
                if (objectItem[objectItemIndex].specifications == a) {
                  let m = objectItem[objectItemIndex].option.indexOf(tableTemp[key][name])
                  tableTemp[key].specCode += m + ','
                }
              }
            }
          }
        }

        if (name.startsWith('price')) {
          const arrHeaderItem2 = tableListRef.value?.arrHeaderItem2 || []
          for (let arrHeaderItemName in arrHeaderItem2) {
            if (arrHeaderItem2[arrHeaderItemName].field == name) {
              let a = arrHeaderItem2[arrHeaderItemName].label
              let b = a.split('-')

              tableTemp[key].rangePriceList.push({
                startCount: parseInt(b[0]),
                endCount: parseInt(b[1]),
                price: tableTemp[key][name]
              })
            }
          }
        }

        tableTemp[key].agentDeliver = checked ? 'YES' : 'NO'
        tableTemp[key].agentPrice = tableTemp[key].price
        tableTemp[key].realInventory = tableTemp[key].inventory
        tableTemp[key].cost = tableTemp[key].cost
      }

      // tableTemp[key].

      tableTemp[key].ownSpec = JSON.stringify(tableTemp[key].ownSpec)

      tableTemp[key].specCode = tableTemp[key].specCode.split('').reverse().join('')

      if (tableTemp[key].skuImgAddr) {
        skuImgAddrTemp = tableTemp[key].skuImgAddr
        for (let j in tableTemp) {
          if (
            tableTemp[j].skuImgAddr != skuImgAddrTemp &&
            tableTemp[j].spec1 == tableTemp[key].spec1
          ) {
            tableTemp[j].skuImgAddr = skuImgAddrTemp
          }
        }
      }
    }

    // if (status != 'DRAFT') {
    //校验表格不可为空
    for (const a of tableTemp) {
      if (!a.cost || !a.inventory  || !a.price1 || !a.skuImgAddr) {
        ElMessage.warning(t('common.a21'))
        return
      } else if (a.hasOwnProperty('spec1') && !a.spec1) {
        ElMessage.warning(t('common.a21'))
        return
      } else if (a.hasOwnProperty('spec2') && !a.spec2) {
        ElMessage.warning(t('common.a21'))
        return
      } else if (a.hasOwnProperty('spec3') && !a.spec3) {
        ElMessage.warning(t('common.a21'))
        return
      } else if(!a.price && a.agentDeliver == 'YES'){
        ElMessage.warning(t('common.txt1'))
        return
      }
    }
    // }

    let objectArr = {}
    for (let item in objectItem) {
      let a = objectItem[item].specifications + ''
      objectArr[a] = objectItem[item].option
    }

    // if (status != 'DRAFT') {
    if (form.value.freightType == 'UNIFICATION_PRICE' && !form.value.freightAmount) {
      ElMessage.warning(t('common.a22'))
      return
    } else if (form.value.freightType != 'UNIFICATION_PRICE' && !form.value.freightFormwork) {
      ElMessage.warning(t('common.a23'))
      return
    }
    // }
    form.value.packageSize =
      form.value.packageSize1 + ',' + form.value.packageSize2 + ',' + form.value.packageSize3

    const params = {
      ...form.value,
      ...formData,
      showStatus: status,
      unStatus: 'STATUS_0_0_0_0',
      goodsAttrList: goodsAttrList,
      skuList: tableTemp,
      spuDetail: {
        specialSpec: JSON.stringify(objectArr),
        goodsDetail: defaultHtml.value
      }
    }

    console.log(params)
    let res
    if (actionType.value == 'add') {
      res = await addApi(params)
    } else {
      params.id = actionId.value
      res = await editApi(params)
    }

    if (res.code == 200) {
      ElMessage.success(t('common.operateSuccess'))
      push('/mallManagement/productList')
    }
  }
}

const editorConfig = ref<any>({
  readOnly: false,
  MENU_CONF: {
    uploadImage: {
      server: import.meta.env.VITE_BASE_URL +"/save/file/richTextImgUpload",
      // 超时时间，默认为 10 秒
      headers: {
        'Boss-Token': bossToken
      },
      timeout: 30 * 1000, // 5s
      fieldName: 'file',
      maxFileSize: 10 * 1024 * 1024, // 10M
      base64LimitSize: 5 * 1024, // insert base64 format, if file's size less than 5kb
      // 选择文件时的类型限制，默认为 ['image/*'] 。如不想限制，则设置为 []
      allowedFileTypes: ['image/*'],
      // 最多可上传几个文件，默认为 100
      maxNumberOfFiles: 5,
      onBeforeUpload(file) {
        return file // will upload this file
      },
      onProgress(progress) {},
      onSuccess(file, res) {},
      onFailed(file, res) {},
      onError(file, err, res) {}
    },
    uploadVideo: {
      server: '/shopmp/save/file/saveIdImg',
      fieldName: 'file',
      maxFileSize: 5 * 1024 * 1024, // 5M
      maxNumberOfFiles: 3,
      allowedFileTypes: ['video/*'],
      timeout: 30 * 1000, // 15 秒
      onBeforeUpload() {
        ElMessage.warning(t('common.a24'))
        return false
      }
    }
  }
})
</script>
<style lang="less" scoped>
// :deep(.el-table__body) {
//   .el-table__row {
//     .el-table__cell {
//       background-color: white !important;
//     }
//   }
// }
:deep(.el-table .el-table__cell) {
  position: inherit;
}

// :deep(.el-scrollbar__bar.is-vertical) {
//   display: none;
// }
</style>
<style lang="less">
.baseClass {
  .el-upload {
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
  .el-icon--close-tip{
    display: none !important;
  }
}
</style>
