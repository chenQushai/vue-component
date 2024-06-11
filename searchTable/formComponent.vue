<template>
  <a-card class="mb_10" :bodyStyle="{ padding: '20px 20px 0 !important' }">
    <a-form
      ref="formRef"
      :model="searchFormData"
      :labelCol="labelCol"
      :wrapperCol="wrapperCol"
      :labelAlign="labelAlign"
    >
      <a-row :gutter="20">
        <a-col v-for="formItem in formJSON" :key="formItem.key" v-bind="formItem.colProps">
          <a-form-item :label="formItem.label" :name="formItem.key" :rules="formItem.rules">
            <div v-if="formItem.type === 'buttonBox'">
              <slot />
              <a-button v-if="formItem.openExportBtn" class="mr_8" v-on="formItem?.on?.exportBtn">导出</a-button>
              <a-button type="primary" class="mr_8" v-bind="formItem?.props?.confirmBtn" v-on="formItem?.on?.confirmBtn"
                >查询</a-button
              >
              <a-button v-bind="formItem?.props?.resetBtn" v-on="formItem?.on?.resetBtn">重置</a-button>
            </div>

            <component
              v-else
              :is="`a-${formItem.type}`"
              v-bind="formItem.props"
              v-on="formItem?.on || {}"
              v-model:value="searchFormData[formItem.key]"
              @change="formItem.formChange ? formItem.formChange(formItem.key, searchFormData, $event) : null"
            >
              <component
                v-for="formChild in formItem.children"
                :key="formChild?.props?.value"
                :is="`a-${formChild.type}`"
                v-bind="formChild.props"
              >
                {{ formChild?.props?.label }}
              </component>
            </component>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-card>
</template>

<script>
import {
  Input as AInput,
  DatePicker as ADatePicker,
  Select as ASelect,
  SelectOption as ASelectOption,
  TreeSelect as ATreeSelect,
  RangePicker as ARangePicker,
  InputNumber as AInputNumber
} from 'ant-design-vue'
import 'ant-design-vue/lib/input/style'
import 'ant-design-vue/lib/date-picker/style'
import 'ant-design-vue/lib/tree-select/style'
import 'ant-design-vue/lib/cascader/style'
import 'ant-design-vue/lib/input-number/style'
export default {
  components: {
    AInput,
    ADatePicker,
    ASelect,
    ASelectOption,
    ATreeSelect,
    ARangePicker,
    AInputNumber
  },
  props: {
    labelCol: {
      type: Object,
      default: () => {
        return {}
      }
    },
    wrapperCol: {
      type: Object,
      default: () => {
        return {}
      }
    },
    labelAlign: {
      type: String,
      default: 'right'
    },
    searchFormData: {
      type: Object,
      default: () => {
        return {}
      }
    },
    searchType: {
      type: String,
      default: () => {
        return ''
      }
    },
    formJSON: {
      type: Array,
      default: () => {
        return [
          {
            key: 'name',
            label: '输入框',
            type: 'input',
            props: {
              allowClear: true,
              placeholder: '请输入'
            },
            colProps: {
              sm: 24,
              md: 24,
              lg: 12,
              xl: 6,
              xxl: 6
            }
          }
        ]
      }
    }
  },
  created () {},
  data () {
    return {}
  },
  methods: {
    async validateFields () {
      await this.$refs.formRef.validateFields()
    },
    resetForm () {
      for (let key in this.searchFormData) {
        this.searchFormData[key] = this.searchType == 'string' ? '' : null
      }
      // this.$refs.formNode.resetFields()
    }
  }
}
</script>
<style scoped>
.ant-card-body {
  padding: 20px 20px 0;
}
</style>
