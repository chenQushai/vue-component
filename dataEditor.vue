<template>
    <div
        class="data-editor"
        :class="{ 'is-error': isError, 'is-success': isSuccess }"
    >
        <el-input
            v-model="newValue"
            type="textarea"
            @blur="handleChange"
            @change="isError = false"
            v-bind="attrs"
        >
        </el-input>
        <div class="err-msg" v-if="isError">{{ errMsg }}</div>
    </div>
</template>
<script>
    import serialize from "serialize-javascript";

    export default {
        name: "data-editor",
        props: ["attrs", "value","on"],
        //attrs里的types,规定可写的数据类型
        model:{
            prop: 'value'
        },
        data() {
            return {
                isSuccess: false,
                isError: false,
                errMsg: "",
                newValue: "",
            };
        },
        created() {

        },
        watch: {
            value: {
                handler(val) {
                    if (val !== undefined && val !== null) {
                        //序列化数据
                        val = serialize(val, {space: 2});
                        this.newValue = val;
                    }
                },
                immediate: true
            },
        },
        computed: {
            types() {
                return this.toArray(this.attrs.types);
            }
        },
        methods: {
            validate() {
                return new Promise((resolve, reject) => {
                    try {
                        if (!this.newValue) return resolve();
                        //反序列化数据
                        const value = eval("(" + this.newValue + ")");
                        const valType = this.getType(value);
                        const types = this.attrs.types;
                        if (this.types.length && !this.types.includes(valType)) {
                            throw new TypeError(
                                `类型错误，期望类型为: ${types}, 实际类型为 ${valType}`
                            );
                        }
                        resolve(value);
                    } catch (err) {
                        this.isError = true;
                        const msg = err instanceof SyntaxError || err instanceof ReferenceError
                                ? `数据解析失败${
                                    this.types.includes("string")
                                        ? '，如果是字符串，请用"引号"'
                                        : ""
                                    }`
                                : err.message;
                        reject({
                            msg
                        });
                    }
                });
            },
            // 获取类型
            getType(val) {
                return Object.prototype.toString
                    .call(val)
                    .toLocaleLowerCase()
                    .slice(1, -1)
                    .split(" ")[1];
            },
            toArray(val) {
                if (val === undefined || val === null) return [];
                return Array.isArray(val) ? val : [val];
            },
            async handleChange() {
                this.isError = false;
                try {
                    const value = await this.validate();
                    this.$emit("input", value);

                    this.isSuccess = true;
                    setTimeout(() => {
                        this.isSuccess = false;
                    }, 1000);
                } catch (err) {
                    this.errMsg = err.msg;
                }
            }
        }
    };
</script>

<style>
    .data-editor.is-error .el-textarea__inner {
        border-color: #f56c6c;
    }

    .data-editor.is-error .err-msg {
        font-size: 14px;
        color: #f56c6c;
    }

    .data-editor.is-success .el-textarea__inner {
        border-color: #67c23a;
        border-style: dashed;
    }
</style>
