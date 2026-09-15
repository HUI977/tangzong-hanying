// 五语国际化：语言探测与切换
// 源出开源项目 xianmap (https://github.com/qiaoshouqing/xianmap, Copyright (c) 2026 qiaoshouqing, MIT)；本项目由其二次开发，详见 NOTICE.md
import { computed, ref, type ComputedRef, type Ref } from 'vue'
import { UI, type UIStrings } from './ui'

export const LOCALES = ['en', 'zh-CN', 'zh-TW', 'ja', 'ko'] as const
export type Locale = (typeof LOCALES)[number]

export const LOCALE_NAMES: Record<Locale, string> = {
  en: 'English',
  'zh-CN': '简体中文',
  'zh-TW': '繁體中文',
  ja: '日本語',
  ko: '한국어',
}

/** 多语字段：英文为基准，缺失时回退 en → zh-CN */
export type L10n = Partial<Record<Locale, string>>

export function tr(field: L10n | string | undefined, locale: Locale): string {
  if (field == null) return ''
  if (typeof field === 'string') return field
  return field[locale] ?? field.en ?? field['zh-CN'] ?? Object.values(field)[0] ?? ''
}

export const STORAGE_KEY = 'changan-locale'

export function detectLocale(): Locale {
  const saved = localStorage.getItem(STORAGE_KEY) as Locale | null
  if (saved && LOCALES.includes(saved)) return saved
  const navs = navigator.languages?.length ? navigator.languages : [navigator.language]
  for (const raw of navs) {
    const l = raw.toLowerCase()
    if (l.startsWith('zh')) return /tw|hk|mo|hant/.test(l) ? 'zh-TW' : 'zh-CN'
    if (l.startsWith('ja')) return 'ja'
    if (l.startsWith('ko')) return 'ko'
    if (l.startsWith('en')) return 'en'
  }
  return 'en' // 全球默认英文
}

// 模块级单例状态：语言与 UI 文案
// 惰性初始化：首帧即读取浏览器语言 / 已保存偏好，避免闪烁
const localeRef = ref<Locale>(detectLocale())

export function setLocale(l: Locale) {
  localStorage.setItem(STORAGE_KEY, l)
  localeRef.value = l
}

export interface LocaleCtx {
  locale: Ref<Locale>
  setLocale: (l: Locale) => void
  t: ComputedRef<UIStrings>
}

export function useLocale(): LocaleCtx {
  return { locale: localeRef, setLocale, t: computed(() => UI[localeRef.value]) }
}

// 导出 ref 本体，便于在非 setup 上下文（地图事件回调等）读取当前语言
export const currentLocale = localeRef
