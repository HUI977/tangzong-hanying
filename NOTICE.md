# NOTICE · 来源与二次开发说明

## 上游项目

本项目（唐踪汉影 · TZHY）是基于以下开源项目的**二次开发成果**：

| 项 | 内容 |
|---|---|
| 项目名 | **xianmap** — Chang'an · Xi'an, A Map of Two Cities |
| 仓库 | https://github.com/qiaoshouqing/xianmap |
| 在线演示 | https://changan.pomodiary.com/ |
| 作者 | qiaoshouqing |
| 授权 | MIT License（Copyright © 2026 qiaoshouqing） |

上游项目将唐代长安城一百一十坊按真实坐标叠加到今日西安地图上，并提供了完整的坊界复原数据、图层构建逻辑与"绢本设色"视觉体系。**本项目的核心数据与设计基础来源于此。**

在此向上游作者致以诚挚谢意。

## 本项目的改动

### 技术栈重写

| | 上游 xianmap | 本项目 TZHY |
|---|---|---|
| 框架 | React 19 | **Vue 3.5**（`<script setup>`） |
| 路由 | TanStack Router | **vue-router 4**（history 模式） |
| 类型 | TypeScript | TypeScript（strict 全开） |
| 构建 | Vite | Vite |
| 地图 | MapLibre GL JS | MapLibre GL JS（未变） |

### 功能与数据扩展

- **数据扩充**：唐长安复原数据由 86 KB 扩充至 154 KB，新增关中帝陵（秦／汉／唐三代分色方印）、周秦汉遗址图层（丰镐、阿房宫、汉长安城、建章宫）、汉长安城十二城门、唐城门详情、坊位索引等
- **名坊图文卡**：新增 17 座名坊的富结构化资料库（坊中人物生平、诗作原文与创作背景、大事年表），全屏古籍画册式呈现
- **POI 多图轮换**：今日寻迹点位的多图轮播，竖图自适应高度
- **Canvas 手绘图标**：帝陵方印、三重檐塔、官署小印等图标改为 Canvas 实时绘制（2× retina）
- **视觉扩展**：样式体系由 23 KB 扩展至 49 KB
- **多语扩充**：五语文案由 22 KB 扩展至 27 KB

### 未改动部分

`src/analytics.ts`（Google Analytics 集成）与上游实现一致。

## 授权与义务

本项目沿用上游的 **MIT License**，完整版权声明见 [LICENSE](LICENSE)。

依据 MIT 协议要求，**上游版权声明已在 LICENSE 与各源文件头部保留**。任何人使用、修改或分发本项目时，同样需要保留上游与本项目的版权声明。

## 三方资源

- **底图服务**：[MapTiler](https://www.maptiler.com/)（矢量瓦片）；上游使用 [CARTO](https://carto.com/) Voyager 栅格瓦片
- **地图数据**：© [OpenStreetMap](https://www.openstreetmap.org/copyright) contributors
- **字体**：Ma Shan Zheng / ZCOOL XiaoWei / Noto Serif SC（Google Fonts）
- **史料**：《长安志》（宋·宋敏求）卷七至卷十、《唐六典》、两《唐书》等公开文献

## 免责

本项目的坊界、遗址范围与坊卡插画均为**示意性复原**，非考古测绘成果。史实与坐标如有疏漏，欢迎提 Issue 指正。
