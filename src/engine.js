// Life OS decision engine.
// This file owns scheduling, roadmap advancement, recovery logic, streaks,
// and progress calculations. Rendering lives in app.js.
(function () {
  const FACULTIES = ["ai", "crypto", "longevity", "sales", "psychology", "future"];
  const TRACKS = [...FACULTIES, "workout"];
  const REQUIRED_TASKS = ["university", "sales", "workout", "family", "morning", "night"];
  const FACULTY_ROTATION = {
    0: "future",
    1: "ai",
    2: "longevity",
    3: "crypto",
    4: "psychology",
    5: "sales",
    6: "crypto"
  };
  const FACULTY_LABELS = {
    ai: "AI & Automation",
    crypto: "Crypto & Macro Investing",
    longevity: "Longevity",
    sales: "Elite B2B Sales",
    psychology: "Psychology & Decision Making",
    future: "Future Trends"
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

  function getLesson(roadmaps, track, day) {
    const lessons = roadmaps[track].lessons;
    return lessons[Math.max(0, Math.min(lessons.length - 1, day - 1))];
  }

  function lessonForToday(state, roadmaps, track, date = new Date()) {
    const today = dayState(state, date);
    const ref = today.lessonRefs?.[track] || { track, day: state.progress[track].day };
    return getLesson(roadmaps, track, ref.day);
  }

  function facultyForDate(date = new Date()) {
    return FACULTY_ROTATION[date.getDay()] || "ai";
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
    const faculty = facultyForDate(date);
    today.generatedAt = new Date().toISOString();
    today.customer = customer;
    today.currentFaculty = faculty;
    state.university.currentFaculty = faculty;
    today.lessonRefs ||= {};

    FACULTIES.forEach(track => {
      today.lessonRefs[track] = { track, day: state.progress[track].day };
    });
    today.lessonRefs.workout = { track: "workout", day: state.progress.workout.day };

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
    const today = dayState(state, date);
    today.tasks[track] = true;
    if (TRACKS.includes(track) && !today.advanced?.[track]) {
      today.advanced ||= {};
      today.advanced[track] = true;
      const completedLessonDay = today.lessonRefs?.[track]?.day || state.progress[track].day;
      state.progress[track].completed += 1;
      state.progress[track].day = Math.min(365, completedLessonDay + 1);
      if (FACULTIES.includes(track)) {
        state.university.history.push({ date: dateKey(date), faculty: track, day: completedLessonDay, completed: true });
      }
    }
    updateStreaks(state, date);
  }

  function skipTrack(state, track, date = new Date()) {
    const today = dayState(state, date);
    today.skips[track] = true;
    today.tasks[track] = false;
    if (TRACKS.includes(track)) state.progress[track].skipped += 1;
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
    const totalCompleted = TRACKS.reduce((sum, key) => sum + state.progress[key].completed, 0);
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
    const faculty = today.currentFaculty || state.university.currentFaculty || facultyForDate(date);
    const lesson = lessonForToday(state, roadmaps, faculty, date);
    const recovery = recoveryStatus(state);
    const dayProgress = state.progress[faculty];
    const notes = notesFor(state, faculty, date);
    const goals = (state.university.goals || []).join(", ");
    const weakAreas = (state.university.weakAreas || []).join(", ") || "not enough data yet";
    const strongAreas = (state.university.strongAreas || []).join(", ") || "not enough data yet";
    const quizScore = state.university.quizScores?.[faculty] ?? "not recorded";

    return [
      "You are ChatGPT acting as my university professor, friend, mentor, and coach.",
      "",
      "Teach me in Thai.",
      "Use the latest available knowledge. Use web search when current information matters.",
      "Separate facts from opinions. For crypto, prefer official project blogs, GitHub, developer updates, and official documentation.",
      "",
      "My profile:",
      "- Male, born 1986",
      "- Premium leather B2B field sales AE",
      "- IF 16/8",
      "- Hepatitis B under treatment, so protect sleep, liver recovery, stress control, and moderate exercise",
      "- Drives every day and picks up my son around 18:00",
      `- Long-term goals: ${goals}`,
      "",
      "Today from Life OS:",
      `- Faculty: ${FACULTY_LABELS[faculty]}`,
      `- Lesson reference: Day ${lesson.day} - ${lesson.title}`,
      "- Target teaching time: 30-40 minutes",
      `- Minimum available time today: ${lesson.estimatedMinutes || 30} minutes`,
      `- Current progress: Day ${dayProgress.day}, completed ${dayProgress.completed}, skipped ${dayProgress.skipped}`,
      `- Recovery status: ${recovery.label}${recovery.score ? ` (${recovery.score.toFixed(1)}/10)` : ""}`,
      `- Weak areas: ${weakAreas}`,
      `- Strong areas: ${strongAreas}`,
      `- Latest quiz score: ${quizScore}`,
      `- Notes from Life OS: What=${notes.what || "blank"} | So What=${notes.soWhat || "blank"} | Now What=${notes.nowWhat || "blank"}`,
      "",
      "Teaching style:",
      "- Teach like a university professor.",
      "- Explain like a friend.",
      "- Use stories, analogies, and real-life examples.",
      "- Connect the lesson to health, sales, investing, family, and daily life.",
      "- Assume I may be driving, so make it easy to follow by voice.",
      "",
      "End with exactly these sections:",
      "1. Today's Action",
      "2. Today's Summary",
      "3. Tomorrow Preview"
    ].join("\n");
  }

  window.LifeOSEngine = {
    FACULTIES,
    FACULTY_LABELS,
    TRACKS,
    REQUIRED_TASKS,
    schedule,
    dateKey,
    getCurrentBlock,
    getNextBlock,
    getNextThirty,
    countdownToNext,
    dayState,
    facultyForDate,
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
    buildTeachMePrompt
  };
})();
