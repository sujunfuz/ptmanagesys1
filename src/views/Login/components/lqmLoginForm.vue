<script setup lang="tsx">
import { reactive, ref, watch } from 'vue'
import { Form, FormSchema } from '@/components/Form'
import { useI18n } from '@/hooks/web/useI18n'
import { ElButton, ElCheckbox, ElLink } from 'element-plus'
import { useForm } from '@/hooks/web/useForm'
import { loginApi } from '@/api/login'
import { useStorage } from '@/hooks/web/useStorage'
import { useAppStore } from '@/store/modules/app'
import { usePermissionStore } from '@/store/modules/permission'
import { useRouter } from 'vue-router'
import type { RouteLocationNormalizedLoaded, RouteRecordRaw } from 'vue-router'
import { UserType } from '@/api/login/types'
import { useValidator } from '@/hooks/web/useValidator'
import { packNewMenu } from '@/utils/common'

const { required } = useValidator()

const emit = defineEmits(['to-register', 'to-forgotpwd'])

const appStore = useAppStore()

const permissionStore = usePermissionStore()

const { currentRoute, addRoute, push } = useRouter()

const localStore = useStorage('localStorage')

const { t } = useI18n()

const rules = {
  username: [required()],
  password: [required()]
}

const schema = reactive<FormSchema[]>([
  {
    field: 'loginName',
    label: t('login.account'),
    value: '',
    component: 'Input',
    colProps: {
      span: 24
    },
    formItemProps:{
      rules: required()
    },
    componentProps: {
      placeholder: t('login.usernamePlaceholder1'),
      style: {
        height: '50px'
      }
    }
  },
  {
    field: 'pwd',
    label: t('login.password'),
    value: '',
    component: 'InputPassword',
    colProps: {
      span: 24
    },
    formItemProps:{
      rules: required()
    },
    componentProps: {
      style: {
        width: '100%',
        height: '50px'
      },
      placeholder: t('login.passwordPlaceholder')
    }
  },
  {
    field: 'tool',
    colProps: {
      span: 24
    },
    formItemProps: {
      slots: {
        default: () => {
          return (
            <>
              <div class=" items-center w-[100%] text-right">
                {/* <ElCheckbox v-model={remember.value} label={t('login.remember')} size="small" /> */}
                <ElLink type="primary" underline={false} onClick={() => emit('to-forgotpwd')}>
                  {t('login.forgetPassword') + '?'}
                </ElLink>
              </div>
            </>
          )
        }
      }
    }
  },
  {
    field: 'login',
    colProps: {
      span: 24
    },
    formItemProps: {
      slots: {
        default: () => {
          return (
            <>
              <div class="w-[100%]">
                <ElButton
                  loading={loading.value}
                  type="primary"
                  class="w-[100%] !h-50px"
                  onClick={signIn}
                >
                  {t('login.login')}
                </ElButton>
              </div>
            </>
          )
        }
      }
    }
  }
  // {
  //   field: 'other',
  //   component: 'Divider',
  //   label: t('login.otherLogin'),
  //   componentProps: {
  //     contentPosition: 'center'
  //   }
  // }
  // {
  //   field: 'otherIcon',
  //   colProps: {
  //     span: 24
  //   },
  //   formItemProps: {
  //     slots: {
  //       default: () => {
  //         return (
  //           <>
  //             <div class="flex justify-between w-[100%]">
  //               <Icon
  //                 icon="ant-design:github-filled"
  //                 size={iconSize}
  //                 class="cursor-pointer ant-icon"
  //                 color={iconColor}
  //                 hoverColor={hoverColor}
  //               />
  //               <Icon
  //                 icon="ant-design:wechat-filled"
  //                 size={iconSize}
  //                 class="cursor-pointer ant-icon"
  //                 color={iconColor}
  //                 hoverColor={hoverColor}
  //               />
  //               <Icon
  //                 icon="ant-design:alipay-circle-filled"
  //                 size={iconSize}
  //                 color={iconColor}
  //                 hoverColor={hoverColor}
  //                 class="cursor-pointer ant-icon"
  //               />
  //               <Icon
  //                 icon="ant-design:weibo-circle-filled"
  //                 size={iconSize}
  //                 color={iconColor}
  //                 hoverColor={hoverColor}
  //                 class="cursor-pointer ant-icon"
  //               />
  //             </div>
  //           </>
  //         )
  //       }
  //     }
  //   }
  // }
])

const iconSize = 30

const remember = ref(false)

const { formRegister, formMethods } = useForm()
const { getFormData, getElFormExpose } = formMethods

const loading = ref(false)

const iconColor = '#999'

const hoverColor = 'var(--el-color-primary)'

const redirect = ref<string>('')

watch(
  () => currentRoute.value,
  (route: RouteLocationNormalizedLoaded) => {
    redirect.value = route?.query?.redirect as string
  },
  {
    immediate: true
  }
)

// 登录
const signIn = async () => {
  const formRef = await getElFormExpose()
  await formRef?.validate(async (isValid) => {
    if (isValid) {
      loading.value = true
      const formData = await getFormData<UserType>()
      try {
        const res = await loginApi(formData)
        localStore.setStorage(appStore.getToken, res.data.tokenInfo)
        localStore.setStorage(appStore.getUserInfo, res.data.userInfo)
        if (res) {
          const menuList = await packNewMenu()
          if (menuList) {
            permissionStore.getAddRouters.forEach((route) => {
              addRoute(route as RouteRecordRaw) // 动态添加可访问路由表
            })
            push({ path: '/' })
          }
          // // setStorage(appStore.getUserInfo, res.data)
          // localStore.setStorage(appStore.getToken, res.data.tokenValue)

          // console.log(appStore.getDynamicRouter)
          // // 是否使用动态路由
          // if (appStore.getDynamicRouter) {
          //   localStore.setStorage('roleRouters', MenuList)
          //   await permissionStore
          //     .generateRoutes('server', MenuList as unknown as AppCustomRouteRecordRaw[])
          //     .catch(() => {})
          //   permissionStore.getAddRouters.forEach((route) => {
          //     addRoute(route as RouteRecordRaw) // 动态添加可访问路由表
          //   })
          //   permissionStore.setIsAddRouters(true)
          //   push({ path: '/' })
          //   // push({ path: redirect.value || permissionStore.addRouters[0].path })
        }
      } finally {
        loading.value = false
      }
    }
  })
}

// 去注册页面
const toRegister = () => {
  emit('to-register')
}
</script>

<template>
  <Form
:schema="schema" :rules="rules" label-position="top" hide-required-asterisk size="large"
    class="dark:(border-1 border-[var(--el-border-color)] border-solid)" @register="formRegister" />
</template>
