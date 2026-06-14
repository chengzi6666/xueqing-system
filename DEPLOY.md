# 学员学习报告系统 - 腾讯云开发部署指南

## 部署步骤

### 1. 准备工作

1. **安装 Node.js**
   - 下载地址：https://nodejs.org/
   - 建议安装 LTS 版本

2. **创建腾讯云开发环境**
   - 访问 https://console.cloud.tencent.com/tcb
   - 创建一个新的云开发环境

3. **获取 API 密钥**
   - 访问 https://console.cloud.tencent.com/cam/capi
   - 创建 API 密钥（需要管理员权限）

### 2. 一键部署

直接运行 `deploy.bat` 脚本：

```bash
deploy.bat
```

脚本会自动完成以下操作：
- 安装 CloudBase CLI（如未安装）
- 登录腾讯云
- 部署云函数
- 部署静态网站
- 创建数据库集合
- 配置数据库安全规则
- 更新前端 API 地址

### 3. 手动部署（可选）

如果一键脚本有问题，可以手动执行以下步骤：

```bash
# 1. 安装 CloudBase CLI
npm install -g @cloudbase/cli

# 2. 登录腾讯云
tcb login --secretId YOUR_SECRET_ID --secretKey YOUR_SECRET_KEY

# 3. 部署云函数
tcb functions:deploy api --envId YOUR_ENV_ID

# 4. 部署静态网站
tcb hosting:deploy . --envId YOUR_ENV_ID

# 5. 创建数据库集合
tcb database:collection:create outlines --envId YOUR_ENV_ID
tcb database:collection:create student_data --envId YOUR_ENV_ID
tcb database:collection:create config --envId YOUR_ENV_ID
tcb database:collection:create versions --envId YOUR_ENV_ID
tcb database:collection:create outline_history --envId YOUR_ENV_ID

# 6. 配置数据库安全规则
tcb database:rule:set --envId YOUR_ENV_ID --collection "*" --rule "{\"read\":true,\"write\":true}"

# 7. 获取云函数地址并更新前端
tcb functions:detail api --envId YOUR_ENV_ID
# 将返回的 accessUrl 更新到 teacher.js 和 developer.js 中
```

### 4. 访问地址

部署完成后，访问以下地址：

- 老师端：`https://YOUR_ENV_ID.service.tcloudbase.com/index.html`
- 开发者端：`https://YOUR_ENV_ID.service.tcloudbase.com/developer.html`

### 5. 初始密码

开发者端登录密码：`admin123`

## 项目结构

```
.
├── cloudfunctions/
│   └── api/
│       ├── index.js      # 云函数入口
│       └── package.json  # 依赖配置
├── cloudbaserc.json      # 云开发配置
├── deploy.bat            # 一键部署脚本
├── index.html            # 老师端页面
├── developer.html        # 开发者端页面
├── teacher.js/css        # 老师端代码
├── developer.js/css      # 开发者端代码
└── images/               # 图片资源
```

## 数据库集合说明

| 集合名称 | 说明 |
|----------|------|
| outlines | 课程大纲数据 |
| student_data | 学生学习数据 |
| config | 系统配置 |
| versions | 版本历史记录 |
| outline_history | 大纲历史版本 |

## 注意事项

1. 确保 API 密钥具有云开发相关权限
2. 云开发环境需要开启静态网站托管功能
3. 首次部署可能需要几分钟时间
4. 如果部署失败，请检查网络连接和权限配置