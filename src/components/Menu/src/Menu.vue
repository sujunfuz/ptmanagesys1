<script lang="tsx">
import { computed, defineComponent, unref, PropType } from 'vue'
import { ElMenu, ElScrollbar } from 'element-plus'
import { useAppStore } from '@/store/modules/app'
import { usePermissionStore } from '@/store/modules/permission'
import { useRenderMenuItem } from './components/useRenderMenuItem'
import { useRouter } from 'vue-router'
import { isUrl } from '@/utils/is'
import { useDesign } from '@/hooks/web/useDesign'
import { ref } from 'vue'
import { nextTick } from 'vue'
import { Collapse } from '@/components/Collapse'

const { getPrefixCls } = useDesign()

const prefixCls = getPrefixCls('menu')

export default defineComponent({
  name: 'Menu',
  props: {
    menuSelect: {
      type: Function as PropType<(index: string) => void>,
      default: undefined
    }
  },
  setup(props) {
    const appStore = useAppStore()

    const layout = computed(() => appStore.getLayout)

    const { push, currentRoute } = useRouter()

    const permissionStore = usePermissionStore()

    const menuMode = computed((): 'vertical' | 'horizontal' => {
      // 竖
      const vertical: LayoutType[] = ['classic', 'topLeft', 'cutMenu']

      if (vertical.includes(unref(layout))) {
        return 'vertical'
      } else {
        return 'horizontal'
      }
    })

    const routers = computed(() =>
      unref(layout) === 'cutMenu' ? permissionStore.getMenuTabRouters : permissionStore.getRouters
    )

    const collapse = computed(() => appStore.getCollapse)
    // 折叠图标
    const hamburger = computed(() => appStore.getHamburger)

    const uniqueOpened = computed(() => appStore.getUniqueOpened)

    // const activeMenu = computed(() => {
    //   const { meta, path } = unref(currentRoute)
    //   // if set path, the sidebar will highlight the path you set
    //   if (meta.activeMenu) {
    //     return meta.activeMenu as string
    //   }
    //   return path
    // })
    const activeMenu = ref(currentRoute.value.path)
    const menuSelect = (index: string) => {
      let str = index.split('==')
      // 自定义事件
      if (str.length == 3) {
        str[1] = isUrl(str[1]) ? decodeURI(str[1]) : 'http://' + str[1]
        str[1] = str[1].replace('http:/', 'http://')
        str[1] = str[1].replace('https:/', 'https://')
        window.open(str[1])
        activeMenu.value = '11'

        nextTick(() => {
          activeMenu.value = currentRoute.value.path
        })
      } else {
        push(index)
      }
    }

    const renderMenuWrap = () => {
      if (unref(layout) === 'top') {
        return renderMenu()
      } else {
        return (
          <ElScrollbar>
            {renderMenu()}
            <Collapse color="#4d5156"></Collapse>
          </ElScrollbar>
        )
      }
    }
    // /authorization/menu /authorization/role
    const renderMenu = () => {
      return (
        <ElMenu
          class="pb-40px"
          defaultActive={activeMenu.value}
          mode={unref(menuMode)}
          collapse={
            unref(layout) === 'top' || unref(layout) === 'cutMenu' ? false : unref(collapse)
          }
          uniqueOpened={unref(layout) === 'top' ? false : unref(uniqueOpened)}
          backgroundColor="var(--left-menu-bg-color)"
          textColor="var(--left-menu-text-color)"
          activeTextColor="var(--left-menu-text-active-color)"
          onSelect={menuSelect}
        >
          {{
            default: () => {
              const { renderMenuItem } = useRenderMenuItem(unref(menuMode))
              return renderMenuItem(unref(routers))
            }
          }}
        </ElMenu>
      )
    }

    return () => (
      <div
        id={prefixCls}
        class={[
          `${prefixCls} ${prefixCls}__${unref(menuMode)}`,
          'h-[100%] overflow-hidden flex-col bg-[var(--left-menu-bg-color)]',
          {
            'w-[var(--left-menu-min-width)]': unref(collapse) && unref(layout) !== 'cutMenu',
            'w-[var(--left-menu-max-width)]': !unref(collapse) && unref(layout) !== 'cutMenu'
          }
        ]}
      >
        {renderMenuWrap()}
      </div>
    )
  }
})
</script>

<style lang="less" scoped>
@prefix-cls: ~'@{namespace}-menu';

// .is-active--after {
//   position: absolute;
//   top: 0;
//   right: 0;
//   width: 4px;
//   height: 100%;
//   background-color: var(--el-color-primary);
//   content: '';
// }

.@{prefix-cls} {
  position: relative;
  transition: width var(--transition-time-02);

  // &:after {
  //   position: absolute;
  //   top: 0;
  //   right: 0;
  //   height: 100%;
  //   width: 1px;
  //   background-color: var(--el-border-color);
  //   content: '';
  // }

  :deep(.@{elNamespace}-menu) {
    width: 100% !important;
    border-right: none;
    // 设置选中时子标题的颜色
    .is-active {
      &>.@{elNamespace}-sub-menu__title {
        color: var(--left-menu-text-active-color) !important;
      }
    }

    // 设置子菜单悬停的高亮和背景色
    .@{elNamespace}-sub-menu__title,
    .@{elNamespace}-menu-item {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      display: block;
      //display: flex;
      height: 55px;

      &:hover {
        color: var(--left-menu-text-active-color) !important;
        background-color: var(--left-menu-bg-color) !important;
      }

      .el-sub-menu__icon-arrow {
        margin-top: 0px;
      }
    }

    // 设置选中时的高亮背景和高亮颜色
    .@{elNamespace}-sub-menu.is-active,
    .@{elNamespace}-menu-item.is-active {
      color: var(--left-menu-text-active-color) !important;
      background-color: var(--left-menu-bg-active-color) !important;

      &:hover {
        background-color: var(--left-menu-bg-active-color) !important;
      }
    }

    .el-sub-menu.is-active {
      .@{elNamespace}-menu-item.is-active {

        // .el-icon svg {
        //   display: none;
        // }
        // margin-left: -10px;
        span {
          margin-left: 20px;
        }

        position: relative;

        // &:after {
        //   .is-active--after;
        // }
      }
    }

    // 设置子菜单的背景颜色
    .@{elNamespace}-menu {

      .@{elNamespace}-sub-menu__title,
      .@{elNamespace}-menu-item:not(.is-active) {

        // .el-icon svg {
        //   display: none;
        // }
        span {
          margin-left: 20px;
        }

        // margin-left: -10px;
        background-color: var(--left-menu-bg-light-color) !important;
      }
    }
  }

  // :deep(.el-menu.el-menu--vertical) {
  //   .el-menu-item:first-child {
  //     span {
  //       margin-left: 0px;
  //     }
  //   }
  // }
  // 折叠时的最小宽度
  :deep(.@{elNamespace}-menu--collapse) {
    width: var(--left-menu-min-width);

    &>.is-active,
    &>.is-active>.@{elNamespace}-sub-menu__title {
      position: relative;
      background-color: var(--left-menu-collapse-bg-active-color) !important;

      // &:after {
      //   .is-active--after;
      // }
    }
  }

  // 折叠动画的时候，就需要把文字给隐藏掉
  :deep(.horizontal-collapse-transition) {

    // transition: 0s width ease-in-out, 0s padding-left ease-in-out, 0s padding-right ease-in-out !important;
    .@{prefix-cls}__title {
      display: none;
    }
  }

  // 水平菜单
  &__horizontal {
    height: calc(~'var(--top-tool-height)') !important;

    :deep(.@{elNamespace}-menu--horizontal) {
      height: calc(~'var(--top-tool-height)');
      border-bottom: none;

      // 重新设置底部高亮颜色
      &>.@{elNamespace}-sub-menu.is-active {
        .@{elNamespace}-sub-menu__title {
          border-bottom-color: var(--el-color-primary) !important;
        }
      }

      .@{elNamespace}-menu-item.is-active {
        position: relative;

        &:after {
          display: none !important;
        }
      }

      .@{prefix-cls}__title {
        /* stylelint-disable-next-line */
        max-height: calc(~'var(--top-tool-height) - 2px') !important;
        /* stylelint-disable-next-line */
        line-height: calc(~'var(--top-tool-height) - 2px');
      }
    }
  }
}
</style>

<style lang="less">
@prefix-cls: ~'@{namespace}-menu-popper';

// .is-active--after {
//   position: absolute;
//   top: 0;
//   right: 0;
//   width: 4px;
//   height: 100%;
//   background-color: var(--el-color-primary);
//   content: '';
// }

.@{prefix-cls}--vertical,
.@{prefix-cls}--horizontal {

  // 设置选中时子标题的颜色
  .is-active {
    &>.el-sub-menu__title {
      color: var(--left-menu-text-active-color) !important;
    }
  }

  // 设置子菜单悬停的高亮和背景色
  .el-sub-menu__title,
  .el-menu-item {
    &:hover {
      color: var(--left-menu-text-active-color) !important;
      background-color: var(--left-menu-bg-color) !important;
    }
  }

  // 设置选中时的高亮背景
  .el-menu-item.is-active {
    position: relative;
    background-color: var(--left-menu-bg-active-color) !important;

    &:hover {
      background-color: var(--left-menu-bg-active-color) !important;
    }

    // &:after {
    //   .is-active--after;
    // }
  }
}</style>
