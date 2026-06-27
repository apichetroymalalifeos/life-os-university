# คู่มือ Publish Life OS University แบบ One-Click

เป้าหมายของระบบนี้คือให้เจ้าของ Life OS ไม่ต้องจำคำสั่ง Git เลย หลังจากตั้งค่า GitHub repository ครั้งแรกแล้ว การอัปเดตจะเหลือแค่ดับเบิลคลิกไฟล์เดียว

## Workflow ปกติ

### Step 1: ให้ Codex แก้ Life OS

บอก Codex ว่าต้องการเพิ่มหรือแก้อะไรใน Life OS เช่น เพิ่มบทเรียน ปรับ UI หรือแก้ระบบ PWA

ภาพตัวอย่าง:

`[ใส่ภาพหน้าจอ: คุยกับ Codex เพื่อแก้ Life OS]`

### Step 2: ดับเบิลคลิก Publish Life OS

หลัง Codex แก้ไฟล์เสร็จ ให้ดับเบิลคลิก:

`Publish Life OS`

ระบบจะทำงานให้เอง:

- ถ้ายังไม่ได้ตั้งค่า Git repository ระบบจะพยายามตั้งค่าให้อัตโนมัติ
- ถ้ายังไม่มี remote `origin` ระบบจะเพิ่ม GitHub remote ของ Life OS ให้อัตโนมัติ
- ถ้า GitHub repository มีประวัติ commit เก่าที่ไม่ตรงกับเครื่องนี้ ระบบจะใช้โปรเจกต์ในเครื่องนี้เป็นต้นฉบับล่าสุดของ Life OS
- อัปเดต `version.json`
- ตรวจไฟล์สำคัญ `index.html`, `version.json`, `manifest.webmanifest`
- commit ไฟล์ทั้งหมด
- push ไป GitHub
- เปิดหน้า GitHub Actions

ภาพตัวอย่าง:

`[ใส่ภาพหน้าจอ: ไอคอน Publish Life OS บน Desktop หรือในโฟลเดอร์โปรเจกต์]`

### Step 3: รอ GitHub Actions เป็นสีเขียว

เมื่อหน้า GitHub Actions เปิดขึ้นมา ให้รอจน deployment ผ่านและเป็นสีเขียว

URL:

`https://github.com/apichetroymalalifeos/life-os-university/actions`

ภาพตัวอย่าง:

`[ใส่ภาพหน้าจอ: GitHub Actions สถานะสีเขียว]`

### Step 4: เปิด Life OS บน iPhone

เปิด Life OS จากไอคอนบน Home Screen ระบบ PWA จะตรวจเวอร์ชันใหม่ ถ้ามีเวอร์ชันใหม่จะแสดง:

`มีเวอร์ชันใหม่ของ Life OS พร้อมใช้งาน`

กด:

`อัปเดตตอนนี้`

ภาพตัวอย่าง:

`[ใส่ภาพหน้าจอ: แบนเนอร์อัปเดตบน iPhone]`

## ไฟล์สำคัญ

- `Publish Life OS.lnk` ใช้ดับเบิลคลิกเพื่อ publish แบบครบขั้นตอน
- `publish-and-update.bat` อัปเดตเวอร์ชัน commit push และเปิด GitHub Actions
- `publish-life-os.bat` publish แบบถาม commit message
- `check-life-os.bat` ตรวจสถานะ Git และ GitHub Pages
- `update-version.bat` อัปเดต build number ใน `version.json`
- `publish-life-os.ps1` แกนกลางของระบบ publish

## ถ้า Git ยังไม่ได้ตั้งค่า

ให้ดับเบิลคลิก:

`check-life-os.bat`

ถ้ายังไม่ได้ตั้งค่า Repository ระบบจะแสดงข้อความภาษาไทยว่า:

`Repository not configured`

ไฟล์ `check-life-os.bat` ใช้ตรวจอย่างเดียวและจะไม่แก้ repository ให้เอง

ถ้าต้องการให้ระบบตั้งค่าให้อัตโนมัติ ให้ดับเบิลคลิก:

`Publish Life OS`

ระบบจะพยายามตั้งค่า Git repository, branch `main`, และ remote `origin` ให้เองก่อน publish

## ความปลอดภัยก่อน Push

ก่อน commit และ push ระบบจะตรวจว่ามีไฟล์หลักครบ:

- `index.html`
- `version.json`
- `manifest.webmanifest`

ถ้าไฟล์ใดหาย ระบบจะหยุดทันทีและไม่ push เพื่อป้องกัน GitHub Pages deploy เวอร์ชันเสีย

## หมายเหตุสำหรับ iPhone

ถ้าเปิด Life OS บน iPhone แล้วยังเห็นเวอร์ชันเก่า หลังจากกดอัปเดตแล้ว ให้ปิดแอป Life OS จาก App Switcher แล้วเปิดใหม่อีกครั้ง

ถ้ายังไม่หาย ให้ลบไอคอนออกจาก Home Screen แล้ว Add to Home Screen ใหม่

## ลิงก์กู้เวอร์ชันสำหรับ iPhone

ถ้า iPhone ยังติดเวอร์ชันเก่าหลัง deploy แล้ว ให้เปิดลิงก์นี้ใน Safari:

`https://apichetroymalalifeos.github.io/life-os-university/fresh.html`

หน้านี้จะล้าง PWA cache และ service worker เก่า แล้วเปิด Life OS เวอร์ชันล่าสุดให้อัตโนมัติ โดยไม่ลบ progress ใน `localStorage`

ถ้าเปิดลิงก์นี้แล้วเจอ `404 File not found` แปลว่าไฟล์ `fresh.html` ยังไม่ได้ถูก publish ขึ้น GitHub Pages ให้ดับเบิลคลิก:

`fix-github-pages-publish.bat`

หรือ:

`Publish Life OS`

แล้วรอ GitHub Actions เป็นสีเขียวก่อนเปิดลิงก์อีกครั้ง
