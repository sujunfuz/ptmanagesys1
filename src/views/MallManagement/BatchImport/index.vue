<template>
  <ContentWrap>
    <div class="flex-b">
      <div v-hasPermi="'goods:ecSpu:exportTemplate'">
        <div class="flex">
          <Icon icon="svg-icon:execl" size="50" />
          <div class="ml-13px">
            <div class="colorMain cursor-pointer" @click="batchExport">{{
              t('batchImport.title')
            }}</div>
            <div class="colorGrey mt-4px">12.56KB</div>
          </div>
        </div>
        <div class="colorGrey mt-14px">
          <div class="fontSize13-5">1. {{ t('batchImport.tip1') }} </div>
          <div class="mt-7px fontSize13-5">2.{{ t('batchImport.tip2') }}</div>
        </div>
      </div>
      <div>
        <el-button
          v-hasPermi="'goods:ecSpu:importExcel'"
          type="primary"
          @click="dialogVisible = true"
          >{{ t('batchImport.export') }}</el-button
        >
      </div>
    </div>
  </ContentWrap>

  <ContentWrap class="mt-20px flex-1" :isBlock="false">
    <Table
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
  /></ContentWrap>
  <Dialog v-model="dialogVisible" :title="t('batchImport.upload')" max-height="360px">
    <div
      v-if="flagShow"
      class="w-600px text-center pb-10px overflow-hidden m-auto flex flex-justify-center"
    >
      <div class="flex flex-justify-center">
        <Form :schema="schema" label-width="auto" />
      </div>
    </div>
    <div
      v-else
      class="bgcolorMainGrey h-190px w-100% text-center pt-40px pb-40px overflow-hidden m-auto flex justify-around flex-items-center"
    >
      <div class="w-700px">
        <Icon icon="svg-icon:execlCenter" :size="50" />
        <div class="mt-20px">{{ t('image.sub5') }}</div>
      </div>
    </div>

    <!-- <template #footer>
      <ElButton @click="dialogVisible = false">{{ t('common.cancel') }}</ElButton>
      <ElButton type="primary" :loading="saveLoading" @click="save">
        {{ t('project.confirm') }}
      </ElButton>
    </template> -->
  </Dialog>
</template>

<script setup lang="tsx">
import { ContentWrap } from '@/components/ContentWrap'
import { ElButton, ElTag, ElMessage } from 'element-plus'
import { useI18n } from '@/hooks/web/useI18n'
import { useTable } from '@/hooks/web/useTable'
import { useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { reactive, ref, unref } from 'vue'
import { TableColumn, Table } from '@/components/Table'
import { Dialog } from '@/components/Dialog'
import { Form } from '@/components/Form'
import { FormSchema } from '@/components/Form'
import Icon from '@/components/Icon/src/Icon.vue'
import UploadImage from '@/components/UploadImage/UploadImage.vue'
import {
  getExportTemplateApi,
  importExcelApi,
  excelPageListApi
} from '@/api/mallManagement/productList'

const { t } = useI18n()

const dialogVisible = ref(false)

const saveLoading = ref(false)

const imageUrl = ref('')

const batchExport = async () => {
  const res = await getExportTemplateApi()
  if (res) {
    let downloadElement = document.createElement('a')
    let href = window.URL.createObjectURL(res as unknown as Blob) // 创建下载的链接
    downloadElement.href = href
    downloadElement.download = new Date().getTime() + '.xlsx' // 下载后文件名
    document.body.appendChild(downloadElement)
    downloadElement.click() // 点击下载
    document.body.removeChild(downloadElement) // 下载完成移除元素
    window.URL.revokeObjectURL(href) // 释放blob对象
  }
}
const flagShow = ref(true)
const fileUrl = ref<any>([])

const schema = reactive<FormSchema[]>([
  {
    field: 'imgUrl',
    formItemProps: {
      style: {
        width: '500px'
      },
      slots: {
        default: (data: any) => {
          return (
            <>
              <UploadImage
                limit={2}
                onUpdateImgUrl={(val) => {
                  if (val.code == 200) {
                    flagShow.value = false
                    getList()
                  }
                }}
                class="customClass"
                showCenter={false}
                btnStyle={false}
                dragIs={false}
              ></UploadImage>
            </>
          )
        }
      }
    }
  }
  // {
  //   field: 'imgUrl',
  //   component: 'Upload',
  //   componentProps: {
  //     drag: true,
  //     action: requestUrl,
  //     showFileList: false,
  //     onSuccess: (_response, uploadFile) => {
  //       imageUrl.value = URL.createObjectURL(uploadFile.raw!)
  //     },
  //     beforeUpload: (rawFile) => {
  //       if (rawFile.type !== 'image/jpeg') {
  //         ElMessage.error('Avatar picture must be JPG format!')
  //         return false
  //       } else if (rawFile.size / 1024 / 1024 > 2) {
  //         ElMessage.error('Avatar picture size can not exceed 2MB!')
  //         return false
  //       }
  //       return true
  //     },
  //     slots: {
  //       default: () => (
  //         <>
  //           {imageUrl.value ? <img src={imageUrl.value} class="avatar" /> : null}
  //           {!imageUrl.value ? (
  //             <div class="w-100% flex flex-justify-center">
  //               <div class="">
  //                 <Icon icon="svg-icon:uploadcloud" size={50} />
  //                 <div class="el-upload__text">{t('image.sub7')}</div>
  //                 <div class="el-upload__tip">{t('image.sub6')}</div>
  //                 <ElButton class="mt-10px">{t('image.sub8')}</ElButton>
  //               </div>
  //             </div>
  //           ) : null}
  //         </>
  //       )
  //     }
  //   }
  // }
])
const { tableRegister, tableState, tableMethods } = useTable({
  fetchDataApi: async () => {
    const { pageSize, currentPage } = tableState
    const res = await excelPageListApi({
      currentPage: unref(currentPage),
      pageSize: unref(pageSize)
    })
    return {
      list: res.data.list,
      total: res.data.total
    }
  }
})

const { total, loading, dataList, pageSize, currentPage } = tableState
const { getList, getElTableExpose, delList } = tableMethods
const crudSchemas = reactive<TableColumn[]>([
  {
    field: 'operatorName',
    label: t('batchImport.operator'),
    search: {
      hidden: true
    }
  },
  {
    field: 'totalRow',
    label: t('batchImport.number'),
    search: {
      hidden: true
    }
  },
  {
    field: 'status',
    label: t('batchImport.status'),
    search: {
      hidden: true
    },
    slots: {
      default: (data: any) => {
        return (
          <>
            <ElTag
              type={
                data.row.status === 'FAIL'
                  ? 'danger'
                  : data.row.status === 'SUCCESS'
                  ? 'success'
                  : ''
              }
            >
              {data.row.statusStr}
            </ElTag>
          </>
        )
      }
    }
  },
  {
    field: 'successRow',
    label: t('batchImport.success'),
    search: {
      hidden: true
    }
  },
  {
    field: 'failRow',
    label: t('batchImport.fail'),
    search: {
      hidden: true
    }
  },
  {
    field: 'createTimeStr',
    label: t('batchImport.time'),
    search: {
      hidden: true
    }
  },
  {
    field: 'action',
    label: t('userDemo.action'),
    width: '100px',
    form: {
      hidden: true
    },
    detail: {
      hidden: true
    },
    search: {
      hidden: true
    },
    table: {
      slots: {
        default: (data: any) => {
          // const row = data.row as DepartmentUserItem
          return (
            <>
              <div class="[&>span]:(cursor-pointer m-2) flex flex-wrap colorMain ">
                <span v-hasPermi="goods:ecSpu:download" onClick={() => action(data.row.filePath)}>
                  {' '}
                  {t('batchImport.download')}{' '}
                </span>
              </div>
            </>
          )
        }
      }
    }
  }
])
const { allSchemas } = useCrudSchemas(crudSchemas)

const imgUrl = import.meta.env.VITE_IMG_URL

const action = async (path) => {
  let temp = imgUrl + path
  console.log(path)
  let elemIF = document.createElement('iframe')
  elemIF.src = temp
  elemIF.style.display = 'none'
  document.body.appendChild(elemIF)
}
</script>

<style lang="less" scoped>
:deep(.customClass) {
  width: 100%;
  height: 100%;
  .el-upload {
    border: none !important;
  }
  .el-upload--picture-card {
    border: none !important;
    background-color: transparent !important;
    width: auto !important;
    height: auto !important;
  }
  .el-upload-list {
    display: none;
  }
}
</style>
