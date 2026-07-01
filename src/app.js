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
  const APP_VERSION = "6.4.1";
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
      todaysSalesFocusPrefix: "Today's sales focus:",
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
      todaysSalesFocusPrefix: "โฟกัสงานขายวันนี้:",
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
    const current = localBlock(Engine.getCurrentBlock());
    const next = localBlock(Engine.getNextBlock());
    const recovery = Engine.recoveryStatus(state);
    const daily = Engine.dailyScore(state);
    const weekly = Engine.weeklyScore(state);

    $("#greetingText").textContent = greetingForHour(new Date().getHours());
    $("#recoveryLabel").textContent = recoveryLabel(recovery);
    $("#recoveryLabel").className = `status-dot ${recovery.level}`;
    $("#sleepScore").textContent = recovery.score === null ? "--" : recovery.score.toFixed(1);
    $("#sleepScoreSmall").textContent = recovery.score === null ? "" : "/10";
    $("#currentMission").textContent = current.mission;
    $("#nextMission").textContent = `${next.start} ${next.title}`;
    $("#progressToday").textContent = `${daily.percent}%`;
    $("#progressRing").style.setProperty("--progress", `${daily.percent * 3.6}deg`);
    $("#dailyScore").textContent = `${daily.complete}/${daily.total}`;
    $("#weeklyScore").textContent = `${weekly.percent}%`;
    $("#currentStreak").textContent = state.streaks.current;
    $("#longestStreak").textContent = state.streaks.longest;
    $("#completionPct").textContent = `${Engine.completionPercent(state)}%`;
    $("#todayFocus").textContent = today.customer ? localCustomer(today.customer).closingObjective : t("generateToDefineSales");
    if ($("#mobileStatus")) $("#mobileStatus").textContent = `${t("todayStatus")} ${daily.percent}% · ${recoveryLabel(recovery)}`;
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
    const current = localBlock(Engine.getCurrentBlock());
    const nextThirty = localBlock(Engine.getNextThirty());
    const next = localBlock(Engine.getNextBlock());

    $("#nowTitle").textContent = current.title;
    $("#nowDetail").textContent = current.mission;
    $("#nowCountdown").textContent = `${t("nextBlockIn")} ${Engine.countdownToNext()}`;

    if (nextThirty.id === current.id) {
      $("#nextTitle").textContent = `${next.start} ${next.title}`;
      $("#nextDetail").textContent = next.mission;
    } else {
      $("#nextTitle").textContent = `${nextThirty.start} ${nextThirty.title}`;
      $("#nextDetail").textContent = nextThirty.mission;
    }
  }

  function renderSchedule() {
    const current = Engine.getCurrentBlock();
    const nextThirty = Engine.getNextThirty();
    $("#scheduleList").innerHTML = Engine.schedule.map(block => {
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
    $("#sleepHours").value = sleep.hours ?? "";
    $("#deepSleep").value = sleep.deep ?? "";
    $("#remSleep").value = sleep.rem ?? "";
    $("#wakeCount").value = sleep.wakes ?? "";
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
      <div class="panel-title">${t("university")} <small>Daily Focus · 6 faculties</small></div>
      <div class="module-body university-body">
        ${today.generateStatus ? `<div class="notice good">${today.generateStatus}</div>` : ""}
        <div class="today-learning-summary">
          <div>
            <span class="eyebrow">${lang() === "th" ? "วันนี้ต้องเรียน" : "Today's Faculty"}</span>
            <h3>${facultyIcon(focus?.faculty)} ${facultyLabel(focus?.faculty)} · ${focus?.lesson.title || ""}</h3>
            <p>${t("totalLearningTime")}: ${totalMinutes} min · ${t("nextAction")}: ${focus?.nextAction || ""}</p>
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
    const customer = localCustomer(today.customer);
    const lesson = Engine.lessonForToday(state, roadmaps, "elite_b2b_sales");
    const isDone = Boolean(Engine.dayState(state).tasks.elite_b2b_sales || Engine.dayState(state).tasks.sales);
    $("#salesCard").innerHTML = `
      <div class="panel-title">${t("salesFocus")} <small>${t("premiumLeatherAE")}</small></div>
      <div class="module-body">
        <h3>${lesson.title}</h3>
        <div class="field-grid">
          <div class="field"><span>${t("customer")}</span><b>${customer.name}</b></div>
          <div class="field"><span>${t("painPoint")}</span><p>${customer.painPoint}</p></div>
          <div class="field"><span>${t("hook")}</span><p>${customer.hook}</p></div>
          <div class="field"><span>${t("closingObjective")}</span><p>${customer.closingObjective}</p></div>
        </div>
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
      ["morning", lang() === "th" ? "Morning reset เสร็จแล้ว" : "Morning reset complete"],
      ["university", lang() === "th" ? "Life OS University เสร็จแล้ว" : "Life OS University complete"],
      ["sales", lang() === "th" ? "โฟกัสงานขายเสร็จแล้ว" : "Sales focus complete"],
      ["workout", lang() === "th" ? "Workout เสร็จแล้ว" : "Workout complete"],
      ["family", lang() === "th" ? "ภารกิจครอบครัวเสร็จแล้ว" : "Family mission complete"],
      ["night", lang() === "th" ? "Night review เสร็จแล้ว" : "Night review complete"]
    ];

    $("#checklist").innerHTML = items.map(([id, label]) => `
      <div class="check-row ${today.tasks[id] ? "done" : ""}">
        <button type="button" aria-label="Toggle ${label}" data-toggle-task="${id}">✓</button>
        <span>${label}</span>
      </div>
    `).join("");
  }

  function renderBriefReview() {
    const today = Engine.dayState(state);
    $("#briefOutput").textContent = localBrief(today.brief) || t("briefEmpty");
    $("#nightReviewText").value = today.review || "";
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
    const plan = [
      "05:30 ตื่นนอน ดื่มน้ำ รับแสงถ้ามี",
      "05:45–05:55 mobility / stretch 10 นาที",
      "05:55–06:00 เตรียมออกจากบ้าน",
      "06:00–06:45 ส่งลูกชายไปโรงเรียน ขับรถปลอดภัย ไม่ดูจอ",
      "06:45–07:00 Reset หลังขับรถ: หายใจ 2 นาที + ดื่มน้ำ",
      "09:00 ดื่มกาแฟได้ แต่ไม่เกิน 2 แก้ว",
      "หลัง 14:00 งดคาเฟอีน",
      "10:00–17:00 ช่วงเหมาะออกกำลังกาย",
      "18:00 รับลูก / กิจวัตรครอบครัว",
      "18:30–19:00 มื้อเย็น ไม่หนักเกินไป",
      "20:00 เริ่มลดงาน ลดเรื่องเครียด",
      "20:30 ลดแสงในบ้าน ลดแสงจอ",
      "21:00 งดงาน งดข่าว งดโซเชียลหนัก ๆ",
      "21:15 อาบน้ำอุ่น / เตรียมของพรุ่งนี้",
      "21:30 อ่านหนังสือเบา ๆ หรือฟังเสียงผ่อนคลาย",
      "21:45 ฝึกหายใจ 4-2-6 หรือยืดเหยียดเบา ๆ",
      "22:00 เข้านอน"
    ];

    node.innerHTML = `
      ${analysis.holidayNote ? `<div class="notice warn">${analysis.holidayNote}</div>` : ""}
      <div class="sleep-card-grid">
        <article class="sleep-card score-card">
          <span>Sleep Score Card</span>
          <strong>${log.sleep_score}</strong>
          <p>${log.date} · ${log.day_type}</p>
        </article>
        <article class="sleep-card">
          <span>Sleep Timeline Card</span>
          <b>${log.bedtime} → ${log.wake_time}</b>
          <p>เป้าหมาย ${log.target_bedtime}–${log.target_wake_time} · ${Sleep.formatMinutes(log.target_sleep_minutes)}</p>
        </article>
        <article class="sleep-card">
          <span>Sleep Stage Card</span>
          ${sleepBar("Deep", log.deep_sleep_percent)}
          ${sleepBar("Light", log.light_sleep_percent)}
          ${sleepBar("REM", log.rem_sleep_percent)}
        </article>
        <article class="sleep-card">
          <span>Breathing & SpO2 Card</span>
          <b>Breathing ${log.breathing_quality_score ?? "-"} / 100</b>
          <p>SpO2 ${log.spo2_range || "-"} · HR ${log.heart_rate_range || "-"} · BR ${log.breathing_rate_range || "-"}</p>
        </article>
        <article class="sleep-card good">
          <span>Strength Card</span>
          <b>${analysis.strengths[0] || "ยังไม่มีจุดแข็งเด่น"}</b>
          <p>${analysis.strengths.slice(1).join(" · ")}</p>
        </article>
        <article class="sleep-card warn">
          <span>Weakness Card</span>
          <b>${analysis.primaryWeakness}</b>
          <p>${log.notes || "ดูแนวโน้ม 7 วันก่อนตัดสินใจรุนแรง"}</p>
        </article>
        <article class="sleep-card">
          <span>Today Fix Card</span>
          <b>${analysis.todayFix}</b>
          <p>เน้น sleep consistency มากกว่าฝืนตื่นเช้า</p>
        </article>
        <article class="sleep-card">
          <span>Tonight Target Card</span>
          <b>${analysis.tonightTarget}</b>
          <p>${analysis.medicalNote}</p>
        </article>
      </div>
      <article class="sleep-card daily-plan">
        <span>Daily Sleep Plan Card</span>
        <div class="sleep-plan-list">${plan.map(item => `<p>${item}</p>`).join("")}</div>
      </article>
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
    const current = localBlock(Engine.getCurrentBlock());
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
    const today = Engine.generateToday(state, roadmaps);
    today.generateStatus = t("todayGenerated");
    today.teachPrompt = Engine.buildTeachMePrompt(state, roadmaps);
    Storage.save(state);
    renderAll();
    $("#universityCard")?.scrollIntoView({ behavior: "smooth", block: "start" });
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

    $("#sleepForm").addEventListener("input", () => {
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
    $("#mobileGenerateBtn").addEventListener("click", generateTodayFlow);
    $("#toggleSleepLogForm")?.addEventListener("click", () => {
      state.settings.sleepFormOpen = !state.settings.sleepFormOpen;
      saveAndRender();
    });

    $("#morningBriefBtn").addEventListener("click", () => {
      const today = Engine.ensureToday(state, roadmaps);
      const faculty = today.dailyFocus?.focus || today.currentFaculty || state.university.currentFaculty;
      const lesson = Engine.lessonForToday(state, roadmaps, faculty);
      const current = localBlock(Engine.getCurrentBlock());
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
        Engine.completeTrack(state, complete.dataset.complete);
        const task = complete.dataset.completeTask;
        if (task) {
          const day = Engine.dayState(state);
          delete day.tasks[complete.dataset.complete];
          day.tasks[task] = true;
        }
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
    renderNowNext();
    renderSchedule();
    renderSleepForm();
    renderLessons();
    renderChecklist();
    renderBriefReview();
    renderSleepOptimization();
    renderSleepIntelligence();
    renderSleepLogForm();
    renderNotificationStatus();
    renderPwaStatus();
    renderAppVersion();
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
    renderNowNext();
    renderSchedule();
  }, 60000);
})();
