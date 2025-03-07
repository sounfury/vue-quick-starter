<template>
    <div :class="['relative', className]">
        <img :src="src" :alt="alt" :style="imageStyle" @click="handlePreviewToggle" :class="[
        'rounded-md',
        preview ? 'hover:opacity-80 transition-opacity cursor-pointer' : ''
    ]" />

        <teleport to="body">
            <div v-if="preview && isPreviewOpen"
                class="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center"
                @click="handlePreviewToggle">
                <div class="max-w-[90vw] max-h-[90vh] relative">
                    <img :src="src" :alt="alt" class="max-w-full max-h-full object-contain rounded-lg shadow-2xl" />
                    <button class="absolute top-4 right-4 text-white text-2xl hover:text-gray-300"
                        @click="handlePreviewToggle">
                        ✕
                    </button>
                </div>
            </div>
        </teleport>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface ImagePreviewProps {
    src: string
    alt?: string
    width?: number | string
    height?: number | string
    className?: string
    preview?: boolean
}

const props = withDefaults(defineProps<ImagePreviewProps>(), {
    alt: '图片预览',
    width: 200,
    height: 200,
    className: '',
    preview: true
})

const isPreviewOpen = ref(false)

const handlePreviewToggle = () => {
    if (props.preview) {
        isPreviewOpen.value = !isPreviewOpen.value
    }
}

const imageStyle = computed(() => ({
    width: typeof props.width === 'number' ? `${props.width}px` : props.width,
    height: typeof props.height === 'number' ? `${props.height}px` : props.height,
    objectFit: 'cover'
}))
</script>