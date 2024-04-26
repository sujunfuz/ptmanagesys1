<template>
  <div
    v-hasPermi="'dataCenter:dailyRevenue:view'"
    class="w-100% box-border pa-20px bg-white border-rd-4px"
  >
    <div class="color-colorBlack font-size-20px">{{ t('DataCenter.txt1') }}</div>
    <div class="w-100% flex justify-between color-colorBlack font-size-14px mt-30px">
      <!-- 左边 -->
      <div class="w-50%">
        <div class="flex-cb">
          <div class="flex-c">
            <div class="flex-col flex">
              <span class="font-size-14px">{{ t('DataCenter.txt2') }}</span>
              <div class="flex-c font-size-14px">
                <span class="font-size-20px font-600">{{ allData?.turnoverToday || 0 }}</span>
                <span class="ml-10px">{{ t('DataCenter.txt4') }}</span>
                <span class="color-colorMain">{{ allData?.turnoverDailyChangeRate || 0 }}%</span>
              </div>
            </div>
            <div class="flex-col flex ml-80px">
              <span class="font-size-14px">{{ t('DataCenter.txt3') }}</span>
              <div class="font-size-20px">{{ allData?.turnoverYesterday || 0 }}</div>
            </div>
          </div>
          <div class="flex flex-col">
            <div class="flex-c">
              <div class="w-40px h-20px border-(2px solid #0068e3 rd-50px)"></div>
              <div class="ml-10px">{{ t('DataCenter.txt5') }}</div>
            </div>
            <div class="flex-c mt-10px">
              <div class="w-40px h-20px border-(2px solid #00C068 rd-50px)"></div>
              <div class="ml-10px">{{ t('DataCenter.txt6') }}</div>
            </div>
          </div>
        </div>
        <div id="echart1" class="h-500px" style="width: 118%; margin-left: -6%"></div>
      </div>
      <!-- 右边 -->
      <div class="w-45% flex flex-col">
        <div class="flex-cb w-100%">
          <div
            class="pa-20px flex flex-col justify-between border-rd-10px w-350px h-235px box-border bg-#f0f2f5 customW"
          >
            <div>
              <div class="w-60px h-60px border-rd-10px bg-colorMain flex-cc">
                <Icon icon="majesticons:eye" color="white" :size="30" />
              </div>
              <div class="font-size-14px color-colorBlack font-500 mt-18px">{{
                t('DataCenter.txt7')
              }}</div>
            </div>
            <div class="color-colorBlack font-size-36px font-600">{{ allData?.pv || 0 }}</div>
          </div>
          <div
            class="pa-20px flex flex-col justify-between border-rd-10px w-350px h-235px box-border bg-#f0f2f5 customW"
          >
            <div>
              <div class="w-60px h-60px border-rd-10px bg-colorMain flex-cc">
                <Icon icon="fluent:people-team-16-filled" color="white" :size="30" />
              </div>
              <div class="font-size-14px color-colorBlack font-500 mt-18px">{{
                t('DataCenter.txt8')
              }}</div>
            </div>
            <div class="color-colorBlack font-size-36px font-600">{{ allData?.uv || 0 }}</div>
          </div>
        </div>
        <div class="flex-cb w-100% mt-20px">
          <div
            class="pa-20px flex flex-col justify-between border-rd-10px w-350px h-235px box-border bg-#f0f2f5 customW"
          >
            <div>
              <div class="w-60px h-60px border-rd-10px bg-colorMain flex-cc">
                <Icon icon="icon-park-outline:transaction-order" color="white" :size="30" />
              </div>
              <div class="font-size-14px color-colorBlack font-500 mt-18px">{{
                t('DataCenter.txt9')
              }}</div>
            </div>
            <div class="color-colorBlack font-size-36px font-600">{{
              allData?.turnoverOrderCount || 0
            }}</div>
          </div>
          <div
            class="pa-20px flex flex-col justify-between border-rd-10px w-350px h-235px box-border bg-#f0f2f5 customW"
          >
            <div>
              <div class="w-60px h-60px border-rd-10px bg-colorMain flex-cc">
                <Icon icon="icon-park-outline:transaction-order" color="white" :size="30" />
              </div>
              <div class="font-size-14px color-colorBlack font-500 mt-18px">{{
                t('DataCenter.txt10')
              }}</div>
            </div>
            <div class="color-colorBlack font-size-36px font-600">{{
              allData?.refundOrderCount || 0
            }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="tsx">
import echarts from '@/plugins/echarts'
import { ref, onMounted } from 'vue'
import { Icon } from '@/components/Icon'
import { debounce } from 'lodash-es'
import { useI18n } from '@/hooks/web/useI18n'
import { dailyRevenueApi } from '@/api/financialCenter/dataCenter'

const { t } = useI18n()
let echart1: any = null
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
const drawEchart1 = () => {
  echart1 = echarts.init(document.getElementById('echart1'))
  echart1.setOption({
    color: ['#0068E3', '#00C068'],
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
      data: allData.value.turnoverTodayLink.xAxis,
      axisTick: {
        show: false
      },
      axisLabel: { interval: 1 }
    },
    yAxis: {
      type: 'value',

      boundaryGap: [0, '10%']
    },
    series: [
      {
        name: allData.value.turnoverTodayLink.title,
        type: 'line',
        data: allData.value.turnoverTodayLink.yAxis.split,
        z: 15,
        tooltip: {
          trigger: 'item'
        }
      },
      {
        name: allData.value.turnoverYesterdayLink.title,
        type: 'line',
        data: allData.value.turnoverYesterdayLink.yAxis,
        z: 10,
        tooltip: {
          trigger: 'item'
        }
      }
    ]
  })
}

const resizeHandler = debounce(() => {
  if (echart1) {
    echart1.resize()
  }
}, 100)

const allData = ref()
onMounted(async () => {
  const res = await dailyRevenueApi()
  if (res.code == 200) {
    allData.value = res.data
  }
  drawEchart1()
  window.addEventListener('resize', () => {
    resizeHandler()
  })
})
</script>
<style scoped lang="less">
.customW {
  width: calc(50% - 10px);
}
</style>
