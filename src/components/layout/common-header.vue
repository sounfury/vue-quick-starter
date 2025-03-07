<template>
  <header :style="{ backgroundImage: `url(${thumbnail})`, height: height }">
    <div class="title">
      <span>{{ title }}</span>
    </div>
  </header>
</template>

<script setup>
import { ref } from "vue"

// 定义组件的 props
const props = defineProps({
  thumbnail: String, // 背景图片 URL
  title: String, // 标题
  height: { // 传入的高度
    type: String,
    default: "400px" // 默认高度为 400px
  }
})

// 是否显示的标志
const isShow = ref(false)

// 监听 props 变化
watch(
  () => props,
  (newMeta) => {
    isShow.value = !!newMeta
  },
  { immediate: true }
)
</script>

<style scoped>
header {
  object-fit: cover;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  position: relative;
  /* 添加定位 */
}

.title {
  margin-bottom: 8px;
  color: white;
  font-weight: 400;
  font-size: 2.5em;
  line-height: 1.5;
  -webkit-line-clamp: 3;
  z-index: 1;
}

header::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  /* 覆盖整个 header */
  background: rgba(0, 0, 0, 0.5);
  z-index: 0;
}
</style>
