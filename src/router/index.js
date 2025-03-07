import { createRouter, createWebHistory } from "vue-router"
import { frontRoutes } from "./front"
import { adminRoutes } from "./admin"

export const constantRoutes = [
  {
    path: "/:pathMatch(.*)*", //正则匹配
    name: "404",
    component: () => import("@/views/error/404.vue"),
  },
  {
    //401
    path: "/401",
    name: "401",
    component: () => import("@/views/error/401.vue"),

  },
  {
    path: "/test",
    name: "test",
    component: () => import("@/views/test.vue"),
  },
]

constantRoutes.push(...frontRoutes)
constantRoutes.push(...adminRoutes)

const routes = createRouter({
  history: createWebHistory(),
  routes: constantRoutes,
})

routes.beforeEach((to, from, next) => {
  // //在路由跳转之前执行
  // //如果是404页面，就加载css
  if (to.name === "404") {
    document.querySelector("html").classList.add("Notfound_body")
    //body的背景色去掉
  } else {
    //如果不是404页面，就去掉css并且body的背景色加上
    document.querySelector("html").classList.remove("Notfound_body")
  }

  next()
})

export default routes
