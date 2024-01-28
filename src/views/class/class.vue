<script setup lang="ts">
import { requestIndex } from "@/api"
import { useUser } from "@/stores/index.ts"
const userStore = useUser()

const handleCurrentChange = async () => {
  await requestIndex()
}

const handleCurrentList = async () => {
  await userStore.getUserInfoTo()
}
</script>

<template>
  <div>
    <el-button type="primary" @click="handleCurrentChange">PrimaryIndex</el-button>
    <el-button type="success" @click="handleCurrentList">listSuccess</el-button>
    <el-button type="info">Info</el-button>
    <el-button type="warning">Warning</el-button>
    <el-button type="danger">Danger</el-button>
  </div>
</template>

<script lang="ts">
export default {
  name: "ClassInfoList"
}
</script>
<style scoped lang="stylus"></style>
