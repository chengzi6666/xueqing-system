# Railway部署计划

## 一、项目概述

将"学习报告0元"项目完整部署到Railway平台，包括：
- 前端静态页面（index.html、developer.html）
- Node.js后端服务器（server/server.js）
- 数据文件持久化存储
- 图片资源托管

## 二、当前状态分析

### 项目结构
```
学习报告0元/
├── index.html          # 老师端页面
├── developer.html      # 开发者端页面
├── teacher.js          # 前端JavaScript
├── teacher.v5.css      # CSS样式
├── math_outline.json   # 数学大纲数据
├── chinese_outline.json # 语文大纲数据
├── comments.json       # 评语数据
├── config.json         # 系统配置
├── version_history.json # 版本历史
├── images/             # 图片资源（44个文件）
├── server/
│   ├── server.js       # Express后端服务器
│   ├── package.json    # 后端依赖
│   └── data/           # 数据存储目录
│       ├── outline.json
│       ├── config.json
│       ├── version_history.json
│       └── history/    # 版本历史数据
└── cloudfunctions/     # 腾讯云函数（不再使用）
```

### 后端API接口
- `GET /api/outline` - 获取大纲数据
- `POST /api/outline` - 发布大纲数据
- `GET /api/config` - 获取配置
- `PUT /api/config` - 更新配置
- `GET /api/version` - 获取版本历史
- `POST /api/version` - 发布新版本
- `GET /api/check-update` - 检查更新
- `POST /api/upload-image` - 图片上传
- `POST /api/upload-avatar` - 头像上传

### 依赖项
- express
- cors
- body-parser
- multer

## 三、部署方案

### Railway部署优势
1. 支持完整Node.js服务器运行
2. 提持持久化存储（Volume）
3. 免费额度：$5/月，足够小型项目使用
4. 自动从GitHub部署
5. 支持自定义域名

### 部署步骤

#### 步骤1：准备项目文件
1. 创建根目录`package.json`，配置启动脚本
2. 修改`server/server.js`，适配Railway环境：
   - 使用`process.env.PORT`动态端口
   - 数据目录使用绝对路径

#### 步骤2：创建Railway项目
1. 登录Railway（https://railway.app）
2. 使用GitHub账号登录
3. 创建新项目

#### 步骤3：连接GitHub仓库
1. 将项目推送到GitHub
2. 在Railway中连接GitHub仓库
3. 配置自动部署

#### 步骤4：配置持久化存储
1. 在Railway中添加Volume服务
2. 配置数据目录挂载点

#### 步骤5：部署并测试
1. 触发部署
2. 获取Railway分配的域名
3. 测试API接口和页面访问

## 四、具体修改内容

### 文件1：创建根目录package.json
```json
{
  "name": "xueqing-system",
  "version": "1.0.0",
  "scripts": {
    "start": "node server/server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "body-parser": "^1.20.2",
    "multer": "^1.4.5-lts.1"
  }
}
```

### 文件2：修改server/server.js
修改端口配置：
```javascript
const PORT = process.env.PORT || 3000;
```

修改数据目录路径（使用环境变量或绝对路径）：
```javascript
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, 'data');
```

### 文件3：创建.nvmrc文件（指定Node版本）
```
18
```

### 文件4：创建railway.toml配置文件
```toml
[build]
builder = "nixpacks"

[deploy]
startCommand = "node server/server.js"
restartPolicyType = "on_failure"
```

## 五、部署后验证

1. 访问老师端页面：`https://xxx.railway.app/index.html`
2. 访问开发者端页面：`https://xxx.railway.app/developer.html`
3. 测试API接口：
   - `GET /api/outline`
   - `GET /api/config`
   - `GET /api/version`
4. 测试图片上传功能
5. 测试版本切换功能

## 六、注意事项

1. Railway免费额度有限，需监控使用量
2. 数据持久化需要配置Volume
3. 图片上传后存储在Volume中
4. 如需自定义域名，可在Railway控制台配置

## 七、预计完成时间

- 代码修改：5分钟
- Railway部署：5-10分钟
- 测试验证：5分钟

总计：约15-20分钟