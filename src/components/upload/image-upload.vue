<template>
    <div class="upload-container">
        <!-- 上传图标 -->
        <svg ref="uploadIcon" :width=size :height=size viewBox="0 0 100 100" @click="triggerFileInput"
            class="upload-icon">
            <defs>
                <clipPath id="clipIt">
                    <circle fill="black" r="35" cy="50" cx="50" />
                </clipPath>
            </defs>

            <path :class="{ 'utveckling': isAnimating }"
                d="M 49.99955,21.646452 A 28.35355,28.353548 0 0 0 21.646,50 28.35355,28.353548 0 0 0 49.99955,78.353548 28.35355,28.353548 0 0 0 78.3531,50 28.35355,28.353548 0 0 0 49.99955,21.646452 Z" />
            <g class="cut" clip-path="url(#clipIt)">
                <circle r="35" cy="50" cx="50"
                    style="opacity:1;fill:#1939ff;fill-opacity:1;stroke:none;stroke-width:12.9174" />
                <g :class="{ 'pil': isAnimating }">
                    <path d="m 40.056531,47.971893 9.914191,-9.514425 9.994144,9.514425"
                        style="fill:none;stroke:#ffffff;stroke-width:3.8;stroke-linecap:round;stroke-linejoin:miter;stroke-opacity:1;stroke-miterlimit:4;stroke-dasharray:none" />
                    <path d="M 49.970722,38.457468 V 61.56393"
                        style="fill:none;stroke:#ffffff;stroke-width:3.8;stroke-linecap:round;stroke-linejoin:miter;stroke-opacity:1;stroke-miterlimit:4;stroke-dasharray:none" />
                </g>
                <path v-if="isAnimating"  :class="{ 'bock': isAnimating }"
                    d="m 49.533063,13 c 0,0 -4.038975,0.243204 -7.084664,1.6 -10.965877,4.88509 -12.03936,12.900449 -12.029016,15.995361 0.02524,7.552595 4.607455,12.168562 6.129905,13.956538 C 41.41924,50.271203 47.447623,56.491 47.447623,56.491 L 63.320719,42.911532" />
            </g>
        </svg>
        <!-- 隐藏的文件输入 -->
        <input type="file" ref="fileInput" style="display: none" :multiple="multiple" :accept="acceptedFileTypes"
            @change="handleFileUpload" />

        <!-- 文件列表 -->
        <div   v-if="uploadedFiles.lengt&&isShowFileList" class="file-list">
            <div v-for="(file, index) in uploadedFiles" :key="index" class="file-item">
                <span>{{ file.name }}</span>
                <span>{{ formatFileSize(file.size) }}</span>
                <button @click="removeFile(index)">删除</button>
            </div>
        </div>

        <!-- 错误消息 -->
        <div v-if="errorMessage" class="error-message">
            {{ errorMessage }}
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import axios from 'axios'

// 上传的图片服务器地址
const uploadImgUrl = ref(import.meta.env.VITE_APP_BASE_API + "/common/upload")

// 定义props
const props = defineProps({
    modelValue: {
        type: String,
        default: null
    },
    fileSize: {
        type: Number,
        default: 5
    },
    fileType: {
        type: Array,
        default: () => ["png", "jpg", "jpeg"]
    },
    size: {
        type: Number,
        default: 40,
        validator: (value) => value > 0
    },

    //文件列表是否显示
    isShowFileList: {
        type: Boolean,
        default: false
    },
})


// 控制动画的 class
const isAnimating = ref(false)

// 开始成功动画
const startSuccessAnimation = () => {
    isAnimating.value = true
    setTimeout(() => {
        isAnimating.value = false
    }, 6500) // 动画持续 6.5s
}




// 定义emits
const emit = defineEmits([
    'update:modelValue',
    'before-upload',
    'upload-success',
    'file-remove',
    'upload-start',
    'upload-complete',
    'upload-error',
    'files-clear'
])

// 响应式状态
const uploadedFiles = ref([])
const errorMessage = ref('')
const fileInput = ref(null)

// 计算属性：接受的文件类型
const acceptedFileTypes = computed(() =>
    props.fileType.map(type => `.${type}`).join(',')
)

// 触发文件选择
const triggerFileInput = () => {
    fileInput.value.click()
    emit('before-upload')
}

// 处理文件上传
const handleFileUpload = async (event) => {
    const file = event.target.files[0] // 只取第一个文件

    // 重置错误消息
    errorMessage.value = ''

    // 验证文件类型和大小
    const fileExtension = file.name.split('.').pop().toLowerCase()
    const isValidType = props.fileType.includes(fileExtension)
    const isValidSize = file.size / 1024 / 1024 <= props.fileSize

    if (!isValidType) {
        errorMessage.value = `不支持的文件类型：${fileExtension}`
        return
    }

    if (!isValidSize) {
        errorMessage.value = `文件大小不能超过${props.fileSize}MB`
        return
    }

    // 开始上传
    emit('upload-start', file)

    try {
        const formData = new FormData()
        formData.append('file', file)

        const response = await axios.post(uploadImgUrl.value, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })

        uploadedFiles.value = [file]
        emit('update:modelValue', response.data)
        emit('upload-success', response.data.data.url)

        // 触发上传成功动画
        startSuccessAnimation()
    } catch (error) {
        emit('upload-error', error)
        errorMessage.value = '上传失败'
    }
}

// 移除文件
const removeFile = (index) => {
    const removedFile = uploadedFiles.value[index]
    uploadedFiles.value.splice(index, 1)

    // 更新v-model
    emit('update:modelValue', props.multiple ? uploadedFiles.value : null)

    // 触发文件移除回调
    emit('file-remove', removedFile)
}

// 格式化文件大小
const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 开始上传到服务器
const startUpload = async () => {
    if (uploadedFiles.value.length === 0) {
        emit('upload-error', '没有可上传的文件')
        return
    }

    emit('upload-start', uploadedFiles.value)

    try {
        const uploadPromises = uploadedFiles.value.map(file => {
            const formData = new FormData()
            formData.append('file', file)

            return axios.post(uploadImgUrl.value, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then(response => ({
                file,
                status: 'success',
                response: response.data,
                message: `${file.name}上传成功`
            })).catch(error => ({
                file,
                status: 'error',
                error,
                message: `${file.name}上传失败`
            }))
        })

        const results = await Promise.all(uploadPromises)

        // 检查是否有上传失败的文件
        const failedUploads = results.filter(result => result.status === 'error')

        if (failedUploads.length > 0) {
            emit('upload-error', failedUploads)
        } else {
            emit('upload-complete', results)
        }

        return results
    } catch (error) {
        emit('upload-error', error)
        throw error
    }
}

// 清空所有文件
const clearFiles = () => {
    const clearedFiles = [...uploadedFiles.value]
    uploadedFiles.value = []
    emit('update:modelValue', props.multiple ? [] : null)
    emit('files-clear', clearedFiles)
}

// 暴露方法供父组件调用
defineExpose({
    startUpload,
    clearFiles
})
</script>

<style scoped>
body {
    align-items: center;
    background: #e4edfa;
    display: flex;
    justify-content: center;
    height: 100vh;
}

.upload-icon {
    cursor: pointer;
    transition: transform 0.3s ease;
}

.upload-icon:hover {
    transform: scale(1.1);
}

.utveckling {
    animation: Utveckling 6.5s;
    stroke-width: 10;
    fill: none;
    stroke: #5f7cfb;
}

.pil {
    animation: Pil 6.5s;
}

.bock {
    animation: Bock 6.5s;
    fill: none;
    stroke-dasharray: 31 82;
    stroke-dasharray: none;
    stroke-dashoffset: -50px;
    stroke-linecap: butt;
    stroke-linejoin: miter;
    stroke-miterlimit: 4;
    stroke-width: 4;
    stroke: #ffffff;
}

.file-list {
    margin-top: 10px;
    max-width: 300px;
}

.file-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #f0f4f8;
    padding: 5px 10px;
    margin-bottom: 5px;
    border-radius: 4px;
}

.error-message {
    color: red;
    margin-top: 10px;
    text-align: center;
}

@keyframes Pil {
    0% {
        transform: translateY(0);
    }

    6% {
        transform: translateY(-65px);
    }

    62.49% {
        transform: translateY(-65px);
    }

    62.5% {
        transform: translateY(65px);
    }

    68.5% {
        transform: translateY(0px);
    }
}

@keyframes Utveckling {
    0% {
        stroke-width: 10;
    }

    3.1% {
        stroke-width: 10;
        stroke-dasharray: 1 179;
    }

    3.6% {
        stroke-width: 25;
        stroke-dasharray: 1 179;
    }

    28% {
        stroke-width: 25;
        stroke-dasharray: 174 179;
    }

    34% {
        stroke-width: 10;
        stroke-dasharray: 179 179;
    }

    100% {
        stroke-width: 10;
        stroke-dasharray: 179 179;
    }
}

@keyframes Bock {
    0% {
        stroke-dasharray: 1 82;
        stroke-dashoffset: 0px;
    }

    29% {
        stroke-dasharray: 1 82;
        stroke-dashoffset: 0px;
    }

    35% {
        stroke-dasharray: 31 82;
        stroke-dashoffset: -50px;
    }

    62% {
        stroke-dasharray: 31 82;
        stroke-dashoffset: -50px;
        transform: translateY(0px);
    }

    68% {
        stroke-dasharray: 31 82;
        stroke-dashoffset: -50px;
        transform: translateY(-65px);
    }

    100% {
        stroke-dasharray: 31 82;
        stroke-dashoffset: -50px;
        transform: translateY(-65px);
    }
}
</style>