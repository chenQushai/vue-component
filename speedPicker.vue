<template>
    <el-popover trigger="focus" v-model="pickerVisible" popper-class="speed-popover" :disabled="disabled">
        <el-input ref="reference" slot="reference" class="el-date-editor" readonly :disabled="disabled" :size="size"
            :placeholder="placeholder" :value="inputValue" :validate-event="false" :style="{ width }"
            @mouseenter.native="handleMouseEnter" @mouseleave.native="showClose = false">
            <i slot="suffix" class="el-input__icon" :class="showClose ? clearIcon : 'el-icon-date'" @click="handleClickIcon"
                @mousedown="handleMousedownIcon">
            </i>
        </el-input>
        <div class="speed-picker">
            <div class="el-date-picker__header el-date-picker__header--bordered">
                <button type="button" aria-label="前一年" @click="prevYear"
                    class="el-picker-panel__icon-btn el-date-picker__prev-btn el-icon-d-arrow-left">
                </button>
                <button type="button" aria-label="前一项目" style="margin-left: 10px;" @click="preItem"
                    class="el-picker-panel__icon-btn el-date-picker__prev-btn el-icon-arrow-left"
                    :class="!value.filter(item => item).length ? 'arrow-left--disabled' : ''">
                </button>
                <span role="button" class="el-date-picker__header-label">{{ yearLabel }}</span>


                <button type="button" aria-label="后一年" @click="nextYear"
                    class="el-picker-panel__icon-btn el-date-picker__next-btn el-icon-d-arrow-right">
                </button>
                <button type="button" aria-label="后一项目" style="margin-right: 10px;" @click="nextItem"
                    class="el-picker-panel__icon-btn el-date-picker__next-btn el-icon-arrow-right"
                    :class="!value.filter(item => item).length ? 'arrow-right--disabled' : ''">
                </button>
            </div>

            <div class="speed-picker-content">
                <div class="speed-picker-item" ref="pickerItem"
                    :class="[itemAactiveStyle(p.value), pickerOptions.disabledDate(p.value) ? 'speed-picker-item--disabled' : '']"
                    :key="p.text" v-for="p, index in computedType" @click="p.onclick(p, index)">
                    {{ p.text }}
                </div>
            </div>
        </div>
    </el-popover>
</template>
  
<script>

import { formatDate, prevYear, nextYear,} from 'element-ui/src/utils/date-util'
import { hasClass } from 'element-ui/src/utils/dom'
export default {
    name: 'speedPicker',
    props: { 
        type: {
            type: String,
            default: 'quarter'
        },
        size: {
            type: String,
        },
        placeholder: {
            type: String,
            default: '请选择日期'
        },
        clearable: {
            type: Boolean,
            default: true
        },
        clearIcon: {
            type: String,
            default: 'el-icon-circle-close'
        },
        width: {
            type: String
        },
        popoverWidth: { //弹出窗宽度
            width: String,
            default: '226'
        },
        disabled: {
            type: Boolean
        },
        valueFormat: {
            type: String,
            default: 'yyyy-MM'
        },
        value: {
            type: Array,
            default: () => []
        },
        pickerOptions: {
            type: Object,
            default: () => {
                return {
                    disabledDate: (timeRange) => {
                        const now = new Date().getTime();
                        return now < timeRange[0].getTime() && now < timeRange[1].getTime()
                    }
                }
            }
        },
    },
    model: {
        prop: "value"
    },
    data() {
        return {
            pickerVisible: false,
            showClose: false,
            date: new Date(),
            inputValue: ''
        }
    },
    methods: {
        handleMouseEnter() {
            if (this.disabled) return
            if (this.value && this.clearable) {
                this.showClose = true
            }
        },
        handleClickIcon() {
            if (this.disabled) return
            if (this.showClose) {
                this.$emit('input', [])
                this.$emit('change', [])
                this.showClose = false
                this.pickerVisible = false
                this.$refs.reference.blur()
            }
        },
        handleMousedownIcon(event) {
            event.preventDefault()
        },
        // 切换年份
        prevYear() {
            this.date = prevYear(this.date)
        },
        nextYear() {
            this.date = nextYear(this.date)
        },

        // 获取当前日期在列表中的index项目
        getIndex() {
            let index = null;
            const startDate = new Date(formatDate(this.value[0], 'yyyy-MM')).getTime();
            const endDate = new Date(formatDate(this.value[1], 'yyyy-MM')).getTime();
            this.computedType.forEach((item, i) => {
                if (startDate >= item.value[0].getTime() && startDate <= item.value[1].getTime()
                    && endDate >= item.value[0].getTime() && endDate <= item.value[1].getTime()) {
                    index = i;
                }
            });
            return index
        },
        // prepreItem,切换季度或者年份
        preItem() {
            if (!this.value.length) return
            const length = this.computedType.length;

            let index = this.getIndex();
            index--
            const disabled = hasClass(this.$refs["pickerItem"][index], 'speed-picker-item--disabled');
            if (disabled) return
            // 当减到小于0回到上一年
            if (index < 0) {
                this.prevYear();
                index = length - 1;
            }
            // 修改上切换后的日期
            this.pick(this.computedType[index].value[0], this.computedType[index].value[1])
        },
        nextItem() {
            if (!this.value.length) return
            const length = this.computedType.length;
            let index = this.getIndex();
            index++;
            const disabled = hasClass(this.$refs["pickerItem"][index], 'speed-picker-item--disabled');
            if (disabled) return
            // 大于长度，到下一年
            if (index > length - 1) {
                this.nextYear()
                index = 0
            }
            this.pick(this.computedType[index].value[0], this.computedType[index].value[1])
        },
        // 回显操作方法
        getter(value) {
            if (!Array.isArray(value) || !value[0] || !value[1]) {
                return ''
            }
            const startDate = new Date(formatDate(value[0], 'yyyy-MM')).getTime();
            const endDate = new Date(formatDate(value[1], 'yyyy-MM')).getTime();
            const item = this.computedType.filter((item) => {
                return startDate >= item.value[0].getTime() && startDate <= item.value[1].getTime()
                    && endDate >= item.value[0].getTime() && endDate <= item.value[1].getTime()
            })
            // // 如果没有找到，说明传入的值并非在设定范围
            if (!item.length) {
                return ''
            }
            else {
                return `${this.year}年${item?.[0].text}`
            }

        },
        pick(start, end) {
            const datePicker = [formatDate(start, this.valueFormat), formatDate(end, this.valueFormat)];
            this.$emit('input', datePicker)
            this.$emit('change', datePicker)
        }
    },
    computed: {
        computedType() {
            if (this.type === 'quarter') {
                return [
                    {
                        text: "一季度",
                        value: [new Date(formatDate(`${this.year}-01`, 'yyyy-MM')), new Date(formatDate(`${this.year}-03`, 'yyyy-MM'))],
                        onclick: (item, index) => {
                            // 如果禁用状态返回
                            const disabled = hasClass(this.$refs["pickerItem"][index], 'speed-picker-item--disabled');
                            if (disabled) return
                            this.pick(item.value[0], item.value[1])
                        }
                    },
                    {
                        text: "二季度",
                        value: [new Date(formatDate(`${this.year}-04`, 'yyyy-MM')), new Date(formatDate(`${this.year}-06`, 'yyyy-MM'))],
                        onclick: (item, index) => {
                            const disabled = hasClass(this.$refs["pickerItem"][index], 'speed-picker-item--disabled');
                            if (disabled) return
                            this.pick(item.value[0], item.value[1])
                        }
                    },
                    {
                        text: "三季度",
                        value: [new Date(formatDate(`${this.year}-07`, 'yyyy-MM')), new Date(formatDate(`${this.year}-09`, 'yyyy-MM'))],
                        onclick: (item, index) => {
                            const disabled = hasClass(this.$refs["pickerItem"][index], 'speed-picker-item--disabled');
                            if (disabled) return
                            this.pick(item.value[0], item.value[1])
                        }
                    },
                    {
                        text: "四季度",
                        value: [new Date(formatDate(`${this.year}-10`, 'yyyy-MM')), new Date(formatDate(`${this.year}-12`, 'yyyy-MM'))],
                        onclick: (item, index) => {
                            const disabled = hasClass(this.$refs["pickerItem"][index], 'speed-picker-item--disabled');
                            if (disabled) return
                            this.pick(item.value[0], item.value[1])
                        }
                    }
                ]
            }
            else if (this.type === 'halfYear') {
                return [
                    {
                        text: "上半年",
                        value: [new Date(formatDate(`${this.year}-01`, 'yyyy-MM')), new Date(formatDate(`${this.year}-06`, 'yyyy-MM'))],
                        onclick: (item, index) => {
                            const disabled = hasClass(this.$refs["pickerItem"][index], 'speed-picker-item--disabled');
                            if (disabled) return
                            this.pick(item.value[0], item.value[1])
                        }
                    },
                    {
                        text: "下半年",
                        value: [new Date(formatDate(`${this.year}-07`, 'yyyy-MM')), new Date(formatDate(`${this.year}-12`, 'yyyy-MM'))],
                        onclick: (item, index) => {
                            const disabled = hasClass(this.$refs["pickerItem"][index], 'speed-picker-item--disabled');
                            if (disabled) return
                            this.pick(item.value[0], item.value[1])
                        }
                    },
                ]
            }
            else {
                return []
            }
        },
        year() {
            return this.date.getFullYear()
        },
        yearLabel() {
            return `${this.year}年`
        },
        // 检查是否选中当年当季度或上半年
        itemAactiveStyle() {
            return (val) => {

                if (!this.value.length) return 'speed-picker-item--normal'

                const startDate = new Date(formatDate(this.value[0], 'yyyy-MM')).getTime();
                const endDate = new Date(formatDate(this.value[1], 'yyyy-MM')).getTime();

                if (startDate >= val[0].getTime() && startDate <= val[1].getTime() && endDate >= val[0].getTime() && endDate <= val[1].getTime()) {
                    return 'speed-picker-item--active'
                }
                else {
                    return 'speed-picker-item--normal'
                }

            }
        }
    },
    watch: {
        value: {
            handler(val) {
                this.inputValue = this.getter(val)
            },
            immediate: true
        }
    },

}
</script>

<style lang="scss" scoped>
@import '@/assets/changePopStyle.css';


.speed-picker {
    line-height: 30px;
}

.speed-picker-content {
    padding: 12px;
    display: flex;
    justify-content: flex-start;
    font-size: 12px;
    min-width: 216px;

    .speed-picker-item {
        flex-basis: 80px;
        height: 48px;
        padding: 8px;
        text-align: center;
        color: #606266;
        cursor: pointer;
        margin: 0 4px;

        &--normal {
            &:hover {
                color: #409eff;
            }
        }

        &--active {
            background-color: #409eff;
            color: #ffffff;

            &:hover {
                color: #ffffff;
            }
        }

        &--disabled {
            background-color: #f5f7fa;
            cursor: not-allowed;
            color: #c0c4cc;

            &:hover {
                color: #c0c4cc;
            }
        }
    }
}

.arrow-left--disabled {
    color: #c0c4cc;
    cursor: not-allowed;
}

.arrow-right--disabled {
    color: #c0c4cc;
    cursor: not-allowed;
}
</style>
  