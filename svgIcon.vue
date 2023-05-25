<!-- 
    author: 'chenkeyu'
    description: '用于加载使用iconfont symbol模式svg图标，
    iconfont js文件记得去色导出，否则，无法color无效。注册使用本组件,如需继承父级color,组件使用style=fill:currentColor'

 -->

<template>
    <svg :class="svgClass" aria-hidden="true" :style="{ fontSize: size }" :fill="color">
        <use :xlink:href="iconClassName" />
    </svg>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    iconName: {
        type: String,
        default: ''
    },
    className: {
        type: String,
        default: ''
    },
    color: {
        type: String,
        default: ''
    },
    size: {
        type: String,
        default: '16px'
    }
});

const iconClassName = computed(() => {
    return `#${props.iconName ?? ''}`
});
const svgClass = computed(() => {
    if (props.className) {
        return `svg-icon ${props.className ?? ''}`;
    }
    return 'svg-icon';
});
</script>
<style lang="scss" scoped>
.svg-icon {
    width: 1em;
    height: 1em;
}
</style>