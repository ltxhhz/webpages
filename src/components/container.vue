<template>
  <NSpace vertical size="large">
    <NLayout>
      <NLayoutHeader bordered ref="header">
        <n-space justify="space-between" align="center" style="padding: 20px;">
          <n-h3 prefix="bar" style="margin: 0;cursor: pointer;" align-text @click="router.push('/')">
            <n-text>webpages</n-text>
          </n-h3>
          <n-space>
            <n-button @click.stop="changeTheme" quaternary>主题{{ bus.themeMode }}</n-button>
            <n-button quaternary>Github</n-button>
          </n-space>
        </n-space>
      </NLayoutHeader>
      <NLayoutContent :style="{ '--content-height': `calc(100vh - ${header?.$el?.offsetHeight}px)` }">
        <RouterView></RouterView>
      </NLayoutContent>
    </NLayout>
  </NSpace>
</template>
<script setup lang="ts">
import { RouterView } from 'vue-router';
import { NSpace, NLayout, NLayoutHeader, NLayoutContent, NText, NButton, NH3, useMessage } from "naive-ui";
import { useRouter } from 'vue-router'
import bus from '../bus'
import { ref, ComponentPublicInstance } from 'vue';
const message = useMessage()
const router = useRouter()

const header = ref<ComponentPublicInstance | null>(null)

function changeTheme() {
  console.log(bus.themeMode);
  if (bus.themeMode == 'auto') {
    bus.themeMode = "light"
    message.success(`切换主题为 light`)
  } else if (bus.themeMode == 'light') {
    bus.themeMode = "dark"
    message.success(`切换主题为 dark`)
  } else {
    bus.themeMode = 'auto'
    message.success(`切换主题为 auto`)
  }
}
</script>
<style lang="less"></style>