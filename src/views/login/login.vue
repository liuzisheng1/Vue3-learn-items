<script setup lang="ts">
import { useUser } from "@/stores/index.ts"
const userStore = useUser()
const handleCurrentLogin = async () => {
  await userStore.login({ username: "admin", password: "123456" })
}
</script>

<template>
  <el-button type="success" @click="handleCurrentLogin">Login</el-button>
</template>

<style scoped lang="sass"></style>
