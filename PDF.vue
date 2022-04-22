<template>
    <div v-loading.fullscreen.lock="fullscreenLoading" class="main-article pdf" v-html="article" element-loading-text="正在生成PDF">

    </div>
</template>

<script>
    export default {
        name: "PDF",
        data() {
            return {
                fullscreenLoading: true,
                article: ''
            }
        },
        created() {
            this.article = window.sessionStorage.getItem('pdfHtml');
            setTimeout(() => { //假装延迟打印
                this.fullscreenLoading = false;
                this.$nextTick(() => {
                    window.print();
                    window.sessionStorage.removeItem('pdfHtml');
                })
            },2000)

        }
    }
</script>

<style lang="scss" scoped>

    .main-article {
        min-width: 1200px;
        margin: 0 auto;
    }


</style>
