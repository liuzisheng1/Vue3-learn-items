<template>
  <div>
    <el-button type="success" @click="handleCurrentLogin">Login</el-button>
    <el-button type="primary" @click="handleCurrentChange">PrimaryIndex</el-button>
    <el-button type="success" @click="handleCurrentList">listSuccess</el-button>
    <el-button type="info">Info</el-button>
    <el-button type="warning">Warning</el-button>
    <el-button type="danger">Danger</el-button>
  </div>
</template>

<script setup lang="ts">
import { requestIndex } from "@/api"
import { useUser } from "@/stores/index.ts"
const userStore = useUser()

const handleCurrentChange = async () => {
  const res = await requestIndex()
}
const handleCurrentLogin = async () => {
  const result = await userStore.login({ username: "admin", password: "123456" })
  console.log(result, "username")
}
const handleCurrentList = async () => {
  const res = await userStore.getUserInfoTo()
  console.log(res, "username")
}
</script>

<script lang="ts">
export default {
  name: "ClassInfoList"
}
</script>
<style scoped lang="stylus"></style>
