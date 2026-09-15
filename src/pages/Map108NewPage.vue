<!--
  主地图页（108NEW 数据分支）
  源出开源项目 xianmap (https://github.com/qiaoshouqing/xianmap, Copyright (c) 2026 qiaoshouqing, MIT)；本项目由其二次开发，详见 NOTICE.md
-->
<template>
  <div class="map-page">
    <MapView :t="t" :fly-to-poi="poi" />

    <!-- 题签（红印 + 标题文字） -->
    <header class="title-card">
      <div class="title-seal">踪</div>
      <div class="title-text">
        <h1>唐踪汉影</h1>
        <p>{{ s.subtitle }}</p>
      </div>
    </header>

    <LangSwitcher />

    <PoiPanel :selected-id="poi?.id ?? null" @select="p => (poi = { ...p })" />
    <ControlDock :t="t" @change="(v: number) => (t = v)" />

    <!-- 首访引导 -->
    <div v-if="!introDismissed" class="intro-veil" @click="dismissIntro">
      <div class="intro-card" @click.stop>
        <div class="intro-seal">遊</div>
        <h2>{{ s.introTitle }}</h2>
        <p>{{ s.introBody }}</p>
        <ul>
          <li v-for="(item, i) in s.introList" :key="i">{{ item }}</li>
        </ul>
        <button class="intro-btn" @click="dismissIntro">{{ s.introBtn }}</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import MapView from '../components/MapView.vue'
import ControlDock from '../components/ControlDock.vue'
import PoiPanel from '../components/PoiPanel.vue'
import LangSwitcher from '../components/LangSwitcher.vue'
import type { Poi } from '../data/changan'
import { useLocale } from '../i18n'

const t = ref(0.55)
const poi = ref<Poi | null>(null)
const { t: s } = useLocale()
const introDismissed = ref(localStorage.getItem('changan-intro-108new') === '1')

function dismissIntro() {
  localStorage.setItem('changan-intro-108new', '1')
  introDismissed.value = true
}
</script>
