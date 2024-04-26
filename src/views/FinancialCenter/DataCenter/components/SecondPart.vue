<template>
  <div
    v-hasPermi="'dataCenter:orderAnalysis:view'"
    class="w-100% box-border pa-20px bg-white border-rd-4px mt-20px"
  >
    <div class="color-colorBlack font-size-20px flex-cb">
      <span>{{ t('DataCenter.txt17') }}</span>
      <div class="w-390px">
        <el-date-picker
          v-model="selectTime"
          type="daterange"
          value-format="YYYY-MM-DD"
          range-separator="To"
          @change="getGetMonthDaysRange"
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
    <div id="echart2" class="h-500px" style="width: 120%; margin-left: -8%"></div>
  </div>

  <div
    v-hasPermi="'dataCenter:goodsAnalysis:view'"
    class="w-100% box-border pa-20px bg-white border-rd-4px mt-20px"
    @click="yincang"
  >
    <div class="color-colorBlack font-size-20px flex-cb">
      <span>{{ t('DataCenter.txt18') }}</span>
      <div class="w-390px">
        <el-date-picker
          v-model="selectTime1"
          type="daterange"
          value-format="YYYY-MM-DD"
          range-separator="To"
          @change="getGoodsAnalysisData"
        />
      </div>
    </div>
    <div class="flex-c w-100% mt-43px color-colorBlack">
      <div
        v-for="(item, index) in goodsAnalysisData"
        :key="index"
        class="w-13% pa-20px box-border border-rd-4px h-106px mr-20px aaa"
        style="border: 1px solid #f0f2f5; box-shadow: 1px 3px 12px 1px rgba(0, 0, 0, 0.08)"
      >
        <div class="font-size-14px font-500">{{ item.title }}</div>
        <div class="font-size-20px font-500 mt-20px">{{ item.count }}</div>
      </div>
    </div>
  </div>
</template>
<script setup lang="tsx">
import echarts from '@/plugins/echarts'
import { ref, onMounted } from 'vue'
import { goodsAnalysisApi, orderAnalysisApi } from '@/api/financialCenter/dataCenter'
import { debounce } from 'lodash-es'
import { ElDatePicker, ElCheckbox } from 'element-plus'
import { reactive } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import { getMonthDaysRange } from '@/utils/time'
const { t } = useI18n()
const selectTime = ref()
const selectTime1 = ref()

const allData = ref()
const checkedArr = reactive([true, true, true, true, true, true, true])
const titleArr = [
  t('DataCenter.txt9'),
  t('DataCenter.txt11'),
  t('DataCenter.txt8'),
  t('DataCenter.txt7'),
  t('DataCenter.txt12'),
  t('DataCenter.txt10'),
  t('DataCenter.txt13')
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

const countList = ref<Array<any>>([])
const statusList = ref<Array<any>>([])
const percentageList = ref<Array<any>>([])
const xData = ref<Array<any>>([])
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
      data: xData.value,
      axisTick: {
        show: false
      }
    },
    yAxis: {
      type: 'value',

      boundaryGap: [0, '10%']
    },
    series: generateData()
  })
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
    'turnoverOrderCount',
    'guestUnitPrice',
    'uv',
    'pv',
    'orderConversionRate',
    'refundOrderCount',
    'refundRate'
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
    for (let j = 0; j < 9; j++) {
      if (i != 2 && i != 4 && i != 6) {
        obj.data.push(Math.random() * 100000)
      } else {
        obj.data.push(Math.random() * 2000)
      }
    }
    // if (i != 2 && i != 4 && i != 6) {
    //   obj.yAxisIndex = 0
    // } else {
    //   obj.yAxisIndex = 1
    // }
    obj.yAxisIndex = 0
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
    await xianshi(index)
  } else {
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

const goodsAnalysisData = ref()

const getGoodsAnalysisData = async () => {
  const res1 = await goodsAnalysisApi({
    beginDate: selectTime1.value ? selectTime1.value[0] : '',
    endDate: selectTime1.value ? selectTime1.value[1] : ''
  })
  if (res1.code == 200) {
    goodsAnalysisData.value = res1.data
  }
}

const getGetMonthDaysRange = async () => {
  const res1 = await orderAnalysisApi({
    beginDate: selectTime.value ? selectTime.value[0] : '',
    endDate: selectTime.value ? selectTime.value[1] : ''
  })
  if (res1.code == 200) {
    allData.value = res1.data
    countList.value = [
      res1.data.turnoverOrderCount.count,
      res1.data.guestUnitPrice.count,
      res1.data.uv.count,
      res1.data.pv.count,
      res1.data.orderConversionRate.count,
      res1.data.refundOrderCount.count,
      res1.data.refundRate.count
    ]

    statusList.value = [
      res1.data.turnoverOrderCount.status,
      res1.data.guestUnitPrice.status,
      res1.data.uv.status,
      res1.data.pv.status,
      res1.data.orderConversionRate.status,
      res1.data.refundOrderCount.status,
      res1.data.refundRate.status
    ]

    percentageList.value = [
      res1.data.turnoverOrderCount.percentage,
      res1.data.guestUnitPrice.percentage,
      res1.data.uv.percentage,
      res1.data.pv.percentage,
      res1.data.orderConversionRate.percentage,
      res1.data.refundOrderCount.percentage,
      res1.data.refundRate.percentage
    ]

    let temp = res1.data.list
    for (var item in temp) {
      xData.value.push(temp[item].date)
    }
  }
}
onMounted(async () => {
  selectTime1.value = getMonthDaysRange('day')
  selectTime.value = selectTime1.value
  console.log(selectTime.value)
  // let str: any = getMonthDaysRange('day')
  // selectTime1.value = [new Date(), new Date()]
  await getGetMonthDaysRange()
  await getGoodsAnalysisData()
  drawEchart2()
  window.addEventListener('resize', () => {
    resizeHandler()
  })
})
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
