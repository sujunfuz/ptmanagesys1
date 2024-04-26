<script lang="tsx">
import { defineComponent, computed, ref, onMounted } from 'vue'
import { Collapse } from '@/components/Collapse'
import { LocaleDropdown } from '@/components/LocaleDropdown'
import { ServiceCenter } from '@/components/ServiceCenter'
import { MessageNotification } from '@/components/MessageNotification'
import { SizeDropdown } from '@/components/SizeDropdown'
import { UserInfo } from '@/components/UserInfo'
import { ThemeColor } from '@/components/ThemeColor'
import { Screenfull } from '@/components/Screenfull'
import { Breadcrumb } from '@/components/Breadcrumb'
import { Quit } from '@/components/Quit'
import { useAppStore } from '@/store/modules/app'
import { useDesign } from '@/hooks/web/useDesign'
import { TagsView } from '@/components/TagsView'
import { getNotReadCountApi } from '@/api/messageCenter/platformMessage'

const { getPrefixCls, variables } = useDesign()

const prefixCls = getPrefixCls('tool-header')

const appStore = useAppStore()

// 标签页
const tagsView = computed(() => appStore.getTagsView)

// 面包屑
const breadcrumb = computed(() => appStore.getBreadcrumb)

// 折叠图标
const hamburger = computed(() => appStore.getHamburger)

// 全屏图标
const screenfull = computed(() => appStore.getScreenfull)

// 项目主题
const themeColors = computed(() => appStore.getThemeColors)

// 尺寸图标
const size = computed(() => appStore.getSize)

// 布局
const layout = computed(() => appStore.getLayout)

// 多语言图标
const locale = computed(() => appStore.getLocale)

const notReadCount = ref(0)
const getNotReadCount = async () => {
  const res = await getNotReadCountApi()
  notReadCount.value = res.data
}

const refreshData = ref()

const quit = (val) => {
  if (val) {
    clearInterval(refreshData.value)
  }
}

export default defineComponent({
  name: 'ToolHeader',
  setup() {
    onMounted(() => {
      getNotReadCount()
      refreshData.value = setInterval(() => {
        getNotReadCount()
      }, 1000 * 60)
    })
    return () => (
      <div
        style="margin-left: -1px"
        id={`${variables.namespace}-tool-header`}
        class={[
          prefixCls,
          'h-[var(--top-tool-height)] relative px-[var(--top-tool-p-x)] flex items-center justify-between',
          'dark:bg-[var(--el-bg-color)]'
        ]}
      >
        {/* {layout.value !== 'top' ? (
          <div class="h-full flex items-center">
            {hamburger.value && layout.value !== 'cutMenu' ? (
              <Collapse class="custom-hover" color="var(--top-header-text-color)"></Collapse>
            ) : undefined}
            {breadcrumb.value ? <Breadcrumb class="<md:hidden"></Breadcrumb> : undefined}
          </div>
        ) : undefined} */}
        {tagsView.value ? (
          <TagsView class="layout-border__bottom layout-border__top"></TagsView>
        ) : undefined}
        <div class="h-full flex items-center">
          <UserInfo></UserInfo>
          {locale.value ? (
            <LocaleDropdown
              class="custom-hover"
              color="var(--top-header-text-color)"
            ></LocaleDropdown>
          ) : undefined}
          {themeColors.value ? (
            <ThemeColor class="custom-hover" color="var(--top-header-text-color)"></ThemeColor>
          ) : undefined}
          <ServiceCenter class="custom-hover" color="var(--top-header-text-color)" />
          <MessageNotification
            notReadCount={notReadCount.value}
            class="custom-hover"
            color="var(--top-header-text-color)"
          />
          {screenfull.value ? (
            <Screenfull class="custom-hover" color="var(--top-header-text-color)"></Screenfull>
          ) : undefined}
          <Quit onQuit={quit}></Quit>
        </div>
      </div>
    )
  }
})
</script>

<style lang="less" scoped>
@prefix-cls: ~'@{namespace}-tool-header';

.@{prefix-cls} {
  transition: left var(--transition-time-02);
}
</style>
