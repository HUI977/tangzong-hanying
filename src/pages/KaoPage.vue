<!--
  考据说明页
  源出开源项目 xianmap (https://github.com/qiaoshouqing/xianmap, Copyright (c) 2026 qiaoshouqing, MIT)；本项目由其二次开发，详见 NOTICE.md
-->
<template>
  <div class="kao-page">
    <article class="kao-paper">
      <RouterLink to="/" class="kao-back">{{ k.back }}</RouterLink>
      <h1>{{ k.title }}</h1>
      <p class="kao-lede">{{ k.lede }}</p>

      <h2>{{ k.h1 }}</h2>
      <ul>
        <li v-for="(src, i) in k.sources" :key="i">{{ src }}</li>
      </ul>

      <h2>{{ k.h2 }}</h2>
      <p>{{ k.anchorsIntro }}</p>
      <ul>
        <li v-for="(a, i) in k.anchors" :key="i">{{ a }}</li>
      </ul>
      <p>{{ k.verify }}</p>

      <h2>{{ k.h3 }}</h2>
      <ul>
        <li v-for="(n, i) in k.notes" :key="i">{{ n }}</li>
      </ul>

      <p class="kao-colophon">{{ k.colophon }}</p>
    </article>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useLocale } from '../i18n'

const { t } = useLocale()
const k = computed(() => t.value.kao)
</script>
