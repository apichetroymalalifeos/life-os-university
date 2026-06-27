@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo ==============================
echo Fix GitHub Pages Publish
echo ==============================
echo.
echo ระบบจะซ่อม Git repository ถ้า .git เสีย แล้ว publish Life OS ขึ้น GitHub Pages
echo ถ้า GitHub repository มีประวัติเก่า ระบบจะใช้โปรเจกต์ในเครื่องนี้เป็นต้นฉบับล่าสุด
echo.
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0publish-life-os.ps1" -UpdateVersion -NoPrompt -OpenActions -DefaultMessage "Fix GitHub Pages publish"
echo.
echo หลังจากหน้าต่าง GitHub Actions เปิดขึ้นมา ให้รอจนสถานะเป็นสีเขียว
echo แล้วเปิดลิงก์นี้บนมือถือ:
echo https://apichetroymalalifeos.github.io/life-os-university/fresh.html
echo.
pause
