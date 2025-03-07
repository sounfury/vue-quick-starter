<template>
  <div class="pagination-container">
    <Card @click="setCurrentPage('prev')"> &lt </card>
    <div class="pagination-page-list">
      <Card
        v-for="page in totalPagesNum"
        :key="page"
        @click="setCurrentPage('page', page)"
        :class="{ selected: currentPage === page }"
      >
        {{ page }}
      </Card>
    </div>
    <card @click="setCurrentPage('next')"> &gt </card>
  </div>
</template>

<script setup>
import { ref } from "vue"
import { watchEffect } from "vue"
import Card from "@/components/card/BaseCard/card.vue"
const props = defineProps({
  total: {
    type: [Number, String],
    default: 0,
  }, //总数据量
  pageNum: {
    type: [Number, String],
  }, //当前页码
  pageSize: {
    type: [Number, String],
    default: 10,
  }, //每页显示条数
  sizesList: { type: Array, default: () => [10, 20, 50, 100] },
})

const emit = defineEmits(["page-change", "size-change"]) //向父组件发送事件

const currentPage = ref(Number(props.pageNum)) //当前页码

/** 每页显示的条数 */
const currentPageSize = ref(Number(props.pageSize)) //每页显示的条数

/** 总页数 */
const totalPagesNum = ref(0) //总页数

//进行上一页、下一页、页码点击事件的处理
const setCurrentPage = (type, pageNum) => {
  let num = currentPage.value
  if (type === "prev") {
    num--
  } else if (type === "next") {
    num++
  } else {
    num = pageNum //点击页码时，直接跳转到指定页码
  }

  // 限制页码的边界值，最小为 1，最大不超过总页数
  if (num < 1) {
    num = 1
  } else if (num > totalPagesNum.value) {
    num = totalPagesNum.value
  }

  currentPage.value = num

  emit("page-change", currentPage.value) //当前页码改变时，向父组件发送事件
}

//设置每页显示的条数
const setCurrentPageSize = (v) => {
  currentPageSize.value = Number(v)
  emit("size-change", currentPageSize.value)
}

watchEffect(() => {
  // 根据传入的 total 计算总页数
  totalPagesNum.value = Math.ceil(props.total / currentPageSize.value)


  // 相应的，在每页条数和总页数有变化时，需要重新设定当前激活页，以防止溢出边界值的情况
  // setCurrentPage("page", currentPage.value)
  //页码改变时，激活的类名
})
</script>

<style scoped>
.pagination-container {
  margin-top: 50px;
  display: flex;
  justify-content: center;
  position: relative;
  z-index: 10;
}
.pagination-page-list {
  display: flex;
  justify-content: center;
  align-items: center;
}
.card {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 35px;
  height: 35px;
  margin: 5px;
  color: var(--font-color);
}
.card:hover {
  background-color: #ff7242;
  color: #fff;
}

.selected {
  background-color: #00c4b6 !important;
  color: #fff;
}
</style>
