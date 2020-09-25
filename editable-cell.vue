<template>
    <div class="editable-wrapper"
         @mouseover="showPen"
         @mouseout="closePen">
        <div class="input-wrapper"
             v-if="edit">
            <el-input
                    placeholder="请输入内容"
                    size="mini"
                    v-model="text"
                    v-if="type === 'text'">
            </el-input>

            <el-date-picker
                    v-model="text"
                    type="date"
                    v-if="type === 'date'"
                    value-format="yyyy-MM-dd"
                    placeholder="选择日期">
            </el-date-picker>

            <i class="el-icon-check" @click="endEdit"></i>
        </div>
        <span class="wrapper-text" v-if="!edit">
           {{text}}
             <i class="el-icon-edit"
                v-show="pen"
                @click="startEdit"></i>
        </span>
    </div>
</template>

<script>
    export default {
        name: "editable-cell",
        props: {
            text: {
                type: String,
                default: ''
            },
            type: {
                type: String,
                required: true,
                default: 'text'
            }
        },
        model: {
            prop: 'text',
        },
        data() {
            return {
                edit: false,
                pen: false,
            }
        },
        methods: {
            showPen() {
                this.pen = true;
            },
            closePen() {
                this.pen = false;
            },
            startEdit() {
                this.edit = true;
            },
            endEdit() {
                this.edit = false;
                this.$emit('input', this.text)
            },
        }
    }
</script>

<style lang="scss" scoped>
    .editable-wrapper {
        position: relative;
        width: 100%;

        .input-wrapper {
            padding-right: 15px;
        }

        .wrapper-text {
            display: inline-block;
            padding-right: 15px;
        }
        .el-icon-check {
            position: absolute;
            top: 50%;
            margin-top: -7px;
            right: -2px;
            cursor: pointer;
        }
        .el-icon-edit {
            position: absolute;
            top: 50%;
            margin-top: -7px;
            right: 3px;
            cursor: pointer;
        }
    }
</style>