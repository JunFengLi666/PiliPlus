# Tasks

- [x] Task 1: 新增设置项 — 在 storage_key.dart 和 storage_pref.dart 中添加 `showAiInLater`、`showAiBeforePlay`、`autoLoadAiSummary` 三个设置项
  - [x] SubTask 1.1: 在 `SettingBoxKey` 中添加三个新 key
  - [x] SubTask 1.2: 在 `Pref` 中添加三个对应的 getter，设置合理默认值
  - [x] SubTask 1.3: 在设置页面（视频设置或AI设置区域）添加对应的开关 UI

- [x] Task 2: 实现 AI 总结缓存服务 — 创建 `AiSummaryCache` 类，管理稍后观看页面的 AI 总结内存缓存
  - [x] SubTask 2.1: 创建缓存数据结构 `Map<String, AiConclusionResult>`，key 为 `${bvid}_$cid`
  - [x] SubTask 2.2: 实现 get/set 方法，支持缓存过期检查（1小时）
  - [x] SubTask 2.3: 将缓存服务注册到 GetX 依赖管理中，与稍后观看页面生命周期绑定

- [x] Task 3: 改造稍后观看视频卡片 — 在 `VideoCardHLater` 中新增 AI 总结摘要展示区域
  - [x] SubTask 3.1: 根据方案A设计，在卡片右侧信息区下方添加 AI 摘要浅色背景区域
  - [x] SubTask 3.2: 摘要默认显示2行，点击可展开全文
  - [x] SubTask 3.3: 未加载AI总结时显示"点击加载AI总结"按钮
  - [x] SubTask 3.4: 将移除按钮从右上角移至底部操作栏，与播放按钮并排

- [x] Task 4: 稍后观看控制器增强 — 在 `LaterController` 中添加 AI 总结请求逻辑
  - [x] SubTask 4.1: 添加按需加载方法，单个视频请求 AI 总结
  - [x] SubTask 4.2: 添加自动加载逻辑，批量请求可见区域视频的 AI 总结（限流3并发，200ms间隔）
  - [x] SubTask 4.3: 集成 `AiSummaryCache`，请求前检查缓存

- [x] Task 5: 实现点击视频弹出AI总结面板 — 新增底部弹窗组件
  - [x] SubTask 5.1: 创建 `AiSummaryBeforePlaySheet` 组件，显示视频标题、封面缩略图、AI总结摘要和大纲
  - [x] SubTask 5.2: 面板底部提供"播放视频"和"不看了，移除"两个按钮
  - [x] SubTask 5.3: 修改 `VideoCardHLater` 的 onTap 逻辑，根据 `showAiBeforePlay` 设置决定是否先弹出面板

- [x] Task 6: 网页端 Userscript 原型 — 编写 Tampermonkey 脚本实现网页端 AI 总结注入
  - [x] SubTask 6.1: 编写脚本框架，监听 bilibili.com/watchlater/ 页面
  - [x] SubTask 6.2: 实现从页面提取 bvid/cid 的逻辑
  - [x] SubTask 6.3: 实现 Wbi 签名（从页面 JS 上下文获取或自行实现）
  - [x] SubTask 6.4: 实现 AI 总结 API 调用和 DOM 注入
  - [x] SubTask 6.5: 实现"不看了"快捷移除按钮
  - [x] SubTask 6.6: 实现点击视频弹出AI总结浮层（拦截默认跳转）

# Task Dependencies

- [Task 2] depends on [Task 1] (缓存需要知道是否开启自动加载设置)
- [Task 3] depends on [Task 1] (卡片需要读取设置项) and [Task 2] (卡片需要从缓存读取AI总结)
- [Task 4] depends on [Task 2] (控制器使用缓存服务)
- [Task 5] depends on [Task 1] (需要读取设置项) and [Task 4] (需要控制器提供AI总结数据)
- [Task 6] is independent (网页端独立实现)
