<!--
  GA 页面浏览量上报
  源出开源项目 xianmap (https://github.com/qiaoshouqing/xianmap, Copyright (c) 2026 qiaoshouqing, MIT)；本项目由其二次开发，详见 NOTICE.md
-->
<template>
  <!-- 仅做页面浏览量上报，无 UI -->
</template>

<script setup lang="ts">
import { watch } from 'vue'
import { useRoute } from 'vue-router'
import { trackPageView } from '../analytics'

const route = useRoute()
watch(() => route.fullPath, href => trackPageView(href), { immediate: true })
</script>
