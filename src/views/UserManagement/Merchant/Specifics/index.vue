<template>
  <div v-if="allData">
    <div class="flex-cb items-stretch">
      <div class="bg-#fff" style="width: calc(45% - 10px)">
        <ContentWrap class="pb-20px">
          <div>{{ t('merchantDetail.title1') }}</div>
          <div class="mt-20px flex-c color-#7A7A7A font-size-14px">
            <div class="text-right w-65px min-w-65px">{{ t('merchantDetail.name') }}:</div>
            <div class="ml-15px color-colorBlack">{{ allData.applicantName || '-' }}</div>
          </div>
          <div class="mt-20px flex-c color-#7A7A7A font-size-14px">
            <div class="text-right w-65px min-w-65px">{{ t('merchantDetail.iphone') }}:</div>
            <div class="ml-15px color-colorBlack">{{ allData.applicantMobile || '-' }}</div>
          </div>
          <div class="mt-20px flex-c color-#7A7A7A font-size-14px">
            <div class="text-right w-65px min-w-65px">{{ t('merchantDetail.email') }}:</div>
            <div class="ml-15px color-colorBlack">{{ allData.applicantEmail || '-' }}</div>
          </div>
          <div class="mt-20px flex-c color-#7A7A7A font-size-14px">
            <div class="text-right w-65px min-w-65px">{{ t('merchantDetail.id') }}:</div>
            <div class="ml-15px color-colorBlack">{{ merchantNo || '-' }}</div>
          </div>
        </ContentWrap>
        <div class="h-20px bg-#F0F2F5"></div>
        <ContentWrap class="pb-20px">
          <div>{{ t('merchantDetail.title2') }}</div>
          <div class="mt-20px flex-c color-#7A7A7A font-size-14px">
            <div class="text-right w-120px min-w-120px">{{ t('merchantDetail.companyName') }}:</div>
            <div class="ml-15px color-colorBlack">{{ allData.merchantName || '-' }}</div>
          </div>
          <div class="mt-20px flex-c color-#7A7A7A font-size-14px">
            <div class="text-right w-120px min-w-120px">{{ t('merchantDetail.licenseNum') }}:</div>
            <div class="ml-15px color-colorBlack">{{ allData.licenseNo || '-' }}</div>
          </div>
          <div class="mt-20px flex-c color-#7A7A7A font-size-14px">
            <div class="text-right w-120px min-w-120px">{{ t('merchantDetail.period') }}:</div>
            <div class="ml-15px color-colorBlack flex-c"
              ><span>{{ allData.licenseTerm || '-' }}</span
              ><el-tag
                v-hasPermi="'merinfo:merInfo:remind'"
                class="ml-10px cursor-pointer"
                @click="addQualificationReminderMessage"
                >{{ t('image.sub26') }}</el-tag
              ></div
            >
          </div>
          <div class="mt-20px flex flex-items-start color-#7A7A7A font-size-14px">
            <div class="text-right w-120px min-w-120px">{{ t('merchantDetail.validity') }}:</div>
            <div class="ml-15px color-colorBlack">
              <div @click="clickImage(affixImgUrl + allData.licenseImages)">
                <el-image
                  class="w-100px h-100px"
                  :src="affixImgUrl + allData.licenseImages"
                  fit="fill"
                />
              </div>
            </div>
          </div>
          <div class="mt-20px flex-c color-#7A7A7A font-size-14px">
            <div class="text-right w-120px min-w-120px">{{ t('merchantDetail.range') }}:</div>
            <div class="ml-15px w-500px color-colorBlack">{{ allData.businessScope || '-' }}</div>
          </div>
          <div class="mt-20px flex-c color-#7A7A7A font-size-14px">
            <div class="text-right w-120px min-w-120px">{{ t('merchantDetail.address') }}:</div>
            <div class="ml-15px color-colorBlack">{{ allData.address || '-' }}</div>
          </div>
          <div class="mt-20px flex flex-items-start color-#7A7A7A font-size-14px">
            <div class="text-right w-120px min-w-120px">{{ t('merchantDetail.idCard') }}:</div>
            <div class="ml-15px color-colorBlack">
              <div>
                <el-image
                  @click="clickImage(affixImgUrl + allData.legalIdImages)"
                  class="w-100px h-100px mr-15px"
                  :src="affixImgUrl + allData.legalIdImages"
                  fit="fill"
                />
                <el-image
                  @click="clickImage(affixImgUrl + allData.legalIdImagesBg)"
                  class="w-100px h-100px mr-15px"
                  :src="affixImgUrl + allData.legalIdImagesBg"
                  fit="fill"
                /> </div
            ></div>
          </div>
          <div class="mt-20px flex-c color-#7A7A7A font-size-14px">
            <div class="text-right w-120px min-w-120px">{{ t('merchantDetail.type') }}:</div>
            <div class="ml-15px color-colorBlack">{{ allData.managementModelStr || '-' }}</div>
          </div>
          <div class="mt-20px flex-c color-#7A7A7A font-size-14px">
            <div class="text-right w-120px min-w-120px">{{ t('merchantDetail.guarantor') }}:</div>
            <div class="ml-15px color-colorBlack">{{ allData.guarantor || '-' }}</div>
          </div>
          <div class="mt-20px flex-c color-#7A7A7A font-size-14px">
            <div class="text-right w-120px min-w-120px">{{ t('merchantDetail.money') }}:</div>
            <div class="ml-15px color-colorBlack">{{ allData.creditLimit || '-' }}</div>
          </div>
          <div class="mt-20px flex-c color-#7A7A7A font-size-14px">
            <div class="text-right w-120px min-w-120px">{{ t('merchantDetail.status') }}:</div>
            <div class="ml-15px color-colorBlack">{{ allData.statusStr || '-' }}</div>
          </div>
        </ContentWrap>
      </div>

      <div class="bg-#fff" style="width: calc(55% - 10px)">
        <ContentWrap class="pb-20px">
          <div>{{ t('merchantDetail.title3') }}</div>
          <el-tag class="mt-15px" type="danger"
            >{{ t('merchantDetail.sub1') }} {{ allData.issueDateStr || '-' }}
            {{ t('merchantDetail.sub2') }}
          </el-tag>
          <div class="flex-b mt-20px">
            <div class="w-40%">
              <div class="flex-c color-#7A7A7A font-size-14px">
                <div class="text-right w-60px min-w-60px"
                  >{{ t('merchantDetail.companyName') }}:</div
                >
                <div class="color-colorBlack ml-15px">{{ allData.merchantName || '-' }}</div>
              </div>
              <div class="flex flex-items-start color-#7A7A7A font-size-14px mt-20px">
                <div class="text-right w-63px min-w-63px">{{ t('merchantDetail.logo') }}:</div>
                <div class="color-colorBlack ml-15px"
                  ><div @click="clickImage(affixImgUrl + allData.logo)">
                    <el-image
                      class="w-100px h-100px mr-15px"
                      :src="affixImgUrl + allData.logo"
                      fit="fill" /></div
                ></div>
              </div>
            </div>
            <div class="w-60% flex flex-wrap mt-10px">
              <div class="flex flex-col w-100px">
                <div class="font-size-21px text-center">{{ allData.fansCount || '0' }}</div
                ><div class="text-center min-w-63px color-#7A7A7A font-size-14px mt-5px">{{
                  t('merchantDetail.sub3')
                }}</div>
              </div>
              <div class="bg-[#e4e4e4] w-3px h-40px mr-20px mt-8px ml-20px"></div>
              <div class="flex flex-col w-100px">
                <div class="font-size-21px text-center"
                  >{{ allData.thirtyDaysOrderCount || '0' }}{{ t('common.a42') }}</div
                ><div class="text-center min-w-63px color-#7A7A7A font-size-14px mt-5px">{{
                  t('merchantDetail.sub4')
                }}</div>
              </div>
              <div class="bg-[#e4e4e4] w-3px h-40px mr-20px mt-8px ml-20px"></div>
              <div class="flex flex-col w-100px">
                <div class="font-size-21px text-center">
                  {{ allData.secondGranceRate ? allData.secondGranceRate * 100 + '%' : '0%' }}</div
                ><div class="text-center min-w-63px color-#7A7A7A font-size-14px mt-5px">{{
                  t('merchantDetail.sub7')
                }}</div>
              </div>
            </div>
          </div>
        </ContentWrap>
        <div class="h-20px bg-#F0F2F5"></div>
        <ContentWrap class="mt-20px pb-20px">
          <div class="flex-b">
            <div class="w-50%">
              <div class="flex-c color-#7A7A7A font-size-14px">
                <div class="text-right w-60px min-w-60px">{{ t('merchantDetail.time') }}:</div>
                <div class="ml-15px color-colorBlack">{{ allData.foundTime || '-' }}</div>
              </div>
              <div class="flex-c mt-20px color-#7A7A7A font-size-14px">
                <div class="text-right w-60px min-w-60px">{{ t('merchantDetail.register') }}:</div>
                <div class="ml-15px color-colorBlack">{{ allData.registeredCapital || '-' }}</div>
              </div>
              <div class="flex-c mt-20px color-#7A7A7A font-size-14px">
                <div class="text-right w-60px min-w-60px">{{ t('merchantDetail.people') }}:</div>
                <div class="ml-15px color-colorBlack">{{ allData.employeeCountStr || '-' }}</div>
              </div>
              <div class="flex-c mt-20px color-#7A7A7A font-size-14px">
                <div class="text-right w-60px min-w-60px">{{ t('merchantDetail.size') }}:</div>
                <div class="ml-15px color-colorBlack">{{ allData.scaleStr || '-' }}</div>
              </div>
              <div class="flex-c mt-20px color-#7A7A7A font-size-14px">
                <div class="text-right w-60px min-w-60px">{{ t('merchantDetail.product') }}:</div>
                <div class="ml-15px color-colorBlack">{{ allData.mainProductsStr || '-' }}</div>
              </div>
            </div>
            <div class="w-50% ml-30px"
              ><div class="flex-c color-#7A7A7A font-size-14px">
                <div class="text-right w-60px min-w-60px">{{ t('merchantDetail.deal') }}:</div>
                <div class="ml-15px color-colorBlack">{{ allData?.yearDealAmount || '-' }}</div>
              </div>
              <div class="flex-c mt-20px color-#7A7A7A font-size-14px">
                <div class="text-right w-60px min-w-60px">{{ t('merchantDetail.brand') }}:</div>
                <div class="ml-15px color-colorBlack">{{ allData.brandName || '-' }}</div>
              </div>
              <div class="flex-c mt-20px color-#7A7A7A font-size-14px">
                <div class="text-right w-60px min-w-60px">{{ t('merchantDetail.custom') }}:</div>
                <div class="ml-15px color-colorBlack">{{ allData.mainCustomers || '-' }}</div>
              </div>
              <div class="flex-c mt-20px color-#7A7A7A font-size-14px">
                <div class="text-right w-60px min-w-60px">{{ t('merchantDetail.evaluate') }}:</div>
                <div class="ml-15px mt--7px color-colorBlack">
                  <div class="flex-c">
                    {{ t('merchantDetail.name1') }}
                    <ElRate
                      class="ml-5px"
                      v-model="rate"
                      disabled
                      show-score
                      text-color="#ff9900"
                      score-template="{value}"
                  /></div>
                  <div class="flex-c">
                    {{ t('merchantDetail.name2') }}
                    <div class="relative ml-5px">
                      <div
                        class="sedivs w-120px"
                        :style="{
                          overflow: serviceAttitude || 0 > 50 ? 'visible' : 'hidden'
                        }"
                      >
                        <div
                          class="sediv1"
                          :style="{ width: (120 * serviceAttitude) / 5 + 'px' }"
                          style="background: #f7ba2a; z-index: 200"
                        >
                        </div>
                        <div class="sediv"></div>
                      </div>
                    </div>

                    <div class="ml-130px">{{ allData?.serviceAttitude || '0' }}</div>
                  </div>
                  <div class="flex-c mt-8px">
                    {{ t('merchantDetail.name3') }}
                    <div class="relative ml-5px">
                      <div
                        class="sedivs w-120px"
                        :style="{ overflow: logisticsExperience > 50 ? 'visible' : 'hidden' }"
                      >
                        <div
                          class="sediv1"
                          :style="{ width: (120 * logisticsExperience) / 5 + 'px' }"
                          style="background: #f7ba2a; z-index: 200"
                        >
                        </div>
                        <div class="sediv"></div>
                      </div>
                    </div>

                    <div class="ml-130px">{{ allData?.logisticsExperience || '0' }}</div>
                  </div>
                  <div class="flex-c mt-8px">
                    {{ t('merchantDetail.name4') }}
                    <div class="relative ml-5px">
                      <div
                        class="sedivs w-120px"
                        :style="{ overflow: descriptionMatches > 50 ? 'visible' : 'hidden' }"
                      >
                        <div
                          class="sediv1"
                          :style="{ width: (120 * descriptionMatches) / 5 + 'px' }"
                          style="background: #f7ba2a; z-index: 200"
                        >
                        </div>
                        <div class="sediv"></div>
                      </div>
                    </div>

                    <div class="ml-130px">{{ allData?.descriptionMatches || '0' }}</div>
                  </div>
                </div>
              </div>
              <div class="flex flex-items-start mt-20px color-#7A7A7A font-size-14px">
                <div class="text-right w-60px min-w-60px"
                  >{{ t('merchantDetail.certificate') }}:</div
                >
                <div class="ml-15px color-colorBlack" v-if="allData.certificateImages">
                  <el-image
                    v-for="item in allData.certificateImages"
                    :key="item"
                    class="w-100px h-100px mr-15px"
                    @click="clickImage(affixImgUrl + item)"
                    :src="affixImgUrl + item"
                    fit="fill"
                  />
                </div>
                <Empty v-else />
              </div>
              <div class="flex mt-20px color-#7A7A7A font-size-14px">
                <div class="text-right w-60px min-w-60px">{{ t('merchantDetail.mobile') }}:</div>
                <div class="ml-15px color-colorBlack flex flex-wrap">
                  <div>{{ t('auth.name') + '：' + allData.applicantName }}</div>
                  <div class="ml-10px">{{
                    t('auth.tel') + '：' + allData.applicantMobile || '-'
                  }}</div>
                  <div class="mt-10px">{{
                    t('auth.email') + '：' + allData.applicantEmail || '-'
                  }}</div>
                </div>
              </div>
            </div>
          </div>
          <div
            v-hasPermi="'merinfo:merInfo:detail'"
            class="mt-20px flex-c border-rd-3px bg-[#ebf2fd] p-6px border-solid border-[#d0e3fa] border-1px w-100px pl-30px cursor-pointer"
            @click="dialogVisible = true"
            ><img src="@/assets/imgs/qualifications.png" class="w-20px h-20px" /><span
              class="ml-3px colorMain font-size-12px"
              >{{ t('merchantDetail.bottom') }}</span
            ></div
          >
        </ContentWrap>
        <div class="h-20px bg-#F0F2F5"></div>
        <ContentWrap class="mt-20px pb-20px">
          <div>
            {{ t('merchantDetail.title4') }}
          </div>
          <div v-if="allData.companyProfile">
            <div class="mt-20px">{{ allData.companyProfile }}</div>
            <div class="mt-20px">
              <el-image
                v-for="item in allData.factoryImages"
                :key="item"
                class="w-100px h-100px mr-15px"
                @click="clickImage(affixImgUrl + item)"
                :src="affixImgUrl + item"
                fit="fill"
            /></div>
          </div>
          <Empty v-else />
        </ContentWrap>
      </div>
    </div>
  </div>

  <Dialog v-model="dialogVisible" :title="t('merchantDialog.title')">
    <Write ref="writeRef" :allBody="allBody" />
    <!-- <template #footer> -->
    <!-- <ElButton @click="dialogVisible = false">{{ t('common.cancel') }}</ElButton> -->
    <!-- <ElButton type="primary" :loading="saveLoading" @click="save">
        {{ t('project.confirm') }}
      </ElButton> -->
    <!-- </template> -->
  </Dialog>
</template>

<script lang="tsx" setup>
import { Dialog } from '@/components/Dialog'
import Write from './components/add.vue'
import { ContentWrap } from '@/components/ContentWrap'
import { useI18n } from '@/hooks/web/useI18n'
import { ElTag, ElImage, ElMessage, ElRate } from 'element-plus'
import { createImageViewer } from '@/components/ImageViewer'
import Empty from '@/components/customComponents/Empty/index.vue'
import { ref } from 'vue'
import { ElButton } from 'element-plus'
const { t } = useI18n()
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'
import {
  getMerInfoDetailApi,
  getMerInfoMainApi,
  addQualificationReminderMessageApi
} from '@/api/userManage/MerchantInfo.ts'
const affixImgUrl = ref(import.meta.env.VITE_IMG_URL)
const { currentRoute } = useRouter()
import { useAppStore } from '@/store/modules/app'
const appStore = useAppStore()
appStore.setRenderLoading(true)
const clickImage = (data) => {
  createImageViewer({
    urlList: [data]
  })
}

const rate = ref(0)
const serviceAttitude = ref(0)
const descriptionMatches = ref(0)
const logisticsExperience = ref(0)

const dialogVisible = ref(false)

// 操作
let merchantNo: any = ref('')
const allData = ref()
const allBody = ref()
onMounted(() => {
  merchantNo.value = currentRoute.value.query.merchantNo
  init()
})

const init = async () => {
  const res = await getMerInfoDetailApi({ merchantNo: merchantNo.value })
  appStore.setRenderLoading(false)
  allData.value = res.data
  if (allData.value.factoryImages) {
    allData.value.factoryImages = allData.value.factoryImages.split(',')
  }
  if (allData.value.certificateImages) {
    allData.value.certificateImages = allData.value.certificateImages.split(',')
  }
  rate.value = parseFloat(allData.value.overallEvaluation) || 0
  serviceAttitude.value = parseFloat(allData.value.serviceAttitude) || 0
  descriptionMatches.value = parseFloat(allData.value.descriptionMatches) || 0
  logisticsExperience.value = parseFloat(allData.value.logisticsExperience) || 0
  const ares = await getMerInfoMainApi({ merchantNo: merchantNo.value })
  allBody.value = ares.data
}

const addQualificationReminderMessage = async () => {
  const res = await addQualificationReminderMessageApi({ merchantNo: merchantNo.value })
  if (res.code == 200) {
    ElMessage.success(t('common.operateSuccess'))
  }
}
</script>
<style lang="less" scoped>
.subTitle {
  text-align: left;
  color: #7b7e81;
}

.sedivs {
  position: absolute;
  width: 110px;
  height: 10px;
  top: -5px;
  border-radius: 10px;
  // border: red solid 1px;
  // overflow: hidden;
}

.sediv1 {
  position: absolute;
  top: 0;
  width: 0px;
  height: 10px;
  line-height: 10px;
  background: #f3f6fb;
  border-radius: 10px;
  display: flex;
  align-items: center;
}

.sediv {
  position: absolute;
  top: 0;
  width: 110px;
  height: 10px;
  line-height: 10px;
  background: #f3f6fb;
  border-radius: 10px;
  display: flex;
  align-items: center;
}

.text {
  position: absolute;
  z-index: 200;
  color: #535c6f;
  font-size: 24px;
  background-color: transparent;
  top: 5px;
  margin-left: 7px;
}
</style>
