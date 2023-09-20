import { reactive } from 'vue'
import type { ThemeMode } from './App.vue'

const bus = reactive({
  themeMode:'auto' as ThemeMode
})

export default bus
