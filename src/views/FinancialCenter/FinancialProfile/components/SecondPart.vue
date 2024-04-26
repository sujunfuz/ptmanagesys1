<template>
  <div class="w-100% box-border pa-20px bg-white border-rd-4px mt-20px">
    <div class="color-colorBlack font-size-20px flex-cb">
      <span>{{ t('managementProfile.sub5') }}</span>
      <div class="w-390px">
        <el-date-picker
          v-model="selectTime"
          type="daterange"
          range-separator="To"
          value-format="YYYY-MM-DD"
          start-placeholder="Start date"
          end-placeholder="End date"
          @change="getData"
        />
      </div>
    </div>

    <div class="flex-cb w-100% mt-43px color-colorBlack">
      <div
        v-for="index in 7"
        :key="index"
        class="w-13% pa-20px box-border border-rd-4px h-132px"
        style="border: 1px solid #f0f2f5; box-shadow: 1px 3px 12px 1px rgba(0, 0, 0, 0.08)"
      >
        <div class="flex-cb font-size-14px font-500 mt--15px">
          <span>{{ titleArr[index - 1] }}</span>
          <el-checkbox
            :disabled="hasCheckArr.length == 4 && !checkedArr[index - 1] ? true : false"
            @change="
              (e) => {
                changeCheckBox(e, index - 1)
              }
            "
            :class="'checkStyle' + index"
            v-model="checkedArr[index - 1]"
            size="large"
          />
        </div>
        <div class="font-size-20px font-500 mt-15px">{{ countList[index - 1] }}</div>
        <div class="flex-c mt-13px">
          <span class="font-size-12px">vs{{ t('DataCenter.txt14') }}</span>

          <img
            v-if="statusList[index - 1] == 'UP'"
            class="w-16px h-16px ml-13px"
            src="@/assets/imgs/DataCenter/redUp.png"
            alt=""
          />
          <img
            v-else
            class="w-16px h-16px ml-13px"
            src="@/assets/imgs/DataCenter/greenDown.png"
            alt=""
          />

          <span v-if="statusList[index - 1] == 'UP'" class="font-size-12px color-#F45057"
            >{{ t('DataCenter.txt15') + percentageList[index - 1] }}%</span
          >
          <span v-else class="font-size-12px color-#00C068"
            >{{ t('DataCenter.txt16') + percentageList[index - 1] }}%</span
          >
        </div>
      </div>
    </div>
    <div id="echart2" class="h-500px" style="width: 116%; margin-left: -8%"></div>
  </div>
</template>
<script setup lang="tsx">
import echarts from '@/plugins/echarts'
import { ref, onMounted } from 'vue'
import { debounce } from 'lodash-es'
import { ElDatePicker, ElCheckbox } from 'element-plus'
import { reactive } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import { getMonthDaysRange } from '@/utils/time'
import { profitAnalysisApi } from '@/api/financialCenter/financialProfile'

const { t } = useI18n()
const selectTime = ref()

const allData = ref()
const countList = ref<Array<any>>([])
const statusList = ref<Array<any>>([])
const percentageList = ref<Array<any>>([])
const xData = ref<Array<any>>([])

const checkedArr = reactive([true, true, true, true, false, false, false])
let hasCheckArr = ref([0, 1, 2, 3])
const titleArr = [
  t('managementProfile.block1'),
  t('managementProfile.block3'),
  t('financialProfile.sub9'),
  t('financialProfile.sub4'),
  t('financialProfile.sub7'),
  t('managementProfile.block6'),
  t('managementProfile.block7')
]
const setToolTip = (params) => {
  let str = `<div style="color:white;">
        <div style="font-size:12px;">${params.name}</div>
        <div style="display:flex;align-items:center;font-size:14px;">
          ${params.marker}
          <span style="margin-left: 5px;"> ${params.seriesName + '：' + params.value} </span>
          </div>
    </div>`
  return str
}
let echart2: any = null
const drawEchart2 = async () => {
  echart2 = echarts.init(document.getElementById('echart2'))
  await echart2.setOption({
    color: ['#0068E3', '#00fbbf', '#00EAFB', '#FB00FB', '#FB0022', '#FB7E00', '#FBE200'],
    tooltip: {
      show: true,
      trigger: 'axis',
      triggerOn: 'mousemove',

      formatter: function (params) {
        return setToolTip(params)
      },
      backgroundColor: 'rgba(0,0,0,0.7)',
      borderWidth: 0,
      axisPointer: {
        type: 'shadow',
        shadowStyle: {
          shadowColor: 'rgba(240,245,252,0)',
          color: 'rgb(240,245,252)',
          opacity: 0.6,
          shadowBlur: 10
        },
        z: 5
      }
    },
    xAxis: {
      type: 'category',
      // boundaryGap: false,
      data: xData,
      axisTick: {
        show: false
      }
    },
    yAxis: [
      {
        type: 'value',
        name: t('pointer.money'),
        nameLocation: 'start'
      },
      {
        type: 'value',
        name: t('review.count'),
        nameLocation: 'start'
      }
    ],
    series: generateData()
  })
  await yincang(4)
  await yincang(5)
  await yincang(6)
}

const generateData = () => {
  // let series: any = [
  //   { data: [] },
  //   { data: [] },
  //   { data: [] },
  //   { data: [] },
  //   { data: [] },
  //   { data: [] },
  //   { data: [] }
  // ]
  let series: any = []
  let temp = allData.value.list
  let name = [
    'turnoverAmount',
    'turnoverOrder',
    'unBalance',
    'serviceCharge',
    'creditInterest',
    'refundAmount',
    'refundOrder'
  ]

  for (let i = 0; i < 7; i++) {
    let obj: any = {
      name: titleArr[i],
      type: 'line',
      z: 30 - i,
      tooltip: {
        trigger: 'item'
      },
      data: [] as any
    }

    if (i != 2 && i != 4 && i != 6) {
      obj.yAxisIndex = 0
    } else {
      obj.yAxisIndex = 1
    }
    series.push(obj)
  }

  for (var m in series) {
    series[m].data = []
  }

  for (var i in temp) {
    for (var j in temp[i]) {
      let index = name.indexOf(j)
      if (index != -1) {
        series[index].data.push(temp[i][j])
      }
    }
  }

  return series
}

const changeCheckBox = async (val, index) => {
  if (val) {
    if (hasCheckArr.value.length == 4) {
      await yincang(hasCheckArr.value[0])
      checkedArr[hasCheckArr.value[0]] = false
      hasCheckArr.value.shift()
    }
    hasCheckArr.value.push(index)

    await xianshi(index)
  } else {
    let tempArr: any = []
    hasCheckArr.value.forEach((item) => {
      if (item != index) {
        tempArr.push(item)
      }
    })
    hasCheckArr.value = tempArr
    await yincang(index)
  }
}

const yincang = async (index) => {
  const series: any = await echart2.getOption().series
  series[index].lineStyle.width = 0
  series[index].itemStyle = { opacity: 0 }
  series[index].showSymbol = false

  await echart2.setOption({
    series
  })
}

const xianshi = async (index) => {
  const series: any = await echart2.getOption().series
  series[index].lineStyle.width = 2
  series[index].itemStyle = { opacity: 1 }
  series[index].showSymbol = true

  echart2.setOption({
    series
  })
}

const resizeHandler = debounce(() => {
  if (echart2) {
    echart2.resize()
  }
}, 100)

onMounted(async () => {
  selectTime.value = getMonthDaysRange('day')
  await getData()
})

const getData = async () => {
  const res3 = await profitAnalysisApi({
    beginDate: selectTime.value ? selectTime.value[0] : '',
    endDate: selectTime.value ? selectTime.value[1] : ''
  })
  if (res3.code == 200) {
    allData.value = res3.data
    countList.value = [
      res3.data.turnoverAmount.count,
      res3.data.turnoverOrder.count,
      res3.data.unBalance.count,
      res3.data.serviceCharge.count,
      res3.data.creditInterest.count,
      res3.data.refundAmount.count,
      res3.data.refundOrder.count
    ]

    statusList.value = [
      res3.data.turnoverAmount.status,
      res3.data.turnoverOrder.status,
      res3.data.unBalance.status,
      res3.data.serviceCharge.status,
      res3.data.creditInterest.status,
      res3.data.refundAmount.status,
      res3.data.refundOrder.status
    ]

    percentageList.value = [
      res3.data.turnoverAmount.percentage,
      res3.data.turnoverOrder.percentage,
      res3.data.unBalance.percentage,
      res3.data.serviceCharge.percentage,
      res3.data.creditInterest.percentage,
      res3.data.refundAmount.percentage,
      res3.data.refundOrder.percentage
    ]

    let temp = res3.data.list
    for (var item in temp) {
      xData.value.push(temp[item].date)
    }
  }

  drawEchart2()
  window.addEventListener('resize', () => {
    resizeHandler()
  })
}
</script>
<style lang="less" scoped>
.aaa:last-child {
  margin-right: 0px !important;
}
:deep(.checkStyle2.el-checkbox) {
  .el-checkbox__inner:hover {
    border-color: #00fbbf !important;
  }
  .el-checkbox__input.is-checked .el-checkbox__inner {
    background-color: #00fbbf !important;
    border-color: #00fbbf !important;
  }
}
:deep(.checkStyle3.el-checkbox) {
  .el-checkbox__inner:hover {
    border-color: #00eafb !important;
  }
  .el-checkbox__input.is-checked .el-checkbox__inner {
    background-color: #00eafb !important;
    border-color: #00eafb !important;
  }
}
:deep(.checkStyle4.el-checkbox) {
  .el-checkbox__inner:hover {
    border-color: #fb00fb !important;
  }
  .el-checkbox__input.is-checked .el-checkbox__inner {
    background-color: #fb00fb !important;
    border-color: #fb00fb !important;
  }
}
:deep(.checkStyle5.el-checkbox) {
  .el-checkbox__inner:hover {
    border-color: #fb0022 !important;
  }
  .el-checkbox__input.is-checked .el-checkbox__inner {
    background-color: #fb0022 !important;
    border-color: #fb0022 !important;
  }
}
:deep(.checkStyle6.el-checkbox) {
  .el-checkbox__inner:hover {
    border-color: #fb7e00 !important;
  }
  .el-checkbox__input.is-checked .el-checkbox__inner {
    background-color: #fb7e00 !important;
    border-color: #fb7e00 !important;
  }
}
:deep(.checkStyle7.el-checkbox) {
  .el-checkbox__inner:hover {
    border-color: #fbe200 !important;
  }
  .el-checkbox__input.is-checked .el-checkbox__inner {
    background-color: #fbe200 !important;
    border-color: #fbe200 !important;
  }
}
</style>
