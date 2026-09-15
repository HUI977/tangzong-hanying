<!--
  地图核心：图层构建、透明度联动、交互与弹窗
  源出开源项目 xianmap (https://github.com/qiaoshouqing/xianmap, Copyright (c) 2026 qiaoshouqing, MIT)；本项目由其二次开发，详见 NOTICE.md
-->
<template>
  <div ref="containerRef" class="map-container" />
  <div v-if="wardCard" class="ward-overlay" @click="closeWard">
    <div class="ward-modal" role="dialog" aria-modal="true" :aria-label="wardCard.title" @click.stop>
      <div class="ward-modal-img">
        <div v-if="wardCur >= 0" class="ward-main">
          <img class="ward-main-img" :src="wardSrc(wardCur)" :alt="wardCard.title" @error="failWardImg(wardCur)" />
          <template v-if="wardOk.length > 1">
            <button class="ward-nav ward-nav-prev" aria-label="previous" @click="wardPrev">‹</button>
            <button class="ward-nav ward-nav-next" aria-label="next" @click="wardNext">›</button>
          </template>
          <span class="ward-counter">{{ wardOk.indexOf(wardCur) + 1 }} / {{ wardOk.length }}</span>
        </div>
        <figure v-else class="ward-main ward-main-empty" aria-hidden="true">
          <figcaption class="tang-popup-img-note">{{ uiNow.imgPlaceholder }}</figcaption>
          <span class="tang-popup-img-stamp">圖</span>
        </figure>
        <div class="ward-thumbs">
          <img
            v-for="i in wardTotal" :key="i" v-show="!wardFailed(i - 1)"
            class="ward-thumb" :class="{ 'is-active': wardCur === i - 1 }"
            :src="wardSrc(i - 1)" alt="" loading="lazy"
            @click="wardIdx = i - 1" @error="failWardImg(i - 1)"
          />
        </div>
      </div>
      <div class="ward-modal-info">
        <button class="ward-close" aria-label="close" @click="closeWard">✕</button>
        <div class="ward-scroll">
          <div class="ward-head">
            <span class="tang-popup-seal">{{ wardCard.tag }}</span>
            <div>
              <div class="tang-popup-eyebrow">{{ uiNow.popLocatedEyebrow }}</div>
              <div class="ward-title">{{ wardCard.title }}</div>
            </div>
          </div>
          <div class="ward-chips">
            <span v-if="wardCard.wardPos" class="tang-popup-chip">{{ wardCard.wardPos }}</span>
            <span class="tang-popup-chip tang-popup-chip-dim">{{ uiNow.ward110 }}</span>
          </div>
          <i class="tang-popup-rule" aria-hidden="true" />
          <p class="ward-lore">{{ wardCard.story }}</p>

          <template v-if="wardCard.detail">
            <section class="ward-section">
              <h3 class="ward-section-title">居于坊中的人物</h3>
              <div class="ward-residents">
                <div v-for="r in wardCard.detail.residents" :key="r.name" class="ward-resident">
                  <div class="ward-resident-head">
                    <b>{{ r.name }}</b><span class="ward-resident-life">{{ r.lifespan }}</span>
                  </div>
                  <div class="ward-resident-title">{{ r.title }}</div>
                  <p class="ward-resident-sum">{{ r.summary }}</p>
                </div>
              </div>
            </section>

            <section class="ward-section">
              <h3 class="ward-section-title">诗作与作品（{{ wardCard.detail.works.length }}）</h3>
              <ul class="ward-works">
                <li v-for="w in wardCard.detail.works" :key="w.title">
                  <div class="ward-work-head">
                    <b>{{ w.title }}</b>
                    <span class="ward-work-meta">{{ w.author }} · {{ w.reign }}</span>
                  </div>
                  <p v-if="w.excerpt !== '—'" class="ward-work-excerpt">“{{ w.excerpt }}”</p>
                  <p class="ward-work-bg">{{ w.background }}</p>
                </li>
              </ul>
            </section>

            <section class="ward-section">
              <h3 class="ward-section-title">大事年表（{{ wardCard.detail.events.length }}）</h3>
              <ul class="ward-events">
                <li v-for="(e, k) in wardCard.detail.events" :key="k">
                  <span class="ward-event-yr">{{ e.year }} {{ e.reign }}<template v-if="e.date"> {{ e.date }}</template></span>
                  {{ e.title }}
                  <p class="ward-event-desc">{{ e.desc }}</p>
                </li>
              </ul>
            </section>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import {
  CENTER, locateInTang, tangLabels, silkGeo, wardsGeo, palacesGeo,
  marketsGeo, marketStreetsGeo, waterGeo, wallsGeo, gatesGeo,
  sitesGeo, canalsGeo, mingWallGeo, hanWallGeo, hanPalacesGeo, epangGeo, hanRuinsGeo, jianzhangGeo, hanGatesGeo, tombsGeo, tombPoints, DYN_LABEL, TOMB_INFO, GATE_INFO,
  POIS, TANG_SITES,
} from '../data/changan'
import type { Poi, TangLocation } from '../data/changan'
import { tr, currentLocale, type Locale } from '../i18n'
import { UI, type UIStrings } from '../i18n/ui'
import { WARD_DETAILS } from '../data/ward-details'

const props = defineProps<{
  t: number // 0 = 今, 1 = 唐
  flyToPoi: Poi | null
}>()

/** 各图层在 t=1 时的最大不透明度 */
const MAX_OPACITY: Record<string, number> = {
  'tang-silk': 0.94,
  'tang-ward-fill': 0.5,
  'tang-ward-line': 0.85,
  'tang-palace-fill': 0.55,
  'tang-palace-line': 0.95,
  'tang-market-fill': 0.6,
  'tang-market-line': 0.9,
  'tang-market-streets': 0.7,
  'tang-water': 0.78,
  'tang-canals': 0.7,
  'tang-walls': 0.95,
  'tang-walls-glow': 0.25,
  'tang-gates': 0.95,
  'tang-gates-outer': 0.95,
  'ming-wall': 0.8, // 唐图越浓，越需要"今"的参照
  'han-palace-fill': 0.58,
  'han-palace-line': 1,
  'epang-fill': 0.65,
  'epang-line': 1,
  'han-walls': 1,
  'han-ruins': 0.95,
  'han-ruins-fill': 0.95,
  'jianzhang-fill': 0.58,
  'jianzhang-line': 1,
  'han-gates': 1,
  'tomb-fill': 0.55,
  'tomb-line': 0.95,
}

const esc = (str: string) =>
  str.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]!))

// 帝陵方印式点标：按朝代分色 + 绢色「陵」字（Canvas 渲染，反锯齿）
const makeTombPin = (fill: string, stroke: string): ImageData => {
  const c = document.createElement('canvas')
  c.width = 56; c.height = 56
  const ctx = c.getContext('2d')!
  ctx.scale(2, 2) // 28×28 逻辑坐标 ×2 retina
  // 印面：圆角方 + 细描边
  ctx.beginPath()
  const r = 5, x = 3, y = 3, w = 22, h = 22
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
  ctx.fillStyle = fill; ctx.fill()
  ctx.lineWidth = 1.4; ctx.strokeStyle = stroke; ctx.stroke()
  // 「陵」字（serif，绢色）
  ctx.font = '600 15px "Noto Serif SC", "Songti SC", "SimSun", serif'
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
  ctx.fillStyle = '#f4ead2'
  ctx.fillText('陵', 14, 14.5)
  return ctx.getImageData(0, 0, 56, 56)
}
// 秦玄紫 / 汉赭黄 / 唐朱砂（与陵园色块同系）
const tombPinQin = makeTombPin('#4f4763', '#332e42')
const tombPinHan = makeTombPin('#8a6b3b', '#5c451f')
const tombPinTang = makeTombPin('#9e3b2c', '#6e2318')

// ── 唐迹图标（Canvas 渲染，反锯齿；44×44 物理像素 = 22×22 逻辑）──
// 寺院 → 三重檐小塔；官署官学 → 小方印；其余 → 泥金圆点
const makeSiteIcon = (draw: (ctx: CanvasRenderingContext2D) => void): ImageData => {
  const c = document.createElement('canvas')
  c.width = 44; c.height = 44
  const ctx = c.getContext('2d')!
  ctx.scale(2, 2)
  draw(ctx)
  return ctx.getImageData(0, 0, 44, 44)
}
const siteIconDot = makeSiteIcon(ctx => {
  ctx.beginPath(); ctx.arc(11, 11, 4, 0, Math.PI * 2)
  ctx.fillStyle = '#b58a3a'; ctx.fill()
  ctx.lineWidth = 1.6; ctx.strokeStyle = '#fdf8ea'; ctx.stroke()
})
const siteIconPagoda = makeSiteIcon(ctx => {
  ctx.fillStyle = '#9e3b2c'; ctx.strokeStyle = '#6e2318'; ctx.lineWidth = 0.8
  // 塔刹
  ctx.fillRect(10.7, 2.6, 0.6, 2.2)
  const roof = (y: number, w: number) => {
    ctx.beginPath()
    ctx.moveTo(11 - w / 2, y + 3)
    ctx.quadraticCurveTo(11, y - 1.4, 11 + w / 2, y + 3)
    ctx.closePath(); ctx.fill(); ctx.stroke()
  }
  ctx.fillRect(10.2, 6.8, 1.6, 2.4); roof(6.2, 5.6)    // 上层
  ctx.fillRect(9.7, 11, 2.6, 2.8);  roof(10.4, 8.8)    // 中层
  ctx.fillRect(9.2, 15.4, 3.6, 3);  roof(14.8, 12)     // 下层
  ctx.fillRect(7.6, 18.6, 6.8, 1.6)                    // 基座
})
const siteIconSeal = makeSiteIcon(ctx => {
  ctx.beginPath()
  const r = 1.5, x = 5.5, y = 5.5, w = 11, h = 11
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
  ctx.fillStyle = '#9e3b2c'; ctx.fill()
  ctx.lineWidth = 0.8; ctx.strokeStyle = '#6e2318'; ctx.stroke()
  // 印面内框（绢色细线，拟印文）
  ctx.strokeStyle = 'rgba(244, 234, 210, 0.9)'
  ctx.strokeRect(7.3, 7.3, 7.4, 7.4)
})

// MapTiler Basic 矢量底图（MapLibre 直接渲染矢量瓦片，高缩放文字清晰）
// key 从环境变量读取（.env.local，不进仓库）；未配置时回退 MapLibre 官方 demo 底图，
// 便于他人 clone 后零配置直接跑起来。生产部署请在 .env.local 填入自己的 key。
const MAPTILER_KEY = import.meta.env.VITE_MAPTILER_KEY as string | undefined
const MAPTILER_STYLE = MAPTILER_KEY
  ? `https://api.maptiler.com/maps/basic-v2/style.json?key=${MAPTILER_KEY}`
  : 'https://demotiles.maplibre.org/style.json'
if (!MAPTILER_KEY && import.meta.env.DEV) {
  console.warn('[changan] 未配置 VITE_MAPTILER_KEY，已回退 MapLibre 演示底图（无中文标注）')
}

// 底图原生图层 id（load 时、唐层叠加前捕获）
let baseLayerIds: string[] = []

// 底图各图层类型对应的透明度属性（用于"唐图全开时底图退后"）
const BASE_OPACITY_PROP: Record<string, string[]> = {
  background: ['background-opacity'],
  fill: ['fill-opacity'],
  line: ['line-opacity'],
  symbol: ['text-opacity', 'icon-opacity'],
  raster: ['raster-opacity'],
  circle: ['circle-opacity'],
}

// 事件回调在地图初始化时一次性注册，读取语言时用 currentLocale 取最新值
function uiPair(): [Locale, UIStrings] {
  const locale = currentLocale.value
  return [locale, UI[locale]]
}

// POI 弹窗图：public/poi/<id>-1.jpg 起连续编号多图轮换；未编号时回退单图 <id>.jpg
function poiPopupHtml(p: Poi, locale: Locale, s: UIStrings): string {
  return `
    <div class="tang-popup">
      <div class="tang-popup-head">
        <span class="tang-popup-seal">迹</span>
        <div>
          <div class="tang-popup-eyebrow">${esc(s.popNowPrefix + tr(p.name, locale))}</div>
          <div class="tang-popup-title">${esc(s.popTangPrefix + tr(p.tangName, locale))}</div>
        </div>
      </div>
      <figure class="tang-popup-fig">
        <span class="tang-popup-img-stamp">跡</span>
        <div class="tang-popup-dots"></div>
      </figure>
      <p class="tang-popup-text">${esc(tr(p.tang, locale))}</p>
    </div>`
}

// ── POI 弹窗多图轮换 ──
// 命名约定：public/poi/<id>-1.jpg、<id>-2.jpg…连续编号（缺号即停，上限 8 张）；
// 编号图不存在时回退旧命名单图 <id>.jpg；一张以下不显示圆点、不轮换。
const POI_IMG_MAX = 8
function setupPoiCarousel(fig: HTMLElement, id: string, alt = '') {
  const dots = fig.querySelector<HTMLElement>('.tang-popup-dots')
  if (!dots) return
  const base = `${import.meta.env.BASE_URL}poi/`
  const imgs: HTMLImageElement[] = []
  let cur = 0
  let timer: number | undefined

  // 图区高度自适应：横/方图保持基准 118px；竖图按宽高比等比调高（上限 232px，超限仍轻微裁剪）
  const FIG_BASE_H = 118
  const FIG_MAX_H = 232
  const syncHeight = (img: HTMLImageElement) => {
    const w = fig.clientWidth || fig.offsetWidth || 296
    const r = img.naturalWidth / img.naturalHeight
    const h = r >= 0.9 || !r ? FIG_BASE_H : Math.min(FIG_MAX_H, Math.max(FIG_BASE_H, Math.round(w / r)))
    fig.style.height = `${h}px`
  }
  const show = (i: number) => {
    cur = ((i % imgs.length) + imgs.length) % imgs.length
    imgs.forEach((img, k) => img.classList.toggle('is-active', k === cur))
    dots.querySelectorAll('.tang-popup-dot').forEach((d, k) =>
      d.classList.toggle('is-active', k === cur))
    if (imgs[cur]) syncHeight(imgs[cur])
  }
  const stop = () => { if (timer) { window.clearInterval(timer); timer = undefined } }
  const start = () => {
    if (imgs.length < 2 || timer) return
    timer = window.setInterval(() => {
      if (!fig.isConnected) return stop() // 弹窗已关闭
      show(cur + 1)
    }, 4200)
  }
  const renderDots = () => {
    if (imgs.length < 2) return
    dots.classList.add('has-many')
    dots.innerHTML = ''
    imgs.forEach((_, k) => {
      const d = document.createElement('button')
      d.type = 'button'
      d.className = 'tang-popup-dot'
      d.setAttribute('aria-label', `${k + 1} / ${imgs.length}`)
      d.addEventListener('click', ev => { ev.stopPropagation(); show(k); stop(); start() })
      dots.appendChild(d)
    })
    show(cur)
  }
  const append = (src: string, onOk: () => void, onFail: () => void) => {
    const img = document.createElement('img')
    img.className = 'tang-popup-fig-img'
    img.alt = alt
    img.onload = () => {
      fig.insertBefore(img, dots)
      imgs.push(img)
      if (imgs.length === 1) {
        img.classList.add('is-active')
        syncHeight(img) // 单图也需按竖横调整图区高度
      }
      renderDots()
      start()
      onOk()
    }
    img.onerror = onFail
    img.src = src
  }
  const loadNumbered = (n: number) => {
    if (n > POI_IMG_MAX) return
    append(`${base}${id}-${n}.jpg`, () => loadNumbered(n + 1), () => {
      if (n === 1) append(`${base}${id}.jpg`, () => {}, () => {}) // 回退旧命名单图
    })
  }
  loadNumbered(1)
  // 悬停/按住时暂停轮换
  fig.addEventListener('pointerenter', stop)
  fig.addEventListener('pointerleave', start)
}

// 打开 POI 弹窗并挂载多图轮换
function openPoiPopup(p: Poi) {
  const map = mapRef.value
  if (!map) return
  const [locale, s] = uiPair()
  const popup = new maplibregl.Popup({ closeButton: true, maxWidth: '320px', className: 'tang-popup-wrap' })
    .setLngLat([p.lng, p.lat]).setHTML(poiPopupHtml(p, locale, s)).addTo(map)
  const fig = popup.getElement()?.querySelector<HTMLElement>('.tang-popup-fig')
  if (fig) setupPoiCarousel(fig, p.id, p.nameZh)
}

// TangLocation.zone → UI.zoneTag 键
const ZONE_KEY: Record<string, string> = {
  ward: 'ward', palace: 'palace', market: 'market', water: 'water',
  garden: 'garden', street: 'street', imperial: 'city', outside: 'outskirts',
  ruins: 'ruins', tomb: 'tomb',
}

// 普通地点弹窗（有典故的坊改由全屏 WardCard 呈现）
function popupHtml(loc: TangLocation, s: UIStrings): string {
  const tag = s.zoneTag[ZONE_KEY[loc.zone]] ?? ''
  // 周秦汉遗址 / 帝陵不是唐坊，「此地，唐时在」不通，改用各自眉题
  const eyebrow =
    loc.zone === 'ruins' ? s.popRuinsEyebrow :
    loc.zone === 'tomb' ? s.popTombEyebrow :
    s.popLocatedEyebrow
  return `
    <div class="tang-popup">
      <div class="tang-popup-head">
        <span class="tang-popup-seal">${esc(tag)}</span>
        <div>
          <div class="tang-popup-eyebrow">${esc(eyebrow)}</div>
          <div class="tang-popup-title">${esc(loc.title)}</div>
        </div>
      </div>
      ${loc.detail ? `<p class="tang-popup-text">${esc(loc.detail)}</p>` : ''}
      ${loc.story ? `<p class="tang-popup-text"><span class="tang-popup-dian">${esc(s.popLore)}</span>${esc(loc.story)}</p>` : ''}
    </div>`
}

// ── 坊典故图文卡（全屏古籍画册式）──
interface WardCardData {
  name: string // 坊名（无「坊」字，用于生成插画）
  title: string
  story: string
  wardPos?: string
  tag: string
  detail?: (typeof WARD_DETAILS)[string] // 多坊富结构化资料（人物/诗作/事件）
}

// 坊卡插画：本地图数量不限（public/ward/ 下连续编号），缺失格回退占位图
// 本地图命名兼容两种：{坊名}坊-N.jpg（靖安坊-1.jpg）或 {坊名}-N.jpg（靖安-1.jpg）
//
// 可选的在线补图：配置 VITE_WARD_GEN_ENDPOINT 后，本地图缺失的格会请求该端点按提示词生成。
// 默认关闭——不依赖任何第三方内部接口，缺失时直接显示占位图（见 wardGenUrls 返回空数组）。
const WARD_PROBE_MAX = 24 // 探测上限，防死循环
const WARD_GEN_ENDPOINT = import.meta.env.VITE_WARD_GEN_ENDPOINT as string | undefined
const wardGenUrls = (name: string): string[] => {
  if (!WARD_GEN_ENDPOINT) return []
  const scenes = [
    `唐代长安城${name}坊，古籍木刻版画插图，坊门与十字街，行人车马，水墨设色，古书插图风格`,
    `唐代长安城${name}坊，古籍木刻版画插图，庭院人物故事场景，水墨设色，古书插图风格`,
    `唐代长安城${name}坊鸟瞰，古籍地图版画，坊墙环绕，街衢纵横，水墨设色`,
    `唐代长安城${name}坊，古籍木刻版画插图，四季街市人物风情，水墨设色，古书插图风格`,
  ]
  return scenes.map(p => `${WARD_GEN_ENDPOINT}?prompt=${encodeURIComponent(p)}&image_size=portrait_4_3`)
}
const wardLocalUrls = (name: string, n: number): string[] => [
  `${import.meta.env.BASE_URL}ward/${name}坊-${n}.jpg`,
  `${import.meta.env.BASE_URL}ward/${name}-${n}.jpg`,
]

const wardCard = ref<WardCardData | null>(null)
const wardIdx = ref(0)
const wardCand = ref<number[]>([]) // 每格当前候选下标：0/1=本地图（带坊/不带坊）2=生成图
const wardLocalCount = ref(0)
// 探测本地图数量：从 1 起连续探测，两种命名都缺失即止（编号需连续）
let wardProbeToken = 0
const startWardProbe = (name: string) => {
  const token = ++wardProbeToken
  wardLocalCount.value = 0
  const probe = (n: number) => {
    if (token !== wardProbeToken || n > WARD_PROBE_MAX) return
    const urls = wardLocalUrls(name, n)
    const tryK = (k: number) => {
      if (token !== wardProbeToken || k >= urls.length) return // 缺失即止
      const img = new Image()
      img.onload = () => { if (token === wardProbeToken) { wardLocalCount.value = n; probe(n + 1) } }
      img.onerror = () => tryK(k + 1)
      img.src = urls[k]
    }
    tryK(0)
  }
  probe(1)
}
const wardGen = computed(() => (wardCard.value ? wardGenUrls(wardCard.value.name) : []))
const wardTotal = computed(() => Math.max(wardLocalCount.value, wardGen.value.length))
const wardCands = (i: number) => {
  const name = wardCard.value?.name ?? ''
  return [...wardLocalUrls(name, i + 1), ...(i < wardGen.value.length ? [wardGen.value[i]] : [])]
}
const wardFailed = (i: number) => (wardCand.value[i] ?? 0) >= wardCands(i).length
const wardSrc = (i: number) => wardCands(i)[Math.min(wardCand.value[i] ?? 0, wardCands(i).length - 1)]
const wardOk = computed(() => Array.from({ length: wardTotal.value }, (_, i) => i).filter(i => !wardFailed(i)))
const wardCur = computed(() => (wardOk.value.includes(wardIdx.value) ? wardIdx.value : (wardOk.value[0] ?? -1)))
const uiNow = computed<UIStrings>(() => UI[currentLocale.value])
const failWardImg = (i: number) => {
  if (i < 0) return
  const n = [...wardCand.value]
  while (n.length <= i) n.push(0)
  n[i] = (n[i] ?? 0) + 1
  wardCand.value = n
}
const wardPrev = () => {
  const ok = wardOk.value
  if (ok.length) wardIdx.value = ok[(ok.indexOf(wardCur.value) - 1 + ok.length) % ok.length]!
}
const wardNext = () => {
  const ok = wardOk.value
  if (ok.length) wardIdx.value = ok[(ok.indexOf(wardCur.value) + 1) % ok.length]!
}
const openWardCard = (loc: TangLocation) => {
  wardCand.value = []
  wardIdx.value = 0
  const wn = loc.title.slice(0, -1)
  wardCard.value = {
    name: wn, title: loc.title, story: loc.story!,
    wardPos: loc.wardPos, tag: UI[currentLocale.value].zoneTag.ward,
    detail: WARD_DETAILS[wn] ?? undefined,
  }
  startWardProbe(wn)
}
const closeWard = () => { wardCard.value = null; wardProbeToken++ }
const onWardEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') closeWard() }
watch(wardCard, v => {
  if (v) window.addEventListener('keydown', onWardEsc)
  else window.removeEventListener('keydown', onWardEsc)
})
onBeforeUnmount(() => { window.removeEventListener('keydown', onWardEsc); wardProbeToken++ })

// 帝陵详情弹窗（点方印图标 / 陵园范围触发）
function tombPopupHtml(name: string, dynasty: 'qin' | 'han' | 'tang', locale: Locale): string {
  const detail = TOMB_INFO[name] ? tr(TOMB_INFO[name], locale) : ''
  return `
    <div class="tang-popup">
      <div class="tang-popup-head">
        <span class="tang-popup-seal">陵</span>
        <div>
          <div class="tang-popup-eyebrow">${esc(tr(DYN_LABEL[dynasty], locale))}</div>
          <div class="tang-popup-title">${esc(name)}</div>
        </div>
      </div>
      ${detail ? `<p class="tang-popup-text">${esc(detail)}</p>` : ''}
    </div>`
}

// 唐城城门弹窗（点城门圆点触发）
function gatePopupHtml(name: string, locale: Locale): string {
  const info = GATE_INFO[name]
  return `
    <div class="tang-popup">
      <div class="tang-popup-head">
        <span class="tang-popup-seal">门</span>
        <div>
          <div class="tang-popup-eyebrow">唐 · 长安城门</div>
          <div class="tang-popup-title">${esc(name)}</div>
        </div>
      </div>
      ${info ? `<p class="tang-popup-text">${esc(tr(info, locale))}</p>` : ''}
    </div>`
}

function sitePopupHtml(name: string, locale: Locale, s: UIStrings): string {
  const site = TANG_SITES.find(x => x.name === name)
  const title = site ? tr(site.title, locale) : name
  const note = site ? tr(site.note, locale) : ''
  return `
    <div class="tang-popup">
      <div class="tang-popup-head">
        <span class="tang-popup-seal">迹</span>
        <div>
          <div class="tang-popup-eyebrow">${esc(s.popSiteEyebrow)}</div>
          <div class="tang-popup-title">${esc(title)}</div>
        </div>
      </div>
      <p class="tang-popup-text">${esc(note)}</p>
    </div>`
}

const containerRef = ref<HTMLDivElement | null>(null)
// shallowRef：避免 Vue 深度解包类型（UnwrapRef）破坏 MapLibre Map 的私有字段类型
const mapRef = shallowRef<maplibregl.Map | null>(null)
const tRef = { value: props.t }

onMounted(() => {
  if (!containerRef.value || mapRef.value) return
  const map = new maplibregl.Map({
    container: containerRef.value,
    center: CENTER,
    zoom: 12.1,
    minZoom: 7.5,
    maxZoom: 17.5,
    attributionControl: false,
    style: MAPTILER_STYLE,
  })
  mapRef.value = map
    // 面板定位（诗句地标/诗踪 flyTo）依赖此全局引用，生产构建同样需要
    ;(window as unknown as Record<string, unknown>).__changanMap = map
    if (import.meta.env.DEV) {
      map.on('load', () => console.log('[changan] map load fired'))
      map.on('error', e => console.error('[changan] map error', e.error?.message))
    }

  // 归属控件：非紧凑模式直接显示小字文本，无 i 信息图标；先添加使其位于缩放控件下方
  map.addControl(new maplibregl.AttributionControl({ compact: false }), 'bottom-left')
  map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'bottom-left')
  const geolocate = new maplibregl.GeolocateControl({
    positionOptions: { enableHighAccuracy: true },
    trackUserLocation: true,
  })
  map.addControl(geolocate, 'bottom-left')

  map.on('load', () => {
    // 记录底图原生图层 id（唐层叠加前），供 applyOpacity 整体淡出底图
    baseLayerIds = (map.getStyle().layers ?? []).map(l => l.id)

    // ── 数据源 ──
    map.addSource('silk', { type: 'geojson', data: silkGeo })
    map.addSource('wards', { type: 'geojson', data: wardsGeo, promoteId: 'id' })
    map.addSource('palaces', { type: 'geojson', data: palacesGeo })
    map.addSource('markets', { type: 'geojson', data: marketsGeo })
    map.addSource('market-streets', { type: 'geojson', data: marketStreetsGeo })
    map.addSource('water', { type: 'geojson', data: waterGeo })
    map.addSource('walls', { type: 'geojson', data: wallsGeo })
    map.addSource('gates', { type: 'geojson', data: gatesGeo })
    map.addSource('sites', { type: 'geojson', data: sitesGeo })
    map.addSource('canals', { type: 'geojson', data: canalsGeo })
    map.addSource('ming-wall', { type: 'geojson', data: mingWallGeo })
    // ── 周秦汉遗址：丰镐 · 阿房宫 · 汉长安城 ──
    map.addSource('han-wall', { type: 'geojson', data: hanWallGeo })
    map.addSource('han-palaces', { type: 'geojson', data: hanPalacesGeo })
    map.addSource('epang', { type: 'geojson', data: epangGeo })
    map.addSource('han-ruins', { type: 'geojson', data: hanRuinsGeo })
    map.addSource('han-gates', { type: 'geojson', data: hanGatesGeo })
    // ── 关中帝陵：秦陵 · 汉陵 · 唐陵 ──
    map.addSource('tombs', { type: 'geojson', data: tombsGeo })

    // ── 绢底 ──
    map.addLayer({ id: 'tang-silk', type: 'fill', source: 'silk', paint: { 'fill-color': '#f1e6cb' } })
    // ── 坊 ──
    map.addLayer({
      id: 'tang-ward-fill', type: 'fill', source: 'wards',
      paint: {
        'fill-color': [
          'case',
          ['boolean', ['feature-state', 'hover'], false],
          ['case', ['get', 'hasStory'], 'rgba(158,59,44,0.95)', '#e8cfa0'],
          '#ead9b4',
        ],
      },
    })
    // 有典故坊的 hover 高亮层：不随滑杆淡出，悬停时醒目朱砂
    map.addLayer({
      id: 'tang-ward-hover', type: 'fill', source: 'wards',
      paint: {
        'fill-color': '#9e3b2c',
        'fill-opacity': ['case', ['boolean', ['feature-state', 'hover'], false], ['case', ['get', 'hasStory'], 0.7, 0], 0],
      },
    })
    map.addLayer({
      id: 'tang-ward-line', type: 'line', source: 'wards',
      paint: { 'line-color': '#a8542f', 'line-width': ['interpolate', ['linear'], ['zoom'], 11, 0.5, 14, 1.6] },
    })
    // ── 宫城 / 皇城 / 大明宫 / 兴庆宫 ──
    map.addLayer({
      id: 'tang-palace-fill', type: 'fill', source: 'palaces',
      paint: { 'fill-color': ['match', ['get', 'kind'], 'imperial', '#ddba88', '#d99a72'] },
    })
    map.addLayer({
      id: 'tang-palace-line', type: 'line', source: 'palaces',
      paint: { 'line-color': '#8e3420', 'line-width': ['interpolate', ['linear'], ['zoom'], 11, 1.2, 14, 3] },
    })
    // ── 两市 ──
    map.addLayer({ id: 'tang-market-fill', type: 'fill', source: 'markets', paint: { 'fill-color': '#d8b36a' } })
    map.addLayer({
      id: 'tang-market-line', type: 'line', source: 'markets',
      paint: { 'line-color': '#8e5a20', 'line-width': ['interpolate', ['linear'], ['zoom'], 11, 1, 14, 2.4] },
    })
    map.addLayer({
      id: 'tang-market-streets', type: 'line', source: 'market-streets',
      minzoom: 12.5,
      paint: { 'line-color': '#8e5a20', 'line-width': 1, 'line-dasharray': [2, 1.5] },
    })
    // ── 水 ──
    map.addLayer({
      id: 'tang-water', type: 'fill', source: 'water',
      paint: { 'fill-color': '#7da6a0', 'fill-outline-color': '#4f7d77' },
    })
    // ── 渠水 ──
    map.addLayer({
      id: 'tang-canals', type: 'line', source: 'canals',
      paint: {
        'line-color': '#5f8d86',
        'line-width': ['interpolate', ['linear'], ['zoom'], 11, 1, 14.5, 2.6],
      },
      layout: { 'line-cap': 'round', 'line-join': 'round' },
    })
    // ── 城垣 ──
    map.addLayer({
      id: 'tang-walls-glow', type: 'line', source: 'walls',
      paint: { 'line-color': '#8e3420', 'line-width': ['interpolate', ['linear'], ['zoom'], 11, 6, 14, 14], 'line-blur': 6 },
    })
    map.addLayer({
      id: 'tang-walls', type: 'line', source: 'walls',
      paint: {
        'line-color': '#7c2d1c',
        'line-width': ['interpolate', ['linear'], ['zoom'], 11, 2, 14, 4.5],
        'line-dasharray': [1.2, 0.8],
      },
    })
    // ── 城门（双线圆圈：内实外细） ──
    map.addLayer({
      id: 'tang-gates', type: 'circle', source: 'gates',
      paint: {
        'circle-radius': ['interpolate', ['linear'], ['zoom'], 11, 3, 14, 5.5],
        'circle-color': '#f1e6cb',
        'circle-stroke-color': '#7c2d1c',
        'circle-stroke-width': 2,
      },
    })
    map.addLayer({
      id: 'tang-gates-outer', type: 'circle', source: 'gates',
      paint: {
        'circle-radius': ['interpolate', ['linear'], ['zoom'], 11, 5.2, 14, 8.2],
        'circle-color': 'rgba(0,0,0,0)',
        'circle-stroke-color': '#7c2d1c',
        'circle-stroke-width': 1,
      },
    })
    // ── 唐迹点位：寺院小塔 · 官署小印 · 其余泥金圆点 ──
    map.addImage('site-dot', siteIconDot, { pixelRatio: 2 })
    map.addImage('site-pagoda', siteIconPagoda, { pixelRatio: 2 })
    map.addImage('site-seal', siteIconSeal, { pixelRatio: 2 })
    map.addLayer({
      id: 'tang-sites', type: 'symbol', source: 'sites',
      minzoom: 11.8,
      layout: {
        'icon-image': ['match', ['get', 'icon'], 'pagoda', 'site-pagoda', 'seal', 'site-seal', 'site-dot'],
        'icon-size': ['interpolate', ['linear'], ['zoom'], 12, 0.75, 15, 1.15],
        'icon-allow-overlap': true,
        'icon-ignore-placement': true,
      },
    })
    // ── 明城墙（今）对照虚线 ──
    map.addLayer({
      id: 'ming-wall', type: 'line', source: 'ming-wall',
      paint: {
        'line-color': '#46606e',
        'line-width': ['interpolate', ['linear'], ['zoom'], 11, 1.6, 14, 3],
        'line-dasharray': [3, 2],
      },
    })
    // ── 周秦汉遗址（石绿系，随唐图淡入） ──
    map.addLayer({
      id: 'han-palace-fill', type: 'fill', source: 'han-palaces',
      paint: { 'fill-color': '#9db386' },
    })
    map.addLayer({
      id: 'han-palace-line', type: 'line', source: 'han-palaces',
      paint: { 'line-color': '#55744a', 'line-width': ['interpolate', ['linear'], ['zoom'], 11, 0.8, 14, 1.8] },
    })
    map.addLayer({
      id: 'epang-fill', type: 'fill', source: 'epang',
      paint: { 'fill-color': '#d8cde8' }, // 淡紫面域
    })
    map.addLayer({
      id: 'epang-line', type: 'line', source: 'epang',
      paint: { 'line-color': '#7a5aa8', 'line-width': ['interpolate', ['linear'], ['zoom'], 11, 1, 14, 2.4] }, // 紫色线框
    })
    map.addLayer({
      id: 'han-walls', type: 'line', source: 'han-wall',
      paint: {
        'line-color': '#3d6353',
        'line-width': ['interpolate', ['linear'], ['zoom'], 11, 2, 14, 3.8],
        'line-dasharray': [1.2, 0.8],
      },
    })
    // 建章宫（汉宫属邑，与汉城同色：石绿框 + 浅石绿面）
      map.addSource('jianzhang', { type: 'geojson', data: jianzhangGeo })
      map.addLayer({
        id: 'jianzhang-fill', type: 'fill', source: 'jianzhang',
        paint: { 'fill-color': '#aeb994', 'fill-opacity': 0.5 },
      })
      map.addLayer({
        id: 'jianzhang-line', type: 'line', source: 'jianzhang',
        paint: {
          'line-color': '#3d6353',
          'line-width': ['interpolate', ['linear'], ['zoom'], 11, 1.8, 14, 3],
          'line-dasharray': [1.2, 0.8],
        },
      })
    // 城外遗址（丰京/镐京）淡紫半透铺面
      map.addLayer({
        id: 'han-ruins-fill', type: 'fill', source: 'han-ruins',
        paint: { 'fill-color': '#d8cde8', 'fill-opacity': 0.5 },
      })
      map.addLayer({
        id: 'han-ruins', type: 'line', source: 'han-ruins',
        paint: {
          'line-color': '#75501f',
          'line-width': ['interpolate', ['linear'], ['zoom'], 11, 1.4, 14, 2.6],
          'line-dasharray': [2.5, 2],
        },
      })
    // ── 汉长安城 12 座城门 ──
    map.addLayer({
      id: 'han-gates', type: 'circle', source: 'han-gates',
      paint: {
        'circle-radius': ['interpolate', ['linear'], ['zoom'], 10, 1.75, 14, 2.25],
        'circle-color': '#f1e6cb',
        'circle-stroke-color': '#3d6353',
        'circle-stroke-width': 1.6,
      },
    })
    // ── 关中帝陵（秦玄底 / 汉赭 / 唐朱，按朝代分色） ──
    map.addLayer({
      id: 'tomb-fill', type: 'fill', source: 'tombs',
      paint: { 'fill-color': ['match', ['get', 'dynasty'], 'qin', '#5a5468', 'han', '#c2a878', '#b9705c'] },
    })
    map.addLayer({
      id: 'tomb-line', type: 'line', source: 'tombs',
      paint: {
        'line-color': ['match', ['get', 'dynasty'], 'qin', '#3f3a4d', 'han', '#75501f', '#7c2d1c'],
        'line-width': ['interpolate', ['linear'], ['zoom'], 11, 1.2, 14, 2.2],
        'line-dasharray': [2, 1.2],
      },
    })
    // ── 帝陵方印点标（按朝代分色） ──
    map.addSource('tomb-points', { type: 'geojson', data: tombPoints })
    map.addImage('tomb-pin-qin', tombPinQin, { pixelRatio: 2 })
    map.addImage('tomb-pin-han', tombPinHan, { pixelRatio: 2 })
    map.addImage('tomb-pin-tang', tombPinTang, { pixelRatio: 2 })
    map.addLayer({
      id: 'tomb-pin', type: 'symbol', source: 'tomb-points',
      layout: {
        'icon-image': ['match', ['get', 'dynasty'], 'qin', 'tomb-pin-qin', 'han', 'tomb-pin-han', 'tomb-pin-tang'],
        'icon-size': ['interpolate', ['linear'], ['zoom'], 10, 0.6, 13, 0.9],
        'icon-anchor': 'center',
        'icon-allow-overlap': true,
        'icon-ignore-placement': true,
      },
    })

    // ── HTML 标注层（竖排坊名等） ──
    const root = document.createElement('div')
    root.className = 'tang-label-root'
    const wardLabelEls = new Map<string, HTMLElement>() // 坊名 → 标签元素（hover 联动）
    for (const l of tangLabels) {
      // MapLibre 会给 Marker 根元素写入内联 opacity，
      // 因此外层仅作容器，样式与透明度都放在内层元素上
      const wrap = document.createElement('div')
      // 帝陵标签容器放行点击，使点击落在下方方印图标上
      if (l.kind === 'tomb') wrap.style.pointerEvents = 'none'
      const el = document.createElement('div')
      el.className = `tang-label tang-label-${l.kind}`
      el.dataset.minzoom = String(l.minZoom)
      if (l.kind === 'ward' || l.kind === 'street' || l.kind === 'poem' || l.kind === 'tomb') {
        el.classList.add('tang-label-vertical')
      }
      if (l.hasStory) el.classList.add('tang-label-has-story')
      el.textContent = l.text
      if (l.kind === 'ward' && l.hasStory) wardLabelEls.set(l.text, el)
      wrap.appendChild(el)
      // 城门标签外移：左右侧门竖直中心对齐圆心；上下门水平中心对齐圆心
      const GATE_ANCHOR = { left: 'right', right: 'left', up: 'bottom', down: 'top' } as const
      const anchor = l.kind === 'gate' && l.dir
        ? GATE_ANCHOR[l.dir]
        : l.kind === 'site' ? 'top' : l.kind === 'tomb' ? 'bottom' : 'center'
      if (l.kind === 'gate' && l.dir) el.classList.add(`tang-label-g-${l.dir}`)
      new maplibregl.Marker({ element: wrap, anchor }).setLngLat([l.lng, l.lat]).addTo(map)
    }

    // ── 景点常驻标记（今可亲访，不随唐图淡出；图钉名保留汉字） ──
    for (const p of POIS) {
      const wrap = document.createElement('div')
      const el = document.createElement('button')
      el.className = 'poi-marker'
      el.setAttribute('aria-label', tr(p.name, currentLocale.value))
      const dot = document.createElement('span')
      dot.className = 'poi-marker-dot'
      const name = document.createElement('span')
      name.className = 'poi-marker-name tang-label-zoomgate'
      name.dataset.minzoom = '12.8'
      name.textContent = p.nameZh
      el.append(dot, name)
      el.addEventListener('click', ev => {
        ev.stopPropagation()
        openPoiPopup(p)
      })
      wrap.appendChild(el)
      new maplibregl.Marker({ element: wrap, anchor: 'top' }).setLngLat([p.lng, p.lat]).addTo(map)
    }
    const syncLabels = () => {
      const z = map.getZoom()
      document.querySelectorAll<HTMLElement>('.tang-label, .tang-label-zoomgate').forEach(el => {
        const mz = Number(el.dataset.minzoom)
        el.classList.toggle('tang-label-hidden', z < mz)
      })
    }
    map.on('zoom', syncLabels)
    syncLabels()
    applyOpacity(map, tRef.value)

    // ── 交互：点帝陵方印 → 陵墓详情；点唐迹点 → 讲解；点任意处 → 唐代定位 ──
    map.on('click', e => {
      // 方印图标较小，命中范围外扩 10px，便于点中
      const pad = 10
      const tombs = map.queryRenderedFeatures(
        [[e.point.x - pad, e.point.y - pad], [e.point.x + pad, e.point.y + pad]],
        { layers: ['tomb-pin'] },
      )
      if (tombs.length) {
        const p = tombs[0].properties as { name: string; dynasty: 'qin' | 'han' | 'tang' }
        const [locale] = uiPair()
        new maplibregl.Popup({ closeButton: true, maxWidth: '300px', className: 'tang-popup-wrap' })
          .setLngLat(e.lngLat)
          .setHTML(tombPopupHtml(p.name, p.dynasty ?? 'tang', locale))
          .addTo(map)
        return
      }
      // 唐城城门圆点 → 城门详情
      const gates = map.queryRenderedFeatures(e.point, { layers: ['tang-gates'] })
      if (gates.length) {
        const p = gates[0].properties as { name: string }
        const [locale] = uiPair()
        new maplibregl.Popup({ closeButton: true, maxWidth: '300px', className: 'tang-popup-wrap' })
          .setLngLat(e.lngLat)
          .setHTML(gatePopupHtml(p.name, locale))
          .addTo(map)
        return
      }
      const sites = map.queryRenderedFeatures(e.point, { layers: ['tang-sites'] })
      if (sites.length && tRef.value > 0.05) {
        const name = (sites[0].properties as { name: string }).name
        const [locale, s] = uiPair()
        new maplibregl.Popup({ closeButton: true, maxWidth: '300px', className: 'tang-popup-wrap' })
          .setLngLat(e.lngLat)
          .setHTML(sitePopupHtml(name, locale, s))
          .addTo(map)
        return
      }
      const [locale, s] = uiPair()
      const loc = locateInTang(e.lngLat.lng, e.lngLat.lat, locale)
      // 有典故的坊 → 全屏图文卡
      if (loc.zone === 'ward' && loc.story) {
        openWardCard(loc)
        return
      }
      new maplibregl.Popup({ closeButton: true, maxWidth: '300px', className: 'tang-popup-wrap' })
        .setLngLat(e.lngLat)
        .setHTML(popupHtml(loc, s))
        .addTo(map)
    })
    // 帝陵方印 hover：手型提示可点
    map.on('mouseenter', 'tomb-pin', () => { map.getCanvas().style.cursor = 'pointer' })
    map.on('mouseleave', 'tomb-pin', () => { map.getCanvas().style.cursor = '' })
    geolocate.on('geolocate', pos => {
      const ll = new maplibregl.LngLat(pos.coords.longitude, pos.coords.latitude)
      const [locale, s] = uiPair()
      const loc = locateInTang(ll.lng, ll.lat, locale)
      if (loc.zone === 'ward' && loc.story) {
        openWardCard(loc)
        return
      }
      new maplibregl.Popup({ closeButton: true, maxWidth: '300px', className: 'tang-popup-wrap' })
        .setLngLat(ll).setHTML(popupHtml(loc, s))
        .addTo(map)
    })

    // hover 高亮坊（有典故的坊加强 + 手型 + 标签点亮，提示可点开图文卡）
    let hovered: number | null = null
    let hoveredLabelEl: HTMLElement | null = null
    map.on('mousemove', 'tang-ward-fill', e => {
      const id = e.features?.[0]?.properties?.id as number | undefined
      if (id === undefined) return
      const props = e.features?.[0]?.properties as { story?: unknown; name?: string } | undefined
      const hasStory = !!props?.story
      map.getCanvas().style.cursor = hasStory ? 'pointer' : ''
      if (hovered !== null) map.setFeatureState({ source: 'wards', id: hovered }, { hover: false })
      hovered = id
      map.setFeatureState({ source: 'wards', id }, { hover: true })
      // 同步坊名标签
      const labelEl = hasStory && props?.name ? (wardLabelEls.get(`${props.name}坊`) ?? null) : null
      if (hoveredLabelEl !== labelEl) {
        hoveredLabelEl?.classList.remove('is-hover')
        labelEl?.classList.add('is-hover')
        hoveredLabelEl = labelEl
      }
    })
    map.on('mouseleave', 'tang-ward-fill', () => {
      if (hovered !== null) map.setFeatureState({ source: 'wards', id: hovered }, { hover: false })
      hovered = null
      hoveredLabelEl?.classList.remove('is-hover')
      hoveredLabelEl = null
    })
  })
})

onBeforeUnmount(() => {
  // 先清全局引用再 remove：避免面板拿到已销毁的 map（getLayer 会因 style 置空而抛错）
  if ((window as unknown as Record<string, unknown>).__changanMap === mapRef.value) {
    ;(window as unknown as Record<string, unknown>).__changanMap = undefined
  }
  mapRef.value?.remove()
  mapRef.value = null
})

// 透明度联动（不依赖 isStyleLoaded——图块加载期间它会误报 false）
watch(() => props.t, t => {
  tRef.value = t
  document.documentElement.style.setProperty('--tang-t', String(t))
  const map = mapRef.value
  if (map && map.getLayer('tang-silk')) applyOpacity(map, t)
})

// 飞到景点
watch(() => props.flyToPoi, p => {
  const map = mapRef.value
  if (!map || !p) return
  map.flyTo({ center: [p.lng, p.lat], zoom: 14.6, duration: 1600, essential: true })
  openPoiPopup(p)
})

function applyOpacity(map: maplibregl.Map, t: number) {
  document.documentElement.style.setProperty('--tang-t', String(t))
  // 滑杆即叠加层透明度（线性）：t=1 唐图铺满全显，t=0 唐图全隐
  const tt = t
  for (const [id, max] of Object.entries(MAX_OPACITY)) {
    if (!map.getLayer(id)) continue
    const type = map.getLayer(id)!.type
    const prop = type === 'fill' ? 'fill-opacity'
      : type === 'line' ? 'line-opacity'
      : type === 'symbol' ? 'icon-opacity'
      : 'circle-opacity'
    map.setPaintProperty(id, prop, max * tt)
    if (type === 'circle') map.setPaintProperty(id, 'circle-stroke-opacity', max * tt)
  }
  // 唐图全开时，底图略微退后，避免文字打架（遍历矢量底图全部图层）
  for (const id of baseLayerIds) {
    const layer = map.getLayer(id)
    if (!layer) continue
    for (const prop of BASE_OPACITY_PROP[layer.type] ?? []) {
      map.setPaintProperty(id, prop, 1 - 0.35 * tt)
    }
  }
}
</script>

<style scoped>
/* 字阶（与弹窗整体统一）：坊名 34 / 正文 12.5 / 题名 12.5 / 辅注 10.5 */
.ward-section { margin-top: 16px; }
.ward-section-title {
  margin: 0 0 8px;
  font-family: var(--font-xi);
  font-size: 12.5px;
  letter-spacing: 0.18em;
  color: var(--cinnabar-deep);
  border-left: 3px solid var(--cinnabar);
  padding-left: 8px;
}
.ward-residents { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.ward-resident {
  background: rgba(233, 218, 181, 0.32);
  border: 1px solid rgba(205, 187, 144, 0.55);
  border-radius: 4px;
  padding: 8px 10px;
}
.ward-resident-head { display: flex; align-items: baseline; gap: 6px; flex-wrap: wrap; }
.ward-resident-head b { font-size: 12.5px; color: var(--ink); letter-spacing: 0.04em; }
.ward-resident-life { color: var(--cinnabar); font-size: 10.5px; }
.ward-resident-title { color: var(--ink-soft); font-size: 10.5px; margin: 3px 0 4px; letter-spacing: 0.05em; }
.ward-resident-sum { margin: 0; font-size: 12px; line-height: 1.8; color: var(--ink); }
.ward-works, .ward-events { list-style: none; margin: 0; padding: 0; }
.ward-works li { margin-bottom: 10px; }
.ward-work-head { display: flex; align-items: baseline; gap: 8px; flex-wrap: wrap; }
.ward-work-head b { font-size: 12.5px; color: var(--ink); letter-spacing: 0.04em; }
.ward-work-meta { color: var(--ink-soft); font-size: 10.5px; }
.ward-work-excerpt {
  margin: 3px 0;
  font-family: var(--font-xi);
  color: var(--cinnabar-deep);
  font-size: 12.5px;
  letter-spacing: 0.06em;
}
.ward-work-bg { margin: 0; color: var(--ink-soft); font-size: 12px; line-height: 1.8; }
.ward-event-yr { color: var(--cinnabar); font-weight: 600; margin-right: 4px; font-size: 12.5px; }
.ward-events li { font-size: 12.5px; color: var(--ink); line-height: 1.7; }
.ward-event-desc { margin: 2px 0 0; color: var(--ink-soft); font-size: 12px; line-height: 1.8; }
@media (max-width: 560px) {
  .ward-residents { grid-template-columns: 1fr; }
}
</style>
