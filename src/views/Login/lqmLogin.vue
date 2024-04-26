<script setup lang="ts">
import { LoginForm, NewRegisterForm, lqmLoginForm, lqmRegisterForm } from './components'
import { ThemeSwitch } from '@/components/ThemeSwitch'
import { LocaleDropdown } from '@/components/LocaleDropdown'
import { useI18n } from '@/hooks/web/useI18n'
import { underlineToHump } from '@/utils'
import { useAppStore } from '@/store/modules/app'
import { useDesign } from '@/hooks/web/useDesign'
import { ref } from 'vue'
import { ElScrollbar } from 'element-plus'

const { getPrefixCls } = useDesign()

const prefixCls = getPrefixCls('login')

const appStore = useAppStore()

const { t } = useI18n()

const isLogin = ref(true)
const registerFlag = ref(0)

const toRegister = () => {
  isLogin.value = false
}

const toLogin = () => {
  isLogin.value = true
}
const bottomRatio = ref<any>('38%')
const returnLogin = () => {
  registerFlag.value = 2
  bottomRatio.value = '38%'
}
</script>

<template>
  <div class="relative w-100vw h-100vh">
    <!-- 登录 -->
    <div
      class="absolute left-0px w-50% h-100%"
      :class="{ moveOpacity: registerFlag == 1, returnOpacity: registerFlag == 2 }"
    >
      <div class="w-52% overflow-hidden left-24% h-100% relative min-w-300px">
        <div class="absolute top-14%">
          <img src="@/assets/imgs/Login/loginicon.png" class="w-160px" alt="" />
          <div class="color-colorBlack font-size-24px mt-16px">{{ t('login.welcomeLogin') }}</div>
        </div>
        <!-- 登录组件 -->
        <div class="absolute bottom-28%">
          <lqmLoginForm />
        </div>
      </div>
    </div>
    <div
      class="relative left-50% w-100% h-100% z-1000"
      :class="{ moveClass: registerFlag == 1, returnClass: registerFlag == 2 }"
    >
      <!-- 背景图片 -->
      <div class="right-bg w-50% h-100% relative left-0 overflow-hidden">
        <img
          class="absolute w-280px bottom-19% left-33px"
          src="@/assets/imgs/Login/loginicon1.png"
          alt=""
        />
        <div
          @click="registerFlag = 1"
          v-show="registerFlag == 2 || registerFlag == 0"
          class="bg-colorMain w-150px h-52px rd-4px absolute left-60px bottom-10% color-white font-size-18px text-center line-height-52px cursor-pointer"
        >
          {{ t('login.registerNow') }}
        </div>
      </div>
      <div class="absolute w-50% h-100% left-50% top-0">
        <div class="font-size-14px color-colorBlack mt-50px ml-50px"
          >{{ t('login.hasAccount') }}?<span
            class="color-colorMain cursor-pointer"
            @click="returnLogin"
            >{{ t('login.returnLogin') }}</span
          ></div
        >
        <div class="w-52% overflow-hidden left-24% h-100% relative min-w-300px">
          <div class="absolute top-14%">
            <img src="@/assets/imgs/Login/loginicon.png" class="w-160px" alt="" />
            <div v-show="bottomRatio != '32%'" class="color-colorBlack font-size-24px mt-16px">{{
              t('login.startRegister')
            }}</div>
          </div>
          <!-- 登录组件 -->
          <div
            class="absolute"
            :style="{
              bottom: bottomRatio
            }"
          >
            <lqmRegisterForm
              v-model:registerFlag="registerFlag"
              v-model:bottomRatio="bottomRatio"
            />
          </div>
        </div>
      </div>
      <!-- 注册 -->
    </div>
  </div>
</template>

<style lang="less" scoped>
.moveClass {
  animation-name: moveBack;
  animation-duration: 1s;
  animation-fill-mode: both;
  animation-timing-function: ease;
}

.returnClass {
  animation-name: returnBack;
  animation-duration: 1s;
  animation-fill-mode: both;
  animation-timing-function: ease;
}

.moveOpacity {
  animation-name: moveOpacity;
  animation-duration: 1s;
  animation-fill-mode: both;
  animation-timing-function: ease;
}

.returnOpacity {
  animation-name: returnOpacity;
  animation-duration: 1s;
  animation-fill-mode: both;
  animation-timing-function: ease;
}

@keyframes moveOpacity {
  0% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
}

@keyframes returnOpacity {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

@keyframes returnBack {
  0% {
    left: 0%;
  }

  100% {
    left: 50%;
  }
}

@keyframes moveBack {
  0% {
    // transform: translateX(0px);
    left: 50%;
  }

  100% {
    // transform: translateX(-200px);
    left: 0%;
  }
}

.right-bg {
  background-image: url('@/assets/imgs/Login/loginbg.png');
  background-size: cover;
}

@prefix-cls: ~'@{namespace}-login';

.@{prefix-cls} {
  overflow: auto;

  &__left {
    &::before {
      position: absolute;
      top: 0;
      left: 0;
      z-index: -1;
      width: 100%;
      height: 100%;
      background-image: url('@/assets/svgs/login-bg.svg');
      background-position: center;
      background-repeat: no-repeat;
      content: '';
    }
  }
}

.backToLogin {
  border: #aaaaaa solid 1px;
  color: #707070;
  display: inline-block;
  padding: 8px 10px;
  border-radius: 13px;
}
</style>
