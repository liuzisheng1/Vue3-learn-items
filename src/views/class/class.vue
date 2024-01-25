<template>
  <div>
    <el-button>Default</el-button>
    <el-button type="primary" @click="handleCurrentChange">Primary</el-button>
    <el-button type="success">Success</el-button>
    <el-button type="info">Info</el-button>
    <el-button type="warning">Warning</el-button>
    <el-button type="danger">Danger</el-button>
  </div>
</template>

<script setup lang="ts">
import { requestIndex } from "@/api"
const handleCurrentChange = async () => {
  const res = await requestIndex()
}
</script>

<script lang="ts">
export default {
  name: "ClassInfoList"
}
</script>
<style scoped lang="stylus"></style>
