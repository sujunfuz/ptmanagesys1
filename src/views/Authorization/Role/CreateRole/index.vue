<template>
  <div class="w-100% bg-white flex-1 relative flex justify-between">
    <!-- 左边 -->
    <div class="customW40 relative overflow-hidden">
      <div v-if="!stepFlag" class="absolute left-0px right-0px top-0px bottom-0px z-1000 cursor-not-allowed"
        style="background-color: transparent;"></div>
      <div class="pa-20px pl-30px">
        <div class="font-bold font-size-24px ml-14px mb-20px">{{ t('Freight.info') }}</div>
        <Form :schema="roleSchema" @register="roleRegister" />
      </div>
      <div class="flex justify-end">
        <ElButton plain class="mt-20px mr-30px" v-show="stepFlag" @click="nextStep">{{ t('common.nextLabel') }}</ElButton>
      </div>
    </div>
    <!-- 右边 -->
    <div class="customW60 relative overflow-hidden">
      <div v-if="stepFlag" class="absolute z-1000 left-0px right-0px top-0px bottom-0px z-1000 cursor-not-allowed"
        style="background-color: transparent;"></div>
      <div class="pa-20px">
        <div class="font-bold font-size-24px ml-14px mb-20px">{{ t('menu.fieldConfig') }}</div>
        <Table class="mt-20px" height="600px" :columns="fieldColumns" :data="fieldList" :loading="fieldLoading" />
      </div>
      <!-- 底部 -->
      <div class="absolute bottom-0px w-100% flex justify-end">
        <!-- <ElButton plain class="mb-20px"  @click="push('/authorization/role')">{{ t('common.back') }}</ElButton> -->
        <ElButton v-show="!stepFlag" plain class="mb-20px" @click="nextStep">{{ t('common.prevLabel') }}</ElButton>
        <ElButton v-show="!stepFlag" type="primary" :loading="saveLoading" :disabled="stepFlag" class="mb-20px mr-20px"
          @click="save">{{ t('project.confirm') }}</ElButton>
      </div>
    </div>

  </div>
  <Dialog @close="closeFieldDialog" v-model="showFieldVisible" :title="t('role.allocateField')">
    <Form @register="fieldRegister" :schema="realFieldSchema" :isCol="false" />
    <template #footer>
      <el-button @click="closeFieldDialog">{{ t('exampleDemo.cancel') }}</el-button>
      <ElButton type="primary" @click="saveRoleMenuColumn">{{ t('project.confirm') }}</ElButton>
    </template>
  </Dialog>
</template>
<script setup lang="tsx">
import { reactive, ref, onMounted, nextTick } from 'vue'
import { FormSchema, Form } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { useValidator } from '@/hooks/web/useValidator'
import { useI18n } from '@/hooks/web/useI18n'
import SelectMenu from '../components/SelectMenu.vue'
import { useAppStore } from '@/store/modules/app'
import { getRolePageTopApi, getAssignMenuUIApi, getMenuColumnListApi, addRoleApi, editRoleApi } from '@/api/authorization/roleApi'
import {  cloneDeep } from 'lodash-es'
import { useRouter } from 'vue-router'
import { ElButton, ElCheckbox, ElMessage, ElCheckboxGroup } from 'element-plus'
import { Table, TableColumn } from '@/components/Table'
import { Dialog } from '@/components/Dialog'
import { useTagsViewStore } from '@/store/modules/tagsView'
const tagsViewStore = useTagsViewStore()

const appStore = useAppStore()
appStore.setRenderLoading(true)
const { t } = useI18n()
const { currentRoute, push } = useRouter()
const { required, validD, lengthRange } = useValidator()
const { formRegister: roleRegister, formMethods: roleMethods } = useForm()

//各种静态的枚举值
const statusEnum = ref()
const isMerchantEnum = ref()
const menuTreeEnum = ref()
const warehouseEnum = ref<any>([])
const roleId = ref('')//记录编辑时的roleId
const roleType = ref<any>('')//用于判断编辑还是新增
const saveLoading = ref(false)

//校验菜单配置不可为空
let timer: any = null
const menuAllocateValidator = {
  validator: (_, value, callback) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      if (allCategoryId.length > 0) {
        callback()
      }
      callback(new Error(t('common.required')))
    }, 200)
  },
  trigger: 'change'
}
//表单样式
const roleSchema = reactive<FormSchema[]>([
  {
    field: 'roleName',
    label: t('role.roleName'),
    component: 'Input',
    componentProps: {
      placeholder: t('exampleDemo.input') + t('role.roleName'),
      maxlength: 30
    },
    colProps: {
      span: 24
    },
    formItemProps: {
      rules: [
        required(t('project.input') + t('role.roleName')),
        lengthRange({ min: 2, max: 30 }),
        validD()
      ],
      style: {
        width: '100%'
      }
    }
  },
  {
    field: 'userType',
    label: t('role.txt1'),
    component: 'RadioGroup',
    colProps: {
      span: 12
    },
    value: 'MERCHANT',
    componentProps: {
      options: isMerchantEnum
    },
    formItemProps: {
      rules: [required()]
    }
  },
  {
    field: 'unStatus',
    label: t('fields.status'),
    component: 'RadioGroup',
    colProps: {
      span: 12
    },
    value: 'STATUS_0_0_0_0',
    componentProps: {
      options: statusEnum
    },
    formItemProps: {
      rules: [required()]
    }
  },
  {
    field: 'remark',
    label: t('role.roleDescript'),
    component: 'Input',
    colProps: {
      span: 24
    },
    componentProps: {
      type: 'textarea',
      rows: 4,
      placeholder: t('exampleDemo.maxInput') + 50 + t('exampleDemo.word'),
      maxlength: 50,
      showWordLimit: true
    },
    formItemProps: {
      style: {
        width: '100%'
      }
    }
  },
  {
    field: 'menuIds',
    label: t('role.menuConfigure'),
    colProps: {
      span: 24
    },
    formItemProps: {
      style: {
        width: '100%'
      },
      rules: [required(), menuAllocateValidator],
      slots: {
        default: (data) => {
          return (
            <div class="w-100% border-( 1px #dcdfe6 solid rd-4px) flex-c flex-wrap pa-2px min-h-255px box-border">
              {data.menuIds
                ? menuTreeEnum.value.map((item, index) => {
                  return (
                    <>
                      <SelectMenu
                        class="ml-30px selectBlock"
                        onUpdate:selectData={(val) => {
                          data.menuIds[index] = val
                        }}
                        onUpdateCategory={(id, val) => {
                          updateAllCategory(id, val)
                        }}
                        selectData={data.menuIds[index]}
                        options={item}
                        key={item.id}
                      ></SelectMenu>
                    </>
                  )
                })
                : ''}
            </div>
          )
        }
      }
    }
  }
])

//递归获取选中的options并配置全选选项
function getSelect(arr: any, menuList: any) {
  let allArr: any = []
  function RcursiveList(obj: any, tempArr: any, initObj: any) {
    if (obj.children && obj.children.length > 0) {
      tempArr.push(obj.id)
      obj.children.forEach((item: any) => {
        RcursiveList(item, [...tempArr], initObj)
      })
    } else {
      tempArr.push(obj.id)
      if (arr.indexOf(obj.id) != -1) {
        allArr.push([...tempArr])
      }
      if (!initObj.allCheckedArr) {
        initObj.allCheckedArr = []
      }
      tempArr.shift()
      initObj.allCheckedArr.push(tempArr)
    }
  }
  menuList.forEach((item: any) => {
    let tempArr = []
    RcursiveList(item, tempArr, item)
  })
  return allArr
}
//记录目录的选择
let allCategoryId: any = []
const updateAllCategory = (id, val) => {
  let tempArr = allCategoryId.filter((item) => item != id)
  if (val) {
    tempArr.push(id)
    allCategoryId = tempArr
  } else {

    allCategoryId = tempArr
  }
}

//类型为编辑时,获取已选择的菜单和仓库
const getEditRole = async () => {
  const res = await getAssignMenuUIApi({
    id: roleId.value
  })
  let allArr = getSelect(res.data.selfMenuIds, menuTreeEnum.value)
  let tempArr: Array<any> = []
  for (let i = 0; i < menuTreeEnum.value.length; i++) {
    tempArr[i] = []
    for (let j = 0; j < allArr.length; j++) {
      if (menuTreeEnum.value[i].id == allArr[j][0]) {
        let aTempArr = allArr[j]
        if (aTempArr.length > 1) {
          aTempArr.shift()
        }
        tempArr[i].push(aTempArr)
      }
    }
  }
  nextTick(async () => {

    await roleMethods.setValues({
      menuIds: tempArr,
      remark: res.data.remark,
      roleName: res.data.roleName,
      userType: res.data.userType,
      unStatus: res.data.unStatus
    })
    // await judgeSelect()
  })
}
//初始化函数获取静态枚举值
const init = async () => {
  const res = await getRolePageTopApi()
  if (!res) {
    return
  }

  statusEnum.value = res.data.status
  isMerchantEnum.value = res.data.isMerchant
  menuTreeEnum.value = res.data.menuList
  warehouseEnum.value = res.data.warehouse
  // addressMenuTree()
  if (!currentRoute.value.query.type) {
    ElMessage.warning(t('role.txt4'))
    tagsViewStore.delView(currentRoute.value)
    push('/authorization/role')
    return
  }
  roleType.value = currentRoute.value.query.type
  if (currentRoute.value.query.type == 'add') {
    getSelect([], menuTreeEnum.value)
    nextTick(async () => {
      let len = menuTreeEnum.value.length
      let tempArr: Array<any> = []
      for (let i = 0; i < len; i++) {
        tempArr[i] = []
      }
      await roleMethods.setValues({
        menuIds: tempArr
      })
    })
    appStore.setRenderLoading(false)
  } else if (currentRoute.value.query.type == 'edit') {
    if (!currentRoute.value.query.id) {
      ElMessage.warning(t('role.txt4'))
      tagsViewStore.delView(currentRoute.value)
      push('/authorization/role')
      return
    }
    roleId.value = currentRoute.value.query.id as string
    getEditRole()
    appStore.setRenderLoading(false)

  }
}
onMounted(() => {
  init()
})

//点击下一步，或上一步代码
// stepFlag 为true时是第一步，为false是第二步
const stepFlag = ref(true)
const nextStep = async () => {
  if (stepFlag.value) {
    const elForm = await roleMethods.getElFormExpose()
    let valid = await elForm?.validate()
    if (valid) {
      let val = await roleMethods.getFormData()
      val = cloneDeep(val)
      let tempObj = { ...val }
      let menuIds: any = []
      tempObj.menuIds.forEach((a) => {
        if (a.length > 0) {
          a.forEach((b) => {
            b.forEach((c) => {
              if (menuIds.indexOf(c) == -1) {
                menuIds.push(c)
              }
            })
          })
        }
      })
      allCategoryId.forEach((val) => {
        menuIds.push(val)
      })
      // return
      const res = await getMenuColumnListApi({ roleId: roleId.value, menuIds: menuIds })
      if (res) {
        fieldList.value = res.data
        stepFlag.value = false
      }
    }
  } else {
    // return
    stepFlag.value = true
  }
}

//右边表格
const fieldList = ref<any>([])
const fieldLoading = ref(false)
let currentFieldRow: any = {}
const fieldColumns = reactive<TableColumn[]>([
  {
    field: 'title',
    label: t('menu.menuName'),
    headerAlign: 'center',
    align: 'center'
  },
  {
    field: 'fieldCount',
    label: t('role.fieldCount'),
    headerAlign: 'center',
    align: 'center'
  },
  {
    field: 'assignedField',
    label: t('role.txt2'),
    headerAlign: 'center',
    align: 'center'
  },
  {
    field: 'operate',
    label: t('exampleDemo.operate'),
    headerAlign: 'center',
    width: '100px',
    align: 'center',
    slots: {
      default: (data) => {
        return (
          <>
            <span
              onClick={() => {
                currentFieldRow = cloneDeep(data.row)
                getMenuColumnUI(currentFieldRow)
              }}
              class="colorMain cursor-pointer"
            >
              {t('role.allocateField')}
            </span>
          </>
        )
      }
    }
  }
])

//字段分配弹窗
const allRef = ref()
let allFieldUI = []
const realFieldSchema = reactive<FormSchema[]>([
  {
    field: 'selectAll',
    label: t('role.fieldSelect'),
    formItemProps: {
      slots: {
        default: () => {
          const selectAllMethods = (e: boolean) => {
            isIndeterminate.value = false
            if (e) {
              isChecked.value = true
              let temp: Array<string> = []
              allFieldUI.forEach((item: any) => {
                temp.push(item.id)
              })
              fieldFormMethods.setValues({
                fieldList: temp
              })
            } else {
              isChecked.value = false
              let temp: Array<string> = []
              allFieldUI.forEach((item: any) => {
                if (item.mustSelectedColumn) {
                  temp.push(item.id)
                }
              })
              if (temp.length == allFieldUI.length) {
                isChecked.value = true
              } else if (temp.length > 0) {
                isIndeterminate.value = true
              }
              fieldFormMethods.setValues({
                fieldList: temp
              })
            }
          }
          return (
            <ElCheckbox
              ref={allRef}
              indeterminate={isIndeterminate.value}
              v-model={isChecked.value}
              onChange={selectAllMethods}
            >
              {t('productcategory.all')}
            </ElCheckbox>
          )
        }
      }
    }
  },
  {
    field: 'fieldList',
    label: ' ',
    component: 'CheckboxGroup',
    componentProps: {
      props: {
        label: 'columnValue',
        value: 'id'
      },
      style: {
        display: 'flex',
        flexWrap: 'wrap'
      },
      on: {
        change: (v: Array<string>) => {
          if (v.length == allFieldUI.length) {
            isIndeterminate.value = false
            isChecked.value = true
          } else if (v.length > 0) {
            isIndeterminate.value = true
            isChecked.value = false
          } else {
            isChecked.value = false
            isIndeterminate.value = false
          }
        }
      }
    }
  }
])
const { formRegister: fieldRegister, formMethods: fieldFormMethods } = useForm()
const showFieldVisible = ref(false)
const isIndeterminate = ref(false)
const isChecked = ref(false)
//关闭弹窗
const closeFieldDialog = () => {
  isChecked.value = false
  isIndeterminate.value = false
  showFieldVisible.value = false
}

//筛选字段
let tempTotalColumn = []
const getMenuColumnUI = async (res) => {
  res.columnList.totalColumn.forEach((item: any) => {
    if (item.mustSelectedColumn) {
      item.disabled = true
      let flag = true
      for (let aitem of res.columnList.checkColumn) {
        if (aitem == item.id) {
          flag = false
        }
      }
      flag && res.columnList.checkColumn.push(item.id)
    }
  })
  showFieldVisible.value = true
  allFieldUI = res.columnList.totalColumn
  const { checkColumn, totalColumn } = res.columnList
  tempTotalColumn = totalColumn
  if (checkColumn.length == totalColumn.length) {
    isIndeterminate.value = false
    isChecked.value = true
  } else if (checkColumn.length > 0) {
    isIndeterminate.value = true
    isChecked.value = false
  } else {
    isChecked.value = false
    isIndeterminate.value = false
  }
  await fieldFormMethods.setValues({
    roleName: res.columnList.roleName,
    menuName: res.columnList.menuName,
    fieldList: res.columnList.checkColumn
  })
  await fieldFormMethods.setSchema([
    {
      field: 'fieldList',
      path: 'componentProps.options',
      value: res.columnList.totalColumn
    }
  ])
}
//获得字段配置
const saveRoleMenuColumn = async () => {
  await fieldFormMethods.getFormData().then(async (res) => {
    let tempArr: Array<any> = []
    tempTotalColumn.forEach((item: any) => {
      if (res.fieldList.indexOf(item.id) != -1) {
        tempArr.push(item)
      }
    })
    for (const item of fieldList.value) {
      if (item.id == currentFieldRow.id) {
        item.assignedField = tempArr.length
        item.columnList.checkColumn = tempArr.map(a => a.id)
        closeFieldDialog()
        break
      }
    }
  })
}


//最后确认调用的方法
const save = async () => {
  saveLoading.value = true
  let formData = await roleMethods.getFormData()
  formData = cloneDeep(formData)
  let val = cloneDeep(formData)
  let tempObj = { ...val }
  let menuIds: any = []
  tempObj.menuIds.forEach((a) => {
    if (a.length > 0) {
      a.forEach((b) => {
        b.forEach((c) => {
          if (menuIds.indexOf(c) == -1) {
            menuIds.push(c)
          }
        })
      })
    }
  })
  allCategoryId.forEach((val) => {
    menuIds.push(val)
  })
  formData.menuIds = menuIds
  let columnList = fieldList.value.map(a => {
    let linArr: any = []
    for (const b of a.columnList.checkColumn) {
      for (const c of a.columnList.totalColumn) {
        if (b == c.id) {
          linArr.push(c)
          break
        }
      }
    }
    let obj: any = {
      columList: JSON.stringify(linArr),
      menuId: a.id,

    }
    if (roleType.value == 'edit') {
      obj.roleId = roleId.value
    }
    return obj
  })
  formData.columnList = columnList
  formData.menuIds = formData.menuIds.join(',')
  if (roleType.value == 'add') {
    const res = await addRoleApi(formData)
    if (res) {
      ElMessage.success(res.msg)
      tagsViewStore.delView(currentRoute.value)
      push('/authorization/role')
    }
  } else {
    formData.id = roleId.value
    const res = await editRoleApi(formData)
    if (res) {
      ElMessage.success(res.msg)
      tagsViewStore.delView(currentRoute.value)
      push('/authorization/role')
    }
  }
  saveLoading.value = false
}

//仓库全选半选
//判断是全选还是半选还是不选
const handleCheckAllChange = async (val) => {
  let tempArr: any = null
  if (val) {
    tempArr = warehouseEnum.value.map(item => item.id)
  } else {
    tempArr = []
  }
  await roleMethods.setValues({
    warehouseIds: tempArr
  })
  judgeSelect()
}
const handleCheckedArr = () => {
  judgeSelect()
}
const judgeSelect = async () => {
  let formData = await roleMethods.getFormData()
  formData = cloneDeep(formData)
  if (formData.warehouseIds.length == warehouseEnum.value.length) {
    await roleMethods.setValues({
      checkAll: true,
      isIndeterminate: false
    })
  } else if (formData.warehouseIds.length > 0) {
    await roleMethods.setValues({
      checkAll: false,
      isIndeterminate: true
    })
  } else {
    await roleMethods.setValues({
      checkAll: false,
      isIndeterminate: false
    })
  }
}
</script>
<style lang="less" scoped>
.customW40 {
  width: calc(50% - 10px);
  // height: 200%;
  // overflow-y: auto;
}

.customW60 {
  width: calc(50% - 10px);
  height: 750px;
  // overflow-y: auto;
}
</style>