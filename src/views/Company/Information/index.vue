<template>
  <div class="bg-#fff Informationbg" v-if="!isMerchant">
    <div class="flex-c flex-col pt-40px pb-40px">
      <img class="h-89px w-147px" :src="emptyBack" alt="" />
      <div class="mt-20px">{{ t('project.noaccount') }}</div>
    </div>
  </div>
  <div v-else>
    <div class="flex-b items-stretch">
      <div class="w-50% bg-#fff">
        <ContentWrap>
          <div>{{ t('merchantDetail.title1') }}</div>
          <div class="mt-10px flex-c color-#7A7A7A font-size-14px">
            <div class="text-right w-65px min-w-65px">{{ t('merchantDetail.name') }}:</div>
            <div class="ml-15px color-colorBlack">{{ detailData?.applicantName || '-' }}</div>
          </div>
          <div class="mt-10px flex-c color-#7A7A7A font-size-14px">
            <div class="text-right w-65px min-w-65px">{{ t('merchantDetail.iphone') }}:</div>
            <div class="ml-15px color-colorBlack">{{ detailData?.applicantMobile || '-' }}</div>
          </div>
          <div class="mt-10px flex-c color-#7A7A7A font-size-14px">
            <div class="text-right w-65px min-w-65px">{{ t('merchantDetail.email') }}:</div>
            <div class="ml-15px color-colorBlack">{{ detailData?.applicantEmail || '-' }}</div>
          </div>
        </ContentWrap>
        <div class="h-10px bg-#F0F2F5"></div>
        <ContentWrap class="mt-10px">
          <div>{{ t('merchantDetail.title2') }}</div>
          <div class="mt-10px flex-c color-#7A7A7A font-size-14px">
            <div class="text-right w-110px min-w-110px">{{ t('merchantDetail.companyName') }}:</div>
            <div class="ml-15px color-colorBlack">{{ detailData?.merchantName || '-' }}</div>
          </div>
          <div class="mt-10px flex-c color-#7A7A7A font-size-14px">
            <div class="text-right w-110px min-w-110px">{{ t('merchantDetail.licenseNum') }}:</div>
            <div class="ml-15px color-colorBlack"><span>{{ detailData?.licenseNo || '-' }}</span></div>
          </div>
          <div class="mt-10px flex-c color-#7A7A7A font-size-14px">
            <div class="text-right w-110px min-w-110px">{{ t('merchantDetail.period') }}:</div>
            <div class="ml-15px color-colorBlack flex-c">{{ detailData?.licenseTerm.split(',')[0] || '-' }} -
              {{ detailData?.licenseTerm.split(',')[1] || '-'
              }}<el-tag class="ml-10px cursor-pointer" effect="plain" @click="clickUpdateTerm()">{{
  t('companyInformation.update')
}}</el-tag></div>
          </div>
          <div class="mt-10px flex flex-items-start color-#7A7A7A font-size-14px">
            <div class="text-right w-110px min-w-110px">{{ t('merchantDetail.validity') }}:</div>
            <div class="ml-15px color-colorBlack" v-if="detailData?.licenseImages">
              <div @click="clickImage(imgUrl + detailData?.licenseImages)">
                <el-image class="w-100px h-100px" :src="imgUrl + detailData?.licenseImages" fit="fill" />
              </div>
            </div>
            <div v-else class="ml-15px">-</div>
          </div>
          <div class="mt-10px flex-c color-#7A7A7A font-size-14px">
            <div class="text-right w-110px min-w-110px">{{ t('merchantDetail.range') }}:</div>
            <div class="ml-15px color-colorBlack">{{ detailData?.businessScope || '-' }}</div>
          </div>
          <div class="mt-10px flex-c color-#7A7A7A font-size-14px">
            <div class="text-right w-110px min-w-110px">{{ t('merchantDetail.address') }}:</div>
            <div class="ml-15px color-colorBlack">{{ detailData?.address || '-' }}</div>
          </div>
          <div class="mt-10px flex-c color-#7A7A7A font-size-14px">
            <div class="text-right w-110px min-w-110px">{{ t('merchantDetail.product') }}:</div>
            <div class="ml-15px color-colorBlack">{{ detailData?.mainProductsStr || '-' }}</div>
          </div>
          <div class="mt-10px flex flex-items-start color-#7A7A7A font-size-14px">
            <div class="text-right w-110px min-w-110px">{{ t('merchantDetail.idCard') }}:</div>
            <div class="ml-15px color-colorBlack" v-if="detailData?.legalIdImages">
              <!-- <div
                @click="
                  clickImage([
                    imgUrl + detailData?.legalIdImages,
                    imgUrl + detailData?.legalIdImagesBg
                  ])
                "
              > -->
              <el-image
@click="clickImage(imgUrl + detailData?.legalIdImages)" class="w-100px h-100px mr-15px"
                :src="imgUrl + detailData?.legalIdImages" fit="fill" />
              <el-image
@click="clickImage(imgUrl + detailData?.legalIdImagesBg)" class="w-100px h-100px mr-15px"
                :src="imgUrl + detailData?.legalIdImagesBg" fit="fill" />
              <!-- </div> -->
            </div>
            <div v-else class="ml-15px">-</div>
          </div>
          <div class="mt-10px flex-c color-#7A7A7A font-size-14px">
            <div class="text-right w-110px min-w-110px">{{ t('merchantDetail.type') }}:</div>
            <div class="ml-15px color-colorBlack">{{ detailData?.managementModelStr || '-' }}</div>
          </div>
        </ContentWrap>
      </div>

      <div class="w-50% ml-10px">
        <ContentWrap>
          <div>{{ t('merchantDetail.title3') }}</div>
          <el-tag class="mt-15px" type="danger">{{ t('merchantDetail.sub1') }} {{ detailData?.issueDate.substring(0, 10)
            || '-' }}
            {{ t('merchantDetail.sub2') }}
          </el-tag>
          <div class="flex-b mt-10px">
            <div class="w-40%">
              <div class="flex-c color-#7A7A7A font-size-14px">
                <div class="text-right w-60px min-w-60px">{{ t('merchantDetail.companyName') }}:</div>
                <div class="color-colorBlack ml-15px">{{ detailData?.merchantName || '-' }}</div>
              </div>
              <div class="flex flex-items-start color-#7A7A7A font-size-14px mt-10px">
                <div class="text-right w-63px min-w-63px">{{ t('merchantDetail.logo') }}:</div>
                <div class="color-colorBlack ml-15px">
                  <div @click="clickImage(imgUrl + detailData?.logo)" v-if="detailData?.logo">
                    <el-image class="w-100px h-100px mr-15px" :src="imgUrl + detailData?.logo" fit="fill" />
                  </div>
                  <div v-else>-</div>
                </div>
              </div>
            </div>
            <div class="w-60% flex flex-wrap mt-10px">
              <div class="flex flex-col w-100px">
                <div class="font-size-21px text-center">{{ detailData?.fansCount || '0' }}</div>
                <div class="text-center min-w-63px color-#7A7A7A font-size-14px mt-5px">{{
                  t('merchantDetail.sub3')
                }}</div>
              </div>
              <div class="bg-[#e4e4e4] w-3px h-40px mr-10px mt-8px ml-10px"></div>
              <div class="flex flex-col w-100px">
                <div class="font-size-21px text-center">{{
                  detailData?.thirtyDaysOrderCount || '0'
                }}</div>
                <div class="text-center min-w-63px color-#7A7A7A font-size-14px mt-5px">{{
                  t('merchantDetail.sub4')
                }}</div>
              </div>
              <div class="bg-[#e4e4e4] w-3px h-40px mr-10px mt-8px ml-10px"></div>
              <!-- <div class="flex flex-col w-100px">
                <div class="font-size-21px text-center">{{
                  detailData?.performanceRate || '0'
                }}</div
                ><div class="text-center min-w-63px color-#7A7A7A font-size-14px mt-5px">{{
                  t('merchantDetail.sub5')
                }}</div>
              </div>
              <div class="flex flex-col w-100px">
                <div class="font-size-21px text-center">{{ detailData?.responseRate || '0' }}</div
                ><div class="text-center min-w-63px color-#7A7A7A font-size-14px mt-5px">{{
                  t('merchantDetail.sub6')
                }}</div>
              </div> -->
              <!-- <div class="bg-[#e4e4e4] w-3px h-40px mr-10px mt-8px ml-10px"></div> -->
              <div class="flex flex-col w-100px">
                <div class="font-size-21px text-center">{{
                  detailData?.secondGranceRate ? detailData.secondGranceRate * 100 + '%' : '0%'
                }}</div>
                <div class="text-center min-w-63px color-#7A7A7A font-size-14px mt-5px">{{
                  t('merchantDetail.sub7')
                }}</div>
              </div>
              <!-- <div class="bg-[#e4e4e4] w-3px h-40px mr-10px mt-8px ml-10px"></div> -->
              <!-- <div class="flex flex-col w-100px">
                <div class="font-size-21px text-center">{{
                  detailData?.qualityRefundRate || '0'
                }}</div
                ><div class="text-center min-w-63px color-#7A7A7A font-size-14px mt-5px">{{
                  t('merchantDetail.sub8')
                }}</div>
              </div> -->
            </div>
          </div>
        </ContentWrap>
        <ContentWrap class="mt-10px">
          <div class="flex-b">
            <div class="w-40%">
              <div class="flex-c color-#7A7A7A font-size-14px">
                <div class="text-right w-60px min-w-60px">{{ t('merchantDetail.time') }}:</div>
                <div class="ml-15px color-colorBlack">{{
                  detailData?.foundTime.substring(0, 10) || '-'
                }}</div>
              </div>
              <div class="flex-c mt-10px color-#7A7A7A font-size-14px">
                <div class="text-right w-60px min-w-60px">{{ t('merchantDetail.register') }}:</div>
                <div class="ml-15px color-colorBlack">{{
                  detailData?.registeredCapital || '-'
                }}</div>
              </div>
              <div class="flex-c mt-10px color-#7A7A7A font-size-14px">
                <div class="text-right w-60px min-w-60px">{{ t('merchantDetail.people') }}:</div>
                <div class="ml-15px color-colorBlack">{{
                  detailData?.employeeCountStr || '-'
                }}</div>
              </div>
              <div class="flex-c mt-10px color-#7A7A7A font-size-14px">
                <div class="text-right w-60px min-w-60px">{{ t('merchantDetail.size') }}:</div>
                <div class="ml-15px color-colorBlack">{{ detailData?.scaleStr || '-' }}</div>
              </div>
              <!-- <div class="flex flex-items-start mt-10px color-#7A7A7A font-size-14px">
                <div class="text-right w-60px min-w-60px">{{ t('serviceCenter.sub4') }}:</div>
                <div class="ml-15px color-colorBlack">{{ detailData?.cusTel || '-' }}</div>
              </div> -->
            </div>
            <div class="w-60% ml-30px">
              <div class="flex-c color-#7A7A7A font-size-14px">
                <div class="text-right w-60px min-w-60px">{{ t('merchantDetail.deal') }}:</div>
                <div class="ml-15px color-colorBlack">{{ detailData?.yearDealAmount || '-' }}</div>
              </div>
              <div class="flex-c mt-10px color-#7A7A7A font-size-14px">
                <div class="text-right w-60px min-w-60px">{{ t('merchantDetail.brand') }}:</div>
                <div class="ml-15px color-colorBlack">{{ detailData?.brandName || '-' }}</div>
              </div>
              <div class="flex-c mt-10px color-#7A7A7A font-size-14px">
                <div class="text-right w-60px min-w-60px">{{ t('merchantDetail.custom') }}:</div>
                <div class="ml-15px color-colorBlack">{{ detailData?.mainCustomers || '-' }}</div>
              </div>
              <div class="flex flex-items-start mt-10px color-#7A7A7A font-size-14px">
                <div class="text-right w-60px min-w-60px">{{ t('merchantDetail.evaluate') }}:</div>
                <div class="ml-15px mt--7px color-colorBlack">
                  <div class="flex-c">
                    {{ t('merchantDetail.name1') }}
                    <ElRate
class="ml-5px" v-model="rate" disabled show-score text-color="#ff9900"
                      score-template="{value}" />
                  </div>
                  <div class="flex-c">
                    {{ t('merchantDetail.name2') }}
                    <div class="relative ml-5px">
                      <div
class="sedivs w-120px" :style="{
                        overflow: serviceAttitude || 0 > 50 ? 'visible' : 'hidden'
                      }">
                        <div
class="sediv1" :style="{ width: (120 * serviceAttitude) / 5 + 'px' }"
                          style="background: #f7ba2a; z-index: 200">
                        </div>
                        <div class="sediv"></div>
                      </div>
                    </div>

                    <div class="ml-120px">{{ detailData?.serviceAttitude || '0' }}</div>
                  </div>
                  <div class="flex-c mt-8px">
                    {{ t('merchantDetail.name3') }}
                    <div class="relative ml-5px">
                      <div class="sedivs w-120px" :style="{ overflow: logisticsExperience > 50 ? 'visible' : 'hidden' }">
                        <div
class="sediv1" :style="{ width: (120 * logisticsExperience) / 5 + 'px' }"
                          style="background: #f7ba2a; z-index: 200">
                        </div>
                        <div class="sediv"></div>
                      </div>
                    </div>

                    <div class="ml-120px">{{ detailData?.logisticsExperience || '0' }}</div>
                  </div>
                  <div class="flex-c mt-8px">
                    {{ t('merchantDetail.name4') }}
                    <div class="relative ml-5px">
                      <div class="sedivs w-120px" :style="{ overflow: descriptionMatches > 50 ? 'visible' : 'hidden' }">
                        <div
class="sediv1" :style="{ width: (120 * descriptionMatches) / 5 + 'px' }"
                          style="background: #f7ba2a; z-index: 200">
                        </div>
                        <div class="sediv"></div>
                      </div>
                    </div>

                    <div class="ml-120px">{{ detailData?.descriptionMatches || '0' }}</div>
                  </div>
                </div>
              </div>
              <div class="flex flex-items-start mt-10px color-#7A7A7A font-size-14px">
                <div class="text-right w-60px min-w-60px">{{ t('merchantDetail.certificate') }}:</div>
                <div class="ml-15px flex-c flex-wrap color-colorBlack" v-if="detailData?.certificateImages">
                  <div v-for="(item, index) in detailData?.certificateImages.split(',')" :key="index">
                    <div @click="clickImage(imgUrl + item)">
                      <el-image class="w-100px h-100px mr-15px" :src="imgUrl + item" fit="fill" />
                    </div>
                  </div>
                </div>
                <Empty v-else />
              </div>
              <div class="flex flex-items-start mt-10px color-#7A7A7A font-size-14px">
                <div class="text-right w-60px min-w-60px">{{ t('merchantDetail.mobile') }}:</div>
                <div class="ml-15px color-colorBlack">{{ t('merchantDetail.name') }}:
                  {{ detailData?.applicantName || '-' }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  {{ t('merchantDetail.iphone') }}:
                  {{ detailData?.applicantMobile || '-' }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  {{ t('merchantDetail.email') }}: {{ detailData?.applicantEmail || '-' }}</div>
              </div>
            </div>
          </div>
          <div
            class="mt-10px flex-c border-rd-3px bg-[#ebf2fd] p-6px border-solid border-[#d0e3fa] border-1px w-100px pl-30px cursor-pointer"
            @click="clickBtn()"><img src="@/assets/imgs/qualifications.png" class="w-10px h-10px" /><span
              class="ml-3px colorMain font-size-12px">{{ t('merchantDetail.bottom') }}</span></div>
        </ContentWrap>
        <ContentWrap class="mt-10px">
          <div>
            {{ t('merchantDetail.title4') }}
          </div>

          <div v-if="detailData?.companyProfile && detailData?.factoryImages">
            <div class="mt-10px">{{ detailData?.companyProfile || '-' }}</div>

            <div class="flex-c w-100% flex-wrap">
              <div
v-for="(item, index) in detailData?.factoryImages.split(',')" :key="index"
                class="flex w-100px h-100px mr-10px mt-10px">
                <span class="mt-10px" @click="clickImage(imgUrl + item)">
                  <el-image class="w-100px h-100px mr-15px" :src="imgUrl + item" fit="fill" />
                </span>
              </div>
            </div>
          </div>
          <Empty v-else />
        </ContentWrap>
      </div>
    </div>
    <div class="mt-10px" v-hasPermi="'merchant:merchant:edit'">
      <ContentWrap class="text-right">
        <!-- <ElButton type="primary" @click="dialogVisible = false">{{
          t('companyInformation.btn1')
        }}</ElButton> -->
        <ElButton type="primary" :loading="saveLoading" @click="infoEdit()">
          {{ t('project.edit') }}
        </ElButton>
      </ContentWrap>
    </div>
  </div>

  <Dialog v-model="dialogVisible" :title="t('companyInformation.title')" max-height="280px">
    <Write ref="writeRef" :currentRow="currentRow" />
    <template #footer>
      <ElButton @click="dialogVisible = false">{{ t('common.cancel') }}</ElButton>
      <ElButton type="primary" :loading="saveLoading" @click="save">
        {{ t('project.confirm') }}
      </ElButton>
    </template>
  </Dialog>

  <Dialog v-model="dialogVisible1" :title="t('merchantDialog.title')">
    <ThemeQualificationVue :currentRow="allData" />
  </Dialog>
</template>

<script lang="tsx" setup>
import emptyBack from '@/assets/imgs/emptyBack.png'
import { Dialog } from '@/components/Dialog'
import Write from './components/add.vue'
import { ContentWrap } from '@/components/ContentWrap'
import { useI18n } from '@/hooks/web/useI18n'
import { ElTag, ElImage, ElMessage } from 'element-plus'
import { createImageViewer } from '@/components/ImageViewer'
import { ref, onMounted, unref } from 'vue'
import { ElButton, ElRate } from 'element-plus'
import { useRouter } from 'vue-router'
import Empty from '@/components/customComponents/Empty/index.vue'
import {
  getcompanyDetailApi,
  editCompanyApi,
  getTopApi,
  getMerDetailByLicenseNoApi,
  getMainBodyApi,
  updateBusinessTermApi
} from '@/api/company/info'
import ThemeQualificationVue from './components/themeQualification.vue'
import { Console } from 'console'

const value = ref(3.7)
const data = ref(4.5)

const { t } = useI18n()
const { push } = useRouter()

const currentRow = ref()
const rate = ref(0)
const serviceAttitude = ref(0)
const descriptionMatches = ref(0)
const logisticsExperience = ref(0)

const allData = ref()
const dialogVisible1 = ref()
const detailData = ref()
const imgUrl = import.meta.env.VITE_IMG_URL
const isMerchant = ref(true)
const clickImage = (data: any) => {
  if (typeof data == 'string') {
    createImageViewer({
      urlList: [data]
    })
  } else {
    createImageViewer({
      urlList: data
    })
  }
}

const infoEdit = () => {
  push({
    path: '/company/information/edit',
    query: {
      managementModel: detailData.value?.managementModel
    }
  })
}

const saveLoading = ref(false)
const dialogVisible = ref(false)

onMounted(() => {
  init()
})

const clickUpdateTerm = () => {
  dialogVisible.value = true
  currentRow.value = {
    licenseTerm: [
      detailData.value?.licenseTerm.split(',')[0],
      detailData.value?.licenseTerm.split(',')[1]
    ],
    licenseImages: detailData.value?.licenseImages
  }
}

const writeRef = ref()
const save = async () => {
  const write = unref(writeRef)
  const formData = await write?.submit()
  console.log(formData)
  if (formData) {
    const res = await updateBusinessTermApi({
      licenseTerm: formData.licenseTerm + '',
      merchantNo: detailData.value.merchantNo,
      licenseImages: formData.licenseImages
    })
    if (res.code == 200) {
      ElMessage.success(res.msg)
      init()
    }
    dialogVisible.value = false
  }
}

const init = async () => {
  const res = await getcompanyDetailApi()
  if (res.code == 200) {
    detailData.value = res.data
    if (!detailData.value.isMerchant) {
      isMerchant.value = false;
      rate.value = parseFloat(detailData.value.overallEvaluation) || 0
      serviceAttitude.value = parseFloat(detailData.value.serviceAttitude) || 0
      descriptionMatches.value = parseFloat(detailData.value.descriptionMatches) || 0
      logisticsExperience.value = parseFloat(detailData.value.logisticsExperience) || 0
    }
  }

}

const clickBtn = async () => {
  const res = await getMainBodyApi({ merchantNo: detailData?.value.merchantNo })
  allData.value = res.data
  dialogVisible1.value = true
}
</script>

<style lang="less" scoped>
.Informationbg {
  width: 100%;
  height: calc(100vh - 100px);
}

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
