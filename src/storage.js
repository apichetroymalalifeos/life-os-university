// Storage adapter for Life OS.
// Today it uses localStorage only. The app talks to this adapter instead of
// localStorage directly so SQLite, Supabase, or a local API can replace it later.
(function () {
  const STATE_KEY = "life-os-2-state";
  const LEGACY_FACULTY_MAP = {
    ai: "ai_automation",
    crypto: "crypto_macro",
    longevity: "longevity_health",
    sales: "elite_b2b_sales",
    psychology: "psychology_decision",
    future: "future_trends"
  };

  const defaultState = {
    version: "6.1",
    generatedDate: null,
    sleep: { hours: "", deep: "", rem: "", wakes: "" },
    sleepLogs: [],
    progress: {
      ai_automation: createProgress(),
      crypto_macro: createProgress(),
      longevity_health: createProgress(),
      elite_b2b_sales: createProgress(),
      psychology_decision: createProgress(),
      future_trends: createProgress(),
      workout: createProgress()
    },
    university: {
      currentFaculty: "ai_automation",
      weakAreas: [],
      strongAreas: [],
      goals: ["Health", "AI", "Financial Freedom", "Family"],
      quizScores: {},
      history: []
    },
    days: {},
    notes: {},
    settings: { workoutOverride: "auto", language: "en", notificationsEnabled: false, sleepFormOpen: false, progressSchemaVersion: 2 },
    streaks: { current: 0, longest: 0, lastFullCompleteDate: null }
  };

  function createProgress() {
    return {
      day: 1,
      currentDay: 1,
      completed: 0,
      skipped: 0,
      completedDays: [],
      skippedDays: [],
      lastCompletedDate: null,
      streak: 0,
      bestStreak: 0
    };
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function mergeDefaults(raw) {
    const state = Object.assign(clone(defaultState), raw || {});
    state.sleep = Object.assign(clone(defaultState.sleep), state.sleep || {});
    state.sleepLogs = Array.isArray(state.sleepLogs) && state.sleepLogs.length
      ? state.sleepLogs
      : clone(window.LifeOSSleep?.SAMPLE_LOGS || []);
    state.progress = Object.assign(clone(defaultState.progress), state.progress || {});
    Object.entries(LEGACY_FACULTY_MAP).forEach(([legacy, current]) => {
      if (state.progress[legacy] && !state.progress[current]) {
        state.progress[current] = clone(state.progress[legacy]);
      }
    });
    Object.keys(defaultState.progress).forEach(key => {
      state.progress[key] = normalizeProgress(Object.assign(clone(defaultState.progress[key]), state.progress[key] || {}));
    });
    Object.values(state.days || {}).forEach(day => {
      if (!day.lessonRefs) return;
      Object.entries(LEGACY_FACULTY_MAP).forEach(([legacy, current]) => {
        if (day.lessonRefs[legacy] && !day.lessonRefs[current]) {
          day.lessonRefs[current] = { track: current, day: day.lessonRefs[legacy].day };
        }
      });
      if (day.currentFaculty) day.currentFaculty = LEGACY_FACULTY_MAP[day.currentFaculty] || day.currentFaculty;
      if (day.dailyFocus) {
        day.dailyFocus.focus = LEGACY_FACULTY_MAP[day.dailyFocus.focus] || day.dailyFocus.focus;
        day.dailyFocus.reviews = (day.dailyFocus.reviews || []).map(id => LEGACY_FACULTY_MAP[id] || id);
        day.dailyFocus.optional = (day.dailyFocus.optional || []).map(id => LEGACY_FACULTY_MAP[id] || id);
        day.dailyFocus.all = (day.dailyFocus.all || []).map(id => LEGACY_FACULTY_MAP[id] || id);
      }
    });
    state.days = state.days || {};
    state.notes = state.notes || {};
    state.university = Object.assign(clone(defaultState.university), state.university || {});
    state.university.weakAreas ||= [];
    state.university.strongAreas ||= [];
    state.university.goals ||= clone(defaultState.university.goals);
    state.university.quizScores ||= {};
    state.university.history ||= [];
    state.university.currentFaculty = LEGACY_FACULTY_MAP[state.university.currentFaculty] || state.university.currentFaculty || "ai_automation";
    state.settings = Object.assign(clone(defaultState.settings), state.settings || {});
    state.streaks = Object.assign(clone(defaultState.streaks), state.streaks || {});
    state.version = "6.1";
    return state;
  }

  function normalizeProgress(progress) {
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

  function load() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STATE_KEY));
      if (parsed && !parsed.progressBackupCreated) {
        localStorage.setItem(`lifeOS_progress_backup_${Date.now()}`, JSON.stringify(parsed.progress || {}));
        parsed.progressBackupCreated = true;
      }
      return mergeDefaults(parsed);
    } catch {
      return mergeDefaults();
    }
  }

  function save(state) {
    localStorage.setItem(STATE_KEY, JSON.stringify(state));
  }

  function exportJson(state) {
    return JSON.stringify(state, null, 2);
  }

  function importJson(json) {
    return mergeDefaults(JSON.parse(json));
  }

  window.LifeOSStorage = {
    STATE_KEY,
    defaultState,
    load,
    save,
    exportJson,
    importJson
  };
})();
