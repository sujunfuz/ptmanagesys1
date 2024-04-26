<script setup lang="tsx">
import { computed, unref } from 'vue'
import { ElDropdown, ElDropdownMenu, ElDropdownItem } from 'element-plus'
import { useLocaleStore } from '@/store/modules/locale'
import { useLocale } from '@/hooks/web/useLocale'
import { propTypes } from '@/utils/propTypes'
import { useDesign } from '@/hooks/web/useDesign'
import { packNewMenu } from '@/utils/common'
import { useRouter } from 'vue-router'
import { ArrowDown } from '@element-plus/icons-vue'

const { getPrefixCls } = useDesign()
const prefixCls = getPrefixCls('locale-dropdown')

defineProps({
  color: propTypes.string.def('')
})

const localeStore = useLocaleStore()
const { currentRoute } = useRouter()

const langMap = computed(() => localeStore.getLocaleMap)

const currentLang = computed(() => localeStore.getCurrentLocale)

const setLang = async (lang: LocaleType) => {
  if (lang === unref(currentLang).lang) return
  // 需要重新加载页面让整个语言多初始化

  localeStore.setCurrentLocale({
    lang
  })
  if (currentRoute.value.path != '/login') {
    new Promise((resolve, reject) => {
      packNewMenu()
        .then((res) => {
          window.location.reload()
          resolve(res)
        })
        .catch((e) => {
          reject(e)
        })
    })
  } else {
    window.location.reload()
  }
}
</script>

<template>
  <ElDropdown :class="prefixCls" trigger="click" @command="setLang">
    <span class="flex-c">
      <Icon
        :size="18"
        icon="ion:language-sharp"
        class="cursor-pointer !p-0"
        :class="$attrs.class"
        :color="color"
      />
      <span class="color-[var(--top-header-text-color)] ml-6px w-60px">{{
        currentLang.lang == 'zh' ? '简体中文' : currentLang.lang == 'cht' ? '繁體中文' : 'English'
      }}</span>
      <Icon icon="ep:arrow-down" color="#7d7e7e" class="ml-3px" />
    </span>
    <template #dropdown>
      <ElDropdownMenu>
        <ElDropdownItem v-for="item in langMap" :key="item.lang" :command="item.lang">
          <div v-if="item.lang == 'en'">
            <img src="@/assets/imgs/ServiceCenter/america.png" class="w-23px h-23px mr-5px" />
          </div>
          <div v-else>
            <img src="@/assets/imgs/ServiceCenter/china.png" class="w-23px h-23px mr-5px mt-2px" />
          </div>
          <div class="mt--4px">{{ item.name }}</div>
        </ElDropdownItem>
      </ElDropdownMenu>
    </template>
  </ElDropdown>
</template>
