<!--
  应用根组件
  源出开源项目 xianmap (https://github.com/qiaoshouqing/xianmap, Copyright (c) 2026 qiaoshouqing, MIT)；本项目由其二次开发，详见 NOTICE.md
-->
<template>
  <AnalyticsPageView />
  <RouterView />
</template>

<script setup lang="ts">
import { watch } from 'vue'
import { currentLocale } from './i18n'
import AnalyticsPageView from './components/AnalyticsPageView.vue'

watch(currentLocale, l => {
  document.documentElement.lang =
    l === 'zh-CN' ? 'zh-Hans' : l === 'zh-TW' ? 'zh-Hant' : l
}, { immediate: true })
</script>
