@echo off
chcp 65001 >nul
cd /d "%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0publish-life-os.ps1" -UpdateVersion -NoPrompt -OpenActions
echo.
echo ถ้า GitHub Actions เปิดขึ้นมา ให้รอจนสถานะเป็นสีเขียว แล้วเปิด Life OS บน iPhone อีกครั้ง
pause
