<script setup lang="tsx">
import { useI18n } from '@/hooks/web/useI18n'
import generateSchema from '@/utils/schemaUtil'
import { Table, TableColumn } from '@/components/Table'
import { ref } from 'vue'
import { useTable } from '@/hooks/web/useTable'
const { tableRegister, tableState } = useTable({
  fetchDataApi: async () => {
    return {
      total: 1,
      list: [
        {
          paramName: '林青沐测试参数',
          paramText: '内容',
          remark: '备注',
          createTimeStr: '创建时间',
          endModifyTimeStr: '修改时间'
        }
      ]
    }
  }
})
const { dataList } = tableState
const testValue = {
  code: 200,
  data: {
    pageColumn:
      '[{"field":"paramName","width":"120px","title":"参数"},{"field":"paramText","width":"120px","title":"内容"},{"field":"remark","width":"120px","title":"备注"},{"field":"createTimeStr","width":"120px","title":"创建时间"},{"field":"endModifyTimeStr","width":"120px","title":"修改时间"}]',
    menuId: '11ea98883ef241acae81636e5c650e3f'
  },
  msg: 'ok!'
}

const { t } = useI18n()
let fieldColumns = ref<TableColumn[]>([])
setTimeout(() => {
  fieldColumns.value = generateSchema(testValue.data.pageColumn, [])
}, 1000)
const show = ref(true)
</script>

<template>
  我是什么
  <Table
    v-if="fieldColumns.length > 0"
    :columns="fieldColumns"
    @register="tableRegister"
    :data="dataList"
  />
  <div class="fixbts" style="color: blue">{{ t('router.dashboard') }}Demo11</div>
  <button>wudi1111111111添加一个tag</button>
  <br />
  <div :class="show ? '[&>.lol]:(!w-300px !block)' : ''">
    <span class="lol color-colorMain">dgs</span>
  </div>

  <div
    style="width: 400px; height: 100px; justify-content: space-around"
    class="border-(1px solid colorMain) !flex-b"
  >
    <span>lqm</span>
    <span>lqm</span>
  </div>
  <button @click="show = !show">点击换色</button>
  <button v-hasPermi="'DashBoard:delete'">wudi222222222删除一个tag</button>
  <br />
  <button v-hasPermi="'DashBoard:put'">wudi3333333333333put一个tag</button>
</template>
