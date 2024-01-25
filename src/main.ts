import { createApp } from "vue"
import { createPinia } from "pinia"
import router from "@/router"
import { setupStore } from "@/stores/store.ts"
import App from "./App.vue"

const app = createApp(App)

app.use(createPinia())
app.use(router)
setupStore(app)

app.mount("#app")
