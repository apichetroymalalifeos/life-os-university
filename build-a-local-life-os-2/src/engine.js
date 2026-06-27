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
    30: { focus: 25, reviews: [5], action: 0, label: "Focus + one review" },
    45: { focus: 35, reviews: [5, 5], action: 0, label: "Focus + two reviews" },
    60: { focus: 40, reviews: [5, 5], action: 10, label: "Deep focus + reviews + action plan" }
  };

  const schedule = [
    { start: "06:00", end: "07:30", id: "morning", title: "Morning Reset", mission: "Drink water, get sunlight, stretch, meditate.", detail: "Water, sunlight, stretching, meditation." },
    { start: "07:30", end: "08:00", id: "university", title: "Life OS University", mission: "Generate the Teach Me prompt and learn with ChatGPT.", detail: "Life OS remembers progress. ChatGPT teaches." },
    { start: "08:00", end: "08:30", id: "workPrep", title: "Work Prep", mission: "Prepare route, samples, and first customer objective.", detail: "Transition from learning into field execution." },
    { start: "08:30", end: "09:50", id: "work", title: "Work Start", mission: "Plan route and customer outcomes.", detail: "Review accounts, samples, and follow-up commitments." },
    { start: "09:50", end: "10:00", id: "breathing", title: "Pre-customer Breathing", mission: "Two minutes of calm before the first visit.", detail: "Lower stress before customer-facing work." },
    { start: "10:00", end: "12:00", id: "visits", title: "Customer Visits", mission: "Visit customers and capture pain points.", detail: "Use driving time for learning audio." },
    { start: "12:00", end: "13:00", id: "meal", title: "First Meal", mission: "Open eating window with a clean meal.", detail: "Protein, fiber, clean carbs, hydrate." },
    { start: "13:00", end: "13:15", id: "walk", title: "Glucose Walk", mission: "Walk 10-15 minutes.", detail: "Support glucose control, stress, and digestion." },
    { start: "13:15", end: "16:00", id: "visits2", title: "Customer Visits", mission: "Finish visits and define next steps.", detail: "Second and third visits. Record notes." },
    { start: "16:00", end: "17:00", id: "familyPickup", title: "Pickup Transition", mission: "Pick up son and close work loops.", detail: "Shift from sales mode to family mode." },
    { start: "17:00", end: "17:30", id: "workout", title: "Workout", mission: "Train according to recovery.", detail: "Move while waiting for futsal training." },
    { start: "17:30", end: "18:15", id: "learning", title: "Rotating Learning Block", mission: "Continue today's faculty if energy allows.", detail: "Weekday faculty rotation for AI, crypto, longevity, sales, psychology, and future trends." },
    { start: "18:15", end: "19:00", id: "dinner", title: "Dinner", mission: "Eat dinner and close eating window.", detail: "Family presence. No grazing after 19:00." },
    { start: "19:00", end: "20:00", id: "family", title: "Family Mission", mission: "Spend intentional time together.", detail: "Be present and reduce phone use." },
    { start: "20:00", end: "20:30", id: "reflection", title: "Reflection / Learning", mission: "Review notes, quiz score, and tomorrow preview.", detail: "Life OS stores memory. ChatGPT handles explanation." },
    { start: "20:30", end: "22:00", id: "night", title: "Wind-down", mission: "Run night review and protect sleep.", detail: "Low light, prepare tomorrow, no hard stimulation." },
    { start: "22:00", end: "06:00", id: "sleep", title: "Sleep", mission: "Sleep. This is the main recovery block.", detail: "Protect recovery, liver health, hormones, and longevity." }
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
    state.progress[id] ||= { day: state.progress[track]?.day || 1, completed: state.progress[track]?.completed || 0, skipped: state.progress[track]?.skipped || 0 };
    return state.progress[id];
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
    today.availableMinutes ||= 45;
    state.university.currentFaculty = faculty;
    today.lessonRefs ||= {};

    FACULTIES.forEach(track => {
      today.lessonRefs[track] = { track, day: progressFor(state, track).day };
    });
    today.lessonRefs.workout = { track: "workout", day: progressFor(state, "workout").day };

    today.workout = workoutPlan(lessonForToday(state, roadmaps, "workout", date), recovery);
    today.familyMission = {
      title: "Present pickup and 20-minute connection",
      goal: "Pick up your son, support futsal, then give him focused attention without multitasking.",
      task: "Ask one good question about training and listen without checking the phone."
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
    today.availableMinutes ||= 45;
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
      progressFor(state, track).completed += 1;
      progressFor(state, track).day = Math.min(365, completedLessonDay + 1);
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
    if (TRACKS.includes(track)) progressFor(state, track).skipped += 1;
    updateStreaks(state, date);
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
    const timePlan = TIME_PLANS[minutes] || TIME_PLANS[45];

    return [
      "คุณคือ ChatGPT ในบทบาทอาจารย์มหาวิทยาลัย เพื่อน ที่ปรึกษา และโค้ชส่วนตัวของฉัน",
      "",
      "สอนฉันเป็นภาษาไทย",
      "ใช้ความรู้ล่าสุดที่มี",
      "หากข้อมูลมีโอกาสเปลี่ยนแปลง เช่น AI, Crypto, ข่าวเทคโนโลยี, งานวิจัยสุขภาพ หรือข้อมูลตลาด ให้ค้นหาข้อมูลล่าสุดก่อนสอน",
      "ฉันกำลังฟังระหว่างเดินทางหรือขับรถ ใช้ภาษาง่าย เล่าเป็นเรื่อง และไม่ต้องให้ฉันดูกราฟหรืออ่านข้อความยาวระหว่างขับรถ",
      "แยก fact, assumption, opinion ให้ชัดเจน",
      "",
      "โปรไฟล์ของฉัน:",
      "- ผู้ชาย เกิดปี 1986",
      "- Field Sales AE ขายหนังแท้/หนังเทียม B2B ระดับพรีเมียม",
      "- IF 16/8",
      "- มี Hepatitis B จึงต้องปกป้องการนอน การฟื้นตัวของตับ ความเครียด และออกกำลังแบบพอดี",
      "- ขับรถทุกวันและไปรับลูกหลัง 16:00",
      `- เป้าหมายระยะยาว: ${goals}`,
      "",
      "แผน Life OS University วันนี้:",
      `- เวลาที่มี: ${minutes} นาที (${timePlan.label})`,
      `- Focus Faculty: ${FACULTY_ICONS[faculty]} ${FACULTY_LABELS[faculty]} (${faculty})`,
      `- Focus Lesson: Day ${lesson.day} - ${lesson.title}`,
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
    today.availableMinutes = 45;
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
    toggleTask,
    dailyScore,
    weeklyScore,
    completionPercent,
    notesFor,
    buildTeachMePrompt,
    buildDriveLessonPrompt
  };
})();
