# 重名学员批量下载修复 - Verification Checklist

- [x] Checkpoint 1: 确认createReportCard函数生成的卡片ID包含_globalIndex
- [x] Checkpoint 2: 确认createOverallReportCard函数生成的卡片ID包含_globalIndex
- [x] Checkpoint 3: 确认downloadAllReports函数使用新的卡片ID格式
- [x] Checkpoint 4: 确认renderReportCards函数传递_globalIndex到cardData
- [x] Checkpoint 5: 确认单个下载按钮能正确处理重名学员
- [ ] Checkpoint 6: 测试重名学员场景下预览页面显示正常
- [ ] Checkpoint 7: 测试重名学员场景下批量下载包含所有学员报告
- [ ] Checkpoint 8: 测试非重名学员场景下功能正常
