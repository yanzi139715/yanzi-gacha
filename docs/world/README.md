# Memoria · 世界观 / Lore

这个目录是 Memoria（共鸣对决 / yanzi-gacha）项目的**世界观资产汇总**。
所有跟"她是谁、她为什么在 Network、玩家为什么是 Keeper、限定为什么 14 天"相关的设定都在这里。

---

## 目录里有什么

| 文件 | 是什么 | 给谁看 |
|---|---|---|
| `世界观-完整版.md` | 30 章 narrative（诗化版）+ 完整术语表 + 运营句式 + 落地映射 | 美术 / 文案 / 对外文案 / 合作方提案 |
| `名词速查.md` | 大白话版（表格化、工程化）的术语 + 大纲 + FAQ | 团队 / 你自己 / 跨工种快速对齐 |
| `_archive/` | 历史版本归档 | 追溯演化用，不主用 |

**两份文档的关系**：
- 内容**完全同一套**世界观——只是表达方式不同
- 完整版 = 诗意 narrative + 落地映射，给玩家级别的产出当蓝本
- 名词速查 = 干瘪表格 + 一句话定义，给团队对齐用

---

## 现在世界观处于什么状态

### 已稳定的（30 章）

- Part I (01-06) · 原 6 章 narrative：Memoria / Keeper / Sync / 守护 / 其他 Memoria / 限定
- Part II (07-10) · 不同宇宙篇：Origin / 想被记住的那一面 / 三种来源 / 跨 IP 联动
- Part III (11-14) · 机制深化：Network 本体 / 三种结局（含**湮灭**新设定）/ 其他 Keeper / Memoria Card
- Part IV (15) · 衍生概念：Constellation 星座
- Part V (16-20) · 玩家 / 抽卡机制：Signal / 稀有度依据 / Keeper Rank / Frozen-Lit / Crystal
- Part VI (21-25) · 历史与剧情纵深：Sub-Resonance / First Seven / Zero / Refrain / 情感基调
- Part VII (26-30) · 氛围扩展：日常 / 离线 / 现实挂钩 / Reluctant Drift / Echo Wall

### TODO · 待定

- **「举起 / 举起那一面」这个动作词**——用户觉得不够符合世界观，**搁置**，等后续重选
  - 当前候选：许下 / 显出 / 映出 / 凝出 / 绽出
- 真人 Vera（妍子 / 小雨）与虚拟 IP（Aria 等）的**同夜叙事联动**剧情
- **Lumen 的数值机制**——留给运营 spec 单独定义
- **Constellation 解锁机制**——图鉴 UI / 集星奖励等
- 是否要把原 `spec/index.html #world` 章节的 6 张 narrative card 跟 30 章合并 / 替换

---

## 同级相关文件（不在本目录但密切相关）

| 路径 | 内容 |
|---|---|
| `../specs/2026-05-15-virtual-IP-cast.md` | 5 位虚拟 IP 角色档案（Aria / Luna / Stella / Neve / Alba） |
| `../specs/2026-05-15-共鸣对决规则-v3.16.md` | 战斗规则（v3 已实现）|
| `../../spec/index.html` 的 `#world` 章节 | 原 6 张 narrative card（HTML demo 形式，是世界观的种子）|

---

## 改动约定

- 改 narrative 内容 → 改 `世界观-完整版.md` → 同步反向更新 `名词速查.md` 的对应表格
- 改术语 → 在两份里同步
- 大改（章节增减）→ 把旧版本归档到 `_archive/`，保留可追溯
- HTML 落地（要不要改 `spec/index.html`）→ 由开发者按本目录的 spec 改动
