<script setup lang="ts">
import { onMounted, watch, computed, unref, ref, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import type { RouteLocationNormalizedLoaded, RouterLinkProps } from 'vue-router'
import { usePermissionStore } from '@/store/modules/permission'
import { useTagsViewStore } from '@/store/modules/tagsView'
import { useAppStore } from '@/store/modules/app'
import { useI18n } from '@/hooks/web/useI18n'
import { filterAffixTags } from './helper'
import { ContextMenu, ContextMenuExpose } from '@/components/ContextMenu'
import { useDesign } from '@/hooks/web/useDesign'
import { useTemplateRefsList } from '@vueuse/core'
import { ElScrollbar } from 'element-plus'
import { useScrollTo } from '@/hooks/event/useScrollTo'
import { useTagsView } from '@/hooks/web/useTagsView'
import { cloneDeep } from 'lodash-es'

const { getPrefixCls } = useDesign()

const prefixCls = getPrefixCls('tags-view')

const { t } = useI18n()

const { currentRoute, push } = useRouter()

const { closeAll, closeLeft, closeRight, closeOther, closeCurrent, refreshPage } = useTagsView()

const permissionStore = usePermissionStore()

const routers = computed(() => permissionStore.getRouters)

const tagsViewStore = useTagsViewStore()

const visitedViews = computed(() => tagsViewStore.getVisitedViews)

const affixTagArr = ref<RouteLocationNormalizedLoaded[]>([])

const selectedTag = computed(() => tagsViewStore.getSelectedTag)

const setSelectTag = tagsViewStore.setSelectedTag

const appStore = useAppStore()

const tagsViewIcon = computed(() => appStore.getTagsViewIcon)

const isDark = computed(() => appStore.getIsDark)
//home图变颜色
const homeIconColor = ref()
const homeIsTrue = ref(false)
const showIconFlag = ref(false)
watch(
  () => currentRoute.value.path,
  (val) => {
    if (val.indexOf('/dashboard/index') != -1) {
      homeIconColor.value = '#7f8386'
      homeIsTrue.value = false
    } else {
      homeIconColor.value = '#7f8386'
      homeIsTrue.value = true
    }
  },
  { immediate: true }
)

// 初始化tag
const initTags = () => {
  affixTagArr.value = filterAffixTags(unref(routers))
  for (const tag of unref(affixTagArr)) {
    // Must have tag name
    if (tag.name) {
      tagsViewStore.addVisitedView(cloneDeep(tag))
    }
  }
}

// 新增tag
const addTags = () => {
  const { name } = unref(currentRoute)
  if (name) {
    setSelectTag(unref(currentRoute))
    tagsViewStore.addView(unref(currentRoute))
  }
}

// 关闭选中的tag
const closeSelectedTag = (view: RouteLocationNormalizedLoaded) => {
  closeCurrent(view, () => {
    if (isActive(view)) {
      toLastView()
    }
  })
}

// 去最后一个
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

// 关闭全部
const closeAllTags = () => {
  closeAll(() => {
    toLastView()
  })
}

// 关闭其它
const closeOthersTags = () => {
  closeOther()
}

// 重新加载
const refreshSelectedTag = async (view?: RouteLocationNormalizedLoaded) => {
  console.log('重新加载')
  refreshPage(view)
}

// 关闭左侧
const closeLeftTags = () => {
  closeLeft()
}

// 关闭右侧
const closeRightTags = () => {
  closeRight()
}

// 滚动到选中的tag
const moveToCurrentTag = async () => {
  await nextTick()
  for (const v of unref(visitedViews)) {
    if (v.fullPath.split('?')[0] === unref(currentRoute).path) {
      moveToTarget(v)
      if (v.fullPath !== unref(currentRoute).fullPath) {
        tagsViewStore.updateVisitedView(unref(currentRoute))
      }

      break
    }
  }
}

const tagLinksRefs = useTemplateRefsList<RouterLinkProps>()

const moveToTarget = (currentTag: RouteLocationNormalizedLoaded) => {
  const wrap$ = unref(scrollbarRef)?.wrapRef
  let firstTag: Nullable<RouterLinkProps> = null
  let lastTag: Nullable<RouterLinkProps> = null

  const tagList = unref(tagLinksRefs)
  // find first tag and last tag
  if (tagList.length > 0) {
    firstTag = tagList[0]
    lastTag = tagList[tagList.length - 1]
  }
  if ((firstTag?.to as RouteLocationNormalizedLoaded).fullPath === currentTag.fullPath) {
    // 直接滚动到0的位置
    const { start } = useScrollTo({
      el: wrap$!,
      position: 'scrollLeft',
      to: 0,
      duration: 500
    })
    start()
  } else if ((lastTag?.to as RouteLocationNormalizedLoaded).fullPath === currentTag.fullPath) {
    // 滚动到最后的位置
    const { start } = useScrollTo({
      el: wrap$!,
      position: 'scrollLeft',
      to: wrap$!.scrollWidth - wrap$!.offsetWidth,
      duration: 500
    })
    start()
  } else {
    // find preTag and nextTag
    const currentIndex: number = tagList.findIndex(
      (item) => (item?.to as RouteLocationNormalizedLoaded).fullPath === currentTag.fullPath
    )
    const tgsRefs = document.getElementsByClassName(`${prefixCls}__item`)

    const prevTag = tgsRefs[currentIndex - 1] as HTMLElement
    const nextTag = tgsRefs[currentIndex + 1] as HTMLElement

    // the tag's offsetLeft after of nextTag
    const afterNextTagOffsetLeft = nextTag.offsetLeft + nextTag.offsetWidth + 4

    // the tag's offsetLeft before of prevTag
    const beforePrevTagOffsetLeft = prevTag.offsetLeft - 4

    if (afterNextTagOffsetLeft > unref(scrollLeftNumber) + wrap$!.offsetWidth) {
      const { start } = useScrollTo({
        el: wrap$!,
        position: 'scrollLeft',
        to: afterNextTagOffsetLeft - wrap$!.offsetWidth,
        duration: 500
      })
      start()
    } else if (beforePrevTagOffsetLeft < unref(scrollLeftNumber)) {
      const { start } = useScrollTo({
        el: wrap$!,
        position: 'scrollLeft',
        to: beforePrevTagOffsetLeft,
        duration: 500
      })
      start()
    }
  }
}

// 是否是当前tag
const isActive = (route: RouteLocationNormalizedLoaded): boolean => {
  return route.path === unref(currentRoute).path
}

// 所有右键菜单组件的元素
const itemRefs = useTemplateRefsList<ComponentRef<typeof ContextMenu & ContextMenuExpose>>()

// 右键菜单装填改变的时候
const visibleChange = (visible: boolean, tagItem: RouteLocationNormalizedLoaded) => {
  if (visible) {
    for (const v of unref(itemRefs)) {
      const elDropdownMenuRef = v.elDropdownMenuRef
      if (tagItem.fullPath !== v.tagItem.fullPath) {
        elDropdownMenuRef?.handleClose()
      }
    }
  }
}

// elscroll 实例
const scrollbarRef = ref<ComponentRef<typeof ElScrollbar>>()

// 保存滚动位置
const scrollLeftNumber = ref(0)

const scroll = ({ scrollLeft }) => {
  showIconFlag.value = true
  scrollLeftNumber.value = scrollLeft as number
}

// 移动到某个位置
const move = (to: number) => {
  const wrap$ = unref(scrollbarRef)?.wrapRef
  const { start } = useScrollTo({
    el: wrap$!,
    position: 'scrollLeft',
    to: unref(scrollLeftNumber) + to,
    duration: 500
  })
  start()
}

onMounted(() => {
  initTags()
  addTags()
})

watch(
  () => currentRoute.value,
  () => {
    addTags()
    moveToCurrentTag()
  }
)
</script>

<template>
  <div
    :id="prefixCls"
    :class="prefixCls"
    class="flex dark:bg-[var(--el-bg-color)] relative ml--7px"
    style="width: 100%; overflow-y: hidden; height: 100"
  >
    <div class="flex h-40px pr-10px mt-9px">
      <!-- <span
        :class="[`${prefixCls}__tool ${prefixCls}__tool--first`, !homeIsTrue ? 'getHomeIcon' : '']"
        class="w-[var(--tags-view-height)] h-48px flex items-center z-88 justify-center cursor-pointer w-35px mt-2px pr-10px pl-5px"
      >
        <Icon
          icon="svg-icon:home"
          :size="16"
          :color="homeIconColor"
          @click="push('/dashboard/index')"
          class="mt--17px"
        />
      </span> -->
      <span
        :class="`${prefixCls}__tool ${prefixCls}__tool--first`"
        class="w-[var(--tags-view-height)] h-35px flex items-center justify-center cursor-pointer mt-6px ml-5px"
        @click="move(-200)"
        v-show="showIconFlag"
      >
        <span
          class="h-100% w-95% text-center"
          style="border-radius: 2px; background-color: rgba(226, 229, 233, 0.2)"
        >
          <Icon
            :size="10"
            icon="svg-icon:arrow-left"
            class="mt-10px"
            :hover-color="isDark ? '#fff' : 'var(--el-color-black)'"
          />
        </span>
      </span>
    </div>
    <div class="overflow-hidden flex-1 ml--10px mt-9px">
      <ElScrollbar ref="scrollbarRef" class="h-full" @scroll="scroll">
        <div class="flex">
          <div
            :ref="itemRefs.set"
            v-for="item in visitedViews"
            :key="item.fullPath"
            :tag-item="item"
            :class="[
              `${prefixCls}__item`,
              item?.meta?.affix ? `${prefixCls}__item--affix` : '',
              {
                'is-active': isActive(item)
              }
            ]"
            @visible-change="visibleChange"
          >
            <div @click="showIconFlag = false">
              <router-link :ref="tagLinksRefs.set" :to="{ ...item }" custom v-slot="{ navigate }">
                <div
                  @click="navigate"
                  class="h-full flex w-150px flex-b items-center relative whitespace-nowrap pl-15px line-height-5.5 font-size-14px"
                >
                  <!-- <Icon
                    v-if="
                      item?.matched &&
                      item?.matched[1] &&
                      item?.matched[1]?.meta?.icon &&
                      tagsViewIcon
                    "
                    :icon="item?.matched[1]?.meta?.icon"
                    :size="12"
                    class="mr-5px"
                  /> -->
                  <span class="pt-7px menuTitle">{{ t(item?.meta?.title as string) }} </span>
                  <Icon
                    class="pt-4px"
                    icon="ant-design:close-outlined"
                    :size="12"
                    @click.prevent.stop="closeSelectedTag(item)"
                  />
                </div>
              </router-link>
            </div>
          </div>
        </div>
      </ElScrollbar>
    </div>
    <span
      :class="`${prefixCls}__tool`"
      class="w-[var(--tags-view-height)] ml-3px h-34px right-0px flex items-center justify-center cursor-pointer mt-16px"
      @click="move(200)"
    >
      <span
        class="h-100% w-95% text-center"
        v-show="showIconFlag"
        style="border-radius: 2px; background-color: rgba(226, 229, 233, 0.2)"
      >
        <Icon
          :size="10"
          icon="svg-icon:arrow-right"
          class="mt-10px"
          :hover-color="isDark ? '#fff' : 'var(--el-color-black)'"
        />
      </span>
    </span>
    <!-- <span
      :class="`${prefixCls}__tool`"
      class="w-[var(--tags-view-height)] h-[var(--tags-view-height)] flex items-center justify-center cursor-pointer"
      @click="refreshSelectedTag(selectedTag)"
    >
      <Icon
        icon="ant-design:reload-outlined"
        color="var(--el-text-color-placeholder)"
        :hover-color="isDark ? '#fff' : 'var(--el-color-black)'"
      />
    </span> -->
    <!-- <ContextMenu
      trigger="click"
      :schema="[
        {
          icon: 'ant-design:sync-outlined',
          label: t('common.reload'),
          command: () => {
            refreshSelectedTag(selectedTag)
          }
        },
        {
          icon: 'ant-design:close-outlined',
          label: t('common.closeTab'),
          disabled: !!visitedViews?.length && selectedTag?.meta.affix,
          command: () => {
            closeSelectedTag(selectedTag!)
          }
        },
        {
          divided: true,
          icon: 'ant-design:vertical-right-outlined',
          label: t('common.closeTheLeftTab'),
          disabled: !!visitedViews?.length && selectedTag?.fullPath === visitedViews[0].fullPath,
          command: () => {
            closeLeftTags()
          }
        },
        {
          icon: 'ant-design:vertical-left-outlined',
          label: t('common.closeTheRightTab'),
          disabled:
            !!visitedViews?.length &&
            selectedTag?.fullPath === visitedViews[visitedViews.length - 1].fullPath,
          command: () => {
            closeRightTags()
          }
        },
        {
          divided: true,
          icon: 'ant-design:tag-outlined',
          label: t('common.closeOther'),
          command: () => {
            closeOthersTags()
          }
        },
        {
          icon: 'ant-design:line-outlined',
          label: t('common.closeAll'),
          command: () => {
            closeAllTags()
          }
        }
      ]"
    >
      <span
        :class="`${prefixCls}__tool`"
        class="w-[var(--tags-view-height)] h-[var(--tags-view-height)] flex items-center justify-center cursor-pointer block"
      >
        <Icon
          icon="ant-design:setting-outlined"
          color="var(--el-text-color-placeholder)"
          :hover-color="isDark ? '#fff' : 'var(--el-color-black)'"
        />
      </span>
    </ContextMenu> -->
  </div>
</template>

<style lang="less" scoped>
@prefix-cls: ~'@{namespace}-tags-view';

.@{prefix-cls} {
  :deep(.@{elNamespace}-scrollbar__view) {
    margin-left: -3px;
    height: 100%;
  }

  &__tool {
    position: relative;

    &::before {
      position: absolute;
      top: 1px;
      left: 0;
      width: 100%;
      height: calc(~'100% - 1px');
      border-left: none;
      content: '';
    }

    &--first {
      &::before {
        position: absolute;
        top: 1px;
        left: 0;
        width: 100%;
        height: calc(~'100% - 1px');
        border-right: none;
        border-left: none;
        content: '';
      }
    }
  }

  &__item {
    width: 150px;
    top: 2px;
    // height: calc(~'100% - 6px');
    padding-right: 25px;
    margin-left: 4px;
    font-size: 12px;
    cursor: pointer;
    border-radius: 2px;
    height: 37px;
    margin-top: 4px;
    color: #818181;
    // z-index: 2000;

    &--close {
      position: absolute;
      top: 50%;
      right: 5px;
      display: none;
      transform: translate(0, -50%);
    }

    &:not(.@{prefix-cls}__item--affix):hover {
      .@{prefix-cls}__item--close {
        display: block;
      }
    }
  }

  &__item:not(.is-active) {
    color: var(--top-header-text-color);
    &:hover {
      // color: var(--el-color-primary);
    }
  }

  &__item.is-active {
    width: 150px !important;
    margin-left: 10px;
    position: relative;
    color: var(--el-color-primary) !important;
    height: 37px;
    margin-top: 2px;
    background-color: #fff;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    border-bottom-left-radius: 0px;
    border-bottom-right-radius: 0px;

    .@{prefix-cls}__item--close {
      :deep(svg) {
        color: var(--el-color-primary) !important;
      }
    }
  }
}

// .v-tags-view__item.is-active::before {
//   content: '';
//   position: absolute;
//   width: 20px;
//   height: 20px;
//   bottom: 0;
//   left: -20px;
//   background: #fff;
//   background: radial-gradient(circle at 0 0, transparent 20px, #fff 10px);
//   // z-index: 9999;
// }

// .v-tags-view__item.is-active::after {
//   content: '';
//   position: absolute;
//   width: 20px;
//   height: 20px;
//   bottom: 0;
//   left: 166px;
//   background: #fff;
//   background: radial-gradient(circle at 30px 0, transparent 22px, #fff 10px);
//   // z-index: 9999;
// }

.menuTitle {
  overflow: hidden;
  white-space: nowrap;
  /*防止文字换行*/
  text-overflow: ellipsis;
}

.dark {
  .@{prefix-cls} {
    &__tool {
      &--first {
        &::after {
          display: none;
        }
      }
    }

    &__item {
      border: none;
    }

    &__item:not(.is-active) {
      &:hover {
        color: var(--el-color-primary);
      }
    }

    &__item.is-active {
      // color: var(--el-color-white);
      background-color: var(--el-color-primary);
      border: none;

      .@{prefix-cls}__item--close {
        :deep(svg) {
          color: var(--el-color-white) !important;
        }
      }
    }
  }
}

.getHomeIcon {
  background-color: #fff;
  position: relative;
  border-top-right-radius: 17px;
}

// .getHomeIcon::after {
//   content: '';
//   position: absolute;
//   width: 28px;
//   height: 28px;
//   bottom: 0;
//   left: 43px;
//   background: #fff;
//   background: radial-gradient(circle at 30px 0, transparent 22px, #fff 10px);
// z-index: 9999;
// }
.layout-border__bottom:after {
  height: 0px !important;
}
.layout-border__top:before {
  height: 0px !important;
}
</style>
