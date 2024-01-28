import { createRouter, createWebHistory } from "vue-router"
import Class from "@/views/class/class.vue"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "class",
      component: Class
    },
    {
      path: "/login",
      name: "login",
      component: () => import("@/views/login/login.vue")
    }
  ]
})

export default router
