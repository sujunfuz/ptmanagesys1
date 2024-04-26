e
<template>
  <div>
    <ContentWrap>
      <div class="flex-b">
        <div class="titleBase">{{ t('productcategory.categoryManage') }}</div>
      </div>
      <div class="mt-20px">
        <Search :schema="schema" @reset="setSearchParams" @search="setSearchParams"
      /></div>
      <div
        ><div class="flex">
          <div
            class="w-430px border-[#dcdfe6] border-solid border-1px p-10px color-[var(--el-color-primary)] cursor-pointer font-size-15px"
          >
            <Icon icon="ep:plus" size="12" /> {{ t('productcategory.add') }}
          </div>
          <div
            class="w-430px border-[#dcdfe6] border-solid border-1px p-10px color-[var(--el-color-primary)] cursor-pointer font-size-15px"
            style="border-left: none"
          >
            <Icon icon="ep:plus" size="12" /> {{ t('productcategory.add') }}
          </div>
        </div>
        <div class="flex">
          <div
            class="w-450px border-[#dcdfe6] border-solid border-1px color-[#808286] h-700px font-size-15px"
            style="border-top: none"
          >
            <div v-for="(item, key) in dataLeft" :key="key">
              <div class="flex-b p-10px blockItem" @mouseenter="lightAction = key">
                <div class="pl-10px">{{ item }}</div>
                <div class="flex-b">
                  <span class="[&>span]:(cursor-pointer m-2) colorMain cursor-pointer">
                    {{ t('project.edit') }}
                  </span>
                  <span
                    class="w-2px h-15px bg-[#cbe3ef] block relative top-3px ml-10px mr-10px"
                  ></span>
                  <span class="[&>span]:(cursor-pointer m-2) color-red-500 mr-10px cursor-pointer">
                    {{ t('project.delete') }}
                  </span>
                  <span
                    ><Icon
                      icon="svg-icon:sort"
                      size="{20}"
                      color="rgba(14, 165, 233, var(--un-text-opacity))"
                      class="mt-2px mr-5px sortIcon cursor-pointer"
                  /></span>
                  <Icon icon="ep:arrow-right" class="relative top-2px" />
                </div>
              </div>
            </div>
          </div>
          <div
            class="w-450px border-[#dcdfe6] border-solid border-1px color-[#808286] h-700px font-size-15px"
            style="border-left: none; border-top: none"
          >
            <div v-for="(item, key) in dataLeft" :key="key">
              <div class="flex-b p-10px blockItem" @mouseenter="lightAction = key">
                <div class="pl-10px">{{ item }}</div>
                <div class="flex-b">
                  <span class="[&>span]:(cursor-pointer m-2) colorMain">
                    {{ t('project.edit') }}
                  </span>
                  <span
                    class="w-2px h-15px bg-[#cbe3ef] block relative top-3px ml-10px mr-10px"
                  ></span>
                  <span class="[&>span]:(cursor-pointer m-2) color-red-500 mr-10px">
                    {{ t('project.delete') }}
                  </span>
                  <span
                    ><Icon
                      icon="svg-icon:sort"
                      size="{20}"
                      color="rgba(14, 165, 233, var(--un-text-opacity))"
                      class="mt-2px mr-5px sortIcon"
                  /></span>
                  <Icon icon="ep:arrow-right" class="relative top-2px" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ContentWrap>
  </div>
</template>

<script lang="tsx" setup>
import { ContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { useI18n } from '@/hooks/web/useI18n'
import { ref, reactive, unref } from 'vue'

const { t } = useI18n()
const lightAction = ref(-1)
const dataLeft = [
  '图像影像',
  '家具生活',
  '运动户外',
  '33333',
  '4444444',
  '56666666',
  'xxxx',
  'bbbbbbbbb'
]

const searchParams = ref({})
const setSearchParams = (params: any) => {
  //   currentPage.value = 1
  searchParams.value = params
}

const dataRight = [
  '图像影像',
  '家具生活',
  '运动户外',
  '33333',
  '4444444',
  '56666666',
  'xxxx',
  'bbbbbbbbb'
]
const schema = reactive<FormSchema[]>([
  {
    field: 'name',
    label: '',
    component: 'Input',
    componentProps: {
      style: {
        width: '400px'
      },
      slots: {
        prepend: () => <div>{t('productcategory.first')}</div>
        // append: () => <Icon icon="ep:share" />
      },
      on: {
        change: (data) => {}
      }
    }
  },
  {
    field: 'name',
    label: '',
    component: 'Input',
    componentProps: {
      slots: {
        prepend: () => <div>{t('productcategory.second')}</div>
        // append: () => <Icon icon="ep:share" />
      }
    }
  }
])
</script>

<style lang="less" scoped>
.blockItem:hover {
  background-color: #eff9f1;
  color: var(--el-color-primary);
}
</style>
