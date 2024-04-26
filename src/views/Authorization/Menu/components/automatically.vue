<template>
  <div>
    <div class="pl-15px">
      <Search :schema="schema" :showReset="false" @search="setSearchParams" />
    </div>

    <Table
      class="mt-20px"
      height="320px"
      v-if="dataList.length != 0"
      :columns="allSchemas.tableColumns"
      :data="dataList"
      :loading="loading"
      @register="tableRegister"
    />
    <Empty v-else />
  </div>
</template>

<script setup lang="tsx">
import Empty from '@/components/customComponents/Empty/index.vue'
import { generatorUI, tableNameData } from '@/api/authorization/menu'
import { reactive, ref, unref, onBeforeMount } from 'vue'
import { Search } from '@/components/Search'
import { FormSchema } from '@/components/Form'
import { useI18n } from '@/hooks/web/useI18n'
import { useTable } from '@/hooks/web/useTable'
import { useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { TableColumn, Table } from '@/components/Table'
const { t } = useI18n()

const props = defineProps({
  fieldConfigID: {
    type: String,
    default: () => ''
  }
})

const restaurants = ref<any>([])
const createFilter = (queryString: string) => {
  return (restaurant: any) => {
    return restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
  }
}

const resTableNameData = ref([])
const loadAll = async () => {
  const tableRes = await tableNameData()
  resTableNameData.value = tableRes.data.list
  return tableRes.data.list
}

onBeforeMount(() => {
  restaurants.value = loadAll()
})

const { tableRegister, tableState, tableMethods } = useTable({
  fetchDataApi: async () => {
    // let temp = unref(searchParams).tableName == '操作员字段表'
    let a = unref(searchParams)
    // if (temp) {
    //   a.tableName = 'c_pms_operator_column'
    // }
    const res = await generatorUI({ ...a })
    let result = res.data.columns
    result.forEach((item) => {
      Object.assign(item, { status: 'ACTIVE' })
    })
    return {
      list: result
    }
  },
  immediate: false
})

const { loading, dataList } = tableState
const { getList } = tableMethods

const schema = reactive<FormSchema[]>([
  {
    field: 'tableName',
    label: '',
    // value: '操作员字段表',
    component: 'Autocomplete',
    componentProps: {
      slots: {
        prepend: () => <div>{t('fields.tableName')}</div>
      },
      fetchSuggestions: (queryString: string, cb: any) => {
        const results = queryString
          ? resTableNameData.value.filter(createFilter(queryString))
          : resTableNameData.value
        // call callback function to return suggestions
        cb(results)
      }
    }
  }
])

const searchParams = ref({ menuId: props.fieldConfigID })
const setSearchParams = (params: any) => {
  let resTableName
  resTableNameData.value.map((item) => {
    if (item.value == params.tableName) {
      resTableName = item.tableName
    }
  })
  searchParams.value.tableName = resTableName
  getList()
}

const crudSchemas = reactive<TableColumn[]>([
  {
    field: 'index',
    label: t('project.sort'),
    form: {
      hidden: true
    },
    search: {
      hidden: true
    },
    detail: {
      hidden: true
    },
    table: {
      type: 'index'
    }
  },
  {
    field: 'columnValue',
    label: t('fields.fieldName'),
    search: {
      hidden: true
    }
  },
  {
    field: 'columnKey',
    label: t('fields.annotate'),
    search: {
      hidden: true
    }
  },
  {
    field: 'wit',
    label: t('fields.width'),
    search: {
      hidden: true
    }
  }
])
const { allSchemas } = useCrudSchemas(crudSchemas)

defineExpose({
  dataList
})
</script>
