<template>
  <div class="flex-b items-stretch">
    <div class="w-50% bg-#fff">
      <ContentWrap>
        <div
          class="relative color-#7A7A7A font-size-14px border-[#d2d2d2] border-solid border-1px border-rd-5px"
        >
          <div class="absolute top--10px left-20px bg-[#fff] w-70px text-center">{{
            t('companyInformationEdit1.name')
          }}</div>
          <div class="mt-30px ml-20px mb-20px">
            <Form
              @register="formItem.formRegister"
              :disabled="true"
              v-if="legalIdImages"
              :schema="formSchema"
            />
          </div>
        </div>
      </ContentWrap>
      <div class="h-20px bg-#F0F2F5"></div>
      <ContentWrap>
        <div
          class="relative color-#7A7A7A font-size-14px border-[#d2d2d2] border-solid border-1px border-rd-5px"
        >
          <div class="absolute top--10px left-20px bg-[#fff] w-70px text-center">
            {{
              queryType == 'TRADING_MODEL'
                ? t('companyInformationEdit2.name')
                : t('companyInformationEdit2.name_1')
            }}
          </div>
          <div class="mt-30px ml-20px mb-20px">
            <Form @register="formItem1.formRegister" v-if="factoryImages" :schema="formSchema1" />
          </div>
        </div>
      </ContentWrap>
    </div>
    <div class="w-50% ml-20px bg-#fff">
      <ContentWrap>
        <div
          class="relative color-#7A7A7A font-size-14px border-[#d2d2d2] border-solid border-1px border-rd-5px"
        >
          <div class="absolute top--10px left-20px bg-[#fff] w-70px text-center">
            {{
              queryType == 'TRADING_MODEL'
                ? t('companyInformationEdit3.name')
                : t('companyInformationEdit3.name_1')
            }}</div
          >
          <div class="mt-30px ml-40px mb-20px">
            <Form @register="formItem2.formRegister" v-if="logo" :schema="formSchema2" />
          </div>
        </div>
      </ContentWrap>
      <div class="h-20px bg-#F0F2F5"></div>
      <ContentWrap>
        <div
          class="relative color-#7A7A7A font-size-14px border-[#d2d2d2] border-solid border-1px border-rd-5px"
        >
          <div class="absolute top--10px left-20px bg-[#fff] w-70px text-center">{{
            t('companyInformationEdit4.name')
          }}</div>
          <div class="mt-30px ml-30px mb-20px">
            <Form @register="formItem3.formRegister" :schema="formSchema3" />
          </div>
        </div>
      </ContentWrap>
    </div>
  </div>
  <ContentWrap class="mt-20px text-right"
    ><ElButton @click="push('/company/information')">{{ t('project.cancel') }}</ElButton>
    <ElButton @click="submit" type="primary">{{ t('project.confirm') }}</ElButton></ContentWrap
  >
</template>

<script setup lang="tsx">
import { Form, FormSchema, RadioOption } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { PropType, reactive, watch, ref, onMounted, nextTick } from 'vue'
import { useValidator } from '@/hooks/web/useValidator'
import { useI18n } from '@/hooks/web/useI18n'
import { ElTabs, ElTabPane, ElRate, ElTooltip, ElButton, ElInput, ElMessage } from 'element-plus'
import { ContentWrap } from '@/components/ContentWrap'
import UploadImage from '@/components/UploadImage/UploadImage.vue'
import { Icon } from '@/components/Icon'
import { useRouter } from 'vue-router'
import { getCategoryByLevel } from '@/api/RuleManage/checkPrice'
import { getcompanyDetailApi, editCompanyApi, getTopApi } from '@/api/company/info'
import { useAppStore } from '@/store/modules/app'

const { t } = useI18n()

const { required, validMobile } = useValidator()

const { push, currentRoute } = useRouter()

const queryType = ref()
const currentRow = ref()

const MerEmployeeCount = ref()
const MerScale = ref()

const logo = ref()
const certificateImages = ref()
const factoryImages = ref()
const licenseImages = ref()
const legalIdImages = ref()
const legalIdImagesBg = ref()
const img1Ref = ref()
const img2Ref = ref()
const img3Ref = ref()
const img4Ref = ref()
const img5Ref = ref()
const img6Ref = ref()

const optionsData = ref<Array<any>>([])

const formSchema3 = reactive<FormSchema[]>([
  {
    field: 'applicantName',
    label: t('companyInformationEdit4.sub1'),
    component: 'Input',
    colProps: {
      span: 19
    },
    formItemProps: {
      rules: [required()]
    },
    componentProps: {
      style: {
        width: '100%'
      }
    }
  },
  {
    field: 'applicantMobile',
    label: t('companyInformationEdit4.sub2'),
    component: 'Input',
    colProps: {
      span: 19
    },
    formItemProps: {
      rules: [required(), validMobile()]
    },
    componentProps: {
      style: {
        width: '100%'
      }
    }
  },
  {
    field: 'applicantEmail',
    label: t('companyInformationEdit4.sub3'),
    component: 'Input',
    colProps: {
      span: 19
    },
    formItemProps: {
      rules: [required()]
    },
    componentProps: {
      style: {
        width: '100%'
      }
    }
  },
  {
    field: 'cusTel',
    label: t('serviceCenter.sub4'),
    component: 'Input',
    colProps: {
      span: 19
    },
    formItemProps: {
      rules: [required()]
    },
    componentProps: {
      style: {
        width: '100%'
      }
    }
  }
])

const tagList = ref([])
const formSchema2 = reactive<FormSchema[]>([
  {
    field: 'merchantName',
    label: '',
    component: 'Input',
    colProps: {
      span: 19
    },
    formItemProps: {
      rules: [required()]
    },
    componentProps: {
      style: {
        width: '100%'
      }
    }
  },
  {
    field: 'logo',
    label:
      queryType.value == 'TRADING_MODEL'
        ? t('companyInformationEdit3.sub2')
        : t('companyInformationEdit3.sub2_1'),
    colProps: {
      span: 24
    },
    formItemProps: {
      rules: [required()],
      slots: {
        default: () => {
          return (
            <>
              <UploadImage limit={1} v-model={logo.value} ref={img1Ref}></UploadImage>
              <div class="color-colorGray font-size-13px w-600px">{t('auth.licenseImgTips')}</div>
            </>
          )
        }
      }
    }
  },
  {
    field: 'foundTime',
    label: t('companyInformationEdit3.sub3'),
    component: 'Input',
    colProps: {
      span: 19
    },
    formItemProps: {
      rules: [required()]
    },
    componentProps: {
      style: {
        width: '100%'
      }
    }
  },
  {
    field: 'registeredCapital',
    label: t('companyInformationEdit3.sub4'),
    component: 'Input',
    colProps: {
      span: 19
    },
    formItemProps: {
      rules: [required()]
    },
    componentProps: {
      style: {
        width: '100%'
      }
    }
  },
  {
    field: 'employeeCount',
    label: t('companyInformationEdit3.sub5'),
    colProps: {
      span: 19
    },
    formItemProps: {
      rules: [required()]
    },
    component: 'Select',
    componentProps: {
      options: MerEmployeeCount
    }
  },
  {
    field: 'scale',
    label: t('companyInformationEdit3.sub6'),
    colProps: {
      span: 19
    },
    formItemProps: {
      rules: [required()]
    },
    component: 'Select',
    componentProps: {
      options: MerScale
    }
  },
  {
    field: 'yearDealAmount',
    label: t('companyInformationEdit3.sub7'),
    component: 'Input',
    colProps: {
      span: 19
    },
    formItemProps: {
      rules: [required()]
    },
    componentProps: {
      style: {
        width: '100%'
      }
    }
  },
  {
    field: 'brandName',
    label: t('companyInformationEdit3.sub8'),
    component: 'Input',
    colProps: {
      span: 19
    },
    componentProps: {
      style: {
        width: '100%'
      }
    }
  },
  {
    field: 'mainCustomers',
    label: t('companyInformationEdit3.sub9'),
    component: 'Input',
    colProps: {
      span: 19
    },
    componentProps: {
      style: {
        width: '100%'
      }
    }
  },
  {
    field: 'test',
    label: t('merchantDetail.evaluate'),
    formItemProps: {
      rules: [required()],
      slots: {
        default: (data: any) => {
          const a = parseFloat(data.serviceAttitude) || 0 > 50 ? 'visible' : 'hidden'
          const w = (120 * parseFloat(data.serviceAttitude) || 0) / 5 + 'px'
          const a1 = parseFloat(data.logisticsExperience) || 0 > 50 ? 'visible' : 'hidden'
          const w1 = (120 * parseFloat(data.logisticsExperience) || 0) / 5 + 'px'
          const a2 = parseFloat(data.descriptionMatches) || 0 > 50 ? 'visible' : 'hidden'
          const w2 = (120 * parseFloat(data.descriptionMatches) || 0) / 5 + 'px'
          return (
            <>
              <div class="flex flex-items-start color-#7A7A7A font-size-14px">
                <div class="ml-15px color-colorBlack">
                  <div class="flex-c">
                    <span class="w-60px">{t('merchantDetail.name1')}</span>
                    <ElRate
                      class="ml-5px"
                      v-model={data.overallEvaluation}
                      disabled
                      show-score
                      text-color="#ff9900"
                      score-template="{value}"
                    />
                  </div>
                  <div class="flex-c">
                    <span class="w-60px">{t('merchantDetail.name2')}</span>
                    <div class="relative ml-5px">
                      <div class="sedivs w-120px" style={{ overflow: a }}>
                        <div
                          class="sediv1"
                          style={{ width: w, background: '#f7ba2a', 'z-index': 200 }}
                        ></div>
                        <div class="sediv"></div>
                      </div>
                    </div>

                    <div class="ml-120px">{data.serviceAttitude || '0'}</div>
                  </div>
                  <div class="flex-c">
                    <span class="w-60px">{t('merchantDetail.name3')}</span>
                    <div class="relative ml-5px">
                      <div class="sedivs w-120px" style={{ overflow: a1 }}>
                        <div
                          class="sediv1"
                          style={{ width: w1, background: '#f7ba2a', 'z-index': 200 }}
                        ></div>
                        <div class="sediv"></div>
                      </div>
                    </div>

                    <div class="ml-120px">{data.logisticsExperience || '0'}</div>
                  </div>
                  <div class="flex-c">
                    <span class="w-60px">{t('merchantDetail.name4')}</span>
                    <div class="relative ml-5px">
                      <div class="sedivs w-120px" style={{ overflow: a2 }}>
                        <div
                          class="sediv1"
                          style={{ width: w2, background: '#f7ba2a', 'z-index': 200 }}
                        ></div>
                        <div class="sediv"></div>
                      </div>
                    </div>

                    <div class="ml-120px">{data.descriptionMatches || '0'}</div>
                  </div>
                </div>
              </div>
            </>
          )
        }
      }
    }
  },
  // {
  //   field: 'mainProducts',
  //   label: t('auth.MainCategory'),
  //   component: 'Cascader',
  //   formItemProps: {
  //     rules: [required()]
  //   },
  //   componentProps: {
  //     options: optionsData,
  //     props: {
  //       multiple: true
  //     },
  //     checkStrictly: true
  //   }
  // },
  // {
  //   field: 'mainProducts',
  //   label: t('companyInformationEdit3.sub11'),
  //   // component: 'Input',
  //   colProps: {
  //     span: 19
  //   },
  //   formItemProps: {
  //     rules: [required()],
  //     slots: {
  //       default: () => {
  //         let tag = tagList.value.map((item: any, index) => {
  //           return (
  //             <>
  //               <div class="flex-c mt-20px mr-20px tag1">
  //                 <div class="mr-15px color-colorGray">{item}</div>
  //                 <div onClick={() => deltag(index)} class="cursor-pointer">
  //                   <Icon icon="ep:circle-close-filled" size={15} color="#C7C7C7"></Icon>
  //                 </div>
  //               </div>
  //             </>
  //           )
  //         })
  //         return (
  //           <>
  //             <div class="flex-cb w-100%">
  //               <div style="width:95%">
  //                 <ElInput
  //                   class="!w-100%"
  //                   v-model={mainProducts.value}
  //                   placeholder={t('project.input')}
  //                 ></ElInput>
  //               </div>
  //               <ElButton class="w-70px ml-10px" type="primary" onClick={() => addtag()}>
  //                 {t('project.add')}
  //               </ElButton>
  //             </div>
  //             <div>
  //               <div class="flex-c flex-wrap">{tag}</div>
  //             </div>
  //           </>
  //         )
  //       }
  //     }
  //   }
  //   // componentProps: {
  //   //   placeholder: t('project.input'),
  //   //   type: 'textarea',
  //   //   rows: 4
  //   // }
  // },
  {
    field: 'certificateImages',
    label: t('companyInformationEdit3.sub12'),
    colProps: {
      span: 24
    },
    formItemProps: {
      slots: {
        default: () => {
          return (
            <>
              <UploadImage limit={6} v-model={certificateImages.value} ref={img2Ref}></UploadImage>
              <div class="color-colorGray font-size-13px w-600px">
                {t('companyInformationEdit1.sub11')}
              </div>
            </>
          )
        }
      }
    }
  }
])

const formSchema1 = reactive<FormSchema[]>([
  {
    field: 'companyProfile',
    label:
      queryType.value == 'TRADING_MODEL'
        ? t('companyInformationEdit2.sub1')
        : t('companyInformationEdit2.sub1_1'),
    component: 'Input',
    colProps: {
      span: 19
    },
    formItemProps: {
      rules: [required()]
    },
    componentProps: {
      placeholder: t('project.input'),
      type: 'textarea',
      rows: 4
    }
  },
  {
    field: 'factoryImages',
    label:
      queryType.value == 'TRADING_MODEL'
        ? t('companyInformationEdit2.sub2')
        : t('companyInformationEdit2.sub2_1'),
    colProps: {
      span: 24
    },
    formItemProps: {
      rules: [required()],
      slots: {
        default: () => {
          return (
            <>
              <UploadImage limit={5} v-model={factoryImages.value} ref={img3Ref}></UploadImage>
              <div class="color-colorGray font-size-13px w-600px">
                {t('companyInformationEdit1.sub11')}
              </div>
            </>
          )
        }
      }
    }
  }
])
const formSchema = reactive<FormSchema[]>([
  {
    field: 'merchantName',
    label: t('companyInformationEdit1.sub1'),
    component: 'Input',
    colProps: {
      span: 19
    },
    formItemProps: {
      rules: [required()]
    },
    componentProps: {
      style: {
        width: '100%'
      }
    }
  },
  {
    field: 'licenseNo',
    label: t('companyInformationEdit1.sub2'),
    component: 'Input',
    colProps: {
      span: 19
    },
    formItemProps: {
      rules: [required()]
    },
    componentProps: {
      style: {
        width: '100%'
      }
    }
  },
  {
    field: 'licenseImages',
    label: t('companyInformationEdit1.sub3'),
    colProps: {
      span: 24
    },
    formItemProps: {
      rules: [required()],
      slots: {
        default: () => {
          return (
            <>
              <UploadImage limit={1} v-model={licenseImages.value} ref={img4Ref}></UploadImage>
              <div class="color-colorGray font-size-13px w-600px">{t('auth.licenseImgTips')}</div>
            </>
          )
        }
      }
    }
  },
  {
    field: 'licenseTerm',
    label: t('auth.validity'),
    component: 'DatePicker',
    colProps: {
      span: 19
    },
    formItemProps: {
      rules: [required()]
    },
    componentProps: {
      type: 'daterange',
      placeholder: t('project.input'),
      valueFormat: 'YYYY-MM-DD'
    }
  },
  {
    field: 'businessScope',
    label: t('auth.businessScope'),
    component: 'Input',
    colProps: {
      span: 19
    },
    formItemProps: {
      rules: [required()]
    },
    componentProps: {
      disabled: true,
      placeholder: t('project.input'),
      type: 'textarea',
      rows: 4
    }
  },
  {
    field: 'address',
    label: t('auth.address'),
    component: 'Input',
    colProps: {
      span: 19
    },
    formItemProps: {
      rules: [required()]
    },
    componentProps: {
      placeholder: t('project.input'),
      type: 'textarea',
      rows: 3
    }
  },
  {
    field: 'mainProducts',
    label: t('common.b13'),
    component: 'Cascader',
    formItemProps: {
      rules: [required()]
    },
    colProps: {
      span: 19
    },
    componentProps: {
      options: optionsData,
      props: {
        multiple: true
      },
      style: {
        width: '100%'
      },
      checkStrictly: true
    }
  },
  {
    field: 'IdCards',
    label: t('auth.IdCards'),
    colProps: {
      span: 19
    },
    formItemProps: {
      rules: [required()],
      slots: {
        default: () => {
          return (
            <>
              <div class="flex-cb w-550px">
                <div>
                  <UploadImage limit={1} v-model={legalIdImages.value} ref={img5Ref}></UploadImage>
                  <div class="textC">{t('auth.face1')}</div>
                </div>
                <div>
                  <UploadImage
                    limit={1}
                    v-model={legalIdImagesBg.value}
                    ref={img6Ref}
                  ></UploadImage>
                  <div class="textC">{t('auth.face2')}</div>
                </div>
              </div>
              <div class="color-colorGray font-size-13px">{t('auth.IdCardsTips')}</div>
            </>
          )
        }
      }
    }
  },
  {
    field: 'managementModelStr',
    label: t('auth.businessMode'),
    colProps: {
      span: 19
    },
    formItemProps: {
      rules: [required()],
      slots: {
        default: () => {
          return (
            <>
              {queryType.value == 'TRADING_MODEL'
                ? t('merchantDetail.mode1')
                : t('merchantDetail.mode2')}
              {/* 贸易型：优选多种货源，集中供应。  生产型：自有加工厂，产品直销。 */}
              <ElTooltip content={t('companyInformationEdit1.tip1')} placement="top">
                <Icon icon="svg-icon:question" class="ml-5px cursor-pointer" />
              </ElTooltip>
            </>
          )
        }
      }
    }
  },
  {
    field: 'guarantor',
    label: t('auth.Guarantor'),
    component: 'Input',
    colProps: {
      span: 19
    },
    componentProps: {
      placeholder: t('project.input'),
      style: {
        width: '350px'
      }
    }
  }
])

const formItem = useForm()
const formItem1 = useForm()
const formItem2 = useForm()
const formItem3 = useForm()
const appStore = useAppStore()

onMounted(async () => {
  appStore.setRenderLoading(true)
  const res1 = await getCategoryByLevel({ level: 1 })
  if (res1.code == 200) {
    for (var item in res1.data)
      optionsData.value.push({
        label: res1.data[item].categoryName,
        value: res1.data[item].id
      })
  }

  const result = await getTopApi()
  if (result.code == 200) {
    MerEmployeeCount.value = result.data.MerEmployeeCount
    MerScale.value = result.data.MerScale
  }

  queryType.value = currentRoute.value.query.managementModel

  const res = await getcompanyDetailApi()
  if (res.code == 200) {
    currentRow.value = res.data

    if (currentRow.value.logo) {
      logo.value = [{ url: currentRow.value.logo }]
    } else {
      logo.value = []
    }

    if (currentRow.value.certificateImages) {
      let arr = []
      const temp = currentRow.value.certificateImages.split(',')
      for (var item in temp) {
        arr.push({ url: temp[item] })
      }
      certificateImages.value = arr
    } else {
      currentRow.value.certificateImages = []
    }

    if (currentRow.value.factoryImages) {
      let arr = []
      const temp = currentRow.value.factoryImages.split(',')
      for (var item in temp) {
        arr.push({ url: temp[item] })
      }
      factoryImages.value = arr
    } else {
      factoryImages.value = []
    }

    if (currentRow.value.licenseImages) {
      licenseImages.value = [{ url: currentRow.value.licenseImages }]
    } else {
      licenseImages.value = []
    }

    if (currentRow.value.legalIdImages) {
      legalIdImages.value = [{ url: currentRow.value.legalIdImages }]
    } else {
      legalIdImages.value = []
    }

    if (currentRow.value.legalIdImagesBg) {
      legalIdImagesBg.value = [{ url: currentRow.value.legalIdImagesBg }]
    } else [(legalIdImagesBg.value = [])]

    nextTick(async () => {
      formItem.formMethods.setValues({
        address: currentRow.value.address,
        businessScope: currentRow.value.businessScope,
        guarantor: currentRow.value.guarantor,
        legalIdImages: currentRow.value.legalIdImages,
        licenseImages: currentRow.value.licenseImages,
        licenseNo: currentRow.value.licenseNo,
        licenseTerm: [
          currentRow.value.licenseTerm.split(',')[0],
          currentRow.value.licenseTerm.split(',')[1]
        ],
        IdCards: '1',
        managementModelStr: currentRow.value.managementModelStr,
        merchantName: currentRow.value.merchantName
      })

      formItem1.formMethods.setValues({
        companyProfile: currentRow.value.companyProfile,
        factoryImages: currentRow.value.factoryImages
      })

      const arr = currentRow.value.mainProducts.split(',')
      let temp = []
      if (arr.length != 0) {
        for (var item in arr) {
          temp.push([arr[item]])
        }
        formItem.formMethods.setValues({
          mainProducts: temp
        })
      } else {
        formItem.formMethods.setValues({
          mainProducts: []
        })
      }

      formItem2.formMethods.setValues({
        brandName: currentRow.value.brandName,
        certificateImages: currentRow.value.certificateImages,
        employeeCount: currentRow.value.employeeCount,
        evaluate: currentRow.value.evaluate,
        foundTime: currentRow.value.foundTime,
        logo: currentRow.value.logo,
        mainCustomers: currentRow.value.mainCustomers,
        test: '1',
        merchantName: currentRow.value.merchantName,
        registeredCapital: currentRow.value.registeredCapital,
        scale: currentRow.value.scale,
        yearDealAmount: currentRow.value.yearDealAmount,
        serviceAttitude: currentRow.value.serviceAttitude,
        logisticsExperience: currentRow.value.logisticsExperience,
        descriptionMatches: currentRow.value.descriptionMatches,
        overallEvaluation: currentRow.value.overallEvaluation
      })

      // tagList.value = []
      // for (var item in currentRow.value.mainProducts.split(',')) {
      //   tagList.value.push(currentRow.value.mainProducts.split(',')[item])
      // }

      formItem3.formMethods.setValues({
        applicantEmail: currentRow.value.applicantEmail,
        applicantMobile: currentRow.value.applicantMobile,
        applicantName: currentRow.value.applicantName,
        cusTel: currentRow.value.cusTel
      })

      await formItem1.formMethods.setSchema([
        {
          field: 'companyProfile',
          path: 'label',
          value:
            queryType.value == 'TRADING_MODEL'
              ? t('companyInformationEdit2.sub1')
              : t('companyInformationEdit2.sub1_1')
        },
        {
          field: 'factoryImages',
          path: 'label',
          value:
            queryType.value == 'TRADING_MODEL'
              ? t('companyInformationEdit2.sub2')
              : t('companyInformationEdit2.sub2_1')
        }
      ])
      await formItem2.formMethods.setSchema([
        {
          field: 'merchantName',
          path: 'label',
          value:
            queryType.value == 'TRADING_MODEL'
              ? t('companyInformationEdit3.sub1')
              : t('companyInformationEdit3.sub1_1')
        },
        {
          field: 'logo',
          path: 'label',
          value:
            queryType.value == 'TRADING_MODEL'
              ? t('companyInformationEdit3.sub2')
              : t('companyInformationEdit3.sub2_1')
        }
      ])
    })
    appStore.setRenderLoading(false)
  }
})

// const { formRegister, formMethods } = formItem
// const { setValues, getFormData, getElFormExpose } = formMethods

const submit = async () => {
  const elForm = await formItem.formMethods.getElFormExpose()
  const valid = await elForm?.validate().catch((err) => {
    console.log(err)
  })
  const elForm1 = await formItem1.formMethods.getElFormExpose()
  const valid1 = await elForm1?.validate().catch((err) => {
    console.log(err)
  })

  // formItem2.formMethods.setValues({ mainProducts: tagList.value + '' })
  const elForm2 = await formItem2.formMethods.getElFormExpose()
  const valid2 = await elForm2?.validate().catch((err) => {
    console.log(err)
  })
  const elForm3 = await formItem3.formMethods.getElFormExpose()
  const valid3 = await elForm3?.validate().catch((err) => {
    console.log(err)
  })
  if (valid && valid1 && valid2 && valid3) {
    const formData = await formItem.formMethods.getFormData()
    const formData1 = await formItem1.formMethods.getFormData()
    const formData2 = await formItem2.formMethods.getFormData()
    const formData3 = await formItem3.formMethods.getFormData()

    formData.licenseTerm = formData.licenseTerm + ''
    if (formData2.certificateImages.length == 0) {
      formData2.certificateImages = ''
    } else {
      formData2.certificateImages = formData2.certificateImages + ''
    }

    formData.mainProducts = formData.mainProducts + ''

    const allFormData = {
      merchantNo: currentRow.value.merchantNo,
      ...formData,
      ...formData1,
      ...formData2,
      ...formData3
    }
    const res = await editCompanyApi(allFormData)
    if (res.code == 200) {
      ElMessage.success(res.msg)
      push('/company/information')
    }
    return formData
  }
}

watch(
  () => [logo, certificateImages, factoryImages, licenseImages, legalIdImages, legalIdImagesBg],
  async () => {
    let param2 = {
      logo: img1Ref.value.getFileList(),
      certificateImages: img2Ref.value.getFileList(),
      factoryImages: img3Ref.value.getFileList(),
      licenseImages: img4Ref.value.getFileList(),
      legalIdImages: img5Ref.value.getFileList(),
      legalIdImagesBg: img6Ref.value.getFileList()
    }
    await formItem.formMethods.setValues({
      ...param2,
      IdCards: param2.legalIdImagesBg && param2.legalIdImages ? '1' : ''
    })
    await formItem1.formMethods.setValues({ ...param2 })
    await formItem2.formMethods.setValues({ ...param2 })

    const formEl1 = await formItem.formMethods.getElFormExpose()
    const formEl2 = await formItem1.formMethods.getElFormExpose()
    const formEl3 = await formItem2.formMethods.getElFormExpose()
    formEl1?.validateField(['licenseImages', 'IdCards'])
    formEl2?.validateField(['factoryImages'])
    formEl3?.validateField(['certificateImages', 'logo'])
  },
  {
    deep: true
  }
)
</script>

<style lang="less">
.baseClass {
  .el-upload {
    width: 150px;
    height: 150px;
    position: relative;
    overflow: hidden;
    cursor: pointer;
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    transition: var(--el-transition-duration-fast);
  }

  .el-upload:hover {
    border-color: var(--el-color-primary);
    .el-icon svg {
      color: var(--el-color-primary);
    }
  }

  .el-icon.avatar-uploader-icon {
    width: 178px;
    height: 178px;
    font-size: 28px;
    color: #8c939d;
    text-align: center;
  }
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
</style>
