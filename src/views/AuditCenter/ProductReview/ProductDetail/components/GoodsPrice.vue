<template>
  <ContentWrap>
    <div class="font-size-20px color-colorBlack">{{ t('productList.price') }}</div>
    <!-- 区间价格 -->
    <!-- <div class="w-100% font-size-14px color-colorBlack">
      <div class="w-20% mt-20px">
        <span class="inline-block customW text-right">{{ t('productList.RangePrice') }}</span>
      </div>
    </div>
    <div class="flex flex-wrap w-100% font-size-14px color-colorBlack">
      <div class="w-20% mt-20px flex-b flex-col" v-for="index in 3" :key="index">
        <div class="flex-b"
          ><span class="inline-block customW text-right">{{ t('productList.volume') }}</span>
          <span class="inline-block customW">1-20</span>
        </div>
        <div class="mt-20px flex-b"
          ><span class="inline-block customW text-right">{{ t('productList.price') }}</span>
          <span class="inline-block customW">99.99</span>
        </div>
      </div>
    </div> -->
    <!-- 一件代发 -->
    <!-- <div class="w-100% font-size-14px color-colorBlack">
      <div class="w-20% mt-20px">
        <span class="inline-block customW text-right">{{ t('productList.shipping') }}</span>
      </div>
    </div>
    <div class="flex flex-wrap w-100% font-size-14px color-colorBlack">
      <div class="w-100% mt-20px flex-b" v-for="index in 4" :key="index">
        <span class="inline-block customLW text-right">{{ t('productList.issuingPrice') }}</span>
        <span class="inline-block customRW">99.99</span>
      </div>
    </div> -->
    <!-- 表格 -->
    <table class="my-20px">
      <thead>
        <tr>
          <th rowspan="2">{{ t('productList.color') }}</th>
          <th rowspan="2">{{ t('productList.size1') }}</th>
          <th rowspan="2">{{ t('productList.package') }}</th>
          <th rowspan="1" colspan="3">{{ t('productList.RangePrice') }}</th>
          <th rowspan="2">{{ t('productList.shipping') }}</th>
          <th rowspan="2">{{ t('productList.inventory') }}</th>
          <th rowspan="2">SKUID</th>
        </tr>
        <tr>
          <th>1-20</th>
          <th>21-100</th>
          <th>101-500</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="(item, index) in tempArr" :key="index">
          <tr>
            <td :rowspan="item.rowspan">{{ item.title }}</td>
          </tr>
          <template v-for="(aitem, aindex) in item.secTwo" :key="aindex">
            <tr>
              <td :rowspan="aitem.rowspan">{{ aitem.title }}</td>
            </tr>
            <tr v-for="(bitem, bindex) in aitem.secThree" :key="bindex">
              <td v-for="(citem, cindex) in bitem" :key="cindex">{{ citem }}</td>
            </tr>
          </template>
          <!-- <tr> </tr> -->
        </template>
      </tbody>
    </table>
  </ContentWrap>
</template>
<script setup lang="tsx">
import { ContentWrap } from '@/components/ContentWrap/index.ts'
import { useI18n } from '@/hooks/web/useI18n'
const { t } = useI18n()
import { watch, ref } from 'vue'
const props = defineProps({
  allData: {
    type: Object,
    default: () => {}
  },
  tempArr1: {
    type: Object,
    default: () => {}
  }
})

let attrList = ref<Array<any>>([])
watch(
  () => props.allData,
  () => {
    let temp = JSON.parse(props.allData?.spuDetail.specialSpec)
    for (var item in temp) {
      attrList.value.push({
        name: item,
        value: temp[item]
      })
    }
  }
)

const tempArr = [
  {
    rowspan: 9,
    title: '内容header',
    secTwo: [
      {
        rowspan: 4,
        title: '我是第二集',
        secThree: [
          {
            a: 1,
            b: 2,
            c: 3,
            d: 4,
            e: 5,
            f: 6,
            g: 7
          },
          {
            a: 1,
            b: 2,
            c: 3,
            d: 4,
            e: 5,
            f: 6,
            g: 7
          },
          {
            a: 1,
            b: 2,
            c: 3,
            d: 4,
            e: 5,
            f: 6,
            g: 7
          }
        ]
      },
      {
        rowspan: 4,
        title: '我是第三集',
        secThree: [
          {
            a: 1,
            b: 2,
            c: 3,
            d: 4,
            e: 5,
            f: 6,
            g: 7
          },
          {
            a: 1,
            b: 2,
            c: 3,
            d: 4,
            e: 5,
            f: 6,
            g: 7
          },
          {
            a: 1,
            b: 2,
            c: 3,
            d: 4,
            e: 5,
            f: 6,
            g: 7
          }
        ]
      }
    ]
  }
]
</script>
<style lang="less" scoped>
.customW {
  width: calc(50% - 10px);
}

.customLW {
  width: calc(10% - 10px);
}

.customRW {
  width: calc(90% - 10px);
}

// table {
//   width: 100%;
//   border-top: 1px solid #707070;
//   border-left: 1px solid #707070;
//   border-spacing: 0;
//   /*去掉单元格间隙*/
// }

// table td {
//   // padding: 10px 30px;
//   border-bottom: 1px solid #707070;
//   border-right: 1px solid #707070;
// }
table {
  width: 100%;
}
table,
th,
td {
  border: 1px solid #707070;
  text-align: center;
  color: #14181f;
  font-weight: normal;
}
table {
  border-collapse: collapse;
}
</style>
