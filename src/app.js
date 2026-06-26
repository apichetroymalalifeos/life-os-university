// Life OS 2.1 UI layer.
// It renders engine output into a static local page. No backend, no paid API,
// and no cloud dependency are required.
(function () {
  const Storage = window.LifeOSStorage;
  const Engine = window.LifeOSEngine;
  const roadmaps = window.LIFE_OS_ROADMAPS;
  let state = Storage.load();
  let pwaStatusMessage = "";

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
      todayStatus: "Today Status"
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
      todayStatus: "สถานะวันนี้"
    }
  };

  const BLOCK_I18N = {
    th: {
      morning: ["Morning Reset", "ดื่มน้ำ รับแดด ยืดเหยียด และทำสมาธิ", "น้ำ แสงแดด ยืดเหยียด สมาธิ"],
      university: ["Life OS University", "สร้าง Teach Me prompt แล้วให้ ChatGPT เป็นผู้สอน", "Life OS จำความคืบหน้า ส่วน ChatGPT สอน"],
      ai: ["เรียน AI", "ทำบทเรียน AI ของวันนี้ให้เสร็จ", "โฟกัส 30 นาทีเพื่อเพิ่มทักษะ AI"],
      workPrep: ["เตรียมงาน", "เตรียมเส้นทาง ตัวอย่างสินค้า และเป้าหมายลูกค้ารายแรก", "เปลี่ยนจากโหมดเรียนรู้เข้าสู่โหมดลงสนาม"],
      work: ["เริ่มงาน", "วางแผนเส้นทางและผลลัพธ์ที่ต้องการจากลูกค้า", "ทบทวนบัญชีลูกค้า ตัวอย่างสินค้า และ follow-up"],
      breathing: ["หายใจก่อนพบลูกค้า", "สงบใจ 2 นาทีก่อนเข้าพบลูกค้ารายแรก", "ลดความเครียดก่อนงานพบลูกค้า"],
      visits: ["เข้าพบลูกค้า", "พบลูกค้าและเก็บ pain point", "ใช้เวลาขับรถฟัง learning audio"],
      meal: ["มื้อแรก", "เปิด eating window ด้วยมื้อที่สะอาด", "โปรตีน ไฟเบอร์ คาร์บดี และน้ำ"],
      walk: ["เดินคุมกลูโคส", "เดิน 10-15 นาที", "ช่วยเรื่องน้ำตาล ความเครียด และการย่อย"],
      visits2: ["เข้าพบลูกค้า", "ปิดรอบเข้าพบและกำหนด next step", "ลูกค้ารายที่สองและสาม บันทึก notes"],
      familyPickup: ["ไปรับลูก", "รับลูกและปิดงานที่ค้างอย่างสงบ", "เปลี่ยนจากโหมดขายเข้าสู่โหมดครอบครัว"],
      workout: ["Workout", "ออกกำลังตาม recovery", "ขยับร่างกายระหว่างรอลูกซ้อมฟุตซอล"],
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
      title: "ไปรับลูกและใช้เวลาเชื่อมต่อ 20 นาที",
      goal: "ไปรับลูก สนับสนุนการซ้อมฟุตซอล แล้วให้ความสนใจเต็มที่โดยไม่ multitask",
      task: "ถามคำถามดี ๆ หนึ่งข้อเกี่ยวกับการซ้อม แล้วฟังโดยไม่เช็กมือถือ"
    };
  }

  function facultyLabel(faculty) {
    const labels = {
      ai: lang() === "th" ? "AI & Automation" : "AI & Automation",
      crypto: lang() === "th" ? "Crypto & Macro Investing" : "Crypto & Macro Investing",
      longevity: lang() === "th" ? "Longevity" : "Longevity",
      sales: lang() === "th" ? "Elite B2B Sales" : "Elite B2B Sales",
      psychology: lang() === "th" ? "Psychology & Decision Making" : "Psychology & Decision Making",
      future: lang() === "th" ? "Future Trends" : "Future Trends"
    };
    return labels[faculty] || faculty;
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
    const faculty = today.currentFaculty || state.university.currentFaculty || Engine.facultyForDate();
    const lesson = Engine.lessonForToday(state, roadmaps, faculty);
    const progress = state.progress[faculty];
    const notes = Engine.notesFor(state, faculty);
    const isDone = Boolean(Engine.dayState(state).tasks.university);
    const isSkipped = Boolean(Engine.dayState(state).skips[faculty]);
    $("#universityCard").innerHTML = `
      <div class="panel-title">${t("university")} <small>${t("day")} ${lesson.day} / 365</small></div>
      <div class="module-body">
        ${today.generateStatus ? `<div class="notice good">${today.generateStatus}</div>` : ""}
        <div class="lesson-meta">
          <span class="pill">${facultyLabel(faculty)}</span>
          <span class="pill">${lesson.stage}</span>
          <span class="pill">${lesson.estimatedMinutes} min</span>
          <span class="pill">${progress.completed} ${t("completed")}</span>
        </div>
        <h3>${lesson.title}</h3>
        <p>${t("lifeOsRemembers")}</p>
        <div class="field-grid">
          <div class="field"><span>${t("currentFaculty")}</span><b>${facultyLabel(faculty)}</b></div>
          <div class="field"><span>${t("lessonReference")}</span><p>${t("day")} ${lesson.day} - ${lesson.stage}</p></div>
          <div class="field"><span>${t("availableTime")}</span><p>${lesson.estimatedMinutes} min</p></div>
          <div class="field"><span>${t("nextAction")}</span><p>${lesson.nowWhat}</p></div>
          <div class="field"><span>${t("weakAreas")}</span><p>${state.university.weakAreas.join(", ") || "No data yet"}</p></div>
          <div class="field"><span>${t("strongAreas")}</span><p>${state.university.strongAreas.join(", ") || "No data yet"}</p></div>
        </div>
        <div class="notes-grid">
          <label>${t("what")}
            <textarea data-note="${faculty}:what">${notes.what || ""}</textarea>
          </label>
          <label>${t("soWhat")}
            <textarea data-note="${faculty}:soWhat">${notes.soWhat || ""}</textarea>
          </label>
          <label>${t("nowWhat")}
            <textarea data-note="${faculty}:nowWhat">${notes.nowWhat || ""}</textarea>
          </label>
        </div>
        <div class="lesson-actions">
          <button class="soft-btn" data-refresh="${faculty}" type="button">${t("refreshLesson")}</button>
          <button class="${isSkipped ? "danger-btn" : "ghost-btn"}" data-skip="${faculty}" type="button">${isSkipped ? t("skipped") : t("skip")}</button>
          <button class="primary-btn wide" data-complete="${faculty}" data-complete-task="university" type="button">${isDone ? t("completedButton") : t("complete")}</button>
        </div>
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
        <div class="button-row">
          <button class="primary-btn" id="teachMeBtn" type="button">🎓 ${t("teachMe")}</button>
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
            const progress = state.progress[faculty];
            const quiz = state.university.quizScores?.[faculty] ?? "-";
            return `<div class="field">
              <span>${facultyLabel(faculty)}</span>
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
    const lesson = Engine.lessonForToday(state, roadmaps, "sales");
    const isDone = Boolean(Engine.dayState(state).tasks.sales);
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
          <textarea id="meetingNotes">${Engine.notesFor(state, "sales").nowWhat || lesson.nowWhat}</textarea>
        </label>
        <div class="button-row">
          <button class="ghost-btn" id="meetingNotesBtn" type="button">${t("meetingNotes")}</button>
          <button class="primary-btn" data-complete="sales" type="button">${isDone ? t("completedButton") : t("complete")}</button>
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
      <div class="panel-title">${t("family")} <small>${t("after1600")}</small></div>
      <div class="module-body">
        <h3>${localFamilyMission().title}</h3>
        <p>${localFamilyMission().goal}</p>
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

  function localBrief(brief) {
    if (!brief || lang() !== "th") return brief;
    const today = Engine.ensureToday(state, roadmaps);
    const faculty = today.currentFaculty || state.university.currentFaculty;
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
    $("#teachMeCard")?.scrollIntoView({ behavior: "smooth", block: "start" });
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
      await navigator.serviceWorker.register("./service-worker.js");
      renderPwaStatus(t("pwaReady"));
    } catch {
      renderPwaStatus(t("pwaFileMode"));
    }
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

    $("#morningBriefBtn").addEventListener("click", () => {
      const today = Engine.ensureToday(state, roadmaps);
      const faculty = today.currentFaculty || state.university.currentFaculty;
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

    document.addEventListener("click", async event => {
      const teach = event.target.closest("#teachMeBtn");
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
        const track = refresh.dataset.refresh;
        const today = Engine.dayState(state);
        today.lessonRefs ||= {};
        const day = Math.min(365, state.progress[track].day + 1);
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
        Engine.notesFor(state, track)[field] = target.value;
        Storage.save(state);
      }

      if (target.id === "meetingNotes") {
        Engine.notesFor(state, "sales").nowWhat = target.value;
        Storage.save(state);
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
    renderNotificationStatus();
    renderPwaStatus();
    Storage.save(state);
  }

  bindEvents();
  renderAll();
  registerServiceWorker();
  setInterval(() => {
    renderTime();
    renderTopCommand();
    renderNowNext();
    renderSchedule();
  }, 60000);
})();
