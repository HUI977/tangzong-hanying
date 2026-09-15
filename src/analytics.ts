// Google Analytics 集成（实现与上游一致）
// 源出开源项目 xianmap (https://github.com/qiaoshouqing/xianmap, Copyright (c) 2026 qiaoshouqing, MIT)；本项目由其二次开发，详见 NOTICE.md
// Google Analytics 衡量 ID：从环境变量读取（.env.local，不进仓库）
// 未配置时整个统计模块静默停用——clone 下来的人不会把数据打到原作者账号
const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_ID as string | undefined

type Gtag = (...args: unknown[]) => void

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: Gtag
  }
}

let initialized = false

function shouldTrack() {
  // 未配置 GA ID 时不跟踪（他人 clone 后不会误发数据）
  if (!GA_MEASUREMENT_ID) return false
  return import.meta.env.PROD && !['localhost', '127.0.0.1', '::1'].includes(window.location.hostname)
}

function initGoogleAnalytics() {
  if (initialized || !shouldTrack()) return

  window.dataLayer = window.dataLayer || []
  window.gtag = window.gtag || function gtag(...args: unknown[]) {
    window.dataLayer?.push(args)
  }

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`
  document.head.appendChild(script)

  window.gtag('js', new Date())
  initialized = true
}

export function trackPageView(path: string) {
  if (!shouldTrack()) return

  initGoogleAnalytics()
  window.gtag?.('config', GA_MEASUREMENT_ID, {
    page_location: `${window.location.origin}${path}`,
    page_path: path,
    page_title: document.title,
  })
}
