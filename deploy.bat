@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo ============================================
echo      学员学习报告系统 - 腾讯云开发部署脚本
echo ============================================
echo.

rem 检查是否已安装 node.js
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo 错误：未找到 Node.js，请先安装 Node.js
    echo 下载地址：https://nodejs.org/
    pause
    exit /b 1
)

rem 检查是否已安装 cloudbase CLI
where tcb >nul 2>&1
if %errorlevel% neq 0 (
    echo 正在安装 CloudBase CLI...
    npm install -g @cloudbase/cli
    if %errorlevel% neq 0 (
        echo 错误：安装 CloudBase CLI 失败
        pause
        exit /b 1
    )
    echo CloudBase CLI 安装成功
    echo.
)

rem 输入环境ID和密钥
set "ENV_ID="
set "SECRET_ID="
set "SECRET_KEY="

set /p ENV_ID=请输入腾讯云开发环境ID: 
if not defined ENV_ID (
    echo 错误：环境ID不能为空
    pause
    exit /b 1
)

set /p SECRET_ID=请输入腾讯云API密钥ID: 
if not defined SECRET_ID (
    echo 错误：API密钥ID不能为空
    pause
    exit /b 1
)

set /p SECRET_KEY=请输入腾讯云API密钥Key: 
if not defined SECRET_KEY (
    echo 错误：API密钥Key不能为空
    pause
    exit /b 1
)

echo.
echo ============================================
echo          开始部署到腾讯云开发
echo ============================================
echo.

rem 设置环境变量
set TCB_SECRET_ID=%SECRET_ID%
set TCB_SECRET_KEY=%SECRET_KEY%

rem 登录腾讯云
echo 1. 登录腾讯云...
tcb login --secretId %SECRET_ID% --secretKey %SECRET_KEY%
if %errorlevel% neq 0 (
    echo 错误：登录失败
    pause
    exit /b 1
)
echo 登录成功
echo.

rem 替换配置文件中的环境ID
echo 2. 配置环境ID...
powershell -Command "(Get-Content 'cloudbaserc.json') -replace '{{ENV_ID}}', '%ENV_ID%' | Set-Content 'cloudbaserc.json'"
if %errorlevel% neq 0 (
    echo 错误：配置环境ID失败
    pause
    exit /b 1
)
echo 环境ID配置成功
echo.

rem 部署云函数
echo 3. 部署云函数...
tcb functions:deploy api --envId %ENV_ID%
if %errorlevel% neq 0 (
    echo 错误：部署云函数失败
    pause
    exit /b 1
)
echo 云函数部署成功
echo.

rem 部署静态网站
echo 4. 部署静态网站...
tcb hosting:deploy . --envId %ENV_ID%
if %errorlevel% neq 0 (
    echo 错误：部署静态网站失败
    pause
    exit /b 1
)
echo 静态网站部署成功
echo.

rem 创建数据库集合
echo 5. 创建数据库集合...
tcb database:collection:create outlines --envId %ENV_ID%
tcb database:collection:create student_data --envId %ENV_ID%
tcb database:collection:create config --envId %ENV_ID%
tcb database:collection:create versions --envId %ENV_ID%
tcb database:collection:create outline_history --envId %ENV_ID%
echo 数据库集合创建成功
echo.

rem 配置数据库安全规则
echo 6. 配置数据库安全规则...
powershell -Command "$rules = @{\"read\"=true;\"write\"=true}; $rules | ConvertTo-Json -Compress | tcb database:rule:set --envId '%ENV_ID%' --collection '*' --rule -"
echo 数据库安全规则配置成功
echo.

rem 获取云函数访问地址并更新前端API配置
echo 7. 配置前端API地址...
for /f "delims=" %%a in ('tcb functions:detail api --envId %ENV_ID% ^| findstr /i "accessUrl"') do (
    set "API_URL=%%a"
)
rem 提取URL
set "API_URL=%API_URL:*accessUrl: =%"
set "API_URL=%API_URL: =%"
echo 云函数地址: %API_URL%

rem 更新 teacher.js 中的API地址
powershell -Command "(Get-Content 'teacher.js') -replace 'http://localhost:3000/api', '%API_URL%' | Set-Content 'teacher.js'"
powershell -Command "(Get-Content 'developer.js') -replace 'http://localhost:3000/api', '%API_URL%' | Set-Content 'developer.js'"
echo 前端API地址更新成功
echo.

rem 重新部署静态网站以应用API地址更新
echo 8. 重新部署静态网站...
tcb hosting:deploy . --envId %ENV_ID%
echo 静态网站重新部署成功
echo.

echo ============================================
echo              部署完成！
echo ============================================
echo.
echo 环境ID: %ENV_ID%
echo 云函数地址: %API_URL%
echo.
echo 访问地址: https://%ENV_ID%.service.tcloudbase.com
echo.
echo 请访问以上地址查看部署结果
echo.
pause