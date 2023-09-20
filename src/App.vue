<template>
  <NConfigProvider :theme="lightMode ? lightTheme : darkTheme">
    <NMessageProvider>
      <Container></Container>
    </NMessageProvider>
  </NConfigProvider>
</template>
<script setup lang="ts">
import { NMessageProvider, NConfigProvider, lightTheme, darkTheme } from 'naive-ui'
import { ref, watch } from 'vue';
import bus from './bus'
import Container from './components/container.vue';
export type ThemeMode = 'auto' | 'light' | 'dark'

const mm = window.matchMedia('(prefers-color-scheme: light)')
const lightMode = ref(mm.matches)

mm.addEventListener('change', (ev) => {
  if (bus.themeMode == 'auto') {
    lightMode.value = ev.matches
  }
})

bus.themeMode = (<ThemeMode | null>localStorage.getItem('themeMode') || (localStorage.setItem('themeMode', 'auto'), 'auto'))
lightMode.value = bus.themeMode == 'light'
console.log("🚀 ~ file: App.vue:37 ~ chrome.storage.local.get ~ themeMode:", bus.themeMode)
watch(() => bus.themeMode, v => {
  console.log('change', v);

  if (v == 'auto') {
    lightMode.value = mm.matches
  } else {
    lightMode.value = bus.themeMode == 'light'
  }
  localStorage.setItem('themeMode', v)
})
</script>
<style lang="less" scoped></style>