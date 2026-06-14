@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo ============================================
echo      学员学习报告系统 - 部署脚本
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

rem 部署静态网站（只部署需要的文件）
echo 部署静态网站文件...
tcb hosting:upload developer.html /developer.html --env-id %ENV_ID%
tcb hosting:upload developer.js /developer.js --env-id %ENV_ID%
tcb hosting:upload developer.css /developer.css --env-id %ENV_ID%
tcb hosting:upload index.html /index.html --env-id %ENV_ID%
tcb hosting:upload teacher.js /teacher.js --env-id %ENV_ID%
tcb hosting:upload teacher.css /teacher.css --env-id %ENV_ID%

echo.
echo ============================================
echo              部署完成！
echo ============================================
echo.
echo 访问地址: https://%ENV_ID%.service.tcloudbase.com/developer.html
echo.
echo 请访问以上地址查看部署结果
echo.
pause