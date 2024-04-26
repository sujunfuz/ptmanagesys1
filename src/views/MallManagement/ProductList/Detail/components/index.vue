<template>
  <div class="mt-20px colorGrey fontSize15 flex">
    <span class="w-35px"> {{ t('productList.specifications') }} </span>
    <div class="w-100% pr-15px">
      <div v-if="objectItem.length != 0">
        <div
          class="bgcolorMainGrey ml-15px pt-10px w-100% mb-15px position-relative"
          v-for="(item, index) in objectItem"
          :draggable="true"
          @dragstart="dragstart(item)"
          @dragenter="dragenter(item)"
          @dragend="dragend(item)"
          @dragover="dragover($event)"
          :key="index"
        >
          <div class="absolute right-10px cursor-pointer" @click="clickClose(index)">
            <Icon icon="ep:close" />
          </div>
          <div class="ml-15px fontSize13-5">
            <el-form label-width="55px" class="pt-5px">
              <el-form-item :label="t('productList.specifications')" :rules="[{ required: true }]">
                <el-input
                  @change="getTableHeader"
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
                    @change="getTableList"
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
          <div class="text-right mt--35px">
            <Icon icon="svg-icon:sort" size="{17}" class="mr-10px mb-5px cursor-pointer" />
          </div>
        </div>
      </div>

      <el-button
        v-if="objectItem.length < 3"
        type="primary"
        plain
        class="ml-15px"
        :icon="Plus"
        @click="addSpeData"
        >{{ t('project.add3') + t('productList.specifications') }}</el-button
      >
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
            <el-tooltip placement="top">
              <template #content> {{ t('common.h') }} </template>
              <img src="@/assets/imgs/question.png" class="pic" />
            </el-tooltip>
            <!-- <el-select
              @change="getHeaderData2()"
              v-model="blockItemItem.from"
              class="w-100px"
              clearable
              placeholder="Select"
            >
              <el-option v-for="item in 1000" :key="item" :label="item" :value="item" /> </el-select
            > -->
            <el-input-number
              style="width: 100px"
              v-model="blockItemItem.from"
              :min="1"
              controls-position="right"
            />
            <span class="ml-10px mr-10px">-</span>
            <!-- <el-select
              @change="getHeaderData2()"
              v-model="blockItemItem.to"
              class="w-100px"
              clearable
              placeholder="Select"
            >
              <el-option v-for="item in 1000" :key="item" :label="item" :value="item" />
            </el-select> -->
            <el-input-number
              style="width: 100px"
              v-model="blockItemItem.to"
              :min="1"
              controls-position="right"
            />
          </el-form-item>
          <el-form-item :label="t('productList.price')" class="ml--15px">
            <el-input-number
              style="width: 100px"
              v-model="blockItemItem.price"
              :min="0.01"
              :precision="2"
              :step="0.01"
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
        <!-- <el-button type="primary" plain class="mt--20px ml-15px" @click="allMechanically">{{
          t('productList.allMechanically')
        }}</el-button> -->
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
            :min="0.01"
            :precision="2"
            :step="0.01"
            controls-position="right"
          />
        </el-form-item>
        <el-form-item :label="t('productList.cost')" class="ml--30px" :required="true">
          <el-input-number
            style="width: 100px"
            v-model="priceBlock.cost"
            :min="0.01"
            :precision="2"
            :step="0.01"
            controls-position="right"
          />
        </el-form-item>
        <el-form-item :label="t('productList.inventory')" class="ml--30px" :required="true">
          <el-input-number
            style="width: 100px"
            v-model="priceBlock.inventory"
            :min="1"
            controls-position="right"
          />
        </el-form-item>
        <el-button type="primary" plain class="mt--20px ml-5px" @click="allMechanically">{{
          t('productList.allMechanically')
        }}</el-button>
      </el-form>
    </div>
  </div>
  <div class="ml-48px mt-20px">
    <Table
      ref="tableData"
      :tableList="tableList"
      :arrHeaderItem="arrHeaderItem"
      :arrHeaderItem2="arrHeaderItem2"
      :checked="checked"
    />
  </div>
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
  ElMessage,
  ElTooltip
} from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { ref, nextTick, onMounted } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import Table from './table.vue'
import { TableColumn } from '@/components/Table'
const { t } = useI18n()
const checked = ref(false)

const tableList = ref<any>([])

const arrTemp = ref<any>([[], [], []])

const clickVal = ref()
const moveVal = ref()
const endVal = ref()
//拖拽
const dragstart = (e: any) => {
  clickVal.value = e
}
const dragenter = (e: any) => {
  moveVal.value = e
}
const dragend = async (e: any) => {
  endVal.value = e
  let index = objectItem.value.indexOf(e) //移动元素的当前位置
  let moveObj = moveVal.value ? moveVal.value : ''
  let addIndex = objectItem.value.indexOf(moveObj) //要移动后的位置
  objectItem.value.splice(index, 1)
  objectItem.value.splice(addIndex, 0, e)
  await getTableHeader()
}
const dragover = (e: any) => {
  // console.log('4', e)
  e.preventDefault()
}

const getTableList = () => {
  arrTemp.value = [[], [], []]
  for (let i = 0; i < objectItem.value.length; i++) {
    let specifications = objectItem.value[i].specifications
    if (objectItem.value[i].option.length != 0) {
      for (let j = 0; j < objectItem.value[i].option.length; j++) {
        if (objectItem.value[i].option[j] !== undefined) {
          arrTemp.value[i].push({
            label: specifications,
            value: objectItem.value[i].option[j]
          })
        }
      }
    }
  }
  const [list1 = [], list2 = [], list3 = []] = arrTemp.value
  let arr: any = []
  const originObj = { price: undefined, cost: undefined, inventory: undefined }
  createTableItem(originObj, [list1, list2, list3], arr)
  let tempArr: any = []
  for (let a of arr) {
    //遍历循环已存在的sku赋值回去
    let flag = true
    let obj: any = { ...a }
    let spec1 = a.spec1
    let spec2 = a.spec2
    let spec3 = a.spec3
    for (let b of tableList.value) {
      let realSpec1 = b.spec1
      let realSpec2 = b.spec2
      let realSpec3 = b.spec3
      if (spec1 === realSpec1 && spec2 === realSpec2 && spec3 === realSpec3 && !b.flag) {
        obj = { ...b }
        tempArr.push(obj)
        flag = false
        b.flag = true //限制不可重复选选过的已存在的sku
        break
      }
    }
    //没有找到一样的就按第一条的数据价格赋值
    if (flag) {
      if (tableList.value.length > 0) {
        obj = {
          ...a,
          cost: tableList.value[0].cost,
          price: tableList.value[0].price,
          inventory: tableList.value[0].inventory
        }
        if (tableList.value[0].price1) {
          obj.price1 = tableList.value[0].price1
          if (tableList.value[0].price2) {
            obj.price2 = tableList.value[0].price2
            if (tableList.value[0].price3) {
              obj.price3 = tableList.value[0].price3
            }
          }
        }
      }
      tempArr.push(obj)
    }
  }
  tableList.value = tempArr
}

const priceBlock = ref({
  cost: 1,
  price: 1,
  inventory: 888
})

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
  if (blockItem.value) {
    for (let i = 0; i < blockItem.value.length; i++) {
      if (!blockItem.value[i].from || !blockItem.value[i].to) {
        ElMessage.warning(t('common.a25'))
        return
      } else if (blockItem.value[i].to < blockItem.value[i].from) {
        ElMessage.warning(t('common.a26'))
        return
      } else if (i != 0 && blockItem.value[i].from < blockItem.value[i - 1].to + 1) {
        ElMessage.warning(t('common.a27'))
        return
      } else if (i != 0 && blockItem.value[i].from != blockItem.value[i - 1].to + 1) {
        ElMessage.warning(t('common.a28'))
        return
      }
    }
  }
  getHeaderData2()
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
const createTableItem = (originObj, listArr, result) => {
  if (listArr[0].length > 0) {
    for (const a of listArr[0]) {
      let obj = {
        spec1: a.value,
        ...originObj
      }
      if (listArr[1].length > 0) {
        for (const b of listArr[1]) {
          let secObj = {
            spec2: b.value,
            ...obj
          }
          if (listArr[2].length > 0) {
            for (const c of listArr[2]) {
              let thirdObj = {
                spec3: c.value,
                ...secObj
              }
              result.push(thirdObj)
            }
          } else {
            result.push({ ...secObj })
          }
        }
      } else {
        result.push({ ...obj })
      }
    }
  }
}

// const createTableItem = (originObj, listArr, i, result) => {
//   for (const item of listArr[i]) {
//     const obj = { [`spec${i + 1}`]: item.value, ...originObj }
//     if (i < listArr.length && listArr[i + 1]?.length > 0) {
//       createTableItem(obj, listArr, i + 1, result)
//     } else {
//       result.push(obj)
//     }
//   }
// }

const arrHeaderItem = ref<TableColumn[]>([])
const arrHeaderItem2 = ref<TableColumn[]>([{ label: '1-1000', field: 'price1' }])
const getTableHeader = () => {
  // arrHeaderItem.value = []
  // return

  let tempArr: any = []
  objectItem.value.forEach((item: any, index: number) => {
    tempArr.push({
      label: item.specifications,
      field: 'spec' + (index + 1)
    })
    // arrHeaderItem.value.push({
    //   label: item.specifications,
    //   field: 'spec' + (index + 1)
    // })
  })

  arrHeaderItem.value = tempArr
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
  if (objectItem.value.length > 5) {
    ElMessage.warning(t('image.sub11'))
  } else {
    objectItem.value.push({
      specifications: '',
      option: ['']
    })
  }
}
const addBlockOptionItem = (index) => {
  if (objectItem.value[index].option.length < 12) {
    objectItem.value[index].option.push('')
  } else {
    ElMessage.warning(t('common.a'))
  }
}

const deleteOptionItem = (index, optionIndex) => {
  objectItem.value[index].option = objectItem.value[index].option.filter(function (item, key) {
    return key !== optionIndex
  })
  getTableList()
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
  }
})
</script>

<style lang="less" scoped>
.pic {
  width: 15px;
  height: 15px;
  margin-left: -7px;
  margin-right: 7px;
}
</style>
