<template>
  <div class="font-size-20px color-colorBlack">{{ t('accountPage.title2') }} </div>
  <div class="mt-20px h-600px bg-white overflow-hidden">
    <Table v-if="dataList.length != 0" :columns="tableSchema" :data="dataList" :loading="loading" />
    <Empty v-else />
  </div>
</template>
<script setup lang="tsx">
import { Table, TableColumn } from '@/components/Table'
import { useTable } from '@/hooks/web/useTable'
import { reactive, ref, onMounted } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
const { t } = useI18n()
import Empty from '@/components/customComponents/Empty/index.vue'
import { ElButton } from 'element-plus'
// 表格
const tableSchema = ref<TableColumn[]>([])
const constantSchema: TableColumn[] = [
  {
    field: 'orderNo',
    label: t('accountPage.id')
  },
  {
    field: 'price',
    label: t('accountPage.money')
  }
]

const { tableMethods, tableState } = useTable({
  fetchDataApi: async () => {
    return {
      list: [
        {
          orderNo: '10010252151321',
          price: '400'
        },
        {
          orderNo: '10010252151321',
          price: '300'
        }
      ],
      total: 2
    }
  }
})
const { dataList, loading } = tableState
onMounted(() => {
  setTimeout(() => {
    tableSchema.value = constantSchema
  }, 100)
})
</script>
<style scoped lang="less"></style>
