import { createApp } from "vue"
import LoadingComponent from "@/components/loading/DinoLoader.vue" // 替换为你的组件路径

let loadingInstance = null // 保存加载组件实例
let startTime = 0 // 记录加载动画开始时间
let timer = null // 用于延迟关闭的定时器
let minDisplayTime = 3000 // 默认最短显示时间

const LoadingService = {
  /**
   * 显示加载动画
   * @param {string} message - 加载提示信息
   * @param {number} minTime - 最短显示时间（毫秒）
   */
  open(message = "加载中...", minTime = 3000) {
    // 如果已经存在加载实例，则只更新提示信息
    if (loadingInstance) {
      loadingInstance.setMessage(message)
      return
    }

    // 更新最短显示时间
    minDisplayTime = minTime

    // 创建新的加载组件实例
    const loadingApp = createApp(LoadingComponent)
    const mountNode = document.createElement("div")
    document.body.appendChild(mountNode)

    loadingInstance = loadingApp.mount(mountNode)

    // 调用组件的 open 方法显示动画
    if (loadingInstance && typeof loadingInstance.open === "function") {
      loadingInstance.open(message)
    }

    startTime = Date.now() // 记录打开的时间戳
  },

  /**
   * 关闭加载动画
   */
  close() {
    if (!loadingInstance) return

    // 计算动画显示的实际时长
    const elapsedTime = Date.now() - startTime
    const remainingTime = Math.max(0, minDisplayTime - elapsedTime) // 确保显示达到最短时间

    // 延迟关闭或立即关闭
    clearTimeout(timer) // 清除之前的定时器，避免多次触发
    timer = setTimeout(() => {
      if (loadingInstance && typeof loadingInstance.close === "function") {
        loadingInstance.close() // 调用组件的 close 方法
      }

      // 清理实例和挂载点
      const mountNode = loadingInstance.$el.parentNode
      if (mountNode) {
        document.body.removeChild(mountNode)
      }
      loadingInstance = null
    }, remainingTime)
  },
}

export default LoadingService
