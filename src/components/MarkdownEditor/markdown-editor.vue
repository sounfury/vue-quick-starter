<template>
    <div ref="editorContainer" class="minh-[500px]"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick, shallowRef } from 'vue'
import Vditor from 'vditor'
import 'vditor/dist/index.css'

const props = defineProps({
    modelValue: {
        type: String,
        default: ''
    },
    cacheId: {
        type: String,
        default: 'default-editor'
    }
})

const emit = defineEmits(['update:modelValue'])
const editorContainer = ref(null)
const vditorInstance = shallowRef(null)
const isEditorReady = ref(false) // 新增编辑器就绪状态标识

const initEditor = () => {
    if (!editorContainer.value) return

    vditorInstance.value = new Vditor(editorContainer.value, {
        height: 500,
        width: '100%',
        theme: 'classic',
        mode: 'sv',
        toolbar: [
            'emoji', 'headings', 'bold', 'italic', 'strike', 'link',
            'list', 'ordered-list', 'check', 'outdent', 'indent',
            'quote', 'line', 'code', 'inline-code', 'insert-before',
            'insert-after', 'table', 'undo', 'redo', 'fullscreen'
        ],
        cache: {
            id: props.cacheId,
            enable: true
        },
        input: (value) => {
            emit('update:modelValue', value)
        },
        after: () => {
            // 编辑器完全初始化后设置值，并更新就绪状态
            vditorInstance.value.setValue(props.modelValue)
            isEditorReady.value = true // 标记为已就绪
        }
    })
}

watch(
    () => props.modelValue,
    (newValue) => {
        // 只有当编辑器实例已就绪且内容不同时才更新
        if (isEditorReady.value && vditorInstance.value?.getValue() !== newValue) {
            vditorInstance.value?.setValue(newValue)
        }
    }
)

onMounted(() => {
    nextTick(initEditor)
})

onUnmounted(() => {
    // 销毁前重置状态，避免内存泄漏
    isEditorReady.value = false
    if (vditorInstance.value) {
        vditorInstance.value.destroy()
        vditorInstance.value = null
    }
})

const getValue = () => {
    return vditorInstance.value?.getValue() || ''
}

defineExpose({ getValue })
</script>

<style scoped>
.vditor {
    max-width: 100%;
    overflow: auto;
}
</style>