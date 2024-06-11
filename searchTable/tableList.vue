<template>
  <a-spin :spinning="loading">
    <a-table
      class="mt_16"
      :data-source="computedTable"
      @change="pageChange"
      :childrenColumnName="childrenColumnName"
      :row-selection="isOpenSelect ? rowSelection : null"
      :pagination="
        !tableSource.length
          ? {
              pageSize: pagination.pageSize,
              current: pagination.pageNum,
              total: pagination.total,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: total => `总共 ${total} 项`
            }
          : false
      "
      :rowKey="computedTabKey"
      :scroll="{ x: xScroll }"
      :customRow="customRow"
    >
      <a-table-column v-for="c in columns" :key="c.dataIndex" v-bind="c"></a-table-column>
      <slot name="tableOperator"> </slot>
      <template #summary v-if="slots.summary">
        <slot name="summary"></slot>
      </template>
      <template #footer v-if="slots.footer">
        <slot name="footer"></slot>
      </template>
    </a-table>
  </a-spin>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { useTable } from '@/hooks/useTable.js'

const slots = useSlots()
const props = defineProps({
  getTableApi: {
    type: String,
    default: ''
  },
  searchFormData: {
    type: Object,
    default: () => {
      return {}
    }
  },
  xScroll: {
    default: Number,
    default: 1200
  },
  tableRowSelection: {
    type: Object,
    default: () => {
      return {
        selectedRowKeys: [],
        selectRows: []
      }
    }
  },
  isOpenSelect: {
    // 是否开启表格选择
    type: Boolean,
    default: true
  },
  columns: {
    type: Array,
    default: () => []
  },
  isOpenMountedGetData: {
    type: Boolean,
    default: false
  },
  tableKey: {
    //用于表格数据选择
    type: String,
    default: 'id'
  },
  tableSource: {
    type: Array,
    default: () => []
  },
  delParamsKeys: {
    type: Array,
    default: () => []
  },
  childrenColumnName: {
    type: String,
    default: 'children'
  },
  customRow: {
    type: Function,
    default: () => {
      return {}
    }
  }
})

const emit = defineEmits(['update:tableRowSelection', 'getTable'])

const computedTabKey = computed(() => {
  return record => record[props.tableKey]
})

const computedTable = computed(() => {
  //外部传进入的数据不支持分页
  if (props.tableSource.length) {
    return props.tableSource
  } else {
    return tableData.value
  }
})

const {
  tableData,
  searchTable,
  getTable,
  delTableData,
  loading,
  pagination,
  pageChange,
  selectedRowKeysList,
  selectedRowsList,
  rowSelection,
  onSelectChange,
  updateTableData,
  updateLoading
} = useTable({
  isOpenMountedGetData: props.isOpenMountedGetData,
  getTableApi: props.getTableApi,
  searchFormData: props.searchFormData,
  delparamsKeys: props.delParamsKeys
})

// 勾选数据修改将修改的数据推出去
watch(
  () => selectedRowKeysList.value,
  value => {
    emit('update:tableRowSelection', {
      selectedRowKeys: selectedRowKeysList.value,
      selectRows: selectedRowsList.value
    })
  },
  {
    deep: true
  }
)

// 监听传进来勾选的数据
watch(
  () => props.tableRowSelection,
  value => {
    if (value.type === 'manual') {
      //主动清空勾选
      selectedRowKeysList.value = []
      selectedRowsList.value = []
    }
  },
  {
    deep: true
  }
)

watch(
  () => tableData.value,
  () => {
    emit('getTable', tableData.value)
  },
  {
    deep: true
  }
)

defineExpose({
  searchTable,
  getTable,
  delTableData
})
</script>
<style scoped>
:deep(.ant-table-tbody > tr > .ant-table-row-cell-break-word:empty::after) {
  content: '-';
}
:deep(.ant-table-tbody > tr > td:empty::after) {
  content: '-';
}
</style>
