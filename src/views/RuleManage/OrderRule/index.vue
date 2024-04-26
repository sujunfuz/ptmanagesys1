<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ContentWrap } from '@/components/ContentWrap'
import { useI18n } from '@/hooks/web/useI18n'
import { ElInput, ElSelect, ElOption, ElButton, ElMessage } from 'element-plus'
import {
  pageTop,
  getAfterRule,
  getInventoryRule,
  getOrderRule,
  updateRule,
  getSettleRule
} from '@/api/RuleManage/OrderRule'
import { log } from 'console'
const { t } = useI18n()

const unitValue1_block1 = ref('DAY')
const unitValue2_block1 = ref('DAY')
const unitValue3_block1 = ref('DAY')
const unitValue4_block1 = ref('DAY')
const unitValue5_block1 = ref('DAY')
const unitValue6_block1 = ref('YUAN')
const unitValue7_block1 = ref('DAY')
const unitValue8_block1 = ref('DAY')
const unitValue9_block1 = ref('DAY')

const valueRef1 = ref()
const valueRef2 = ref()
const valueRef3 = ref()
const valueRef4 = ref()
const valueRef5 = ref()
const valueRef6 = ref()
const valueRef7 = ref()
const valueRef8 = ref()
const valueRef9 = ref()

const valueRef1_block2 = ref()
const valueRef2_block2 = ref()
const valueRef3_block2 = ref()

const unitValue_block3 = ref('UNIT')
const valueRef_block3 = ref()

const amountTypeEnum = ref()
const unitList = ref()
const unitTypeEnum = ref()

onMounted(async () => {
  const res = await pageTop()
  if (res.code == 200) {
    amountTypeEnum.value = res.data.amountTypeEnum
    unitList.value = res.data.dateTypeEnum
    unitTypeEnum.value = res.data.unitTypeEnum
  }
  await getData1()
  await getData2()
  await getData3()
  await getData4()
})
const data1 = ref([])
const getData1 = async () => {
  const res = await getAfterRule()

  if (res.code == 200) {
    data1.value = res.data
    res.data.forEach((item) => {
      if (item.code == 'afterApplyDate') {
        valueRef1_block2.value = item.param
      } else if (item.code == 'afterSettleDate') {
        valueRef2_block2.value = item.param
      } else if (item.code == 'afterCancelDate') {
        valueRef3_block2.value = item.param
      }
    })
  }
}

const data2 = ref([])
const getData2 = async () => {
  const res = await getInventoryRule()
  if (res.code == 200) {
    data2.value = res.data
    valueRef_block3.value = res.data[0].param
    unitValue_block3.value = res.data[0].unit
  }
}
const data3 = ref([])
const getData3 = async () => {
  const res = await getOrderRule()
  if (res.code == 200) {
    data3.value = res.data
    res.data.forEach((item) => {
      switch (item.code) {
        case 'singleOrderPayDate':
          valueRef1.value = item.param
          unitValue1_block1.value = item.unit
          break
        case 'multipleOrderPayDate':
          valueRef2.value = item.param
          unitValue3_block1.value = item.unit
          break
        case 'orderDeliverDate':
          valueRef3.value = item.param
          unitValue3_block1.value = item.unit
          break
        case 'confirmReceiptDate':
          valueRef4.value = item.param
          unitValue4_block1.value = item.unit
          break
        case 'completeOrderDate':
          valueRef5.value = item.param
          unitValue5_block1.value = item.unit
          break
        case 'evaluationOrderDate':
          valueRef6.value = item.param
          unitValue6_block1.value = item.unit
          break
      }
    })
  }
}
const data4 = ref([])
const getData4 = async () => {
  const res = await getSettleRule()
  if (res.code == 200) {
    data4.value = res.data
    res.data.forEach((item) => {
      switch (item.code) {
        case 'settleDate':
          valueRef7.value = item.param
          unitValue7_block1.value = item.unit
          break
        case 'settleCycle':
          valueRef8.value = item.param
          unitValue8_block1.value = item.unit
          break
      }
    })
  }
}

const save1 = async () => {
  data3.value.forEach((item) => {
    switch (item.code) {
      case 'singleOrderPayDate':
        item.param = valueRef1.value
        item.unit = unitValue1_block1.value
        break
      case 'multipleOrderPayDate':
        item.param = valueRef2.value
        item.unit = unitValue2_block1.value
        break
      case 'orderDeliverDate':
        item.param = valueRef3.value
        item.unit = unitValue3_block1.value
        break
      case 'confirmReceiptDate':
        item.param = valueRef4.value
        item.unit = unitValue4_block1.value
        break
      case 'completeOrderDate':
        item.param = valueRef5.value
        item.unit = unitValue5_block1.value
        break
      case 'evaluationOrderDate':
        item.param = valueRef6.value
        item.unit = unitValue6_block1.value
        break
    }
  })

  const res = await updateRule(data3.value)
  if (res.code == 200) {
    ElMessage.success(res.msg)
    await getData3()
  }
}
const save4 = async () => {
  data4.value.forEach((item) => {
    switch (item.code) {
      case 'settleDate':
        item.param = valueRef7.value
        item.unit = unitValue7_block1.value
        break
      case 'settleCycle':
        item.param = valueRef8.value
        item.unit = unitValue8_block1.value
        break
    }
  })
  const res = await updateRule(data4.value)
  if (res.code == 200) {
    ElMessage.success(res.msg)
    await getData4()
  }
}
const save2 = async () => {
  data1.value.forEach((item) => {
    if (item.code == 'afterApplyDate') {
      item.param = valueRef1_block2.value
    } else if (item.code == 'afterSettleDate') {
      item.param = valueRef2_block2.value
    } else if (item.code == 'afterCancelDate') {
      item.param = valueRef3_block2.value
    }
  })
  const res = await updateRule(data1.value)
  if (res.code == 200) {
    ElMessage.success(res.msg)
    await getData1()
  }
}

const save3 = async () => {
  data2.value[0].param = valueRef_block3.value
  data2.value[0].unit = unitValue_block3.value
  const res = await updateRule(data2.value)
  if (res.code == 200) {
    ElMessage.success(res.msg)
    await getData2()
  }
}
</script>

<template>
  <div>
    <ContentWrap>
      <div class="font-size-20px">{{ t('OrderRule.title1') }}</div>
      <div class="mb-30px">
        <div class="flex-c mt-30px w-100%">
          <div class="color-colorGray w-168px mr-10px textR">{{ t('OrderRule.rule1_1_l') }}</div>
          <div class="flex-c">
            <div>{{ t('OrderRule.rule1_1_z') }}</div>
            <div class="ml-10px">
              <ElInput class="!w-80px" v-model="valueRef1" type="number" />
            </div>
            <div class="ml-10px">
              <el-select v-model="unitValue1_block1" class="!w-80px" placeholder="Select">
                <el-option
                  v-for="(item, index) in unitList"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>
            <div class="ml-10px">{{ t('OrderRule.rule1_1_y') }}</div>
            <!-- <div class="ml-10px sel-unit">
            <div class="unit-l">天</div>
            <div class="unit-r" @click="selunit">
              <Icon icon="ep:caret-bottom" size="15" />
            </div>
          </div> -->
          </div>
        </div>
        <div class="flex-c mt-30px w-100%">
          <div class="color-colorGray w-168px mr-10px textR"></div>
          <div class="flex-c">
            <div>{{ t('OrderRule.rule1_2_z') }}</div>
            <div class="ml-10px">
              <ElInput class="!w-80px" v-model="valueRef2" type="number" />
            </div>
            <div class="ml-10px">
              <el-select v-model="unitValue2_block1" class="!w-80px" placeholder="Select">
                <el-option
                  v-for="(item, index) in unitList"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>
            <div class="ml-10px">{{ t('OrderRule.rule1_2_y') }}</div>
          </div>
        </div>
        <div class="flex-c mt-30px w-100%">
          <div class="color-colorGray w-168px mr-10px textR">{{ t('OrderRule.rule1_3_l') }}</div>
          <div class="flex-c">
            <div>{{ t('OrderRule.rule1_3_z') }}</div>
            <div class="ml-10px">
              <ElInput class="!w-80px" v-model="valueRef3" type="number" />
            </div>
            <div class="ml-10px">
              <el-select v-model="unitValue3_block1" class="!w-80px" placeholder="Select">
                <el-option
                  v-for="(item, index) in unitList"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>
            <div class="ml-10px">{{ t('OrderRule.rule1_3_y') }}</div>
          </div>
        </div>
        <div class="flex-c mt-30px w-100%">
          <div class="color-colorGray w-168px mr-10px textR">{{ t('OrderRule.rule1_4_l') }}</div>
          <div class="flex-c">
            <div>{{ t('OrderRule.rule1_4_z') }}</div>
            <div class="ml-10px">
              <ElInput class="!w-80px" v-model="valueRef4" type="number" />
            </div>
            <div class="ml-10px">
              <el-select v-model="unitValue4_block1" class="!w-80px" placeholder="Select">
                <el-option
                  v-for="(item, index) in unitList"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>
            <div class="ml-10px">{{ t('OrderRule.rule1_4_y') }}</div>
          </div>
        </div>
        <div class="flex-c mt-30px w-100%">
          <div class="color-colorGray w-168px mr-10px textR">{{ t('OrderRule.rule1_5_l') }}</div>
          <div class="flex-c">
            <div>{{ t('OrderRule.rule1_5_z') }}</div>
            <div class="ml-10px">
              <ElInput class="!w-80px" v-model="valueRef5" type="number" />
            </div>
            <div class="ml-10px">
              <el-select v-model="unitValue5_block1" class="!w-80px" placeholder="Select">
                <el-option
                  v-for="(item, index) in unitList"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>
            <div class="ml-10px">{{ t('OrderRule.rule1_5_y') }}</div>
          </div>
        </div>

        <div class="flex-c mt-30px w-100%">
          <div class="color-colorGray w-168px mr-10px textR">{{ t('OrderRule.rule1_6_l') }}</div>
          <div class="flex-c">
            <div>{{ t('OrderRule.rule1_6_z') }}</div>
            <div class="ml-10px">
              <ElInput class="!w-80px" v-model="valueRef6" type="number" />
            </div>
            <div class="ml-10px">
              <el-select v-model="unitValue6_block1" class="!w-80px" placeholder="Select">
                <el-option
                  v-for="(item, index) in unitList"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>
            <div class="ml-10px"> {{ t('OrderRule.rule1_6_y') }}</div>
          </div>
        </div>
        <div class="text-right">
          <ElButton v-hasPermi="'rule:updateRule'" type="primary" @click="save1" class="w-70px">
            {{ t('project.confirm') }}
          </ElButton>
        </div>
        <div class="font-size-20px">{{ t('common.remark1') }}</div>
        <!-- <div class="flex-c mt-30px w-100%">
          <div class="color-colorGray w-168px mr-10px textR">{{ t('common.remark2') }}</div>
          <div class="flex-c">
            <div>{{ t('common.remark3') }}</div>
            <div class="ml-10px">
              <ElInput class="!w-80px" v-model="valueRef7" type="number" />
            </div>
            <div class="ml-10px">
              <el-select v-model="unitValue7_block1" class="!w-80px" placeholder="Select">
                <el-option
                  v-for="(item, index) in unitList"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>
            <div class="ml-10px"> {{ t('common.remark4') }}</div>
          </div>
        </div> -->
        <div class="flex-c mt-30px w-100%">
          <div class="color-colorGray w-168px mr-10px textR">{{ t('common.remark5') }}</div>
          <div class="flex-c">
            <div>{{ t('common.remark6') }}</div>
            <div class="ml-10px">
              <ElInput class="!w-80px" v-model="valueRef8" type="number" />
            </div>
            <div class="ml-10px">
              <el-select v-model="unitValue8_block1" class="w-100px" placeholder="Select">
                <el-option
                  v-for="(item, index) in unitList"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>
            <div class="ml-10px"> {{ t('common.remark7') }}</div>
          </div>
        </div>
        <!-- <div class="flex-c mt-30px w-100%">
          <div class="color-colorGray w-168px mr-10px textR">{{ t('OrderRule.rule1_7_l') }}</div>
          <div class="flex-c">
            <div>{{ t('OrderRule.rule1_7_z') }}</div>
            <div class="ml-10px">
              <ElInput class="!w-80px" v-model="valueRef6" type="number" />
            </div>
            <div class="ml-10px">
              <el-select v-model="unitValue6_block1" class="!w-80px" placeholder="Select">
                <el-option
                  v-for="(item, index) in amountTypeEnum"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>
            <div class="ml-10px">{{ t('OrderRule.rule1_7_y') }}</div>
          </div>
        </div>
        <div class="flex-c mt-30px w-100%">
          <div class="color-colorGray w-168px mr-10px textR"></div>
          <div class="flex-c">
            <div>{{ t('OrderRule.rule1_8_z') }}</div>
            <div class="ml-10px">
              <ElInput class="!w-80px" v-model="valueRef7" type="number" />
            </div>
            <div class="ml-10px">
              <el-select v-model="unitValue7_block1" class="!w-80px" placeholder="Select">
                <el-option
                  v-for="(item, index) in unitList"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>
            <div class="ml-10px">{{ t('OrderRule.rule1_8_y') }}</div>
            <div class="ml-10px flex-c">
              <ElInput class="!w-80px" v-model="valueRef8" type="number" />
              <div class="ml-10px">
                <el-select v-model="unitValue8_block1" class="!w-80px" placeholder="Select">
                  <el-option
                    v-for="(item, index) in unitList"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </div>
            </div>
            <div class="ml-10px">{{ t('OrderRule.sub') }}</div>
          </div>
        </div>
        <div class="flex-c mt-30px w-100%">
          <div class="color-colorGray w-168px mr-10px textR"></div>
          <div class="flex-c">
            <div>{{ t('OrderRule.rule1_9_z') }}</div>
            <div class="ml-10px">
              <ElInput class="!w-80px" v-model="valueRef9" type="number" />
            </div>
            <div class="ml-10px">
              <el-select v-model="unitValue9_block1" class="!w-80px" placeholder="Select">
                <el-option
                  v-for="(item, index) in unitList"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>
            <div class="ml-10px">{{ t('OrderRule.rule1_9_y') }}</div>
          </div>
        </div> -->
      </div>
      <div class="text-right">
        <ElButton v-hasPermi="'rule:updateRule'" type="primary" @click="save4" class="w-70px">
          {{ t('project.confirm') }}
        </ElButton>
      </div>
    </ContentWrap>
    <ContentWrap class="mt-20px">
      <div class="font-size-20px">{{ t('OrderRule.title2') }}</div>
      <div class="mb-30px">
        <div class="flex-c mt-30px w-100%">
          <div class="color-colorGray w-168px mr-10px textR">{{ t('OrderRule.rule2_1_l') }}</div>
          <div class="flex-c">
            <div>{{ t('OrderRule.rule2_1_z') }}</div>
            <div class="ml-10px">
              <ElInput class="!w-80px" v-model="valueRef1_block2" type="number" />
            </div>
            <div class="ml-10px">{{ t('OrderRule.rule2_1_y') }}</div>
          </div>
        </div>
        <div class="flex-c mt-30px w-100%">
          <div class="color-colorGray w-168px mr-10px textR">{{ t('OrderRule.rule2_2_l') }}</div>
          <div class="flex-c">
            <div>{{ t('OrderRule.rule2_2_z') }}</div>
            <div class="ml-10px">
              <ElInput class="!w-80px" v-model="valueRef2_block2" type="number" />
            </div>
            <div class="ml-10px">{{ t('OrderRule.rule2_2_y') }}</div>
          </div>
        </div>
        <div class="flex-c mt-30px w-100%">
          <div class="color-colorGray w-168px mr-10px textR"></div>
          <div class="flex-c">
            <div>{{ t('OrderRule.rule2_3_z') }}</div>
            <div class="ml-10px">
              <ElInput class="!w-80px" v-model="valueRef3_block2" type="number" />
            </div>
            <div class="ml-10px">{{ t('OrderRule.rule2_3_y') }}</div>
          </div>
        </div>
      </div>
      <div class="text-right">
        <ElButton v-hasPermi="'rule:updateRule'" type="primary" @click="save2" class="w-70px">
          {{ t('project.confirm') }}
        </ElButton>
      </div>
    </ContentWrap>
    <ContentWrap class="mt-20px">
      <div class="font-size-20px">{{ t('OrderRule.title3') }}</div>
      <div class="mb-30px">
        <div class="flex-c mt-30px w-100%">
          <div class="color-colorGray w-168px mr-10px textR">{{ t('OrderRule.rule3_1_z') }}</div>
          <div class="flex-c">
            <div class="ml-10px">
              <ElInput class="!w-80px" v-model="valueRef_block3" type="number" />
            </div>
            <div class="ml-10px">
              <el-select v-model="unitValue_block3" class="!w-80px" placeholder="Select">
                <el-option
                  v-for="(item, index) in unitTypeEnum"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>
          </div>
        </div>
        <div class="flex-c mt-10px w-100%">
          <div class="color-colorGray w-168px mr-10px textR"></div>
          <div class="color-colorGray"> {{ t('OrderRule.rule3_1_x') }} </div>
        </div>
      </div>
      <div class="text-right">
        <ElButton v-hasPermi="'rule:updateRule'" type="primary" @click="save3" class="w-70px">
          {{ t('project.confirm') }}
        </ElButton>
      </div>
    </ContentWrap>
  </div>
</template>
