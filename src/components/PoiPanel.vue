<!--
  侧边栏：寻迹 / 诗词 / 轶事
  源出开源项目 xianmap (https://github.com/qiaoshouqing/xianmap, Copyright (c) 2026 qiaoshouqing, MIT)；本项目由其二次开发，详见 NOTICE.md
-->
<template>
  <aside :class="['poi-panel', open ? 'open' : 'closed']">
    <!-- 列表（桌面在上方滚动区；移动端从把手上方展开） -->
    <div class="poi-scroll">
      <!-- 栏目 tab -->
      <nav class="poi-tabs">
        <button
          v-for="tb in tabs" :key="tb.key"
          :class="['poi-tab', tab === tb.key ? 'active' : '']"
          @click="switchTab(tb.key)"
        >
          {{ tb.label }}
        </button>
      </nav>

      <!-- 寻迹 -->
      <template v-if="tab === 'trace'">
        <header class="poi-header">
          <h2>{{ s.panelTitle }}</h2>
        </header>
        <ul class="poi-list">
          <li v-for="p in POIS" :key="p.id">
            <button
              :class="['poi-card', selectedId === p.id ? 'selected' : '']"
              @click="emit('select', p)"
            >
              <div class="poi-now">
                <span class="poi-tag poi-tag-now">{{ s.tagNow }}</span>
                <span class="poi-name">{{ tr(p.name, locale) }}</span>
              </div>
              <div class="poi-then">
                <span class="poi-tag poi-tag-tang">{{ s.tagTang }}</span>
                <span class="poi-tangname">{{ tr(p.tangName, locale) }}</span>
              </div>
              <p class="poi-blurb">{{ tr(p.modern, locale) }}</p>
            </button>
          </li>
        </ul>
      </template>

      <!-- 诗词 -->
      <template v-if="tab === 'poems'">
        <header class="poi-header">
          <h2>{{ s.tabPoems }}</h2>
        </header>
        <ul class="poi-list lore-list">
          <li v-for="p in POEMS" :key="p.title[0]" class="poem-card">
            <div class="poem-head">
              <span class="poem-dynasty">{{ p.dynasty }}</span>
              <span class="poem-title">{{ p.title[i] }}</span>
              <span class="poem-author">{{ p.author[i] }}</span>
            </div>
            <div class="poem-lines">
              <p v-for="(ln, k) in p.lines" :key="k" class="poem-line">{{ ln[i] }}</p>
            </div>
            <p class="poem-place">{{ p.place[i] }}</p>
          </li>
          <li v-for="sp in poemSpots" :key="sp.text" class="poem-card">
            <button class="poem-spot" @click="flyToSpot(sp)">
              <p class="poem-line">{{ sp.text }}</p>
              <p class="poem-place">{{ sp.place[i] }} · {{ s.poemSpotHint }}</p>
            </button>
          </li>
        </ul>
      </template>

      <!-- 轶事 -->
      <template v-if="tab === 'anecdotes'">
        <header class="poi-header">
          <h2>{{ s.tabAnecdotes }}</h2>
        </header>
        <ul class="poi-list lore-list">
          <li v-for="a in ANECDOTES" :key="a.title[0]" class="anecdote-card">
            <div class="anecdote-head">
              <span class="anecdote-person">{{ a.person[i] }}</span>
              <span class="anecdote-title">{{ a.title[i] }}</span>
            </div>
            <p class="anecdote-text">{{ a.text[i] }}</p>
            <button
              v-if="a.lng !== undefined && a.lat !== undefined"
              class="anecdote-place"
              @click="flyToAnecdote(a)"
            >
              {{ a.place[i] }}
            </button>
            <p v-else class="anecdote-place">{{ a.place[i] }}</p>
          </li>
        </ul>
      </template>
    </div>

    <!-- 把手 / 标题栏（移动端）；桌面收起时作为展开入口浮于书签下方 -->
    <button class="poi-toggle" :aria-expanded="open" :aria-label="activeTabLabel" @click="open = !open">
      <span class="poi-toggle-text">{{ activeTabLabel }}</span>
      <span class="poi-toggle-arrow" aria-hidden>{{ open ? '›' : '‹' }}</span>
    </button>
  </aside>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import maplibregl from 'maplibre-gl'
import { POIS, POEM_SPOTS } from '../data/changan'
import type { Poi } from '../data/changan'
import { POEMS, ANECDOTES, LORE_INDEX } from '../data/lore'
import type { Anecdote } from '../data/lore'
import { WARD_POEM_SPOTS } from '../data/ward-details'
import { useLocale, tr } from '../i18n'

defineProps<{ selectedId: string | null }>()
const emit = defineEmits<{ select: [poi: Poi] }>()

// 桌面默认展开（侧栏），移动端默认收起（仅留把手，地图留白）
const open = ref(window.innerWidth > 900)
type Tab = 'trace' | 'poems' | 'anecdotes'
const tab = ref<Tab>('trace')
const { locale, t: s } = useLocale()
const i = computed(() => LORE_INDEX[locale.value])

// 既有诗句地标 + 名坊诗作点位
const poemSpots = [...POEM_SPOTS, ...WARD_POEM_SPOTS]

function getMap(): maplibregl.Map | undefined {
  return (window as unknown as Record<string, unknown>).__changanMap as maplibregl.Map | undefined
}

function flyToSpot(sp: { lng: number; lat: number }) {
  const map = getMap()
  if (map) map.flyTo({ center: [sp.lng, sp.lat], zoom: Math.max(map.getZoom(), 13.6), duration: 1100 })
}

function flyToAnecdote(a: Anecdote) {
  if (a.lng === undefined || a.lat === undefined) return
  const map = getMap()
  if (map) map.flyTo({ center: [a.lng, a.lat], zoom: Math.max(map.getZoom(), 13.6), duration: 1100 })
}

// ── tab 切换 ──
function switchTab(key: Tab) {
  tab.value = key
  open.value = true
}
const tabs = computed<{ key: Tab; label: string }[]>(() => [
  { key: 'trace', label: s.value.tabTrace },
  { key: 'poems', label: s.value.tabPoems },
  { key: 'anecdotes', label: s.value.tabAnecdotes },
])
// 把手标题随当前栏目变化（移动端显示）
const activeTabLabel = computed(() => tabs.value.find(tb => tb.key === tab.value)?.label ?? s.value.panelTitle)
</script>
