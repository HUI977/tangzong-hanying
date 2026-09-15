<!--
  古今穿越滑杆
  源出开源项目 xianmap (https://github.com/qiaoshouqing/xianmap, Copyright (c) 2026 qiaoshouqing, MIT)；本项目由其二次开发，详见 NOTICE.md
-->
<template>
  <div class="dock">
    <div class="dock-slider">
      <span class="dock-end dock-end-tang">{{ s.endTang }}</span>
      <button
        :class="['dock-preset', Math.abs(t - 1) < 0.08 ? 'active' : '']"
        :title="s.presetTang"
        :aria-label="s.presetTang"
        @click="emit('change', 1)"
      >
        古
      </button>
      <div class="dock-track">
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          :value="1 - t"
          :aria-label="s.sliderAria"
          @input="emit('change', 1 - Number(($event.target as HTMLInputElement).value))"
        />
      </div>
      <button
        :class="['dock-preset', Math.abs(t - 0) < 0.08 ? 'active' : '']"
        :title="s.presetNow"
        :aria-label="s.presetNow"
        @click="emit('change', 0)"
      >
        今
      </button>
      <span class="dock-end dock-end-now">{{ s.endNow }}</span>
    </div>
    <div class="dock-caption">{{ s.dockCaption }}</div>
  </div>
</template>

<script setup lang="ts">
import { useLocale } from '../i18n'

defineProps<{ t: number }>()
const emit = defineEmits<{ change: [t: number] }>()

const { t: s } = useLocale()
// 自古至今：左＝古（唐图全显），右＝今（唐图全隐）；t 为叠加层不透明度
</script>
