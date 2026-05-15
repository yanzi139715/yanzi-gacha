# Memoria V2 · 主体重写完成 · 决策窗口

> 写于：2026-05-15（连夜重写完成时）
> 状态：主游戏已按 Demo 骨架 1:1 还原
> 入口：`http://localhost:8765/`

---

## ✅ 已完成的全部重做

| 模块 | 落地 | 对应 Demo screen |
|---|---|---|
| **4-tab 底部导航** | 频率战 / 卡池 / 图鉴 / 我的 | wireframe 全部 screen |
| **多 coser 数据骨架** | 妍子 / 小雨 / Aria 三 Memoria 并立 | screen 02/10 |
| **卡池页** | UP 合集 + 每张 coser 大 card + Chapter + SYNC 蓄能 + 单抽/十连 + 池切换 | screen 03 |
| **图鉴一级** | 她们的档案 + 3 coser 行 + 解锁新 Memoria 占位 | screen 10 |
| **图鉴二级** | 单 coser 档案（介绍 / 频率战 / 主皮肤 / 战斗皮肤三槽位 / cos 网格） | screen 11 |
| **我的页** | 守护者档案 + DAYS/SYNC/MEMORIA + BEACON/CRYSTAL/FRAGMENT + 7 天签到日历 + 每日呼唤 + 4 个入口 | screen 14 |
| **Crystal Station** | 全屏 overlay · coser tabs + 三资产 + BEACON 礼包 + CRYSTAL 秘金沙 + FRAGMENT 兑换 | screen 13 |
| **抽卡仪式** | RES cut-in / ECHO 光柱 / SIGNAL 闪屏 + 翻牌动画 | 跨 screen |
| **快速共鸣** | 设置开关，十连 R/SR 跳仪式，RES 永远保留 | 设置面板 |
| **战斗皮肤联动** | A/B/C 三槽位 modal 选 SSR 设为出战皮肤 | 图鉴二级 |
| **PC 适配** | 虚拟手机框 + 极光粒子 + 顶部水印 + 键盘 1-6/Space 战斗快捷键 | 全局 |
| **账号预留** | `_localSoulId / _schemaVersion / sync hook stub` + 旧数据迁移 | 全局 |

---

## 🎨 你定下的微调（我执行了）

- ✅ 兔女郎卡池合并入混池（POOL_CONFIG.bunny 删除，池数 3→2）
- ✅ 兔女郎合集 9 套 cos 删除（bunny-02/miku/kato/scathach/atago/shinobu/ahri/mai/lancer）
- ✅ 吉他妹妹 cos 删除（guitar）
- ✅ 喜多川兔女郎保留（属妍子单 cos 套）
- ✅ 小雨设计为可玩 coser（用 `img/小雨/xy-1.jpg ~ xy-7.jpg`，做成"夏日呢喃" 1 SSR + 2 SR + 4 R）
- ✅ Aria 接入为虚拟原创 IP（"极光初鸣" 1 SSR + 1 SR + 2 R）
- ✅ 每个 coser 独立货币（per coser 隔离 Beacon/Crystal/Fragment）

---

## 🎨 我作为 PM/策划/美术总监做的判断

| 判断 | 理由 |
|---|---|
| **稀有度术语 SSR/SR/R → RESONANCE/ECHO/SIGNAL** | 跟 Memoria 世界观一致（共鸣 / 回响 / 信号），保留 SSR/SR/R 短标签用在卡片角标 |
| **商店入口** | 顶部 Beacon 数字点击 + 「我的」页"Crystal Station"入口 → 全屏 overlay。不占独立 tab，符合 Demo 4-tab 设计 |
| **任务合并到「我的」** | 签到 → 每日守护日历；分享/邀请 → 每日呼唤任务卡。不再有独立"任务"tab |
| **签到奖励梯度** | 1/1/2/1/2/2/5 Crystal（第 7 天 5 Crystal 强激励），每天 +1 抽卡券 |
| **角色 archetype 形态固定** | 一个角色（不论哪张 SSR）固定一个 A/B/C 形态，符合"角色身份不变"的逻辑 |
| **小雨 archetype** | B · REFLECT (雨 · 反击型)，跟治愈系/温柔形象吻合 |
| **Aria archetype** | C · OVERFLOW (光 · 极光蓄能爆发)，跟虚拟极光形象吻合 |
| **首充奖励/Chapter 设计** | 妍子 Chapter Ⅰ · 卡提希娅；小雨 Chapter Ⅰ · 夏日呢喃；Aria Chapter Ⅰ · 极光初鸣 — 每位 Memoria 都有首章主题 |

---

## ❓ 等你起来一起决定的（窗口）

### D1 · Aria 的素材数量太少（仅 4 张）
**现状**：v1-v4 做成 1 SSR + 1 SR + 2 R。
**问题**：玩家抽 Aria 池快速集齐后没成就感。
**选项**：
- A：保持 4 张，作为"虚拟先驱"占位（V1.5 再扩素材）
- B：补 10-14 张原创素材后再让 Aria 池开放

### D2 · 小雨 cos 数量
**现状**：只有 1 套 cos "夏日呢喃"。
**未来**：要不要拍 2-3 套小雨 cos 让她有"图鉴感"，否则点开小雨档案只有 1 个 cell。

### D3 · Crystal 货币的真实付费定价
**现状**：60 Crystal = ¥3 / 660 Crystal = ¥30（加赠 60）。
**关键**：Crystal 跟 Beacon 的兑换关系？现在没设计 Crystal → 抽卡的路径。建议 Crystal 可解锁限定池抽券、月卡、专属皮肤。

### D4 · 抽卡跳过的 SSR 仪式时长
**现状**：SSR cut-in 2 秒不可 skip。
**待评估**：玩家连抽 20 次出 3 张 SSR 会嫌 6 秒动画长吗？建议 V1.5 加"长按 skip 仪式"选项。

### D5 · 法律/IP（重要 · 复盘里提过）
**未解决**：抽卡商品包含 2B / 雷电将军 / 雅儿贝德 / 胡桃 等他人 IP cos。
**建议**：V1 测试期不公域宣传，V2.0 接真实支付前要做：
- A：保留角色名（私域不公开，米哈游/角川追究难度低）
- B：抽象化重命名（白衣战姬 / 雷之巫女），失去 cos 辨识度但合规

### D6 · 邀请奖励防刷
**现状**：`?inviter=` URL 参数，可自送。
**待加**：V2.0 接后端时校验邀请人和被邀人是不同账号。

---

## 📋 体验过的关键流程（截图）

| 流程 | 截图 |
|---|---|
| 卡池页（妍子+小雨+Aria） | `/tmp/N1-channel.png` |
| 图鉴一级（她们的档案） | `/tmp/N2-archive.png` |
| 我的页（守护者 + 签到 + 三资产） | `/tmp/N3-me.png` |
| Crystal Station（全屏商店） | `/tmp/N4-cs.png` |
| 单抽妍子 → R 卡 | `/tmp/F1-single-pull.png` |
| 小雨十连 → 7 张 | `/tmp/F2-xiaoyu-ten.png` |
| 妍子图鉴二级 | `/tmp/F3-yanzi-archive.png` |
| PC 虚拟手机框 | `/tmp/F6-pc.png` |

---

## 🔧 技术债（V2.0 接后端时一起处理）

- 客户端抽卡概率/保底可改（要服务端校验）
- 图片直链 `img/` 可批量爬取（V2.0 加 CDN 鉴权）
- localStorage 状态可篡改
- 邀请奖励无防刷
- `_lastSyncedAt` 字段已留但未触发云同步 hook
- 频率定位的选 SSR UI 用 `prompt()`（V1.5 换精美 modal）
- 离线原图下载权未实装（依赖后端）

---

## 💾 文件结构

```
yanzi-gacha/
├── index.html                       # V2 主游戏（重写）
├── index.v1.bak.html                # V1 备份（保险）
├── js/
│   ├── cosers.js                    # 多 coser 数据层（替代 cards.js）
│   ├── state.js                     # GameState（多 coser 隔离 + 账号预留）
│   ├── gacha.js                     # 抽卡引擎（per coser）
│   ├── ui.js                        # 4 screen 渲染逻辑
│   ├── app.js                       # 路由 + 启动 + 设置面板
│   ├── sfx.js                       # 音效（不动）
│   └── *.v1.bak.js                  # V1 备份
├── battle/                          # 频率战（不动，已读 V2 state）
├── spec/wireframe.html              # Demo（不动）
├── css/style.css                    # V2 主题（含 V1 复用部分）
└── docs/specs/2026-05-15-v2-rebuild-decisions.md   # 本文件
```

---

下面留空给你起来后写回复：

```
[你的笔记]



```
