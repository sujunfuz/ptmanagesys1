<script setup lang="ts">
import { LoginForm, NewRegisterForm, lqmLoginForm, lqmRegisterForm } from './components'
import { useI18n } from '@/hooks/web/useI18n'
import { ref } from 'vue'

const { t } = useI18n()

const registerFlag = ref(0)

const bottomRatio = ref<any>('38%')
const returnLogin = () => {
  registerFlag.value = 2
  bottomRatio.value = '38%'
}

const showFlag = ref(1) //1-右边那块展示注册表单   2-右边那块展示忘记密码
const forgotPWD = () => {
  registerFlag.value = 1
  showFlag.value = 2
}

const toregister = () => {
  registerFlag.value = 1
  showFlag.value = 1
}
</script>

<template>
  <div class="relative w-100vw h-100vh min-h-100vh">
    <!-- 登录 -->
    <div
      class="absolute left-0px w-50% h-100%"
      :class="{ moveOpacity: registerFlag == 1, returnOpacity: registerFlag == 2 }"
    >
      <div class="w-52% overflow-hidden left-24% h-100% relative min-w-300px mt-130px">
        <div>
          <img src="@/assets/imgs/middleLogo.png" class="w-240px ml--25px" alt="" />
          <div class="color-colorBlack font-size-24px mt--20px ml-5px">{{
            t('login.welcomeLogin')
          }}</div>
        </div>
        <!-- 登录组件 -->
        <div class="mt-20px">
          <lqmLoginForm @to-forgotpwd="forgotPWD" />
          <div
            @click="toregister"
            v-show="registerFlag == 2 || registerFlag == 0"
            class="color-#4c4f54 text-center font-size-14px cursor-pointer mb--20px mt-20px"
          >
            {{ t('common.m') + ',' }}<span class="colorMain">{{ t('login.registerNow') }}</span>
          </div>
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
        <!-- <div
          @click="toregister"
          v-show="registerFlag == 2 || registerFlag == 0"
          class="bg-colorMain w-150px h-52px rd-4px absolute left-60px bottom-10% color-white font-size-18px text-center line-height-52px cursor-pointer"
        >
          {{ t('login.registerNow') }}
        </div> -->
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
          <div>
            <img src="@/assets/imgs/middleLogo.png" class="w-250px ml--30px mt-50px" alt="" />
            <div
              v-show="bottomRatio != '32%' && showFlag == 1"
              class="color-colorBlack font-size-24px ml-5px mt--20px mb-20px"
              >{{ t('login.startRegister') }}</div
            >
            <div
              v-show="bottomRatio != '32%' && showFlag == 2"
              class="color-colorBlack font-size-24px ml-5px mt--20px mb-20px"
              >{{ t('login.forgetPassword') }}</div
            >
          </div>
          <!-- 登录组件 -->
          <div
            :style="{
              bottom: bottomRatio
            }"
          >
            <lqmRegisterForm
              v-model:registerFlag="registerFlag"
              v-model:showFlag="showFlag"
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
