<template>
  <div class="flex-cb">
    <ContentWrap class="w-33% heigthDiv" v-if="dataList1">
      <div>{{ t('productcategory.title1') }}</div>
      <div class="flex-cb mt-20px">
        <ElInput
          v-hasPermi="'goods:ecCategory:list'"
          :placeholder="t('project.input')"
          :suffix-icon="Search"
          v-model="categoryName1"
          @keyup.enter="getList(1, true)"
        />
        <div v-hasPermi="'goods:ecCategory:add'" class="flex-c w-120px ml-10px" @click="addOpen(1)">
          <Icon icon="ep:plus" :size="15" color="var(--el-color-primary)" />
          <div class="colorMain font-size-15px cursor-pointer">{{ t('productcategory.add') }}</div>
        </div>
      </div>
      <div class="mt-20px w-100% heightoverflow">
        <div
          class="category_li flex-cb"
          :class="clickId1 == item.id ? 'bgMain' : ''"
          v-for="(item, i) in dataList1"
          :key="i"
          @click.stop="clickItem(1, item)"
          :draggable="true"
          @dragstart="dragstart(item)"
          @dragenter="dragenter(i, item)"
          @dragend="dragend(1, item)"
          @dragover="dragover($event)"
        >
          <div v-if="clickId1 == item.id" class="color-#fff edit">{{ item.categoryName }}</div>
          <div v-else class="edit flex-c">
            <div>{{ item.categoryName }}</div>
            <div v-show="item.status == 'DISABLE'">
              <ElTag type="danger" size="small" class="ml-5px">{{ item.statusStr }}</ElTag>
            </div>
          </div>
          <div class="flex-c">
            <div class="hoverDiv">
              <div class="flex-c">
                <div
                  v-hasPermi="'goods:ecCategory:edit'"
                  class="edit mr-10px font-size-13px cursor-pointer"
                  @click.stop="editOpen(1, item)"
                  >{{ t('project.edit') }}</div
                >
                <div
                  v-hasPermi="'goods:ecCategory:delete'"
                  class="color-red1 mr-10px font-size-13px cursor-pointer"
                  @click.stop="delOpen(1, item)"
                  >{{ t('project.delete') }}</div
                >
                <Icon
                  class="mr-10px cursor-pointer"
                  icon="ep:rank"
                  :size="14"
                  color=" var(--el-color-primary)"
                />
              </div>
              
            </div>
            <div class="hoverNone flex-c" v-if="clickId1 == item.id">
              <div class="flex-c">
                <div
                  v-hasPermi="'goods:ecCategory:edit'"
                  class="color-#fff mr-10px font-size-13px cursor-pointer"
                  @click.stop="editOpen(1, item)"
                  >{{ t('project.edit') }}</div
                >
                <div
                  v-hasPermi="'goods:ecCategory:delete'"
                  class="color-#fff mr-10px font-size-13px cursor-pointer"
                  @click.stop="delOpen(1, item)"
                  >{{ t('project.delete') }}</div
                >
                <Icon class="mr-10px cursor-pointer" icon="ep:rank" :size="14" color="#fff" />
              </div>
            </div>
            <Icon icon="ep:arrow-right" :size="15" color="#797979" />
          </div>
        </div>
      </div>
    </ContentWrap>
    <ContentWrap class="w-33% ml-15px mr-15px heigthDiv" v-if="dataList2">
      <div>{{ t('productcategory.title2') }}</div>
      <div class="flex-cb mt-20px">
        <ElInput
          v-hasPermi="'goods:ecCategory:list'"
          :placeholder="t('project.input')"
          :suffix-icon="Search"
          v-model="categoryName2"
          @keyup.enter="getList(2, true)"
        />
        <div v-hasPermi="'goods:ecCategory:add'" class="flex-c w-120px ml-10px" @click="addOpen(2)">
          <Icon icon="ep:plus" :size="15" color="var(--el-color-primary)" />
          <div class="colorMain font-size-15px cursor-pointer">{{ t('productcategory.add') }}</div>
        </div>
      </div>
      <div class="mt-20px w-100% heightoverflow">
        <div
          class="category_li flex-cb"
          :class="clickId2 == item.id ? 'bgMain' : ''"
          v-for="(item, i) in dataList2"
          :key="i"
          @click.stop="clickItem(2, item)"
          :draggable="true"
          @dragstart="dragstart(item)"
          @dragenter="dragenter(i, item)"
          @dragend="dragend(2, item)"
          @dragover="dragover($event)"
        >
          <div v-if="clickId2 == item.id" class="color-#fff edit">{{ item.categoryName }}</div>
          <div v-else class="edit flex-c">
            <div>{{ item.categoryName }}</div>
            <div v-show="item.status == 'DISABLE'">
              <ElTag type="danger" size="small" class="ml-5px">{{ item.statusStr }}</ElTag>
            </div>
          </div>
          <div class="flex-c">
            <div class="hoverDiv">
              <div class="flex-c">
                <div
                  v-hasPermi="'goods:ecCategory:edit'"
                  class="edit mr-10px font-size-13px cursor-pointer"
                  @click.stop="editOpen(2, item)"
                  >{{ t('project.edit') }}</div
                >
                <div
                  v-hasPermi="'goods:ecCategory:delete'"
                  class="color-red1 mr-10px font-size-13px cursor-pointer"
                  @click.stop="delOpen(2, item)"
                  >{{ t('project.delete') }}</div
                >
                <Icon
                  class="mr-10px cursor-pointer"
                  icon="ep:rank"
                  :size="14"
                  color=" var(--el-color-primary)"
                />
              </div>
            </div>
            <div class="hoverNone" v-if="clickId2 == item.id">
              <div class="flex-c">
                <div
                  v-hasPermi="'goods:ecCategory:edit'"
                  class="color-#fff mr-10px font-size-13px cursor-pointer"
                  @click.stop="editOpen(2, item)"
                  >{{ t('project.edit') }}</div
                >
                <div
                  v-hasPermi="'goods:ecCategory:delete'"
                  class="color-#fff mr-10px font-size-13px cursor-pointer"
                  @click.stop="delOpen(2, item)"
                  >{{ t('project.delete') }}</div
                >
                <Icon class="mr-10px cursor-pointer" icon="ep:rank" :size="14" color="#fff" />
              </div>
            </div>
            <Icon icon="ep:arrow-right" :size="15" color="#797979" />
          </div>
        </div>
      </div>
    </ContentWrap>
    <ContentWrap class="w-33% heigthDiv" v-if="dataList3">
      <div>{{ t('productcategory.title3') }}</div>
      <div class="flex-cb mt-20px">
        <ElInput
          v-hasPermi="'goods:ecCategory:list'"
          :placeholder="t('project.input')"
          :suffix-icon="Search"
          v-model="categoryName3"
          @keyup.enter="getList(3, true)"
        />
        <div v-hasPermi="'goods:ecCategory:add'" class="flex-c w-120px ml-10px" @click="addOpen(3)">
          <Icon icon="ep:plus" :size="15" color="var(--el-color-primary)" />
          <div class="colorMain font-size-15px cursor-pointer">{{ t('productcategory.add') }}</div>
        </div>
      </div>
      <div class="mt-20px w-100% heightoverflow">
        <div
          class="category_li flex-cb"
          :class="clickId3 == item.id ? 'bgMain' : ''"
          v-for="(item, i) in dataList3"
          :key="i"
          @click="clickItem(3, item)"
          :draggable="true"
          @dragstart="dragstart(item)"
          @dragenter="dragenter(i, item)"
          @dragend="dragend(3, item)"
          @dragover="dragover($event)"
        >
          <div v-if="clickId3 == item.id" class="color-#fff edit">{{ item.categoryName }}</div>
          <div v-else class="edit flex-c">
            <div>{{ item.categoryName }}</div>
            <div v-show="item.status == 'DISABLE'">
              <ElTag type="danger" size="small" class="ml-5px">{{ item.statusStr }}</ElTag>
            </div>
          </div>
          <div class="flex-c">
            <div class="hoverDiv">
              <div class="flex-c">
                <div
                  v-hasPermi="'goods:ecCategory:edit'"
                  class="edit mr-10px font-size-13px cursor-pointer"
                  @click.stop="editOpen(3, item)"
                  >{{ t('project.edit') }}</div
                >
                <div
                  v-hasPermi="'goods:ecCategory:delete'"
                  class="color-red1 mr-10px font-size-13px cursor-pointer"
                  @click.stop="delOpen(3, item)"
                  >{{ t('project.delete') }}</div
                >
                <Icon class="mr-10px" icon="ep:rank" :size="14" color=" var(--el-color-primary)" />
              </div>
            </div>
            <div class="hoverNone" v-if="clickId3 == item.id">
              <div class="flex-c">
                <div
                  v-hasPermi="'goods:ecCategory:edit'"
                  class="color-#fff mr-10px font-size-13px cursor-pointer"
                  @click.stop="editOpen(3, item)"
                  >{{ t('project.edit') }}</div
                >
                <div
                  v-hasPermi="'goods:ecCategory:delete'"
                  class="color-#fff mr-10px font-size-13px cursor-pointer"
                  @click.stop="delOpen(3, item)"
                  >{{ t('project.delete') }}</div
                >
                <Icon class="mr-10px" icon="ep:rank" :size="14" color="#fff" />
              </div>
            </div>
            <!-- <Icon icon="ep:arrow-right" :size="15" color="#797979" /> -->
          </div>
        </div>
      </div>
    </ContentWrap>

    <Dialog v-model="dialog1" :title="dialogTitle1" maxHeight="450px">
      <Write1
        :categoryType="categoryType"
        :clickId="clickId"
        :clickList="clickList"
        :commonList="commonList"
        :statusEnum="statusEnum"
        :editItem="editItem"
        :openType="openType"
        ref="write1Ref"
      />

      <template #footer>
        <ElButton @click="dialog1 = false">{{ t('project.cancel') }}</ElButton>
        <ElButton type="primary" :loading="saveLoading1" @click="save1">
          {{ t('project.confirm') }}
        </ElButton>
      </template>
    </Dialog>
    <Dialog v-model="dialog2" :title="t('productcategory.deltitle')">
      <Write2
        :categoryType="categoryType"
        :inheritList="inheritList"
        :delName="delName"
        ref="write2Ref"
      />

      <template #footer>
        <ElButton @click="dialog2 = false">{{ t('project.cancel') }}</ElButton>
        <ElButton type="primary" :loading="saveLoading2" @click="save2">
          {{ t('project.confirm') }}
        </ElButton>
      </template>
    </Dialog>
  </div>
</template>

<script lang="tsx" setup>
import { Icon } from '@/components/Icon'
import { ElInput, ElButton, ElMessageBox, ElMessage, ElEmpty, ElTag } from 'element-plus'
import { ContentWrap } from '@/components/ContentWrap'
import { useI18n } from '@/hooks/web/useI18n'
import { ref, reactive, unref, onMounted } from 'vue'
import Write1 from './components/Write1.vue'
import Write2 from './components/Write2.vue'
import { Dialog } from '@/components/Dialog'
import { Search } from '@element-plus/icons-vue'
import {
  categoryTop,
  getCategoryByLevel,
  addcategory,
  editcategory,
  delcategory,
  sortCategory,
  checkRel,
  categoryDetails
} from '@/api/RuleManage/ProductCategory'
import Empty from '@/components/customComponents/Empty/index.vue'
import { getAttrByParentId } from '@/api/RuleManage/CategoryAttribute'

const { t } = useI18n()

const categoryName1 = ref('')
const clickId1 = ref('')
const categoryName2 = ref('')
const clickId2 = ref('')
const parentId2 = ref('')
const categoryName3 = ref('')
const clickId3 = ref('')
const parentId3 = ref('')
const dataList1 = ref<any>()
const dataList2 = ref<any>()
const dataList3 = ref<any>()
const write1Ref = ref()
const write2Ref = ref()
const statusEnum = ref([])

const introEndIndex = ref()

//拖拽
const dragstart = (e: any) => {
  // console.log('开始元素', e)
}
const dragenter = (index: any, e: any) => {
  // console.log('途径最后一个元素和下标', index, e)
  introEndIndex.value = index
}
const dragend = async (type: any, e: any) => {
  const res = await sortCategory({
    category: e,
    index: introEndIndex.value
  })
  if (res.code == 200) {
    ElMessage.success(t('common.operateSuccess'))
    getList(type, false)
  }
}
const dragover = (e: any) => {
  // console.log('4', e)
  e.preventDefault()
}

const getTop = async () => {
  const res = await categoryTop()
  if (res.code == 200) {
    statusEnum.value = res.data.statusEnum
  }
}

const getList = async (type: Number, isgo: any) => {
  let parentId = type == 1 ? '0' : type == 2 ? parentId2.value : parentId3.value
  let categoryName =
    type == 1 ? categoryName1.value : type == 2 ? categoryName2.value : categoryName3.value
  const res = await getCategoryByLevel({
    categoryName: categoryName,
    parentId: parentId,
    level: type,
    isShowDisable: true
  })
  switch (type) {
    case 1:
      dataList1.value = res.data
      clickId1.value = dataList1.value[0].id
      if ((dataList1.value.length > 0 && isgo) || dataList1.value.length == 1) {
        parentId2.value = dataList1.value[0].id
        getList(2, true)
      }
      break
    case 2:
      dataList2.value = res.data
      if (dataList2.value.length > 0) {
        clickId2.value = dataList2.value[0].id
      }
      if ((dataList2.value.length > 0 && isgo) || dataList2.value.length == 1) {
        parentId3.value = dataList2.value[0].id
        getList(3, true)
      }
      break
    case 3:
      dataList3.value = res.data
      if (dataList3.value.length > 0) {
        clickId3.value = dataList3.value[0].id
      }
      break
  }
}

onMounted(() => {
  getTop()
  getList(1, true)
})

const categoryType = ref()
const clickId = ref('')
const clickList = ref<any>()
const commonList = ref<any>()
const dialog1 = ref(false)
const dialogTitle1 = ref('')
const dialog2 = ref(false)

const clickItem = async (type: any, item: any) => {
  switch (type) {
    case 1:
      if (item.id == clickId1.value) {
        return
      }
      clickId1.value = item.id
      parentId2.value = item.id
      dataList2.value = []
      clickId2.value = ''
      dataList3.value = []
      clickId3.value = ''
      getList(2, true)
      break
    case 2:
      if (item.id == clickId2.value) {
        return
      }
      clickId2.value = item.id
      parentId3.value = item.id
      dataList3.value = []
      clickId3.value = ''
      getList(3, true)
      break
    case 3:
      if (item.id == clickId3.value) {
        return
      }
      clickId3.value = item.id
      break
  }
}

const addOpen = async (type: any) => {
  openType.value = 'add'
  categoryType.value = type
  let parentId = type == 1 ? '0' : type == 2 ? parentId2.value : parentId3.value
  clickId.value = type == 1 ? '' : type == 2 ? clickId1.value : clickId2.value
  clickList.value = type == 1 ? [] : type == 2 ? dataList1.value : dataList2.value
  console.log(type, parentId2.value, parentId3.value)
  // return
  const res = await getAttrByParentId({
    parentId: parentId
  })
  if (res.code == 200) {
    commonList.value = res.data
  }
  dialogTitle1.value =
    categoryType.value == 1
      ? t('productcategory.add1')
      : categoryType.value == 2
      ? t('productcategory.add2')
      : t('productcategory.add3')
  dialog1.value = true
}

const delName = ref('')
const inheritList = ref([])
const delId = ref('')
const editItem = ref<any>()
const openType = ref('')

const editOpen = async (type: Number, item: any) => {
  openType.value = 'edit'
  editItem.value = item
  const res = await categoryDetails(item.id)
  if (res.code == 200) {
    commonList.value = res.data.attrList
    categoryType.value = type
    clickList.value = type == 1 ? [] : type == 2 ? dataList1.value : dataList2.value
    dialogTitle1.value =
      categoryType.value == 1
        ? t('exampleDemo.edit') + t('productcategory.title1')
        : categoryType.value == 2
        ? t('exampleDemo.edit') + t('productcategory.title2')
        : t('exampleDemo.edit') + t('productcategory.title3')
    dialog1.value = true
  }
}

const delOpen = async (type: any, item: any) => {
  delId.value = item.id
  const res = await checkRel({
    id: item.id
  })
  if (res.code != 200) return
  if (res.data) {
    categoryType.value = type
    const res1 = await getCategoryByLevel({
      level: type,
      parentId: item.parentId,
      selfId: item.id,
      isShowDisable: true
    })
    if (res1.code == 200) {
      delName.value = item.categoryName
      inheritList.value = res1.data
      dialog2.value = true
    }
  } else {
    ElMessageBox.confirm(t('common.delMessage'), t('common.delWarning'), {
      confirmButtonText: t('common.delOk'),
      cancelButtonText: t('common.delCancel'),
      type: 'warning'
    }).then(async () => {
      const res = await delcategory({
        id: item.id
      })
      if (res.code) {
        ElMessage.success(res.msg)
        getList(type, false)
      }
    })
  }
}

const saveLoading1 = ref(false)

const save1 = async () => {
  const write = unref(write1Ref)
  const formData = await write?.submit()
  if (formData) {
    saveLoading1.value = true
    try {
      // let sort = 0
      // switch (categoryType.value) {
      //   case 1:
      //     sort =
      //       dataList1.value.length > 0
      //         ? Number(dataList1.value[dataList1.value.length - 1].sort) + 1
      //         : 1
      //     break
      //   case 2:
      //     sort =
      //       dataList2.value.length > 0
      //         ? Number(dataList2.value[dataList2.value.length - 1].sort) + 1
      //         : 1
      //     break
      //   case 3:
      //     sort =
      //       dataList3.value.length > 0
      //         ? Number(dataList3.value[dataList3.value.length - 1].sort) + 1
      //         : 1
      //     break
      // }
      formData.lev = categoryType.value
      formData.parentId = categoryType.value == 1 ? '0' : formData.parentId
      if (openType.value == 'add') {
        formData.sort = categoryType.value == 1 ? dataList1.value[dataList1.value.length - 1].sort + 1 : 0
        switch(categoryType.value){
          case 1:
            formData.sort = dataList1.value.length > 0 ? dataList1.value[dataList1.value.length - 1].sort + 1 : 0
            break
          case 2:
            formData.sort = dataList2.value.length > 0 ? dataList2.value[dataList2.value.length - 1].sort + 1 : 0
            break
          case 3:
            formData.sort = dataList3.value.length > 0 ? dataList3.value[dataList3.value.length - 1].sort + 1 : 0
            break
        }
        const res = await addcategory(formData)
        if (res.code == 200) {
          ElMessage.success(res.msg)
          getList(categoryType.value, false)
          dialog1.value = false
        }
      } else {
        formData.sort = editItem.value.sort
        formData.id = editItem.value.id
        const res = await editcategory(formData)
        if (res.code == 200) {
          ElMessage.success(res.msg)
          getList(categoryType.value, false)
          dialog1.value = false
        }
      }
    } catch (error) {
      console.log(error)
    } finally {
      saveLoading1.value = false
    }
  }
}

const saveLoading2 = ref(false)

const save2 = async () => {
  const write = unref(write2Ref)
  const formData = await write?.submit()
  if (formData) {
    saveLoading2.value = true
    try {
      formData.id = delId.value
      const res = await delcategory(formData)
      if (res.code == 200) {
        ElMessage.success(res.msg)
        getList(categoryType.value, false)
        dialog2.value = false
      }
    } catch (error) {
      console.log(error)
    } finally {
      saveLoading2.value = false
    }
  }
}
</script>

<style lang="less" scoped>
.heigthDiv {
  height: calc(100vh - 148px);
}

.heightoverflow {
  height: calc(100vh - 288px);
  overflow-y: auto;
}

.category_li {
  border-bottom: 1px solid #f0f2f5;
  padding: 13px 18px;

  .hoverDiv {
    display: none;
  }
}

.category_li:hover {
  background: #f0f2f5;

  .edit {
    color: var(--el-color-primary) !important;
  }

  .hoverDiv {
    display: block;
  }

  .hoverNone {
    display: none;
  }
}
</style>
