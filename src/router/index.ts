import { createRouter, createWebHistory } from "vue-router"
import Class from "@/views/class/class.vue"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "class",
      component: Class
    }
  ]
})

export default router
