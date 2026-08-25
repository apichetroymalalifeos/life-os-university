// Life OS 2.1 UI layer.
// It renders engine output into a static local page. No backend, no paid API,
// and no cloud dependency are required.
(function () {
  const Storage = window.LifeOSStorage;
  const Engine = window.LifeOSEngine;
  const Sleep = window.LifeOSSleep;
  const roadmaps = window.LIFE_OS_ROADMAPS;
  let state = Storage.load();
  let pwaStatusMessage = "";
  const APP_VERSION = "8.6.0";
  const LIFE_OS_CACHE_PREFIX = "life-os-university-pwa-";
  let pendingServiceWorker = null;
  let updateVersionInfo = null;

  const $ = selector => document.querySelector(selector);
  const I18N = {
    en: {
      brandSubtitle: "Local Executive Operating System",
      languageTitle: "Language",
      localPreference: "Local preference",
      languageLabel: "Dashboard language",
      recoveryStatus: "Recovery Status",
      thisMorning: "This morning",
      recoveryHelp: "Workout engine uses sleep to choose strength, moderate work, or recovery movement.",
      totalSleepHours: "Total sleep hours",
      deepSleep: "Deep sleep %",
      remSleep: "REM %",
      wakeCount: "Wake count",
      workoutOverride: "Workout override",
      autoRecovery: "Auto from recovery",
      forceStrength: "Force strength",
      forceModerate: "Force moderate",
      forceRecovery: "Force recovery walk",
      backup: "Backup",
      freeLocalJson: "Free local JSON",
      exportJson: "Export JSON",
      importJson: "Import JSON",
      heroTitle: "What matters today is already decided.",
      heroSubtitle: "One local screen for health, learning, sales execution, investing education, training, and family.",
      generateToday: "Generate Today",
      currentMission: "Current Mission",
      nextMission: "Next Mission",
      todaysProgress: "Today's Progress",
      week: "Week",
      streak: "Streak",
      best: "Best",
      roadmapCompletion: "Roadmap Completion",
      todaysSalesFocusPrefix: "Today's life focus:",
      missionTimeline: "Mission Timeline",
      autoHighlighted: "Auto-highlighted by current time",
      now: "NOW",
      next30: "NEXT 30 MINUTES",
      dailyChecklist: "Daily Checklist",
      completionAdvances: "Completion advances streaks",
      morningBrief: "Morning Brief",
      nightReview: "Night Review",
      closeLoop: "Close the loop",
      logSleep: "Log sleep",
      highRecovery: "High recovery",
      mediumRecovery: "Medium recovery",
      poorRecovery: "Poor recovery",
      highOverride: "High override",
      mediumOverride: "Medium override",
      poorOverride: "Poor override",
      nextBlockIn: "Next block in",
      day: "Day",
      completed: "completed",
      complete: "Complete",
      completedButton: "Completed",
      skip: "Skip",
      skipped: "Skipped",
      refreshLesson: "Refresh Today's Lesson",
      what: "What",
      soWhat: "So What",
      nowWhat: "Now What",
      customer: "Customer",
      painPoint: "Pain Point",
      hook: "Hook",
      closingObjective: "Closing Objective",
      meetingNotes: "Meeting Notes",
      task: "Task",
      after1600: "After 16:00",
      todaysMission: "Today's mission",
      briefEmpty: "Morning Brief will summarize today's missions after you click the button.",
      importComplete: "Import complete.",
      importFailed: "Import failed: paste valid Life OS JSON.",
      nightPlaceholder: "What worked? What should be protected tomorrow?",
      nightDefault: "Closed the day. Review sleep, family presence, sales notes, and learning tomorrow.",
      loadingCurrentMission: "Loading current mission",
      generateToDefineSales: "Generate today to define the objective.",
      aiLesson: "Today's AI Lesson",
      cryptoLesson: "Today's Crypto Lesson",
      longevityLesson: "Today's Longevity Lesson",
      salesFocus: "Today's Sales Focus",
      university: "Life OS University",
      currentFaculty: "Current Faculty",
      lessonReference: "Lesson Reference",
      lifeOsRemembers: "Life OS remembers. ChatGPT teaches.",
      teachMe: "Teach Me",
      copyPrompt: "Generate Teach Me Prompt",
      promptReady: "Prompt ready. Paste this into ChatGPT.",
      facultyProgress: "Faculty Progress",
      weakAreas: "Weak Areas",
      strongAreas: "Strong Areas",
      quizScore: "Quiz Score",
      memoryOnly: "Memory only. No lesson content is stored as progress.",
      workout: "Today's Workout",
      premiumLeatherAE: "Premium leather AE",
      family: "Family",
      backupPlaceholder: "Export appears here. Paste backup JSON here to import.",
      settings: "Settings",
      freeLocalOnly: "Free, local only",
      localProgress: "Local Progress",
      localProgressNote: "Progress is stored locally on this device. Future sync can be added later.",
      notifications: "Notifications",
      notificationHttpsNote: "Browser notifications work reliably only on HTTPS or localhost. GitHub Pages supports HTTPS for free.",
      enableReminderPermission: "Enable reminder permission",
      morningReminder: "Morning reminder",
      eveningReviewReminder: "Evening review",
      windDownReminder: "Wind down",
      notificationUnsupported: "This browser does not support notifications.",
      notificationRequiresHttps: "Notifications need HTTPS or localhost. Use GitHub Pages for free HTTPS mobile install.",
      notificationGranted: "Reminder permission enabled for this device.",
      notificationDenied: "Reminder permission was blocked. You can change it in browser settings.",
      notificationDefault: "Reminder permission has not been enabled yet.",
      pwaReady: "PWA ready. After first visit, the app shell can load offline.",
      pwaFileMode: "PWA install/offline cache works from GitHub Pages or localhost, not direct file opening.",
      pwaRegistering: "Preparing PWA offline cache.",
      pwaUnsupported: "Service workers are not supported in this browser.",
      openChatGPT: "Open ChatGPT",
      promptCopied: "Prompt copied. Open ChatGPT and paste to start today's lesson.",
      promptCopyFailed: "Prompt copied. Open ChatGPT and paste to start today's lesson. If paste is empty, copy the selected prompt manually.",
      todayGenerated: "Today generated. Faculty, lesson, available time, and next action are ready.",
      availableTime: "Available time",
      nextAction: "Next action",
      navNow: "Now",
      navLearn: "Learn",
      navWorkout: "Workout",
      navFamily: "Family",
      todayStatus: "Today Status",
      startUniversityToday: "Start Today's University",
      driveLesson: "Drive Lesson",
      timeQuestion: "How many minutes do you have today?",
      totalLearningTime: "Total learning time",
      focusStatus: "Focus",
      reviewStatus: "Review",
      optionalStatus: "Optional",
      completedStatus: "Completed",
      skippedStatus: "Skipped",
      facultyId: "Faculty ID",
      roadmapDataError: "Roadmap data is missing. Please check faculty metadata.",
      drivePromptCopied: "คัดลอก Prompt แล้ว เปิด ChatGPT แล้ววางเพื่อเริ่มบทเรียนเสียงวันนี้",
      completeAllToday: "Complete All Today",
      updates: "Updates",
      checkUpdates: "ตรวจสอบอัปเดต",
      updateAvailableTitle: "มีเวอร์ชันใหม่ของ Life OS พร้อมใช้งาน",
      updateNow: "อัปเดตตอนนี้",
      updateLater: "ภายหลัง",
      latestVersion: "คุณใช้เวอร์ชันล่าสุดแล้ว",
      checkingUpdates: "กำลังตรวจสอบอัปเดต...",
      updateReady: "มีเวอร์ชันใหม่พร้อมใช้งาน",
      updateFailed: "ตรวจสอบอัปเดตไม่สำเร็จ กรุณาลองใหม่อีกครั้ง",
      iphoneUpdateHelp: "ถ้าใช้ iPhone และยังเห็นเวอร์ชันเก่า หลังจากกดอัปเดตแล้ว ให้ปิดแอป Life OS จาก App Switcher แล้วเปิดใหม่อีกครั้ง ถ้ายังไม่หาย ให้ลบไอคอนออกจาก Home Screen แล้ว Add to Home Screen ใหม่",
      clearingUpdateCache: "กำลังอัปเดตและโหลดเวอร์ชันล่าสุด...",
      forceFreshReload: "ล้างแคชและโหลดใหม่",
      forceFreshHint: "ใช้ปุ่มนี้เมื่อ iPhone ยังเปิดเวอร์ชันเก่าหลัง publish แล้ว"
    },
    th: {
      brandSubtitle: "ระบบปฏิบัติการชีวิตแบบ Local",
      languageTitle: "ภาษา",
      localPreference: "บันทึกในเครื่องนี้",
      languageLabel: "ภาษาของแดชบอร์ด",
      recoveryStatus: "สถานะการฟื้นตัว",
      thisMorning: "เช้านี้",
      recoveryHelp: "ระบบออกกำลังกายใช้ข้อมูลการนอนเพื่อเลือกระดับฝึก: strength, moderate หรือ recovery movement",
      totalSleepHours: "ชั่วโมงนอนรวม",
      deepSleep: "Deep sleep %",
      remSleep: "REM %",
      wakeCount: "จำนวนครั้งที่ตื่น",
      workoutOverride: "เลือก workout เอง",
      autoRecovery: "อัตโนมัติตาม recovery",
      forceStrength: "บังคับ Strength",
      forceModerate: "บังคับ Moderate",
      forceRecovery: "บังคับ Recovery walk",
      backup: "สำรองข้อมูล",
      freeLocalJson: "JSON ฟรีในเครื่อง",
      exportJson: "Export JSON",
      importJson: "Import JSON",
      heroTitle: "สิ่งสำคัญของวันนี้ถูกตัดสินใจไว้แล้ว",
      heroSubtitle: "หน้าจอเดียวสำหรับสุขภาพ การเรียนรู้ งานขาย การลงทุน การฝึก และครอบครัว",
      generateToday: "Generate Today",
      currentMission: "ภารกิจตอนนี้",
      nextMission: "ภารกิจถัดไป",
      todaysProgress: "ความคืบหน้าวันนี้",
      week: "สัปดาห์",
      streak: "Streak",
      best: "ดีที่สุด",
      roadmapCompletion: "ความคืบหน้า Roadmap",
      todaysSalesFocusPrefix: "โฟกัสชีวิตวันนี้:",
      missionTimeline: "ไทม์ไลน์ภารกิจ",
      autoHighlighted: "ไฮไลต์ตามเวลาปัจจุบัน",
      now: "ตอนนี้",
      next30: "30 นาทีถัดไป",
      dailyChecklist: "เช็กลิสต์ประจำวัน",
      completionAdvances: "ทำครบแล้ว streak จะเพิ่ม",
      morningBrief: "สรุปเช้า",
      nightReview: "ทบทวนก่อนนอน",
      closeLoop: "ปิดวันให้เรียบร้อย",
      logSleep: "กรอกข้อมูลการนอน",
      highRecovery: "ฟื้นตัวดี",
      mediumRecovery: "ฟื้นตัวปานกลาง",
      poorRecovery: "ฟื้นตัวต่ำ",
      highOverride: "บังคับระดับสูง",
      mediumOverride: "บังคับระดับกลาง",
      poorOverride: "บังคับ recovery",
      nextBlockIn: "ช่วงถัดไปใน",
      day: "วันที่",
      completed: "ทำแล้ว",
      complete: "เสร็จแล้ว",
      completedButton: "เสร็จแล้ว",
      skip: "ข้าม",
      skipped: "ข้ามแล้ว",
      refreshLesson: "เปลี่ยนบทเรียนวันนี้",
      what: "คืออะไร",
      soWhat: "สำคัญอย่างไร",
      nowWhat: "ทำอะไรตอนนี้",
      customer: "ลูกค้า",
      painPoint: "ปัญหาหลัก",
      hook: "ประเด็นเปิดการขาย",
      closingObjective: "เป้าหมายการปิด",
      meetingNotes: "บันทึกการพบลูกค้า",
      task: "งานที่ต้องทำ",
      after1600: "หลัง 16:00",
      todaysMission: "ภารกิจวันนี้",
      briefEmpty: "กดสรุปเช้าเพื่อให้ระบบสรุปภารกิจสำคัญของวันนี้",
      importComplete: "Import สำเร็จ",
      importFailed: "Import ไม่สำเร็จ: กรุณาวาง JSON ของ Life OS ที่ถูกต้อง",
      nightPlaceholder: "วันนี้อะไรเวิร์ก? พรุ่งนี้ควรปกป้องอะไรไว้?",
      nightDefault: "ปิดวันเรียบร้อยแล้ว พรุ่งนี้ให้ดูเรื่องการนอน ครอบครัว โน้ตงานขาย และบทเรียนต่อ",
      loadingCurrentMission: "กำลังโหลดภารกิจ",
      generateToDefineSales: "กด Generate Today เพื่อกำหนดเป้าหมาย",
      aiLesson: "บทเรียน AI วันนี้",
      cryptoLesson: "บทเรียน Crypto วันนี้",
      longevityLesson: "บทเรียน Longevity วันนี้",
      salesFocus: "โฟกัสงานขายวันนี้",
      university: "Life OS University",
      currentFaculty: "คณะวันนี้",
      lessonReference: "รหัสบทเรียน",
      lifeOsRemembers: "Life OS ทำหน้าที่จำ ส่วน ChatGPT ทำหน้าที่สอน",
      teachMe: "สอนฉัน",
      copyPrompt: "สร้าง Prompt สำหรับ ChatGPT",
      promptReady: "Prompt พร้อมแล้ว ให้นำไปวางใน ChatGPT",
      facultyProgress: "ความคืบหน้าแต่ละคณะ",
      weakAreas: "จุดอ่อน",
      strongAreas: "จุดแข็ง",
      quizScore: "คะแนน Quiz",
      memoryOnly: "เก็บเฉพาะ memory/progress ไม่เก็บเนื้อหาบทเรียนเป็นประวัติ",
      workout: "Workout วันนี้",
      premiumLeatherAE: "AE หนังแท้/หนังสังเคราะห์ระดับพรีเมียม",
      family: "ครอบครัว",
      backupPlaceholder: "Export จะแสดงที่นี่ หรือวาง JSON backup เพื่อ Import",
      settings: "ตั้งค่า",
      freeLocalOnly: "ฟรี และเก็บในเครื่อง",
      localProgress: "ความคืบหน้าในเครื่อง",
      localProgressNote: "Progress is stored locally on this device. Future sync can be added later.",
      notifications: "การแจ้งเตือน",
      notificationHttpsNote: "Browser notifications ใช้งานได้ดีที่สุดบน HTTPS หรือ localhost. GitHub Pages มี HTTPS ฟรี",
      enableReminderPermission: "เปิดสิทธิ์แจ้งเตือน",
      morningReminder: "เตือนตอนเช้า",
      eveningReviewReminder: "ทบทวนตอนเย็น",
      windDownReminder: "เตรียมเข้านอน",
      notificationUnsupported: "เบราว์เซอร์นี้ไม่รองรับ notification",
      notificationRequiresHttps: "Notification ต้องใช้ HTTPS หรือ localhost. ใช้ GitHub Pages เพื่อ HTTPS ฟรีบนมือถือ",
      notificationGranted: "เปิดสิทธิ์แจ้งเตือนสำหรับเครื่องนี้แล้ว",
      notificationDenied: "สิทธิ์แจ้งเตือนถูกบล็อก สามารถเปลี่ยนได้ใน browser settings",
      notificationDefault: "ยังไม่ได้เปิดสิทธิ์แจ้งเตือน",
      pwaReady: "PWA พร้อมแล้ว หลังเข้าใช้งานครั้งแรก app shell จะเปิดแบบ offline ได้",
      pwaFileMode: "PWA install/offline cache ใช้ได้บน GitHub Pages หรือ localhost ไม่ใช่การเปิดไฟล์โดยตรง",
      pwaRegistering: "กำลังเตรียม offline cache สำหรับ PWA",
      pwaUnsupported: "เบราว์เซอร์นี้ไม่รองรับ service worker",
      openChatGPT: "เปิด ChatGPT",
      promptCopied: "คัดลอก Prompt แล้ว เปิด ChatGPT แล้ววางเพื่อเริ่มบทเรียนวันนี้",
      promptCopyFailed: "คัดลอก Prompt แล้ว เปิด ChatGPT แล้ววางเพื่อเริ่มบทเรียนวันนี้ หากวางแล้วว่าง ให้คัดลอกจากกล่อง Prompt ด้วยตนเอง",
      todayGenerated: "สร้างแผนวันนี้แล้ว: คณะ บทเรียน เวลาที่ใช้ และ next action พร้อมแล้ว",
      availableTime: "เวลาที่ใช้",
      nextAction: "สิ่งที่ต้องทำต่อ",
      navNow: "ตอนนี้",
      navLearn: "เรียน",
      navWorkout: "ฝึก",
      navFamily: "ครอบครัว",
      todayStatus: "สถานะวันนี้",
      startUniversityToday: "เริ่มมหาวิทยาลัยวันนี้",
      driveLesson: "Drive Lesson",
      timeQuestion: "วันนี้คุณมีเวลากี่นาที?",
      totalLearningTime: "เวลาเรียนรวม",
      focusStatus: "Focus",
      reviewStatus: "Review",
      optionalStatus: "Optional",
      completedStatus: "Completed",
      skippedStatus: "Skipped",
      facultyId: "Faculty ID",
      roadmapDataError: "ข้อมูล Roadmap ของคณะนี้ไม่ครบ กรุณาตรวจไฟล์ metadata",
      drivePromptCopied: "คัดลอก Prompt แล้ว เปิด ChatGPT แล้ววางเพื่อเริ่มบทเรียนเสียงวันนี้",
      completeAllToday: "Complete All Today",
      updates: "อัปเดต",
      checkUpdates: "ตรวจสอบอัปเดต",
      updateAvailableTitle: "มีเวอร์ชันใหม่ของ Life OS พร้อมใช้งาน",
      updateNow: "อัปเดตตอนนี้",
      updateLater: "ภายหลัง",
      latestVersion: "คุณใช้เวอร์ชันล่าสุดแล้ว",
      checkingUpdates: "กำลังตรวจสอบอัปเดต...",
      updateReady: "มีเวอร์ชันใหม่พร้อมใช้งาน",
      updateFailed: "ตรวจสอบอัปเดตไม่สำเร็จ กรุณาลองใหม่อีกครั้ง",
      iphoneUpdateHelp: "ถ้าใช้ iPhone และยังเห็นเวอร์ชันเก่า หลังจากกดอัปเดตแล้ว ให้ปิดแอป Life OS จาก App Switcher แล้วเปิดใหม่อีกครั้ง ถ้ายังไม่หาย ให้ลบไอคอนออกจาก Home Screen แล้ว Add to Home Screen ใหม่",
      clearingUpdateCache: "กำลังอัปเดตและโหลดเวอร์ชันล่าสุด...",
      forceFreshReload: "ล้างแคชและโหลดใหม่",
      forceFreshHint: "ใช้ปุ่มนี้เมื่อ iPhone ยังเปิดเวอร์ชันเก่าหลัง publish แล้ว"
    }
  };

  const BLOCK_I18N = {
    th: {
      wake: ["ตื่น + ดื่มน้ำ", "ตื่น ดื่มน้ำ และรับแสงถ้ามี", "เริ่มวันเบา ๆ เพื่อรักษา sleep consistency"],
      mobility: ["Mobility 10 นาที", "ยืดเหยียดเบา ๆ 10 นาที", "ขยับข้อ หายใจนิ่ง ไม่เร่ง"],
      leavePrep: ["เตรียมออกจากบ้าน", "เตรียมออกไปส่งลูกที่โรงเรียน", "กุญแจ กระเป๋า เส้นทาง และใจเย็น"],
      schoolDropoff: ["ส่งลูกไปโรงเรียน", "ส่งลูกชายไปโรงเรียน — ขับรถปลอดภัย ไม่ต้องเรียน ไม่ต้องดูจอ", "Driving block: ห้ามอ่าน ห้ามพิมพ์ ห้ามดูกราฟ"],
      postDriveReset: ["Reset หลังขับรถ", "Reset หลังขับรถ: หายใจ 2 นาที + ดื่มน้ำ", "เปลี่ยนจากโหมดขับรถเข้าสู่เช้าวันทำงาน"],
      university: ["AI & Automation สั้น", "เรียน AI แบบฟังได้ 20–25 นาที และทำ action เดียว", "Short mode: ไม่ต้องดูจอ ไม่ต้องอ่านข้อความยาว"],
      personalPrep: ["อาบน้ำ แต่งตัว", "อาบน้ำ แต่งตัว และเตรียมงาน", "เตรียมตัวแบบไม่รีบ"],
      commute: ["เดินทาง / เข้าโหมดงาน", "เดินทางหรือเปลี่ยนเข้าสู่ work mode อย่างปลอดภัย", "ถ้าขับรถ ใช้ audio-safe เท่านั้น"],
      ai: ["เรียน AI", "ทำบทเรียน AI แบบ short mode", "โฟกัส 20–25 นาทีเพื่อเพิ่มทักษะ AI"],
      workPrep: ["เตรียมงาน", "เตรียมเส้นทาง ตัวอย่างสินค้า และเป้าหมายลูกค้ารายแรก", "เปลี่ยนจากโหมดเรียนรู้เข้าสู่โหมดลงสนาม"],
      work: ["เริ่มงาน", "วางแผนเส้นทางและผลลัพธ์ที่ต้องการจากลูกค้า", "ทบทวนบัญชีลูกค้า ตัวอย่างสินค้า และ follow-up"],
      breathing: ["หายใจก่อนพบลูกค้า", "สงบใจ 2 นาทีก่อนเข้าพบลูกค้ารายแรก", "ลดความเครียดก่อนงานพบลูกค้า"],
      visits: ["Field Sales Driving", "พบลูกค้าและเก็บ pain point ระหว่างขับรถใช้ audio-safe เท่านั้น", "ห้ามอ่าน ห้ามพิมพ์ ห้ามดู chart ระหว่างขับรถ"],
      meal: ["มื้อแรก", "เปิด eating window ด้วยมื้อที่สะอาด", "โปรตีน ไฟเบอร์ คาร์บดี และน้ำ"],
      walk: ["เดินคุมกลูโคส", "เดิน 10-15 นาที", "ช่วยเรื่องน้ำตาล ความเครียด และการย่อย"],
      visits2: ["Field Sales Driving", "ปิดรอบ visit และกำหนด next step ระหว่างขับรถใช้ audio-safe เท่านั้น", "ลูกค้ารายที่สองและสาม บันทึกหลังจอดรถ"],
      familyPickup: ["รับลูก / เดินทาง", "รับลูกชายและเดินทางอย่างปลอดภัย", "Family first; ไม่ดูจอระหว่างขับรถ"],
      workout: ["Recovery Movement", "ขยับเบา ๆ หลังจอดรถและมีพลังพอ", "เดินสั้น ๆ mobility หรือหายใจก่อนมื้อเย็น"],
      learning: ["Learning Block", "เรียนต่อจากคณะวันนี้ถ้ายังมีพลัง", "หมุนเวียน 6 คณะ: AI, crypto, longevity, sales, psychology, future"],
      crypto: ["เรียน Crypto", "ศึกษาโดยไม่เทรดตามอารมณ์", "15-30 นาทีสำหรับการศึกษาการลงทุน"],
      dinner: ["มื้อเย็น", "กินมื้อเย็นและปิด eating window", "อยู่กับครอบครัว งดกินต่อหลัง 19:00"],
      family: ["ภารกิจครอบครัว", "ใช้เวลาคุณภาพร่วมกัน", "อยู่ตรงนั้นจริง ๆ และลดการใช้มือถือ"],
      reflection: ["Reflection / Learning", "ทบทวน notes, quiz score และ preview พรุ่งนี้", "Life OS เก็บ memory ส่วน ChatGPT อธิบาย"],
      longevity: ["เรียน Longevity", "เรียนหลัก recovery หนึ่งเรื่อง", "การนอน ตับ ความเครียด และอายุยืน"],
      night: ["Wind-down", "ทบทวนวันและปกป้องการนอน", "แสงน้อย เตรียมพรุ่งนี้ งดกระตุ้นหนัก"],
      sleep: ["นอน", "นอน นี่คือ block ฟื้นตัวหลัก", "ปกป้อง recovery สุขภาพตับ ฮอร์โมน และ longevity"]
    }
  };

  const CUSTOMER_I18N = {
    th: {
      "Hospitality project buyer": {
        name: "ลูกค้าโครงการ Hospitality",
        painPoint: "ต้องการลุคหนังที่ทนกับการใช้งานหนักโดยไม่ต้องซ่อมบำรุงบ่อย",
        hook: "เริ่มด้วย lifecycle cost: วัสดุพรีเมียมช่วยลดความกังวลเรื่องการเปลี่ยนใหม่",
        closingObjective: "ให้ลูกค้าอนุมัติตัวอย่างและยืนยันปริมาณ rollout"
      },
      "Interior designer / architect": {
        name: "Interior designer / architect",
        painPoint: "ต้องมั่นใจว่าสี ผิวสัมผัส และการส่งมอบตรงกับ design intent",
        hook: "นำเสนอ swatch เป็นการตัดสินใจเชิง specification ไม่ใช่สินค้า commodity",
        closingObjective: "ให้วัสดุถูกใส่ใน spec หรือ shortlist"
      },
      "Marine refit account": {
        name: "ลูกค้า Marine refit",
        painPoint: "กังวลเรื่องความชื้น การทำความสะอาด UV และรูปลักษณ์ระยะยาว",
        hook: "อธิบาย tradeoff หนังแท้/หนังสังเคราะห์ตามสภาพแวดล้อมและการดูแล",
        closingObjective: "นัด technical sample review กับ decision maker"
      },
      "Aviation upholstery lead": {
        name: "ลูกค้า Aviation upholstery",
        painPoint: "ต้องการ cabin feel พรีเมียม พร้อมความมั่นใจด้านเอกสารและการส่งมอบ",
        hook: "ขายความมั่นใจ traceability และคุณภาพผิวก่อนคุยราคา",
        closingObjective: "ยืนยันเกณฑ์การตัดสินใจและเอกสารที่ต้องส่งต่อ"
      }
    }
  };

  function saveAndRender() {
    Storage.save(state);
    renderAll();
  }

  function lang() {
    return state.settings.language || "en";
  }

  function t(key) {
    return I18N[lang()]?.[key] || I18N.en[key] || key;
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll("\"", "&quot;")
      .replaceAll("'", "&#039;");
  }

  function applyStaticTranslations() {
    document.documentElement.lang = lang();
    document.querySelectorAll("[data-i18n]").forEach(node => {
      node.textContent = t(node.dataset.i18n);
    });
    $("#languageSelect").value = lang();
    $("#backupBox").placeholder = t("backupPlaceholder");
    $("#nightReviewText").placeholder = t("nightPlaceholder");
  }

  function setStatus(selector, message, tone = "") {
    const node = $(selector);
    if (!node) return;
    node.textContent = message || "";
    node.className = tone ? `small-muted ${tone}` : "small-muted";
  }

  function localBlock(block) {
    const translated = BLOCK_I18N[lang()]?.[block.id];
    if (!translated) return block;
    return { ...block, title: translated[0], mission: translated[1], detail: translated[2] };
  }

  function localCustomer(customer) {
    return CUSTOMER_I18N[lang()]?.[customer.name] || customer;
  }

  function recoveryLabel(recovery) {
    if (recovery.score === null) return t("logSleep");
    if (recovery.label === "High recovery") return t("highRecovery");
    if (recovery.label === "Medium recovery") return t("mediumRecovery");
    if (recovery.label === "Poor recovery") return t("poorRecovery");
    if (recovery.label === "High override") return t("highOverride");
    if (recovery.label === "Medium override") return t("mediumOverride");
    if (recovery.label === "Poor override") return t("poorOverride");
    return recovery.label;
  }

  function localWorkout(workout) {
    if (lang() !== "th") return workout;
    const byType = {
      "Strength": {
        type: "Strength",
        reason: "Recovery ดีพอสำหรับ strength แบบคุมแรง",
        task: "Upper body push-pull, core เบา ๆ และหยุดก่อนหมดแรง"
      },
      "Zone2 + Mobility": {
        type: "Zone2 + Mobility",
        reason: "Recovery ใช้งานได้ แต่ควรรักษาความหนักระดับกลาง",
        task: "เดินเร็วหรือ bike เบา ๆ ตามด้วย mobility สะโพกและหลังส่วนบน"
      },
      "Recovery Walk": {
        type: "Recovery Walk",
        reason: "กฎ poor sleep: งดฝึกหนัก ปกป้องการฟื้นตัวของตับและความเครียด",
        task: "เดินเบา ๆ หายใจทางจมูก และยืดเหยียดเบา ๆ เท่านั้น"
      },
      "Moderate Workout": {
        type: "Moderate Workout",
        reason: "กรอกข้อมูลการนอนเพื่อปรับความหนัก ค่าเริ่มต้นใช้แบบ conservative",
        task: "เดิน mobility หรือ bodyweight เบา ๆ"
      }
    };
    return { ...workout, ...(byType[workout.type] || {}) };
  }

  function localFamilyMission() {
    const mission = Engine.dayState(state).familyMission || {};
    if (lang() !== "th") return mission;
    return {
      title: "ส่งลูกชายไปโรงเรียน + รับลูกชายตอนเย็น",
      goal: "เช้า: ส่งลูกชายไปโรงเรียนอย่างปลอดภัย · เย็น: รับลูกชายและใช้เวลาคุณภาพ 15–20 นาที",
      task: "ระหว่างขับรถไม่เรียน ไม่ดูจอ ไม่พิมพ์ หลังจอดแล้วค่อยจัดการงานหรือบทเรียน"
    };
  }

  function facultyLabel(faculty) {
    const id = Engine.normalizeFacultyId?.(faculty) || faculty;
    return Engine.FACULTY_LABELS[id] || faculty;
  }

  function facultyIcon(faculty) {
    const id = Engine.normalizeFacultyId?.(faculty) || faculty;
    return Engine.FACULTY_ICONS[id] || "📚";
  }

  function statusLabel(status) {
    return {
      focus: t("focusStatus"),
      review: t("reviewStatus"),
      optional: t("optionalStatus"),
      completed: t("completedStatus"),
      skipped: t("skippedStatus")
    }[status] || status;
  }

  function formatDate(now) {
    return new Intl.DateTimeFormat(lang() === "th" ? "th-TH" : "en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric"
    }).format(now);
  }

  function renderTime() {
    const now = new Date();
    $("#dateText").textContent = formatDate(now);
    const time = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    }).format(now);
    $("#timeText").textContent = time;
    if ($("#mobileTime")) $("#mobileTime").textContent = time;
  }

  function renderTopCommand() {
    const today = Engine.ensureToday(state, roadmaps);
    const current = localBlock(Engine.getCurrentBlock(new Date(), state));
    const next = localBlock(Engine.getNextBlock(new Date(), state));
    const recovery = Engine.recoveryStatus(state);
    const daily = Engine.dailyScore(state);
    const weekly = Engine.weeklyScore(state);
    const mode = Engine.modeForDate?.(state) || "production";

    $("#greetingText").textContent = greetingForHour(new Date().getHours());
    $("#recoveryLabel").textContent = recoveryLabel(recovery);
    $("#recoveryLabel").className = `status-dot ${recovery.level}`;
    $("#sleepScore").textContent = recovery.score === null ? "--" : recovery.score.toFixed(1);
    $("#sleepScoreSmall").textContent = recovery.score === null ? "" : "/10";
    $("#currentMission").textContent = current.mission;
    $("#nextMission").textContent = `${next.start} ${next.title}`;
    $("#progressToday").textContent = `${daily.percent}%`;
    if ($("#dayModeBadge")) $("#dayModeBadge").textContent = Engine.modeLabel?.(mode) || mode;
    $("#progressRing").style.setProperty("--progress", `${daily.percent * 3.6}deg`);
    $("#dailyScore").textContent = `${daily.complete}/${daily.total}`;
    $("#weeklyScore").textContent = `${weekly.percent}%`;
    $("#currentStreak").textContent = state.streaks.current;
    $("#longestStreak").textContent = state.streaks.longest;
    $("#completionPct").textContent = `${Engine.completionPercent(state)}%`;
    const brief = Engine.buildExecutiveBrief(state, roadmaps);
    $("#todayFocus").textContent = brief.todayWin?.title || current.mission || t("generateToDefineSales");
    if ($("#mobileStatus")) $("#mobileStatus").textContent = `${Engine.modeLabel?.(mode) || t("todayStatus")} · ${daily.percent}%`;
  }

  function renderBrowserCommandCenter() {
    if (!$("#browserCommandSection")) return;
    document.body.classList.toggle("mobile-details-open", Boolean(state.settings.mobileDetailsOpen));
    const today = Engine.ensureToday(state, roadmaps);
    const current = localBlock(Engine.getCurrentBlock(new Date(), state));
    const daily = Engine.dailyScore(state);
    const brief = Engine.buildExecutiveBrief(state, roadmaps);
    const prime = brief.primeMission || {};
    const todayWin = brief.todayWin || {};
    const memory = brief.yesterdayMemory || {};
    const momentum = brief.momentum || {};
    const reality = Engine.realityCheckFor?.(state) || { energy: "normal", salesLoad: "normal", learningMinutes: 25 };
    const topThree = (brief.priorities || []).slice(0, 3);
    const overload = (brief.antiOverload || []).slice(0, 2);
    const day = Engine.dayState(state);
    const started = Boolean(day.autopilotStarted);
    const mainWhy = todayWin.why || prime.why || topThree[0]?.why || current.detail || "This is the highest-leverage next action for today.";
    const cost = prime.cost || "ถ้าไม่ปิด win เดียววันนี้ งานสำคัญจะเลื่อนไปสะสมวันถัดไป";
    const doNot = buildDoNotDoToday(current, brief);
    const overloadText = overload.map(item => item.action).join(" / ");

    const titleNode = $("#browserCommandTitle");
    const detailNode = $("#browserCommandDetail");
    const metricsNode = $("#browserCommandMetrics");
    const topThreeNode = $("#browserTopThree");
    const actions = $("#browserCommandActions");
    const disciplineRail = $("#disciplineRail");

    titleNode.textContent = todayWin.completedAt ? "วันนี้ชนะแล้ว" : started ? "Today Win" : "ภารกิจเดียววันนี้";
    detailNode.textContent = started
      ? (day.autopilotStatus || brief.morningHook || `วันนี้ห้าม: ${doNot.join(" / ") || "ไม่เปิดรายละเอียดก่อนเริ่ม"}${overloadText ? ` · Guardrail: ${overloadText}` : ""}`)
      : `${todayWin.title || prime.title || current.mission} · กดเริ่มเมื่อพร้อม แล้วระบบค่อยเปิดเครื่องมือที่จำเป็น`;
    if (disciplineRail) {
      disciplineRail.innerHTML = renderDisciplineRail();
    }

    if (!started) {
      metricsNode.innerHTML = "";
      if (topThreeNode) topThreeNode.innerHTML = "";
      if (actions) {
        actions.innerHTML = `<button class="primary-btn one-button" data-browser-action="start" type="button">เริ่มวันนี้</button>`;
      }
      return;
    }

    metricsNode.innerHTML = [
      ["วันนี้ชนะถ้า", todayWin.title || prime.title || current.mission],
      ["WHY", mainWhy],
      ["COST IF NOT DONE", cost],
      ["FIRST ACTION", todayWin.firstAction || prime.firstAction || "ทำ action แรก"],
      ["MEMORY", `${memory.summary || "ยังไม่มี memory จากเมื่อวาน"} · ${momentum.message || ""}`]
    ].map(([label, value]) => `
      <div class="autopilot-line">
        <span>${escapeHtml(label)}</span>
        <b>${escapeHtml(value)}</b>
      </div>
    `).join("");
    if (topThreeNode) {
      topThreeNode.innerHTML = renderRealityCheck(reality, brief) + renderDailyCloseLoop(day);
    }
    if (actions) {
      actions.innerHTML = `
        <button class="primary-btn" data-browser-action="daily-win" type="button" ${todayWin.completedAt ? "disabled" : ""}>${todayWin.completedAt ? "ชนะวันนี้แล้ว ✓" : "ชนะวันนี้แล้ว"}</button>
        <button class="soft-btn" data-browser-action="teach" type="button">สอนฉัน</button>
        <button class="soft-btn" data-browser-action="drive" type="button">บทเรียนขับรถ</button>
        <button class="${todayWin.completedAt ? "primary-btn" : "ghost-btn"}" data-browser-action="close-loop" type="button">ปิดวัน 20 วิ</button>
        <button class="ghost-btn" data-browser-action="details" id="mobileDetailsToggle" type="button">${state.settings.mobileDetailsOpen ? "ซ่อนรายละเอียด" : "ดูบทเรียน/งานวันนี้"}</button>
      `;
    }
  }

  function renderDisciplineRail() {
    const now = new Date();
    const current = Engine.getCurrentBlock(now, state);
    const blocks = Engine.scheduleForDate(state, now);
    const currentIndex = Math.max(0, blocks.findIndex(block => block.id === current.id));
    const visibleBlocks = blocks.map((block, index) => {
      const display = localBlock(block);
      const isActive = block.id === current.id;
      const isPast = !isActive && currentIndex > -1 && index < currentIndex;
      const isDriving = ["schoolDropoff", "commute", "visits", "visits2", "familyPickup"].includes(block.id);
      const label = isActive ? "ตอนนี้" : isPast ? "ผ่านแล้ว" : "ถัดไป";
      return `
        <article class="discipline-slot ${isActive ? "active" : ""} ${isPast ? "past" : ""}">
          <time>${escapeHtml(block.start)}–${escapeHtml(block.end)}</time>
          <div>
            <strong>${escapeHtml(display.title)}</strong>
            <span>${escapeHtml(display.mission)}</span>
          </div>
          <em>${isDriving ? "ขับรถปลอดภัย" : label}</em>
        </article>
      `;
    }).join("");
    return `
      <div class="discipline-rail-head">
        <span>รางวินัยรายชั่วโมง</span>
        <small>เปิดดูเวลานี้แล้วทำตามช่องปัจจุบัน ไม่ปล่อยช่องว่างให้เรื่องไร้สาระ</small>
      </div>
      <div class="discipline-slot-list">${visibleBlocks}</div>
    `;
  }

  function renderRealityCheck(reality, brief) {
    const revenue = brief.revenueRadar?.[0];
    const optionButton = (group, value, label, current) => `
      <button class="${String(current) === String(value) ? "active" : ""}" data-reality="${group}:${value}" type="button">${label}</button>
    `;
    return `
      <div class="reality-check">
        <span>Reality Check · แตะปรับ 5 วินาที</span>
        <div class="reality-row">
          <b>พลัง</b>
          ${optionButton("energy", "low", "ต่ำ", reality.energy)}
          ${optionButton("energy", "normal", "ปกติ", reality.energy)}
          ${optionButton("energy", "good", "ดี", reality.energy)}
        </div>
        <div class="reality-row">
          <b>งานขาย</b>
          ${optionButton("salesLoad", "light", "เบา", reality.salesLoad)}
          ${optionButton("salesLoad", "normal", "ปกติ", reality.salesLoad)}
          ${optionButton("salesLoad", "heavy", "หนัก", reality.salesLoad)}
        </div>
        <div class="reality-row">
          <b>เรียน</b>
          ${optionButton("learningMinutes", 15, "15", reality.learningMinutes)}
          ${optionButton("learningMinutes", 25, "25", reality.learningMinutes)}
          ${optionButton("learningMinutes", 45, "45", reality.learningMinutes)}
        </div>
        ${revenue ? `<small>Revenue Radar: ${escapeHtml(revenue.name)} · ${escapeHtml(revenue.urgency)} · ${escapeHtml(revenue.nextAction)}</small>` : ""}
      </div>
    `;
  }

  function renderDailyCloseLoop(day) {
    if (!day.closeLoopOpen) return "";
    const close = day.closeLoop || {};
    return `
      <form class="daily-close-loop" id="dailyCloseLoopForm">
        <span>Evening Close · 20 วินาที</span>
        <label>วันนี้ชนะอะไร?<input name="win" type="text" value="${escapeHtml(close.win || day.dailyWin?.title || "")}" placeholder="ชนะอะไรวันนี้"></label>
        <label>อะไรค้าง?<input name="pending" type="text" value="${escapeHtml(close.pending || "")}" placeholder="สิ่งที่ต้อง carry over"></label>
        <label>พรุ่งนี้ต้องปกป้องอะไร?<input name="protect" type="text" value="${escapeHtml(close.protect || "")}" placeholder="เวลา/พลัง/ครอบครัว/งานขาย"></label>
        <button class="primary-btn" type="submit">บันทึกปิดวัน</button>
      </form>
    `;
  }

  function buildDoNotDoToday(current, brief) {
    const recovery = Engine.recoveryStatus(state);
    const mode = Engine.modeForDate?.(state) || "production";
    const drivingIds = ["schoolDropoff", "commute", "visits", "visits2", "familyPickup"];
    const warnings = [];
    if (drivingIds.includes(current.id)) {
      warnings.push("ไม่อ่าน ไม่พิมพ์ ไม่ดูกราฟระหว่างขับรถ");
    }
    if (recovery.level === "poor") {
      warnings.push("ไม่ฝึกหนัก ให้เดินเบา/ยืดเหยียดเท่านั้น");
    }
    if (mode === "production") {
      warnings.push("ไม่เปิดรายละเอียดลึกก่อนทำ Top 3");
    }
    if ((brief?.dataQuality?.missing || []).length) {
      warnings.push("ไม่ตัดสินใจจากข้อมูลที่ยังขาด");
    }
    return warnings.slice(0, 2);
  }

  function renderMobileAccordions() {
    state.settings.mobileAccordions ||= { learn: false, settings: false };
    const map = {
      learn: "#learnSection",
      settings: "#settingsSection"
    };
    Object.entries(map).forEach(([key, selector]) => {
      const node = $(selector);
      if (node) node.classList.toggle("accordion-open", Boolean(state.settings.mobileAccordions[key]));
    });
  }

  function greetingForHour(hour) {
    if (lang() === "th") {
      if (hour < 11) return "อรุณสวัสดิ์ วันนี้ระบบตัดสินใจให้แล้ว";
      if (hour < 17) return "สวัสดีตอนบ่าย ทำภารกิจถัดไปให้เรียบร้อย";
      return "สวัสดีตอนเย็น ฟื้นตัวและปิดวันให้ดี";
    }
    if (hour < 11) return "Good morning. The day is already decided.";
    if (hour < 17) return "Good afternoon. Execute the next mission.";
    return "Good evening. Recover and close the loop.";
  }

  function renderNowNext() {
    const current = localBlock(Engine.getCurrentBlock(new Date(), state));
    const nextThirty = localBlock(Engine.getNextThirty(new Date(), state));
    const next = localBlock(Engine.getNextBlock(new Date(), state));

    $("#nowTitle").textContent = current.title;
    $("#nowDetail").textContent = current.mission;
    $("#nowCountdown").textContent = `${t("nextBlockIn")} ${Engine.countdownToNext(new Date(), state)}`;

    if (nextThirty.id === current.id) {
      $("#nextTitle").textContent = `${next.start} ${next.title}`;
      $("#nextDetail").textContent = next.mission;
    } else {
      $("#nextTitle").textContent = `${nextThirty.start} ${nextThirty.title}`;
      $("#nextDetail").textContent = nextThirty.mission;
    }
  }

  function renderSchedule() {
    const current = Engine.getCurrentBlock(new Date(), state);
    const nextThirty = Engine.getNextThirty(new Date(), state);
    $("#scheduleList").innerHTML = Engine.scheduleForDate(state).map(block => {
      const active = block.id === current.id;
      const upcoming = block.id === nextThirty.id && !active;
      const display = localBlock(block);
      return `
        <div class="slot">
          <div class="slot-time">${block.start}</div>
          <article class="slot-card ${active ? "active" : ""} ${upcoming ? "upcoming" : ""}">
            <div>
              <h3>${display.title}</h3>
              <p>${display.detail}</p>
            </div>
            ${active ? `<span class="tag">${t("now")}</span>` : upcoming ? `<span class="tag">${t("nextMission")}</span>` : ""}
          </article>
        </div>
      `;
    }).join("");
  }

  function renderSleepForm() {
    const sleep = state.sleep;
    if ($("#sleepHours")) $("#sleepHours").value = sleep.hours ?? "";
    if ($("#deepSleep")) $("#deepSleep").value = sleep.deep ?? "";
    if ($("#remSleep")) $("#remSleep").value = sleep.rem ?? "";
    if ($("#wakeCount")) $("#wakeCount").value = sleep.wakes ?? "";
    $("#languageSelect").value = lang();
    $("#workoutOverride").value = state.settings.workoutOverride || "auto";
  }

  function renderLessons() {
    const today = Engine.ensureToday(state, roadmaps);
    renderUniversity(today);
    renderTeachMe(today);
    renderFaculties(today);
    renderSales(today);
    renderWorkout(today);
    renderFamily(today);
  }

  function renderUniversity(today) {
    const cards = Engine.facultyCardsForToday(state, roadmaps);
    const focus = cards.find(card => card.faculty === today.dailyFocus?.focus) || cards[0];
    const totalMinutes = cards.reduce((sum, card) => sum + Number(card.estimatedMinutes || 0), 0);
    $("#universityCard").innerHTML = `
      <div class="panel-title">${t("university")} <small>Focus first · details folded</small></div>
      <div class="module-body university-body">
        ${today.generateStatus ? `<div class="notice good">${today.generateStatus}</div>` : ""}
        <div class="today-learning-summary">
          <div>
            <span class="eyebrow">${lang() === "th" ? "วันนี้ต้องเรียน" : "Today's Faculty"}</span>
            <h3>${facultyIcon(focus?.faculty)} ${facultyLabel(focus?.faculty)} · ${focus?.lesson.title || ""}</h3>
            <p>${t("day")} ${focus?.day || "-"} · ${t("availableTime")}: ${focus?.estimatedMinutes || today.availableMinutes || 25} min</p>
            <p><b>${t("nextAction")}:</b> ${focus?.nextAction || ""}</p>
          </div>
          <label class="time-select">${t("timeQuestion")}
            <select id="learningTimeSelect">
              ${[15, 25, 30, 45, 60].map(minutes => `<option value="${minutes}" ${Number(today.availableMinutes || 25) === minutes ? "selected" : ""}>${minutes} นาที</option>`).join("")}
            </select>
          </label>
        </div>
        <div class="button-row three university-actions">
          <button class="primary-btn" id="teachMeBtn" type="button">🎓 ${t("startUniversityToday")}</button>
          <button class="soft-btn" id="driveLessonBtn" type="button">🎧 ${t("driveLesson")}</button>
          <a class="link-btn" href="https://chatgpt.com/" target="_blank" rel="noopener">${t("openChatGPT")}</a>
        </div>
        <details class="faculty-detail-drawer">
          <summary>ดูรายละเอียด 6 คณะ · ${totalMinutes} นาทีรวม</summary>
          <div class="faculty-card-grid">
            ${cards.map(card => {
              const done = Boolean(Engine.dayState(state).tasks[card.faculty]);
              const skipped = Boolean(Engine.dayState(state).skips[card.faculty]);
              return `
                <article class="faculty-card ${card.status}">
                  <div class="faculty-card-head">
                    <span class="faculty-icon">${card.icon}</span>
                    <div>
                      <h3>${card.name}</h3>
                      <p>${card.faculty}</p>
                    </div>
                    <span class="status-pill">${statusLabel(card.status)}</span>
                  </div>
                  ${card.error ? `<div class="notice warn">${card.error}</div>` : ""}
                  <div class="field-grid compact">
                    <div class="field"><span>${t("facultyId")}</span><p>${card.faculty}</p></div>
                    <div class="field"><span>Status</span><p>${statusLabel(card.status)}</p></div>
                    <div class="field"><span>${t("day")}</span><p>${card.day}</p></div>
                    <div class="field"><span>${t("availableTime")}</span><p>${card.estimatedMinutes} min</p></div>
                  </div>
                  <h3>${card.lesson.title}</h3>
                  <p>${card.lesson.learningGoal || ""}</p>
                  <div class="lesson-meta">
                    <span class="pill">${card.lesson.category || "Metadata"}</span>
                    ${(card.lesson.keywords || []).slice(0, 3).map(keyword => `<span class="pill">${keyword}</span>`).join("")}
                  </div>
                  <div class="field"><span>Source types</span><p>${(card.lesson.recommendedSourceTypes || []).join(", ") || t("roadmapDataError")}</p></div>
                  <div class="field"><span>${t("nextAction")}</span><p>${card.nextAction}</p></div>
                  <div class="lesson-actions">
                    <button class="${skipped ? "danger-btn" : "ghost-btn"}" data-skip="${card.faculty}" type="button">${skipped ? t("skipped") : t("skip")}</button>
                    <button class="primary-btn" data-complete="${card.faculty}" type="button">${done ? t("completedButton") : t("complete")}</button>
                  </div>
                </article>
              `;
            }).join("")}
          </div>
          <button class="ghost-btn" id="completeAllTodayBtn" type="button">${t("completeAllToday")}</button>
        </details>
      </div>
    `;
  }

  function renderTeachMe(today) {
    $("#teachMeCard").innerHTML = `
      <div class="panel-title">🎓 ${t("teachMe")} <small>${t("memoryOnly")}</small></div>
      <div class="module-body">
        <p>${t("promptReady")}</p>
        <textarea id="teachPromptBox" readonly>${today.teachPrompt || ""}</textarea>
        ${today.teachStatus ? `<div class="notice good">${today.teachStatus}</div>` : ""}
        <div class="button-row three">
          <button class="primary-btn" id="teachMePromptBtn" type="button">🎓 ${t("startUniversityToday")}</button>
          <button class="soft-btn" id="driveLessonPromptBtn" type="button">🎧 ${t("driveLesson")}</button>
          <a class="link-btn" href="https://chatgpt.com/" target="_blank" rel="noopener">${t("openChatGPT")}</a>
        </div>
      </div>
    `;
  }

  function renderFaculties() {
    $("#facultiesCard").innerHTML = `
      <div class="panel-title">${t("facultyProgress")} <small>6 faculties</small></div>
      <div class="module-body">
        <div class="field-grid">
          ${Engine.FACULTIES.map(faculty => {
            const progress = Engine.progressFor(state, faculty);
            const quiz = state.university.quizScores?.[faculty] ?? "-";
            return `<div class="field">
              <span>${facultyIcon(faculty)} ${facultyLabel(faculty)}</span>
              <p>${t("day")} ${progress.day} / 365 · ${progress.completed} ${t("completed")} · ${t("quizScore")} ${quiz}</p>
            </div>`;
          }).join("")}
        </div>
      </div>
    `;
  }

  function trackLabel(track) {
    return {
      ai: t("aiLesson"),
      crypto: t("cryptoLesson"),
      longevity: t("longevityLesson"),
      sales: t("salesFocus"),
      workout: t("workout")
    }[track] || track;
  }

  function renderSales(today) {
    state.executive ||= {};
    state.executive.salesPipeline ||= [];
    const customer = localCustomer(today.customer);
    const lesson = Engine.lessonForToday(state, roadmaps, "elite_b2b_sales");
    const isDone = Boolean(Engine.dayState(state).tasks.elite_b2b_sales || Engine.dayState(state).tasks.sales);
    const rankedCustomers = Engine.salesPipelineForExecutive?.(state, today) || [];
    const topCustomer = rankedCustomers[0] || {
      name: customer.name,
      status: "meeting today",
      priority: "high",
      preparationStatus: customer.closingObjective,
      followUpRequired: true
    };
    const editableCustomers = Array.from({ length: 3 }, (_, index) => {
      const item = state.executive?.salesPipeline?.[index] || {};
      return {
        name: item.name || "",
        status: item.status || "follow-up required",
        priority: item.priority || "medium",
        preparationStatus: item.preparationStatus || "",
        followUpRequired: Boolean(item.followUpRequired),
        ageHours: Number(item.ageHours || item.waitingHours || 0)
      };
    });
    $("#salesCard").innerHTML = `
      <div class="panel-title">${t("salesFocus")} <small>${t("premiumLeatherAE")}</small></div>
      <div class="module-body">
        <div class="sales-autopilot-card">
          <span class="eyebrow">Sales Autopilot</span>
          <h3>${escapeHtml(topCustomer.name)}</h3>
          <p>${escapeHtml(topCustomer.status)} · ${escapeHtml(topCustomer.priority || "medium")} priority</p>
          <b>WHY: ${escapeHtml(topCustomer.preparationStatus || customer.closingObjective || "เป็น next step ที่มี leverage สูงสุดวันนี้")}</b>
        </div>
        <h3>${lesson.title}</h3>
        <div class="field-grid">
          <div class="field"><span>${t("customer")}</span><b>${customer.name}</b></div>
          <div class="field"><span>${t("painPoint")}</span><p>${customer.painPoint}</p></div>
          <div class="field"><span>${t("hook")}</span><p>${customer.hook}</p></div>
          <div class="field"><span>${t("closingObjective")}</span><p>${customer.closingObjective}</p></div>
        </div>
        <details class="sales-mission-drawer">
          <summary>แก้ไขลูกค้า 3 รายวันนี้</summary>
          <form class="sales-mission-form" id="salesMissionForm">
            ${editableCustomers.map((item, index) => `
              <fieldset>
                <legend>Customer ${index + 1}</legend>
                <label>ชื่อ/บัญชีลูกค้า<input name="name-${index}" type="text" value="${escapeHtml(item.name)}" placeholder="ชื่อลูกค้า"></label>
                <label>Status
                  <select name="status-${index}">
                    ${["meeting today", "follow-up required", "waiting quotation", "waiting payment", "research"].map(value => `<option value="${value}" ${item.status === value ? "selected" : ""}>${value}</option>`).join("")}
                  </select>
                </label>
                <label>Priority
                  <select name="priority-${index}">
                    ${["high", "medium", "low"].map(value => `<option value="${value}" ${item.priority === value ? "selected" : ""}>${value}</option>`).join("")}
                  </select>
                </label>
                <label>Preparation / next step<input name="prep-${index}" type="text" value="${escapeHtml(item.preparationStatus)}" placeholder="sample, quotation, payment, follow-up"></label>
                <label>รอมาแล้วกี่ชั่วโมง<input name="age-${index}" type="number" min="0" max="999" value="${Number(item.ageHours || 0)}" placeholder="0"></label>
                <label class="checkbox-line"><input name="follow-${index}" type="checkbox" ${item.followUpRequired ? "checked" : ""}> ต้อง follow-up</label>
              </fieldset>
            `).join("")}
            <button class="soft-btn" type="submit">บันทึก Sales Mission</button>
          </form>
        </details>
        <label>${t("meetingNotes")}
          <textarea id="meetingNotes">${Engine.notesFor(state, "elite_b2b_sales").nowWhat || ""}</textarea>
        </label>
        <div class="button-row">
          <button class="ghost-btn" id="meetingNotesBtn" type="button">${t("meetingNotes")}</button>
          <button class="primary-btn" data-complete="elite_b2b_sales" data-complete-task="sales" type="button">${isDone ? t("completedButton") : t("complete")}</button>
        </div>
      </div>
    `;
  }

  function renderWorkout(today) {
    const isDone = Boolean(Engine.dayState(state).tasks.workout);
    const workout = localWorkout(today.workout);
    $("#workoutCard").innerHTML = `
      <div class="panel-title">${t("workout")} <small>${workout.duration}</small></div>
      <div class="module-body">
        <h3>${workout.type}</h3>
        <p>${workout.reason}</p>
        <div class="field"><span>${t("task")}</span><p>${workout.task}</p></div>
        <button class="primary-btn" data-complete="workout" type="button">${isDone ? t("completedButton") : t("complete")}</button>
      </div>
    `;
  }

  function renderFamily(today) {
    const isDone = Boolean(Engine.dayState(state).tasks.family);
    $("#familyCard").innerHTML = `
      <div class="panel-title">${t("family")} <small>Morning + ${t("after1600")}</small></div>
      <div class="module-body">
        <h3>${localFamilyMission().title}</h3>
        <p>${localFamilyMission().goal}</p>
        <div class="field-grid compact">
          <div class="field"><span>Morning</span><p>ส่งลูกชายไปโรงเรียน 06:00–06:45 · ขับรถปลอดภัย ไม่ต้องเรียน ไม่ต้องดูจอ</p></div>
          <div class="field"><span>Evening</span><p>รับลูกชาย / ใช้เวลาคุณภาพ 15–20 นาที</p></div>
        </div>
        <div class="field"><span>${t("todaysMission")}</span><p>${localFamilyMission().task}</p></div>
        <button class="primary-btn" data-complete="family" type="button">${isDone ? t("completedButton") : t("complete")}</button>
      </div>
    `;
  }

  function renderChecklist() {
    const today = Engine.dayState(state);
    const items = [
      { id: "health", tasks: ["morning", "workout"], label: lang() === "th" ? "Health mission เสร็จแล้ว" : "Health mission complete" },
      { id: "learning", tasks: ["university"], label: lang() === "th" ? "Learning mission เสร็จแล้ว" : "Learning mission complete" },
      { id: "sales", tasks: ["sales"], label: lang() === "th" ? "Sales mission เสร็จแล้ว" : "Sales mission complete" },
      { id: "family", tasks: ["family"], label: lang() === "th" ? "Family mission เสร็จแล้ว" : "Family mission complete" },
      { id: "review", tasks: ["night"], label: lang() === "th" ? "Review mission เสร็จแล้ว" : "Review mission complete" }
    ];

    $("#checklist").innerHTML = items.map(item => {
      const done = item.tasks.every(task => today.tasks[task]);
      return `
      <div class="check-row ${done ? "done" : ""}">
        <button type="button" aria-label="Toggle ${item.label}" data-toggle-mission="${item.id}">✓</button>
        <span>${item.label}</span>
      </div>
    `;
    }).join("");
  }

  function missionTasksFor(id) {
    return {
      health: ["morning", "workout"],
      learning: ["university"],
      sales: ["sales"],
      family: ["family"],
      review: ["night"]
    }[id] || [];
  }

  function toggleMission(id) {
    const taskIds = missionTasksFor(id);
    if (!taskIds.length) return;
    const today = Engine.dayState(state);
    const isDone = taskIds.every(task => today.tasks[task]);
    taskIds.forEach(task => {
      if (isDone) {
        delete today.tasks[task];
      } else if (!today.tasks[task]) {
        Engine.toggleTask(state, task);
      }
    });
    if (id === "learning" && !isDone) {
      const focus = Engine.ensureToday(state, roadmaps).dailyFocus?.focus;
      if (focus) today.tasks[focus] = true;
    }
    if (id === "sales" && !isDone) {
      today.tasks.elite_b2b_sales = true;
    }
  }

  function renderBriefReview() {
    const today = Engine.dayState(state);
    $("#briefOutput").textContent = localBrief(today.brief) || t("briefEmpty");
    $("#nightReviewText").value = today.review || "";
  }

  function renderWeeklyOperatingReview() {
    const form = $("#weeklyOperatingReviewForm");
    const output = $("#weeklyReviewOutput");
    const panel = $("#weeklyReviewPanel");
    if (!form || !output) return;
    const isSunday = new Date().getDay() === 0;
    if (panel) panel.classList.toggle("hidden", !isSunday);
    if (!isSunday) return;
    const id = Engine.weekId?.() || "current-week";
    const review = state.executive.weeklyOperatingReviews?.[id] || {};
    ["health", "sales", "ai", "family", "finance", "stop"].forEach(field => {
      const input = form.elements[field];
      if (input) input.value = review[field] || "";
    });
    output.textContent = review.savedAt
      ? `บันทึกแล้ว ${new Date(review.savedAt).toLocaleString("th-TH")} · Health / Sales / AI / Family / Finance / Stop`
      : "ยังไม่ได้บันทึก Weekly Operating Review สัปดาห์นี้";
  }

  function executiveMeta(item) {
    const confidence = item.confidence || "Medium";
    const data = (item.dataUsed || []).join(", ");
    return `
      <div class="explain-meta">
        <span>Confidence: ${escapeHtml(confidence)}</span>
        <span>Data Used: ${escapeHtml(data || "Local state")}</span>
      </div>
    `;
  }

  function explainMore(item) {
    return `
      <details class="explain-more">
        <summary>Explain More</summary>
        <p><b>WHY:</b> ${escapeHtml(item.why || "Rule-based local analysis.")}</p>
        ${executiveMeta(item)}
      </details>
    `;
  }

  function radarTone(level) {
    return { yellow: "warn-yellow", orange: "warn-orange", red: "warn-red" }[level] || "warn-yellow";
  }

  function formatMoney(value) {
    return new Intl.NumberFormat(lang() === "th" ? "th-TH" : "en-US", {
      maximumFractionDigits: 0
    }).format(Number(value || 0));
  }

  function renderExecutiveBrief() {
    const node = $("#executiveBrief");
    if (!node) return;
    const brief = Engine.buildExecutiveBrief(state, roadmaps);
    const { parts } = brief;
    const reflection = state.executive.reflections?.[Engine.dateKey()] || {};
    const decisions = brief.decisionMemory.latest || [];
    const scoreClass = brief.score >= 85 ? "good" : brief.score >= 70 ? "steady" : brief.score >= 55 ? "warn" : "risk";
    const mode = state.settings.executiveBriefMode || "detailed";
    const missingData = brief.explainability.missingData?.length ? brief.explainability.missingData.join(", ") : "None";
    const risks = brief.radar.slice(0, mode === "quick" ? 2 : 3);
    const nextAction = brief.priorities[0] || { title: "Generate Today", why: "No priority generated yet.", expectedImpact: "Clarify today.", estimatedTime: "2 min" };

    node.innerHTML = `
      <div class="brief-mode-bar">
        <div>
          <b>${mode === "quick" ? "Quick Mode · 30-second brief" : "3-Minute Executive Brief"}</b>
          <span>Life OS recommends. You decide.</span>
        </div>
        <button class="soft-btn" id="toggleExecutiveBriefModeBtn" type="button">${mode === "quick" ? "Show 3-Minute Brief" : "Quick Mode"}</button>
      </div>
      <div class="executive-grid ${mode === "quick" ? "quick" : "detailed"}">
        <article class="executive-card executive-score ${scoreClass}">
          <span>Today's Executive Score</span>
          <strong>${brief.score}</strong>
          <p>Confidence: ${escapeHtml(brief.confidence)} · Missing data: ${escapeHtml(missingData)}</p>
          <div class="mini-trend">
            <b>7D ${brief.trend.seven.average || brief.score}</b>
            <b>30D ${brief.trend.thirty.average || brief.score}</b>
            <b>90D ${brief.trend.ninety.average || brief.score}</b>
          </div>
          ${explainMore({ ...brief.explainability, why: "Score combines sleep, recovery, learning, tasks, workout, family, work, and reflection. Confidence is capped when key data is missing." })}
        </article>

        <article class="executive-card data-quality-card">
          <span>Data Quality</span>
          <div class="quality-grid">
            ${Object.entries(brief.dataQuality.items).map(([key, item]) => `<div class="quality-row ${item.status.toLowerCase()}"><b>${escapeHtml(item.label)}</b><span>${escapeHtml(item.status)}</span></div>`).join("")}
          </div>
          <p>Score confidence: ${escapeHtml(brief.confidence)}</p>
        </article>

        <article class="executive-card">
          <span>Sleep / Recovery Recommendation</span>
          <h3>${escapeHtml(parts.health.recommendation)}</h3>
          <p><b>Workout:</b> ${escapeHtml(parts.health.workout?.type || "")} · ${escapeHtml(parts.health.workout?.duration || "")}</p>
          ${explainMore(parts.health)}
        </article>

        <article class="executive-card">
          <span>Learning Plan Today</span>
          <h3>${escapeHtml(parts.learning.focusFacultyName)} · Day ${parts.learning.currentDay}</h3>
          <p>${escapeHtml(parts.learning.lessonTitle)}</p>
          <p><b>Review:</b> ${escapeHtml(parts.learning.reviewFacultyNames.join(" + "))}</p>
          ${explainMore(parts.learning)}
        </article>

        <article class="executive-card">
          <span>Work / Sales Priority</span>
          <h3>${escapeHtml(parts.sales.topCustomer.name)}</h3>
          <p><b>Status:</b> ${escapeHtml(parts.sales.topCustomer.status)} · ${escapeHtml(parts.sales.topCustomer.preparationStatus)}</p>
          <div class="compact-list">
            ${parts.sales.customers.slice(0, 3).map(customer => `<small>${escapeHtml(customer.name)} · ${escapeHtml(customer.status)}</small>`).join("")}
          </div>
          ${explainMore(parts.sales)}
        </article>

        <article class="executive-card">
          <span>Family Mission</span>
          <h3>${escapeHtml(parts.family.morningMission)}</h3>
          <p>${escapeHtml(parts.family.eveningMission)}</p>
          ${explainMore(parts.family)}
        </article>

        <article class="executive-card">
          <span>Finance Review Reminder</span>
          <h3>${escapeHtml(parts.finance.portfolioGoal)}</h3>
          <p>Risk level: ${escapeHtml(parts.finance.riskLevel)} · Review only</p>
          <p>${escapeHtml(parts.finance.recommendation)}</p>
          <p><b>Fact:</b> ${escapeHtml(parts.finance.fact)}</p>
          <p><b>Assumption:</b> ${escapeHtml(parts.finance.assumption)}</p>
          <p class="thai-warning">${escapeHtml(parts.finance.noteThai)}</p>
          ${explainMore(parts.finance)}
        </article>

        <article class="executive-card wide">
          <span>Today's Top 3 Priorities</span>
          <div class="priority-stack">
            ${brief.priorities.map((priority, index) => `
              <div class="priority-item">
                <b>${index + 1}. ${escapeHtml(priority.title)}</b>
                <small>Impact: ${escapeHtml(priority.expectedImpact)} · Time: ${escapeHtml(priority.estimatedTime)}</small>
                ${explainMore({ why: priority.why, confidence: "Medium", dataUsed: ["Executive Brief"] })}
              </div>
            `).join("")}
          </div>
        </article>

        <article class="executive-card">
          <span>Main Risks Today</span>
          <div class="radar-list">
            ${risks.map(item => `
              <div class="radar-item ${radarTone(item.level)}">
                <b>${escapeHtml(item.level.toUpperCase())} · ${escapeHtml(item.title)}</b>
                ${explainMore(item)}
              </div>
            `).join("") || "<p>No major warning detected.</p>"}
          </div>
        </article>

        <article class="executive-card ${mode === "quick" ? "quick-hidden" : ""}">
          <span>Opportunity Radar</span>
          <div class="radar-list">
            ${brief.opportunities.slice(0, 3).map(item => `
              <div class="opportunity-item">
                <b>${escapeHtml(item.title)}</b>
                <p>${escapeHtml(item.benefit)}</p>
                ${explainMore(item)}
              </div>
            `).join("")}
          </div>
        </article>

        <article class="executive-card">
          <span>Decision Review Reminder</span>
          ${brief.decisionMemory.dueReviews.length ? `
            <div class="radar-list">
              ${brief.decisionMemory.dueReviews.slice(0, 3).map(decision => `
                <div class="radar-item warn-orange">
                  <b>${escapeHtml(decision.title || "Decision review")}</b>
                  <p>Review date ${escapeHtml(decision.reviewDate)} is today or overdue.</p>
                  <small>Reason: ${escapeHtml(decision.reason || "-")}</small>
                </div>
              `).join("")}
            </div>
          ` : `<p>No decision review due today.</p>`}
        </article>

        <article class="executive-card next-action-card">
          <span>One Clear Next Action</span>
          <h3>${escapeHtml(nextAction.title)}</h3>
          <p>${escapeHtml(nextAction.expectedImpact)}</p>
          <small>${escapeHtml(nextAction.estimatedTime)}</small>
        </article>

        <article class="executive-card wide ${mode === "quick" ? "quick-hidden" : ""}">
          <span>Reflection Engine + Decision Memory</span>
          <div class="memory-grid">
            <form class="reflection-form" id="executiveReflectionForm">
              ${brief.reflectionQuestions.map((question, index) => {
                const key = ["wentWell", "improve", "learned"][index];
                return `<label>${escapeHtml(question)}<textarea name="${key}" rows="2">${escapeHtml(reflection[key] || "")}</textarea></label>`;
              }).join("")}
              <button class="soft-btn" type="submit">Save Evening Reflection</button>
            </form>
            <form class="decision-form" id="decisionMemoryForm">
              <label>Major decision<input name="title" type="text" placeholder="Example: customer follow-up priority"></label>
              <label>Reason<textarea name="reason" rows="2"></textarea></label>
              <label>Result<textarea name="result" rows="2"></textarea></label>
              <label>Review date<input name="reviewDate" type="date"></label>
              <button class="primary-btn" type="submit">Save Decision</button>
            </form>
          </div>
          <div class="decision-memory-list">
            <p>${escapeHtml(brief.decisionMemory.similarDecisionNote)}</p>
            ${decisions.map(decision => `<small>${escapeHtml(decision.date)} · ${escapeHtml(decision.title)} · review ${escapeHtml(decision.reviewDate || "later")}</small>`).join("")}
          </div>
        </article>
      </div>
    `;
  }

  function renderProgressDebug() {
    const node = $("#progressDebug");
    if (!node) return;
    const rows = Engine.FACULTIES.map(faculty => {
      const progress = Engine.progressFor(state, faculty);
      return `
        <div class="debug-row">
          <b>${faculty}</b>
          <span>currentDay: ${progress.currentDay || progress.day || 1}</span>
          <span>completedDays: ${(progress.completedDays || []).join(", ") || "-"}</span>
          <span>skippedDays: ${(progress.skippedDays || []).join(", ") || "-"}</span>
          <span>lastCompletedDate: ${progress.lastCompletedDate || "-"}</span>
          <span>streak: ${progress.streak || 0} / best ${progress.bestStreak || 0}</span>
        </div>
      `;
    }).join("");
    node.innerHTML = `<div class="debug-grid">${rows}</div>`;
  }

  function wheelOfLifeSvg(balance) {
    const size = 220;
    const center = size / 2;
    const maxRadius = 86;
    const points = balance.dimensions.map((dimension, index) => {
      const angle = (-90 + index * 60) * Math.PI / 180;
      const radius = maxRadius * (dimension.score / 100);
      return `${center + Math.cos(angle) * radius},${center + Math.sin(angle) * radius}`;
    }).join(" ");
    const axes = balance.dimensions.map((dimension, index) => {
      const angle = (-90 + index * 60) * Math.PI / 180;
      const x = center + Math.cos(angle) * maxRadius;
      const y = center + Math.sin(angle) * maxRadius;
      const lx = center + Math.cos(angle) * (maxRadius + 18);
      const ly = center + Math.sin(angle) * (maxRadius + 18);
      return `<line x1="${center}" y1="${center}" x2="${x}" y2="${y}" /><text x="${lx}" y="${ly}" text-anchor="middle">${dimension.score}</text>`;
    }).join("");
    return `
      <figure class="wheel-wrap">
        <svg viewBox="0 0 ${size} ${size}" role="img" aria-label="Wheel of Life scores: ${balance.dimensions.map(item => `${item.label} ${item.score}`).join(", ")}">
          <circle cx="${center}" cy="${center}" r="${maxRadius}" />
          <circle cx="${center}" cy="${center}" r="${Math.round(maxRadius * .66)}" />
          <circle cx="${center}" cy="${center}" r="${Math.round(maxRadius * .33)}" />
          ${axes}
          <polygon points="${points}" />
        </svg>
        <figcaption>Wheel of Life: ${balance.dimensions.map(item => `${item.label} ${item.score}`).join(" · ")}</figcaption>
      </figure>
    `;
  }

  function renderWeekendDashboard() {
    const node = $("#weekendDashboard");
    if (!node) return;
    const data = Engine.weekendDashboard(state, roadmaps);
    const mode = data.mode;
    const isSaturdaySchedule = data.schedule.some(block => block.id === "satFutsal");
    const isSundaySchedule = data.schedule.some(block => block.id === "sunCeoReview");
    const isWeekend = isSaturdaySchedule || isSundaySchedule;
    $("#weekendSection")?.classList.toggle("hidden", !isWeekend);
    if (!isWeekend) {
      node.innerHTML = "";
      return;
    }
    const blocks = data.schedule.filter(block => isSaturdaySchedule
      ? ["satZone2", "satFutsal", "satLearning", "satCrypto", "satFamilyActivity", "satLongevity", "satWindDown"].includes(block.id)
      : ["sunCeoReview", "sunFamilyBlock", "sunFuture", "sunFutsalFun", "sunPrepareWeek", "sunLightWorkout", "sunLearningReview"].includes(block.id)
    );
    const review = data.ceoReview || {};
    node.innerHTML = `
      <div class="weekend-mode-head">
        <div>
          <span class="eyebrow">${isWeekend ? "Weekend Mode" : "Weekday Mode"}</span>
          <h3>${escapeHtml(data.modeLabel)}</h3>
          <p>${isWeekend ? "Weekends optimize growth, family, recovery, and preparation without sacrificing sleep." : "Weekday production mode remains unchanged."}</p>
        </div>
        <label>Manual override today
          <select id="dayModeOverrideSelect">
            ${[
              ["auto", "Auto"],
              ["workday", "ใช้โหมดวันทำงาน"],
              ["saturday", "ใช้โหมดวันเสาร์"],
              ["sunday", "ใช้โหมดวันอาทิตย์"],
              ["custom", "ปรับตารางเองวันนี้"]
            ].map(([value, label]) => `<option value="${value}" ${(Engine.dayState(state).modeOverride || "auto") === value ? "selected" : ""}>${label}</option>`).join("")}
          </select>
        </label>
      </div>
      <div class="weekend-grid">
        <article class="weekend-card">
          <span>Recovery status</span>
          <h3>${escapeHtml(data.recovery.label)}</h3>
          <p>Confidence: ${escapeHtml(data.recovery.confidence || "Medium")} · Low recovery never schedules hard training.</p>
        </article>
        <article class="weekend-card protected-family">
          <span>Weekend Family Mission</span>
          <h3>${isSundaySchedule ? "Sunday family + preparation" : "Saturday futsal + family"}</h3>
          <textarea id="weekendFamilyMissionInput">${escapeHtml(data.familyMission)}</textarea>
          <button class="soft-btn" id="saveWeekendFamilyMissionBtn" type="button">Save Family Mission</button>
        </article>
        <article class="weekend-card">
          <span>Exercise recommendation</span>
          <h3>${escapeHtml(data.exercise.type)} · ${escapeHtml(data.exercise.duration)}</h3>
          <p>${escapeHtml(data.exercise.reason)}</p>
        </article>
        <article class="weekend-card">
          <span>${isSundaySchedule ? "Sunday CEO Review" : "Futsal activity with son"}</span>
          <h3>${isSundaySchedule ? "Recover, reconnect, review life" : "เน้นคุณภาพ ความสนุก และพื้นฐาน"}</h3>
          <p>${isSundaySchedule ? "Review health, sleep, work, pipeline, finance, learning, son, wife/family, recovery." : "Warm-up, ball mastery, passing, first touch, shooting, small game, cool-down."}</p>
        </article>
        <article class="weekend-card">
          <span>Main learning lesson</span>
          <h3>${facultyIcon(data.focus.faculty)} ${facultyLabel(data.focus.faculty)} · Day ${data.focus.lesson.day}</h3>
          <p>${escapeHtml(data.focus.lesson.title)}</p>
        </article>
        <article class="weekend-card">
          <span>Secondary learning block</span>
          <h3>${facultyIcon(data.secondary.faculty)} ${facultyLabel(data.secondary.faculty)}</h3>
          <p>${escapeHtml(data.secondary.lesson.title)}</p>
        </article>
        <article class="weekend-card wide">
          <span>Weekend activity controls</span>
          <div class="weekend-activity-list">
            ${blocks.map(block => `
              <div class="weekend-activity">
                <b>${block.start} ${escapeHtml(block.title)}</b>
                <p>${escapeHtml(block.mission)}</p>
                <div class="button-row three">
                  <button class="primary-btn" data-weekend-action="done" data-block-id="${block.id}" type="button">เสร็จแล้ว</button>
                  <button class="ghost-btn" data-weekend-action="delayed" data-block-id="${block.id}" type="button">เลื่อนไปภายหลัง</button>
                  <button class="ghost-btn" data-weekend-action="skipped" data-block-id="${block.id}" type="button">ข้ามวันนี้</button>
                </div>
                <div class="button-row">
                  <button class="soft-btn" data-weekend-action="change" data-block-id="${block.id}" type="button">เปลี่ยนกิจกรรม</button>
                  <button class="soft-btn" data-weekend-action="time" data-block-id="${block.id}" type="button">ปรับเวลา</button>
                  <button class="soft-btn" data-weekend-action="default" data-block-id="${block.id}" type="button">ใช้เป็นค่าเริ่มต้นทุกสัปดาห์</button>
                </div>
              </div>
            `).join("")}
          </div>
        </article>
        <article class="weekend-card wide">
          <span>Life Balance Score</span>
          <div class="life-balance-head">
            <strong>${data.balance.score}</strong>
            <div>
              <p>${escapeHtml(data.balance.warning)}</p>
              <small>Data quality: ${escapeHtml(data.balance.dataQuality)} · Confidence: ${escapeHtml(data.balance.confidence)} · 4-week trend: ${data.balance.trend.join(" → ") || "new"}</small>
            </div>
          </div>
          ${wheelOfLifeSvg(data.balance)}
          <div class="balance-detail-grid">
            ${data.balance.dimensions.map(item => `
              <details class="balance-detail">
                <summary>${escapeHtml(item.label)} · ${item.score} · ${escapeHtml(item.quality)}</summary>
                <p>${escapeHtml(item.reason)}</p>
                <p><b>Adjustment:</b> ${escapeHtml(item.adjustment)}</p>
              </details>
            `).join("")}
          </div>
        </article>
        <article class="weekend-card wide ${isSundaySchedule ? "" : "soft-hidden"}">
          <span>Sunday CEO Review Storage</span>
          <form id="sundayCeoReviewForm" class="ceo-review-form">
            ${["highlights", "problems", "health", "family", "work", "finance", "learning", "recovery", "top3", "stop", "continue", "improve"].map(field => `
              <label>${field}<textarea name="${field}" rows="2">${escapeHtml(review[field] || "")}</textarea></label>
            `).join("")}
            <button class="primary-btn" type="submit">Save Sunday CEO Review</button>
          </form>
        </article>
        <article class="weekend-card wide">
          <span>Weekend notification note</span>
          <p>Saturday reminders: morning movement, futsal with son, protected family block, wind-down. Sunday reminders: CEO Review, protected family block, prepare next week, wind-down. Browser/iPhone PWA background notifications are limited and not guaranteed.</p>
        </article>
      </div>
    `;
  }

  function renderMobileQaChecklist() {
    const node = $("#mobileQaChecklist");
    if (!node) return;
    state.executive.mobileQa ||= {};
    const items = [
      ["iphone_safari", "iPhone Safari"],
      ["iphone_pwa", "iPhone PWA Home Screen"],
      ["github_pages", "GitHub Pages"],
      ["offline_mode", "Offline mode"],
      ["auto_update", "Auto Update"],
      ["generate_today", "Generate Today"],
      ["drive_lesson", "Drive Lesson"],
      ["complete_button", "Complete button"],
      ["morning_executive_brief", "Morning Executive Brief"]
    ];
    node.innerHTML = `
      <div class="qa-check-grid">
        ${items.map(([key, label]) => `
          <label class="qa-check-row ${state.executive.mobileQa[key] ? "done" : ""}">
            <input type="checkbox" data-mobile-qa="${key}" ${state.executive.mobileQa[key] ? "checked" : ""}>
            <span>${label}</span>
          </label>
        `).join("")}
      </div>
      <p class="small-muted">เช็กบนมือถือจริงหลัง publish ทุกครั้ง โดยเฉพาะ PWA cache และปุ่ม Complete</p>
    `;
  }

  function renderWeekendSettings() {
    const node = $("#weekendSettings");
    if (!node) return;
    const settings = state.weekend?.settings || {};
    node.innerHTML = `
      <form class="weekend-settings-form" id="weekendSettingsForm">
        <label>Saturday wake time<input name="saturdayWakeTime" type="time" value="${escapeHtml(settings.saturdayWakeTime || "05:30")}"></label>
        <label>Sunday wake time<input name="sundayWakeTime" type="time" value="${escapeHtml(settings.sundayWakeTime || "06:00")}"></label>
        <label>Saturday futsal time<input name="saturdayFutsalTime" type="time" value="${escapeHtml(settings.saturdayFutsalTime || "09:00")}"></label>
        <label>Sunday family activity time<input name="sundayFamilyActivityTime" type="time" value="${escapeHtml(settings.sundayFamilyActivityTime || "09:00")}"></label>
        <label>Shopping mall / family block<input name="familyActivityDefault" type="text" value="${escapeHtml(settings.familyActivityDefault || "Shopping mall / cafe / park / family errands")}"></label>
        <label>Weekend learning duration<input name="weekendLearningMinutes" type="number" min="10" max="90" step="5" value="${Number(settings.weekendLearningMinutes || 45)}"></label>
        <label>Exercise preference
          <select name="exercisePreference">
            ${[
              ["walk_zone2", "Zone 2 / walk"],
              ["mobility", "Mobility"],
              ["easy_strength", "Easy strength"],
              ["family_walk", "Family walk"]
            ].map(([value, label]) => `<option value="${value}" ${settings.exercisePreference === value ? "selected" : ""}>${label}</option>`).join("")}
          </select>
        </label>
        <label>IF window<input name="ifWindow" type="text" value="${escapeHtml(settings.ifWindow || "12:00-19:00")}"></label>
        <label>Default weekend mode
          <select name="defaultWeekendMode">
            ${[
              ["auto", "Auto"],
              ["saturday", "Always Saturday mode"],
              ["sunday", "Always Sunday mode"]
            ].map(([value, label]) => `<option value="${value}" ${settings.defaultWeekendMode === value ? "selected" : ""}>${label}</option>`).join("")}
          </select>
        </label>
        <label>Manual recovery input
          <select name="manualRecovery">
            ${[
              ["auto", "Auto"],
              ["high", "High"],
              ["medium", "Medium"],
              ["low", "Low"]
            ].map(([value, label]) => `<option value="${value}" ${settings.manualRecovery === value ? "selected" : ""}>${label}</option>`).join("")}
          </select>
        </label>
        <div class="button-row">
          <button class="primary-btn" type="submit">Save Weekend Settings</button>
          <button class="ghost-btn" id="resetWeekendDefaultsBtn" type="button">คืนค่าตารางสุดสัปดาห์เริ่มต้น</button>
        </div>
      </form>
      <p class="small-muted">ค่าพวกนี้ไม่รีเซ็ต progress, streak, decision memory หรือ sleep logs</p>
    `;
  }

  function exportLocalStorageBackup() {
    const backup = {};
    for (let index = 0; index < localStorage.length; index++) {
      const key = localStorage.key(index);
      backup[key] = localStorage.getItem(key);
    }
    $("#backupBox").value = JSON.stringify({
      exportedAt: new Date().toISOString(),
      appVersion: APP_VERSION,
      localStorage: backup
    }, null, 2);
    setStatus("#settingsActionStatus", "Export backup พร้อมแล้วในกล่อง Backup ด้านซ้าย", "good");
  }

  function resetDemoDataOnly() {
    state.executive.finance = {
      portfolioGoal: "10 Million Goal",
      targetAmount: 10000000,
      monthlyDcaTarget: 10000,
      monthlyDcaProgress: 0,
      riskLevel: "medium"
    };
    state.executive.salesPipeline = [
      { name: "Hospitality project buyer", status: "meeting today", priority: "high", preparationStatus: "sample kit ready", followUpRequired: true },
      { name: "Interior designer / architect", status: "waiting quotation", priority: "high", preparationStatus: "spec notes ready", followUpRequired: true },
      { name: "Marine refit account", status: "follow-up required", priority: "medium", preparationStatus: "technical notes pending", followUpRequired: true },
      { name: "Aviation upholstery lead", status: "waiting payment", priority: "medium", preparationStatus: "documents ready", followUpRequired: false }
    ];
    state.executive.mobileQa = {};
    state.settings.executiveBriefMode = "detailed";
    saveAndRender();
    setStatus("#settingsActionStatus", "รีเซ็ต demo data แล้ว โดยไม่ลบ progress, sleep logs, notes หรือ decisions", "good");
  }

  function sleepLogs() {
    state.sleepLogs ||= Sleep.clone(Sleep.SAMPLE_LOGS);
    return Sleep.sortedLogs(state.sleepLogs);
  }

  function sleepMetric(label, value, note = "") {
    return `<div class="sleep-metric"><span>${label}</span><b>${value}</b>${note ? `<small>${note}</small>` : ""}</div>`;
  }

  function sleepBar(label, value, max = 100) {
    const pct = Math.max(0, Math.min(100, Math.round((Number(value) / max) * 100)));
    return `
      <div class="sleep-bar">
        <div><span>${label}</span><b>${value}${max === 100 ? "%" : ""}</b></div>
        <i style="--bar:${pct}%"></i>
      </div>
    `;
  }

  function renderSleepOptimization() {
    const logs = sleepLogs();
    const latest = Sleep.latestLog(logs);
    const analysis = Sleep.analyzeDaily(latest, logs);
    const node = $("#sleepOptimization");
    if (!node) return;
    if (!analysis) {
      node.innerHTML = `<div class="notice warn">ยังไม่มีข้อมูลการนอน</div>`;
      return;
    }
    const log = analysis.log;
    const recovery = Sleep.recoveryScore(logs);

    node.innerHTML = `
      ${analysis.holidayNote ? `<div class="notice warn">${analysis.holidayNote}</div>` : ""}
      <div class="sleep-card-grid sleep-summary-grid">
        <article class="sleep-card score-card">
          <span>Sleep Score</span>
          <strong>${log.sleep_score}</strong>
          <p>${log.date} · ${Sleep.formatMinutes(log.total_sleep_minutes)} · Deep ${log.deep_sleep_percent}% · REM ${log.rem_sleep_percent}%</p>
        </article>
        <article class="sleep-card good">
          <span>Recovery</span>
          <strong>${recovery.score}</strong>
          <p>${recovery.status} · ${analysis.strengths[0] || "ดูแนวโน้มต่อเนื่อง"}</p>
        </article>
        <article class="sleep-card">
          <span>Today Fix</span>
          <b>${analysis.todayFix}</b>
          <p>${analysis.primaryWeakness} · เป้าหมายคืนนี้ ${log.target_bedtime}–${log.target_wake_time}</p>
        </article>
      </div>
    `;
  }

  function renderSleepIntelligence() {
    const logs = sleepLogs();
    const node = $("#sleepIntelligence");
    if (!node) return;
    const trends = [7, 30, 90].map(days => Sleep.trend(logs, days));
    const debt7 = Sleep.sleepDebt(logs, 7);
    const debt30 = Sleep.sleepDebt(logs, 30);
    const habit = Sleep.habitImpact(logs);
    const recovery = Sleep.recoveryScore(logs);
    const streak = Sleep.sleepStreak(logs);
    const weekly = Sleep.weeklySummary(logs);

    node.innerHTML = `
      <div class="sleep-intel-grid">
        <article class="sleep-card wide">
          <span>Sleep Score Trend</span>
          <div class="trend-grid">
            ${trends.map(item => `
              <div class="trend-card">
                <b>${item.days} วัน</b>
                ${sleepMetric("Avg Score", item.averageSleepScore || "-")}
                ${sleepMetric("Avg Sleep", Sleep.formatMinutes(item.averageSleepMinutes))}
                ${sleepMetric("Deep", `${item.averageDeepPercent || 0}%`)}
                ${sleepMetric("REM", `${item.averageRemPercent || 0}%`)}
                ${sleepMetric("เข้านอนตรงเป้า", `${item.bedtimeOnTargetDays}/${item.count}`)}
                ${sleepMetric("นอนครบเป้า", `${item.sleepTargetDays}/${item.count}`)}
              </div>
            `).join("")}
          </div>
        </article>
        <article class="sleep-card">
          <span>Total Sleep Trend</span>
          ${trends.map(item => sleepBar(`${item.days} วัน`, item.averageSleepMinutes, 450)).join("")}
        </article>
        <article class="sleep-card">
          <span>REM Trend</span>
          ${trends.map(item => sleepBar(`${item.days} วัน`, item.averageRemPercent)).join("")}
        </article>
        <article class="sleep-card">
          <span>Deep Sleep Trend</span>
          ${trends.map(item => sleepBar(`${item.days} วัน`, item.averageDeepPercent)).join("")}
        </article>
        <article class="sleep-card warn">
          <span>Sleep Debt Tracker</span>
          <b>7 วัน: ${debt7.debt} นาที · ${debt7.status}</b>
          <p>30 วัน: ${debt30.debt} นาที · ${debt30.status}</p>
          <p>${debt7.advice}</p>
        </article>
        <article class="sleep-card">
          <span>Habit Impact Analyzer</span>
          ${habit.ready ? `
            <b>ช่วยที่สุด: ${habit.best.label} (${habit.best.scoreDelta.toFixed(1)} score)</b>
            <p>ทำร้ายที่สุด: ${habit.worst.label} (${habit.worst.scoreDelta.toFixed(1)} score)</p>
            <p>Insight rule-based: ลด habit ที่ทำให้ bedtime delay เพิ่ม และรักษา habit ที่เพิ่ม REM/Deep</p>
          ` : `<b>${habit.message}</b><p>ตอนนี้มี ${logs.length} วัน</p>`}
        </article>
        <article class="sleep-card good">
          <span>Recovery Score</span>
          <strong>${recovery.score}</strong>
          <p>${recovery.status}</p>
        </article>
        <article class="sleep-card">
          <span>Sleep Streak</span>
          <b>Current ${streak.current} · Best ${streak.best}</b>
          <p>สำเร็จ: ${streak.passedItems.join(", ") || "-"}</p>
          <p>หลุด: ${streak.missedItems.join(", ") || "-"}</p>
          <p>${streak.weeklyGoal}</p>
          <p>${streak.message}</p>
        </article>
        <article class="sleep-card wide">
          <span>Weekly Sleep Summary</span>
          <div class="field-grid compact">
            <div class="field"><span>Avg Sleep</span><p>${Sleep.formatMinutes(weekly.averageSleepMinutes)}</p></div>
            <div class="field"><span>Avg Score</span><p>${weekly.averageSleepScore || "-"}</p></div>
            <div class="field"><span>Deep / REM</span><p>${weekly.averageDeepPercent || 0}% / ${weekly.averageRemPercent || 0}%</p></div>
            <div class="field"><span>Workday / Holiday</span><p>${weekly.averageWorkdayScore || "-"} / ${weekly.averageHolidayScore || "-"}</p></div>
            <div class="field"><span>Workday bedtime</span><p>${weekly.workdayBedtimeOnTarget}</p></div>
            <div class="field"><span>Workday wake</span><p>${weekly.workdayWakeOnTarget}</p></div>
            <div class="field"><span>Workday sleep target</span><p>${weekly.workdaySleepTarget}</p></div>
            <div class="field"><span>Recurring weakness</span><p>${weekly.recurringWeakness}</p></div>
          </div>
          <p>${weekly.trend}</p>
        </article>
      </div>
    `;
  }

  function renderSleepLogForm() {
    const wrap = $("#sleepLogFormWrap");
    if (!wrap) return;
    const isOpen = state.settings.sleepFormOpen;
    if (!isOpen) {
      wrap.innerHTML = "";
      return;
    }
    const today = new Date().toISOString().slice(0, 10);
    const fields = [
      ["date", "วันที่", "date", today],
      ["sleep_score", "Sleep Score", "number", ""],
      ["bedtime", "Bedtime", "time", "22:00"],
      ["wake_time", "Wake Time", "time", "05:30"],
      ["total_sleep_minutes", "Total Sleep Minutes", "number", "450"],
      ["deep_sleep_minutes", "Deep Sleep Minutes", "number", ""],
      ["deep_sleep_percent", "Deep Sleep Percent", "number", ""],
      ["light_sleep_minutes", "Light Sleep Minutes", "number", ""],
      ["light_sleep_percent", "Light Sleep Percent", "number", ""],
      ["rem_sleep_minutes", "REM Sleep Minutes", "number", ""],
      ["rem_sleep_percent", "REM Sleep Percent", "number", ""],
      ["awake_count", "Awake Count", "number", "0"],
      ["sleep_continuity_score", "Sleep Continuity Score", "number", ""],
      ["breathing_quality_score", "Breathing Quality Score", "number", ""],
      ["heart_rate_range", "Heart Rate Range", "text", ""],
      ["spo2_range", "SpO2 Range", "text", ""],
      ["breathing_rate_range", "Breathing Rate Range", "text", ""]
    ];
    wrap.innerHTML = `
      <form class="manual-sleep-form" id="manualSleepLogForm">
        <label>ประเภทวัน
          <select name="day_type">
            <option value="workday">workday</option>
            <option value="weekend">weekend</option>
            <option value="holiday">holiday</option>
          </select>
        </label>
        ${fields.map(([name, label, type, value]) => `
          <label>${label}
            <input name="${name}" type="${type}" ${type === "number" ? "step=\"1\"" : ""} value="${value}">
          </label>
        `).join("")}
        <label class="wide">Notes
          <textarea name="notes" placeholder="บันทึกจากรูปแคปหรือสิ่งที่เกิดขึ้นก่อนนอน"></textarea>
        </label>
        <fieldset class="habit-checks">
          <legend>Habits checklist</legend>
          ${Sleep.HABITS.map(([key, label]) => `
            <label><input name="${key}" type="checkbox"> ${label}</label>
          `).join("")}
        </fieldset>
        <button class="primary-btn" type="submit">บันทึก Sleep Log</button>
        <p class="small-muted">ข้อมูลนี้ใช้ติดตามพฤติกรรมและแนวโน้ม ไม่ใช่คำแนะนำการรักษา หากมีอาการผิดปกติควรปรึกษาแพทย์</p>
      </form>
    `;
  }

  function localBrief(brief) {
    if (!brief || lang() !== "th") return brief;
    const today = Engine.ensureToday(state, roadmaps);
    const faculty = today.dailyFocus?.focus || today.currentFaculty || state.university.currentFaculty;
    const lesson = Engine.lessonForToday(state, roadmaps, faculty);
    const current = localBlock(Engine.getCurrentBlock(new Date(), state));
    const workout = localWorkout(today.workout);
    const family = localFamilyMission();
    const customer = localCustomer(today.customer);
    return [
      `ตอนนี้: ${current.mission}`,
      `${facultyLabel(faculty)}: Day ${lesson.day} - ${lesson.title}`,
      `งานขาย: ${customer.closingObjective}`,
      `Workout: ${workout.type} - ${workout.reason}`,
      `ครอบครัว: ${family.task}`
    ].join("\n");
  }

  function generateTodayFlow() {
    Engine.repairProgress?.(state);
    const today = Engine.generateToday(state, roadmaps);
    today.generateStatus = t("todayGenerated");
    today.teachPrompt = Engine.buildTeachMePrompt(state, roadmaps);
    Storage.save(state);
    renderAll();
    $("#universityCard")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function startMyDayFlow() {
    Engine.repairProgress?.(state);
    const today = Engine.generateToday(state, roadmaps);
    today.autopilotStarted = true;
    today.generateStatus = "Autopilot พร้อมแล้ว: ทำ Today Win ก่อนอย่างอื่น";
    today.teachPrompt = Engine.buildTeachMePrompt(state, roadmaps);
    state.settings.mobileDetailsOpen = false;
    Storage.save(state);
    renderAll();
    $("#browserCommandSection")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function copyTeachPrompt(prompt) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(prompt);
        return true;
      }
    } catch {
      // Fall back to the selected textarea below. Clipboard can be limited on file://.
    }

    const box = $("#teachPromptBox");
    const copySource = box || document.createElement("textarea");
    copySource.value = prompt;
    copySource.setAttribute("readonly", "");
    if (!box) {
      copySource.style.position = "fixed";
      copySource.style.top = "-1000px";
      document.body.appendChild(copySource);
    }
    copySource.focus();
    copySource.select();
    copySource.setSelectionRange(0, prompt.length);
    try {
      return Boolean(document.execCommand && document.execCommand("copy"));
    } catch {
      return false;
    } finally {
      if (!box) copySource.remove();
    }
  }

  function renderNotificationStatus() {
    if (!$("#notificationStatus")) return;
    if (!("Notification" in window)) {
      $("#notificationStatus").textContent = t("notificationUnsupported");
      return;
    }
    if (Notification.permission === "granted") {
      $("#notificationStatus").textContent = t("notificationGranted");
    } else if (Notification.permission === "denied") {
      $("#notificationStatus").textContent = t("notificationDenied");
    } else {
      $("#notificationStatus").textContent = t("notificationDefault");
    }
  }

  function renderPwaStatus(message) {
    const node = $("#pwaStatus");
    if (!node) return;
    if (message) {
      pwaStatusMessage = message;
      node.textContent = message;
      return;
    }
    if (pwaStatusMessage) {
      node.textContent = pwaStatusMessage;
      return;
    }
    if (location.protocol === "file:") {
      node.textContent = t("pwaFileMode");
    } else if ("serviceWorker" in navigator) {
      node.textContent = t("pwaRegistering");
    } else {
      node.textContent = t("pwaUnsupported");
    }
  }

  async function registerServiceWorker() {
    renderPwaStatus();
    if (!("serviceWorker" in navigator)) {
      renderPwaStatus(t("pwaUnsupported"));
      return;
    }
    if (location.protocol === "file:") {
      renderPwaStatus(t("pwaFileMode"));
      return;
    }
    try {
      const registration = await navigator.serviceWorker.register("./service-worker.js", { updateViaCache: "none" });
      registration.update();
      registration.addEventListener("updatefound", () => {
        const installingWorker = registration.installing;
        if (!installingWorker) return;
        pendingServiceWorker = installingWorker;
        installingWorker.addEventListener("statechange", () => {
          if (installingWorker.state === "installed" && navigator.serviceWorker.controller) {
            checkForUpdates();
          }
        });
      });
      if (registration.waiting && navigator.serviceWorker.controller) {
        pendingServiceWorker = registration.waiting;
        checkForUpdates();
      }
      renderPwaStatus(t("pwaReady"));
    } catch {
      renderPwaStatus(t("pwaFileMode"));
    }
  }

  function compareVersions(a, b) {
    const left = String(a || "0").split(".").map(part => Number(part) || 0);
    const right = String(b || "0").split(".").map(part => Number(part) || 0);
    const length = Math.max(left.length, right.length);
    for (let index = 0; index < length; index++) {
      const diff = (left[index] || 0) - (right[index] || 0);
      if (diff !== 0) return diff;
    }
    return 0;
  }

  function renderAppVersion() {
    const node = $("#appVersionText");
    if (node) node.textContent = `Life OS University v${APP_VERSION}`;
  }

  async function runFreshModeIfRequested() {
    const params = new URLSearchParams(window.location.search);
    if (!params.has("fresh")) return;

    if ($("#updateStatusText")) $("#updateStatusText").textContent = t("clearingUpdateCache");
    try {
      if ("serviceWorker" in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(registrations.map(registration => registration.unregister()));
      }
      await clearLifeOsCaches();
    } finally {
      params.delete("fresh");
      const cleanUrl = `${window.location.pathname}${params.toString() ? `?${params}` : ""}`;
      window.history.replaceState({}, "", cleanUrl);
    }
  }

  function showUpdateBanner(info = {}) {
    updateVersionInfo = info;
    const banner = $("#updateBanner");
    if (!banner) return;
    $("#updateBannerNotes").textContent = info.notes ? `${info.version || ""} · ${info.notes}` : t("updateReady");
    banner.classList.remove("hidden");
    $("#updateStatusText") && ($("#updateStatusText").textContent = t("updateReady"));
  }

  function hideUpdateBanner() {
    $("#updateBanner")?.classList.add("hidden");
  }

  async function checkForUpdates({ manual = false } = {}) {
    if ($("#updateStatusText") && manual) $("#updateStatusText").textContent = t("checkingUpdates");
    try {
      const response = await fetch(`version.json?t=${Date.now()}`, {
        cache: "no-store",
        headers: { "Cache-Control": "no-cache" }
      });
      if (!response.ok) throw new Error("version fetch failed");
      const remote = await response.json();
      updateVersionInfo = remote;
      if (compareVersions(remote.version, APP_VERSION) > 0) {
        showUpdateBanner(remote);
        return true;
      }
      hideUpdateBanner();
      if ($("#updateStatusText") && manual) $("#updateStatusText").textContent = t("latestVersion");
      return false;
    } catch {
      if ($("#updateStatusText") && manual) $("#updateStatusText").textContent = t("updateFailed");
      return false;
    }
  }

  async function clearLifeOsCaches() {
    if (!("caches" in window)) return;
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key.startsWith(LIFE_OS_CACHE_PREFIX)).map(key => caches.delete(key)));
  }

  async function updateNow() {
    if ($("#updateStatusText")) $("#updateStatusText").textContent = t("clearingUpdateCache");
    try {
      const registration = "serviceWorker" in navigator ? await navigator.serviceWorker.getRegistration() : null;
      const worker = pendingServiceWorker || registration?.waiting || registration?.installing;
      if (worker) worker.postMessage({ type: "SKIP_WAITING" });
      await clearLifeOsCaches();
      if (registration) await registration.update();
    } finally {
      window.location.reload();
    }
  }

  function forceFreshReload() {
    window.location.href = `fresh.html?t=${Date.now()}`;
  }

  function bindEvents() {
    $("#languageSelect").addEventListener("change", () => {
      state.settings.language = $("#languageSelect").value;
      saveAndRender();
    });

    $("#sleepForm")?.addEventListener("input", () => {
      if (!$("#sleepHours")) return;
      state.sleep = {
        hours: $("#sleepHours").value,
        deep: $("#deepSleep").value,
        rem: $("#remSleep").value,
        wakes: $("#wakeCount").value
      };
      saveAndRender();
    });

    $("#workoutOverride").addEventListener("change", () => {
      state.settings.workoutOverride = $("#workoutOverride").value;
      Engine.generateToday(state, roadmaps);
      saveAndRender();
    });

    $("#generateTodayBtn").addEventListener("click", generateTodayFlow);
    $("#mobileGenerateBtn").addEventListener("click", startMyDayFlow);
    $("#refreshLessonDataBtn")?.addEventListener("click", () => {
      Engine.repairProgress?.(state);
      Engine.generateToday(state, roadmaps);
      saveAndRender();
    });
    $("#repairProgressBtn")?.addEventListener("click", () => {
      Engine.repairProgress?.(state);
      saveAndRender();
    });
    $("#toggleSleepLogForm")?.addEventListener("click", () => {
      state.settings.sleepFormOpen = !state.settings.sleepFormOpen;
      saveAndRender();
    });

    $("#morningBriefBtn").addEventListener("click", () => {
      const today = Engine.ensureToday(state, roadmaps);
      const faculty = today.dailyFocus?.focus || today.currentFaculty || state.university.currentFaculty;
      const lesson = Engine.lessonForToday(state, roadmaps, faculty);
      const current = localBlock(Engine.getCurrentBlock(new Date(), state));
      const customer = localCustomer(today.customer);
      const workout = localWorkout(today.workout);
      const family = localFamilyMission();
      today.brief = [
        `${lang() === "th" ? "ตอนนี้" : "NOW"}: ${current.mission}`,
        `${facultyLabel(faculty)}: Day ${lesson.day} - ${lesson.title}`,
        `${lang() === "th" ? "งานขาย" : "SALES"}: ${customer.closingObjective}`,
        `${lang() === "th" ? "Workout" : "WORKOUT"}: ${workout.type} - ${workout.reason}`,
        `${lang() === "th" ? "ครอบครัว" : "FAMILY"}: ${family.task}`
      ].join("\n");
      saveAndRender();
    });

    $("#nightReviewBtn").addEventListener("click", () => {
      const today = Engine.dayState(state);
      today.review = $("#nightReviewText").value || t("nightDefault");
      if (!today.tasks.night) Engine.toggleTask(state, "night");
      saveAndRender();
    });

    $("#exportBtn").addEventListener("click", () => {
      $("#backupBox").value = Storage.exportJson(state);
    });

    $("#importBtn").addEventListener("click", () => {
      try {
        state = Storage.importJson($("#backupBox").value);
        Storage.save(state);
        renderAll();
        $("#backupBox").value = t("importComplete");
      } catch {
        $("#backupBox").value = t("importFailed");
      }
    });

    $("#notificationPermissionBtn").addEventListener("click", async () => {
      if (!("Notification" in window)) {
        $("#notificationStatus").textContent = t("notificationUnsupported");
        return;
      }
      const localHttps = location.protocol === "https:" || ["localhost", "127.0.0.1"].includes(location.hostname);
      if (!localHttps) {
        $("#notificationStatus").textContent = t("notificationRequiresHttps");
        return;
      }
      const permission = await Notification.requestPermission();
      state.settings.notificationsEnabled = permission === "granted";
      Storage.save(state);
      renderNotificationStatus();
    });

    $("#checkUpdateBtn").addEventListener("click", () => {
      checkForUpdates({ manual: true });
    });

    $("#updateNowBtn").addEventListener("click", updateNow);
    $("#updateLaterBtn").addEventListener("click", hideUpdateBanner);
    $("#forceFreshBtn")?.addEventListener("click", forceFreshReload);
    $("#exportLocalStorageBtn")?.addEventListener("click", exportLocalStorageBackup);
    $("#resetDemoDataBtn")?.addEventListener("click", resetDemoDataOnly);
    $("#resetWeekendDefaultsBtn")?.addEventListener("click", () => {
      state.weekend.activityOverrides = {};
      state.weekend.activityDefaults = {};
      state.weekend.settings = {
        saturdayWakeTime: "05:30",
        sundayWakeTime: "06:00",
        saturdayFutsalTime: "09:00",
        sundayFamilyActivityTime: "09:00",
        familyActivityDefault: "Shopping mall / cafe / park / family errands",
        weekendLearningMinutes: 45,
        exercisePreference: "walk_zone2",
        ifWindow: "12:00-19:00",
        defaultWeekendMode: "auto",
        manualRecovery: "auto"
      };
      saveAndRender();
    });

    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") checkForUpdates();
    });

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        if (!sessionStorage.getItem("life-os-controller-reloaded")) {
          sessionStorage.setItem("life-os-controller-reloaded", "1");
          window.location.reload();
        }
      });
    }

    document.addEventListener("click", async event => {
      const teach = event.target.closest("#teachMeBtn, #teachMePromptBtn");
      const driveLesson = event.target.closest("#driveLessonBtn, #driveLessonPromptBtn");
      const completeAll = event.target.closest("#completeAllTodayBtn");
      const complete = event.target.closest("[data-complete]");
      const skip = event.target.closest("[data-skip]");
      const refresh = event.target.closest("[data-refresh]");
      const toggle = event.target.closest("[data-toggle-task]");
      const modeToggle = event.target.closest("#toggleExecutiveBriefModeBtn");
      const weekendAction = event.target.closest("[data-weekend-action]");
      const browserAction = event.target.closest("[data-browser-action]");
      const accordionToggle = event.target.closest("[data-accordion-toggle]");
      const accordionLink = event.target.closest("[data-open-accordion]");
      const resetWeekend = event.target.closest("#resetWeekendDefaultsBtn");
      const missionToggle = event.target.closest("[data-toggle-mission]");
      const realityButton = event.target.closest("[data-reality]");

      if (accordionToggle) {
        const key = accordionToggle.dataset.accordionToggle;
        state.settings.mobileDetailsOpen = true;
        state.settings.mobileAccordions ||= {};
        state.settings.mobileAccordions[key] = !state.settings.mobileAccordions[key];
        saveAndRender();
        return;
      }

      if (accordionLink) {
        event.preventDefault();
        const key = accordionLink.dataset.openAccordion;
        state.settings.mobileDetailsOpen = true;
        state.settings.mobileAccordions ||= {};
        state.settings.mobileAccordions[key] = true;
        saveAndRender();
        setTimeout(() => document.querySelector(accordionLink.getAttribute("href"))?.scrollIntoView({ behavior: "smooth", block: "start" }), 0);
        return;
      }

      if (realityButton) {
        const [key, value] = realityButton.dataset.reality.split(":");
        const today = Engine.dayState(state);
        today.realityCheck ||= {};
        today.realityCheck[key] = key === "learningMinutes" ? Number(value) : value;
        if (key === "learningMinutes") today.availableMinutes = Number(value);
        today.teachPrompt = Engine.buildTeachMePrompt(state, roadmaps);
        today.autopilotStatus = "Reality Check อัปเดตแล้ว · Autopilot ปรับ Prime Mission ใหม่";
        Storage.save(state);
        renderAll();
        return;
      }

      if (browserAction) {
        const action = browserAction.dataset.browserAction;
        if (action === "details") {
          state.settings.mobileDetailsOpen = !state.settings.mobileDetailsOpen;
          state.settings.mobileAccordions ||= {};
          state.settings.mobileAccordions.learn = state.settings.mobileDetailsOpen;
          saveAndRender();
          if (state.settings.mobileDetailsOpen) {
            setTimeout(() => $("#learnSection")?.scrollIntoView({ behavior: "smooth", block: "start" }), 0);
          }
          return;
        }
        if (action === "start" || action === "generate") {
          startMyDayFlow();
          return;
        }
        if (action === "daily-win") {
          const win = Engine.completeDailyWin(state, roadmaps);
          Engine.dayState(state).autopilotStatus = `ชนะวันนี้แล้ว: ${win.title} · ${win.impact || "momentum saved"}`;
          saveAndRender();
          return;
        }
        if (action === "close-loop") {
          const today = Engine.dayState(state);
          today.closeLoopOpen = !today.closeLoopOpen;
          saveAndRender();
          return;
        }
        if (action === "complete-focus") {
          const today = Engine.ensureToday(state, roadmaps);
          const focusTrack = today.dailyFocus?.focus || today.currentFaculty || state.university.currentFaculty;
          Engine.completeTrack(state, focusTrack);
          const progress = Engine.progressFor(state, focusTrack);
          Engine.dayState(state).autopilotStatus = `${facultyLabel(focusTrack)} เสร็จแล้ว · ถัดไป Day ${progress.day || progress.currentDay || "-"}`;
          saveAndRender();
          return;
        }
        if (action === "brief") {
          state.settings.mobileDetailsOpen = true;
          Storage.save(state);
          renderBrowserCommandCenter();
          $("#morningBriefBtn")?.click();
          $("#executiveSection")?.scrollIntoView({ behavior: "smooth", block: "start" });
          return;
        }
        if (action === "teach" || action === "drive") {
          state.settings.mobileDetailsOpen = true;
          state.settings.mobileAccordions ||= {};
          state.settings.mobileAccordions.learn = true;
          const today = Engine.ensureToday(state, roadmaps);
          const prompt = action === "drive"
            ? Engine.buildDriveLessonPrompt(state, roadmaps)
            : Engine.buildTeachMePrompt(state, roadmaps);
          today.teachPrompt = prompt;
          const copied = await copyTeachPrompt(prompt);
          today.teachStatus = copied
            ? (action === "drive" ? t("drivePromptCopied") : t("promptCopied"))
            : t("promptCopyFailed");
          Storage.save(state);
          renderAll();
          $("#teachMeCard")?.scrollIntoView({ behavior: "smooth", block: "start" });
          return;
        }
      }

      if (modeToggle) {
        state.settings.executiveBriefMode = state.settings.executiveBriefMode === "quick" ? "detailed" : "quick";
        saveAndRender();
        return;
      }

      if (resetWeekend) {
        state.weekend.activityOverrides = {};
        state.weekend.activityDefaults = {};
        state.weekend.settings = {
          saturdayWakeTime: "05:30",
          sundayWakeTime: "06:00",
          saturdayFutsalTime: "09:00",
          sundayFamilyActivityTime: "09:00",
          familyActivityDefault: "Shopping mall / cafe / park / family errands",
          weekendLearningMinutes: 45,
          exercisePreference: "walk_zone2",
          ifWindow: "12:00-19:00",
          defaultWeekendMode: "auto",
          manualRecovery: "auto"
        };
        saveAndRender();
        return;
      }

      if (weekendAction) {
        const key = Engine.dateKey();
        const blockId = weekendAction.dataset.blockId;
        const action = weekendAction.dataset.weekendAction;
        state.weekend.activityOverrides ||= {};
        state.weekend.activityOverrides[key] ||= {};
        state.weekend.activityOverrides[key][blockId] ||= {};
        if (action === "change") {
          const value = window.prompt("เปลี่ยนกิจกรรมวันนี้เป็นอะไร?", state.weekend.activityOverrides[key][blockId].mission || "");
          if (value) state.weekend.activityOverrides[key][blockId].mission = value;
        } else if (action === "time") {
          const value = window.prompt("ปรับเวลาเริ่มต้นวันนี้ เช่น 10:00", state.weekend.activityOverrides[key][blockId].start || "");
          if (value) state.weekend.activityOverrides[key][blockId].start = value;
        } else if (action === "default") {
          const currentBlock = Engine.scheduleForDate(state).find(block => block.id === blockId);
          state.weekend.activityDefaults ||= {};
          state.weekend.activityDefaults[blockId] = {
            start: state.weekend.activityOverrides[key][blockId].start || currentBlock?.start,
            mission: state.weekend.activityOverrides[key][blockId].mission || currentBlock?.mission,
            title: currentBlock?.title,
            detail: currentBlock?.detail
          };
          delete state.weekend.activityOverrides[key][blockId].status;
        } else {
          state.weekend.activityOverrides[key][blockId].status = action;
        }
        saveAndRender();
        return;
      }

      if (event.target.closest("#saveWeekendFamilyMissionBtn")) {
        state.weekend.familyMissions ||= {};
        state.weekend.familyMissions[Engine.dateKey()] = $("#weekendFamilyMissionInput").value;
        saveAndRender();
        return;
      }

      if (teach) {
        const today = Engine.ensureToday(state, roadmaps);
        const prompt = Engine.buildTeachMePrompt(state, roadmaps);
        today.teachPrompt = prompt;
        const copied = await copyTeachPrompt(prompt);
        today.teachStatus = copied ? t("promptCopied") : t("promptCopyFailed");
        Storage.save(state);
        renderAll();
        return;
      }

      if (driveLesson) {
        const today = Engine.ensureToday(state, roadmaps);
        const prompt = Engine.buildDriveLessonPrompt(state, roadmaps);
        today.teachPrompt = prompt;
        const copied = await copyTeachPrompt(prompt);
        today.teachStatus = copied ? t("drivePromptCopied") : `${t("drivePromptCopied")} หากวางแล้วว่าง ให้คัดลอกจากกล่อง Prompt ด้วยตนเอง`;
        Storage.save(state);
        renderAll();
        return;
      }

      if (completeAll) {
        Engine.FACULTIES.forEach(faculty => Engine.completeTrack(state, faculty));
        saveAndRender();
        return;
      }

      if (complete) {
        const track = Engine.normalizeFacultyId?.(complete.dataset.complete) || complete.dataset.complete;
        Engine.completeTrack(state, complete.dataset.complete);
        const task = complete.dataset.completeTask;
        if (task) {
          const day = Engine.dayState(state);
          delete day.tasks[complete.dataset.complete];
          day.tasks[task] = true;
        }
        const progress = Engine.progressFor(state, track);
        Engine.dayState(state).autopilotStatus = `${track} เสร็จแล้ว · ถัดไป Day ${progress.day || progress.currentDay || "-"}`;
        saveAndRender();
      }

      if (skip) {
        Engine.skipTrack(state, skip.dataset.skip);
        saveAndRender();
      }

      if (refresh) {
        const track = Engine.normalizeFacultyId?.(refresh.dataset.refresh) || refresh.dataset.refresh;
        const today = Engine.dayState(state);
        today.lessonRefs ||= {};
        const day = Math.min(365, Engine.progressFor(state, track).day + 1);
        today.lessonRefs[track] = { track, day };
        saveAndRender();
      }

      if (toggle) {
        Engine.toggleTask(state, toggle.dataset.toggleTask);
        saveAndRender();
        return;
      }

      if (missionToggle) {
        toggleMission(missionToggle.dataset.toggleMission);
        saveAndRender();
      }
    });

    document.addEventListener("input", event => {
      const target = event.target;
      if (target.matches("[data-note]")) {
        const [track, field] = target.dataset.note.split(":");
        Engine.notesFor(state, Engine.normalizeFacultyId?.(track) || track)[field] = target.value;
        Storage.save(state);
      }

      if (target.id === "meetingNotes") {
        Engine.notesFor(state, "elite_b2b_sales").nowWhat = target.value;
        Storage.save(state);
      }
    });

    document.addEventListener("submit", event => {
      if (event.target.id === "salesMissionForm") {
        event.preventDefault();
        const form = new FormData(event.target);
        state.executive ||= {};
        state.executive.salesPipeline = [0, 1, 2]
          .map(index => ({
            name: String(form.get(`name-${index}`) || "").trim(),
            status: form.get(`status-${index}`) || "follow-up required",
            priority: form.get(`priority-${index}`) || "medium",
            preparationStatus: String(form.get(`prep-${index}`) || "").trim(),
            followUpRequired: Boolean(form.get(`follow-${index}`)),
            ageHours: Number(form.get(`age-${index}`) || 0)
          }))
          .filter(customer => customer.name);
        Engine.dayState(state).autopilotStatus = "Sales Mission อัปเดตแล้ว · ระบบเลือก priority ใหม่ให้วันนี้";
        saveAndRender();
        return;
      }

      if (event.target.id === "dailyCloseLoopForm") {
        event.preventDefault();
        const form = new FormData(event.target);
        Engine.saveEveningClose(state, {
          win: form.get("win") || "",
          pending: form.get("pending") || "",
          protect: form.get("protect") || ""
        });
        Engine.dayState(state).closeLoopOpen = false;
        Engine.dayState(state).autopilotStatus = "ปิดวันเรียบร้อย · พรุ่งนี้ Life OS จะจำสิ่งที่ค้างให้";
        saveAndRender();
        return;
      }

      if (event.target.id === "weekendSettingsForm") {
        event.preventDefault();
        const form = new FormData(event.target);
        state.weekend.settings = {
          saturdayWakeTime: form.get("saturdayWakeTime") || "05:30",
          sundayWakeTime: form.get("sundayWakeTime") || "06:00",
          saturdayFutsalTime: form.get("saturdayFutsalTime") || "09:00",
          sundayFamilyActivityTime: form.get("sundayFamilyActivityTime") || "09:00",
          familyActivityDefault: form.get("familyActivityDefault") || "Shopping mall / cafe / park / family errands",
          weekendLearningMinutes: Number(form.get("weekendLearningMinutes") || 45),
          exercisePreference: form.get("exercisePreference") || "walk_zone2",
          ifWindow: form.get("ifWindow") || "12:00-19:00",
          defaultWeekendMode: form.get("defaultWeekendMode") || "auto",
          manualRecovery: form.get("manualRecovery") || "auto"
        };
        saveAndRender();
        return;
      }

      if (event.target.id === "sundayCeoReviewForm") {
        event.preventDefault();
        const form = new FormData(event.target);
        const id = Engine.weekId();
        state.weekend.ceoReviews ||= {};
        state.weekend.ceoReviews[id] = {
          weekId: id,
          savedAt: new Date().toISOString(),
          highlights: form.get("highlights") || "",
          problems: form.get("problems") || "",
          health: form.get("health") || "",
          family: form.get("family") || "",
          work: form.get("work") || "",
          finance: form.get("finance") || "",
          learning: form.get("learning") || "",
          recovery: form.get("recovery") || "",
          top3: form.get("top3") || "",
          stop: form.get("stop") || "",
          continue: form.get("continue") || "",
          improve: form.get("improve") || ""
        };
        saveAndRender();
        return;
      }

      if (event.target.id === "executiveReflectionForm") {
        event.preventDefault();
        const form = new FormData(event.target);
        state.executive.reflections ||= {};
        state.executive.reflections[Engine.dateKey()] = {
          date: Engine.dateKey(),
          wentWell: form.get("wentWell") || "",
          improve: form.get("improve") || "",
          learned: form.get("learned") || "",
          updatedAt: new Date().toISOString()
        };
        const today = Engine.dayState(state);
        today.review = [
          state.executive.reflections[Engine.dateKey()].wentWell,
          state.executive.reflections[Engine.dateKey()].improve,
          state.executive.reflections[Engine.dateKey()].learned
        ].filter(Boolean).join("\n");
        if (!today.tasks.night) Engine.toggleTask(state, "night");
        saveAndRender();
        return;
      }

      if (event.target.id === "decisionMemoryForm") {
        event.preventDefault();
        const form = new FormData(event.target);
        state.executive.decisions ||= [];
        state.executive.decisions.push({
          id: `decision-${Date.now()}`,
          date: Engine.dateKey(),
          title: form.get("title") || "Major decision",
          reason: form.get("reason") || "",
          result: form.get("result") || "",
          reviewDate: form.get("reviewDate") || "",
          createdAt: new Date().toISOString()
        });
        saveAndRender();
        return;
      }

      if (event.target.id === "weeklyOperatingReviewForm") {
        event.preventDefault();
        const form = new FormData(event.target);
        const id = Engine.weekId?.() || "current-week";
        state.executive.weeklyOperatingReviews ||= {};
        state.executive.weeklyOperatingReviews[id] = {
          weekId: id,
          savedAt: new Date().toISOString(),
          health: form.get("health") || "",
          sales: form.get("sales") || "",
          ai: form.get("ai") || "",
          family: form.get("family") || "",
          finance: form.get("finance") || "",
          stop: form.get("stop") || ""
        };
        saveAndRender();
        return;
      }

      if (event.target.id !== "manualSleepLogForm") return;
      event.preventDefault();
      const log = Sleep.buildLogFromForm(event.target);
      state.sleepLogs = sleepLogs().filter(item => item.date !== log.date);
      state.sleepLogs.push(log);
      state.sleepLogs = Sleep.sortedLogs(state.sleepLogs);
      state.sleep = {
        hours: (Number(log.total_sleep_minutes) / 60).toFixed(1),
        deep: log.deep_sleep_percent,
        rem: log.rem_sleep_percent,
        wakes: log.awake_count
      };
      state.settings.sleepFormOpen = false;
      saveAndRender();
      $("#sleepSection")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    document.addEventListener("change", event => {
      if (event.target.id === "dayModeOverrideSelect") {
        const today = Engine.dayState(state);
        today.modeOverride = event.target.value;
        Engine.generateToday(state, roadmaps);
        saveAndRender();
        return;
      }

      if (event.target.matches("[data-mobile-qa]")) {
        state.executive.mobileQa ||= {};
        state.executive.mobileQa[event.target.dataset.mobileQa] = event.target.checked;
        Storage.save(state);
        renderMobileQaChecklist();
        return;
      }

      if (event.target.id === "learningTimeSelect") {
        const today = Engine.ensureToday(state, roadmaps);
        today.availableMinutes = Number(event.target.value);
        today.teachPrompt = Engine.buildTeachMePrompt(state, roadmaps);
        Storage.save(state);
        renderAll();
      }
    });
  }

  function renderAll() {
    Engine.ensureToday(state, roadmaps);
    applyStaticTranslations();
    renderTime();
    renderTopCommand();
    renderBrowserCommandCenter();
    renderMobileAccordions();
    renderExecutiveBrief();
    renderWeekendDashboard();
    renderNowNext();
    renderSchedule();
    renderSleepForm();
    renderLessons();
    renderChecklist();
    renderBriefReview();
    renderWeeklyOperatingReview();
    renderNotificationStatus();
    renderPwaStatus();
    renderAppVersion();
    renderProgressDebug();
    renderMobileQaChecklist();
    renderWeekendSettings();
    Storage.save(state);
  }

  bindEvents();
  renderAll();
  runFreshModeIfRequested();
  registerServiceWorker();
  checkForUpdates();
  setInterval(() => {
    renderTime();
    renderTopCommand();
    renderBrowserCommandCenter();
    renderNowNext();
    renderSchedule();
  }, 60000);
})();
