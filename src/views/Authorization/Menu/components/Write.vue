<script setup lang="tsx">
import { Form, FormSchema } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { PropType, reactive, watch, ref, computed, onMounted } from 'vue'
import { useValidator } from '@/hooks/web/useValidator'
import { useI18n } from '@/hooks/web/useI18n'
import { Icon } from '@/components/Icon'
import { IconList } from '@/assets/ts/iconList'
import { ElInput, ElSelect, ElOption } from 'element-plus'
import { ContentWrap } from '@/components/ContentWrap'
import { pathask1, pathask2 } from '@/utils/common'
import { nextTick } from 'process'

const { t } = useI18n()

const { required } = useValidator()

const props = defineProps({
  currentRow: {
    type: Object as PropType<any>,
    default: () => null
  },
  parentList: {
    type: Array<any>,
    default: () => []
  },
  statusList: {
    type: Array<any>,
    default: () => []
  },
  openType: {
    type: String,
    default: ''
  },
  openMenuType: {
    type: String,
    default: ''
  },
  menuList: {
    type: Array<any>,
    default: () => []
  }
})

const inputValue = ref('')

onMounted(() => {
  if (props.openType == 'edit') {
    if (props.currentRow.menuType != 'C' && props.currentRow.menuType != 'B') {
      formMethods.setSchema([
        {
          field: 'menuType',
          path: 'componentProps.disabled',
          value: true
        }
      ])
    }
  } else {
    formMethods.setSchema([
      {
        field: 'menuType',
        path: 'componentProps.disabled',
        value: false
      }
    ])
  }
})

const { formRegister, formMethods } = useForm()
const { setValues, getFormData, getElFormExpose } = formMethods

const ALLmenuTypeList = reactive([
  {
    label: t('common.a1'),
    value: 'D'
  },
  {
    label: t('common.a2'),
    value: 'M'
  },
  {
    label: t('common.a3'),
    value: 'C'
  },
  {
    label: t('common.a4'),
    value: 'B'
  }
])

const isdisable = computed(() => {
  return props.openType == 'add2' ? true : false
})

const menuTypeList = computed(() => {
  if (props.currentRow.menuType == 'C' || props.currentRow.menuType == 'B') {
    return ALLmenuTypeList.slice(2, 4)
  } else {
    return props.openType == 'edit'
      ? ALLmenuTypeList
      : props.openType == 'add1'
        ? ALLmenuTypeList.slice(0, 1)
        : props.openMenuType == 'D'
          ? ALLmenuTypeList.slice(1, 2)
          : props.openMenuType == 'C'
            ? ALLmenuTypeList.slice(3, 4)
            : ALLmenuTypeList.slice(2, 4)
  }
})

const LinkList = reactive([
  {
    label: t('common.a7'),
    value: false
  },
  {
    label: t('common.a6'),
    value: true
  }
])

const baseSchema = reactive<FormSchema[]>([
  {
    field: 'menuType',
    label: t('menu.menuType'),
    colProps: {
      span: 24
    },
    component: 'RadioGroup',
    componentProps: {
      options: menuTypeList,
      on: {
        change: (data: any) => {
          formMethods.setSchema([
            {
              field: 'parentId',
              path: 'remove',
              value: data == 'D' ? true : false
            },
            {
              field: 'component',
              path: 'remove',
              value: data == 'D' || data == 'B' ? true : false
            },
            {
              field: 'permission',
              path: 'remove',
              value: data != 'B' ? true : false
            },
            {
              field: 'icon',
              path: 'remove',
              value: data == 'M' || data == 'B' || data == 'C' ? true : false
            },
            {
              field: 'requestUrl',
              path: 'remove',
              value: data != 'M' && data != 'C' ? true : false
            }
          ])
          rules.path = data == 'B' ? '' : [required()]
        }
      }
    }
  },
  {
    field: 'parentId',
    label: t('menu.parentMenu'),
    colProps: {
      span: 24
    },
    remove: props.currentRow.menuType == 'D' ? true : false,
    // hidden: props.openType == 'add2' && props.currentRow.menuType == 'M' ? true : false,
    component: 'Select',
    componentProps: {
      placeholder: t('project.select'),
      disabled: isdisable,
      props: {
        label: 'title',
        value: 'id'
      },
      options: props.parentList,
      style: {
        width: '100%'
      }
    }
  },
  {
    field: 'icon',
    label: t('menu.menuIcon'),
    colProps: {
      span: 24
    },
    remove:
      props.currentRow.menuType == 'M' ||
        props.currentRow.menuType == 'B' ||
        props.currentRow.menuType == 'C'
        ? true
        : false,
    formItemProps: {
      slots: {
        default: () => {
          const iconclick = async (item: any) => {
            await setValues({
              icon: item.value
            })
            const elElement = await getElFormExpose()
            elElement?.validateField(['icon'])
            inputValue.value = item.value
            iconShow.value = false
          }

          let icon = IconList.map((item) => {
            return (
              <span
                onClick={() => {
                  iconclick(item)
                }}
              >
                <Icon class="mr-5px ml-5px " icon={item.value} size={18}></Icon>
              </span>
            )
          })
          return !inputValue.value ? (
            <>
              <ElInput
                modelValue={inputValue.value}
                onFocus={focus}
                placeholder={t('project.select')}
              ></ElInput>
              {iconShow.value ? (
                <ContentWrap class="absolute top-32px z-999 shadow">{icon}</ContentWrap>
              ) : null}
            </>
          ) : (
            <>
              <span>
                <div onClick={focus} class="w-500px">
                  <Icon class="relative top-3px" icon={inputValue.value} size={20}></Icon>
                </div>
                {iconShow.value ? (
                  <ContentWrap class="absolute top-32px z-999 shadow">{icon}</ContentWrap>
                ) : null}
              </span>
            </>
          )
        }
      }
    }
  },
  {
    field: 'title',
    label: t('menu.menuName'),
    colProps: {
      span: 12
    },
    component: 'Input',
    componentProps: {
      placeholder: t('project.input')
    }
  },
  {
    field: 'link',
    label: t('menu.isLink'),
    colProps: {
      span: 12
    },
    component: 'RadioGroup',
    componentProps: {
      options: LinkList,
      disabled:
        props.currentRow.children &&
          props.currentRow.children.length > 0 &&
          props.openType == 'edit'
          ? true
          : false
    }
  },
  {
    field: 'path',
    label: t('menu.menuUrl'),
    colProps: {
      span: 12
    },
    component: 'Input',
    componentProps: {
      placeholder: t('project.input')
    },
    formItemProps: {
      rules: props.currentRow.menuType == 'B' ? [] : [required()]
    }
  },
  {
    field: 'component',
    label: t('menu.pageAddress'),
    colProps: {
      span: 12
    },
    remove: props.currentRow.menuType == 'D' ? true : false,
    component: 'Input',
    componentProps: {
      placeholder: t('project.input')
    }
  },
  {
    field: 'permission',
    label: t('menu.premission'),
    colProps: {
      span: 12
    },
    remove: props.currentRow.menuType != 'B' ? true : false,
    component: 'Input',
    componentProps: {
      placeholder: t('project.input')
    }
  },
  {
    field: 'unStatus',
    label: t('menu.status'),
    colProps: {
      span: 12
    },
    component: 'RadioGroup',
    componentProps: {
      options: props.statusList
    }
  },
  {
    field: 'requestUrl',
    label: t('common.k'),
    colProps: {
      span: 24
    },
    remove: props.currentRow.menuType != 'M' && props.currentRow.menuType != 'C' ? true : false,
    component: 'Input'
  },
  {
    field: 'sort',
    label: t('menu.menuSort'),
    colProps: {
      span: 12
    },
    hidden: true,
    component: 'Input',
    componentProps: {
      placeholder: t('project.input')
    }
  }
])

const iconShow = ref(false)
const focus = async () => {
  iconShow.value = !iconShow.value
}

const rules = reactive<any>({
  menuType: [required()],
  parentId: [required()],
  // icon: [required()],
  title: [required()],
  // sort: [required()],
  // path: [required()],
  // component: [required()],
  requestUrl: [required()],
  link: [required()],
  unStatus: [required()]
})

const submit = async () => {
  const elForm = await getElFormExpose()
  const valid = await elForm?.validate().catch((err) => {
    console.log(err)
  })
  if (valid) {
    const formData = await getFormData()
    formData.component = formData.component ? formData.component : '#'
    if (props.openType != 'edit') {
      switch (formData.menuType) {
        case 'D':
          formData.path = formData.link ? pathask2(formData.path) : pathask1(formData.path)
          formData.sort = Number(props.menuList[props.menuList.length - 1].sort) + 1 + ''
          formData.parentId = props.currentRow.parentId
          break
        default:
          formData.sort = props.currentRow.sort
          if (formData.children.length > 0) {
            let sort = Number(formData.children[formData.children.length - 1].sort) + 1 + ''
            formData.sort = sort
            // formData.sort = sort.length == 3 || sort.length == 5 ? '0' + sort : sort
          } else {
            formData.sort = formData.sort + '01'
          }
          break
      }
    }
    // console.log(formData)
    return formData
  }
}

watch(
  () => props.currentRow,
  (currentRow) => {
    if (!currentRow) return
    inputValue.value = currentRow.icon
  },
  {
    deep: true,
    immediate: true
  }
)

defineExpose({
  submit
})
</script>

<template>
  <Form class="menuSchema" :rules="rules" :model="currentRow" @register="formRegister" :schema="baseSchema" />
</template>
<style lang="less">
.iconPop.el-select__popper {
  max-width: var(--el-dialog-width, 37.5%);

  .el-select-dropdown.iconPop {
    min-width: 100% !important;
  }

  ul.el-scrollbar__view.el-select-dropdown__list {
    display: flex;
    flex-wrap: wrap;

    .el-select-dropdown__item {
      padding: 0 10px 0 10px;
    }
  }
}

.shadow {
  box-shadow: 0px 0px 30px 0px rgba(0, 0, 0, 0.16);
}
</style>
