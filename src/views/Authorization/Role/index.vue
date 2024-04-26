<script setup lang="tsx">
import { Icon } from '@/components/Icon'
import { reactive, ref } from 'vue'
import { useTable } from '@/hooks/web/useTable'
import { useI18n } from '@/hooks/web/useI18n'
import { Table, TableColumn } from '@/components/Table'
import { ElButton, ElCheckbox, ElMessage, ElMessageBox } from 'element-plus'
import { Search } from '@/components/Search'
import { FormSchema, Form } from '@/components/Form'
import { ContentWrap } from '@/components/ContentWrap'
import { Dialog } from '@/components/Dialog'
import { useValidator } from '@/hooks/web/useValidator'
import { useForm } from '@/hooks/web/useForm'
import { tableStatusStyleTag } from '@/utils/componentUtils'
import {
  getRoleListApi,
  getAssignMenuUIApi,
  editAssignMenuApi,
  getAssignPermissionUIApi,
  editAssignPermissionApi,
  getRoleAddUIApi,
  addRoleApi,
  editRoleApi,
  getRoleMenuListApi,
  getMenuColumnUIApi,
  saveRoleMenuColumnApi,
  getRoleRelationOperatorApi,
  deleteRoleApi,
  getRolePageTopApi
} from '@/api/authorization/roleApi'
import { onMounted, nextTick } from 'vue'
import SelectMenu from './components/SelectMenu.vue'
import FieldFilter from '@/components/customComponents/FieldFilter/index.vue'
import generateSchema from '@/utils/schemaUtil'
import { useAppStore } from '@/store/modules/app'
import { differenceWith, isEqual, cloneDeep } from 'lodash-es'
import { useRouter } from 'vue-router'
const { push } = useRouter()
const appStore = useAppStore()
appStore.setRenderLoading(true)
// import role from 'mock/role'
const { t } = useI18n()
//各种静态的枚举值
const statusEnum = ref()
const isMerchantEnum = ref()
const menuTreeEnum = ref()
const menuTreeObj = ref()
const warehouseEnum = ref()
// 递归获取菜单列表列表
function FatherArray(arr: any) {
  function RcursiveList(obj: any) {
    obj.title = obj.meta.title
    if (obj.children.length > 0) {
      obj.children.forEach((item: any) => {
        RcursiveList(item)
      })
    }
  }
  if (arr.length > 0) {
    arr.forEach((aitem: any) => {
      RcursiveList(aitem)
    })
  }
}

//记录目录的选择
let allCategoryId: any = []
const updateAllCategory = (id, val) => {
  if (val) {
    allCategoryId.push(id)
  } else {
    let tempArr = differenceWith(allCategoryId, [id], isEqual)
    allCategoryId = tempArr
  }
}
//递归获取选中的options
function getSelect(arr: any, menuList: any) {
  let allArr: any = []
  // function addSetAllObjCurLength(obj, linArr, curLength) {
  //   if (curLength > linArr.length - 1) {
  //     return
  //   }
  //   if (curLength == linArr.length - 1) {
  //     obj[linArr[curLength]].curLength += 1
  //     if (obj[linArr[curLength]].curLength == obj[linArr[curLength]].length) {
  //       allArr.push([...linArr, linArr.join('-') + '-all'])
  //     }
  //   } else {
  //     addSetAllObjCurLength(obj[linArr[curLength]].children, linArr, curLength + 1)
  //   }
  // }
  function RcursiveList(obj: any, tempArr: any) {
    if (obj.children && obj.children.length > 0) {
      tempArr.push(obj.id)
      if (obj.children[0].id.indexOf('-all') == -1) {
        obj.children.unshift({
          id: tempArr.join('-') + '-all',
          title: t('project.all')
        })
      }
      if (arr.indexOf(obj.id) != -1) {
        // let aArr = cloneDeep(tempArr)
        // aArr.pop()
        // addSetAllObjCurLength(menuTreeObj.value, aArr, 0)
        allArr.push([...tempArr])
      }
      obj.children.forEach((item: any) => {
        RcursiveList(item, [...tempArr])
      })
    } else {
      if (arr.indexOf(obj.id) != -1) {
        // let aArr = cloneDeep(tempArr)
        // addSetAllObjCurLength(menuTreeObj.value, aArr, 0, obj)
        tempArr.push(obj.id)
        allArr.push([...tempArr])
      }
    }
  }
  menuList.forEach((item: any) => {
    let tempArr = []
    RcursiveList(item, tempArr)
  })
  return allArr
}
//递归获取权限列表
function getPermissonArray(arr: any) {
  function RcursiveList(obj: any) {
    if (obj.children.length > 0) {
      obj.id = ''
      obj.children.forEach((item: any) => {
        RcursiveList(item)
      })
    } else {
      obj.id = ''
      obj.children = obj.permissionList
      obj.children = obj.children.map((item: any) => {
        return {
          ...item,
          title: item.permissionName
        }
      })
    }
  }
  if (arr.length > 0) {
    arr.forEach((aitem: any) => {
      RcursiveList(aitem)
    })
  }
}

const currentRoleName = ref()
// ------------- 表格
const { tableState, tableMethods } = useTable({
  fetchDataApi: async () => {
    const res = await getRoleListApi({
      pageSize: pageSize.value,
      currentPage: currentPage.value,
      ...searchParams.value
    })
    const { total, list } = res.data
    return {
      list,
      total
    }
  },
  fetchDelApi: async () => {
    const res = await deleteRoleApi({ id: roleId })
    return res
  },
  immediate: false
})

const { dataList, loading, total, pageSize, currentPage } = tableState
const { getList, delList } = tableMethods

const tableColumns = ref<TableColumn[]>([])

const searchSchema = reactive<FormSchema[]>([
  {
    field: 'roleName',
    label: t('role.roleName'),
    component: 'Input',
    componentProps: {
      slots: {
        // prepend: () => <div>{t('role.roleName')}</div>
      }
    }
  },
  {
    field: 'unStatus',
    label: t('role.status'),
    component: 'Select',
    componentProps: {
      options: [
        {
          label: t('project.success'),
          value: 'ACTIVE'
        },
        {
          label: t('project.fail'),
          value: 'UNACTIVE'
        }
      ]
    }
  }
])

const searchParams = ref({
  roleName: '',
  unStatus: ''
})
const setSearchParams = (data: any) => {
  data.roleName ? (searchParams.value.roleName = data.roleName) : (searchParams.value.roleName = '')
  data.unStatus ? (searchParams.value.unStatus = data.unStatus) : (searchParams.value.unStatus = '')
  currentPage.value == 1 ? getList() : (currentPage.value = 1)
}

// ------------- 弹窗
let allSchema = reactive<FormSchema[]>([])
let dialogType = '' //保留打开的dialog类型
let roleId = '' //保留角色id
const roleVisible = ref(false)
const currentRow = ref()
const dialogTitle = ref('')
const submitRole = async () => {
  // console.log(await roleMethods.getFormData())
  // return
  const roleFormExpose = await roleMethods.getElFormExpose()
  await roleFormExpose?.validate(async (isValid) => {
    if (isValid) {
      await roleMethods.getFormData().then((res) => {
        switch (dialogType) {
          case 'menuSchema':
            editAssignMenu(res.ids)
            break
          case 'permissionSchema':
            editAssignPermission(res.rightsProfile)
            break
          case 'roleSchema':
            addRole(res)
            break
          case 'editSchema':
            addRole(res)
            // editRole(res)
            break
          case 'roleLinkSchema':
            roleVisible.value = false
            break
        }
      })
    }
  })
}
const selectDialog = (schemaType: string, rowData: any = '') => {
  dialogType = schemaType
  roleId = rowData ? rowData.row.id : ''
  if (schemaType == 'deleteRole') {
    delList(1)
    return
  }
  currentRow.value = cloneDeep(rowData.row)
  allCategoryId = []
  switch (schemaType) {
    case 'editSchema':
      dialogTitle.value = t('project.edit')
      allSchema = roleSchema
      push('/authorization/role/editrole?type=edit&&id='+rowData.row.id)
      return
      getEditRole(rowData.row)
      break
    case 'menuSchema':
      allSchema = menuSchema
      getAssignMenuUI(rowData.row.id)
      break
    case 'permissionSchema':
      allSchema = permissionSchema
      getAssignPermissionUI(rowData.row.id)
      break
    case 'roleLinkSchema':
      dialogTitle.value = t('project.view')
      allSchema = roleLinkSchema
      getRoleRelationOperator()
      break
    case 'roleSchema':
      dialogTitle.value = t('project.add')
      allSchema = roleSchema
      roleVisible.value = true
      getSelect([], menuTreeEnum.value)
      nextTick(() => {
        let len = menuTreeEnum.value.length
        let tempArr: Array<any> = []
        for (let i = 0; i < len; i++) {
          tempArr[i] = []
        }
        roleMethods.setValues({
          menuIds: tempArr
        })
      })
      break
  }
}
// 新增弹窗
const { formRegister: roleRegister, formMethods: roleMethods } = useForm()

const { required, validD, lengthRange } = useValidator()

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
    label: t('role.sub'),
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
      rules: [required()],
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
                          menuTreeObj={menuTreeObj.value[item.id] ? menuTreeObj.value[item.id] : {}}
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
  },
  {
    field: 'warehouseIds',
    label: t('role.txt1'),
    component: 'CheckboxGroup',
    colProps: {
      span: 24
    },
    componentProps:{
      options: warehouseEnum,
      style: {
        width: '100%'
      },
      props: {
        label: 'warehouseName',
        value: 'id'
      }
    },
    // formItemProps: {
    //   rules: [required()]
    // }
  }
  // {
  //   field: 'menuIds',
  //   label: t('role.menuConfigure'),
  //   component: 'Cascader',
  //   colProps: {
  //     span: 24
  //   },
  //   componentProps: {
  //     placeholder: t('exampleDemo.select'),
  //     // options: menuOptions,
  //     style: {
  //       width: '100%'
  //     },
  //     props: {
  //       multiple: true,
  //       label: 'title',
  //       value: 'id'
  //     }
  //   },
  //   formItemProps: {
  //     style: {
  //       width: '100%'
  //     }
  //   }
  // }
  // {
  //   field: 'permissionIds',
  //   label: t('role.rightsProfile'),
  //   component: 'Cascader',
  //   componentProps: {
  //     placeholder: t('exampleDemo.select'),
  //     // options: permissionOptions,
  //     props: {
  //       multiple: true,
  //       label: 'title',
  //       value: 'id'
  //     },
  //     style: {
  //       width: '100%'
  //     }
  //   },
  //   formItemProps: {
  //     style: {
  //       width: '100%'
  //     }
  //   }
  // }
])
const getRoleAddUI = async () => {
  const res = await getRoleAddUIApi()
  // FatherArray(res.data.menuList)
  // getPermissonArray(res.data.permissionTreeList)
  roleMethods.setSchema([
    {
      field: 'menuIds',
      path: 'componentProps.options',
      value: res.data.menuList
    }
  ])
}
const addRole = async (val: any) => {
  val = cloneDeep(val)
  let tempObj = { ...val }
  let index = 0

  // return
  // for (let i = 0; i < val.menuIds.length; i++) {
  //   for (let j = 0; j < val.menuIds[i].length; j++) {
  //     tempArr[index++] = [menuTreeEnum.value[i].id, ...val.menuIds[i][j]]
  //   }
  // }
  let menuIds: any = []
  // menuIds = menuIds = menuIds.reduce((pre, cur) => {
  //   pre = pre.concat(cur)
  //   return pre
  // }, [])
  // menuIds = Array.from(new Set(menuIds)).join(',')
  tempObj.menuIds.forEach((a) => {
    if (a.length > 0) {
      a.forEach((b) => {
        if (b[b.length - 1].indexOf('-all') == -1) {
          menuIds.push(b[b.length - 1])
        }
      })
    }
  })
  allCategoryId.forEach((val) => {
    menuIds.push(val[0])
  })
  val.menuIds = menuIds.join(',')
  val.warehouseIds =  val.warehouseIds ? val.warehouseIds.join(',') : ''
  let res: any = null
  if (dialogType == 'editSchema') {
    val.id = currentRow.value.id
    res = await editRoleApi(val)
  } else {
    res = await addRoleApi(val)
  }
  if (res) {
    ElMessage.success(res.msg)
    getList()
    roleVisible.value = false
  }

  // return
  // let menuIds = val.menuIds ? val.menuIds : ''
  // if (menuIds) {
  //   menuIds = menuIds.reduce((pre, cur) => {
  //     pre = pre.concat(cur)
  //     return pre
  //   }, [])
  // }
  // menuIds = Array.from(new Set(menuIds)).join(',')
  // let permissionIds: string = ''
  // if (val.permissionIds) {
  //   val.permissionIds.forEach((item) => {
  //     if (item[item.length - 1]) {
  //       permissionIds += item[item.length - 1] + ','
  //     }
  //   })
  // }

  // permissionIds = permissionIds.substring(0, permissionIds.length - 1)
  // const res = await addRoleApi({
  //   roleName: val.roleName,
  //   remark: val.remark || '',
  //   menuIds,
  //   permissionIds
  // })

  // if (res) {
  //   ElMessage({
  //     showClose: true,
  //     message: res.msg,
  //     type: 'success'
  //   })
  //   roleVisible.value = false
  //   getList()
  // }
}
const getEditRole = async (val: any) => {
  const res = await getAssignMenuUIApi({
    id: val.id
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
  currentRow.value.warehouseIds =  res.data.selfWarehouseIds
  roleVisible.value = true
  nextTick(() => {
    roleMethods.setValues({
      menuIds: tempArr,
      ...currentRow.value
    })
  })
}
const editRole = async (val: any) => {
  const res = await editRoleApi({
    roleName: val.roleName,
    remark: val.remark || '',
    id: roleId
  })
  if (res) {
    ElMessage({
      showClose: true,
      message: res.msg,
      type: 'success'
    })
    roleVisible.value = false
    getList()
  }
}
// 编辑弹窗
const editSchema = reactive<FormSchema[]>([
  {
    field: 'roleName',
    label: t('role.roleName'),
    component: 'Input',
    componentProps: {
      placeholder: t('exampleDemo.input') + t('role.roleName'),
      maxlength: 30
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
    field: 'remark',
    label: t('role.roleDescript'),
    component: 'Input',
    componentProps: {
      type: 'textarea',
      rows: 3,
      placeholder: t('exampleDemo.maxInput') + 50 + t('exampleDemo.word'),
      maxlength: 50,
      showWordLimit: true
    },
    formItemProps: {
      style: {
        width: '100%'
      }
    }
  }
])
//菜单分配弹窗
const menuSchema = reactive<FormSchema[]>([
  {
    field: 'ids',
    label: t('role.menuConfigure'),
    component: 'Cascader',
    componentProps: {
      placeholder: t('exampleDemo.select'),
      // options: menuOptions,
      style: {
        width: '100%'
      },
      props: {
        multiple: true,
        label: 'title',
        value: 'id'
      }
    },
    formItemProps: {
      style: {
        width: '100%'
      }
    }
  }
])
const getAssignMenuUI = async (id: string) => {
  const res = await getAssignMenuUIApi({
    id
  })

  // FatherArray(res.data.menuList)
  roleMethods.setSchema([
    {
      field: 'ids',
      path: 'componentProps.options',
      value: res.data.menuList
    }
  ])
  let allArr = getSelect(res.data.selfMenuIds, res.data.menuList)
  roleMethods.setValues({
    ids: allArr
  })
}
const editAssignMenu = async (val: Array<Array<string>>) => {
  let arr: Array<string> = []
  val.forEach((item) => {
    arr = [...arr, ...item]
  })
  let tempSet = new Set(arr)
  const res: any = await editAssignMenuApi({
    ids: Array.from(tempSet).join(','),
    id: roleId
  })
  if (res) {
    ElMessage({
      showClose: true,
      message: res.msg,
      type: 'success'
    })
    roleVisible.value = false
    getList()
  }
}
//权限分配弹窗
const permissionSchema = reactive<FormSchema[]>([
  {
    field: 'rightsProfile',
    label: t('role.rightsProfile'),
    component: 'Cascader',
    componentProps: {
      placeholder: t('exampleDemo.select'),
      style: {
        width: '100%'
      },
      props: {
        multiple: true,
        label: 'title',
        value: 'id'
      }
    },
    formItemProps: {
      style: {
        width: '100%'
      }
    }
  }
])
const getAssignPermissionUI = async (id: string) => {
  let res = await getAssignPermissionUIApi({ id })
  getPermissonArray(res.data.permissionTreeList)
  roleMethods.setSchema([
    {
      field: 'rightsProfile',
      path: 'componentProps.options',
      value: res.data.permissionTreeList
    }
  ])
  let allArr = getSelect(res.data.selfPermission, res.data.permissionTreeList)
  roleMethods.setValues({
    rightsProfile: allArr
  })
}
const editAssignPermission = async (val: Array<Array<string>>) => {
  let ids: string = ''
  val.forEach((item) => {
    if (item[item.length - 1]) {
      ids += item[item.length - 1] + ','
    }
  })
  ids = ids.substring(0, ids.length - 1)
  const res: any = await editAssignPermissionApi({
    ids,
    id: roleId
  })
  roleVisible.value = false
  if (res) {
    ElMessage({
      showClose: true,
      message: res.msg,
      type: 'success'
    })
    roleVisible.value = false
    getList()
  }
}
//角色关联弹窗
const roleLinkSchema = reactive<FormSchema[]>([
  {
    field: 'roleLinkList',
    label: t('role.operator'),
    colProps: {
      span: 24
    }
  },
  {
    field: 'roleLinkList',
    component: 'CheckboxGroup',
    label: '',
    colProps: {
      span: 24
    },
    componentProps: {
      // style: {
      //   display: 'flex'
      // }
    },
    formItemProps: {
      style: {
        width: '100%'
      }
    }
  }
])
const getRoleRelationOperator = async () => {
  const res = await getRoleRelationOperatorApi({
    id: roleId
  })
  let temp: Array<any> = []
  res.data.forEach((item: any) => {
    temp.push({
      label: item.realName,
      value: item.id,
      // checked: true,
      disabled: true
    })
  })
  roleVisible.value = true
  let valArr = temp.map((item) => item.value)
  nextTick(async () => {
    await roleMethods.setSchema([
    {
      field: 'roleLinkList',
      path: 'componentProps.options',
      value: temp
    }
  ])
  await roleMethods.setValues({
    roleLinkList: valArr
  })
  })
}

// 字段分配弹窗
const fieldVisible = ref(false)
const fieldFindSchema = reactive<FormSchema[]>([
  {
    field: 'menuName',
    label: t('menu.menuName'),
    component: 'Input',
    componentProps: {
      placeholder: t('exampleDemo.search') + t('role.menuName')
    }
  }
])
const fieldSearchParam = ref({
  menuName: ''
})
const setFieldSearchParam = (data: any) => {
  data.menuName ? (fieldSearchParam.value = data) : (fieldSearchParam.value.menuName = '')
  fieldCurrentPage.value == 1 ? getFieldList() : (fieldCurrentPage.value = 1)
  // getFieldList()
}
let menuId = ''
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
                menuId = data.row.id
                getMenuColumnUI(data.row.id)
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
//点击字段分配，获取字段分配静态数据
let allFieldUI = []
let tempTotalColumn = []
const getMenuColumnUI = async (menuId: string) => {
  const res = await getMenuColumnUIApi({
    menuId,
    roleId
  })
  res.data.totalColumn.forEach((item: any) => {
    if (item.mustSelectedColumn) {
      item.disabled = true
      let flag = true
      for (let aitem of res.data.checkColumn) {
        if (aitem == item.id) {
          flag = false
        }
      }
      flag && res.data.checkColumn.push(item.id)
    }
  })
  showFieldVisible.value = true
  allFieldUI = res.data.totalColumn
  const { checkColumn, totalColumn } = res.data
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
    roleName: res.data.roleName,
    menuName: res.data.menuName,
    fieldList: res.data.checkColumn
  })
  await fieldFormMethods.setSchema([
    {
      field: 'fieldList',
      path: 'componentProps.options',
      value: res.data.totalColumn
    }
  ])
}
//字段分配表格
const { tableState: fieldState, tableMethods: fieldMethods } = useTable({
  fetchDataApi: async () => {
    if (!roleId) {
      return {
        list: [],
        total: 0
      }
    }
    const res = await getRoleMenuListApi({
      pageSize: fieldPageSize.value,
      currentPage: fieldCurrentPage.value,
      roleId: roleId,
      menuName: fieldSearchParam.value.menuName
    })
    const { total, list } = res.data
    return {
      list: list,
      total: total
    }
  },
  immediate:false
})

const {
  dataList: fieldList,
  loading: fieldLoading,
  total: fieldTotal,
  pageSize: fieldPageSize,
  currentPage: fieldCurrentPage
} = fieldState
const { getList: getFieldList } = fieldMethods
// 字段分配选择弹窗
const { formRegister: fieldRegister, formMethods: fieldFormMethods } = useForm()
const showFieldVisible = ref(false)
const isIndeterminate = ref(false)
const isChecked = ref(false)
const allRef = ref()

const realFieldSchema = reactive<FormSchema[]>([
  // {
  //   field: 'roleName',
  //   label: t('role.operator'),
  //   component: 'Input',
  //   componentProps: {
  //     readonly: true
  //   }
  // },
  // {
  //   field: 'menuName',
  //   label: t('role.menuName'),
  //   component: 'Input',
  //   componentProps: {
  //     readonly: true
  //   }
  // },
  {
    field: 'selectAll',
    label: t('role.fieldSelect'),
    // component: 'CheckboxButton',
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
const saveRoleMenuColumn = async () => {
  await fieldFormMethods.getFormData().then(async (res) => {
    let tempArr: Array<any> = []
    tempTotalColumn.forEach((item: any) => {
      if (res.fieldList.indexOf(item.id) != -1) {
        tempArr.push(item)
      }
    })
    const ares = await saveRoleMenuColumnApi({
      menuId,
      roleId,
      columList: JSON.stringify(tempArr)
    })
    if (ares.code == 200) {
      ElMessage({
        showClose: true,
        message: ares.msg,
        type: 'success'
      })
      showFieldVisible.value = false
    }
  })
}
const closeFieldDialog = () => {
  isChecked.value = false
  isIndeterminate.value = false
  showFieldVisible.value = false
}
const afieldVisible = ref(false)
//onMounted
onMounted(() => {
  init()
})
const staticSchema = [
  {
    field: 'unStatusStr',
    label: t('role.status'),
    formatter: (data: any) => {
      const status = data.unStatus || ''
      return tableStatusStyleTag(status, data.unStatusStr)
    }
  }
]
const actionSchema = {
  field: 'operate',
  label: t('exampleDemo.operate'),
  width: '300px',
  fixed: 'right',
  slots: {
    default: (data) => {
      return (
        <>
          <div class="[&>span]:(cursor-pointer m-2) flex flex-wrap color-colorMain">
            <span
              v-hasPermi="pms:role:edit"
              onClick={() => {
                selectDialog('editSchema', data)
              }}
            >
              {t('role.edit')}
            </span>
            {/* <span
              v-hasPermi="pms:role:fieldallocate"
              onClick={() => {
                fieldVisible.value = true
                currentRoleName.value = data.row.roleName
                roleId = data.row.id
                dialogType = 'fieldAllocate'
                getFieldList()
              }}
            >
              {t('role.allocateField')}
            </span> */}
            <span
              v-hasPermi="pms:role:rolelink"
              onClick={() => {
                selectDialog('roleLinkSchema', data)
              }}
            >
              {t('role.roleLink')}
            </span>
            <span
              class="color-red-500"
              v-hasPermi="pms:role:delete"
              onClick={() => {
                selectDialog('deleteRole', data)
              }}
            >
              {t('role.delete')}
            </span>
          </div>
        </>
      )
    }
  }
}
const init = async () => {
  appStore.setRenderLoading(true)

  const res = await getRolePageTopApi()
  res.code == 200 &&
    (statusEnum.value = res.data.status) &&
    (isMerchantEnum.value = res.data.isMerchant) &&
    (menuTreeEnum.value = res.data.menuList) &&
    (warehouseEnum.value = res.data.warehouse)
  addressMenuTree()
  let arr = generateSchema(res.data.pageColumn, staticSchema)
  arr.push(actionSchema)
  tableColumns.value = []
  nextTick(() => {
    tableColumns.value = arr
    getList()
  })
}

const addressMenuTree = () => {
  let tempObj: any = {}
  let tempMenuTree = cloneDeep(menuTreeEnum.value)
  function recursiveMenuTree(obj, arr) {
    obj.children = {}
    for (const a of arr) {
      obj.children[a.id] = cloneDeep(a)
      delete obj.children[a.id].children
      if (a.children && a.children.length > 0) {
        obj.children[a.id].length = a.children.length
        obj.children[a.id].curLength = 0
        recursiveMenuTree(obj.children[a.id], a.children)
      }
    }
  }
  // tempObj.length = tempMenuTree.length
  // temp
  for (const a of tempMenuTree) {
    tempObj[a.id] = cloneDeep(a)
    delete tempObj[a.id].children
    if (a.children && a.children.length > 0) {
      tempObj[a.id].length = a.children.length
      tempObj[a.id].curLength = 0
      recursiveMenuTree(tempObj[a.id], a.children)
    }
  }
  menuTreeObj.value = tempObj
}
</script>

<template>
  <ContentWrap>
    <div class="flex-cb">
      <div v-hasPermi="'pms:role:search'" >
        <Search :schema="searchSchema" @reset="setSearchParams" @search="setSearchParams" />
      </div>
      <div class="mb-10px flex">
        <ElButton plain @click="afieldVisible = true" v-hasPermi="'pms:role:editColumn'">{{
          t('common.fieldFiltering')
        }}</ElButton>
        <!-- <ElButton type="primary" v-hasPermi="'pms:role:add'" @click="selectDialog('roleSchema')"
          >{{ t('exampleDemo.add') }}{{ t('role.role') }}</ElButton
        > -->
        <ElButton type="primary" v-hasPermi="'pms:role:add'" @click="push('/authorization/role/createrole?type=add')"
          >{{ t('exampleDemo.add') }}{{ t('role.role') }}</ElButton
        >
      </div>
    </div>
  </ContentWrap>
  <ContentWrap class="mt-20px flex-1" :isBlock="false">
    <Table
      :columns="tableColumns"
      :data="dataList"
      :loading="loading"
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :pagination="{
        total: total,
        layout: ' ->, total, sizes, prev, pager, next, jumper',
        pageSize: pageSize,
        currentPage: currentPage
      }"
    />
  </ContentWrap>

  <Dialog
    v-if="roleVisible"
    v-model="roleVisible"
    :title="dialogTitle"
    :max-height="dialogType == 'roleLinkSchema' ? '150px' : '450px'"
    width="40%"
  >
    <Form @register="roleRegister" :schema="allSchema" />
    <template #footer>
      <el-button @click="roleVisible = false">{{ t('exampleDemo.cancel') }}</el-button>
      <ElButton type="primary" @click="submitRole">{{ t('project.confirm') }}</ElButton>
    </template>
  </Dialog>
  <Dialog v-model="fieldVisible" :title="t('menu.fieldConfig')" width="50%">
    <!-- <Search :schema="fieldFindSchema" @search="setFieldSearchParam" :showReset="false" /> -->
    <div class="flex">
      <div class="font-bold">{{ t('role.roleName') }}</div>
      <div class="ml-10px font-bold">{{ currentRoleName }}</div>
    </div>
    <Table
      class="mt-20px"
      v-model:pageSize="fieldPageSize"
      v-model:current-page="fieldCurrentPage"
      :columns="fieldColumns"
      :data="fieldList"
      :loading="fieldLoading"
      :pagination="{
        total: fieldTotal,
        layout: ' ->, total, sizes, prev, pager, next, jumper',
        pageSize: fieldPageSize,
        currentPage: fieldCurrentPage
      }"
    />
    <Dialog @close="closeFieldDialog" v-model="showFieldVisible" :title="t('role.allocateField')">
      <Form @register="fieldRegister" :schema="realFieldSchema" :isCol="false" />
      <template #footer>
        <el-button @click="closeFieldDialog">{{ t('exampleDemo.cancel') }}</el-button>
        <ElButton type="primary" @click="saveRoleMenuColumn">{{ t('project.confirm') }}</ElButton>
      </template>
    </Dialog>
  </Dialog>
  <FieldFilter
    v-if="afieldVisible"
    v-model:fieldVisible="afieldVisible"
    @refresh-page-top="init"
    :ui-url="'/pms/role/operatorSortColumnUI'"
    :sort-url="'/pms/role/operatorSortColumn'"
  />
</template>

<style lang="less" scoped>
/deep/.selectBlock > div > span {
  width: 60px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
