@echo off
chcp 65001 >nul

echo ============================================
echo          更新 GitHub Hosts 文件
echo ============================================
echo.

set "hostsFile=C:\Windows\System32\drivers\etc\hosts"
set "tempFile=%temp%\hosts_temp.txt"

echo 创建新的 hosts 文件内容...

echo 127.0.0.1 localhost > "%tempFile%"
echo ::1 localhost >> "%tempFile%"
echo. >> "%tempFile%"
echo # GitHub - 最新IP地址 >> "%tempFile%"
echo 140.82.112.4 github.com >> "%tempFile%"
echo 140.82.113.4 github.com >> "%tempFile%"
echo 140.82.114.4 github.com >> "%tempFile%"
echo 20.205.243.166 github.com >> "%tempFile%"
echo 20.205.243.167 github.com >> "%tempFile%"
echo. >> "%tempFile%"
echo # GitHub Assets >> "%tempFile%"
echo 185.199.108.133 github.githubassets.com >> "%tempFile%"
echo 185.199.109.133 github.githubassets.com >> "%tempFile%"
echo 185.199.110.133 github.githubassets.com >> "%tempFile%"
echo 185.199.111.133 github.githubassets.com >> "%tempFile%"
echo. >> "%tempFile%"
echo # GitHub API >> "%tempFile%"
echo 140.82.112.5 api.github.com >> "%tempFile%"
echo 140.82.112.6 api.github.com >> "%tempFile%"
echo. >> "%tempFile%"
echo # GitHub Pages >> "%tempFile%"
echo 185.199.108.154 github.io >> "%tempFile%"
echo 185.199.109.154 github.io >> "%tempFile%"
echo 185.199.110.154 github.io >> "%tempFile%"
echo 185.199.111.154 github.io >> "%tempFile%"
echo. >> "%tempFile%"
echo # GitHub Raw >> "%tempFile%"
echo 185.199.108.133 raw.githubusercontent.com >> "%tempFile%"
echo 185.199.109.133 raw.githubusercontent.com >> "%tempFile%"
echo 185.199.110.133 raw.githubusercontent.com >> "%tempFile%"
echo 185.199.111.133 raw.githubusercontent.com >> "%tempFile%"
echo. >> "%tempFile%"
echo # GitHub Codeload >> "%tempFile%"
echo 140.82.112.9 codeload.github.com >> "%tempFile%"
echo 140.82.113.9 codeload.github.com >> "%tempFile%"
echo 140.82.114.9 codeload.github.com >> "%tempFile%"
echo. >> "%tempFile%"
echo # GitHub Gist >> "%tempFile%"
echo 140.82.112.3 gist.github.com >> "%tempFile%"
echo 140.82.113.3 gist.github.com >> "%tempFile%"
echo. >> "%tempFile%"
echo # GitHub Avatars >> "%tempFile%"
echo 185.199.108.133 avatars.githubusercontent.com >> "%tempFile%"
echo 185.199.109.133 avatars.githubusercontent.com >> "%tempFile%"
echo 185.199.110.133 avatars.githubusercontent.com >> "%tempFile%"
echo 185.199.111.133 avatars.githubusercontent.com >> "%tempFile%"

echo 复制到 hosts 文件...
copy "%tempFile%" "%hostsFile%" /Y

if %errorlevel% equ 0 (
    echo.
    echo ============================================
    echo              更新成功！
    echo ============================================
    echo 请尝试重新连接 GitHub：
    echo   git push
) else (
    echo.
    echo ============================================
    echo              更新失败！
    echo ============================================
    echo 请确保以管理员身份运行此脚本！
)

del "%tempFile%"
echo.
pause