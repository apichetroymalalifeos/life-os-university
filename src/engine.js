// Life OS decision engine.
// This file owns scheduling, roadmap advancement, recovery logic, streaks,
// and progress calculations. Rendering lives in app.js.
(function () {
  const FACULTIES = ["ai_automation", "crypto_macro", "longevity_health", "elite_b2b_sales", "psychology_decision", "future_trends"];
  const LEGACY_FACULTY_MAP = {
    ai: "ai_automation",
    crypto: "crypto_macro",
    longevity: "longevity_health",
    sales: "elite_b2b_sales",
    psychology: "psychology_decision",
    future: "future_trends"
  };
  const TRACKS = [...FACULTIES, "workout"];
  const REQUIRED_TASKS = ["university", "sales", "workout", "family", "morning", "night"];
  const FACULTY_ROTATION = {
    0: { focus: "future_trends", reviews: ["ai_automation", "crypto_macro"] },
    1: { focus: "ai_automation", reviews: ["crypto_macro", "longevity_health"] },
    2: { focus: "elite_b2b_sales", reviews: ["ai_automation", "psychology_decision"] },
    3: { focus: "crypto_macro", reviews: ["future_trends", "ai_automation"] },
    4: { focus: "longevity_health", reviews: ["psychology_decision", "elite_b2b_sales"] },
    5: { focus: "psychology_decision", reviews: ["elite_b2b_sales", "future_trends"] },
    6: { focus: "future_trends", reviews: ["ai_automation", "crypto_macro"] }
  };
  const FACULTY_LABELS = {
    ai_automation: "AI & Automation",
    crypto_macro: "Crypto & Macro Investing",
    longevity_health: "Longevity & Health",
    elite_b2b_sales: "Elite B2B Sales",
    psychology_decision: "Psychology & Decision Making",
    future_trends: "Future Trends"
  };
  const FACULTY_ICONS = {
    ai_automation: "🤖",
    crypto_macro: "💰",
    longevity_health: "🧬",
    elite_b2b_sales: "💼",
    psychology_decision: "🧠",
    future_trends: "🌍"
  };
  const TIME_PLANS = {
    15: { focus: 15, reviews: [], action: 0, label: "Focus only" },
    25: { focus: 25, reviews: [], action: 0, label: "Short morning mode" },
    30: { focus: 25, reviews: [5], action: 0, label: "Focus + one review" },
    45: { focus: 35, reviews: [5, 5], action: 0, label: "Focus + two reviews" },
    60: { focus: 40, reviews: [5, 5], action: 10, label: "Deep focus + reviews + action plan" }
  };

  const schedule = [
    { start: "05:30", end: "05:45", id: "wake", title: "Wake + Hydrate", mission: "Wake up, drink water, light exposure if available.", detail: "Start gently. Protect sleep consistency and recovery." },
    { start: "05:45", end: "05:55", id: "mobility", title: "10-minute Mobility", mission: "Do light mobility or stretching for 10 minutes.", detail: "Move joints, breathe calmly, keep it easy." },
    { start: "05:55", end: "06:00", id: "leavePrep", title: "Prepare to Leave", mission: "Prepare to leave home for school drop-off.", detail: "Keys, bag, route, calm transition." },
    { start: "06:00", end: "06:45", id: "schoolDropoff", title: "School Drop-off", mission: "ส่งลูกชายไปโรงเรียน — ขับรถปลอดภัย ไม่ต้องเรียน ไม่ต้องดูจอ", detail: "Driving block: no reading, no typing, no charts. Focus only on safe driving." },
    { start: "06:45", end: "07:00", id: "postDriveReset", title: "Post-drive Reset", mission: "Reset หลังขับรถ: หายใจ 2 นาที + ดื่มน้ำ", detail: "Water, 2-minute breathing, calm transition." },
    { start: "07:00", end: "07:25", id: "university", title: "AI & Automation Short Learning", mission: "Short, listening-friendly AI learning with one practical action.", detail: "20-25 minutes. No long reading. Use ChatGPT after safe parking or at home." },
    { start: "07:25", end: "08:00", id: "personalPrep", title: "Shower + Dress", mission: "Shower, dress, and prepare for work.", detail: "Prepare samples, clothes, and work essentials without rushing." },
    { start: "08:00", end: "08:30", id: "commute", title: "Commute / Work Transition", mission: "Commute or transition into work mode safely.", detail: "Driving block if on the road: audio-safe only." },
    { start: "08:30", end: "09:50", id: "work", title: "Work Start", mission: "Plan route and customer outcomes.", detail: "Review accounts, samples, and follow-up commitments." },
    { start: "09:50", end: "10:00", id: "breathing", title: "Pre-customer Breathing", mission: "Two minutes of calm before the first visit.", detail: "Lower stress before customer-facing work." },
    { start: "10:00", end: "12:00", id: "visits", title: "Field Sales Driving", mission: "Visit customers and capture pain points. Use only audio-safe actions while driving.", detail: "Driving block: no reading, no typing, no charts while moving." },
    { start: "12:00", end: "13:00", id: "meal", title: "First Meal", mission: "Open eating window with a clean meal.", detail: "Protein, fiber, clean carbs, hydrate." },
    { start: "13:00", end: "13:15", id: "walk", title: "Glucose Walk", mission: "Walk 10-15 minutes.", detail: "Support glucose control, stress, and digestion." },
    { start: "13:15", end: "16:00", id: "visits2", title: "Field Sales Driving", mission: "Finish visits and define next steps. Use only audio-safe actions while driving.", detail: "Driving block: no reading, no typing, no charts while moving." },
    { start: "16:00", end: "18:00", id: "familyPickup", title: "Pick up Son / Travel", mission: "Pick up son and travel safely. Family first; no screen while driving.", detail: "Driving block: no reading, no typing, no charts while moving." },
    { start: "18:00", end: "18:15", id: "workout", title: "Recovery Movement", mission: "Move gently only if safely parked and energy is good.", detail: "Short walk, mobility, or breathing before dinner." },
    { start: "18:15", end: "19:00", id: "dinner", title: "Dinner", mission: "Eat dinner and close eating window.", detail: "Family presence. No grazing after 19:00." },
    { start: "19:00", end: "20:00", id: "family", title: "Family Mission", mission: "Spend intentional time together.", detail: "Be present and reduce phone use." },
    { start: "20:00", end: "20:30", id: "reflection", title: "Reflection / Learning", mission: "Review notes, quiz score, and tomorrow preview.", detail: "Life OS stores memory. ChatGPT handles explanation." },
    { start: "20:30", end: "22:00", id: "night", title: "Wind-down", mission: "Run night review and protect sleep.", detail: "Low light, prepare tomorrow, no hard stimulation." },
    { start: "22:00", end: "05:30", id: "sleep", title: "Sleep", mission: "Sleep. This is the main recovery block.", detail: "Protect recovery, liver health, hormones, and longevity." }
  ];

  const customers = [
    {
      name: "Hospitality project buyer",
      painPoint: "Needs durable leather look across high-traffic seating without constant maintenance.",
      hook: "Lead with lifecycle cost: premium material reduces replacement anxiety.",
      closingObjective: "Secure sample approval and confirm rollout quantity."
    },
    {
      name: "Interior designer / architect",
      painPoint: "Needs confidence that color, texture, and delivery match the design intent.",
      hook: "Present swatches as a specification decision, not a commodity choice.",
      closingObjective: "Get the material written into the spec or shortlist."
    },
    {
      name: "Marine refit account",
      painPoint: "Worries about humidity, cleaning, UV exposure, and long-term appearance.",
      hook: "Frame genuine vs synthetic tradeoffs around environment and maintenance.",
      closingObjective: "Book a technical sample review with the decision maker."
    },
    {
      name: "Aviation upholstery lead",
      painPoint: "Needs premium cabin feel with trust in documentation and delivery discipline.",
      hook: "Sell confidence, traceability, and finish quality before price.",
      closingObjective: "Confirm decision criteria and next documentation request."
    }
  ];

  function dateKey(date = new Date()) {
    return date.toISOString().slice(0, 10);
  }

  function toMinutes(time) {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  }

  function minutesNow(date = new Date()) {
    return date.getHours() * 60 + date.getMinutes();
  }

  function isInsideBlock(block, minute) {
    const start = toMinutes(block.start);
    const end = toMinutes(block.end);
    return start < end ? minute >= start && minute < end : minute >= start || minute < end;
  }

  function minutesUntil(startTime, minute) {
    const start = toMinutes(startTime);
    return start >= minute ? start - minute : start + 1440 - minute;
  }

  function getCurrentBlock(date = new Date()) {
    const minute = minutesNow(date);
    return schedule.find(block => isInsideBlock(block, minute)) || schedule[0];
  }

  function getNextBlock(date = new Date()) {
    const minute = minutesNow(date);
    return schedule
      .map(block => ({ ...block, wait: minutesUntil(block.start, minute) }))
      .filter(block => block.wait > 0)
      .sort((a, b) => a.wait - b.wait)[0] || schedule[0];
  }

  function getNextThirty(date = new Date()) {
    const minute = minutesNow(date);
    return schedule
      .map(block => ({ ...block, wait: minutesUntil(block.start, minute) }))
      .filter(block => block.wait > 0 && block.wait <= 30)
      .sort((a, b) => a.wait - b.wait)[0] || getCurrentBlock(date);
  }

  function countdownToNext(date = new Date()) {
    const next = getNextBlock(date);
    const wait = minutesUntil(next.start, minutesNow(date));
    if (wait >= 60) return `${Math.floor(wait / 60)}h ${wait % 60}m`;
    return `${wait}m`;
  }

  function dayState(state, date = new Date()) {
    const key = dateKey(date);
    state.days[key] ||= { generatedAt: null, lessonRefs: {}, tasks: {}, skips: {}, checklist: {}, brief: "", review: "", teachPrompt: "" };
    // Migration from Life OS 2.1: keep only lesson references in long-term state.
    if (state.days[key].lessons) {
      state.days[key].lessonRefs ||= {};
      Object.entries(state.days[key].lessons).forEach(([track, lesson]) => {
        if (lesson?.day) state.days[key].lessonRefs[track] = { track, day: lesson.day };
      });
      delete state.days[key].lessons;
    }
    return state.days[key];
  }

  function normalizeFacultyId(track) {
    return LEGACY_FACULTY_MAP[track] || track;
  }

  function progressFor(state, track) {
    const id = normalizeFacultyId(track);
    state.progress[id] = normalizeProgressState(state.progress[id] || state.progress[track] || {});
    return state.progress[id];
  }

  function normalizeProgressState(progress) {
    const currentDay = Number(progress.currentDay || progress.day || 1);
    progress.currentDay = Math.max(1, Math.min(365, currentDay));
    progress.day = progress.currentDay;
    progress.completedDays = Array.isArray(progress.completedDays) ? progress.completedDays.map(Number).filter(Boolean) : [];
    progress.skippedDays = Array.isArray(progress.skippedDays) ? progress.skippedDays.map(Number).filter(Boolean) : [];
    progress.completed = Math.max(Number(progress.completed || 0), progress.completedDays.length);
    progress.skipped = Math.max(Number(progress.skipped || 0), progress.skippedDays.length);
    progress.lastCompletedDate ||= null;
    progress.streak = Number(progress.streak || 0);
    progress.bestStreak = Number(progress.bestStreak || 0);
    while (progress.completedDays.includes(progress.currentDay) && progress.currentDay < 365) {
      progress.currentDay += 1;
      progress.day = progress.currentDay;
    }
    return progress;
  }

  function nextIncompleteDay(progress) {
    let day = Math.max(1, Number(progress.currentDay || progress.day || 1));
    while (progress.completedDays?.includes(day) && day < 365) day += 1;
    return day;
  }

  function roadmapError(track) {
    return `ข้อมูล Roadmap ของคณะ ${FACULTY_LABELS[track] || track} (${track}) ไม่ครบ กรุณาตรวจไฟล์ roadmap metadata`;
  }

  function getLesson(roadmaps, track, day) {
    const id = normalizeFacultyId(track);
    const lessons = roadmaps[id]?.lessons;
    if (!Array.isArray(lessons) || lessons.length < 30) {
      return {
        facultyId: id,
        day: day || 1,
        title: roadmapError(id),
        category: "Roadmap error",
        estimatedMinutes: 0,
        learningGoal: roadmapError(id),
        keywords: [],
        recommendedSourceTypes: [],
        missingRoadmap: true
      };
    }
    return lessons[Math.max(0, Math.min(lessons.length - 1, day - 1))];
  }

  function nextActionForFaculty(faculty, lesson) {
    if (lesson.missingRoadmap) return roadmapError(faculty);
    return {
      ai_automation: `ให้ ChatGPT สอนเรื่อง "${lesson.title}" แล้วสร้างหนึ่ง workflow ที่ใช้ได้จริง`,
      crypto_macro: `ให้ ChatGPT อัปเดตข้อมูลล่าสุดของ "${lesson.title}" แล้วจดหนึ่ง risk rule โดยไม่ตัดสินใจเทรด`,
      longevity_health: `ให้ ChatGPT สอน "${lesson.title}" แบบ general education และแยก medical advice ให้ชัด`,
      elite_b2b_sales: `นำ "${lesson.title}" ไปใช้กับบทสนทนาลูกค้าหรือ follow-up ถัดไป`,
      psychology_decision: `ใช้ "${lesson.title}" วิเคราะห์หนึ่ง decision วันนี้`,
      future_trends: `ให้ ChatGPT ตรวจข้อมูลล่าสุดของ "${lesson.title}" แล้วสรุป implication หนึ่งข้อ`,
      workout: `ใช้ "${lesson.title}" เป็นแนวทาง movement โดยปรับตาม recovery`
    }[faculty] || `เริ่มเรียน "${lesson.title}" กับ ChatGPT`;
  }

  function lessonForToday(state, roadmaps, track, date = new Date()) {
    const today = dayState(state, date);
    const id = normalizeFacultyId(track);
    const ref = today.lessonRefs?.[id] || { track: id, day: progressFor(state, id).day };
    return getLesson(roadmaps, id, ref.day);
  }

  function facultyForDate(date = new Date()) {
    return dailyFocusPlan(date).focus;
  }

  function dailyFocusPlan(date = new Date()) {
    const rule = FACULTY_ROTATION[date.getDay()] || FACULTY_ROTATION[1];
    const reviews = rule.reviews.slice(0, 2);
    const optional = FACULTIES.filter(faculty => faculty !== rule.focus && !reviews.includes(faculty));
    return { focus: rule.focus, reviews, optional, all: [rule.focus, ...reviews, ...optional] };
  }

  function statusForFaculty(today, faculty, date = new Date()) {
    const plan = today.dailyFocus || dailyFocusPlan(date);
    if (today.tasks?.[faculty]) return "completed";
    if (today.skips?.[faculty]) return "skipped";
    if (faculty === plan.focus) return "focus";
    if (plan.reviews.includes(faculty)) return "review";
    return "optional";
  }

  function minutesForFaculty(today, faculty) {
    const planMinutes = Number(today.availableMinutes || 45);
    const timePlan = TIME_PLANS[planMinutes] || TIME_PLANS[45];
    const daily = today.dailyFocus || { focus: faculty, reviews: [] };
    if (faculty === daily.focus) return timePlan.focus;
    const reviewIndex = daily.reviews.indexOf(faculty);
    if (reviewIndex >= 0) return timePlan.reviews[reviewIndex] || 0;
    return 0;
  }

  function facultyCardsForToday(state, roadmaps, date = new Date()) {
    const today = dayState(state, date);
    const plan = today.dailyFocus || dailyFocusPlan(date);
    return plan.all.map(faculty => {
      const lesson = lessonForToday(state, roadmaps, faculty, date);
      const progress = progressFor(state, faculty);
      return {
        faculty,
        icon: FACULTY_ICONS[faculty],
        name: FACULTY_LABELS[faculty],
        status: statusForFaculty(today, faculty, date),
        day: lesson.day,
        lesson,
        progress,
        estimatedMinutes: minutesForFaculty(today, faculty),
        nextAction: nextActionForFaculty(faculty, lesson),
        error: lesson.missingRoadmap ? roadmapError(faculty) : ""
      };
    });
  }

  function recoveryScore(state) {
    const sleep = state.sleep || {};
    const hours = Number(sleep.hours);
    const deep = Number(sleep.deep);
    const rem = Number(sleep.rem);
    const wakes = Number(sleep.wakes);
    if (!hours && !deep && !rem && !wakes) return null;
    let score = 4;
    score += Math.min(hours, 8) * 0.45;
    score += Math.min(deep, 25) * 0.045;
    score += Math.min(rem, 25) * 0.035;
    score -= wakes * 0.45;
    return Math.max(1, Math.min(10, score));
  }

  function recoveryStatus(state) {
    const score = recoveryScore(state);
    const override = state.settings?.workoutOverride || "auto";
    if (score === null) return { level: "unknown", label: "Log sleep", score: null, workoutType: "Moderate Workout" };
    if (override !== "auto") return { level: override, label: `${capitalize(override)} override`, score, workoutType: workoutTypeForLevel(override) };
    if (score >= 7.5) return { level: "high", label: "High recovery", score, workoutType: "Strength" };
    if (score >= 6.2) return { level: "medium", label: "Medium recovery", score, workoutType: "Moderate Workout" };
    return { level: "poor", label: "Poor recovery", score, workoutType: "Mobility + Walking" };
  }

  function workoutTypeForLevel(level) {
    return { high: "Strength", medium: "Moderate Workout", poor: "Mobility + Walking" }[level] || "Moderate Workout";
  }

  function capitalize(value) {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  function generateToday(state, roadmaps, date = new Date()) {
    const today = dayState(state, date);
    const recovery = recoveryStatus(state);
    const customer = customers[date.getDay() % customers.length];
    const plan = dailyFocusPlan(date);
    const faculty = plan.focus;
    today.generatedAt = new Date().toISOString();
    today.customer = customer;
    today.currentFaculty = faculty;
    today.dailyFocus = plan;
    today.availableMinutes ||= 25;
    state.university.currentFaculty = faculty;
    today.lessonRefs ||= {};

    FACULTIES.forEach(track => {
      today.lessonRefs[track] = { track, day: progressFor(state, track).day };
    });
    today.lessonRefs.workout = { track: "workout", day: progressFor(state, "workout").day };

    today.workout = workoutPlan(lessonForToday(state, roadmaps, "workout", date), recovery);
    today.familyMission = {
      title: "Morning school drop-off + evening family presence",
      goal: "ส่งลูกชายไปโรงเรียนตอนเช้า และรับลูกชาย/ใช้เวลาคุณภาพตอนเย็น",
      task: "เช้า: ส่งลูกชายไปโรงเรียนอย่างปลอดภัย · เย็น: รับลูกชายและใช้เวลาคุณภาพ 15–20 นาที"
    };
    state.generatedDate = dateKey(date);
    return today;
  }

  function ensureToday(state, roadmaps, date = new Date()) {
    const today = dayState(state, date);
    if (state.generatedDate !== dateKey(date) || !today.generatedAt) {
      return generateToday(state, roadmaps, date);
    }
    today.dailyFocus ||= dailyFocusPlan(date);
    today.availableMinutes ||= 25;
    FACULTIES.forEach(track => {
      today.lessonRefs ||= {};
      today.lessonRefs[track] ||= { track, day: progressFor(state, track).day };
    });
    updateWorkout(state, roadmaps, date);
    return today;
  }

  function updateWorkout(state, roadmaps, date = new Date()) {
    const today = dayState(state, date);
    today.lessonRefs ||= {};
    today.lessonRefs.workout ||= { track: "workout", day: state.progress.workout.day };
    const lesson = lessonForToday(state, roadmaps, "workout", date);
    today.workout = workoutPlan(lesson, recoveryStatus(state));
    return today.workout;
  }

  function workoutPlan(workoutLesson, recovery) {
    const plans = {
      high: {
        type: "Strength",
        duration: "30 min",
        reason: "Recovery is high enough for controlled strength work.",
        task: "Upper body push-pull, easy core, stop with 2 reps in reserve."
      },
      medium: {
        type: "Zone2 + Mobility",
        duration: "25 min",
        reason: "Recovery is workable, but keep intensity moderate.",
        task: "Brisk walk or easy bike, then hips and thoracic mobility."
      },
      poor: {
        type: "Recovery Walk",
        duration: "15-20 min",
        reason: "Poor sleep rule: no hard training; protect liver recovery and stress.",
        task: "Easy walk, nasal breathing, light stretching only."
      },
      unknown: {
        type: "Moderate Workout",
        duration: "20-30 min",
        reason: "Log sleep to personalize intensity. Default is conservative.",
        task: "Walk, mobility, or easy bodyweight work."
      }
    };
    return plans[recovery.level] || plans.unknown;
  }

  function completeTrack(state, track, date = new Date()) {
    track = normalizeFacultyId(track);
    const today = dayState(state, date);
    today.tasks[track] = true;
    if (TRACKS.includes(track) && !today.advanced?.[track]) {
      today.advanced ||= {};
      today.advanced[track] = true;
      const completedLessonDay = today.lessonRefs?.[track]?.day || progressFor(state, track).day;
      const progress = progressFor(state, track);
      if (!progress.completedDays.includes(completedLessonDay)) {
        progress.completedDays.push(completedLessonDay);
        progress.completedDays.sort((a, b) => a - b);
      }
      progress.completed = progress.completedDays.length;
      progress.currentDay = Math.min(365, nextIncompleteDay({ ...progress, currentDay: completedLessonDay + 1 }));
      progress.day = progress.currentDay;
      const previousDate = progress.lastCompletedDate;
      const yesterday = new Date(date);
      yesterday.setDate(date.getDate() - 1);
      progress.streak = previousDate === dateKey(yesterday) ? Number(progress.streak || 0) + 1 : 1;
      progress.bestStreak = Math.max(Number(progress.bestStreak || 0), progress.streak);
      progress.lastCompletedDate = dateKey(date);
      if (FACULTIES.includes(track)) {
        state.university.history.push({ date: dateKey(date), faculty: track, day: completedLessonDay, completed: true });
        if (today.dailyFocus?.focus === track) today.tasks.university = true;
      }
    }
    updateStreaks(state, date);
  }

  function skipTrack(state, track, date = new Date()) {
    track = normalizeFacultyId(track);
    const today = dayState(state, date);
    today.skips[track] = true;
    today.tasks[track] = false;
    if (TRACKS.includes(track)) {
      const progress = progressFor(state, track);
      const skippedLessonDay = today.lessonRefs?.[track]?.day || progress.currentDay;
      if (!progress.skippedDays.includes(skippedLessonDay)) progress.skippedDays.push(skippedLessonDay);
      progress.skippedDays.sort((a, b) => a - b);
      progress.skipped = progress.skippedDays.length;
    }
    updateStreaks(state, date);
  }

  function repairProgress(state) {
    TRACKS.forEach(track => {
      const progress = progressFor(state, track);
      progress.currentDay ||= progress.day || 1;
      progress.currentDay = nextIncompleteDay(progress);
      progress.day = progress.currentDay;
      progress.completed = progress.completedDays.length;
      progress.skipped = progress.skippedDays.length;
    });
    return state.progress;
  }

  function toggleTask(state, task, date = new Date()) {
    const today = dayState(state, date);
    today.tasks[task] = !today.tasks[task];
    updateStreaks(state, date);
  }

  function dailyScore(state, date = new Date()) {
    const today = dayState(state, date);
    const complete = REQUIRED_TASKS.filter(task => today.tasks[task]).length;
    return {
      complete,
      total: REQUIRED_TASKS.length,
      percent: Math.round((complete / REQUIRED_TASKS.length) * 100)
    };
  }

  function weeklyScore(state, date = new Date()) {
    let complete = 0;
    let total = 0;
    for (let offset = 0; offset < 7; offset++) {
      const d = new Date(date);
      d.setDate(date.getDate() - offset);
      const day = state.days[dateKey(d)];
      if (!day) continue;
      total += REQUIRED_TASKS.length;
      complete += REQUIRED_TASKS.filter(task => day.tasks?.[task]).length;
    }
    return { complete, total, percent: total ? Math.round((complete / total) * 100) : 0 };
  }

  function latestSleepLog(state) {
    const logs = Array.isArray(state.sleepLogs) ? state.sleepLogs : [];
    return logs
      .filter(log => log?.date)
      .slice()
      .sort((a, b) => String(a.date).localeCompare(String(b.date)))
      .at(-1) || null;
  }

  function sleepScoreForExecutive(state) {
    const latest = latestSleepLog(state);
    if (latest?.sleep_score) return Math.max(0, Math.min(100, Number(latest.sleep_score)));
    const recovery = recoveryScore(state);
    return recovery === null ? 60 : Math.round(recovery * 10);
  }

  function executiveScoreTrend(state, date = new Date()) {
    const scores = state.executive?.scores || {};
    const keyToday = dateKey(date);
    const scoreOn = days => {
      const values = [];
      for (let offset = 0; offset < days; offset++) {
        const d = new Date(date);
        d.setDate(date.getDate() - offset);
        const item = scores[dateKey(d)];
        if (item?.score !== undefined) values.push(Number(item.score));
      }
      const average = values.length ? Math.round(values.reduce((sum, value) => sum + value, 0) / values.length) : Number(scores[keyToday]?.score || 0);
      return { days, average, count: values.length };
    };
    const trend7 = scoreOn(7);
    const trend30 = scoreOn(30);
    const trend90 = scoreOn(90);
    return { seven: trend7, thirty: trend30, ninety: trend90 };
  }

  function priorityWeight(status) {
    return {
      "meeting today": 100,
      "follow-up required": 85,
      "waiting quotation": 75,
      "waiting payment": 70,
      "research": 45
    }[String(status || "").toLowerCase()] || 50;
  }

  function salesPipelineForExecutive(state, today) {
    const pipeline = Array.isArray(state.executive?.salesPipeline) && state.executive.salesPipeline.length
      ? state.executive.salesPipeline
      : [];
    const current = today.customer ? {
      name: today.customer.name,
      status: "meeting today",
      priority: "high",
      preparationStatus: "route and sample objective ready",
      followUpRequired: true
    } : null;
    const merged = current
      ? [current, ...pipeline.filter(customer => customer.name !== current.name)]
      : pipeline.slice();
    const ranked = merged
      .map(customer => ({
        ...customer,
        priorityScore: priorityWeight(customer.status) + (customer.priority === "high" ? 12 : customer.priority === "medium" ? 6 : 0) + (customer.followUpRequired ? 8 : 0)
      }))
      .sort((a, b) => b.priorityScore - a.priorityScore);
    return ranked.slice(0, 4);
  }

  function sourceStatus(value, allowedStatuses = ["Real", "Manual", "Missing"]) {
    return allowedStatuses.includes(value) ? value : "Missing";
  }

  function executiveDataQuality(state, today) {
    const latest = latestSleepLog(state);
    const hasManualSleepInputs = Boolean(state.sleep && (state.sleep.hours || state.sleep.deep || state.sleep.rem || state.sleep.wakes));
    const salesPipeline = Array.isArray(state.executive?.salesPipeline) ? state.executive.salesPipeline : [];
    const finance = state.executive?.finance || {};
    const hasFinanceData = Boolean(finance.portfolioGoal || finance.monthlyDcaTarget || finance.monthlyDcaProgress || finance.riskLevel);
    const workoutHasData = Boolean(today.workout || hasManualSleepInputs || latest);
    const sleepStatus = latest
      ? (String(latest.source || "").includes("manual") ? "Manual" : "Real")
      : hasManualSleepInputs
        ? "Manual"
        : "Missing";
    const salesStatus = salesPipeline.length || today.customer ? "Manual" : "Missing";
    const financeStatus = hasFinanceData ? "Manual" : "Missing";
    const workoutStatus = workoutHasData ? "Manual" : "Missing";
    const items = {
      sleep: { label: "Sleep data", status: sourceStatus(sleepStatus), key: true },
      sales: { label: "Sales data", status: sourceStatus(salesStatus), key: true },
      finance: { label: "Finance data", status: sourceStatus(financeStatus, ["Manual", "Missing"]), key: true },
      learning: { label: "Learning data", status: "Real", key: false },
      workout: { label: "Workout data", status: sourceStatus(workoutStatus, ["Manual", "Missing"]), key: true }
    };
    const missing = Object.entries(items).filter(([, item]) => item.status === "Missing").map(([key, item]) => ({ key, label: item.label }));
    const keyMissing = Object.entries(items).filter(([, item]) => item.key && item.status === "Missing").map(([key, item]) => ({ key, label: item.label }));
    const confidence = keyMissing.length >= 2 ? "Low" : keyMissing.length === 1 ? "Medium" : "High";
    return {
      items,
      missing,
      keyMissing,
      confidence,
      summary: Object.values(items).map(item => `${item.label}: ${item.status}`).join(" · ")
    };
  }

  function capConfidence(base, dataQuality, keys = []) {
    const hasMissingKey = keys.some(key => dataQuality.items[key]?.status === "Missing");
    if (dataQuality.confidence === "Low") return "Low";
    if (hasMissingKey || dataQuality.confidence === "Medium") return base === "Low" ? "Low" : "Medium";
    return base;
  }

  function dueDecisionReviews(state, date = new Date()) {
    const todayKey = dateKey(date);
    return (state.executive?.decisions || [])
      .filter(decision => decision.reviewDate && decision.reviewDate <= todayKey)
      .sort((a, b) => String(a.reviewDate).localeCompare(String(b.reviewDate)));
  }

  function buildDecisionRadar(state, briefParts, date = new Date()) {
    const today = dayState(state, date);
    const latest = latestSleepLog(state);
    const recovery = recoveryStatus(state);
    const warnings = [];
    const dataQuality = executiveDataQuality(state, today);
    const add = (level, title, why, dataUsed, confidence = "Medium") => warnings.push({ level, title, why, dataUsed, confidence });

    dataQuality.keyMissing.forEach(item => {
      add("orange", `${item.label} Missing`, `${item.label} ยังไม่ครบ จึงลด confidence ของ Executive Brief วันนี้`, ["Data Quality"], "High");
    });

    if (latest && Number(latest.total_sleep_minutes) < Number(latest.target_sleep_minutes || 450)) {
      const diff = Number(latest.target_sleep_minutes || 450) - Number(latest.total_sleep_minutes);
      add(diff > 90 ? "orange" : "yellow", "Missed Sleep", `นอนขาดเป้าหมาย ${Math.max(0, diff)} นาที จึงควรลด load ที่ไม่จำเป็น`, ["Sleep"], "High");
    }
    if (recovery.level === "poor") add("orange", "Low Recovery", "Recovery ต่ำ ระบบจึงไม่แนะนำ hard training", ["Sleep", "Recovery"], "High");
    if (today.skips && Object.keys(today.skips).length) add("yellow", "Skipped Learning", "มีบทเรียนที่ถูกข้าม ควรรักษา currentDay เดิมและเรียนซ้ำเมื่อพร้อม", ["Learning Progress"], "High");
    if (!today.tasks?.workout) add("yellow", "No Exercise Yet", "ยังไม่ mark workout วันนี้ ให้เลือก movement ที่เข้ากับ recovery", ["Workout History", "Tasks"], "Medium");
    if (!today.tasks?.university) add("yellow", "Learning Not Closed", "ยังไม่ปิด learning loop วันนี้ บทเรียนสั้น 20–25 นาทีพอ", ["Learning Progress"], "Medium");
    add("yellow", "Overloaded Field Window", "ช่วง 10:00–16:00 เป็น customer visit/driving block ยาว ต้องลดงานอ่านและพิมพ์ระหว่างทาง", ["Schedule"], "High");
    if (latest?.habits?.work_stress_after_21) add("orange", "High Stress After 21:00", "มี stress/work หลัง 21:00 ใน sleep log ล่าสุด อาจกระทบ REM และ consistency", ["Sleep Habits"], "Medium");

    return warnings.slice(0, 5);
  }

  function buildOpportunityRadar(state, roadmaps, date = new Date()) {
    const today = ensureToday(state, roadmaps, date);
    const plan = today.dailyFocus || dailyFocusPlan(date);
    const focusLesson = lessonForToday(state, roadmaps, plan.focus, date);
    const opportunities = [
      {
        title: `Finish ${FACULTY_LABELS[plan.focus]} Day ${focusLesson.day}`,
        benefit: "สะสม compound skill และทำให้ roadmap เดินต่อพรุ่งนี้",
        why: "บทเรียน focus คือ leverage สูงสุดของ learning system วันนี้",
        dataUsed: ["Learning Progress", "Roadmap Metadata"],
        confidence: "High"
      },
      {
        title: "Follow-up top customer",
        benefit: "เพิ่มโอกาสปิด next step โดยใช้เวลาน้อยกว่า prospect ใหม่",
        why: "ลูกค้าที่มี meeting/follow-up วันนี้มี priority สูงกว่า backlog ทั่วไป",
        dataUsed: ["Sales Pipeline", "Today Customer"],
        confidence: "Medium"
      },
      {
        title: "Walk after lunch",
        benefit: "ช่วย glucose control, stress และพลังช่วงบ่าย",
        why: "ตารางมี 13:00 walk block อยู่แล้วและไม่กระทบงานขาย",
        dataUsed: ["Schedule", "Health Goal"],
        confidence: "High"
      },
      {
        title: "Sleep 10–15 minutes earlier",
        benefit: "ลด sleep debt โดยไม่ทำให้ circadian rhythm แกว่ง",
        why: "เป้าหมายหลักคือ consistency 22:00–05:30",
        dataUsed: ["Sleep", "Recovery"],
        confidence: "High"
      },
      {
        title: "Update CRM after parking",
        benefit: "ลดการลืม pain point และทำให้ follow-up ชัดขึ้น",
        why: "วันนี้มี field sales driving block จึงต้องบันทึกหลังจอดเท่านั้น",
        dataUsed: ["Schedule", "Sales Notes"],
        confidence: "Medium"
      },
      {
        title: "Review crypto thesis without trading action",
        benefit: "เพิ่มคุณภาพการตัดสินใจระยะยาวโดยไม่เพิ่ม impulsive risk",
        why: "Finance engine ทำหน้าที่เตือนให้ review เท่านั้น ไม่สั่งซื้อขาย",
        dataUsed: ["Finance Settings", "Roadmap Metadata"],
        confidence: "Medium"
      }
    ];
    return opportunities.slice(0, 4);
  }

  function buildExecutivePriorities(parts) {
    const priorities = [];
    if (parts.health.recommendation.includes("Recovery") || parts.health.recommendation.includes("Mobility") || parts.health.recommendation.includes("Rest")) {
      priorities.push({
        title: parts.health.recommendation,
        why: parts.health.why,
        expectedImpact: "ปกป้องพลังงาน งาน AE และการฟื้นตัวระยะยาว",
        estimatedTime: parts.health.estimatedTime || "15–30 min"
      });
    }
    priorities.push({
      title: `Sales: ${parts.sales.topCustomer.name}`,
      why: parts.sales.why,
      expectedImpact: "เพิ่มความชัดเจนของ next step และลดงานค้าง",
      estimatedTime: "10–20 min prep/follow-up"
    });
    priorities.push({
      title: `Learn: ${parts.learning.focusFacultyName}`,
      why: parts.learning.why,
      expectedImpact: "เดินหน้า skill ที่สำคัญที่สุดของวันนี้",
      estimatedTime: `${parts.learning.estimatedMinutes} min`
    });
    priorities.push({
      title: "Family mission",
      why: parts.family.why,
      expectedImpact: "รักษาคุณภาพครอบครัวและลด stress load ตอนเย็น",
      estimatedTime: "15–20 min quality time"
    });
    return priorities.slice(0, 3);
  }

  function buildExecutiveBrief(state, roadmaps, date = new Date()) {
    const today = ensureToday(state, roadmaps, date);
    state.executive ||= { scores: {}, reflections: {}, decisions: [], finance: {}, salesPipeline: [] };
    state.executive.scores ||= {};
    state.executive.reflections ||= {};
    state.executive.decisions ||= [];

    const daily = dailyScore(state, date);
    const recovery = recoveryStatus(state);
    const sleepScore = sleepScoreForExecutive(state);
    const latest = latestSleepLog(state);
    const plan = today.dailyFocus || dailyFocusPlan(date);
    const cards = facultyCardsForToday(state, roadmaps, date);
    const focusCard = cards.find(card => card.faculty === plan.focus) || cards[0];
    const reviews = plan.reviews.map(faculty => cards.find(card => card.faculty === faculty)).filter(Boolean);
    const workoutDone = Boolean(dayState(state, date).tasks.workout);
    const learningDone = Boolean(dayState(state, date).tasks.university || dayState(state, date).tasks[plan.focus]);
    const salesDone = Boolean(dayState(state, date).tasks.sales || dayState(state, date).tasks.elite_b2b_sales);
    const familyDone = Boolean(dayState(state, date).tasks.family);
    const reflectionDone = Boolean(dayState(state, date).tasks.night || dayState(state, date).review);
    const recoveryPercent = recovery.score === null ? 60 : Math.round(recovery.score * 10);
    const dataQuality = executiveDataQuality(state, today);
    const score = Math.round(
      sleepScore * 0.20 +
      recoveryPercent * 0.15 +
      (learningDone ? 100 : 45) * 0.15 +
      daily.percent * 0.15 +
      (workoutDone ? 100 : 55) * 0.10 +
      (familyDone ? 100 : 65) * 0.10 +
      (salesDone ? 100 : 60) * 0.10 +
      (reflectionDone ? 100 : 45) * 0.05
    );

    state.executive.scores[dateKey(date)] = {
      date: dateKey(date),
      score,
      sleepScore,
      recoveryScore: recoveryPercent,
      dailyProgress: daily.percent,
      updatedAt: new Date().toISOString()
    };

    const salesCustomers = salesPipelineForExecutive(state, today);
    const topCustomer = salesCustomers[0] || { name: "Today customer", status: "meeting today", preparationStatus: "review objective", priority: "high" };
    const finance = {
      portfolioGoal: state.executive.finance?.portfolioGoal || "10 Million Goal",
      targetAmount: Number(state.executive.finance?.targetAmount || 10000000),
      monthlyDcaTarget: Number(state.executive.finance?.monthlyDcaTarget || 0),
      monthlyDcaProgress: Number(state.executive.finance?.monthlyDcaProgress || 0),
      riskLevel: state.executive.finance?.riskLevel || "medium"
    };
    const dcaPercent = finance.monthlyDcaTarget ? Math.min(100, Math.round((finance.monthlyDcaProgress / finance.monthlyDcaTarget) * 100)) : 0;
    const financeRecommendation = finance.riskLevel === "high"
      ? "Review risk before adding exposure"
      : dcaPercent >= 100
        ? "Review portfolio allocation"
        : "Continue DCA review plan";
    const financeFact = `Risk level ${finance.riskLevel}; monthly DCA progress ${dcaPercent}%; target ${finance.targetAmount}.`;
    const financeAssumption = finance.monthlyDcaTarget
      ? "Assumption: DCA target is a planning input typed by the user, not live broker data."
      : "Assumption: monthly DCA target is missing, so review reminder is conservative.";

    const healthRecommendation = recovery.level === "poor"
      ? "Recovery / Rest"
      : recovery.level === "medium"
        ? "Zone2 + Mobility"
        : recovery.level === "high"
          ? "Strength"
          : "Mobility";

    const parts = {
      health: {
        recommendation: healthRecommendation,
        workout: today.workout,
        why: latest
          ? `Sleep score ${sleepScore}/100, recovery ${recovery.label}, latest sleep ${Math.round(Number(latest.total_sleep_minutes || 0) / 60 * 10) / 10}h.`
          : `No detailed sleep log today; using manual recovery inputs and conservative workout rule.`,
        confidence: capConfidence(latest ? "High" : "Medium", dataQuality, ["sleep", "workout"]),
        dataUsed: latest ? ["Sleep", "Recovery", "Workout History"] : ["Recovery", "Workout History"],
        estimatedTime: today.workout?.duration || "20–30 min"
      },
      learning: {
        focusFaculty: plan.focus,
        focusFacultyName: FACULTY_LABELS[plan.focus],
        reviewFaculties: plan.reviews,
        reviewFacultyNames: plan.reviews.map(faculty => FACULTY_LABELS[faculty]),
        lessonTitle: focusCard?.lesson?.title || "",
        currentDay: focusCard?.day || progressFor(state, plan.focus).day,
        estimatedMinutes: Number(today.availableMinutes || 25),
        why: `Rotation selected ${FACULTY_LABELS[plan.focus]} as focus; progress is Day ${focusCard?.day || 1}. Reviews keep two related faculties active without overloading the morning.`,
        confidence: capConfidence("High", dataQuality, ["learning"]),
        dataUsed: ["Learning Progress", "Roadmap Metadata", "Daily Focus"]
      },
      sales: {
        customers: salesCustomers,
        topCustomer,
        why: `${topCustomer.status} + ${topCustomer.priority || "medium"} priority creates the highest next-step leverage today.`,
        confidence: capConfidence("Medium", dataQuality, ["sales"]),
        dataUsed: ["Sales Pipeline", "Today Customer", "Meeting Notes"]
      },
      family: {
        morningMission: "School drop-off 06:00–06:45",
        eveningMission: "Pick up son / 15–20 minutes quality time",
        recommendation: "No screen while driving; protect calm transition and present evening time.",
        why: "Family routine is fixed and protects stress control, safety, and long-term consistency.",
        confidence: capConfidence("High", dataQuality, []),
        dataUsed: ["Schedule", "Family Routine"]
      },
      finance: {
        ...finance,
        monthlyDcaPercent: dcaPercent,
        recommendation: financeRecommendation,
        reviewOnly: true,
        fact: financeFact,
        assumption: financeAssumption,
        noteThai: "ไม่ใช่คำแนะนำทางการเงิน ระบบนี้เตือนให้ทบทวนเท่านั้น ไม่ได้บอกให้ซื้อหรือขาย",
        why: "Life OS tracks review discipline only. It never tells you to buy or sell; it flags whether DCA/risk needs review.",
        confidence: capConfidence("Medium", dataQuality, ["finance"]),
        dataUsed: ["Finance Settings", "Risk Level"]
      }
    };

    const radar = buildDecisionRadar(state, parts, date);
    const opportunities = buildOpportunityRadar(state, roadmaps, date);
    const priorities = buildExecutivePriorities(parts);
    const trend = executiveScoreTrend(state, date);
    const dueReviews = dueDecisionReviews(state, date);
    const similarDecision = state.executive.decisions
      .slice()
      .reverse()
      .find(decision => decision.reason || decision.result);

    return {
      title: "Morning Executive Brief",
      greeting: "Good Morning",
      score,
      confidence: dataQuality.confidence,
      dataQuality,
      trend,
      parts,
      priorities,
      radar,
      opportunities,
      reflectionQuestions: [
        "What went well?",
        "What should improve?",
        "What did you learn?"
      ],
      decisionMemory: {
        latest: state.executive.decisions.slice(-3).reverse(),
        dueReviews,
        similarDecisionNote: similarDecision ? `Last decision memory: ${similarDecision.title || "Untitled"} — review ${similarDecision.reviewDate || "later"}` : "No major decision memory yet."
      },
      explainability: {
        confidence: dataQuality.confidence === "Low" ? "Low" : radar.some(item => item.level === "orange" || item.level === "red") ? "Medium" : dataQuality.confidence,
        dataUsed: ["Sleep", "Recovery", "Learning Progress", "Tasks", "Workout History", "Family Routine", "Sales Pipeline", "Finance Settings", "Reflection"],
        missingData: dataQuality.missing.map(item => item.label)
      }
    };
  }

  function completionPercent(state) {
    const totalCompleted = TRACKS.reduce((sum, key) => sum + progressFor(state, key).completed, 0);
    return Math.round((totalCompleted / (365 * TRACKS.length)) * 100);
  }

  function updateStreaks(state, date = new Date()) {
    const key = dateKey(date);
    const score = dailyScore(state, date);
    if (score.percent < 100) return;
    if (state.streaks.lastFullCompleteDate === key) return;
    const yesterday = new Date(date);
    yesterday.setDate(date.getDate() - 1);
    const yesterdayKey = dateKey(yesterday);
    state.streaks.current = state.streaks.lastFullCompleteDate === yesterdayKey ? state.streaks.current + 1 : 1;
    state.streaks.longest = Math.max(state.streaks.longest, state.streaks.current);
    state.streaks.lastFullCompleteDate = key;
  }

  function notesFor(state, track, date = new Date()) {
    const key = `${dateKey(date)}:${track}`;
    state.notes[key] ||= { what: "", soWhat: "", nowWhat: "" };
    return state.notes[key];
  }

  function buildTeachMePrompt(state, roadmaps, date = new Date()) {
    const today = ensureToday(state, roadmaps, date);
    const plan = today.dailyFocus || dailyFocusPlan(date);
    const faculty = plan.focus;
    const lesson = lessonForToday(state, roadmaps, faculty, date);
    const reviewLessons = plan.reviews.map(reviewFaculty => ({ faculty: reviewFaculty, lesson: lessonForToday(state, roadmaps, reviewFaculty, date) }));
    const optionalList = plan.optional.map(optionalFaculty => `${FACULTY_ICONS[optionalFaculty]} ${FACULTY_LABELS[optionalFaculty]} (${optionalFaculty})`).join(", ");
    const recovery = recoveryStatus(state);
    const dayProgress = progressFor(state, faculty);
    const notes = notesFor(state, faculty, date);
    const goals = (state.university.goals || []).join(", ");
    const weakAreas = (state.university.weakAreas || []).join(", ") || "not enough data yet";
    const strongAreas = (state.university.strongAreas || []).join(", ") || "not enough data yet";
    const quizScore = state.university.quizScores?.[faculty] ?? "not recorded";
    const minutes = Number(today.availableMinutes || 45);
    const timePlan = TIME_PLANS[minutes] || TIME_PLANS[25];
    const previousCompletedDay = Math.max(0, ...(dayProgress.completedDays || []).filter(day => day < lesson.day));
    const previousSummary = previousCompletedDay
      ? `Day ${previousCompletedDay} completed on ${dayProgress.lastCompletedDate || "previous session"}. Continue from that roadmap position; Life OS stores progress metadata only, not lesson explanations.`
      : "No previous completed day recorded for this faculty yet.";

    return [
      "คุณคือ ChatGPT ในบทบาทอาจารย์มหาวิทยาลัย เพื่อน ที่ปรึกษา และโค้ชส่วนตัวของฉัน",
      "",
      "สอนฉันเป็นภาษาไทย",
      "ใช้ความรู้ล่าสุดที่มี",
      "หากข้อมูลมีโอกาสเปลี่ยนแปลง เช่น AI, Crypto, ข่าวเทคโนโลยี, งานวิจัยสุขภาพ หรือข้อมูลตลาด ให้ค้นหาข้อมูลล่าสุดก่อนสอน",
      "สอนบทเรียนวันนี้ต่อเนื่องจากเมื่อวาน แต่ไม่ใช้ข้อมูลเก่าที่ล้าสมัย หากเป็นเรื่อง AI, Crypto, Future Trends, งานวิจัยสุขภาพ หรือข้อมูลตลาด ให้ใช้ข้อมูลล่าสุดและค้นเว็บเมื่อจำเป็น",
      "ฉันกำลังฟังระหว่างเดินทางหรือขับรถ ใช้ภาษาง่าย เล่าเป็นเรื่อง และไม่ต้องให้ฉันดูกราฟหรืออ่านข้อความยาวระหว่างขับรถ",
      "วันนี้ช่วง 06:00–06:45 ฉันต้องขับรถไปส่งลูกชาย จึงต้องเป็นบทเรียนแบบฟังได้ ไม่ต้องดูจอ และใช้เวลาสั้นลงถ้าจำเป็น",
      "แยก fact, assumption, opinion ให้ชัดเจน",
      "",
      "โปรไฟล์ของฉัน:",
      "- ผู้ชาย เกิดปี 1986",
      "- Field Sales AE ขายหนังแท้/หนังเทียม B2B ระดับพรีเมียม",
      "- IF 16/8",
      "- มี Hepatitis B จึงต้องปกป้องการนอน การฟื้นตัวของตับ ความเครียด และออกกำลังแบบพอดี",
      "- ขับรถไปส่งลูกชาย 06:00–06:45 ทุกเช้า และไปรับลูกหลัง 16:00",
      `- เป้าหมายระยะยาว: ${goals}`,
      "",
      "แผน Life OS University วันนี้:",
      `- เวลาที่มี: ${minutes} นาที (${timePlan.label})`,
      `- Focus Faculty: ${FACULTY_ICONS[faculty]} ${FACULTY_LABELS[faculty]} (${faculty})`,
      `- Focus Lesson: Day ${lesson.day} - ${lesson.title}`,
      `- Previous Completed Day Summary: ${previousSummary}`,
      `- Focus Category: ${lesson.category}`,
      `- Focus Learning Goal: ${lesson.learningGoal}`,
      `- Focus Keywords: ${(lesson.keywords || []).join(", ")}`,
      `- Focus Recommended Source Types: ${(lesson.recommendedSourceTypes || []).join(", ")}`,
      `- Focus Time: ${timePlan.focus} นาที`,
      `- Review Faculty 1: ${FACULTY_ICONS[reviewLessons[0].faculty]} ${FACULTY_LABELS[reviewLessons[0].faculty]} (${reviewLessons[0].faculty}) | Day ${reviewLessons[0].lesson.day} - ${reviewLessons[0].lesson.title}`,
      `- Review Faculty 2: ${FACULTY_ICONS[reviewLessons[1].faculty]} ${FACULTY_LABELS[reviewLessons[1].faculty]} (${reviewLessons[1].faculty}) | Day ${reviewLessons[1].lesson.day} - ${reviewLessons[1].lesson.title}`,
      `- Optional Faculties: ${optionalList}`,
      `- ความคืบหน้า Focus: Day ${dayProgress.day}, completed ${dayProgress.completed}, skipped ${dayProgress.skipped}`,
      `- Recovery: ${recovery.label}${recovery.score ? ` (${recovery.score.toFixed(1)}/10)` : ""}`,
      `- จุดอ่อน: ${weakAreas}`,
      `- จุดแข็ง: ${strongAreas}`,
      `- Quiz score ล่าสุด: ${quizScore}`,
      `- Notes จาก Life OS: What=${notes.what || "blank"} | So What=${notes.soWhat || "blank"} | Now What=${notes.nowWhat || "blank"}`,
      "",
      "ข้อสำคัญเกี่ยวกับแหล่งข้อมูล:",
      "- Roadmap นี้เป็น learning path ไม่ใช่ source of truth",
      "- ห้ามถือว่า lesson metadata เป็นคำอธิบายบทเรียน ให้ใช้เป็นหัวข้อและทิศทางเท่านั้น",
      "- เนื้อหาบทเรียนต้องสร้างสดตอนนี้จากความรู้ของคุณ และค้นเว็บเมื่อข้อมูล current matters",
      "- สำหรับ AI, Crypto, Longevity, Future Trends และหัวข้อเกี่ยวกับตลาด ให้ใช้ความรู้ล่าสุดและค้นเว็บเมื่อข้อมูลอาจเปลี่ยน",
      "- สำหรับ Crypto ให้ prefer: official project blogs, GitHub, developer updates, official documentation, official announcements",
      "- สำหรับ Longevity/Health ให้ prefer: medical guidelines, peer-reviewed research, reputable health institutions และแยก general education ออกจาก medical advice ให้ชัดเจน",
      "- ถ้ามีความไม่แน่นอน ให้บอกระดับความมั่นใจและแหล่งข้อมูลที่ควรตรวจต่อ",
      "",
      "วิธีสอน:",
      "- สอน Focus lesson เป็นหลัก",
      "- Review lesson 1 และ Review lesson 2 แบบสั้น กระชับ",
      "- ถ้าเวลามี 15 นาที ให้สอนเฉพาะ Focus ไม่ต้อง review",
      "- ถ้าเวลามี 20–25 นาที ให้ใช้ short mode: ฟังได้, ไม่ต้องดูจอ, one practical action เท่านั้น",
      "- ถ้าเวลามี 30 นาที ให้สอน Focus และ Review 1 แบบสั้น",
      "- ถ้าเวลามี 45 นาที ให้สอน Focus และ Review ทั้ง 2 แบบสั้น",
      "- ถ้าเวลามี 60 นาที ให้เพิ่ม action planning 10 นาทีท้าย",
      "- เชื่อมโยงกับงาน AE ขายหนังแท้/หนังเทียม B2B, สุขภาพ, การลงทุน, ครอบครัว และเป้าหมายระยะยาวของฉัน",
      "",
      "จบบทเรียนด้วย:",
      "1. สิ่งที่ต้องทำวันนี้",
      "2. สรุป 5 บรรทัด",
      "3. Preview บทเรียนพรุ่งนี้"
    ].join("\n");
  }

  function buildDriveLessonPrompt(state, roadmaps, date = new Date()) {
    const today = ensureToday(state, roadmaps, date);
    today.availableMinutes = 25;
    return [
      buildTeachMePrompt(state, roadmaps, date),
      "",
      "โหมดพิเศษ: Drive Lesson",
      "- ทำเป็นบทเรียนเสียง 30-40 นาที",
      "- สมมติว่าฉันกำลังขับรถ",
      "- ห้ามให้ดู chart, table, dashboard หรืออ่านข้อความยาวระหว่างขับรถ",
      "- ใช้จังหวะการเล่าแบบฟังง่าย",
      "- จบด้วย action หลังจอดรถที่ปลอดภัยและทำได้ทันที"
    ].join("\n");
  }

  window.LifeOSEngine = {
    FACULTIES,
    LEGACY_FACULTY_MAP,
    FACULTY_LABELS,
    FACULTY_ICONS,
    TIME_PLANS,
    TRACKS,
    REQUIRED_TASKS,
    schedule,
    dateKey,
    getCurrentBlock,
    getNextBlock,
    getNextThirty,
    countdownToNext,
    dayState,
    normalizeFacultyId,
    progressFor,
    facultyForDate,
    dailyFocusPlan,
    facultyCardsForToday,
    lessonForToday,
    ensureToday,
    generateToday,
    updateWorkout,
    recoveryScore,
    recoveryStatus,
    completeTrack,
    skipTrack,
    repairProgress,
    buildExecutiveBrief,
    toggleTask,
    dailyScore,
    weeklyScore,
    completionPercent,
    notesFor,
    buildTeachMePrompt,
    buildDriveLessonPrompt
  };
})();
