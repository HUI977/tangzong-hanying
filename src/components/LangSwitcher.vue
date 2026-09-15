<!--
  语言切换（五语）
  源出开源项目 xianmap (https://github.com/qiaoshouqing/xianmap, Copyright (c) 2026 qiaoshouqing, MIT)；本项目由其二次开发，详见 NOTICE.md
-->
<template>
  <div ref="rootRef" class="lang">
    <button
      class="lang-btn"
      :aria-haspopup="'listbox'"
      :aria-expanded="open"
      :aria-label="s.langLabel"
      :title="s.langLabel"
      @click="open = !open"
    >
      <span class="lang-globe" aria-hidden>✦</span>
      <span class="lang-current">{{ LOCALE_NAMES[locale] }}</span>
    </button>
    <ul v-if="open" class="lang-menu" role="listbox">
      <li v-for="l in LOCALES" :key="l">
        <button
          role="option"
          :aria-selected="l === locale"
          :class="['lang-item', l === locale ? 'active' : '']"
          @click="choose(l)"
        >
          {{ LOCALE_NAMES[l] }}
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useLocale, LOCALES, LOCALE_NAMES, type Locale } from '../i18n'

const { locale, setLocale, t: s } = useLocale()
const open = ref(false)
const rootRef = ref<HTMLDivElement | null>(null)

const onDoc = (e: MouseEvent) => {
  if (rootRef.value && !rootRef.value.contains(e.target as Node)) open.value = false
}

onMounted(() => document.addEventListener('mousedown', onDoc))
onBeforeUnmount(() => document.removeEventListener('mousedown', onDoc))

function choose(l: Locale) {
  setLocale(l)
  open.value = false
}
</script>
