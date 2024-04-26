<script setup lang="tsx">
import { Form, FormSchema, SelectOption } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { ref, PropType, reactive, watch } from 'vue'
import { useValidator } from '@/hooks/web/useValidator'
import { useI18n } from '@/hooks/web/useI18n'
import { ElButton, ElInput, ElMessage, ElCascader, ElSelect } from 'element-plus'
import { Icon } from '@/components/Icon'
import { cloneDeep } from 'lodash-es'
import { onMounted } from 'vue'

const { required } = useValidator()
const { t } = useI18n()

const props = defineProps({
  currentRow: {
    type: Object as PropType<any>,
    default: () => null
  },
  inputTypeEnum: {
    type: Object as PropType<any>,
    default: () => null
  },
  attrTypeEnum: {
    type: Object as PropType<any>,
    default: () => null
  },
  requiredEnum: {
    type: Object as PropType<any>,
    default: () => null
  },
  options: {
    type: Object as PropType<any>,
    default: () => null
  }
})

const attributeValue = ref('')
let tagList = ref([])

let oldCategoryIds: any = []
const handleCaseder = async (val) => {
  let tempArr = cloneDeep(val)
  let checkArr: any = null
  let type = ''

  if (tempArr.length == 0 && oldCategoryIds.length - tempArr.length > 1) {
    categoryOptions.value.forEach((a) => {
      a.disabled = false
      if (a.children) {
        a.children.forEach((b) => {
          b.disabled = false
          if (b.children) {
            b.children.forEach((c) => {
              c.disabled = false
            })
          }
        })
      }
    })
    oldCategoryIds = []
    await setValues({
      categoryIds: oldCategoryIds
    })
    return
  }
  if (oldCategoryIds.length < tempArr.length) {
    type = 'add'
    for (const a of tempArr) {
      let flag = true
      let str1 = a.join(',')
      for (const b of oldCategoryIds) {
        let str2 = b.join(',')
        if (str1 == str2) {
          flag = false
          break
        }
      }
      if (flag) {
        checkArr = a
        break
      }
    }
  } else if (oldCategoryIds.length > tempArr.length) {
    type = 'decline'
    for (const a of oldCategoryIds) {
      let flag = true
      let str1 = a.join(',')
      for (const b of tempArr) {
        let str2 = b.join(',')
        if (str1 == str2) {
          flag = false
          break
        }
      }
      if (flag) {
        checkArr = a
        break
      }
    }
  }
  if (checkArr && checkArr[0] == '0') {
    let arr: any = []
    for (const a of categoryOptions.value) {
      if (a.id == '0') {
        continue
      }
      let aArr: any = []
      aArr[0] = a.id
      arr.push([...aArr])
      a.disabled = type == 'add' ? true : false
      if (a.children) {
        for (const b of a.children) {
          aArr = [aArr[0]]
          aArr[1] = b.id
          arr.push([...aArr])
          b.disabled = type == 'add' ? true : false
          if (b.children) {
            for (const c of b.children) {
              aArr[2] = c.id
              arr.push([...aArr])
              c.disabled = type == 'add' ? true : false
            }
          }
        }
      }
    }
    if (type == 'add') {
      oldCategoryIds = val.concat(arr)
      await setValues({
        categoryIds: oldCategoryIds
      })
    } else if (type == 'decline') {
      oldCategoryIds = []
      await setValues({
        categoryIds: oldCategoryIds
      })
    }
  } else if (checkArr && checkArr.length < 3) {
    let linArr = findMoreOrDecline(checkArr, type)
    if (type == 'add') {
      oldCategoryIds = val.concat(linArr)
      await setValues({
        categoryIds: oldCategoryIds
      })
    } else if (type == 'decline') {
      let lastArr: any = []
      for (const a of val) {
        let flag = true
        for (const b of linArr) {
          if (a.length == b.length) {
            if (a.length == 1 && a[0] == b[0]) {
              flag = false
              break
            } else if (a.length == 2 && a[0] == b[0] && a[1] == b[1]) {
              flag = false
              break
            } else if (a.length == 3 && a[0] == b[0] && a[1] == b[1] && a[2] == b[2]) {
              flag = false
              break
            }
          }
        }
        if (flag) {
          lastArr.push(a)
        }
      }
      oldCategoryIds = lastArr
      await setValues({
        categoryIds: oldCategoryIds
      })
    }
  } else {
    oldCategoryIds = cloneDeep(val)
  }
}
const categoryOptions = ref<any>([])
const formSchema = reactive<FormSchema[]>([
  {
    field: 'attrName',
    label: t('CategoryAttribute.attclass'),
    component: 'Input',
    componentProps: {
      maxlength: 20,
      showWordLimit: true
    }
  },
  {
    field: 'attrValue',
    label: t('CategoryAttribute.attvalue'),
    formItemProps: {
      slots: {
        default: () => {
          let tag = tagList.value.map((item: any, index) => {
            return (
              <>
                <div class="flex-c mt-20px mr-20px tag1">
                  <div class="mr-15px color-colorGray">{item.label}</div>
                  <div onClick={() => deltag(index)} class="cursor-pointer">
                    <Icon icon="ep:circle-close-filled" size={15} color="#C7C7C7"></Icon>
                  </div>
                </div>
              </>
            )
          })
          return (
            <>
              <div class="flex-cb w-100%">
                <div style="width:95%">
                  <ElInput
                    class="!w-100%"
                    v-model={attributeValue.value}
                    placeholder={t('project.input')}
                  ></ElInput>
                </div>
                <ElButton class="w-70px ml-10px" type="primary" onClick={() => addtag()}>
                  {t('project.add')}
                </ElButton>
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
    field: 'categoryIds',
    label: t('CategoryAttribute.categoryName'),
    component: 'Cascader',
    colProps: {
      span: 24
    },
    formItemProps: {
      slots: {
        default: (data) => {
          return (
            // checkStrictly: true,

            <ElCascader
              props={{
                multiple: true,
                value: 'id',
                label: 'categoryName',
                checkStrictly: true
              }}
              collapseTags={true}
              class="w-100%"
              clearable
              onChange={(val) => {
                handleCaseder(val)
              }}
              options={categoryOptions.value}
              v-model={data.categoryIds}
            />
          )
        }
      }
    }
  },
  {
    field: 'inputType',
    label: t('CategoryAttribute.attInputType'),
    component: 'Select',
    componentProps: {
      style: {
        width: '100%'
      },
      options: props.inputTypeEnum,
      on: {
        change: () => {
          console.log('1222')
        }
      }
    }
  },
  {
    field: 'required',
    label: t('CategoryAttribute.isMandatory'),
    component: 'RadioGroup',
    componentProps: {
      options: props.requiredEnum
    }
  }
])

const rules = reactive({
  attrName: [required()],
  attributeValue: [required()],
  categoryIds: [required()],
  attrType: [required()],
  inputType: [required()],
  required: [required()]
})

const addtag = async () => {
  if (!attributeValue.value) {
    ElMessage.error(t('CategoryAttribute.attvaluetips'))
    return
  }
  tagList.value.push({
    label: attributeValue.value
  })
  attributeValue.value = ''
}

const deltag = async (index: any) => {
  console.log(index)
  console.log(tagList)
  tagList.value.splice(index, 1)
}

const { formRegister, formMethods } = useForm()
const { setValues, getFormData, getElFormExpose } = formMethods

const submit = async () => {
  const elForm = await getElFormExpose()
  const valid = await elForm?.validate().catch((err) => {
    console.log(err)
  })
  if (valid) {
    const formData = await getFormData()
    let str = []
    tagList.value.forEach((item) => str.push(item.label))
    formData.attrValue = str + ''
    formData.categoryIds = formData.categoryIds.map((item) => {
      return item[item.length - 1]
    })
    let attrCategoryList: any = []

    categoryOptions.value.forEach((a) => {
      if (a.disabled) {
        let obj = {
          categoryId: a.id,
          relType: 'COMMON'
        }
        attrCategoryList.push(obj)
      } else if (formData.categoryIds.indexOf(a.id) != -1) {
        let obj = {
          categoryId: a.id,
          relType: 'CATEGORY'
        }
        attrCategoryList.push(obj)
      }
      if (a.children) {
        a.children.forEach((b) => {
          if (b.disabled) {
            let obj = {
              categoryId: b.id,
              relType: 'COMMON'
            }
            attrCategoryList.push(obj)
          } else if (formData.categoryIds.indexOf(b.id) != -1) {
            let obj = {
              categoryId: b.id,
              relType: 'CATEGORY'
            }
            attrCategoryList.push(obj)
          }
          if (b.children) {
            b.children.forEach((c) => {
              if (c.disabled) {
                let obj = {
                  categoryId: c.id,
                  relType: 'COMMON'
                }
                attrCategoryList.push(obj)
              } else if (formData.categoryIds.indexOf(c.id) != -1) {
                let obj = {
                  categoryId: c.id,
                  relType: 'CATEGORY'
                }
                attrCategoryList.push(obj)
              }
            })
          }
        })
      }
    })
    formData.attrCategoryList = attrCategoryList
    // console.log(attrCategoryList, '发等哈时间回家')
    // return null
    // let arr = []
    // if (formData.categoryId) {
    //   formData.categoryId.map((item) => {
    //     arr.push(item[item.length - 1])
    //   })
    // }

    // formData.categoryIds = arr

    return formData
  }
}

//递归获取选中的options
function getSelect(arr: any, menuList: any) {
  let allArr: Array<any> = []
  function RcursiveList(obj: any, tempArr: any) {
    if (obj.children && obj.children.length > 0) {
      tempArr.push(obj.id)
      if (arr.indexOf(obj.id) != -1) {
        allArr.push([...tempArr])
      }
      obj.children.forEach((item: any) => {
        RcursiveList(item, [...tempArr])
      })
    } else {
      if (arr.indexOf(obj.id) != -1) {
        tempArr.push(obj.id)
        allArr.push(tempArr)
      }

    }
  }
  menuList.forEach((item: any) => {
    let tempArr = []
    RcursiveList(item, tempArr)
  })
  return allArr
}

watch(
  () => props.currentRow,
  async (currentRow) => {
    if (!currentRow) return
    if (currentRow.attrValue) {
      let temp = currentRow.attrValue.split(',')
      let arr = []
      for (let key in temp) {
        arr.push({
          label: temp[key]
        })
      }
      tagList.value = arr
    }
    currentRow.categoryIds = !currentRow.categoryIds ? [] : currentRow.categoryIds
    oldCategoryIds = getSelect(currentRow.categoryIds, props.options)
    if (currentRow.categoryIds) {
      await setValues({ categoryIds: oldCategoryIds })
    }
  },
  {
    deep: true,
    immediate: true
  }
)
onMounted(() => {
  handelOptions(props.options)
})
//处理类目数据
const handelOptions = (arr) => {
  let tempArr = cloneDeep(arr)
  let count = 0
  if (!props.currentRow.categoryIds) {
    categoryOptions.value = tempArr
    return
  }
  let allLen = props.currentRow.categoryIds.length
  if (allLen == 0) {
    categoryOptions.value = tempArr
    return
  }
  let firstFlag: any = null
  if (props.currentRow.categoryIds.indexOf('0') != -1) {
    firstFlag = true
    count++
  } else {
    firstFlag = false
  }
  for (const a of tempArr) {
    a.disabled = a.id == '0' ? false : firstFlag
    let secondFlag: any = null
    if (props.currentRow.categoryIds.indexOf(a.id) != -1) {
      secondFlag = true
      count++
    } else {
      secondFlag = false
    }
    if (a.children && a.children.length > 0) {
      for (const b of a.children) {
        b.disabled = secondFlag || firstFlag
        let thirdFlag: any = null
        if (props.currentRow.categoryIds.indexOf(b.id) != -1) {
          thirdFlag = true
          count++
        } else {
          thirdFlag = false
        }
        if (b.children && b.children.length > 0) {
          for (const c of b.children) {
            c.disabled = firstFlag || secondFlag || thirdFlag
            if (props.currentRow.categoryIds.indexOf(c.id) != -1) {
              count++
            }
          }
        }
      }
    }

    if (count == allLen && props.currentRow.categoryIds.indexOf('0') == -1) {
      break
    }
  }

  categoryOptions.value = tempArr
}

//找到新增或删除的东西的东西
const findMoreOrDecline = (ids, type) => {
  let tempArr: any = []
  for (const a of categoryOptions.value) {
    let arr: any = []
    if (ids.length == 1 && ids[0] == a.id) {
      arr[0] = a.id
      if (a.children) {
        for (const b of a.children) {
          arr = [arr[0]]
          arr[1] = b.id
          tempArr.push([...arr])
          b.disabled = type == 'add' ? true : false
          if (b.children) {
            for (const c of b.children) {
              arr[2] = c.id
              c.disabled = type == 'add' ? true : false
              tempArr.push([...arr])
            }
          }
        }
      }

      break
    } else if (ids.length == 2 && ids[0] == a.id) {
      arr[0] = a.id
      if (a.children) {
        for (const b of a.children) {
          if (b.id == ids[1]) {
            arr = [arr[0]]
            arr[1] = b.id
            if (b.children) {
              for (const c of b.children) {
                arr[2] = c.id
                tempArr.push([...arr])
                c.disabled = type == 'add' ? true : false
              }
            }
            break
          }
        }
      }

      break
    }
  }
  return tempArr
}
defineExpose({
  submit,
  formMethods
})
</script>

<template>
  <Form
    :rules="rules"
    :model="currentRow"
    @register="formRegister"
    :schema="formSchema"
    :isCol="false"
  />
</template>
