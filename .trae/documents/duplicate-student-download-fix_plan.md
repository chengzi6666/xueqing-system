# 重名学员批量下载修复计划

## 问题分析

根据用户描述：
- 之前重名学员可以正常下载
- 修改弹窗提示语后出现问题
- 预览页面能正常显示两位重名学员
- 点击全部下载按钮后，两名重名学员的图片没有成功下载

这说明：
1. ✅ 重名检测和弹窗显示正常
2. ✅ 预览页面能正常显示（`displayName` 被正确设置）
3. ❌ 下载阶段出现问题

## 可能的问题点

### 问题1：`_globalIndex` 在重名处理流程中丢失

**位置**: [teacher.v6.js:1446-1454](file:///c:/Users/matiancheng/学习报告0元/teacher.v6.js#L1446-L1454)

虽然之前修复过，但可能没有完全解决。`_globalIndex` 在以下环节可能丢失：
- CSV解析时设置的 `_globalIndex`
- 重名处理对话框中使用的 `_globalIndex`
- 重名匹配时使用的 `_globalIndex`
- 卡片渲染时使用的 `_globalIndex`
- 下载时使用的 `_globalIndex`

### 问题2：卡片ID生成和查找不一致

**位置**: 
- 创建卡片: [teacher.v6.js:2287](file:///c:/Users/matiancheng/学习报告0元/teacher.v6.js#L2287)
- 下载时查找卡片: [teacher.v6.js:2006-2010](file:///c:/Users/matiancheng/学习报告0元/teacher.v6.js#L2006-L2010)

如果创建卡片和下载时使用的ID格式不一致，就会导致找不到卡片。

### 问题3：`allReportCards` 数据不完整

**位置**: [teacher.v6.js:1757-1783](file:///c:/Users/matiancheng/学习报告0元/teacher.v6.js#L1757-L1783)

在总体评语模式下，`allReportCards` 可能没有包含所有重名学员的卡片数据。

## 修复方案

### 步骤1：添加详细调试日志

在关键节点添加日志，追踪 `_globalIndex` 的传递过程：
- CSV解析阶段
- 重名处理阶段
- 卡片渲染阶段
- 下载阶段

### 步骤2：确保 `_globalIndex` 在整个流程中保持一致

检查并修复以下环节：
1. CSV解析时设置 `_globalIndex` ✅（已修复）
2. 重名处理对话框中使用原始 `_globalIndex` ✅（已修复）
3. 重名匹配时使用 `_globalIndex` ✅（已修复）
4. 卡片渲染时使用 `_globalIndex` ✅（已修复）
5. 下载时使用 `_globalIndex` ✅（已修复）

### 步骤3：验证卡片ID的生成和查找

确保创建卡片和下载时使用相同的ID格式：
- 创建卡片: `report-${displayName}-${lesson}-${_globalIndex}`
- 下载时查找: `report-${displayName}-${lesson}-${_globalIndex}`

### 步骤4：验证 `allReportCards` 数据完整性

确保 `allReportCards` 数组包含所有学员的卡片数据，包括重名学员。

## 风险评估

- **低风险**: 添加日志不会影响现有功能
- **中风险**: 修改 `_globalIndex` 传递逻辑可能影响其他功能

## 验证标准

1. 控制台日志显示每个学员的 `_globalIndex` 正确传递
2. 预览页面显示两张不同的卡片（ID不同）
3. 点击全部下载按钮后，两名重名学员的图片都能成功下载
4. 下载的文件名包含区分标识（如 `方俊_A_第1讲.png` 和 `方俊_B_第1讲.png`）