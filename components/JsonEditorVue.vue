<template>
  <JsonEditorVue v-bind="attrs" :class="isDark ? 'jse-theme-dark' : 'jse-theme-light'" />
</template>

<script lang="ts" setup>
import 'vanilla-jsoneditor/themes/jse-theme-dark.css'
import JsonEditorVue from 'json-editor-vue'

import { useTheme } from "vuetify";
const theme = useTheme();

const attrs: any = useAttrs()

const isDark = ref(false)
var interval = setInterval(() => {
  isDark.value = theme.current.value.dark
}, 100)

onBeforeUnmount(() => {
  clearInterval(interval)
})
</script>