//基础设置
import { createApp } from "vue"
import { createPinia } from "pinia"
import router from "./router/index"
import LoadScript from "vue-plugin-load-script"
import directive from './directive' // directive
//图标
import { library } from "@fortawesome/fontawesome-svg-core"
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome"
import { fab } from "@fortawesome/free-brands-svg-icons"
import { fas } from "@fortawesome/free-solid-svg-icons"
//组件库
import ElementPlus from "element-plus"
import "element-plus/dist/index.css"


import App from "./App.vue"

import "./assets/main.scss"
import piniaPluginPersistedstate from "pinia-plugin-persistedstate"
import "./permission" 


library.add(fas, fab)

const app = createApp(App)
directive(app)
app.use(router)

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(pinia)
app.use(LoadScript)

app.use(ElementPlus)

app.component("font-awesome-icon", FontAwesomeIcon)

app.mount("#app")
