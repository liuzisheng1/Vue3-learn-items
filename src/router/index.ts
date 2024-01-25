import { createRouter, createWebHistory } from "vue-router"
import HomeView from "@/views/HomeView.vue"
import AboutView from "@/views/AboutView.vue"
import Class from "@/views/class/class.vue"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView
    },
    {
      path: "/about",
      name: "about",
      component: AboutView
    },
    {
      path: "/class",
      name: "class",
      component: Class
    }
  ]
})

export default router
