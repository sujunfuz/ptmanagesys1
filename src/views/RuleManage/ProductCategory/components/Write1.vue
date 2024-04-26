<script setup lang="tsx">
import { Form, FormSchema } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { ref, reactive, watch, onMounted } from 'vue'
import { useValidator } from '@/hooks/web/useValidator'
import { useI18n } from '@/hooks/web/useI18n'
import { ElButton, ElCheckbox, ElCascader } from 'element-plus'
import { Icon } from '@/components/Icon'
import { Dialog } from '@/components/Dialog'
import { Search } from '@/components/Search'
import UploadImage from '@/components/UploadImage/UploadImage.vue'
import { getTree, getAttr } from '@/api/RuleManage/ProductCategory'
import FieldConfig from '@/views/Authorization/Menu/components/fieldConfig.vue'
import Empty from '@/components/customComponents/Empty/index.vue'

const { required, validC } = useValidator()
const { t } = useI18n()

const { formRegister, formMethods } = useForm()
const { setValues, getFormData, getElFormExpose } = formMethods

const props = defineProps({
  categoryType: {
    type: Number,
    default: 1
  },
  clickId: {
    type: String,
    default: '0'
  },
  clickList: {
    type: Array,
    default: () => []
  },
  statusEnum: {
    type: Array,
    default: () => []
  },
  commonList: {
    type: Array,
    default: () => []
  },
  editItem: {
    type: Object,
    default: () => {}
  },
  openType: {
    type: String,
    default: ''
  }
})

onMounted(() => {
  if (props.openType == 'add') {
    formMethods.setValues({
      status: 'ENABLE'
    })
  }
})

const categoryTreeList = ref<any>([])
// const selList = ref<any>([])
const attrList = ref<any>([])
const selIds = ref<any>([])
const tagList = ref<any>([])

const validatField = async (arr) => {
  const formEl = await formMethods.getElFormExpose()
  await formEl?.validateField(arr)
}
const formSchema = reactive<FormSchema[]>([
  {
    field: 'categoryName',
    label: t('productcategory.form1'),
    component: 'Input',
    colProps: {
      span: 24
    },
    componentProps: {
      maxlength: 20,
      showWordLimit: true
    }
  },
  {
    field: 'parentId',
    label: t('productcategory.form4'),
    component: 'Select',
    remove: props.categoryType == 1 ? true : false,
    colProps: {
      span: 24
    },
    componentProps: {
      disabled: true,
      style: {
        width: '100%'
      },
      options: props.clickList,
      placeholder: t('project.select'),
      props: {
        label: 'categoryName',
        value: 'id'
      }
    }
  },
  {
    field: 'goodsIcon',
    label: t('productcategory.img1'),
    colProps: {
      span: 12
    },
    formItemProps: {
      slots: {
        default: (data) => {
          return (
            <div class="flex flex-col">
              <UploadImage
                onUpdateImgUrl={(val) => {
                  data.goodsIcon = val
                  validatField(['goodsIcon'])
                }}
                v-model={goodsIcon.value}
              ></UploadImage>
              <div class="font-size-12px color-colorGray text-nowrap">{t('common.a40')}</div>
            </div>
          )
        }
      }
    }
  },
  {
    field: 'factoryIcon',
    label: t('productcategory.img2'),
    remove: props.categoryType != 1 ? true : false,
    colProps: {
      span: 12
    },
    formItemProps: {
      slots: {
        default: (data) => {
          return (
            <>
              <UploadImage
                v-model={factoryIcon.value}
                onUpdateImgUrl={(val) => {
                  data.factoryIcon = val
                  validatField(['factoryIcon'])
                }}
              ></UploadImage>
            </>
          )
        }
      }
    }
  },
  {
    field: 'attrIds',
    label: t('productcategory.form2'),
    colProps: {
      span: 24
    },
    formItemProps: {
      slots: {
        default: () => {
          let tag = attrList.value.map((item: any) => {
            return (
              <>
                {item.attrType == 'COMMON' ? (
                  <div class="flex-c mt-10px mr-20px tag1">{item.attrName}</div>
                ) : (
                  <div class="flex-c mt-10px mr-20px tag2">{item.attrName}</div>
                )}
              </>
            )
          })
          return (
            <>
              <div class="flex-c w-100%" onClick={openatt}>
                <Icon icon="ep:plus" size={15} color={'var(--el-color-primary)'} />
                <div class="colorMain">{t('productcategory.addAtt')}</div>
              </div>
              <div>
                <div class="flex-c flex-wrap">{tag}</div>
              </div>
            </>
          )
        }
      }
    }
  },
  {
    field: 'status',
    label: t('project.status'),
    component: 'RadioGroup',
    colProps: {
      span: 24
    },
    componentProps: {
      options: props.statusEnum
    }
  }
])

const goodsIcon = ref<any>([])
const factoryIcon = ref<any>([])

const rules = reactive({
  categoryName: [required(), validC()],
  status: [required()],
  parentId: [required()],
  goodsIcon: [required()],
  factoryIcon: [required()]
})
const searchSchema = reactive<FormSchema[]>([
  {
    field: 'attrName',
    component: 'Input',
    componentProps: {
      slots: {
        prefix: () => <div>{t('productcategory.form3')}</div>
      }
    }
  },
  {
    field: 'categoryId',
    formItemProps: {
      slots: {
        default: (data) => {
          return (
            <>
              <div
                class={[
                  'w-280px',
                  'flex-c',
                  'border-rd-4px',
                  'specialInput',
                  'border-(#dcdfe6 solid 1px )'
                ]}
              >
                <div class="color-#b0b4b7 w-70px text-center ml-10px">
                  {t('productcategory.form1')}
                </div>
                <div style="background-color: #dcdfe6;width: 0.5px;height: 23px;margin-left: 10px;"></div>
                <ElCascader
                  clearable
                  v-model={data.cascader}
                  options={categoryTreeList.value}
                  props={{
                    value: 'id',
                    label: 'categoryName'
                  }}
                  show-all-levels={false}
                  class="ml-1px"
                />
              </div>
            </>
          )
        }
      }
    }
  }
])

const checkedAll = ref(false)

const dialog = ref(false)

const setSearchParams = async (params: any) => {
  const formData = await getFormData()
  let obj: any = {
    parentId: formData.parentId
  }
  if (params.cascader) {
    obj.categoryId = params.cascader[params.cascader.length - 1]
  }
  const res = await getAttr(Object.assign(params, obj))
  if (res.code == 200) {
    // console.log(t)
    tagList.value = res.data
    if (tagList.value.length == 0) return
    tagList.value.forEach((e: any) => {
      e.ischeck = false
      selIds.value.forEach((it: any) => {
        if (e.id == it.id) {
          e.ischeck = true
        }
      })
    })
  }
}

const openatt = async () => {
  const res = await getTree({
    deep: props.categoryType
  })
  selIds.value = []
  attrList.value.forEach((e: any) => {
    if (e.attrType != 'COMMON') {
      // selIds.value.push(e.id)
      selIds.value.push(e)
    }
  })
  if (res.code == 200) {
    categoryTreeList.value = res.data
    setSearchParams({})
    dialog.value = true
  }
}

const tagClick = (item: any) => {
  if (item.attrType == 'COMMON') return
  item.ischeck = !item.ischeck
  if (item.ischeck) {
    selIds.value = [...selIds.value, item]
  } else {
    selIds.value = selIds.value.filter((e) => e.id != item.id)
  }
  let arr = tagList.value.filter((it: any) => it.ischeck || it.attrType == 'COMMON')
  checkedAll.value = arr.length == tagList.value.length
}

const tagAll = (e: any) => {
  let tempArr: any = []
  tagList.value.forEach((it: any) => {
    if (it.attrType != 'COMMON' && it.ischeck != e) {
      it.ischeck = e
      tempArr.push(it)
    }
  })
  if (!e) {
    selIds.value = selIds.value.filter((item) => {
      for (const a of tempArr) {
        if (a.id == item.id) {
          return false
        }
      }
      return true
    })
  } else {
    selIds.value = [...selIds.value, ...tempArr]
  }
}

const submit = async () => {
  const elForm = await getElFormExpose()
  const valid = await elForm?.validate().catch((err) => {
    console.log(err)
  })
  if (valid) {
    const formData = await getFormData()
    return formData
  }
}

const getattrIds = (list: any) => {
  if (list.length == 0) return []
  let arr: any = []
  list.forEach((e: any) =>
    arr.push({
      attrId: e.id,
      relType: e.attrType
    })
  )
  return arr
}

const saveLoading = ref(false)
const save = async () => {
  saveLoading.value = true
  // selList.value = []
  // if (tagList.value.length > 0) {
  //   tagList.value.forEach((e: any) => {
  //     //|| e.attrType == 'COMMON'
  //     if (e.ischeck) {
  //       selList.value.push(e)
  //     }
  //   })
  // }
  // let tempArr: any = []
  // props.commonList.concat(selList.value)
  // for (const aitem of selList.value) {
  //   let flag = true
  //   for (const item of props.commonList as any) {
  //     if (aitem.id == item.id) {
  //       flag = false
  //       break
  //     }
  //   }
  //   if (flag) {
  //     tempArr.push(aitem)
  //   }
  // }
  // attrList.value = props.commonList.concat(tempArr)
  // console.log(selIds.value, 'jfkjdk')
  let tempArr: any = []
  for (const item of props.commonList as any) {
    if (item.attrType == 'COMMON') {
      tempArr.push(item)
    }
  }
  attrList.value = tempArr.concat(selIds.value)
  let arr = getattrIds(attrList.value)
  formMethods.setValues({
    attrIds: arr
  })
  saveLoading.value = false
  dialog.value = false
}

attrList.value = props.commonList
let attrIds = getattrIds(attrList.value)

// onMounted(() => {
formMethods.setValues({
  categoryName: props.openType == 'edit' ? props.editItem.categoryName : '',
  parentId: props.openType == 'edit' ? props.editItem.parentId : props.clickId,
  attrIds: attrIds,
  status: props.openType == 'edit' ? props.editItem.status : '',
  goodsIcon: props.openType == 'edit' ? props.editItem.goodsIcon : '',
  factoryIcon: props.openType == 'edit' ? props.editItem.factoryIcon : ''
})
if (props.openType == 'edit') {
  let obj1: any = {
    url: props.editItem.goodsIcon
  }
  let obj2: any = {
    url: props.editItem.factoryIcon
  }
  goodsIcon.value[0] = obj1
  factoryIcon.value[0] = obj2
}

defineExpose({
  submit,
  formMethods
})
</script>

<template>
  <Form :rules="rules" @register="formRegister" :schema="formSchema" />
  <Dialog v-model="dialog" :title="t('productcategory.addAtt')">
    <Search :schema="searchSchema" @search="setSearchParams" :showReset="false" />
    <div v-if="tagList.length">
      <ElCheckbox v-model="checkedAll" :label="t('project.all')" size="large" @change="tagAll" />
      <div>
        <div class="flex-c flex-wrap">
          <div
            v-for="(item, index) in tagList"
            :key="index"
            class="mt-10px mr-20px pt-5px pb-5px"
            :class="item.attrType == 'COMMON' ? 'tag1' : item.ischeck ? 'tag3' : 'tag2'"
            @click="tagClick(item)"
            >{{ item.attrName }}</div
          >
        </div>
      </div>
    </div>
    <Empty v-else />

    <template #footer>
      <ElButton type="primary" :loading="saveLoading" @click="save">
        {{ t('project.confirm') }}
      </ElButton>
    </template>
  </Dialog>
</template>
