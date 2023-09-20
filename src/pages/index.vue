<template>
  <NSpace vertical size="large" style="padding: 20px;">
    <NButton @click="jump('/v2-port-bidirectional-forward')">v2双向端口转发配置</NButton>
  </NSpace>
</template>
<script setup lang="ts">
import { NSpace, NButton } from "naive-ui";
import { useRouter } from 'vue-router'
// import bus from '../bus'
const router = useRouter()
function jump(str: string) {
  router.push(str)
}
</script>
<style lang="less"></style>