<template>
  <div class="flex">
    <div class="w-50%">
      <ContentWrap>
        <div>{{ t('accountPage.title1') }}</div>
        <div class="flex">
          <div class="flex-c mt-20px color-#7A7A7A font-size-14px">
            <div class="text-right w-60px min-w-60px">{{ t('accountPage.sub1') }}:</div>
            <div class="ml-15px color-colorBlack">张三风</div>
          </div>
          <div class="flex-c ml-40px mt-20px color-#7A7A7A font-size-14px">
            <div class="text-right w-90px min-w-90px">{{ t('accountPage.sub2') }}:</div>
            <div class="ml-15px color-colorBlack">张三风</div>
          </div>
        </div>
        <div class="flex-b">
          <div class="flex-c mt-20px color-#7A7A7A font-size-14px">
            <div class="text-right w-60px min-w-60px">{{ t('accountPage.sub3') }}:</div>
            <div class="ml-15px color-colorBlack">张三风</div>
          </div>
        </div>
        <div class="flex-b">
          <div class="flex-c mt-20px color-#7A7A7A font-size-14px">
            <div class="text-right w-60px min-w-60px">{{ t('accountPage.sub4') }}:</div>
            <div class="ml-15px color-colorBlack">张三风</div>
          </div>
        </div>
      </ContentWrap>
      <ContentWrap class="mt-20px h-580px relative">
        <div>{{ t('accountPage.title2') }}</div>
        <div class="flex font-size-14px color-#7A7A7A mt-15px">
          <div>{{ t('accountPage.sub5') }}</div>
          <div class="colorMain ml-10px">{{ t('accountPage.sub6') }}</div>
        </div>
        <div class="mt-10px">
          <Search :schema="schema" @reset="setSearchParams" @search="setSearchParams" />
        </div>

        <Table
          class="mt-10px"
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :columns="allSchemas.tableColumns"
          :data="dataList"
          :loading="loading"
          @register="tableRegister"
          :pagination="{
            total,
            layout: ' ->, total, sizes, prev, pager, next, jumper'
          }"
        />

        <div class="absolute bottom-20px right-20px">
          <ElButton type="primary" :loading="saveLoading" @click="save">
            {{ t('project.confirm') }}
          </ElButton>
        </div>
      </ContentWrap></div
    >
    <div class="w-50% ml-20px">
      <ContentWrap class="h-780px relative">
        <div>{{ t('accountPage.title3') }}</div>
        <div class="flex-b">
          <div class="flex-c mt-20px color-#7A7A7A font-size-14px">
            <div class="text-right w-100px min-w-100px">{{ t('accountPage.sub7') }}:</div>
            <div class="ml-15px color-colorBlack">张三风</div>
          </div>
        </div>
        <div class="flex-b">
          <div class="flex-c mt-20px color-#7A7A7A font-size-14px">
            <div class="text-right w-100px min-w-100px">{{ t('accountPage.sub8') }}:</div>
            <div class="ml-15px color-colorBlack">张三风</div>
          </div>
        </div>
        <div class="flex-b">
          <div class="flex-c mt-20px color-#7A7A7A font-size-14px">
            <div class="text-right w-100px min-w-100px">{{ t('accountPage.sub9') }}:</div>
            <div class="ml-15px color-colorBlack">张三风</div>
          </div>
        </div>
        <div class="flex-b">
          <div class="flex-c mt-20px color-#7A7A7A font-size-14px">
            <div class="text-right w-100px min-w-100px">{{ t('accountPage.sub4') }}:</div>
            <div class="ml-15px color-colorBlack">张三风</div>
          </div>
        </div>
        <div class="mt-100px">
          <div class="flex-c mt-20px font-size-14px">{{ t('accountPage.sub10') }}:</div>
          <div class="mt-10px">
            <Form @register="formRegister" :schema="baseSchema" class="baseClass" />
          </div>
        </div>

        <div class="absolute bottom-20px right-20px">
          <ElButton @click="dialogVisible = false">{{ t('common.cancel') }}</ElButton>
          <ElButton type="primary" :loading="saveLoading" @click="save">
            {{ t('accountPage.btn') }}
          </ElButton>
        </div>
      </ContentWrap>
    </div>
  </div>
</template>

<script lang="tsx" setup>
import { Form, FormSchema } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { ContentWrap } from '@/components/ContentWrap'
import { ElButton, ElTag, ElInput } from 'element-plus'
import { ref, reactive, unref } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import { Table } from '@/components/Table'
import { Search } from '@/components/Search'
import { useTable } from '@/hooks/web/useTable'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { useRouter } from 'vue-router'
import { tableStatusStyleTag } from '@/utils/componentUtils'
import { dateTimeRange } from '@/utils/time'

const chooseCount = ref(0)
const { push } = useRouter()

const searchParams = ref({})

const dialogVisible = ref(false)
const saveLoading = ref(false)

const { t } = useI18n()
const currentRow = ref<any>()

const baseSchema = reactive<FormSchema[]>([
  {
    field: 'isDefault',
    label: '',
    colProps: {
      span: 24
    },
    component: 'RadioGroup',
    value: [],
    componentProps: {
      options: [
        {
          label: t('accountPage.sub10_1'),
          value: '1'
        },
        {
          label: t('accountPage.sub10_2'),
          value: '2'
        }
      ]
    }
  },
  {
    field: 'applicantEmail',
    label: t('auth.email'),
    component: 'Input',
    colProps: {
      span: 24
    }
  },
  {
    field: 'emailVerifyCode',
    label: '  ',
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
                  <ElButton class="w-110px ml-20px" type="primary">
                    {countdown2.value}s
                  </ElButton>
                ) : (
                  <ElButton class="w-110px ml-20px" type="primary" onClick={getCode2}>
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

const countdown2 = ref(0)

const getCode2 = async () => {
  //   const formEl1 = await useForm1.formMethods.getElFormExpose()
  //   const valid1 = await formEl1?.validateField(['applicantEmail']).catch((err) => {
  //     console.log(err)
  //   })
  //   const formData1 = await useForm1.formMethods.getFormData()
  //   if (valid1) {
  //     const res = await verificationCode({
  //       email: formData1.applicantEmail
  //     })
  //     if (res.code == 200) {
  //       countdown2.value = 60
  //       setInterval(() => {
  //         countdown2.value--
  //       }, 1000)
  //     }
  //   }
}

const { formRegister, formMethods } = useForm()
const { setValues, getFormData, getElFormExpose } = formMethods

const { tableRegister, tableState, tableMethods } = useTable({
  fetchDataApi: async () => {
    const { pageSize, currentPage } = tableState
    // const res = await getFieldApi({
    //   pageNum: unref(currentPage),
    //   numPerPage: unref(pageSize),
    //   ...unref(searchParams)
    // })
    return {
      list: [
        {
          ID: '999'
        }
      ]
      // total: res.data.total || 0
    }
  }
})
const { total, loading, dataList, pageSize, currentPage } = tableState
const { getList, getElTableExpose, delList } = tableMethods

const action = (row: any, type: string) => {
  currentRow.value = row
  dialogVisible.value = true
}
const schema = reactive<FormSchema[]>([
  {
    field: 'username',
    label: '',
    component: 'Input',
    componentProps: {
      slots: {
        prepend: () => <div>{t('accountPage.id')}</div>
      }
    }
  }
])

const crudSchemas = reactive<CrudSchema[]>([
  {
    field: 'selection',
    search: {
      hidden: true
    },
    form: {
      hidden: true
    },
    detail: {
      hidden: true
    },
    table: {
      type: 'selection'
    }
  },
  {
    field: 'ID',
    label: t('accountPage.id'),
    search: {
      hidden: true
    }
  },
  {
    field: 'ID',
    label: t('accountPage.money'),
    search: {
      hidden: true
    }
  }
])

const { allSchemas } = useCrudSchemas(crudSchemas)

const delLoading = ref(false)
const ids = ref<string[]>([])
const delData = async (row?: any) => {
  const elTableExpose = await getElTableExpose()
  ids.value = row ? [row.id] : elTableExpose?.getSelectionRows().map((v: any) => v.id) || []
  delLoading.value = true

  await delList(unref(ids).length).finally(() => {
    delLoading.value = false
  })
}
</script>

<style lang="less" scoped>
.subString {
  color: #747474;
  font-size: 14px;
  margin-right: 10px;
}
</style>
