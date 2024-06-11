import { ref, onMounted, watch } from "vue"
import { axle } from '@/api/axle'
import { message } from 'ant-design-vue';
export const useTable = ({ isOpenMountedGetData = true, getTableApi, searchFormData, delparamsKeys = [] }) => {
    let formNode = ref(null) //表单实例
    let loading = ref(false)
    let updateLoading = ref(false) //更新等待
    let selectedRowKeysList = ref([]) //勾选的key
    let selectedRowsList = ref([])//勾选的表格行
    let pagination = ref({
        pageNum: 1,
        pageSize: 10,
        total: 0
    })
    let defalutDelParamskeys = ['total', 'time', 'useTime'] //默认需要删除的参数

    let manualChangeTableApi = null //用于手动切换接口api，一般是在searchTable的时候
    let manualChangeParams = null
    // 获取表格数据
    let tableData = ref([])
    const getTable = async () => { //tableAPi用于手动切换接口时使用,params也是同理
        let params = {
            ...pagination.value,
            ...searchFormData,
            ...manualChangeParams
        }
        try {

            loading.value = true
            // 组合需要删除的参数
            defalutDelParamskeys = Array.from(new Set(
                [...defalutDelParamskeys, ...delparamsKeys]
            ))
            // 需要删除某些参数字段
            for (let key in params) {
                if (defalutDelParamskeys.includes(key)) {
                    delete params[key]
                }
            }
            const { data, code, message: msg } = await axle.get(manualChangeTableApi || getTableApi, params)
            loading.value = false
            if (code === 0) {
                // message.success(msg);
                // console.log('获取的表格数据', data)
                tableData.value = data.records || []

                pagination.value.total = data.total

                // 查询表格清空所有勾选
                selectedRowKeysList.value = []
                selectedRowsList.value = []
            }


        }
        catch {
            loading.value = false
        }

    }

    const searchTable = (tableApi, param) => {
        pagination.value.pageNum = 1
        manualChangeTableApi = tableApi
        manualChangeParams = param
        getTable()
    }

    // 分页修改
    const pageChange = (page) => {
        pagination.value.pageNum = page.current;
        pagination.value.pageSize = page.pageSize;
        getTable()

    }

    onMounted(() => {
        // 是否开启在页面加载时获取表格数据
        if (isOpenMountedGetData) {
            getTable()
        }

    })
    // 表格选择
    const rowSelection = ref({
        checkStrictly: true,
        selectedRowKeys: selectedRowKeysList,
        onChange: (selectedRowKeys, selectedRows) => {

            selectedRowKeysList.value = selectedRowKeys
            selectedRowsList.value = selectedRows

        },
        onSelect: (record, selected, selectedRows) => {
            // console.log(record, selected, selectedRows);
        },
        onSelectAll: (selected, selectedRows, changeRows) => {
            // console.log(selected, selectedRows, changeRows);
        },
    });

    // 新增数据
    const addTableData = async (addDataApi, params, finisHandler = true, requestFormat = 'postMultipart') => {

        try {

            loading.value = true
            const { data, code, message: msg } = await axle[requestFormat](addDataApi, params)
            loading.value = false
            if (code === 0) {
                message.success(msg);
                if (finisHandler) {
                    getTable()
                }
            }

        }
        catch {
            loading.value = false
        }

    }

    // 跟更新表格
    const updateTableData = async ({ updateDataApi, params, callBack, finisHandler = true, requestFormat = 'postMultipart' }) => {
        try {
            updateLoading.value = true
            const { data, code, message: msg } = await axle[requestFormat](updateDataApi, params)
            updateLoading.value = false
            if (code === 0) {
                message.success(msg);
                if (finisHandler) {
                    getTable()
                }

            }
            callBack(code)
        }
        catch {
            updateLoading.value = false
        }
    }

    // 删除表格

    const delTableData = async ({ delDataApi, params, callBack }) => {
        try {

            const { data, code, message: msg } = await axle.delete(delDataApi, params)

            if (code === 0) {
                message.success(data || msg);
                getTable()
            }
        }
        catch {

        }
    }

    return {
        pagination,
        formNode,
        rowSelection,
        selectedRowKeysList,
        selectedRowsList,
        loading,
        updateLoading,
        tableData,
        getTable,
        searchTable,
        pageChange,
        addTableData,
        updateTableData,
        delTableData
    }
}

