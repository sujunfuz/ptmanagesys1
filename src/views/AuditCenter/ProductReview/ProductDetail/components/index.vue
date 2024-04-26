<template>
  <!-- <div class="mt-20px colorGrey fontSize15 flex"> -->
  <!-- <span class="w-35px"> {{ t('productList.specifications') }} </span>
    <div class="w-100% pr-15px">
      <div v-if="objectItem.length != 0">
        <div
          class="bgcolorMainGrey ml-15px pt-10px w-100% mb-15px position-relative"
          v-for="(item, index) in objectItem"
          :key="index"
        >
          <div class="absolute right-10px cursor-pointer" @click="clickClose(index)">
            <Icon icon="ep:close" />
          </div>
          <div class="ml-15px fontSize13-5">
            <el-form label-width="55px" class="pt-5px">
              <el-form-item :label="t('productList.specifications')" :rules="[{ required: true }]">
                <el-input
                  @change="getTableHeader()"
                  v-model="item.specifications"
                  style="width: 200px"
                  maxlength="30"
                  show-word-limit
                  :placeholder="t('common.inputText')"
                />
              </el-form-item>
            </el-form>
            <el-form label-width="50px" :inline="true">
              <el-form-item :label="t('productList.option')" class="ml-5px">
                <span
                  v-for="(optionItem, optionIndex) in item.option"
                  :key="optionIndex"
                  class="flex-items-center w-350px mt-1px"
                >
                  <el-input
                    v-model="item.option[optionIndex]"
                    style="width: 300px"
                    @change="getTableList()"
                    maxlength="30"
                    show-word-limit
                    :placeholder="t('common.inputText')"
                    class="mb-20px"
                  />
                  <span @click="deleteOptionItem(index, optionIndex)">
                    <Icon icon="ep:delete" class="relative top--6px left-12px" />
                  </span>
                </span>
                <span class="colorMain relative top--6px">
                  <Icon icon="ep:plus" :size="14" />
                  <span
                    @click="addBlockOptionItem(index)"
                    class="position-relative top--2px cursor-pointer font-size-14px left-2px"
                  >
                    {{ t('project.add3') + t('productList.option') }}</span
                  >
                </span>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>

      <el-button type="primary" plain class="ml-15px" :icon="Plus" @click="addSpeData">{{
        t('project.add3') + t('productList.specifications')
      }}</el-button>
    </div>
  </div>
  <div class="colorGrey fontSize15 mt-20px flex">
    <span class="w-35px"> {{ t('productList.price') }} </span>
    <div class="ml-15px fontSize13-5 bgcolorMainGrey w-100% pl-10px">
      <el-form label-width="80px" class="mt-20px">
        <el-form-item :label="t('productList.RangePrice')" :rules="[{ required: true }]" />
      </el-form>
      <el-form label-width="60px" :inline="true">
        <span v-for="(blockItemItem, index) in blockItem" :key="index">
          <el-form-item :label="t('productList.volume')" class="ml-5px">
            <el-select
              @change="getHeaderData2()"
              v-model="blockItemItem.from"
              class="w-100px"
              clearable
              placeholder="Select"
            >
              <el-option v-for="item in 1000" :key="item" :label="item" :value="item" /> </el-select
            ><span class="ml-10px mr-10px">-</span>
            <el-select
              @change="getHeaderData2()"
              v-model="blockItemItem.to"
              class="w-100px"
              clearable
              placeholder="Select"
            >
              <el-option v-for="item in 1000" :key="item" :label="item" :value="item" />
            </el-select>
          </el-form-item>
          <el-form-item :label="t('productList.price')" class="ml--15px">
            <el-input-number
              style="width: 100px"
              v-model="blockItemItem.price"
              :min="1"
              :max="10"
              controls-position="right"
            />
          </el-form-item>
          <span class="position-relative top--4px" @click="deleteItem(index)">
            <Icon icon="ep:delete" /> </span
        ></span>

        <span class="colorMain position-relative top--4px ml-10px">
          <Icon icon="ep:plus" :size="14" />
          <span
            @click="addBlockItem"
            class="position-relative top--3px cursor-pointer font-size-14px"
          >
            {{ t('project.add3') + t('productList.new') + t('productList.price') }}</span
          >
        </span>
        <el-button type="primary" plain class="mt--20px ml-15px" @click="allMechanically()">{{
          t('productList.allMechanically')
        }}</el-button>
      </el-form>
      <el-form label-width="80px" :inline="true" class="ml-15px">
        <el-form-item label="">
          <el-checkbox
            v-model="checked"
            :label="t('productList.oneShipping')"
            @change="changeChecked()"
          />
        </el-form-item>
        <el-form-item :label="t('productList.issuingPrice')">
          <el-input-number
            v-model="priceBlock.price"
            style="width: 100px"
            :min="1"
            :max="10"
            controls-position="right"
          />
        </el-form-item>
        <el-form-item :label="t('productList.cost')" class="ml--30px" :required="true">
          <el-input-number
            style="width: 100px"
            v-model="priceBlock.cost"
            :min="1"
            :max="10"
            controls-position="right"
          />
        </el-form-item>
        <el-form-item :label="t('productList.inventory')" class="ml--30px" :required="true">
          <el-input-number
            style="width: 100px"
            v-model="priceBlock.inventory"
            :min="1"
            :max="10"
            controls-position="right"
          />
        </el-form-item>
      </el-form>
    </div>
  </div> -->
  <ContentWrap class="mt-20px">
    <div class="font-size-20px color-colorBlack">{{ t('productList.price') }}</div>
    <div class="mt-20px">
      <Table
        ref="tableData"
        :tableList="tableList"
        :arrHeaderItem="arrHeaderItem"
        :arrHeaderItem2="arrHeaderItem2"
        :checked="checked"
        :skuImgAddr="skuImgAddr"
      />
    </div>
  </ContentWrap>
</template>

<script setup lang="tsx">
import {
  ElButton,
  ElInput,
  ElForm,
  ElFormItem,
  ElSelect,
  ElOption,
  ElInputNumber,
  ElCheckbox,
  ElMessage
} from 'element-plus'
import { ContentWrap } from '@/components/ContentWrap/index.ts'
import { Plus } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import Table from '../components/table.vue'
import { TableColumn } from '@/types/table'
import Empty from '@/components/customComponents/Empty/index.vue'

const { t } = useI18n()
const checked = ref(false)

const tableList = ref<any>([])

const arrTemp = ref<any>([[], [], []])

const getTableList = () => {
  arrTemp.value = [[], [], []]
  for (let i = 0; i < objectItem.value.length; i++) {
    let specifications = objectItem.value[i].specifications
    if (objectItem.value[i].option.length != 0) {
      for (let j = 0; j < objectItem.value[i].option.length; j++) {
        if (objectItem.value[i].option[j] != '') {
          arrTemp.value[i].push({
            label: specifications,
            value: objectItem.value[i].option[j]
          })
        }
      }
    }
  }

  const [list1 = [], list2 = [], list3 = []] = arrTemp.value
  let arr = []
  const originObj = { price: undefined, cost: undefined, inventory: undefined }
  createTableItem(originObj, [list1, list2, list3], 0, arr)
  tableList.value = arr
}

const priceBlock = ref({
  cost: 1,
  price: 1,
  inventory: 1
})

const skuImgAddr = ref([])
const changeChecked = () => {
  for (let i = 0; i < tableList.value.length; i++) {
    if (checked.value) {
      tableList.value[i].agentDeliver = 'YES'
    } else {
      tableList.value[i].agentDeliver = 'NO'
    }
  }
}

const allMechanically = () => {
  for (let i = 0; i < tableList.value.length; i++) {
    tableList.value[i].cost = priceBlock.value.cost
    tableList.value[i].price = priceBlock.value.price
    tableList.value[i].inventory = priceBlock.value.inventory
    blockItem.value.forEach((item: any, index: number) => {
      const temp = 'price' + (index + 1)
      tableList.value[i][temp] = item.price
    })
  }
}

const createTableItem = (originObj, listArr, i, result) => {
  for (const item of listArr[i]) {
    const obj = { [`spec${i + 1}`]: item.value, ...originObj }
    if (i < listArr.length && listArr[i + 1]?.length > 0) {
      createTableItem(obj, listArr, i + 1, result)
    } else {
      result.push(obj)
    }
  }
}

const arrHeaderItem = ref<TableColumn[]>([])
const arrHeaderItem2 = ref<TableColumn[]>([{ label: '1-1000', field: 'price1' }])
const getTableHeader = () => {
  arrHeaderItem.value = []
  objectItem.value.forEach((item: any, index: number) => {
    arrHeaderItem.value.push({
      label: item.specifications,
      field: 'spec' + (index + 1)
    })
  })
  getTableList()
}

const getHeaderData2 = () => {
  arrHeaderItem2.value = []
  blockItem.value.forEach((item: any, index: number) => {
    arrHeaderItem2.value.push({
      label: item.from + '-' + item.to,
      field: 'price' + (index + 1)
    })
  })
  console.log(arrHeaderItem2)
  getTableList()
}

const blockItem = ref([
  {
    from: 1,
    to: 1000,
    price: 1
  }
])

const objectItem = ref<any>([])

const clickClose = (index) => {
  objectItem.value = objectItem.value.filter((item, key) => {
    return key != index
  })
  getTableHeader()
}

const addSpeData = () => {
  if (objectItem.value.length > 2) {
    ElMessage.warning(t('image.sub11'))
  } else {
    objectItem.value.push({
      specifications: '',
      option: ['']
    })
  }
}
const addBlockOptionItem = (index) => {
  objectItem.value[index].option.push('')
}

const deleteOptionItem = (index, optionIndex) => {
  objectItem.value[index].option = objectItem.value[index].option.filter(function (item, key) {
    return key !== optionIndex
  })
}

const addBlockItem = () => {
  if (blockItem.value.length > 2) {
    ElMessage.warning(t('image.sub12'))
  } else {
    blockItem.value.push({
      from: 1,
      to: 1000,
      price: 1
    })
    getHeaderData2()
  }
}

const deleteItem = (value) => {
  blockItem.value = blockItem.value.filter(function (item, key) {
    return key !== value
  })
}

defineExpose({
  tableList,
  arrHeaderItem,
  arrHeaderItem2,
  objectItem,
  checked,
  setObjectItem(res) {
    objectItem.value = res
  },
  setTableList(res) {
    tableList.value = res
  },
  setArrHeaderItem(res) {
    arrHeaderItem.value = res
  },
  setArrHeaderItem2(res) {
    arrHeaderItem2.value = res
  },
  setChecked(res) {
    checked.value = res
  },
  setBlockItem(res) {
    blockItem.value = res
  },
  setPriceBlock(res) {
    priceBlock.value = res
  },
  setSkuImgAddr(res) {
    skuImgAddr.value = res
  }
})
</script>

<style lang="scss" scoped></style>
