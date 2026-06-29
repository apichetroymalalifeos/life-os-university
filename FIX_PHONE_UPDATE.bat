@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo =====================================
echo Life OS - Fix Phone Update
echo =====================================
echo.
echo ปัญหา: คอมเห็นเวอร์ชันใหม่ แต่โทรศัพท์ยังเห็นเวอร์ชันเก่า
echo สาเหตุหลัก: ไฟล์ในเครื่องยังไม่ได้ publish ขึ้น GitHub Pages หรือ iPhone ยังถือ PWA cache เก่า
echo.
echo ขั้นตอนนี้จะ:
echo 1. ตรวจไฟล์สำคัญ index.html / version.json / manifest.webmanifest / fresh.html
echo 2. ซ่อม Git repository ถ้า .git เสีย
echo 3. Commit และ push โปรเจกต์นี้ขึ้น GitHub Pages
echo 4. เปิด GitHub Actions ให้รอจนเป็นสีเขียว
echo.
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0publish-life-os.ps1" -UpdateVersion -NoPrompt -OpenActions -DefaultMessage "Publish Life OS v6.4 phone update"
echo.
echo หลัง GitHub Actions เป็นสีเขียว ให้เปิดลิงก์นี้บนมือถือ:
echo https://apichetroymalalifeos.github.io/life-os-university/index.html?fresh=1
echo.
echo ถ้ายังไม่เปลี่ยน ให้เปิด:
echo https://apichetroymalalifeos.github.io/life-os-university/fresh.html
echo.
pause
