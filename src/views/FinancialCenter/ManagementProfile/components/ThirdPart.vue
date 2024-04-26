<template>
  <ContentWrap class="mt-20px">
    <div class="font-size-20px color-colorBlack">{{ t('managementProfile.sub4') }}</div>
    <div class="flex mt-20px ml-20px">
      <div class="color-colorBlack font-size-14px">{{ t('managementProfile.txt5') }}</div>
      <div class="flex font-size-14px [&>div]:(cursor-pointer)">
        <div
          @click="typeIndex = 0"
          :class="typeIndex == 0 ? '!border-(1px solid #0068e3) !color-#0068e3 !bg-#e5effc' : ''"
          class="w-100px h-40px text-center ml-30px line-height-40px color-#797979 border-rd-4px border-(1px solid #e6e8eb)"
          >{{ t('managementProfile.txt6') }}</div
        >
        <div
          @click="typeIndex = 1"
          :class="typeIndex == 1 ? '!border-(1px solid #0068e3) !color-#0068e3 !bg-#e5effc' : ''"
          class="w-100px h-40px text-center ml-30px line-height-40px color-#797979 border-rd-4px border-(1px solid #e6e8eb)"
          >{{ t('managementProfile.txt7') }}</div
        >
        <div
          @click="typeIndex = 2"
          :class="typeIndex == 2 ? '!border-(1px solid #0068e3) !color-#0068e3 !bg-#e5effc' : ''"
          class="w-100px h-40px text-center ml-30px line-height-40px color-#797979 border-rd-4px border-(1px solid #e6e8eb)"
          >{{ t('managementProfile.txt8') }}</div
        >
      </div>
    </div>
    <div class="w-100% flex-cb h-500px">
      <div class="relative w-50% h-100%">
        <div id="piegraph" class="w-100% h-100%"></div>
        <div
          class="w-200px h-200px border-rd-200px flex-cc flex-col absolute z-10"
          style="
            box-shadow: 0px 5px 15px 1px #deebfc;
            left: calc(50% - 100px);
            top: calc(50% - 100px);
          "
        >
          <div class="flex-cc">
            <span class="color-#535C6F font-size-12px"
              >{{ titleStr + t('managementProfile.txt12') }}：</span
            >
            <span class="color-#535C6F font-size-18px ml-10px">{{ getCount()?.count }}</span>
          </div>
          <div class="flex-cc mt-30px">
            <span class="color-#535C6F font-size-12px"
              >{{ titleStr + t('managementProfile.txt13') }}：</span
            >
            <span class="color-#535C6F font-size-18px ml-10px">{{ getCount()?.num }}</span>
          </div>
        </div>
      </div>
      <div class="w-50% h-100% flex-cc flex-col" v-if="qvdaoData.length > 0">
        <div class="flex-cb w-570px flex-wrap">
          <!-- <div
            @click="changeIndex(0)"
            :class="selectIndex == 0 ? 'bg-#f2f7fe border-(#0068E3 1px solid)' : ''"
            class="flex pa-20px border-rd-10px w-250px h-150px box-border"
          >
            <div
              class="w-20px h-20px"
              style="background: linear-gradient(180deg, #f8c720 0%, #ff6d38 100%)"
            ></div>
            <div class="color-#535C6F font-size-14px ml-10px mt--15px">
              <div>
                <span class="font-bold">支付宝</span>
                <span class="font-size-30px font-bold ml-4px">29%</span>
              </div>
              <div class="mt-20px">{{ titleStr + t('managementProfile.txt12') }}：8438</div>
              <div class="mt-11px">{{ titleStr + t('managementProfile.txt13') }}：8438</div>
            </div>
          </div>
          <div
            @click="changeIndex(3)"
            :class="selectIndex == 3 ? 'bg-#f2f7fe border-(#0068E3 1px solid)' : ''"
            class="flex pa-20px border-rd-10px ml-40px w-250px h-150px box-border"
          >
            <div
              class="w-20px h-20px"
              style="background: linear-gradient(180deg, #46aeff 0%, #4469ff 100%)"
            ></div>
            <div class="color-#535C6F font-size-14px ml-10px mt--15px">
              <div>
                <span class="font-bold">VISA</span>
                <span class="font-size-30px font-bold ml-4px">29%</span>
              </div>
              <div class="mt-20px">{{ titleStr + t('managementProfile.txt12') }}：8438</div>
              <div class="mt-11px">{{ titleStr + t('managementProfile.txt13') }}：8438</div>
            </div>
          </div> -->
          <div
            v-for="(item, index) in qvdaoData[typeIndex].list"
            :key="index"
            @click="changeIndex(index)"
            :class="selectIndex == index ? 'bg-#f2f7fe border-(#0068E3 1px solid)' : ''"
            class="card flex pa-20px border-rd-10px w-250px h-150px box-border"
          >
            <div class="w-20px h-20px" :style="'background: ' + styleEnum[index]"></div>
            <div class="color-#535C6F font-size-14px ml-10px mt--15px">
              <div>
                <span class="font-bold">{{ item.typeStr }}</span>
                <span class="font-size-30px font-bold ml-4px">{{ item.percentage }}%</span>
              </div>
              <div class="mt-20px"
                >{{ titleStr + t('managementProfile.txt12') }}：{{ item.count }}</div
              >
              <div class="mt-11px"
                >{{ titleStr + t('managementProfile.txt13') }}：{{ item.num }}</div
              >
            </div>
          </div>
          <!-- <div
            @click="changeIndex(2)"
            :class="selectIndex == 2 ? 'bg-#f2f7fe border-(#0068E3 1px solid)' : ''"
            class="card flex pa-20px border-rd-10px ml-40px w-250px h-150px box-border"
          >
            <div
              class="w-20px h-20px"
              style="background: linear-gradient(180deg, #4fdf66 0%, #48cfa3 100%)"
            ></div>
            <div class="color-#535C6F font-size-14px ml-10px mt--15px">
              <div>
                <span class="font-bold">VISA</span>
                <span class="font-size-30px font-bold ml-4px">29%</span>
              </div>
              <div class="mt-20px">{{ titleStr + t('managementProfile.txt12') }}：8438</div>
              <div class="mt-11px">{{ titleStr + t('managementProfile.txt13') }}：8438</div>
            </div>
          </div> -->
        </div>
        <!-- <div class="flex-cb mt-70px">
          <div
            @click="changeIndex(1)"
            :class="selectIndex == 1 ? 'bg-#f2f7fe border-(#0068E3 1px solid)' : ''"
            class="flex pa-20px border-rd-10px w-250px h-150px box-border"
          >
            <div
              class="w-20px h-20px"
              style="background: linear-gradient(180deg, #5de8ff 0%, #2ea9e9 100%)"
            ></div>
            <div class="color-#535C6F font-size-14px ml-10px mt--15px">
              <div>
                <span class="font-bold">VISA</span>
                <span class="font-size-30px font-bold ml-4px">29%</span>
              </div>
              <div class="mt-20px">{{ titleStr + t('managementProfile.txt12') }}：8438</div>
              <div class="mt-11px">{{ titleStr + t('managementProfile.txt13') }}：8438</div>
            </div>
          </div>
          <div
            @click="changeIndex(2)"
            :class="selectIndex == 2 ? 'bg-#f2f7fe border-(#0068E3 1px solid)' : ''"
            class="flex pa-20px border-rd-10px ml-40px w-250px h-150px box-border"
          >
            <div
              class="w-20px h-20px"
              style="background: linear-gradient(180deg, #4fdf66 0%, #48cfa3 100%)"
            ></div>
            <div class="color-#535C6F font-size-14px ml-10px mt--15px">
              <div>
                <span class="font-bold">VISA</span>
                <span class="font-size-30px font-bold ml-4px">29%</span>
              </div>
              <div class="mt-20px">{{ titleStr + t('managementProfile.txt12') }}：8438</div>
              <div class="mt-11px">{{ titleStr + t('managementProfile.txt13') }}：8438</div>
            </div>
          </div>
        </div> -->
      </div>
    </div>
  </ContentWrap>
</template>
<script setup lang="tsx">
import { ContentWrap } from '@/components/ContentWrap'
import { useI18n } from '@/hooks/web/useI18n'
import echarts from '@/plugins/echarts'
import { debounce } from 'lodash-es'
import { channelApi } from '@/api/managementProfile/index'
import { ref, onMounted, computed, watch } from 'vue'
const { t } = useI18n()
let piegraph: any = null
let typeIndex = ref(0)
let selectIndex = ref(0)
const styleEnum = [
  'linear-gradient(180deg, #f8c720 0%, #ff6d38 100%)',
  'linear-gradient(180deg, #5de8ff 0%, #2ea9e9 100%)',
  'linear-gradient(180deg, #4fdf66 0%, #48cfa3 100%)',
  'linear-gradient(180deg, #46aeff 0%, #4469ff 100%)'
]
// const dishonourTrade = ref<any>({})
// const refundTrade = ref<any>({})
// const successTrade = ref<any>({})
const titleStr = computed(() => {
  if (typeIndex.value == 0) {
    return t('managementProfile.txt9')
  } else if (typeIndex.value == 1) {
    return t('managementProfile.txt10')
  } else {
    return t('managementProfile.txt11')
  }
})
watch(
  () => typeIndex.value,
  async () => {
    setData()
    await piegraph.setOption({
      series: [
        {
          name: 'Access From',
          type: 'pie',
          radius: ['50%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          emphasis: {
            //   scale: false,
            scaleSize: 10
          },
          label: {
            show: false,
            position: 'center'
          },
          labelLine: {
            show: false
          },
          data: pieData.value
        }
      ]
    })
  }
)
const drawPieGraph = async () => {
  piegraph = echarts.init(document.getElementById('piegraph'))
  await piegraph.setOption({
    legend: {
      top: '5%',
      left: 'center'
    },
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: ['50%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        emphasis: {
          //   scale: false,
          scaleSize: 10
        },
        label: {
          show: false,
          position: 'center'
        },
        // emphasis: {
        //   label: {
        //     show: true,
        //     fontSize: 40,
        //     fontWeight: 'bold'
        //   }
        // },
        labelLine: {
          show: false
        },
        data: pieData.value
      }
    ]
  })
  await piegraph.dispatchAction({
    type: 'highlight',
    seriesIndex: 0,
    dataIndex: 0
  })
}

const changeIndex = async (val) => {
  await piegraph.dispatchAction({
    type: 'downplay',
    seriesIndex: 0,
    dataIndex: selectIndex.value
  })
  selectIndex.value = val
  await piegraph.dispatchAction({
    type: 'highlight',
    seriesIndex: 0,
    dataIndex: selectIndex.value
  })
}
const pieData = ref<any>([])
const setData = () => {
  let itemStyle: any = [
    {
      itemStyle: {
        normal: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: '#F8C720'
            },
            {
              offset: 1,
              color: '#FF6D38'
            }
          ])
        }
      }
    },
    {
      itemStyle: {
        normal: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: '#5DE8FF'
            },
            {
              offset: 1,
              color: '#2EA9E9'
            }
          ])
        }
      }
    },
    {
      itemStyle: {
        normal: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: '#4FDF66'
            },
            {
              offset: 1,
              color: '#48CFA3'
            }
          ])
        }
      }
    },
    {
      itemStyle: {
        normal: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: '#46AEFF'
            },
            {
              offset: 1,
              color: '#4469FF'
            }
          ])
        }
      }
    }
  ]
  let tempArr: any = []
  qvdaoData.value[typeIndex.value].list.forEach((item, index) => {
    itemStyle[index].value = item.count
    tempArr.push(itemStyle[index])
  })
  pieData.value = tempArr
}

const qvdaoData = ref<any>([])
const allData = ref()
onMounted(async () => {
  const res = await channelApi()
  qvdaoData.value[0] = res.data.successTrade
  qvdaoData.value[1] = res.data.dishonourTrade
  qvdaoData.value[2] = res.data.refundTrade
  setData()
  await drawPieGraph()
  window.addEventListener('resize', () => {
    if (piegraph) {
      // debounce(() => {
      piegraph.resize()
      // }, 100)
    }
    // debounce(() => {
    //   if (piegraph) {
    //     piegraph.resize()
    //   }
    // }, 100)
  })

  allData.value = res.data
})

const getCount = () => {
  let arr = ['successTrade', 'dishonourTrade', 'refundTrade']
  let str = arr[typeIndex.value]
  let res = allData.value?.[str]
  return res
}
</script>
<style lang="less" scoped>
.card:nth-child(3) {
  margin-top: 70px;
}
.card:nth-child(4) {
  margin-top: 70px;
}
</style>
