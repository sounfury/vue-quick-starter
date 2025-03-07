<template>
  <footer>
    ©{{ currentYear }} By sounfury |
    <a href="https://beian.miit.gov.cn" target="_blank" rel="noopener noreferrer">
      鲁ICP备2024121123号
    </a>
  </footer>
</template>

<script setup>
import { ref } from 'vue';

const currentYear = ref(new Date().getFullYear());
</script>

<style scoped>
footer {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: inherit;
  height: 100%;
  text-align: center;
  padding: 10px;
  font-size: 0.9em;
  color: var(--font-color);
}
</style>


