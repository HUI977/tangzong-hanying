/// <reference types="vite/client" />

// 项目环境变量类型声明（值写在本机 .env.local，不进仓库；见 .env.example）
interface ImportMetaEnv {
  /** MapTiler API key。未配置时回退 MapLibre 演示底图 */
  readonly VITE_MAPTILER_KEY?: string
  /** 可选的坊卡补图端点。未配置时缺失格显示占位图 */
  readonly VITE_WARD_GEN_ENDPOINT?: string
  /** Google Analytics 衡量 ID（G-XXXX）。未配置时不启用统计 */
  readonly VITE_GA_ID?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
