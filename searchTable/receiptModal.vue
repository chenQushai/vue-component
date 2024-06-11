<template>
  <a-modal
    ref="modalNode"
    @cancel="Cancel"
    :visible="computedVisible"
    :title="title"
    :style="{ width: widthM }"
    @ok="ok"
    ok-text="确定"
    cancel-text="取消"
    destroyOnClose
  >
    <slot></slot>
    <formComponent :formJSON="formJSON" :searchFormData="searchFormData"></formComponent>
    <a-spin :spinning="loading">
      <a-table
        class="mt_16"
        :data-source="tableData"
        @change="pageChange"
        :row-selection="rowSelection"
        :pagination="{
          pageSize: pagination.pageSize,
          current: pagination.pageNum,
          total: pagination.total,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: total => `共${total}项数据`
        }"
        :scroll="{ x: scrollX, y: '290px' }"
        :rowKey="computedTabKey"
      >
        <a-table-column v-for="c in columns" v-bind="c" :key="c.dataIndex"></a-table-column>
      </a-table>
    </a-spin>
  </a-modal>
</template>

<script setup>
import {ref, reactive, nextTick} from 'vue'
import formComponent from './formComponent.vue'
import {useTable} from '@/hooks/useTable.js'
import {axle} from '@/api/axle'
import {message} from 'ant-design-vue'

const emit = defineEmits(['update:visible', 'submit', 'update:searchFormData'])
const props = defineProps({
  title: '',
  getTableApi: '',
  visible: {
    type: Boolean,
    default: false
  },
  formJSON: {
    type: Array,
    default: () => []
  },
  searchFormData: {
    type: Object,
    default: () => {
      return {}
    }
  },
  checkboxType: {
    type: String,
    default: 'radio'
  },
  columns: {
    type: Array,
    default: () => []
  },
  tableKey: {
    type: String,
    default: 'id'
  },
  widthM: {
    type: String,
    default: '1100px'
  },
  scrollX: {
    type: String,
    default: '1000px'
  },
  notExclude: {
    type: Array,
    default: () => []
  }
})

const computedTabKey = computed(() => {
  return record => record[props.tableKey]
})

const computedVisible = computed({
  get() {
    return props.visible
  },
  set(val) {
    emit('update:visible', val)
  }
})

watch(
  () => props.visible,
  value => {
    if (value) {
      getTable()
    }
  },
  {
    immediate: true
  }
)

const resetForm = auto => {
  const formJSONKeys = props.formJSON.map(item => item.key)
  const searchFormDataCopy = JSON.parse(JSON.stringify(props.searchFormData))
  for (let key in props.searchFormData) {
    if (formJSONKeys.includes(key) && !props.notExclude.includes(key)) {
      delete searchFormDataCopy[key]
    }
  }

  emit('update:searchFormData', searchFormDataCopy)
  if (!auto) {
    //触发reset刷新列表，自动关闭不刷新（比如确定，X自动关闭）
    nextTick(() => {
      searchTable()
    })
  }
}

let selectedRowKeysList = ref(null)
let selectedRowsList = ref(null)
let rowSelection = computed(() => {
  return {
    columnWidth: 45,
    type: props.checkboxType,
    selectedRowKeys: selectedRowKeysList,
    onChange: (selectedRowKeys, selectedRows) => {
      selectedRowKeysList.value = selectedRowKeys
      selectedRowsList.value = selectedRows
    }
  }
})

let loading = ref(false)
let updateLoading = ref(false) //更新等待
let pagination = ref({
  pageNum: 1,
  pageSize: 10,
  total: 0
})

// 获取表格数据
let tableData = ref([])
let defalutDelParamskeys = ['businessTime', 'useTime'] //默认需要删除的参数

const getTable = async () => {
  console.log(props.searchFormData)
  let params = {
    ...pagination.value,
    ...props.searchFormData
  }
  try {
    loading.value = true
    // defalutDelParamskeys = Array.from(new Set(
    //     [...defalutDelParamskeys, ...delparamsKeys]
    // ))
    // 需要删除某些参数字段
    for (let key in params) {
      if (defalutDelParamskeys.includes(key)) {
        delete params[key]
      }
    }
    const {data, code, message: msg} = await axle.get(props.getTableApi, params)
    loading.value = false
    if (code === 0) {
      tableData.value = []
      tableData.value = data.records || []
      pagination.value.total = data.total
      // 查询表格清空所有勾选
      selectedRowKeysList.value = []
      selectedRowsList.value = []
    }
  } catch {
    loading.value = false
  }
}

const searchTable = () => {
  pagination.value.pageNum = 1
  getTable()
}

// 分页修改
const pageChange = page => {
  pagination.value.pageNum = page.current
  pagination.value.pageSize = page.pageSize
  getTable()
}

let modalNode = ref(null)
const Cancel = () => {
  resetForm('auto')
  pagination.value = {
    pageNum: 1,
    pageSize: 10,
    total: 0
  }
  tableData.value = []
  selectedRowsList.value = []
  emit('update:visible', false)
}
const ok = () => {
  console.log(selectedRowsList.value)
  emit('submit', selectedRowsList.value)
  Cancel()
}

defineExpose({
  searchTable,
  resetForm
})
</script>
<style scoped>
:deep(.ant-card-body) {
  padding-bottom: 0px;
}
</style>
