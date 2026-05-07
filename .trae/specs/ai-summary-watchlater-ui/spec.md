# 稍后观看 AI 总结增强 UI 规格

## Why

当前稍后观看列表仅展示视频标题、封面、UP主、播放量等基础信息，用户无法在列表层面快速判断视频内容是否值得观看。AI 总结功能已存在于视频详情页中，但未在稍后观看列表中复用。将 AI 总结前置到列表层，可以帮助用户高效筛选视频，减少无效点击。

## What Changes

- 在稍后观看列表中为每个视频卡片新增 AI 总结摘要展示
- 新增"点击视频前弹出总结"的设置项
- 在稍后观看列表中新增 AI 总结按钮入口
- 设计适配手机屏幕的高信息密度 UI 布局
- 提供快速"取消稍后观看"按钮
- 讨论电脑网页端通过浏览器插件/扩展的实现方案

## Impact

- Affected specs: 稍后观看列表 UI、AI 总结调用链路、设置页
- Affected code:
  - `lib/pages/later/widgets/video_card_h_later.dart` — 稍后观看视频卡片
  - `lib/pages/later/controller.dart` — 稍后观看控制器
  - `lib/pages/later/child_view.dart` — 稍后观看子页面
  - `lib/pages/video/introduction/ugc/controller.dart` — AI 总结获取逻辑
  - `lib/models_new/later/list.dart` — 稍后观看数据模型
  - `lib/utils/storage_key.dart` / `lib/utils/storage_pref.dart` — 设置项
  - `lib/pages/setting/view.dart` — 设置页面

---

## 第一部分：AI 总结现有实现分析

### 1.1 API 调用链路

AI 总结通过 Bilibili Web API 获取：

```
GET /x/web-interface/view/conclusion/get
参数: bvid, cid, up_mid
需要 Wbi 签名
```

代码位置：[api.dart:542](file:///workspace/lib/http/api.dart#L542)

### 1.2 数据模型

```
AiConclusionData
  └── modelResult: AiConclusionResult
        ├── summary: String?        // AI 总结摘要文本
        └── outline: List<Outline>? // 视频大纲
              ├── title: String?              // 章节标题
              └── partOutline: List<PartOutline>?
                    ├── timestamp: int?  // 时间戳（秒）
                    └── content: String? // 该段落内容描述
```

代码位置：
- [data.dart](file:///workspace/lib/models_new/video/video_ai_conclusion/data.dart)
- [model_result.dart](file:///workspace/lib/models_new/later/data.dart)
- [outline.dart](file:///workspace/lib/models_new/video/video_ai_conclusion/outline.dart)
- [part_outline.dart](file:///workspace/lib/models_new/video/video_ai_conclusion/part_outline.dart)

### 1.3 获取流程

1. 用户在视频详情页点击 AI 总结按钮
2. 调用 `VideoDetailController.getAiConclusion(bvid, cid, mid)`
3. 内部调用 `VideoHttp.aiConclusion()` 发起 API 请求
4. 请求需要 Wbi 签名（`WbiSign.makSign`）
5. 返回 `AiConclusionResult`，包含 `summary` 和 `outline`
6. 如果 `code == 1`，提示"AI处理中，请稍后再试"
7. 如果其他错误，提示"当前视频暂不支持AI视频总结"

代码位置：[ugc/controller.dart:782-814](file:///workspace/lib/pages/video/introduction/ugc/controller.dart#L782)

### 1.4 UI 展示

- AI 总结面板 `AiConclusionPanel` 以底部弹窗形式展示
- 顶部显示 `summary` 摘要文本
- 下方显示 `outline` 大纲列表，每个大纲项包含章节标题和时间戳段落
- 时间戳可点击跳转到视频对应位置

代码位置：[ai_conclusion/view.dart](file:///workspace/lib/pages/video/ai_conclusion/view.dart)

### 1.5 设置项

当前仅有一个开关 `enableAi`（默认 `false`），控制是否在视频介绍区域显示 AI 总结入口按钮。

代码位置：[storage_pref.dart:806](file:///workspace/lib/utils/storage_pref.dart#L806)

---

## 第二部分：稍后观看列表现有实现分析

### 2.1 数据模型

```
LaterItemModel
  ├── aid, bvid, cid       // 视频标识
  ├── pic                   // 封面图
  ├── title                 // 标题
  ├── duration              // 时长
  ├── progress              // 观看进度（-1=已看完）
  ├── owner (name, face, mid) // UP主信息
  ├── stat (view, danmaku)  // 播放量/弹幕数
  ├── isPgc, pgcLabel       // 番剧标记
  └── dimension             // 视频尺寸
```

代码位置：[later/list.dart](file:///workspace/lib/models_new/later/list.dart)

**注意**：`LaterItemModel` 中没有 AI 总结相关字段，AI 总结需要额外请求。

### 2.2 API

| 功能 | 端点 | 方法 |
|------|------|------|
| 获取稍后观看列表 | `/x/v2/history/toview/web` | GET |
| 添加稍后观看 | `/x/v2/history/toview/add` | POST |
| 删除稍后观看 | `/x/v2/history/toview/v2/dels` | POST |
| 清空稍后观看 | `/x/v2/history/toview/clear` | POST |

### 2.3 当前 UI 布局

稍后观看列表使用水平卡片布局（`VideoCardHLater`）：
- 左侧：封面图（16:9 比例），叠加进度条/时长/标签
- 右侧：标题（2行）+ UP主名 + 播放量/弹幕 + 右下角删除按钮

代码位置：[video_card_h_later.dart](file:///workspace/lib/pages/later/widgets/video_card_h_later.dart)

---

## 第三部分：新 UI 设计方案

### 3.1 设计目标

在手机屏幕（约 360-430dp 宽度）中：
1. 展示视频标题和封面
2. 展示 AI 总结摘要
3. 提供快速"取消稍后观看"操作
4. 保持列表滚动流畅
5. 信息密度高但不杂乱

### 3.2 方案 A：卡片内嵌摘要（推荐）

```
┌──────────────────────────────────────────┐
│ ┌────────┐  视频标题最多两行...          │
│ │        │  UP主名 · 播放量 弹幕         │
│ │  封面   │  ┌─────────────────────────┐ │
│ │  16:9  │  │🤖 AI: 这是一段关于...    │ │
│ │  5:32  │  │视频的主要内容概述，最多  │ │
│ └────────┘  │显示两行，超出省略...     │ │
│             └─────────────────────────┘ │
│                          [✕ 移除] [▶ 播放]│
└──────────────────────────────────────────┘
```

**特点**：
- AI 摘要以浅色背景卡片内嵌在右侧信息区
- 摘要默认折叠为 2 行，点击可展开
- 底部操作栏：移除按钮 + 播放按钮
- 卡片高度增加约 40-50dp

**信息层次**：
1. 封面 + 标题（第一优先级）
2. AI 摘要（第二优先级，浅色背景区分）
3. UP主 + 统计数据（第三优先级）
4. 操作按钮（第四优先级）

### 3.3 方案 B：摘要展开式

```
┌──────────────────────────────────────────┐
│ ┌────────┐  视频标题最多两行...          │
│ │        │  UP主名 · 播放量 弹幕    [✕]  │
│ │  封面   │                              │
│ │  5:32  │  🤖 AI总结 ▼                 │
│ └────────┘                              │
├──────────────────────────────────────────┤
│ 🤖 这是一段关于视频主要内容的概述，最多 │
│ 显示两行，超出省略...          [不看了]  │
└──────────────────────────────────────────┘
```

**特点**：
- AI 摘要默认折叠，点击"AI总结 ▼"展开
- 展开后摘要区域横跨整行
- "不看了"按钮在展开区域内，与摘要一起显示
- 卡片默认高度与现有一致，展开后增加高度

### 3.4 方案 C：双行紧凑式

```
┌──────────────────────────────────────────┐
│ ┌────────┐  视频标题最多一行...     [✕]  │
│ │  封面   │  UP主 · 播放 弹幕  5:32      │
│ │        │  🤖 关于视频内容的AI摘要...   │
│ └────────┘                              │
└──────────────────────────────────────────┘
```

**特点**：
- 标题限制为 1 行，腾出空间给 AI 摘要
- AI 摘要 1 行，灰色小字
- 删除按钮移到右上角
- 卡片高度基本不变
- 信息密度最高，但可读性略降

### 3.5 方案对比

| 维度 | 方案A 内嵌摘要 | 方案B 展开式 | 方案C 紧凑式 |
|------|---------------|-------------|-------------|
| 信息密度 | 中高 | 中（折叠时低） | 最高 |
| 可读性 | 好 | 好 | 一般 |
| 卡片高度增加 | ~50dp | 0~60dp | ~0dp |
| 交互复杂度 | 低 | 中 | 低 |
| AI摘要可见性 | 默认可见 | 需展开 | 默认可见但短 |

**推荐方案 A**，理由：
- AI 摘要默认可见，用户无需额外操作
- 内嵌浅色背景区分信息层次
- 高度增加可控，不影响列表体验

### 3.6 设置项设计

新增设置项：

| 设置项 | Key | 类型 | 默认值 | 说明 |
|--------|-----|------|--------|------|
| 稍后观看显示AI总结 | `showAiInLater` | bool | false | 是否在稍后观看列表中显示AI总结 |
| 点击视频弹出总结 | `showAiBeforePlay` | bool | false | 点击视频时先弹出AI总结面板，再选择是否播放 |
| AI总结自动加载 | `autoLoadAiSummary` | bool | false | 进入稍后观看时自动加载所有AI总结（否则按需加载） |

设置位置：设置页 → 视频设置 → AI 总结相关

### 3.7 交互流程

#### 流程1：列表中查看AI总结

```
用户进入稍后观看列表
  → 列表加载视频数据（现有逻辑）
  → 如果 showAiInLater 开启：
      → 卡片渲染时，检查是否已有缓存的 AI 总结
      → 如果无缓存且 autoLoadAiSummary 开启：
          → 后台批量请求 AI 总结（限流，最多同时3个请求）
          → 结果缓存到内存 Map<bvid, AiConclusionResult>
      → 如果无缓存且 autoLoadAiSummary 关闭：
          → 显示"点击加载AI总结"按钮
          → 用户点击后请求并缓存
      → 卡片显示 AI 摘要（summary 前2行）
```

#### 流程2：点击视频弹出总结

```
用户点击稍后观看中的视频
  → 如果 showAiBeforePlay 开启：
      → 先请求/读取 AI 总结
      → 弹出底部面板，显示：
          - 视频标题 + 封面缩略图
          - AI 总结摘要
          - 视频大纲（可折叠）
          - [播放视频] [不看了，移除] 按钮
      → 用户选择"播放视频"：正常进入播放
      → 用户选择"不看了"：移除稍后观看，留在列表页
  → 如果 showAiBeforePlay 关闭：
      → 直接进入播放（现有逻辑）
```

#### 流程3：快速移除

```
用户在卡片上点击"移除"按钮
  → 如果当前 AI 总结已加载：
      → 可选：在移除确认弹窗中显示 AI 摘要，辅助决策
  → 直接移除（现有逻辑，弹窗确认后删除）
```

### 3.8 AI 总结缓存策略

由于 AI 总结 API 需要单独请求（不在稍后观看列表 API 返回中），需要设计缓存：

```
AiSummaryCache (内存缓存)
  ├── Map<String, AiConclusionResult> _cache  // key: "${bvid}_$cid"
  ├── DateTime? _cacheTime                     // 缓存时间
  ├── maxAge: Duration(hours: 1)               // 缓存有效期1小时
  │
  ├── Future<AiConclusionResult?> get(bvid, cid)  // 获取缓存
  └── void set(bvid, cid, result)                  // 设置缓存
```

- 缓存生命周期：与稍后观看页面绑定，退出页面时清除
- 同一视频不重复请求
- 请求失败不缓存，允许重试

### 3.9 批量请求限流

如果开启自动加载，需要限制并发：

- 最大并发数：3
- 请求间隔：200ms（避免触发 API 限流）
- 仅请求可见区域的视频 AI 总结（利用滚动回调）
- 用户滚动时动态加载新进入视口的视频总结

---

## 第四部分：电脑网页端实现方案

### 4.1 方案选型

网页端不考虑 Flutter，采用浏览器扩展（Chrome Extension / Userscript）方式实现。

| 方案 | 优势 | 劣势 |
|------|------|------|
| Chrome Extension | 可发布到商店、权限丰富、持久安装 | 需要审核、仅Chrome系 |
| Userscript (Tampermonkey) | 跨浏览器、开发简单、无需审核 | 需安装脚本管理器 |
| Bookmarklet | 零安装 | 功能受限、体验差 |

**推荐**：优先开发 Userscript，后续可包装为 Chrome Extension。

### 4.2 核心实现思路

#### 4.2.1 注入 AI 总结到稍后观看页面

```
1. 监听 Bilibili 稍后观看页面 URL: bilibili.com/watchlater/
2. 等待页面 DOM 加载完成
3. 遍历视频列表项，提取每个视频的 bvid 和 cid
4. 对每个视频调用 AI 总结 API:
   GET https://api.bilibili.com/x/web-interface/view/conclusion/get
   参数: bvid, cid, up_mid
   需要 Wbi 签名（从页面 cookie/JS 中获取签名参数）
5. 将返回的 summary 插入到视频卡片 DOM 中
6. 添加"移除"快捷按钮
```

#### 4.2.2 Wbi 签名在网页端的处理

网页端有两种方式获取 Wbi 签名：

**方式一：利用页面自身签名**
- Bilibili 网页本身已包含 Wbi 签名逻辑
- 可以从页面的 JS 上下文中调用签名函数
- 或拦截页面已有的 API 请求，复用签名参数

**方式二：自行实现签名**
- 从 `https://api.bilibili.com/x/web-interface/nav` 获取 `img_url` 和 `sub_url`
- 提取 mixin key，按 Bilibili Wbi 签名算法生成签名
- 这是目前 Flutter 端 `WbiSign.makSign` 的实现方式

代码参考：[wbi_sign.dart](file:///workspace/lib/utils/wbi_sign.dart)

#### 4.2.3 DOM 注入 UI

```javascript
// 伪代码：为每个稍后观看视频卡片注入 AI 总结
function injectAiSummary(videoItem, summary) {
  const card = videoItem.element;
  const summaryDiv = document.createElement('div');
  summaryDiv.className = 'ai-summary-inline';
  summaryDiv.innerHTML = `
    <div class="ai-summary-badge">🤖 AI总结</div>
    <div class="ai-summary-text">${summary}</div>
    <div class="ai-summary-actions">
      <button class="btn-remove">不看了</button>
    </div>
  `;
  card.querySelector('.video-card-body').appendChild(summaryDiv);
}
```

#### 4.2.4 点击视频弹出总结

```javascript
// 拦截视频点击事件
videoItem.addEventListener('click', async (e) => {
  if (settings.showAiBeforePlay) {
    e.preventDefault();
    e.stopPropagation();
    const summary = await getAiSummary(bvid, cid);
    showSummaryModal(videoItem, summary);
  }
}, true); // capture phase
```

### 4.3 网页端 UI 布局

电脑端屏幕空间充裕，可采用侧边栏或弹窗：

```
┌─────────────────────────────────────────────────────────┐
│  Bilibili 稍后再看                                       │
├─────────────────────────────────────────────────────────┤
│ ┌──────────────────────┐  ┌──────────────────────────┐ │
│ │ ┌──────┐             │  │ ┌──────┐                 │ │
│ │ │ 封面  │ 视频标题    │  │ │ 封面  │ 视频标题       │ │
│ │ │      │ UP主 · 播放  │  │ │      │ UP主 · 播放     │ │
│ │ └──────┘             │  │ └──────┘                 │ │
│ │ 🤖 AI: 视频摘要...   │  │ 🤖 AI: 视频摘要...      │ │
│ │         [不看了] [▶]  │  │         [不看了] [▶]     │ │
│ └──────────────────────┘  └──────────────────────────┘ │
│ ┌──────────────────────┐  ┌──────────────────────────┐ │
│ │ ...                   │  │ ...                      │ │
│ └──────────────────────┘  └──────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

电脑端特点：
- 可使用双列/多列网格布局
- AI 摘要可以显示更多内容（3-4行）
- 鼠标悬停可显示完整总结 tooltip
- 操作按钮更宽敞

### 4.4 网页端设置面板

通过扩展 popup 或页面内浮层提供设置：

```
┌─────────────────────────┐
│ AI 总结增强 设置         │
├─────────────────────────┤
│ ☑ 在稍后观看中显示AI总结  │
│ ☐ 点击视频前弹出总结      │
│ ☐ 自动加载所有AI总结      │
│ 摘要显示行数: [2] ▼      │
└─────────────────────────┘
```

---

## ADDED Requirements

### Requirement: 稍后观看列表 AI 总结展示

系统 SHALL 在稍后观看列表的视频卡片中提供 AI 总结摘要的展示功能。

#### Scenario: 用户开启稍后观看AI总结显示

- **WHEN** 用户在设置中开启"稍后观看显示AI总结"
- **THEN** 稍后观看列表的每个视频卡片下方显示 AI 总结摘要（默认2行，超出省略）
- **AND** 摘要以浅色背景区域与视频基础信息区分

#### Scenario: AI总结按需加载

- **WHEN** 用户未开启"AI总结自动加载"
- **THEN** 卡片初始显示"点击加载AI总结"按钮
- **WHEN** 用户点击该按钮
- **THEN** 请求该视频的AI总结并显示摘要

#### Scenario: AI总结自动加载

- **WHEN** 用户开启"AI总结自动加载"
- **THEN** 进入稍后观看页面后，自动为可见区域的视频请求AI总结
- **AND** 并发请求数不超过3个，请求间隔不小于200ms

### Requirement: 点击视频弹出AI总结

系统 SHALL 提供设置项，允许用户在点击稍后观看中的视频时先查看AI总结再决定是否播放。

#### Scenario: 开启点击弹出总结

- **WHEN** 用户在设置中开启"点击视频前弹出总结"
- **AND** 用户点击稍后观看列表中的视频
- **THEN** 弹出底部面板，显示视频标题、封面缩略图、AI总结摘要和大纲
- **AND** 面板底部提供"播放视频"和"不看了，移除"两个操作按钮

#### Scenario: 用户选择播放

- **WHEN** 用户在AI总结面板中点击"播放视频"
- **THEN** 关闭面板，正常进入视频播放

#### Scenario: 用户选择不看了

- **WHEN** 用户在AI总结面板中点击"不看了，移除"
- **THEN** 将该视频从稍后观看列表中移除
- **AND** 停留在稍后观看列表页

### Requirement: 快速移除稍后观看

系统 SHALL 在稍后观看列表卡片中提供快速移除按钮。

#### Scenario: 快速移除视频

- **WHEN** 用户点击视频卡片上的移除按钮
- **THEN** 弹出确认对话框
- **AND** 确认后将视频从稍后观看列表中移除

### Requirement: AI总结缓存

系统 SHALL 对已获取的AI总结进行内存缓存，避免重复请求。

#### Scenario: 缓存命中

- **WHEN** 用户滚动列表，之前已请求过AI总结的视频再次进入视口
- **THEN** 直接从缓存读取AI总结显示，不发起网络请求

#### Scenario: 缓存过期

- **WHEN** AI总结缓存超过1小时
- **THEN** 下次访问时重新请求

### Requirement: 网页端浏览器扩展实现

系统 SHALL 提供浏览器扩展/Userscript 方式在 Bilibili 网页端实现相同的AI总结增强功能。

#### Scenario: Userscript 注入AI总结

- **WHEN** 用户在安装了 Userscript 的浏览器中访问 bilibili.com/watchlater/
- **THEN** 脚本自动为稍后观看列表中的视频卡片注入AI总结摘要
- **AND** 提供"不看了"快捷移除按钮

#### Scenario: 网页端点击弹出总结

- **WHEN** 用户在网页端开启"点击视频前弹出总结"设置
- **AND** 点击稍后观看列表中的视频
- **THEN** 拦截默认跳转，弹出AI总结浮层
- **AND** 浮层提供"播放"和"移除"操作
