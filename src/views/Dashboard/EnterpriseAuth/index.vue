<template>
  <!-- flex-w -->
  <div class="flex-b items-stretch min-w-1280px" ref="scroll">
    <div class="w-49.5% min-w-630px authclass">
      <div class="w-100% mb-20px mt--20px sticky top-0px z-1000 p-t20px bg-color579">
        <div class="bg-white pa-20px">
          <div>{{ t('auth.title') }}</div>
          <el-tabs v-model="activeIndex" class="demo-tabs" @tab-click="tabsClick">
            <el-tab-pane :label="t('auth.sqrinfo')" name="1" />
            <el-tab-pane :label="t('auth.gsinfo')" name="2" />
          </el-tabs>
        </div>
      </div>
      <div id="info" ref="info">
        <ContentWrap class="w-100% mb-20px" ref="info2">
          <div class="font-size-18px">{{ t('auth.sqrinfo') }}</div>
          <Form
@register="useForm1.formRegister" :labelWidth="200" :isCol="false" class="mt-30px" :rules="rules1"
            :schema="baseSchema1" />
        </ContentWrap>
      </div>
      <div ref="gongsi">
        <ContentWrap class="w-100%">
          <div class="font-size-18px">{{ t('auth.gsinfo') }}</div>
          <Form
@register="useForm2.formRegister" :labelWidth="200" class="mt-30px" :isCol="false" :rules="rules2"
            :schema="baseSchema2" />
        </ContentWrap>
      </div>
    </div>
    <div class="w-49.5% min-w-630px bg-white">
      <ContentWrap class="w-100%">
        <div class="bg-colorf025 pa-40px">
          <div class="font-size-24px">{{ t('auth.photo') }}</div>
          <div class="mt20px color-colorGray flex">
            <div class="ysj"></div>
            <div>{{ t('auth.ask1') }}</div>
          </div>
          <div class="mt10px color-colorGray flex">
            <div class="ysj"></div>
            <div>{{ t('auth.ask2') }}</div>
          </div>
          <div class="mt10px color-colorGray flex">
            <div class="ysj"></div>
            <div>{{ t('auth.ask3') }}</div>
          </div>
          <div class="font-size-16px mt30px">{{ t('auth.example') }}</div>
          <div>
            <div class="bg-colorfff mt-13px pb-20px">
              <img class="w-510px h-368px ma block textC" src="../../../assets/imgs/Dashboard/tu1.png" alt="" />
            </div>
            <div class="bg-green2 flex-cc pa-33px">
              <img class="w-22px h-22px" src="../../../assets/imgs/Dashboard/succes1.png" alt="" />
              <div class="font-size-22px color-green1 ml-10px">{{ t('auth.zhengque') }}</div>
            </div>
          </div>
          <div class="flex-cb mt-30px w-100%">
            <div class="w-31% min-w-158px">
              <div class="bg-colorfff pb-15px">
                <img class="w-98% ma block textC" mode="aspectFit" src="../../../assets/imgs/Dashboard/tu2.png" alt="" />
              </div>
              <div class="bg-red2 flex-cc pa-20px">
                <img class="w-22px h-22px" src="../../../assets/imgs/Dashboard/error1.png" alt="" />
                <div class="font-size-22px color-red1 ml-10px">{{ t('auth.deletion') }}</div>
              </div>
            </div>
            <div class="w-31% min-w-158px">
              <div class="bg-colorfff pb-15px">
                <img class="w-98% ma block textC" mode="aspectFit" src="../../../assets/imgs/Dashboard/tu3.png" alt="" />
              </div>
              <div class="bg-red2 flex-cc pa-20px">
                <img class="w-22px h-22px" src="../../../assets/imgs/Dashboard/error1.png" alt="" />
                <div class="font-size-22px color-red1 ml-10px">{{ t('auth.vague') }}</div>
              </div>
            </div>
            <div class="w-31% min-w-158px">
              <div class="bg-colorfff pb-15px">
                <img class="w-98% ma block textC" mode="aspectFit" src="../../../assets/imgs/Dashboard/tu4.png" alt="" />
              </div>
              <div class="bg-red2 flex-cc pa-20px">
                <img class="w-22px h-22px" src="../../../assets/imgs/Dashboard/error1.png" alt="" />
                <div class="font-size-22px color-red1 ml-10px">{{ t('auth.StrongLight') }}</div>
              </div>
            </div>
          </div>
        </div>
      </ContentWrap>
    </div>
  </div>
  <ContentWrap class="w-100% mt-20px">
    <div class="textR">
      <ElButton class="w-70px !h-40px">{{ t('project.cancel') }}</ElButton>
      <ElButton @click="submit" class="w-70px !h-40px" type="primary">{{
        t('project.confirm')
      }}</ElButton>
    </div>
  </ContentWrap>
</template>

<script setup lang="tsx">
import { ContentWrap } from '@/components/ContentWrap'
import { Form, FormSchema, RadioOption } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import UploadImage from '@/components/UploadImage/UploadImage.vue'
import { useValidator } from '@/hooks/web/useValidator'
import { ElTabs, ElTabPane, ElRadio, ElTooltip, ElButton, ElInput, ElMessage } from 'element-plus'
import { useI18n } from '@/hooks/web/useI18n'
import { Icon } from '@/components/Icon'
import { ref, reactive, onMounted, nextTick, onUnmounted, watch, unref } from 'vue'
import type { RouteLocationNormalizedLoaded, RouterLinkProps } from 'vue-router'
import { useTagsViewStore } from '@/store/modules/tagsView'
import { usePermissionStore } from '@/store/modules/permission'
import {
  companyCertifyUI,
  companyCertify,
  verificationCode,
  emailVerifyCode,
  getMerDetailByLicenseNo
} from '@/api/dashboard/index'
import { getCategoryByLevel } from '@/api/RuleManage/checkPrice'
const { currentRoute, push, replace } = useRouter()
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
const router = useRouter()
const { t } = useI18n()

const { required, validEmail, validLicenseNumber, isvalidLicenseNumber } = useValidator()

const useForm1 = useForm()
const useForm2 = useForm()

const scroll = ref()
const info = ref()
const gongsi = ref()
const info2 = ref()

const permissionStore = usePermissionStore()

const optionsData = ref<Array<any>>([])
onMounted(async () => {
  const res = await getCategoryByLevel({ level: 1 })
  if (res.code == 200) {
    for (var item in res.data)
      optionsData.value.push({
        label: res.data[item].categoryName,
        value: res.data[item].id
      })
  }
  nextTick(() => {
    heightList[0] = 0
    heightList[1] = info.value.scrollHeight + 20
    const temp = document.getElementsByClassName(
      'el-scrollbar__wrap el-scrollbar__wrap--hidden-default'
    )
    temp[1].addEventListener('scroll', scrollTop, true)
    getUi()
  })
})

const scrollTop = () => {
  const temp = document.getElementsByClassName(
    'el-scrollbar__wrap el-scrollbar__wrap--hidden-default'
  )
  if (temp[1].scrollTop < heightList[1]) {
    activeIndex.value = '1'
  } else {
    activeIndex.value = '2'
  }
}

onUnmounted(() => {
  const temp = document.getElementsByClassName(
    'el-scrollbar__wrap el-scrollbar__wrap--hidden-default'
  )
  try {
    temp[1].removeEventListener('scroll', scrollTop, true)
  } catch (err) {
    // console.log(err)
  }
})

// 获取滚动对应索引
const activeIndex = ref('1')
const heightList = reactive<Array<any>>([])

const tabsClick = (e: any) => {
  const temp = document.getElementsByClassName(
    'el-scrollbar__wrap el-scrollbar__wrap--hidden-default'
  )
  temp[1].scrollTo({ top: heightList[Number(e.index)], behavior: 'smooth' })
}

const modeList = ref([])
const getUi = async () => {
  const res = await companyCertifyUI()
  let list = res.data.manageModel
  modeList.value = list
  let merIntoPieces = res.data.merIntoPieces
  await useForm1.formMethods.setValues({
    applicantName: merIntoPieces.applicantName,
    applicantMobile: merIntoPieces.applicantMobile,
    applicantEmail: merIntoPieces.applicantEmail || ''
  })
  await useForm2.formMethods.setValues({
    managementModel: list[0].value,
    licenseNo: merIntoPieces.licenseNo || '',
    dateList: merIntoPieces.licenseTerm ? merIntoPieces.licenseTerm.split(',') : '',
    mainProducts: merIntoPieces.mainProducts ? merIntoPieces.mainProducts.split(',') : '',
    guarantor: merIntoPieces.guarantor || '',
  })
  if (merIntoPieces.licenseImage) {
    licenseImage.value = [{ url: merIntoPieces.licenseImage }]
  }
  if (merIntoPieces.legalIdImages) {
    legalIdImages.value = [{ url: merIntoPieces.legalIdImages }]
  }
  if (merIntoPieces.legalIdImagesBg) {
    legalIdImagesBg.value = [{ url: merIntoPieces.legalIdImagesBg }]
  }
}
const countdown1 = ref(0)
const countdown2 = ref(0)

const timer1 = ref(null)
const timer2 = ref(null)
const getCode1 = async () => {
  btnLoading1.value = true
  const formData1 = await useForm1.formMethods.getFormData()
  const res = await verificationCode({
    applicantMobile: formData1.applicantMobile
  })
  clearInterval(timer1.value)
  if (res.code == 200) {
    btnLoading1.value = false
    countdown1.value = 60
    timer1.value = setInterval(() => {
      countdown1.value--
    }, 1000)
  }
}

const getCode2 = async () => {
  btnLoading2.value = true
  const formEl1 = await useForm1.formMethods.getElFormExpose()
  const valid1 = await formEl1?.validateField(['applicantEmail']).catch((err) => {
    console.log(err)
  })
  const formData1 = await useForm1.formMethods.getFormData()
  if (valid1) {
    const res = await emailVerifyCode({
      email: formData1.applicantEmail
    })
    clearInterval(timer2.value)
    if (res.code == 200) {
      btnLoading2.value = false
      countdown2.value = 60
      timer2.value = setInterval(() => {
        countdown2.value--
      }, 1000)
    }
  } else {
    btnLoading2.value = false
  }
}

const btnLoading1 = ref(false)
const btnLoading2 = ref(false)

const baseSchema1 = reactive<FormSchema[]>([
  {
    field: 'applicantName',
    label: t('auth.name'),
    component: 'Input',
    componentProps: {
      placeholder: t('project.input'),
      style: {
        width: '350px'
      }
    }
  },
  {
    field: 'applicantMobile',
    label: t('auth.tel'),
    component: 'Input',
    componentProps: {
      disabled: true,
      style: {
        width: '350px'
      }
    }
  },
  {
    field: 'mobileVerifyCode',
    formItemProps: {
      slots: {
        default: (data) => {
          return (
            <>
              <div class="flex-cb !w-350px">
                <ElInput
                  class="!w-220px"
                  v-model={data.mobileVerifyCode}
                  placeholder={t('project.input')}
                ></ElInput>
                {countdown1.value > 0 ? (
                  <ElButton class="w-110px" type="primary">
                    {countdown1.value}s
                  </ElButton>
                ) : (
                  <ElButton
                    class="w-110px"
                    type="primary"
                    loading={btnLoading1.value}
                    onClick={getCode1}
                  >
                    {t('auth.obtain')}
                  </ElButton>
                )}
              </div>
            </>
          )
        }
      }
    }
  },
  {
    field: 'applicantEmail',
    label: t('auth.email'),
    component: 'Input',
    componentProps: {
      style: {
        width: '350px'
      }
    }
  },
  {
    field: 'emailVerifyCode',
    component: 'Input',
    formItemProps: {
      slots: {
        default: (data) => {
          return (
            <>
              <div class="flex-cb !w-350px">
                <ElInput
                  class="!w-220px"
                  v-model={data.emailVerifyCode}
                  placeholder={t('project.input')}
                ></ElInput>
                {countdown2.value > 0 ? (
                  <ElButton class="w-110px" type="primary">
                    {countdown2.value}s
                  </ElButton>
                ) : (
                  <ElButton
                    class="w-110px"
                    loading={btnLoading2.value}
                    type="primary"
                    onClick={getCode2}
                  >
                    {t('auth.obtain')}
                  </ElButton>
                )}
              </div>
            </>
          )
        }
      }
    }
  }
])

const rules1 = reactive<any>({
  applicantName: [required()],
  mobileVerifyCode: [required()],
  applicantEmail: [required(), validEmail()],
  emailVerifyCode: [required()]
})
const customValidator = (message = '') => {
  return {
    validator: async (_, value, callback) => {
      const reg =
        /^([159Y]{1})([1239]{1})([0-9ABCDEFGHJKLMNPQRTUWXY]{6})([0-9ABCDEFGHJKLMNPQRTUWXY]{9})([0-90-9ABCDEFGHJKLMNPQRTUWXY])$/

      if (!reg.test(value)) {
        callback(new Error(message || t('common.a8')))
      } else {
        const formData2 = await useForm2.formMethods.getFormData()
        const res = await getMerDetailByLicenseNo({
          licenseNo: formData2.licenseNo
        })
        if (res) {
          formData2.merchantName = res.data.merchantName
          formData2.businessScope = res.data.businessScope
          formData2.address = res.data.address
          callback()
        } else {
          callback(new Error(message || t('common.a8')))
        }
      }
    }
  }
}
const rules2 = reactive<any>({
  merchantName: [required()],
  licenseNo: [required(), customValidator()],
  licenseImage: [required()],
  dateList: [required()],
  businessScope: [required()],
  address: [required()],
  mainProducts: [required()],
  IdCards: [required()],
  managementModel: [required()]
})

const licenseImage: any = ref([])
const legalIdImages: any = ref([])
const legalIdImagesBg: any = ref([])
const img1Ref = ref()
const img2Ref = ref()
const img3Ref = ref()

const baseSchema2 = reactive<FormSchema[]>([
  {
    field: 'licenseNo',
    label: t('auth.licenseNum'),
    component: 'Input',
    componentProps: {
      placeholder: t('project.input'),
      maxlength: 18,
      style: {
        width: '350px'
      }
    }
  },
  {
    field: 'merchantName',
    label: t('auth.name2'),
    component: 'Input',
    componentProps: {
      placeholder: t('project.input'),
      style: {
        width: '350px'
      }
    }
  },
  {
    field: 'licenseImage',
    label: t('auth.licenseImg'),
    formItemProps: {
      slots: {
        default: () => {
          return (
            <>
              <UploadImage limit={1} v-model={licenseImage.value} ref={img1Ref}></UploadImage>
              <div class="color-colorGray">{t('auth.licenseImgTips')}</div>
            </>
          )
        }
      }
    }
  },
  {
    field: 'dateList',
    label: t('auth.validity'),
    component: 'DatePicker',
    componentProps: {
      type: 'daterange',
      placeholder: t('project.input'),
      valueFormat: 'YYYY-MM-DD',
      style: {
        maxWidth: '350px'
      }
    }
  },
  {
    field: 'businessScope',
    label: t('auth.businessScope'),
    component: 'Input',
    componentProps: {
      placeholder: t('project.input'),
      type: 'textarea',
      rows: 4,
      style: {
        width: '350px'
      }
    }
  },
  {
    field: 'address',
    label: t('auth.address'),
    component: 'Input',
    componentProps: {
      placeholder: t('project.input'),
      type: 'textarea',
      rows: 3,
      style: {
        width: '350px'
      }
    }
  },
  {
    field: 'mainProducts',
    label: t('common.b13'),
    component: 'Cascader',
    colProps: {
      span: 24
    },
    componentProps: {
      style: {
        width: '350px'
      },
      options: optionsData,
      props: {
        multiple: true
      },
      checkStrictly: true
    }
  },
  {
    field: 'IdCards',
    label: t('auth.IdCards'),
    formItemProps: {
      slots: {
        default: () => {
          return (
            <>
              <div class="flex-cb w-350px">
                <div>
                  <UploadImage limit={1} v-model={legalIdImages.value} ref={img2Ref}></UploadImage>
                  <div class="textC">{t('auth.face1')}</div>
                </div>
                <div>
                  <UploadImage
                    limit={1}
                    v-model={legalIdImagesBg.value}
                    ref={img3Ref}
                  ></UploadImage>
                  <div class="textC">{t('auth.face2')}</div>
                </div>
              </div>
              <div class="color-colorGray">{t('auth.IdCardsTips')}</div>
            </>
          )
        }
      }
    }
  },
  {
    field: 'managementModel',
    label: t('auth.businessMode'),
    component: 'RadioGroup',
    componentProps: {
      options: modeList,
      slots: {
        default: (options: RadioOption[]) => {
          return options?.map((v) => {
            return (
              <>
                <ElRadio label={v.value}>
                  <div class="flex-c">
                    <div>{v.label}</div>
                    <ElTooltip content={v.msg} placement="top">
                      <Icon class="ml-5px" icon="svg-icon:wenhao" />
                    </ElTooltip>
                  </div>
                </ElRadio>
              </>
            )
          })
        }
      }
    }
  },
  {
    field: 'guarantor',
    label: t('auth.Guarantor'),
    component: 'Input',
    componentProps: {
      placeholder: t('project.input'),
      style: {
        width: '350px'
      }
    }
  }
])


watch(
  () => [licenseImage, legalIdImages, legalIdImagesBg],
  async () => {
    nextTick(async () => {
      let param2 = {
        licenseImage: img1Ref.value.getFileList(),
        legalIdImages: img2Ref.value.getFileList(),
        legalIdImagesBg: img3Ref.value.getFileList()
      }
      await useForm2.formMethods.setValues({
        ...param2,
        IdCards: param2.legalIdImagesBg && param2.legalIdImages ? '1' : ''
      })
      const formEl2 = await useForm2.formMethods.getElFormExpose()
      formEl2?.validateField(['licenseImage', 'IdCards'])
    })
  },
  {
    deep: true
  }
)

const tagsViewStore = useTagsViewStore()
// 是否是当前tag
const isActive = (route: RouteLocationNormalizedLoaded): boolean => {
  return route.path === unref(currentRoute).path
}

const selectedTag = ref<RouteLocationNormalizedLoaded>()

// 新增tag
const addTags = () => {
  const { name } = unref(currentRoute)
  if (name) {
    selectedTag.value = unref(currentRoute)
    tagsViewStore.addView(unref(currentRoute))
  }
  return false
}

// 跳转到最后一个
const toLastView = () => {
  const visitedViews = tagsViewStore.getVisitedViews
  const latestView = visitedViews.slice(-1)[0]
  if (latestView) {
    push(latestView)
  } else {
    if (
      unref(currentRoute).path === permissionStore.getAddRouters[0].path ||
      unref(currentRoute).path === permissionStore.getAddRouters[0].redirect
    ) {
      addTags()
      return
    }
    // You can set another route
    push(permissionStore.getAddRouters[0].path)
  }
}
// 关闭选中的tag
const closeSelectedTag = (view: any) => {
  tagsViewStore.delView(view)
  if (isActive(view)) {
    toLastView()
  }
}

const submit = async () => {
  const elForm1 = await useForm1.formMethods.getElFormExpose()
  const elForm2 = await useForm2.formMethods.getElFormExpose()
  const valid1 = await elForm1?.validate().catch((err) => {
    console.log(err)
  })
  const valid2 = await elForm2?.validate().catch((err) => {
    console.log(err)
  })
  if (valid1 && valid2) {
    const formData1 = await useForm1.formMethods.getFormData()
    const formData2 = await useForm2.formMethods.getFormData()
    formData2.licenseTerm = formData2.dateList.join(',') //证件有效期
    let formData = Object.assign(formData1, formData2)
    formData.mainProducts = formData.mainProducts + ''
    const res = await companyCertify(formData)
    if (res) {
      ElMessage.success(res.msg)
      const temp = {
        fullPath: '/dashboard/auth',
        hash: '',
        href: '#/dashboard/auth',
        match: [],
        meta: {},
        name: 'Auth',
        path: '/dashboard/auth'
      }
      closeSelectedTag(temp)
    }
  }
}
</script>

<style scoped>
.el-card {
  border: none;
}
</style>
